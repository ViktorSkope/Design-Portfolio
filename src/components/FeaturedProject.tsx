import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCoverBackground, getProjectBySlug, type Project } from "../data/projects";
import { beginExpand } from "../lib/pageTransition";

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

// The info bubble sits this far past the selected image's right edge
const BUBBLE_OFFSET_X = 16;
// Only the central part of the selected image reacts to the pointer (and opens
// the project); the rest lets the neighbouring pieces be reached
const HIT_INSET = 10; // percent trimmed from each side, leaving 80%
// Hovering the selected image enlarges it a little and tilts it toward the cursor
const TILT_SCALE = 1.04;
const TILT_MAX_X = 7; // degrees
const TILT_MAX_Y = 9;

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
function TiltLayer({
  active,
  onHover,
  children,
}: {
  active: boolean;
  onHover: (hovering: boolean) => void;
  children: React.ReactNode;
}) {
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
    onHover(true);
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
        onPointerLeave={() => {
          onHover(false);
          reset();
        }}
      >
        <span
          ref={innerRef}
          className="pointer-events-none absolute block will-change-transform motion-reduce:!transition-none"
          style={{ inset: bleed }}
        >
          {children}
        </span>
      </span>
    </>
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
  const [active, setActive] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const centreRef = useRef<HTMLAnchorElement>(null);
  const compact = useMediaQuery("(max-width: 767px)");
  const placements = compact ? PLACEMENT_COMPACT : PLACEMENT;
  const visible = placements.length - 1;
  // The slide that was active on the previous render. Updated in an effect (not
  // during render) so React double-rendering cannot hide a wrap-around.
  const previousActive = useRef(0);
  useEffect(() => {
    previousActive.current = active;
  });
  // The bubble is pinned to the selected image and only fades in and out
  const [hovering, setHovering] = useState(false);

  const step = useCallback(
    (direction: number) => setActive((a) => (a + direction + count) % count),
    [count],
  );

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
        step(accumulated > 0 ? 1 : -1);
        accumulated = 0;
        coolingDown = true;
        setTimeout(() => (coolingDown = false), 380);
      }
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [step]);

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
    const rect = centreRef.current?.getBoundingClientRect();
    if (rect) beginExpand(project.slug, rect, project.coverImage, getCoverBackground(project));
    navigate(`/work/${project.slug}`);
  };

  if (count === 0) return null;

  const offsets = slides.map((_, i) => circularOffset(i, active, count));
  const lastActive = previousActive.current;

  return (
    <section
      id="work"
      className="pb-[86px] scroll-mt-8"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      <p className="mb-2 flex items-center justify-center gap-2 text-center text-[#737373] text-[11px] font-semibold uppercase tracking-[0.16em]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M9 11V5.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V11m0-1a1.5 1.5 0 013 0v4.5c0 3-2 5.5-5.5 5.5h-1.2c-1.6 0-2.8-.6-3.8-1.8L5 15.5a1.5 1.5 0 012.2-2L9 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Hover over or tap a project to learn more
      </p>

      {/* Stage: full-bleed so the outer pieces run off the screen edges */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip pb-4 [--cw:80vw] [--sh:1.14] md:[--cw:52vw] lg:[--cw:min(46vw,760px)] lg:[--sh:1.3]">
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
          aria-label="Use the arrow keys or swipe to browse projects"
          className="relative mx-auto touch-pan-y select-none outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          // Room for the centre piece, its reflection and a little air around them
          style={{ height: `calc(var(--cw) / ${ASPECT} * var(--sh) + 24px)` }}
        >
          {slides.map(({ project: p }, i) => {
            const d = offsets[i];
            const distance = Math.abs(d);
            const place = placements[Math.min(distance, visible)];
            const side = Math.sign(d);
            const hiddenPiece = distance > visible;
            // A piece wrapping around to the other side jumps instead of
            // sliding across the centre
            const wrapped = Math.abs(circularOffset(i, lastActive, count) - d) > 1;
            const isCenter = d === 0;

            const style: CSSProperties = {
              width: "var(--cw)",
              aspectRatio: `${ASPECT}`,
              top: 12,
              zIndex: 10 - distance,
              opacity: hiddenPiece ? 0 : 1,
              transform: `translateX(-50%) translateX(calc(var(--cw) * ${side * place.x})) rotateY(${-side * place.rotate}deg) scale(${place.scale})`,
              // It fades in at its new spot rather than travelling there
              transition: wrapped
                ? "transform 0s, opacity 500ms ease, filter 900ms ease"
                : "transform 900ms cubic-bezier(0.45, 0, 0.2, 1), opacity 500ms ease, filter 900ms ease, z-index 900ms linear",
              filter: isCenter ? "none" : `brightness(${1 - distance * 0.06})`,
              // The selected piece only reacts inside its central hit area
              pointerEvents: hiddenPiece || isCenter ? "none" : "auto",
            };

            const imageBase = "absolute inset-0 h-full w-full object-contain object-top";
            const piece = (
              <>
                <img
                  src={p.coverImage}
                  alt={isCenter ? p.coverImageAlt : ""}
                  draggable={false}
                  loading={distance <= 1 ? "eager" : "lazy"}
                  className={imageBase}
                />
                {/* Reflection: a flipped copy that fades out below the piece */}
                <img
                  src={p.coverImage}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  loading="lazy"
                  className={`${imageBase} pointer-events-none opacity-30`}
                  style={{
                    top: "100%",
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
                  if (!dragged.current) setActive(i);
                }}
                onFocus={isCenter ? () => setHovering(true) : undefined}
                onBlur={isCenter ? () => setHovering(false) : undefined}
              >
                <TiltLayer active={isCenter} onHover={setHovering}>
                  {piece}
                </TiltLayer>
              </Link>
            );
          })}

          <ArrowButton direction="left" onClick={() => step(-1)} />
          <ArrowButton direction="right" onClick={() => step(1)} />
        </div>
        {/* Info bubble. Phones and tablets: always shown under the selected project, almost
            full width. Wide screens: beside it, 16px past its right edge, on hover. */}
        {(() => {
          const { project: p, title } = slides[active];
          return (
            <Link
              to={`/work/${p.slug}`}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                openProject(p);
              }}
              tabIndex={-1}
              className={`relative mx-auto mt-2 flex w-[calc(100vw-32px)] max-w-[560px] flex-col gap-2.5 rounded-2xl bg-white p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-opacity duration-200 ease-out lg:pointer-events-none lg:absolute lg:z-40 lg:mx-0 lg:mt-0 lg:left-[var(--right-left)] lg:top-8 lg:w-[min(300px,calc(50vw-var(--cw)/2-32px))] lg:gap-2 lg:[@media(hover:none)]:opacity-100 ${
                hovering ? "lg:opacity-100" : "lg:opacity-0"
              }`}
              style={{ ["--right-left" as string]: `calc(50% + var(--cw) / 2 + ${BUBBLE_OFFSET_X}px)` }}
            >
              <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-[0.16em]">
                {p.category} · {p.year}
              </span>
              <span className="text-ink text-[20px] lg:text-[18px] font-medium leading-[1.2] tracking-[-0.3px]">
                {title ?? p.name}
              </span>
              <span className="text-[#737373] text-[14px] lg:text-[13px] leading-relaxed">{p.tagline}</span>
              <span className="text-[13px] lg:text-[12px]">
                <span className="text-[#737373]">Role</span> <span className="text-ink">{p.role}</span>
              </span>
              <span className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[11px] lg:text-[10px] text-[#4d5570] border border-[#E6E0D8] rounded-full px-2.5 py-0.5">
                    {tag}
                  </span>
                ))}
              </span>
              <span className="inline-flex items-center gap-2 text-[13px] lg:text-[12px] font-medium text-ink">
                View case study <span aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })()}
      </div>
    </section>
  );
}
