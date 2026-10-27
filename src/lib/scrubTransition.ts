import { getCoverBackground, type Project } from "../data/projects";

// Scroll-driven transition between the landing page and a project, in the
// spirit of Apple's product pages. Under the carousel sits the opening of the
// selected case study, laid out exactly as on its page. It scrolls like any
// text, so the reader never loses their place, while the carousel stays pinned
// and the selected card grows, frame by frame with the scroll, into the cover
// that sits above that text on the project page. At the end the project page
// takes over, scrolled so its cover and text are exactly where they were.

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

// Matches the project page's cover card
export const COVER_ASPECT = 1.588;
const COVER_RADIUS = 24;
// The "Back to work" line between the navbar and the cover, the gap after it,
// and the gap between the cover and the opening text
const BACK_LINK_HEIGHT = 24;
const COVER_GAP = 22;
const INTRO_GAP = 29;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ─── Where things sit on a project page ──────────────────────────────────────

export interface ProjectLayout {
  /** The cover, with the page scrolled to the top. */
  cover: Box;
  /** The top of the opening text, with the page scrolled to the top. */
  introTop: number;
}

const STORAGE_KEY = "project-layout";

/** Called by project pages, at the top of the page, so the landing page can aim exactly. */
export function rememberCoverBox(rect: DOMRect, introTop: number) {
  const box = { vw: window.innerWidth, left: rect.left, top: rect.top, width: rect.width, height: rect.height, introTop };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(box));
  } catch {
    // Private windows can refuse storage; the estimate below is close enough
  }
}

/** Where a project page puts its cover and opening text, scrolled to the top. */
export function projectLayout(): ProjectLayout {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && saved.vw === window.innerWidth) {
      const { left, top, width, height, introTop } = saved;
      return { cover: { left, top, width, height }, introTop };
    }
  } catch {
    // Fall through to the estimate
  }
  const width = Math.min(1000, window.innerWidth - 40);
  const left = (document.documentElement.clientWidth - width) / 2;
  const header = document.querySelector("header");
  const navBottom = header ? header.getBoundingClientRect().bottom + window.scrollY : 104;
  const cover = { left, top: navBottom + BACK_LINK_HEIGHT + COVER_GAP, width, height: width / COVER_ASPECT };
  return { cover, introTop: cover.top + cover.height + INTRO_GAP };
}

// ─── The card in between ─────────────────────────────────────────────────────

/**
 * A fixed copy of a project's card that can be drawn anywhere between the bare
 * carousel image and the finished cover card (backdrop, rounded corners and the
 * cover image framed exactly as the project page frames it).
 */
export function createScrubCard(project: Project) {
  const card = document.createElement("div");
  card.setAttribute("aria-hidden", "true");
  card.style.cssText =
    "position:fixed;z-index:90;overflow:hidden;pointer-events:none;will-change:left,top,width,height;left:0;top:0;width:0;height:0";

  const backdrop = document.createElement("div");
  backdrop.dataset.part = "backdrop";
  backdrop.style.cssText = `position:absolute;inset:0;background:${getCoverBackground(project)};opacity:0`;

  const carousel = document.createElement("img");
  carousel.dataset.part = "carousel";
  carousel.decoding = "sync";
  carousel.src = project.carouselImage ?? project.coverImage;
  carousel.alt = "";
  carousel.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:top";

  const cover = document.createElement("img");
  cover.dataset.part = "cover";
  cover.decoding = "sync";
  cover.src = project.coverImage;
  cover.alt = "";
  cover.style.cssText = `position:absolute;inset:0;width:100%;height:100%;box-sizing:border-box;opacity:0;${
    project.coverFill ? "object-fit:cover" : "object-fit:contain;padding:1.5%"
  }`;

  card.append(backdrop, carousel, cover);
  return card;
}

/** Draws the card \`t\` of the way (0 to 1) from the carousel box to the cover box. */
export function drawScrubCard(card: HTMLElement, t: number, from: Box, to: Box) {
  const width = lerp(from.width, to.width, t);
  // The carousel frame is a little taller than the cover; the image is pinned to its top
  const height = lerp(from.height, to.height, t);
  card.style.left = `${lerp(from.left, to.left, t)}px`;
  card.style.top = `${lerp(from.top, to.top, t)}px`;
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;
  card.style.borderRadius = `${COVER_RADIUS * t}px`;

  const part = (name: string) => card.querySelector<HTMLElement>(`[data-part="${name}"]`);
  const backdrop = clamp((t - 0.1) / 0.5);
  const swap = clamp((t - 0.55) / 0.35);
  const b = part("backdrop");
  const c = part("carousel");
  const v = part("cover");
  if (b) b.style.opacity = `${backdrop}`;
  if (c) c.style.opacity = `${1 - swap}`;
  if (v) v.style.opacity = `${swap}`;
}

/** Eases the scroll progress a little at both ends, so the card starts and lands softly. */
export const easeScrub = (p: number) => p * p * (3 - 2 * p);

/** Scrolls to the carousel, stopping before the runway so the card stays in place. */
export function scrollToWork() {
  const section = document.getElementById("work");
  const pinned = section?.querySelector<HTMLElement>("[data-work-pinned]");
  if (!section || !pinned) return;
  // A couple of pixels short of where the carousel pins, so nothing starts growing
  const restAt = Math.max(32, (parseFloat(pinned.style.top) || 0) + 2);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: window.scrollY + section.getBoundingClientRect().top - restAt,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}
