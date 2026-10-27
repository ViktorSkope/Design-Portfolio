// Page transitions between routes. Each one starts from a short-lived overlay on
// the old page, then the new page picks it up when it mounts and finishes it:
//
//   expand: the selected carousel card grows into the project page's cover while
//           the rest of the landing page dissolves away.
//   slide:  the strip of covers moves by exactly one card, so the clicked
//           neighbour becomes the centre card, while the text cross-fades.
//   collapse: the way back, the cover shrinks into its place in the carousel.
//   scrub:  scrolling on from the landing page, the card has already been grown
//           into the cover by the scroll itself; the project page takes over,
//           scrolled to where its cover and opening text already are.
//
// The page cannot be scrolled while one of them runs, so nothing drifts away from
// the overlay.
//
// Reduced-motion visitors skip all of it and just navigate.

type Pending =
  | {
      kind: "expand";
      slug: string;
      overlay: HTMLElement;
      backdrop: HTMLElement;
      tilt: string;
      home: HTMLElement | null;
    }
  | {
      kind: "collapse";
      slug: string;
      overlay: HTMLElement;
      backdrop: HTMLElement;
      project: HTMLElement | null;
    }
  | {
      kind: "scrub";
      slug: string;
      overlay: HTMLElement;
      scrollTop: number;
    }
  | {
      kind: "slide";
      slug: string;
      direction: 1 | -1;
      pitch: number;
      overlay: HTMLElement;
      coverWrap: HTMLElement;
      bodyWrap: HTMLElement;
      bodyOffset: number;
    };

let pending: Pending | null = null;
let failsafe: number | undefined;

export const TRANSITION_MS = 800;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function discard() {
  window.clearTimeout(failsafe);
  if (pending) {
    pending.overlay.remove();
    if (pending.kind === "expand") pending.home?.remove();
    if (pending.kind === "collapse") pending.project?.remove();
  }
  pending = null;
}

// ─── Scroll lock ─────────────────────────────────────────────────────────────

let unlockTimer: number | undefined;
let locked = false;
const SCROLL_KEYS = [" ", "PageDown", "PageUp", "Home", "End", "ArrowUp", "ArrowDown"];
const blockScroll = (e: Event) => e.preventDefault();
const blockScrollKeys = (e: KeyboardEvent) => {
  if (SCROLL_KEYS.includes(e.key)) e.preventDefault();
};

function unlockScroll() {
  window.clearTimeout(unlockTimer);
  if (!locked) return;
  locked = false;
  window.removeEventListener("wheel", blockScroll);
  window.removeEventListener("touchmove", blockScroll);
  window.removeEventListener("keydown", blockScrollKeys);
}

/** Stops wheel, touch and keyboard scrolling for `ms`, then gives it back. */
export function lockScroll(ms: number) {
  if (prefersReducedMotion()) return;
  if (!locked) {
    locked = true;
    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockScrollKeys);
  }
  window.clearTimeout(unlockTimer);
  unlockTimer = window.setTimeout(unlockScroll, ms);
}

function arm(next: Pending, { lock = true } = {}) {
  discard();
  pending = next;
  // Scroll-driven handoffs keep scrolling alive, so the gesture carries on
  if (lock) lockScroll(TRANSITION_MS + 700);
  // If the new page never claims the transition, clear the overlay anyway
  failsafe = window.setTimeout(discard, 4000);
}

const noTransform = (value: string) => !value || value === "none";

// ─── Scrub (scroll-driven) ───────────────────────────────────────────────────

/**
 * The landing page grew the card into the cover; the project page takes it from
 * here, scrolled to `scrollTop` so its text is where the reader left it.
 */
export function handOffScrub(slug: string, overlay: HTMLElement, scrollTop: number) {
  arm({ kind: "scrub", slug, overlay, scrollTop }, { lock: false });
}

// ─── Expand ──────────────────────────────────────────────────────────────────

/**
 * Puts a copy of the selected card on top of the page, exactly as it looks right
 * now (including any hover tilt), ready to grow into the cover. `page` is the
 * landing page, copied so it can dissolve instead of vanishing in one frame.
 */
export function beginExpand(
  slug: string,
  rect: DOMRect,
  imageSrc: string,
  background: string,
  tilt: string,
  page: HTMLElement | null,
) {
  if (prefersReducedMotion()) return false;

  // The dissolving copy of the landing page sits underneath the growing card
  let home: HTMLElement | null = null;
  if (page) {
    home = document.createElement("div");
    home.setAttribute("aria-hidden", "true");
    const width = document.documentElement.clientWidth;
    home.style.cssText = `position:fixed;left:0;top:${-window.scrollY}px;width:${width}px;z-index:89;pointer-events:none;overflow:hidden;height:${page.scrollHeight}px`;
    const copy = page.cloneNode(true) as HTMLElement;
    copy.removeAttribute("id");
    // The growing card replaces this one, so don't draw it twice
    copy.querySelectorAll<HTMLElement>("[data-centre] img:first-of-type").forEach((el) => {
      el.style.visibility = "hidden";
    });
    home.appendChild(copy);
    document.body.appendChild(home);
  }

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
    "will-change:left,top,width,height,transform",
    noTransform(tilt) ? "" : `transform:${tilt}`,
  ].join(";");

  // The card's backdrop fades in as it grows, so the bare mockup becomes the cover card
  const backdrop = document.createElement("div");
  backdrop.style.cssText = `position:absolute;inset:0;background:${background};opacity:0`;

  const image = document.createElement("img");
  image.decoding = "sync";
  image.src = imageSrc;
  image.alt = "";
  image.draggable = false;
  image.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain";

  overlay.append(backdrop, image);
  document.body.appendChild(overlay);
  arm({ kind: "expand", slug, overlay, backdrop, tilt, home });
  return true;
}

// ─── Slide ───────────────────────────────────────────────────────────────────

export interface SlideSource {
  /** The full-width row holding the cover and its neighbours. */
  row: HTMLElement;
  /** Everything below the cover. */
  body: HTMLElement;
  /** Distance from one cover to the next, in pixels. */
  pitch: number;
}

/**
 * Copies the cover row and the text below it so they can leave while the next
 * project's arrive. The covers move as one strip by exactly one card, which lines
 * the old page's neighbour up with the new page's cover at every moment.
 */
export function beginSlide(slug: string, direction: 1 | -1, source: SlideSource) {
  if (prefersReducedMotion()) return false;

  const page = source.row.closest<HTMLElement>("#project-page");
  const width = document.documentElement.clientWidth;
  const rowRect = source.row.getBoundingClientRect();
  const bodyRect = source.body.getBoundingClientRect();

  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:100vh;overflow:hidden;z-index:95;pointer-events:none`;
  // The copies live outside the page, so they need its content width too
  const contentWidth = page ? getComputedStyle(page).getPropertyValue("--cw") : "";
  if (contentWidth) overlay.style.setProperty("--cw", contentWidth);

  const coverWrap = document.createElement("div");
  coverWrap.style.cssText = `position:absolute;left:${rowRect.left}px;top:${rowRect.top}px;width:${rowRect.width}px`;
  const rowCopy = source.row.cloneNode(true) as HTMLElement;
  Object.assign(rowCopy.style, { left: "0px", translate: "none", transform: "none", marginTop: "0px", width: "100%" });
  coverWrap.appendChild(rowCopy);

  const bodyWrap = document.createElement("div");
  bodyWrap.style.cssText = `position:absolute;left:${bodyRect.left}px;top:${bodyRect.top}px;width:${bodyRect.width}px`;
  const bodyCopy = source.body.cloneNode(true) as HTMLElement;
  Object.assign(bodyCopy.style, { width: "100%", margin: "0px" });
  bodyWrap.appendChild(bodyCopy);

  overlay.append(coverWrap, bodyWrap);
  document.body.appendChild(overlay);
  arm({
    kind: "slide",
    slug,
    direction,
    pitch: source.pitch,
    overlay,
    coverWrap,
    bodyWrap,
    bodyOffset: bodyRect.top - rowRect.top,
  });
  return true;
}

// ─── Collapse (back to the landing page) ─────────────────────────────────────

/**
 * Copies the cover as it is now, ready to shrink into its place in the carousel,
 * and keeps a copy of the rest of the project page to dissolve underneath.
 */
export function beginCollapse(
  slug: string,
  rect: DOMRect,
  imageSrc: string,
  background: string,
  radius: string,
  page: HTMLElement | null,
) {
  if (prefersReducedMotion()) return false;

  let project: HTMLElement | null = null;
  if (page) {
    project = document.createElement("div");
    project.setAttribute("aria-hidden", "true");
    const width = document.documentElement.clientWidth;
    project.style.cssText = `position:fixed;left:0;top:${-window.scrollY}px;width:${width}px;z-index:89;pointer-events:none;overflow:hidden;height:${page.scrollHeight}px`;
    const contentWidth = getComputedStyle(page).getPropertyValue("--cw");
    if (contentWidth) project.style.setProperty("--cw", contentWidth);
    const copy = page.cloneNode(true) as HTMLElement;
    copy.removeAttribute("id");
    // The shrinking card replaces this one, so do not draw it twice
    copy.querySelectorAll<HTMLElement>("[data-cover]").forEach((el) => {
      el.style.visibility = "hidden";
    });
    project.appendChild(copy);
    document.body.appendChild(project);
  }

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
    `border-radius:${radius}`,
    "will-change:left,top,width,height",
  ].join(";");

  const backdrop = document.createElement("div");
  backdrop.style.cssText = `position:absolute;inset:0;background:${background};opacity:1`;

  const image = document.createElement("img");
  image.decoding = "sync";
  image.src = imageSrc;
  image.alt = "";
  image.draggable = false;
  image.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain";

  overlay.append(backdrop, image);
  document.body.appendChild(overlay);
  arm({ kind: "collapse", slug, overlay, backdrop, project });
  return true;
}

/** The project the landing page is being returned to, if it is returning to one. */
export function peekCollapseSlug(): string | null {
  return pending?.kind === "collapse" ? pending.slug : null;
}

/**
 * Called by the landing page's carousel as it mounts. Brings the cover down onto
 * the highlighted card in the carousel, and fades the page in around it.
 */
export function arriveHome(centre: HTMLElement | null, home: HTMLElement | null): boolean {
  const current = pending;
  if (!current || current.kind !== "collapse") return false;
  pending = null;
  window.clearTimeout(failsafe);

  // Only land on the card if it is the project we came from
  if (!centre || centre.dataset.centre !== current.slug) {
    current.project?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
    window.setTimeout(() => {
      current.overlay.remove();
      current.project?.remove();
    }, 320);
    return false;
  }

  // Make sure the landing spot is on screen before measuring it
  const margin = 24;
  const bottom = centre.getBoundingClientRect().bottom;
  if (bottom > window.innerHeight - margin) window.scrollBy(0, bottom - window.innerHeight + margin * 2);
  const to = centre.getBoundingClientRect();

  const mainImage = centre.querySelector<HTMLElement>("img");
  if (mainImage) mainImage.style.visibility = "hidden";

  const shrink = current.overlay.animate(
    [
      {
        left: current.overlay.style.left,
        top: current.overlay.style.top,
        width: current.overlay.style.width,
        height: current.overlay.style.height,
        borderRadius: current.overlay.style.borderRadius,
      },
      { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: "0px" },
    ],
    { duration: TRANSITION_MS, easing: EASE, fill: "forwards" },
  );
  // The cover's backdrop falls away as it settles back into the carousel
  current.backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: TRANSITION_MS * 0.7,
    easing: "ease-in",
    fill: "forwards",
  });
  // The project page dissolves while the landing page comes up behind it
  current.project?.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: TRANSITION_MS * 0.55,
    easing: "ease-out",
    fill: "forwards",
  });
  home?.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: TRANSITION_MS * 0.7,
    delay: TRANSITION_MS * 0.1,
    easing: "ease-out",
    fill: "backwards",
  });

  const done = () => {
    if (mainImage) mainImage.style.visibility = "";
    current.overlay.remove();
    current.project?.remove();
  };
  shrink.onfinish = done;
  shrink.oncancel = done;
  window.setTimeout(done, TRANSITION_MS + 600);
  return true;
}

// ─── Arrival ─────────────────────────────────────────────────────────────────

export interface Arrival {
  kind: "expand" | "slide" | "scrub" | "none";
  /** Slide only: 1 when the new page arrives from the right, -1 from the left. */
  direction: 1 | -1;
}

export interface ArrivalTargets {
  /** The cover card. */
  cover: HTMLElement | null;
  /** The full-width row around the cover and its neighbours. */
  row: HTMLElement | null;
  /** The strip inside that row which carries the covers. */
  strip: HTMLElement | null;
}

/**
 * Called by the project page as soon as it mounts (before it paints). Finishes
 * whichever transition is waiting for this project and says how the page should
 * introduce itself.
 */
export function arrive(slug: string, targets: ArrivalTargets): Arrival {
  const current = pending;
  if (!current || current.slug !== slug) {
    discard();
    return { kind: "none", direction: 1 };
  }
  pending = null;
  window.clearTimeout(failsafe);

  if (current.kind === "scrub") {
    const { overlay } = current;
    window.scrollTo(0, current.scrollTop);
    const to = targets.cover?.getBoundingClientRect();
    const from = overlay.getBoundingClientRect();
    const off = to ? Math.max(Math.abs(to.left - from.left), Math.abs(to.top - from.top), Math.abs(to.width - from.width)) : 0;
    if (to && off > 1) {
      // The landing page only estimated where the cover would be: settle onto it
      const settle = overlay.animate(
        [{}, { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` }],
        { duration: 220, easing: "ease-out", fill: "forwards" },
      );
      settle.onfinish = () => overlay.remove();
      window.setTimeout(() => overlay.remove(), 600);
    } else {
      // Identical to the cover underneath: let it paint once, then step aside
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.remove()));
    }
    return { kind: "scrub", direction: 1 };
  }

  if (current.kind === "expand" && targets.cover) {
    const { cover } = targets;
    cover.style.visibility = "hidden";
    // Start from the card's own box: the overlay may still carry the hover tilt
    const start = {
      left: current.overlay.style.left,
      top: current.overlay.style.top,
      width: current.overlay.style.width,
      height: current.overlay.style.height,
    };
    const to = cover.getBoundingClientRect();
    // The wrapper is square; the rounded card is its first child
    const card = (cover.firstElementChild as HTMLElement | null) ?? cover;
    const radius = getComputedStyle(card).borderTopLeftRadius || "24px";

    const grow = current.overlay.animate(
      [
        { ...start, borderRadius: "0px", transform: noTransform(current.tilt) ? "none" : current.tilt },
        { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px`, borderRadius: radius, transform: "none" },
      ],
      { duration: TRANSITION_MS, easing: EASE, fill: "forwards" },
    );
    current.backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: TRANSITION_MS * 0.7,
      easing: "ease-out",
      fill: "forwards",
    });
    // The rest of the landing page dissolves instead of vanishing
    current.home?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: TRANSITION_MS * 0.55,
      easing: "ease-out",
      fill: "forwards",
    });

    const done = () => {
      cover.style.visibility = "";
      current.overlay.remove();
      current.home?.remove();
    };
    grow.onfinish = done;
    grow.oncancel = done;
    window.setTimeout(done, TRANSITION_MS + 600);
    return { kind: "expand", direction: 1 };
  }

  if (current.kind === "slide" && targets.row) {
    const { direction, pitch, overlay, coverWrap, bodyWrap, bodyOffset } = current;
    // Line the copies up with where the new page really is (it starts at the top)
    const rowTop = targets.row.getBoundingClientRect().top;
    coverWrap.style.top = `${rowTop}px`;
    bodyWrap.style.top = `${rowTop + bodyOffset}px`;

    const options: KeyframeAnimationOptions = { duration: TRANSITION_MS, easing: EASE, fill: "forwards" };
    const oldStrip = coverWrap.querySelector<HTMLElement>("[data-strip]");
    const exit = oldStrip?.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${-direction * pitch}px)` }],
      options,
    );
    targets.strip?.animate(
      [{ transform: `translateX(${direction * pitch}px)` }, { transform: "translateX(0)" }],
      { duration: TRANSITION_MS, easing: EASE },
    );
    bodyWrap.animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: `translateX(${-direction * 60}px)` },
      ],
      { duration: TRANSITION_MS * 0.45, easing: "ease-out", fill: "forwards" },
    );

    const done = () => overlay.remove();
    if (exit) {
      exit.onfinish = done;
      exit.oncancel = done;
    }
    window.setTimeout(done, TRANSITION_MS + 600);
    return { kind: "slide", direction };
  }

  discard();
  return { kind: "none", direction: 1 };
}
