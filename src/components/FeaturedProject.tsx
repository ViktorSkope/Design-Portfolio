import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoverBackground, getProjectBySlug, type Project } from "../data/projects";
import { arriveHome, beginExpand, handOffScrub, peekCollapseSlug, prefersReducedMotion } from "../lib/pageTransition";
import { createScrubCard, drawScrubCard, easeScrub, projectLayout } from "../lib/scrubTransition";
import CaseStudyIntro from "./CaseStudyIntro";
import { DARK_TONES } from "../lib/darkTones";
import { inWorkGroup, onWorkFilter, setWorkFilter, WORK_GROUPS, type WorkGroup } from "../lib/workFilter";

export interface FeaturedItem {
  slug: string;
  title?: string;
}

interface FeaturedProjectProps {
  items: FeaturedItem[];
}

interface Slide {
  project: Project;
  title?: string;
}

// Placement of each piece by its distance from the centre, as a fraction of the
// centre card's width. Pieces fan out behind the centre card, rotated toward
// the viewer and growing slightly toward the edges like the walls of a tunnel.
const PLACEMENT = [
  { x: 0, scale: 1, rotate: 0 },
  { x: 0.6, scale: 0.6, rotate: 34 },
  { x: 0.9, scale: 0.68, rotate: 40 },
  { x: 1.16, scale: 0.78, rotate: 46 },
];
// Phones show one neighbour per side, peeking in from the edges, so the pieces
// can be much larger; the rest wait off-screen and arrive as you scroll sideways
const PLACEMENT_COMPACT = [
  { x: 0, scale: 1, rotate: 0 },
  { x: 0.74, scale: 0.82, rotate: 28 },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Only the central part of the selected image reacts to the pointer (and opens
// the project); the rest lets the neighbouring pieces be reached
const HIT_INSET = 10; // percent trimmed from each side, leaving 80%
// Hovering the selected image enlarges it a little and tilts it toward the cursor
const TILT_SCALE = 1.04;
const TILT_MAX_X = 7; // degrees
const TILT_MAX_Y = 9;

// How strongly projects outside the filter are washed out
const OUTSIDE_WASH = 0.55;

// Regrouping the carousel: how long the pieces take to fade out (and back in)
const VEIL_MS = 300;

// How much of the case study's opening shows under the carousel before reading on
const INTRO_TEASER = 230;
// Space above the teaser, and between it and the "scroll to read" line
const INTRO_GAP = 32;
const MORE_GAP = 8;

// Covers are exported at 1920 x 1314
const ASPECT = 1920 / 1314;

// Signed shortest distance from the active slide, so the ring wraps around
function circularOffset(index: number, active: number, count: number) {
  let d = (index - active) % count;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

// Wraps a piece so the selected one can lean toward the cursor like a physical
// card. The outer layer catches the pointer and never moves, so tilting cannot
// shift the hover area under the cursor.
function TiltLayer({ active, children }: { active: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLSpanElement>(null);

  const reset = useCallback((duration = 500) => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    el.style.transform = "";
  }, []);

  // A piece that stops being the selected one settles back flat
  useEffect(() => {
    if (!active) reset(300);
  }, [active, reset]);

  const lean = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = innerRef.current;
    if (!active || !el || e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 left … 1 right
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 top … 1 bottom
    el.style.transition = "transform 140ms ease-out";
    // The surface turns to face the cursor
    el.style.transform = `perspective(1000px) rotateX(${(-ny * TILT_MAX_X).toFixed(2)}deg) rotateY(${(nx * TILT_MAX_Y).toFixed(2)}deg) scale(${TILT_SCALE})`;
  };

  // The hit area is the central 80%; the visual layer is sized back up to the
  // whole piece (a negative inset of 10 / 80 = 12.5% of the hit area).
  const bleed = `${-(HIT_INSET / (100 - 2 * HIT_INSET)) * 100}%`;

  return (
    <>
      <span
        className={`absolute block ${active ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
        style={{ inset: `${HIT_INSET}%` }}
        onPointerEnter={lean}
        onPointerMove={lean}
        onPointerLeave={() => reset()}
      >
        <span
          ref={innerRef}
          data-tilt
          className="pointer-events-none absolute block will-change-transform motion-reduce:!transition-none"
          style={{ inset: bleed }}
        >
          {children}
        </span>
      </span>
    </>
  );
}

// A project's results, set apart so they are read first
function Impact({ text }: { text: string }) {
  return (
    <span className="inline-flex items-start gap-1.5 text-[13px] font-medium leading-snug text-(--impact)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[2px] shrink-0">
        <path d="M4 16l5-5 4 4 7-7M14 8h6v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text}
    </span>
  );
}

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const left = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? "Previous project" : "Next project"}
      style={{ top: 12, height: `calc(var(--cw) / ${ASPECT})` }}
      className={`group/arrow absolute z-30 flex w-[calc((100%-var(--cw))/2)] items-center cursor-pointer focus-visible:outline-none ${
        left ? "left-0 justify-center" : "right-0 justify-center"
      }`}
    >
      <span className="flex max-md:hidden h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_24px_rgba(0,0,0,0.18)] opacity-0 scale-90 transition-all duration-200 group-hover/arrow:opacity-100 group-hover/arrow:scale-100 group-focus-visible/arrow:opacity-100 group-focus-visible/arrow:scale-100 [@media(hover:none)]:opacity-90 [@media(hover:none)]:scale-100">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d={left ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export default function FeaturedProject({ items }: FeaturedProjectProps) {
  const slides: Slide[] = items.flatMap((item) => {
    const project = getProjectBySlug(item.slug);
    return project ? [{ project, title: item.title }] : [];
  });
  const count = slides.length;
  const slugs = slides.map((slide) => slide.project.slug).join(",");

  // A hero word can bring one group of projects forward. While it does, the group
  // sits together around the centre of the ring and everything else follows it.
  const [filter, setFilter] = useState<WorkGroup | null>(null);
  const inFilter = (slug: string) => !filter || inWorkGroup(filter, slug);
  const ordered = filter
    ? [...slides.filter((s) => inFilter(s.project.slug)), ...slides.filter((s) => !inFilter(s.project.slug))]
    : slides;

  // Coming back from a project, start with that project highlighted
  const [activeSlug, setActiveSlug] = useState(() => {
    const returning = peekCollapseSlug();
    return returning && slides.some((s) => s.project.slug === returning) ? returning : (slides[0]?.project.slug ?? "");
  });
  const active = Math.max(
    0,
    ordered.findIndex((s) => s.project.slug === activeSlug),
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const centreRef = useRef<HTMLAnchorElement>(null);

  // The scroll-driven card between this page and the selected project, while it is out
  const scrubRef = useRef<{ slug: string; card: HTMLElement } | null>(null);
  // Whether reaching the end of the runway may open the project. Kept in a ref so
  // it survives effects re-running (React runs them twice in development).
  const armedRef = useRef(true);

  // The cover from the project page lands on the highlighted card
  useLayoutEffect(() => {
    arriveHome(centreRef.current, document.getElementById("home-page"));
  }, []);
  const compact = useMediaQuery("(max-width: 767px)");
  const placements = compact ? PLACEMENT_COMPACT : PLACEMENT;
  const visible = placements.length - 1;

  // Moving onto a project outside the filter means the visitor wants to look
  // further, so the filter steps aside and every project is shown again
  const select = (slug: string) => {
    if (filter && !inWorkGroup(filter, slug)) setWorkFilter(null);
    setActiveSlug(slug);
  };
  const step = (direction: number) => select(ordered[(active + direction + count) % count].project.slug);
  // Listeners registered once call whatever `step` is current
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

  // Regrouping (a filter coming or going) would send pieces sliding across each
  // other. Instead they fade out, move while unseen, and fade back in at their
  // new places. "sides" keeps the selected piece in view; "all" hides it too.
  const [veil, setVeil] = useState<"none" | "sides" | "all">("none");
  const [instant, setInstant] = useState(false);
  const regroupTimers = useRef<number[]>([]);
  const regroup = useCallback((hide: "sides" | "all", apply: () => void) => {
    regroupTimers.current.forEach((timer) => window.clearTimeout(timer));
    setVeil(hide);
    regroupTimers.current = [
      window.setTimeout(() => {
        setInstant(true);
        apply();
      }, VEIL_MS),
      // Once the pieces have been drawn in their new places, let them fade back in
      window.setTimeout(() => {
        setInstant(false);
        setVeil("none");
      }, VEIL_MS + 60),
    ];
  }, []);
  useEffect(() => () => regroupTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  // A hero word was clicked: centre its group, or show everything again
  useEffect(() => {
    const list = slugs.split(",");
    return onWorkFilter((group) => {
      if (!group) {
        regroup("sides", () => setFilter(null));
        return;
      }
      const members = list.filter((slug) => inWorkGroup(group, slug));
      regroup("all", () => {
        setFilter(group);
        if (members.length) setActiveSlug(members[Math.floor((members.length - 1) / 2)]);
      });
    });
  }, [slugs, regroup]);

  // Sideways scrolling (trackpads, shift + wheel) moves the ring one piece at a
  // time. Vertical scrolling is left alone so the page still scrolls normally.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let accumulated = 0;
    let coolingDown = false;
    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX || (e.shiftKey ? e.deltaY : 0);
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return;
      e.preventDefault();
      if (coolingDown) return;
      accumulated += dx;
      if (Math.abs(accumulated) > 40) {
        stepRef.current(accumulated > 0 ? 1 : -1);
        accumulated = 0;
        coolingDown = true;
        setTimeout(() => (coolingDown = false), 380);
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  // Swipe or drag to move
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
    dragged.current = false;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 40) {
      dragged.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  // Opening a project: its card grows into the project page's cover
  const openProject = (project: Project) => {
    const centre = centreRef.current;
    if (centre) {
      // Hand over the card exactly as it looks now, hover tilt included
      const tilt = centre.querySelector<HTMLElement>("[data-tilt]");
      beginExpand(
        project.slug,
        centre.getBoundingClientRect(),
        project.carouselImage ?? project.coverImage,
        getCoverBackground(project),
        tilt ? getComputedStyle(tilt).transform : "none",
        document.getElementById("home-page"),
      );
    }
    navigate(`/work/${project.slug}`);
  };

  // Scrolling on from the carousel reads on into the case study. The opening of
  // the selected project's case study sits under the carousel and scrolls like any
  // text, while the carousel stays pinned and the selected card grows into the
  // cover that sits above that text on the project page. The project page then
  // takes over with its cover and text exactly where they were.
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLSpanElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const reduceMotion = prefersReducedMotion();
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pinned = pinnedRef.current;
    const project = slides.find((slide) => slide.project.slug === activeSlug)?.project;
    if (!section || !pinned || !project || reduceMotion) return;

    // A card left over from another project is no use for this one
    if (scrubRef.current && scrubRef.current.slug !== project.slug) {
      scrubRef.current.card.remove();
      scrubRef.current = null;
    }
    let frame = 0;

    const fadeOut = (el: HTMLElement | null, amount: number, rise = 0) => {
      if (!el) return;
      el.style.opacity = amount ? `${1 - amount}` : "";
      el.style.transform = amount && rise ? `translateY(${amount * rise}px)` : "";
      el.style.pointerEvents = amount > 0.5 ? "none" : "";
    };

    // The opening text, clipped to a teaser until the visitor starts reading on
    const openText = (amount: number) => {
      const intro = introRef.current;
      if (!intro) return;
      if (amount >= 1) {
        intro.style.maxHeight = "none";
        intro.style.webkitMaskImage = intro.style.maskImage = "none";
        return;
      }
      intro.style.maxHeight = `${INTRO_TEASER + (intro.scrollHeight - INTRO_TEASER) * amount}px`;
      const solid = 35 + 65 * amount;
      intro.style.webkitMaskImage = intro.style.maskImage = `linear-gradient(to bottom, #000 ${solid}%, transparent 100%)`;
    };

    // Every piece's own image, in case one was hidden behind the card while selected
    const showPieces = () =>
      stageRef.current?.querySelectorAll<HTMLElement>("[data-tilt] > img:first-child").forEach((img) => {
        img.style.visibility = "";
      });

    // Set when the selection changes: a frame already on its way must not draw for it
    let stale = false;

    const update = () => {
      frame = 0;
      if (stale) return;
      const runway = runwayRef.current?.offsetHeight ?? 0;
      const intro = introRef.current;
      // Pin the carousel when it and the teaser below it are both on screen
      // Height of the carousel and the teaser under it, as they are at rest. Added up
      // from parts that never change while scrolling (fades only move things visually,
      // and the teaser is clipped to a fixed height), so the pin point never jumps.
      const peek = runwayRef.current?.previousElementSibling as HTMLElement | null;
      const restingStack =
        pinned.offsetHeight +
        (peek ? parseFloat(getComputedStyle(peek).marginTop) || 0 : 0) +
        (summaryRef.current?.offsetHeight ?? 0) +
        INTRO_GAP +
        INTRO_TEASER +
        (moreRef.current ? moreRef.current.offsetHeight + MORE_GAP : 0);
      const pinTop = window.innerHeight - restingStack;
      pinned.style.top = `${pinTop}px`;
      const raw = runway > 0 ? (pinTop - section.getBoundingClientRect().top) / runway : 0;
      // Sub-pixel scroll positions can stop just short of either end; that is the end.
      // At the start this also keeps a rounding error from setting the card loose.
      const progress = raw >= 0.995 ? 1 : raw <= 0.01 ? 0 : Math.min(1, raw);
      const centre = centreRef.current;
      const centreImage = centre?.querySelector<HTMLElement>("img");

      if (progress <= 0 || !centre) {
        scrubRef.current?.card.remove();
        scrubRef.current = null;
        showPieces();
        fadeOut(stageRef.current, 0);
        fadeOut(hintRef.current, 0);
        fadeOut(summaryRef.current, 0);
        fadeOut(moreRef.current, 0);
        openText(0);
        armedRef.current = true;
        return;
      }

      // A card for a project that is no longer selected is of no use here
      if (scrubRef.current && scrubRef.current.slug !== project.slug) {
        scrubRef.current.card.remove();
        scrubRef.current = null;
      }
      if (!scrubRef.current) {
        const card = createScrubCard(project);
        document.body.appendChild(card);
        scrubRef.current = { slug: project.slug, card };
      }
      const { card } = scrubRef.current;
      // The text moves with the scroll; where it will be at the end of the runway
      // says how far down the project page will be scrolled, and so where its cover is
      const layout = projectLayout();
      const introNow = intro ? intro.getBoundingClientRect().top : layout.introTop;
      const projectScroll = layout.introTop - (introNow - runway * (1 - progress));
      const cover = { ...layout.cover, top: layout.cover.top - projectScroll };
      drawScrubCard(card, easeScrub(progress), centre.getBoundingClientRect(), cover);
      if (centreImage) centreImage.style.visibility = "hidden";
      // The rest of the carousel steps back early, so the growing card has the stage
      // to itself, and the teaser opens up into the full text
      fadeOut(stageRef.current, Math.min(1, progress / 0.35));
      fadeOut(hintRef.current, Math.min(1, progress / 0.2), -16);
      fadeOut(summaryRef.current, Math.min(1, progress / 0.3), -12);
      fadeOut(moreRef.current, Math.min(1, progress / 0.2));
      openText(Math.min(1, progress / 0.5));

      // Arriving at the very end (handed back by the project), wait for the
      // visitor to scroll back a little before the end can open it again
      if (progress < 0.97) armedRef.current = true;
      if (progress >= 1 && armedRef.current) {
        armedRef.current = false;
        // The card is now the cover: hand it over and let the project page take it
        scrubRef.current = null;
        handOffScrub(project.slug, card, projectScroll);
        navigate(`/work/${project.slug}`);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    // A newly selected piece slides to the centre over the next moment; while the
    // card is out it has to follow it there, not stay where the piece started
    let follow = 0;
    const followUntil = performance.now() + 1000;
    const keepFollowing = () => {
      update();
      if (performance.now() < followUntil) follow = requestAnimationFrame(keepFollowing);
    };
    follow = requestAnimationFrame(keepFollowing);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      stale = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(follow);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      fadeOut(stageRef.current, 0);
      fadeOut(hintRef.current, 0);
      fadeOut(summaryRef.current, 0);
      fadeOut(moreRef.current, 0);
      openText(0);
      showPieces();
    };
    // slides are rebuilt from the same items each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug, reduceMotion, navigate]);

  // A card still out when the page goes (without handing it over) goes with it.
  // Checked a moment later, so a development double-mount does not count.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.setTimeout(() => {
        if (mountedRef.current) return;
        scrubRef.current?.card.remove();
        scrubRef.current = null;
      });
    };
  }, []);

  // Where every piece sat on the last render, so a piece that has to cross the
  // centre (wrapping around the ring, or regrouping) jumps instead of sliding
  const offsets = ordered.map((_, i) => circularOffset(i, active, count));
  const offsetBySlug: Record<string, number> = {};
  ordered.forEach((s, i) => (offsetBySlug[s.project.slug] = offsets[i]));
  const previousOffsets = useRef<Record<string, number>>(offsetBySlug);
  useEffect(() => {
    previousOffsets.current = offsetBySlug;
  });

  if (count === 0) return null;

  const { project: current } = ordered[active];
  const openCurrent = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    openProject(current);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative isolate [--cw:80vw] [--sh:1.14] md:[--cw:52vw] lg:[--cw:min(46vw,760px)] lg:[--sh:1.3]"
      style={DARK_TONES}
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      {/* The dark band: full-bleed, starting a little above the section so it divides
          the hero from the work */}
      <div aria-hidden="true" className="absolute -top-14 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-(--bg)" />
      {/* Pinned while the visitor scrolls through the runway below */}
      <div ref={pinnedRef} data-work-pinned className={reduceMotion ? "" : "sticky"}>
      {/* One fixed height for the hint and the filter chip, so swapping them moves nothing */}
      <div ref={hintRef} className="flex min-h-[40px] flex-col justify-end">
      {filter ? (
        <p className="mb-2 flex flex-wrap items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em]">
          <span className="text-(--muted)">Showing</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-(--ink) py-1 pl-3 pr-1 text-(--bg)">
            {WORK_GROUPS[filter].label} · {slides.filter((s) => inFilter(s.project.slug)).length}
            <button
              type="button"
              onClick={() => setWorkFilter(null)}
              aria-label="Show all projects"
              className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-(--bg)/15 transition-colors hover:bg-(--bg)/30"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </button>
          </span>
          <button
            type="button"
            onClick={() => setWorkFilter(null)}
            className="cursor-pointer uppercase text-(--muted) underline underline-offset-4 hover:text-(--ink)"
          >
            Show all
          </button>
        </p>
      ) : (
        <p className="mb-2 flex items-center justify-center gap-2 text-center text-(--muted) text-[11px] font-semibold uppercase tracking-[0.16em]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M9 11V5.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v4.5c0 3-2 5.5-5.5 5.5h-1.2c-1.6 0-2.8-.6-3.8-1.8L5 15.5a1.5 1.5 0 012.2-2L9 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Pick a project, or keep scrolling to read it
        </p>
      )}
      </div>

      {/* Stage: full-bleed so the outer pieces run off the screen edges */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip pb-4">
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
          aria-label="Use the arrow keys or swipe to browse projects"
          className="relative mx-auto touch-pan-y select-none outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          // Room for the centre piece, the side pieces' reflections and a little air
          style={{ height: `calc(var(--cw) / ${ASPECT} * var(--sh) + 24px)` }}
        >
          {/* Pieces keep one DOM order (the original one), so regrouping only moves them */}
          {slides.map(({ project: p }) => {
            const d = offsetBySlug[p.slug];
            const distance = Math.abs(d);
            const place = placements[Math.min(distance, visible)];
            const side = Math.sign(d);
            const hiddenPiece = distance > visible;
            const before = previousOffsets.current[p.slug] ?? d;
            const crossed = before !== 0 && d !== 0 && Math.sign(before) !== Math.sign(d);
            const isCenter = d === 0;
            // Outside the filter: greyed, but still solid so it never mixes with what is behind it
            const outside = !inFilter(p.slug);
            const veiled = veil === "all" || (veil === "sides" && !isCenter);

            const style: CSSProperties = {
              width: "var(--cw)",
              aspectRatio: `${ASPECT}`,
              top: 12,
              zIndex: 10 - distance,
              opacity: hiddenPiece || veiled ? 0 : 1,
              transform: `translateX(-50%) translateX(calc(var(--cw) * ${side * place.x})) rotateY(${-side * place.rotate}deg) scale(${place.scale})`,
              // It fades in at its new spot rather than travelling across the centre
              transition: instant
                ? `transform 0s, opacity ${VEIL_MS}ms ease, filter 0s, z-index 0s`
                : crossed
                  ? "transform 0s, opacity 500ms ease, filter 900ms ease"
                  : veil !== "none"
                    ? `transform 900ms cubic-bezier(0.45, 0, 0.2, 1), opacity ${VEIL_MS}ms ease, filter 900ms ease, z-index 900ms linear`
                    : "transform 900ms cubic-bezier(0.45, 0, 0.2, 1), opacity 500ms ease, filter 900ms ease, z-index 900ms linear",
              filter: `${outside ? "grayscale(1) " : ""}brightness(${isCenter ? 1 : 1 - distance * 0.06})`,
              // The selected piece only reacts inside its central hit area
              pointerEvents: hiddenPiece || isCenter ? "none" : "auto",
            };

            const imageBase = "absolute inset-0 h-full w-full object-contain object-top";
            const piece = (
              <>
                <img
                  src={p.carouselImage ?? p.coverImage}
                  alt={isCenter ? p.coverImageAlt : ""}
                  draggable={false}
                  loading={distance <= 1 ? "eager" : "lazy"}
                  className={imageBase}
                />
                {/* A wash of the background over the projects outside the filter, so the group stands
                    out, cut to the image's own shape so transparent areas stay clear */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 block bg-(--bg) transition-opacity duration-700 ease-out"
                  style={{
                    opacity: outside ? OUTSIDE_WASH : 0,
                    WebkitMaskImage: `url("${p.carouselImage ?? p.coverImage}")`,
                    maskImage: `url("${p.carouselImage ?? p.coverImage}")`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "top center",
                    maskPosition: "top center",
                  }}
                />
                {/* Reflection for the side pieces: a flipped copy that fades out below.
                    The selected piece has none, leaving room for its case study below. */}
                <img
                  src={p.carouselImage ?? p.coverImage}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="lazy"
                  className={`${imageBase} pointer-events-none transition-opacity duration-500`}
                  style={{
                    top: "100%",
                    opacity: isCenter ? 0 : 0.3,
                    transform: "scaleY(-1)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 62%, #000 100%)",
                    maskImage: "linear-gradient(to bottom, transparent 62%, #000 100%)",
                  }}
                />
              </>
            );

            const frameClass = "absolute left-1/2 block motion-reduce:!transition-none";

            // One element type for every piece, so a piece keeps its DOM node as it
            // moves to the centre and the browser can animate the whole journey.
            return (
              <Link
                key={p.slug}
                to={`/work/${p.slug}`}
                className={`${frameClass} group/piece outline-none ${isCenter ? "" : "cursor-pointer"}`}
                style={style}
                ref={isCenter ? centreRef : undefined}
                data-centre={isCenter ? p.slug : undefined}
                tabIndex={isCenter ? 0 : -1}
                aria-label={isCenter ? undefined : `Show ${p.name}`}
                onClick={(e) => {
                  if (isCenter) {
                    if (dragged.current) {
                      e.preventDefault();
                      return;
                    }
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                    e.preventDefault();
                    openProject(p);
                    return;
                  }
                  e.preventDefault();
                  if (!dragged.current) select(p.slug);
                }}
              >
                <TiltLayer active={isCenter}>{piece}</TiltLayer>
              </Link>
            );
          })}

          <ArrowButton direction="left" onClick={() => step(-1)} />
          <ArrowButton direction="right" onClick={() => step(1)} />
        </div>

      </div>
      </div>

      {/* The opening of the selected case study, laid out exactly as on its page.
          It scrolls like any text: reading on carries the visitor into the project. */}
      <Link
        to={`/work/${current.slug}`}
        onClick={openCurrent}
        tabIndex={-1}
        aria-label={`Read the ${current.name} case study`}
        className="group/peek relative z-30 block"
        style={{ marginTop: `calc(var(--cw) / ${ASPECT} * (1 - var(--sh)) + 20px)` }}
      >
        <div ref={summaryRef} className="flex min-h-[84px] flex-col items-center justify-start gap-1.5 px-4 text-center md:min-h-[64px]">
          <span className="text-(--muted) text-[10px] font-semibold uppercase tracking-[0.16em]">
            {active + 1} / {count} · {current.category}
          </span>
          {current.impact ? (
            <Impact text={current.impact} />
          ) : (
            <span className="max-w-[520px] text-(--muted) text-[13px] leading-relaxed">{current.tagline}</span>
          )}
        </div>

        <div className="relative left-1/2 w-screen -translate-x-1/2" style={{ marginTop: INTRO_GAP }}>
          <div
            ref={introRef}
            className="mx-auto w-[min(1000px,calc(100vw-40px))] overflow-hidden text-left"
            style={{
              maxHeight: INTRO_TEASER,
              WebkitMaskImage: "linear-gradient(to bottom, #000 35%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, #000 35%, transparent 100%)",
            }}
          >
            <CaseStudyIntro project={current} heading="h2" />
          </div>
        </div>

        <span
          ref={moreRef}
          style={{ marginTop: MORE_GAP }}
          className="flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--muted) transition-colors group-hover/peek:text-(--ink)"
        >
          Scroll to read the case study
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-[nudge_1.6s_ease-in-out_infinite] motion-reduce:animate-none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Link>

      {/* The runway: scrolling through it grows the selected card into the cover */}
      {!reduceMotion && <div ref={runwayRef} aria-hidden="true" className="h-[40vh]" />}
    </section>
  );
}
