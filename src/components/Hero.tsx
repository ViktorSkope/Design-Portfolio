import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ContactButton from "./ContactButton";
import { getProjectBySlug } from "../data/projects";
import { setWorkFilter, WORK_GROUPS, type WorkGroup } from "../lib/workFilter";
import { scrollToWork } from "../lib/scrubTransition";

interface Bubble {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
  src: string;
  slug: string;
  name: string;
  // Catchable once it has drifted clear of the word, so clicking the word still works
  armed: boolean;
}

const MAX_BUBBLES = 10;
const COOLDOWN_MS = 160;
const ARM_MS = 900;

// Hovering a word brightens it slightly, at once, to show the bubbles come from it,
// and its underline fills in to say it can be clicked. Clicking it shows that
// group of projects in the carousel below.
const WORD_STYLE =
  "cursor-pointer rounded-sm text-[color:var(--hl)] underline decoration-2 underline-offset-[0.18em] decoration-[color:color-mix(in_srgb,var(--hl),transparent_72%)] transition-[color,text-decoration-color] duration-300 ease-out hover:duration-0 hover:text-[color:color-mix(in_srgb,var(--hl),white_22%)] hover:decoration-[color:var(--hl)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--hl)]";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  const spawn = useCallback((word: WorkGroup, clientX: number, clientY: number) => {
    const now = performance.now();
    if (now - lastSpawn.current < COOLDOWN_MS) return;
    const container = containerRef.current;
    if (!container) return;
    lastSpawn.current = now;

    const slugs = WORK_GROUPS[word].slugs;
    const project = getProjectBySlug(slugs[Math.floor(Math.random() * slugs.length)]);
    if (!project) return;

    const rect = container.getBoundingClientRect();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A slow drift in a random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = reduceMotion ? 0 : 90 + Math.random() * 110;
    const id = nextId.current++;

    const bubble: Bubble = {
      id,
      x: clientX - rect.left,
      y: clientY - rect.top,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      duration: 3200 + Math.random() * 1800,
      src: project.coverImage,
      slug: project.slug,
      name: project.name,
      armed: false,
    };
    setBubbles((current) => [...current.slice(-(MAX_BUBBLES - 1)), bubble]);
    window.setTimeout(
      () => setBubbles((current) => current.map((b) => (b.id === id ? { ...b, armed: true } : b))),
      ARM_MS,
    );
    window.setTimeout(
      () => setBubbles((current) => current.filter((b) => b.id !== id)),
      bubble.duration + 100,
    );
  }, []);

  // Bring that group forward in the carousel, and glide down to it
  const showGroup = (key: WorkGroup) => {
    setWorkFilter(key);
    scrollToWork();
  };

  const word = (key: WorkGroup, colourVar: string, label: string) => (
    <button
      type="button"
      className={WORD_STYLE}
      style={{ ["--hl" as string]: `var(${colourVar})` }}
      onPointerEnter={(e) => spawn(key, e.clientX, e.clientY)}
      onClick={() => showGroup(key)}
      aria-label={`${label}: see ${WORK_GROUPS[key].label} projects`}
    >
      {label}
    </button>
  );

  return (
    <section id="about">
      <div ref={containerRef} className="relative mx-auto block max-w-[1152px] text-center">
        <p className="text-ink text-[28px] md:text-[36px] lg:text-[42px] font-medium leading-[1.18] tracking-[-0.5px] text-balance">
          {word("multidisciplinary", "--color-alt-2", "Multidisciplinary")} product designer with 10+ YOE driving
          design strategy for {word("saas", "--color-quaternary", "B2B Saas")},{" "}
          {word("startups", "--color-tertiary", "Startups")} and {word("games", "--color-alt-1", "Games")}.
        </p>

        {/* Avatar sits to the left of the Contact me button */}
        <div id="hero-contact" className="mt-[29px] flex items-center justify-center gap-4">
          <img
            src="/avatar.png"
            alt="Viktor Dopke"
            className="w-12 h-12 shrink-0 rounded-full object-cover shadow-md ring-2 ring-white animate-[float_4s_ease-in-out_infinite]"
          />
          <ContactButton variant="inline" />
        </div>

        {/* Project bubbles released by the highlighted words. Catch one to open it:
            it stops drifting under the cursor and shows the project's name. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          {bubbles.map((b) => (
            <Link
              key={b.id}
              to={`/work/${b.slug}`}
              tabIndex={-1}
              className={`group/bubble absolute block h-12 w-12 animate-[bubble-drift_var(--dur)_linear_forwards] hover:z-10 hover:[animation-play-state:paused] ${
                b.armed ? "pointer-events-auto cursor-pointer" : ""
              }`}
              style={
                {
                  left: b.x,
                  top: b.y,
                  "--dx": `${b.dx}px`,
                  "--dy": `${b.dy}px`,
                  "--dur": `${b.duration}ms`,
                } as React.CSSProperties
              }
            >
              <span className="absolute inset-0 block overflow-hidden rounded-full bg-[#E7E2DE] shadow-md ring-2 ring-white animate-[bubble-life_var(--dur)_ease-out_forwards] group-hover/bubble:[animation-play-state:paused]">
                {/* Zoomed in so the artwork, not the empty margin, fills the bubble */}
                <img src={b.src} alt="" draggable={false} className="h-full w-full scale-[1.7] object-cover" />
              </span>
              {/* The ring that flashes outward as the bubble pops */}
              <span className="absolute inset-0 block rounded-full ring-2 ring-white opacity-0 animate-[bubble-burst_calc(var(--dur)*0.07)_ease-out_calc(var(--dur)*0.93)_forwards] group-hover/bubble:[animation-play-state:paused]" />
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium leading-none text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/bubble:opacity-100">
                {b.name} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
