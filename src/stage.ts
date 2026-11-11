import { reducedMotion } from "./motion";

// The big rounded stage beside the text, shared by the landing page and the case studies.
// - On the landing page it is a timed carousel of projects: it holds each one for a few
//   seconds, then slides on to the next. The player below pauses it.
// - On a case study it follows the reading: the image changes to the one the paragraph
//   in view is talking about. The player's stop button fixes the image while scrolling.

const HOLD_MS = 6000;
const SLIDE_MS = 600;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

const PAUSE_ICON = `<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><rect x="1" y="0" width="4" height="16" rx="1" fill="currentColor"/><rect x="9" y="0" width="4" height="16" rx="1" fill="currentColor"/></svg>`;
const PLAY_ICON = `<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path d="M2 1.2v13.6a1 1 0 001.5.86l11-6.8a1 1 0 000-1.72l-11-6.8A1 1 0 002 1.2z" fill="currentColor"/></svg>`;

/** The player and arrows under the stage. */
export const stageControls = (count: number, stopLabel: string) => `
  <div class="stage__controls">
    <div class="player">
      <button type="button" class="player__toggle" data-toggle aria-pressed="false" aria-label="${stopLabel}">${PAUSE_ICON}</button>
      <div class="player__track" aria-hidden="true">${Array.from({ length: count }, () => `<span class="player__seg"><i></i></span>`).join("")}</div>
    </div>
    <div class="stage__arrows">
      <button type="button" class="round-btn" data-step="-1" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="round-btn" data-step="1" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
  </div>`;

interface Options {
  mode: "timer" | "scroll";
  start?: number;
  /** Called whenever another slide comes forward. */
  onChange?: (index: number) => void;
}

/** Brings a stage to life. Returns a function that stops it. */
export function mountStage(root: HTMLElement, { mode, start = 0, onChange }: Options) {
  const slides = [...root.querySelectorAll<HTMLElement>(".stage__slide")];
  const segs = [...root.querySelectorAll<HTMLElement>(".player__seg")];
  const toggle = root.querySelector<HTMLButtonElement>("[data-toggle]")!;
  const playLabel = mode === "timer" ? "Play" : "Follow the reading again";
  const stopLabel = toggle.getAttribute("aria-label")!;
  let current = -1;
  let stopped = false;

  const fill = (amount: number) => segs[current]?.style.setProperty("--fill", `${Math.min(1, Math.max(0, amount))}`);

  // Only the slide in front plays its recording
  const playActive = () =>
    slides.forEach((slide, i) =>
      slide.querySelectorAll("video").forEach((video) => {
        if (i === current && !reducedMotion()) video.play().catch(() => {});
        else video.pause();
      }),
    );

  // A panorama behind the slides travels from its left edge on the first slide to its
  // right edge on the last, slower than the slides moving over it
  const panFrame = root.querySelector<HTMLElement>(".stage__frame--panorama");
  const pan = () => panFrame?.style.setProperty("--pan", String(slides.length > 1 ? current / (slides.length - 1) : 0));

  const show = (index: number, direction?: number, animate = true) => {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;
    const dir = direction ?? Math.sign(next - current);
    const leaving = slides[current];
    current = next;
    const entering = slides[current];
    slides.forEach((slide) => slide.classList.toggle("is-active", slide === entering));
    if (mode === "timer") pan();
    segs.forEach((seg, i) => {
      seg.classList.toggle("is-active", i === current);
      seg.style.setProperty("--fill", "0");
    });
    if (animate && leaving && !reducedMotion() && !document.hidden) {
      // The outgoing slide moves off to one side while the next one follows it in
      leaving.classList.add("is-leaving");
      const out = leaving.animate([{ transform: "none" }, { transform: `translateX(${-dir * 100}%)` }], { duration: SLIDE_MS, easing: EASE });
      entering.animate([{ transform: `translateX(${dir * 100}%)` }, { transform: "none" }], { duration: SLIDE_MS, easing: EASE });
      const done = () => leaving.classList.remove("is-leaving");
      out.finished.then(done, done);
      setTimeout(done, SLIDE_MS + 50);
    }
    playActive();
    onChange?.(current);
  };

  const setStopped = (value: boolean) => {
    stopped = value;
    toggle.setAttribute("aria-pressed", String(value));
    toggle.setAttribute("aria-label", value ? playLabel : stopLabel);
    toggle.innerHTML = value ? PLAY_ICON : PAUSE_ICON;
    root.classList.toggle("is-stopped", value);
  };

  const cleanups: (() => void)[] = [];
  const inside = (e: Event, selector: string) => e.target instanceof Element && Boolean(e.target.closest(selector));
  const on = <K extends keyof WindowEventMap>(target: Window | HTMLElement, type: K, fn: (e: WindowEventMap[K]) => void) => {
    target.addEventListener(type, fn as EventListener, { passive: true });
    cleanups.push(() => target.removeEventListener(type, fn as EventListener));
  };

  show(start);

  if (mode === "timer") {
    // The bar under the slide fills while it is held, then the next one slides in
    let elapsed = 0;
    let last = 0;
    let frame = 0;
    const tick = (now: number) => {
      if (last && !stopped) elapsed += now - last;
      last = now;
      if (elapsed >= HOLD_MS) {
        elapsed = 0;
        show(current + 1, 1);
      }
      fill(elapsed / HOLD_MS);
      frame = requestAnimationFrame(tick);
    };
    if (reducedMotion()) setStopped(true);
    frame = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(frame));

    const restart = () => {
      elapsed = 0;
      fill(0);
    };
    on(root, "click", (e) => {
      const target = e.target as HTMLElement;
      const step = target.closest<HTMLElement>("[data-step]");
      if (step) {
        show(current + Number(step.dataset.step), Number(step.dataset.step));
        restart();
      } else if (target.closest("[data-toggle]")) setStopped(!stopped);
    });
    return {
      go(index: number) {
        show(index);
        restart();
      },
      stop: () => cleanups.forEach((fn) => fn()),
    };
  }

  // ─── Scroll mode: each paragraph names the slide it is about ─────────────────
  const blocks = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
  const frameEl = root.querySelector<HTMLElement>(".stage__frame")!;

  // On phones the page doesn't scroll: the paragraphs are cards in a row under the
  // stage, swiped sideways, and the card in view picks the slide
  const narrow = () => matchMedia("(max-width: 900px)").matches;
  const track = document.querySelector<HTMLElement>(".case-side");
  const cards = track ? ([...track.children] as HTMLElement[]) : [];
  const sceneOfCard = (card: HTMLElement | undefined) =>
    card?.dataset.scene ? Number(card.dataset.scene) : card === cards[0] ? 0 : Number(blocks[blocks.length - 1]?.dataset.scene ?? 0);
  // Where a card sits in the row, as the row's scroll position that brings it in
  const leftOf = (card: HTMLElement) => card.offsetLeft - (parseFloat(getComputedStyle(track!).paddingLeft) || 0);
  const cardAt = () => {
    if (!track) return 0;
    const at = (i: number) => Math.abs(leftOf(cards[i]) - track.scrollLeft);
    return cards.reduce((best, _, i) => (at(i) < at(best) ? i : best), 0);
  };
  const followCards = () => fill(1);
  const toCard = (index: number) => {
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    if (track && card) track.scrollTo({ left: leftOf(card), behavior: reducedMotion() ? "instant" : "smooth" });
  };

  // The line a paragraph has to reach to take over: mid-screen beside the stage,
  // and on phones a little below the stage pinned at the top
  const readingLine = () => {
    const below = frameEl.getBoundingClientRect().bottom;
    return matchMedia("(max-width: 900px)").matches ? below + (innerHeight - below) * 0.3 : innerHeight * 0.45;
  };

  // The slides move with the scroll itself, frame for frame: between two paragraphs
  // the outgoing image and the incoming one share the frame in proportion to how far
  // the page has gone from one to the other
  // The next-project footer is a stop of its own only when it isn't already part of
  // the last section
  const footer = () => {
    const el = document.querySelector<HTMLElement>(".case-side__next");
    return el && !el.closest("[data-scene]") ? el : null;
  };
  const markOf = (el: HTMLElement) => el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
  const anchors = (): [number, number][] => {
    const last = Number(blocks[blocks.length - 1]?.dataset.scene ?? 0);
    if (narrow() && track) return cards.map((card) => [leftOf(card), sceneOfCard(card)]);
    const max = document.documentElement.scrollHeight - innerHeight;
    const next = footer();
    const points: [number, number][] = [[0, 0], ...blocks.map((b): [number, number] => [markOf(b), Number(b.dataset.scene)])];
    if (next) points.push([markOf(next), last]);
    return points.map(([y, scene]): [number, number] => [Math.min(max, Math.max(0, y)), scene]);
  };
  const position = () => {
    const at = narrow() && track ? track.scrollLeft : scrollY;
    const points = anchors();
    if (!points.length) return 0;
    if (at <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
      const [y0, s0] = points[i - 1];
      const [y1, s1] = points[i];
      if (at <= y1) return y1 - y0 < 1 ? s1 : s0 + ((s1 - s0) * (at - y0)) / (y1 - y0);
    }
    return points[points.length - 1][1];
  };
  const release = () =>
    slides.forEach((slide) => {
      slide.style.transform = "";
      slide.style.visibility = "";
    });
  const scrub = () => {
    const at = position();
    show(Math.round(at), undefined, false);
    slides.forEach((slide, i) => {
      const offset = i - at;
      const inView = Math.abs(offset) < 0.995;
      slide.style.visibility = inView ? "visible" : "hidden";
      slide.style.transform = inView && Math.abs(offset) > 0.001 ? `translateX(${offset * 100}%)` : "";
    });
  };

  let frame = 0;
  const follow = () => {
    frame = 0;
    if (stopped) return;
    scrub();
    if (narrow()) {
      followCards();
      return;
    }
    const line = readingLine();
    const atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    let index = -1;
    blocks.forEach((block, i) => {
      if (block.getBoundingClientRect().top <= line) index = i;
    });
    if (atEnd) index = blocks.length - 1;
    const block = blocks[index];
    // The bar fills as the paragraph is read
    if (!block) {
      fill(0);
      return;
    }
    const top = block.getBoundingClientRect().top;
    const end = blocks[index + 1]?.getBoundingClientRect().top ?? block.getBoundingClientRect().bottom;
    fill(atEnd ? 1 : (line - top) / Math.max(1, end - top));
  };
  const schedule = () => follow();
  on(window, "scroll", schedule);
  on(window, "resize", schedule);
  if (track) on(track, "scroll", schedule);

  // The panorama moves with the scroll itself, frame for frame: the top of the page
  // shows its left edge, the end of the page its right edge
  const panWithScroll = () => {
    if (!panFrame) return;
    const progress =
      narrow() && track
        ? track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)
        : scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    panFrame.style.setProperty("--pan", String(Math.min(1, Math.max(0, progress))));
  };
  if (panFrame) {
    on(window, "scroll", panWithScroll);
    on(window, "resize", panWithScroll);
    if (track) on(track, "scroll", panWithScroll);
    panWithScroll();
  }
  cleanups.push(() => cancelAnimationFrame(frame));
  follow();

  // ─── Scrolling steps from paragraph to paragraph, never resting in between ───
  // Where the page rests: the top, each paragraph at the line where it takes over
  // (its scroll-margin-top), the next-project footer and the very bottom
  const stops = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const marks = [...blocks, footer()]
      .filter((el): el is HTMLElement => Boolean(el))
      .map(markOf);
    return [0, ...marks, max].map((y) => Math.round(Math.min(max, Math.max(0, y)))).filter((y, i, all) => i === 0 || y > all[i - 1] + 8);
  };
  const nearest = () => {
    const all = stops();
    return all.reduce((best, y, i) => (Math.abs(y - scrollY) < Math.abs(all[best] - scrollY) ? i : best), 0);
  };

  const GLIDE_MS = 700;
  let gliding = 0;
  let glideEnd = 0;
  const glideTo = (top: number) => {
    cancelAnimationFrame(gliding);
    const from = scrollY;
    if (Math.abs(top - from) < 2 || reducedMotion()) {
      window.scrollTo({ top, behavior: "instant" });
      return;
    }
    const start = performance.now();
    glideEnd = start + GLIDE_MS;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / GLIDE_MS);
      window.scrollTo({ top: from + (top - from) * ease(t), behavior: "instant" });
      if (t < 1) gliding = requestAnimationFrame(tick);
    };
    gliding = requestAnimationFrame(tick);
  };
  cleanups.push(() => cancelAnimationFrame(gliding));

  // One gesture moves one paragraph, and nothing moves while a glide is under way
  const stepBy = (dir: number) => {
    if (performance.now() < glideEnd) return;
    const all = stops();
    const target = dir > 0 ? all.find((y) => y > scrollY + 4) : [...all].reverse().find((y) => y < scrollY - 4);
    glideTo(target ?? all[nearest()]);
  };

  // A wheel or trackpad gesture is a run of events. Trackpads keep sending smaller and
  // smaller deltas for a second or more after the fingers lift; those belong to the
  // same gesture. A new one starts after a pause, a change of direction, or a delta
  // that jumps up again once the glide is over.
  const GESTURE_GAP_MS = 180;
  let lastAt = 0;
  let lastSize = 0;
  let lastDir = 0;
  let used = false;
  const onWheel = (e: WheelEvent) => {
    if (narrow() || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX) || inside(e, "dialog")) return;
    e.preventDefault();
    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1);
    const size = Math.abs(delta);
    const dir = Math.sign(delta);
    const now = performance.now();
    const fresh = now - lastAt > GESTURE_GAP_MS || dir !== lastDir || (now > glideEnd && size > lastSize * 1.5 + 8);
    lastAt = now;
    lastSize = size;
    lastDir = dir;
    if (fresh) used = now < glideEnd; // a gesture that starts mid-glide is let go entirely
    if (used || size < 2) return;
    used = true;
    stepBy(dir);
  };
  window.addEventListener("wheel", onWheel, { passive: false });
  cleanups.push(() => window.removeEventListener("wheel", onWheel));

  const KEYS: Record<string, number> = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
  const onKey = (e: KeyboardEvent) => {
    if (narrow() || inside(e, "input, textarea, select, dialog, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
    const dir = e.key === " " && e.shiftKey ? -1 : KEYS[e.key];
    if (dir) {
      e.preventDefault();
      stepBy(dir);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const all = stops();
      glideTo(e.key === "Home" ? 0 : all[all.length - 1]);
    }
  };
  window.addEventListener("keydown", onKey);
  cleanups.push(() => window.removeEventListener("keydown", onKey));

  // Touch: a swipe is one step, the page doesn't follow the finger in between
  let touchY: number | null = null;
  const onTouchStart = (e: TouchEvent) => {
    touchY = narrow() || inside(e, "dialog") ? null : e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (touchY !== null) e.preventDefault();
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY;
    touchY = null;
    if (Math.abs(dy) > 30) stepBy(Math.sign(dy));
  };
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  });

  // Dragging the scrollbar still lands on a paragraph once it lets go
  let settleTimer = 0;
  on(window, "scroll", () => {
    clearTimeout(settleTimer);
    if (narrow()) return;
    if (performance.now() < glideEnd + 50) return;
    settleTimer = window.setTimeout(() => {
      if (performance.now() < glideEnd + 50) return;
      const all = stops();
      const y = all[nearest()];
      if (Math.abs(y - scrollY) > 2) glideTo(y);
    }, 160);
  });
  cleanups.push(() => clearTimeout(settleTimer));

  on(root, "click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-toggle]")) {
      setStopped(!stopped);
      if (stopped) release();
      else follow();
      return;
    }
    const step = target.closest<HTMLElement>("[data-step]");
    if (!step) return;
    const scene = current + Number(step.dataset.step);
    // Stopped, the arrows only change the image; otherwise they take the reader there
    if (stopped) {
      show(scene, Number(step.dataset.step));
      return;
    }
    const wrapped = (scene + slides.length) % slides.length;
    if (narrow()) {
      // The first card about that slide, or the next card when the slide doesn't change
      const here = cardAt();
      const found = cards.findIndex((card) => sceneOfCard(card) === wrapped);
      toCard(Number(step.dataset.step) > 0 && found <= here ? here + 1 : found < 0 ? here - 1 : found);
      return;
    }
    const block = blocks.find((b) => Number(b.dataset.scene) === wrapped);
    glideTo(block && wrapped > 0 ? Math.max(0, Math.round(markOf(block))) : 0);
  });

  return { go: (index: number) => show(index), stop: () => cleanups.forEach((fn) => fn()) };
}
