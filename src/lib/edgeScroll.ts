import { useEffect, useRef } from "react";

// Pushing past the end of a page in one fresh gesture moves on to the next page:
// scrolling down at the bottom of the landing page opens the selected project,
// and scrolling up at the top of a project page goes back to the work.
//
// Only a gesture that *starts* at the edge counts, so the momentum of the
// scroll that reached the edge cannot carry the visitor away by accident.

const GESTURE_GAP_MS = 250; // a pause this long starts a new gesture
const WHEEL_DISTANCE = 140;
const TOUCH_DISTANCE = 80;
const SETTLE_MS = 1200; // ignore everything just after the page appears

export function useEdgeScroll(
  edge: "top" | "bottom",
  onTrigger: () => void,
  { touch = true }: { touch?: boolean } = {},
) {
  const trigger = useRef(onTrigger);
  useEffect(() => {
    trigger.current = onTrigger;
  });

  useEffect(() => {
    const mountedAt = performance.now();
    const sign = edge === "bottom" ? 1 : -1;
    const atEdge = () =>
      edge === "bottom"
        ? window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        : window.scrollY <= 0;
    // Something else (a dialog, a transition) has taken over scrolling
    const blocked = () =>
      performance.now() - mountedAt < SETTLE_MS || document.body.style.overflow === "hidden";

    let startedAtEdge = false;
    let travelled = 0;
    let lastWheel = 0;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      trigger.current();
    };

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheel > GESTURE_GAP_MS) {
        startedAtEdge = atEdge();
        travelled = 0;
      }
      lastWheel = now;
      if (!startedAtEdge || blocked() || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // Scrolling back the other way cancels the gesture
      if (Math.sign(e.deltaY) !== sign) {
        startedAtEdge = false;
        return;
      }
      travelled += Math.abs(e.deltaY);
      if (travelled > WHEEL_DISTANCE) fire();
    };

    let touchStartY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = atEdge() && !blocked() ? e.touches[0].clientY : null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const pulled = (touchStartY - e.touches[0].clientY) * sign;
      if (pulled > TOUCH_DISTANCE) {
        touchStartY = null;
        fire();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    if (touch) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [edge, touch]);
}
