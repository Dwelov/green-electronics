"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PaginationHUD } from "@/components/pagination-hud";
import { SiteHeader } from "@/components/site-header";
import { IbtidaSection } from "@/components/sections/ibtida-section";
import { PehchanSection } from "@/components/sections/pehchan-section";
import { RabtaSection } from "@/components/sections/rabta-section";
import { useFullpageNavigation } from "@/hooks/use-fullpage-navigation";

const ROUTES = ["/", "/pehchan", "/rabta"] as const;
const SECTION_COUNT = ROUTES.length;
const COMPACT_VIEWPORT_QUERY = "(max-height: 560px)";

type PresentationOrchestratorProps = {
  initialIndex?: number;
};

type HistoryMode = "replace" | "push";

function clampSectionIndex(index: number): number {
  return Math.max(0, Math.min(SECTION_COUNT - 1, index));
}

function resolveIndexFromPath(pathname: string): number | null {
  const index = ROUTES.indexOf(pathname as (typeof ROUTES)[number]);
  return index === -1 ? null : index;
}

function subscribeToCompactViewport(onChange: () => void) {
  const query = window.matchMedia(COMPACT_VIEWPORT_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getCompactViewportSnapshot() {
  return window.matchMedia(COMPACT_VIEWPORT_QUERY).matches;
}

function getCompactViewportServerSnapshot() {
  return false;
}

export function PresentationOrchestrator({
  initialIndex = 0,
}: PresentationOrchestratorProps) {
  const [activeIndex, setActiveIndex] = useState(() =>
    clampSectionIndex(initialIndex),
  );
  const isCompactViewport = useSyncExternalStore(
    subscribeToCompactViewport,
    getCompactViewportSnapshot,
    getCompactViewportServerSnapshot,
  );

  const activeIndexRef = useRef(activeIndex);
  const isCompactViewportRef = useRef(isCompactViewport);
  const rabtaScrollRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isCompactViewportRef.current = isCompactViewport;
  }, [isCompactViewport]);

  /**
   * Applies a section change, keeps the address bar in sync, and (on short
   * viewports) scrolls the natural-flow document instead of translating it.
   */
  const commitSection = useCallback(
    (index: number, historyMode: HistoryMode) => {
      const nextIndex = clampSectionIndex(index);

      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      if (isCompactViewportRef.current) {
        slideRefs.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      if (typeof window === "undefined") return;

      const targetPath = ROUTES[nextIndex];
      if (window.location.pathname === targetPath) return;

      const currentState =
        typeof window.history.state === "object" &&
        window.history.state !== null
          ? (window.history.state as Record<string, unknown>)
          : {};
      const nextState = { ...currentState, sectionIndex: nextIndex };

      if (historyMode === "push") {
        window.history.pushState(nextState, "", targetPath);
      } else {
        window.history.replaceState(nextState, "", targetPath);
      }
    },
    [],
  );

  const handleStepNavigate = useCallback(
    (index: number) => commitSection(index, "replace"),
    [commitSection],
  );

  const handleDirectNavigate = useCallback(
    (index: number) => commitSection(index, "push"),
    [commitSection],
  );

  const getActiveScrollContainer = useCallback(() => {
    if (activeIndexRef.current !== 2) return null;
    return rabtaScrollRef.current;
  }, []);

  useFullpageNavigation({
    activeIndex,
    sectionCount: SECTION_COUNT,
    onNavigate: handleStepNavigate,
    getScrollContainer: getActiveScrollContainer,
    enabled: !isCompactViewport,
  });

  useEffect(() => {
    const handlePopState = () => {
      const index = resolveIndexFromPath(window.location.pathname);
      if (index === null) return;

      activeIndexRef.current = index;
      setActiveIndex(index);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const sliderStyle = isCompactViewport
    ? undefined
    : { transform: `translate3d(0, -${activeIndex * 100}%, 0)` };

  return (
    <div
      aria-label="Green Electronics Interactive Presentation"
      className={
        isCompactViewport
          ? "relative w-full bg-chalk"
          : "fixed inset-0 h-[100dvh] w-full overflow-hidden overscroll-none bg-chalk"
      }
      role="region"
    >
      <SiteHeader
        activeIndex={activeIndex}
        onNavigate={handleDirectNavigate}
      />

      <div
        className={
          isCompactViewport
            ? "w-full"
            : "h-full w-full will-change-transform transition-transform duration-[750ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        }
        style={sliderStyle}
      >
        <div
          aria-label="Section 1 of 3"
          aria-roledescription="slide"
          className={
            isCompactViewport
              ? "w-full"
              : "h-[100dvh] w-full shrink-0 overflow-hidden"
          }
          inert={!isCompactViewport && activeIndex !== 0}
          ref={(node) => {
            slideRefs.current[0] = node;
          }}
          role="group"
        >
          <IbtidaSection
            className={isCompactViewport ? "min-h-[100dvh]" : "h-full"}
            isActive={activeIndex === 0}
          />
        </div>

        <div
          aria-label="Section 2 of 3"
          aria-roledescription="slide"
          className={
            isCompactViewport
              ? "w-full"
              : "h-[100dvh] w-full shrink-0 overflow-hidden"
          }
          inert={!isCompactViewport && activeIndex !== 1}
          ref={(node) => {
            slideRefs.current[1] = node;
          }}
          role="group"
        >
          <PehchanSection
            className={isCompactViewport ? "min-h-[100dvh]" : "h-full"}
          />
        </div>

        <div
          aria-label="Section 3 of 3"
          aria-roledescription="slide"
          className={
            isCompactViewport
              ? "w-full"
              : "h-[100dvh] w-full shrink-0 overflow-hidden"
          }
          inert={!isCompactViewport && activeIndex !== 2}
          ref={(node) => {
            slideRefs.current[2] = node;
          }}
          role="group"
        >
          <RabtaSection
            className={
              isCompactViewport ? "min-h-[100dvh]" : "h-full overflow-y-auto"
            }
            scrollRef={rabtaScrollRef}
          />
        </div>
      </div>

      <PaginationHUD
        activeIndex={activeIndex}
        onSelect={handleDirectNavigate}
      />
    </div>
  );
}
