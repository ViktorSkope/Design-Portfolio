// Interaction motion, shared by every page. The timings live in motion.css as tokens,
// and are repeated here for the Web Animations API.
//
// - Popups ease in and out. Dropdowns and popovers open in 200 ms, and exits are 20% shorter (160 ms).
// - Popovers start at 0.95, grow out of their trigger and shrink back into it.
// - List rows stagger by 30 ms, and details settle in one after another like notifications.
// - Shared objects keep one view-transition name, so a project's media carries across pages.

export const OPEN_MS = 200;
export const EXIT_MS = OPEN_MS * 0.8;
export const STAGGER_MS = 30;
const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";
const START_SCALE = 0.95;

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where the trigger sits, as a transform origin inside the popover. */
function originFrom(popover: HTMLElement, trigger?: Element | null) {
  if (!trigger) return "50% 50%";
  const t = trigger.getBoundingClientRect();
  const p = popover.getBoundingClientRect();
  return `${t.left + t.width / 2 - p.left}px ${t.top + t.height / 2 - p.top}px`;
}

const triggers = new WeakMap<HTMLDialogElement, Element | null>();
const closing = new WeakSet<HTMLDialogElement>();

/** Opens a modal dialog out of the element that asked for it. */
export function openPopover(dialog: HTMLDialogElement, trigger?: Element | null) {
  triggers.set(dialog, trigger ?? null);
  closing.delete(dialog);
  dialog.showModal();
  if (reducedMotion()) return;
  const transformOrigin = originFrom(dialog, trigger);
  dialog.animate(
    [
      { opacity: 0, transform: `scale(${START_SCALE})`, transformOrigin },
      { opacity: 1, transform: "scale(1)", transformOrigin },
    ],
    { duration: OPEN_MS, easing: EASE },
  );
  fadeBackdrop(dialog, [0, 1], OPEN_MS);
  settle(dialog.querySelectorAll(":scope [data-settle] > *"));
}

/** Shrinks the dialog back into its trigger, then closes it. */
export function closePopover(dialog: HTMLDialogElement) {
  if (!dialog.open || closing.has(dialog)) return;
  if (reducedMotion()) {
    dialog.close();
    return;
  }
  closing.add(dialog);
  const transformOrigin = originFrom(dialog, triggers.get(dialog));
  const out = dialog.animate(
    [
      { opacity: 1, transform: "scale(1)", transformOrigin },
      { opacity: 0, transform: `scale(${START_SCALE})`, transformOrigin },
    ],
    { duration: EXIT_MS, easing: EASE, fill: "forwards" },
  );
  fadeBackdrop(dialog, [1, 0], EXIT_MS);
  const done = () => {
    if (!closing.has(dialog)) return;
    closing.delete(dialog);
    dialog.close();
    out.cancel();
  };
  out.finished.catch(() => {}).then(done);
  // Animations stall in hidden pages; the dialog still closes on time
  setTimeout(done, EXIT_MS + 50);
}

function fadeBackdrop(dialog: HTMLDialogElement, [from, to]: [number, number], duration: number) {
  try {
    dialog.animate([{ opacity: from }, { opacity: to }], { duration, easing: EASE, fill: "forwards", pseudoElement: "::backdrop" }).finished.then(
      (a) => a.cancel(),
      () => {},
    );
  } catch {
    // Browsers that can't animate the backdrop just show it
  }
}

/** Escape and outside clicks close with the same exit. */
export function animateDialog(dialog: HTMLDialogElement) {
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    closePopover(dialog);
  });
}

/** A dropdown that grows from its trigger, open or closed. */
export function toggleDropdown(menu: HTMLElement, open: boolean, trigger?: Element | null) {
  const isOpen = menu.classList.contains("is-open");
  if (open === isOpen && !menu.dataset.closing) return;
  menu.getAnimations().forEach((a) => a.cancel());
  delete menu.dataset.closing;
  if (open) {
    menu.classList.add("is-open");
    if (reducedMotion()) return;
    const transformOrigin = originFrom(menu, trigger);
    menu.animate(
      [
        { opacity: 0, transform: `scale(${START_SCALE})`, transformOrigin },
        { opacity: 1, transform: "scale(1)", transformOrigin },
      ],
      { duration: OPEN_MS, easing: EASE },
    );
    settle(menu.children);
    return;
  }
  if (!isOpen) return;
  if (reducedMotion()) {
    menu.classList.remove("is-open");
    return;
  }
  menu.dataset.closing = "true";
  const transformOrigin = originFrom(menu, trigger);
  const out = menu.animate(
    [
      { opacity: 1, transform: "scale(1)", transformOrigin },
      { opacity: 0, transform: `scale(${START_SCALE})`, transformOrigin },
    ],
    { duration: EXIT_MS, easing: EASE, fill: "forwards" },
  );
  const done = () => {
    if (!menu.dataset.closing) return;
    delete menu.dataset.closing;
    menu.classList.remove("is-open");
    out.cancel();
  };
  out.finished.then(done, () => {});
  setTimeout(done, EXIT_MS + 50);
}

/** Rows and details arrive one after another, 30 ms apart, like stacked notifications. */
export function settle(items: Iterable<Element>) {
  if (reducedMotion()) return;
  let i = 0;
  for (const el of items) {
    if (!(el instanceof HTMLElement) || el.hidden) continue;
    el.animate(
      [
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: OPEN_MS, delay: i * STAGGER_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" },
    );
    i++;
  }
}

// ─── Shared objects across pages ──────────────────────────────────────────────

export const SHARED_NAME = "project-media";

/** Runs a page change as a view transition, keeping one name on the shared object before and after. */
export function transitionPage(change: () => void, before: Element | null, after: () => Element | null) {
  type Transition = { finished: Promise<void>; ready: Promise<void>; skipTransition: () => void };
  const start = (document as Document & { startViewTransition?: (cb: () => void) => Transition }).startViewTransition;
  if (!start || reducedMotion() || document.hidden) {
    change();
    return;
  }
  if (before instanceof HTMLElement) before.style.viewTransitionName = SHARED_NAME;
  let changed = false;
  const transition = start.call(document, () => {
    changed = true;
    if (before instanceof HTMLElement) before.style.viewTransitionName = "";
    change();
    const target = after();
    if (target instanceof HTMLElement) target.style.viewTransitionName = SHARED_NAME;
  });
  const clear = () =>
    document.querySelectorAll<HTMLElement>("[style*='view-transition-name']").forEach((el) => (el.style.viewTransitionName = ""));
  transition.ready.catch(() => {});
  transition.finished.then(clear, clear);
  // The page must never wait on the animation: if no frame has come by now, change without it
  setTimeout(() => {
    if (!changed) transition.skipTransition();
  }, 300);
}
