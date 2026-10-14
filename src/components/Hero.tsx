import { useCallback, useRef, useState } from "react";
import ContactButton from "./ContactButton";
import { getProjectBySlug } from "../data/projects";

interface Bubble {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
  src: string;
}

const MAX_BUBBLES = 10;
const COOLDOWN_MS = 160;

// Hovering a highlighted word lets a bubble with one of these projects drift off
const WORD_PROJECTS = {
  multidisciplinary: ["whirl", "pewee-diary", "liliworld"],
  saas: ["athos-commerce", "watchson", "ingrid"],
  startups: ["rho-studio", "plywood"],
  games: ["liliworld"],
} as const;

type WordKey = keyof typeof WORD_PROJECTS;

// Hovering a word brightens it slightly, at once, to show the bubbles come from it.
// It eases back down over 0.3s when the cursor leaves.
const WORD_STYLE =
  "cursor-default text-[color:var(--hl)] transition-[color] duration-300 ease-out hover:duration-0 hover:text-[color:color-mix(in_srgb,var(--hl),white_22%)]";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(0);

  const spawn = useCallback((word: WordKey, clientX: number, clientY: number) => {
    const now = performance.now();
    if (now - lastSpawn.current < COOLDOWN_MS) return;
    const container = containerRef.current;
    if (!container) return;
    lastSpawn.current = now;

    const slugs = WORD_PROJECTS[word];
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
    };
    setBubbles((current) => [...current.slice(-(MAX_BUBBLES - 1)), bubble]);
    window.setTimeout(
      () => setBubbles((current) => current.filter((b) => b.id !== id)),
      bubble.duration + 100,
    );
  }, []);

  const word = (key: WordKey, colourVar: string, label: string) => (
    <span
      className={WORD_STYLE}
      style={{ ["--hl" as string]: `var(${colourVar})` }}
      onPointerEnter={(e) => spawn(key, e.clientX, e.clientY)}
    >
      {label}
    </span>
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

        {/* Project bubbles released by the highlighted words */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
          {bubbles.map((b) => (
            <span
              key={b.id}
              className="absolute block h-12 w-12 animate-[bubble-drift_var(--dur)_linear_forwards]"
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
              <span className="absolute inset-0 block overflow-hidden rounded-full bg-[#E7E2DE] shadow-md ring-2 ring-white animate-[bubble-life_var(--dur)_ease-out_forwards]">
                {/* Zoomed in so the artwork, not the empty margin, fills the bubble */}
                <img src={b.src} alt="" draggable={false} className="h-full w-full scale-[1.7] object-cover" />
              </span>
              {/* The ring that flashes outward as the bubble pops */}
              <span className="absolute inset-0 block rounded-full ring-2 ring-white opacity-0 animate-[bubble-burst_calc(var(--dur)*0.07)_ease-out_calc(var(--dur)*0.93)_forwards]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
