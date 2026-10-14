// Page transitions between routes. Each one starts from a short-lived overlay on
// the old page, then the new page picks it up when it mounts and finishes it:
//
//   expand: the selected carousel card grows into the project page's cover.
//   slide:  the current project page slides away while the next one slides in,
//           like turning the pages of a carousel.
//
// Reduced-motion visitors skip all of it and just navigate.

type Pending =
  | { kind: "expand"; slug: string; overlay: HTMLElement; backdrop: HTMLElement }
  | { kind: "slide"; slug: string; direction: 1 | -1; overlay: HTMLElement; inner: HTMLElement };

let pending: Pending | null = null;
let failsafe: number | undefined;

export const TRANSITION_MS = 800;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function discard() {
  window.clearTimeout(failsafe);
  pending?.overlay.remove();
  pending = null;
}

function arm(next: Pending) {
  discard();
  pending = next;
  // If the new page never claims the transition, clear the overlay anyway
  failsafe = window.setTimeout(discard, 4000);
}

/** Puts a copy of the selected card on top of the page, ready to grow into the cover. */
export function beginExpand(slug: string, rect: DOMRect, imageSrc: string, background: string) {
  if (prefersReducedMotion()) return false;

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = [
    "position:fixed",
    `left:${rect.left}px`,
    `top:${rect.top}px`,
    `width:${rect.width}px`,
    `height:${rect.height}px`,
    "z-index:90",
    "overflow:hidden",
    "pointer-events:none",
    "border-radius:0",
  ].join(";");

  // The card's backdrop fades in as it grows, so the bare mockup becomes the cover card
  const backdrop = document.createElement("div");
  backdrop.style.cssText = `position:absolute;inset:0;background:${background};opacity:0`;

  const image = document.createElement("img");
  image.src = imageSrc;
  image.alt = "";
  image.draggable = false;
  image.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain";

  overlay.append(backdrop, image);
  document.body.appendChild(overlay);
  arm({ kind: "expand", slug, overlay, backdrop });
  return true;
}

/** Keeps a copy of the current page on screen so it can slide out as the next one slides in. */
export function beginSlide(slug: string, direction: 1 | -1, page: HTMLElement) {
  if (prefersReducedMotion()) return false;

  const width = document.documentElement.clientWidth;
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:100vh;overflow:hidden;z-index:95;pointer-events:none`;

  const inner = document.createElement("div");
  inner.style.cssText = `position:absolute;left:0;top:${-window.scrollY}px;width:${width}px`;
  const copy = page.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  inner.appendChild(copy);

  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  arm({ kind: "slide", slug, direction, overlay, inner });
  return true;
}

export interface Arrival {
  kind: "expand" | "slide" | "none";
  /** Slide only: 1 when the new page arrives from the right, -1 from the left. */
  direction: 1 | -1;
}

/**
 * Called by the project page as soon as it mounts (before it paints). Finishes
 * whichever transition is waiting for this project and says how the page should
 * introduce itself.
 */
export function arrive(slug: string, cover: HTMLElement | null, page: HTMLElement | null): Arrival {
  const current = pending;
  if (!current || current.slug !== slug) {
    discard();
    return { kind: "none", direction: 1 };
  }
  pending = null;
  window.clearTimeout(failsafe);

  if (current.kind === "expand" && cover) {
    cover.style.visibility = "hidden";
    const from = current.overlay.getBoundingClientRect();
    const to = cover.getBoundingClientRect();
    // The wrapper is square; the rounded card is its first child
    const card = (cover.firstElementChild as HTMLElement | null) ?? cover;
    const radius = getComputedStyle(card).borderTopLeftRadius || "24px";

    const grow = current.overlay.animate(
      [
        { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, borderRadius: "0px" },
        { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: radius },
      ],
      { duration: TRANSITION_MS, easing: EASE, fill: "forwards" },
    );
    current.backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: TRANSITION_MS * 0.7,
      easing: "ease-out",
      fill: "forwards",
    });

    const done = () => {
      cover.style.visibility = "";
      current.overlay.remove();
    };
    grow.onfinish = done;
    grow.oncancel = done;
    window.setTimeout(done, TRANSITION_MS + 600);
    return { kind: "expand", direction: 1 };
  }

  if (current.kind === "slide") {
    const { direction, inner, overlay } = current;
    const exit = inner.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${-direction * 100}%)` }],
      { duration: TRANSITION_MS, easing: EASE, fill: "forwards" },
    );
    const done = () => overlay.remove();
    exit.onfinish = done;
    exit.oncancel = done;
    window.setTimeout(done, TRANSITION_MS + 600);

    page?.animate(
      [{ transform: `translateX(${direction * 100}vw)` }, { transform: "translateX(0)" }],
      { duration: TRANSITION_MS, easing: EASE },
    );
    return { kind: "slide", direction };
  }

  discard();
  return { kind: "none", direction: 1 };
}
