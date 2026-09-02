// useResponsive - نظام متكامل للتحكم في التجاوب
import { useState, useEffect, useCallback } from "react";

type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";
type DeviceType = "phone" | "tablet" | "laptop" | "desktop";
type Orientation = "portrait" | "landscape";

interface ResponsiveState {
  breakpoint: Breakpoint;
  device: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  hasNotch: boolean;
  pixelRatio: number;
}

// Cache for SSR
let cachedState: ResponsiveState | null = null;

function getResponsiveState(): ResponsiveState {
  if (typeof window === "undefined") {
    return (
      cachedState || {
        breakpoint: "desktop",
        device: "laptop",
        orientation: "landscape",
        width: 1024,
        height: 768,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        hasNotch: false,
        pixelRatio: 1,
      }
    );
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation: Orientation = width > height ? "landscape" : "portrait";
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  let breakpoint: Breakpoint;
  if (width < 640) breakpoint = "mobile";
  else if (width < 1024) breakpoint = "tablet";
  else if (width < 1440) breakpoint = "desktop";
  else breakpoint = "wide";

  let device: DeviceType;
  if (width < 640) device = "phone";
  else if (width < 1024) device = "tablet";
  else if (width < 1440) device = "laptop";
  else device = "desktop";

  const hasNotch = window.matchMedia("(display-cutout: viewport-fit)").matches;

  const state: ResponsiveState = {
    breakpoint,
    device,
    orientation,
    width,
    height,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop" || breakpoint === "wide",
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
    isTouchDevice,
    hasNotch,
    pixelRatio: window.devicePixelRatio || 1,
  };

  cachedState = state;
  return state;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => getResponsiveState());

  useEffect(() => {
    let ticking = false;

    const handleResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setState(getResponsiveState());
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleOrientationChange = () => {
      setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return state;
}
