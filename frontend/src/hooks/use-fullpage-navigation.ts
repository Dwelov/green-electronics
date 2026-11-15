"use client";

import { useEffect, useRef } from "react";

/**
 * Gesture engine for the full-page presentation.
 *
 * Wheel deltas are accumulated per direction because trackpads and inertia
 * wheels emit dozens of tiny events per stroke. A single transition is armed
 * once the accumulated magnitude crosses the threshold, after which a kinetic
 * lock absorbs the remainder of the gesture so one flick can never skip a
 * section. Touch swipes use displacement/velocity, and arrow keys step one
 * section at a time.
 */

export const WHEEL_NAVIGATION_THRESHOLD = 40;
export const KINETIC_LOCK_DURATION_MS = 800;
export const GESTURE_IDLE_RESET_MS = 150;
export const TOUCH_DISTANCE_THRESHOLD = 50;
export const TOUCH_VELOCITY_THRESHOLD = 0.3;
export const TOUCH_MIN_DISTANCE_WITH_VELOCITY = 25;

const KEYBOARD_SCROLL_STEP = 120;

type UseFullpageNavigationOptions = {
  activeIndex: number;
  sectionCount: number;
  onNavigate: (index: number) => void;
  /** Returns the scroll container of the active section, if it has one. */
  getScrollContainer: () => HTMLElement | null;
  enabled?: boolean;
  /** While true, swallow gestures so a page transition cannot be interrupted. */
  locked?: boolean;
};

function normalizeWheelDelta(event: WheelEvent): number {
  if (event.deltaMode === 1) return event.deltaY * 24;
  if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
  );
}

export function useFullpageNavigation({
  activeIndex,
  sectionCount,
  onNavigate,
  getScrollContainer,
  enabled = true,
  locked = false,
}: UseFullpageNavigationOptions) {
  const activeIndexRef = useRef(activeIndex);
  const sectionCountRef = useRef(sectionCount);
  const onNavigateRef = useRef(onNavigate);
  const getScrollContainerRef = useRef(getScrollContainer);
  const isLockedOutRef = useRef(locked);

  const isLockedRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const lockTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    sectionCountRef.current = sectionCount;
  }, [sectionCount]);

  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

  useEffect(() => {
    getScrollContainerRef.current = getScrollContainer;
  }, [getScrollContainer]);

  useEffect(() => {
    isLockedOutRef.current = locked;
  }, [locked]);

  useEffect(() => {
    if (!enabled) return;

    const engageLock = () => {
      accumulatedDeltaRef.current = 0;
      isLockedRef.current = true;

      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = window.setTimeout(() => {
        isLockedRef.current = false;
        lockTimerRef.current = null;
      }, KINETIC_LOCK_DURATION_MS);
    };

    const requestStep = (direction: 1 | -1) => {
      if (isLockedRef.current) return;

      const nextIndex = activeIndexRef.current + direction;
      if (nextIndex < 0 || nextIndex >= sectionCountRef.current) {
        engageLock();
        return;
      }

      onNavigateRef.current(nextIndex);
      engageLock();
    };

    const requestAbsolute = (index: number) => {
      if (isLockedRef.current) return;
      if (index === activeIndexRef.current) return;

      onNavigateRef.current(index);
      engageLock();
    };

    const canScrollNatively = (deltaY: number): boolean => {
      const container = getScrollContainerRef.current();
      if (!container) return false;
      if (container.scrollHeight <= container.clientHeight + 4) return false;

      if (deltaY > 0) {
        const remaining =
          container.scrollHeight -
          (container.scrollTop + container.clientHeight);
        return remaining > 2;
      }

      return deltaY < 0 && container.scrollTop > 2;
    };

    const scrollContainerBy = (deltaY: number): boolean => {
      const container = getScrollContainerRef.current();
      if (!container) return false;
      if (container.scrollHeight <= container.clientHeight + 4) return false;

      if (deltaY > 0) {
        const remaining =
          container.scrollHeight -
          (container.scrollTop + container.clientHeight);
        if (remaining <= 2) return false;
        container.scrollBy({
          top: Math.min(remaining, deltaY),
          behavior: "smooth",
        });
        return true;
      }

      if (deltaY < 0) {
        if (container.scrollTop <= 2) return false;
        container.scrollBy({
          top: Math.max(-container.scrollTop, deltaY),
          behavior: "smooth",
        });
        return true;
      }

      return false;
    };

    const handleWheel = (event: WheelEvent) => {
      if (isLockedOutRef.current) {
        event.preventDefault();
        return;
      }

      const delta = normalizeWheelDelta(event);
      if (delta === 0) return;

      // Absorb the tail of the previous gesture, including its momentum.
      if (isLockedRef.current) {
        event.preventDefault();
        return;
      }

      // Nested sections (Rabta) own the gesture until they hit a boundary.
      if (canScrollNatively(delta)) {
        accumulatedDeltaRef.current = 0;
        return;
      }

      event.preventDefault();

      if (Math.sign(delta) !== Math.sign(accumulatedDeltaRef.current)) {
        accumulatedDeltaRef.current = 0;
      }
      accumulatedDeltaRef.current += delta;

      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = window.setTimeout(() => {
        accumulatedDeltaRef.current = 0;
        idleTimerRef.current = null;
      }, GESTURE_IDLE_RESET_MS);

      if (
        Math.abs(accumulatedDeltaRef.current) < WHEEL_NAVIGATION_THRESHOLD
      ) {
        return;
      }

      requestStep(accumulatedDeltaRef.current > 0 ? 1 : -1);
    };

    let touchStartY = 0;
    let touchStartTime = 0;
    let touchStartScrollTop = 0;
    let touchStartRemaining = 0;
    let touchStartHasContainer = false;

    const handleTouchStart = (event: TouchEvent) => {
      if (isLockedOutRef.current) return;
      if (event.touches.length !== 1) return;

      const container = getScrollContainerRef.current();
      touchStartHasContainer = container !== null;
      touchStartY = event.touches[0].clientY;
      touchStartTime = performance.now();
      touchStartScrollTop = container ? container.scrollTop : 0;
      touchStartRemaining = container
        ? container.scrollHeight - (container.scrollTop + container.clientHeight)
        : 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isLockedOutRef.current) return;
      const touch = event.changedTouches[0];
      if (!touch) return;

      const deltaY = touch.clientY - touchStartY;
      const elapsed = Math.max(1, performance.now() - touchStartTime);
      const velocity = Math.abs(deltaY) / elapsed;
      const qualifies =
        Math.abs(deltaY) >= TOUCH_DISTANCE_THRESHOLD ||
        (Math.abs(deltaY) >= TOUCH_MIN_DISTANCE_WITH_VELOCITY &&
          velocity > TOUCH_VELOCITY_THRESHOLD);

      if (!qualifies) return;

      // Swallowing a swipe that already scrolled the section would double-fire.
      if (touchStartHasContainer) {
        if (deltaY < 0 && touchStartRemaining > 2) return;
        if (deltaY > 0 && touchStartScrollTop > 2) return;
      }

      requestStep(deltaY < 0 ? 1 : -1);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLockedOutRef.current) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      const isSpace = event.key === " " || event.key === "Spacebar";
      if (
        isSpace &&
        event.target instanceof HTMLElement &&
        /^(BUTTON|A)$/.test(event.target.tagName)
      ) {
        return;
      }

      let direction: 1 | -1 | null = null;
      let scrollAmount = KEYBOARD_SCROLL_STEP;

      switch (event.key) {
        case "ArrowDown":
          direction = 1;
          break;
        case "PageDown":
          direction = 1;
          scrollAmount = window.innerHeight * 0.8;
          break;
        case " ":
        case "Spacebar":
          direction = event.shiftKey ? -1 : 1;
          scrollAmount = window.innerHeight * 0.8;
          break;
        case "ArrowUp":
          direction = -1;
          break;
        case "PageUp":
          direction = -1;
          scrollAmount = window.innerHeight * 0.8;
          break;
        case "Home":
          event.preventDefault();
          requestAbsolute(0);
          return;
        case "End":
          event.preventDefault();
          requestAbsolute(sectionCountRef.current - 1);
          return;
        default:
          return;
      }

      // Arrow keys scroll overflowing sections before they change slides.
      if (scrollContainerBy(direction * scrollAmount)) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      requestStep(direction);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);

      if (lockTimerRef.current !== null) window.clearTimeout(lockTimerRef.current);
      if (idleTimerRef.current !== null) window.clearTimeout(idleTimerRef.current);
      lockTimerRef.current = null;
      idleTimerRef.current = null;
      isLockedRef.current = false;
      accumulatedDeltaRef.current = 0;
    };
  }, [enabled]);
}
