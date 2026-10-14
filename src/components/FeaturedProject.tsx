import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { getProjectBySlug, type Project } from "../data/projects";

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
const VISIBLE = PLACEMENT.length - 1;

// Info bubble size, used to keep it beside the image
const BUBBLE_W = 300;
const BUBBLE_H = 230;
const BUBBLE_GAP = 16;

// Covers are exported at 1920 x 1314
const ASPECT = 1920 / 1314;

// Signed shortest distance from the active slide, so the ring wraps around
function circularOffset(index: number, active: number, count: number) {
  let d = (index - active) % count;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
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
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink shadow-[0_6px_24px_rgba(0,0,0,0.18)] opacity-0 scale-90 transition-all duration-200 group-hover/arrow:opacity-100 group-hover/arrow:scale-100 group-focus-visible/arrow:opacity-100 group-focus-visible/arrow:scale-100 [@media(hover:none)]:opacity-90 [@media(hover:none)]:scale-100">
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
  const previousOffsets = useRef<number[]>([]);
  // Where the info bubble sits (px, within the stage); null = not hovering
  const [bubble, setBubble] = useState<{ left: number; top: number } | null>(null);

  // The bubble follows the cursor up and down in the gutter beside the image, on
  // the side the cursor is on, so it never covers the project. Without room in
  // the gutters (narrow screens) it sits centred under the image instead.
  const trackBubble = (piece: HTMLElement, clientX: number | null, clientY: number | null) => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const pr = piece.getBoundingClientRect();
    const pieceTop = pr.top - sr.top;
    const pieceBottom = pr.bottom - sr.top;
    const roomLeft = pr.left - sr.left;
    const roomRight = sr.right - pr.right;
    const need = BUBBLE_W + BUBBLE_GAP + 8;
    const preferLeft = clientX !== null && clientX < pr.left + pr.width / 2;
    const side =
      (preferLeft ? roomLeft : roomRight) >= need ? (preferLeft ? "left" : "right")
      : roomRight >= need ? "right"
      : roomLeft >= need ? "left"
      : null;
    if (side === null) {
      const centre = pr.left + pr.width / 2 - sr.left;
      return setBubble({ left: centre - BUBBLE_W / 2, top: pieceBottom + 14 });
    }
    const y = clientY === null ? pieceTop + pr.height / 2 : clientY - sr.top;
    setBubble({
      left: side === "right" ? pr.right - sr.left + BUBBLE_GAP : pr.left - sr.left - BUBBLE_GAP - BUBBLE_W,
      top: Math.min(Math.max(y - 70, pieceTop), Math.max(pieceTop, pieceBottom - BUBBLE_H)),
    });
  };

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

  if (count === 0) return null;

  const offsets = slides.map((_, i) => circularOffset(i, active, count));
  const lastOffsets = previousOffsets.current;
  previousOffsets.current = offsets;

  return (
    <section
      id="work"
      className="pb-24 scroll-mt-8"
      aria-roledescription="carousel"
      aria-label="Featured projects"
    >
      {/* Stage: full-bleed so the outer pieces run off the screen edges */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div
          ref={stageRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (dragStart.current = null)}
          aria-label="Use the arrow keys or swipe to browse projects"
          className="relative mx-auto touch-pan-y select-none outline-none [--cw:78vw] md:[--cw:52vw] lg:[--cw:min(46vw,760px)] [perspective:1400px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
          // Room for the centre piece, its reflection and a little air around them
          style={{ height: `calc(var(--cw) / ${ASPECT} * 1.3 + 24px)` }}
        >
          {slides.map(({ project: p }, i) => {
            const d = offsets[i];
            const distance = Math.abs(d);
            const place = PLACEMENT[Math.min(distance, VISIBLE)];
            const side = Math.sign(d);
            const hiddenPiece = distance > VISIBLE;
            // A piece wrapping around to the other side jumps instead of
            // sliding across the centre
            const wrapped = lastOffsets[i] !== undefined && Math.abs(lastOffsets[i] - d) > 1;
            const isCenter = d === 0;

            const style: CSSProperties = {
              width: "var(--cw)",
              aspectRatio: `${ASPECT}`,
              top: 12,
              zIndex: 10 - distance,
              opacity: hiddenPiece ? 0 : 1,
              transform: `translateX(-50%) translateX(calc(var(--cw) * ${side * place.x})) rotateY(${-side * place.rotate}deg) scale(${place.scale})`,
              transition: wrapped
                ? "none"
                : "transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease, filter 600ms ease",
              filter: isCenter ? "none" : `brightness(${1 - distance * 0.06})`,
              pointerEvents: hiddenPiece ? "none" : "auto",
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

            return isCenter ? (
              <Link
                key={p.slug}
                to={`/work/${p.slug}`}
                className={`${frameClass} group/piece outline-none`}
                style={style}
                onClick={(e) => dragged.current && e.preventDefault()}
                onPointerEnter={(e) => trackBubble(e.currentTarget, e.clientX, e.clientY)}
                onPointerMove={(e) => trackBubble(e.currentTarget, e.clientX, e.clientY)}
                onPointerLeave={() => setBubble(null)}
                onFocus={(e) => trackBubble(e.currentTarget, null, null)}
                onBlur={() => setBubble(null)}
              >
                {piece}
              </Link>
            ) : (
              <button
                key={p.slug}
                type="button"
                className={`${frameClass} cursor-pointer`}
                style={style}
                tabIndex={-1}
                aria-label={`Show ${p.name}`}
                onClick={() => !dragged.current && setActive(i)}
              >
                {piece}
              </button>
            );
          })}

          {/* Info bubble: follows the cursor beside the image, never over it */}
          {(() => {
            const { project: p, title } = slides[active];
            return (
              <div
                aria-hidden={bubble === null}
                className={`pointer-events-none absolute z-40 flex w-[min(300px,calc(100vw-32px))] flex-col gap-2 rounded-2xl bg-white p-5 text-left shadow-[0_16px_48px_rgba(0,0,0,0.18)] transition-[top,opacity,transform] duration-300 ease-out [@media(hover:none)]:p-4 [@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0 ${
                  bubble === null ? "left-1/2 -translate-x-1/2 translate-y-2 opacity-0 [@media(hover:none)]:opacity-100" : "translate-y-0 opacity-100"
                }`}
                style={{
                  ...(bubble ?? {}),
                  ...(bubble === null ? { top: `calc(12px + var(--cw) / ${ASPECT} + 14px)` } : {}),
                }}
              >
                <span className="text-[#737373] text-[10px] font-semibold uppercase tracking-[0.16em]">
                  {p.category} · {p.year}
                </span>
                <span className="text-ink text-[18px] font-medium leading-[1.2] tracking-[-0.3px]">
                  {title ?? p.name}
                </span>
                <span className="text-[#737373] text-[13px] leading-relaxed [@media(hover:none)]:hidden">{p.tagline}</span>
                <span className="text-[12px] [@media(hover:none)]:hidden">
                  <span className="text-[#737373]">Role</span> <span className="text-ink">{p.role}</span>
                </span>
                <span className="flex flex-wrap gap-1.5 [@media(hover:none)]:hidden">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-[10px] text-[#4d5570] border border-[#E6E0D8] rounded-full px-2.5 py-0.5">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="inline-flex items-center gap-2 text-[12px] font-medium text-ink">
                  View case study <span aria-hidden="true">→</span>
                </span>
              </div>
            );
          })()}

          <ArrowButton direction="left" onClick={() => step(-1)} />
          <ArrowButton direction="right" onClick={() => step(1)} />
        </div>
      </div>
    </section>
  );
}
