// Reusable Framer Motion animation variants — World-Class System
import type { Variants, Transition } from "motion/react";

// ─── Premium Easing Curves ──────────────────────────────────────────────────
export const easings = {
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  quart: [0.25, 1, 0.5, 1] as [number, number, number, number],
  inOutQuart: [0.76, 0, 0.24, 1] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
};

// ─── Page / Section Transitions ──────────────────────────────────────────────
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easings.expo } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: easings.quart } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easings.expo } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easings.expo } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: easings.expo } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.3 } },
};

// ─── Scroll-triggered Variants (whileInView) ─────────────────────────────────
export const scrollFadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easings.expo },
  },
};

export const scrollFadeIn: Variants = {
  initial: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easings.quart },
  },
};

export const scrollScaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easings.expo },
  },
};

export const scrollSlideRight: Variants = {
  initial: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easings.expo },
  },
};

export const scrollSlideLeft: Variants = {
  initial: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easings.expo },
  },
};

// ─── Stagger Containers ──────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  initial: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  initial: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export const staggerContainerFast: Variants = {
  initial: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easings.quart },
  },
};

export const staggerItemScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easings.expo },
  },
};

// ─── Hover / Tap Interactions ────────────────────────────────────────────────
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: easings.quart } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: easings.quart } },
};

export const hoverLiftSubtle = {
  whileHover: { y: -2, transition: { duration: 0.2, ease: easings.quart } },
};

export const hoverLiftStrong = {
  whileHover: { y: -8, transition: { duration: 0.3, ease: easings.expo } },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 24px rgba(15, 76, 58, 0.2)",
    transition: { duration: 0.3 },
  },
};

export const hoverGlowGold = {
  whileHover: {
    boxShadow: "0 0 24px rgba(198, 158, 90, 0.25)",
    transition: { duration: 0.3 },
  },
};

// ─── Card Interactions ───────────────────────────────────────────────────────
export const cardHover = {
  whileHover: {
    y: -4,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.06), 0 16px 32px rgba(0, 0, 0, 0.08)",
    transition: { duration: 0.25, ease: easings.quart },
  },
};

export const cardHoverStrong = {
  whileHover: {
    y: -6,
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08), 0 24px 48px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: easings.expo },
  },
};

export const cardHoverScale = {
  whileHover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.25, ease: easings.quart },
  },
  whileTap: { scale: 0.98 },
};

// ─── Button Interactions ─────────────────────────────────────────────────────
export const buttonHover = {
  whileHover: { y: -1, transition: { duration: 0.15 } },
  whileTap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const buttonHoverLift = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

// ─── Shared Transitions ──────────────────────────────────────────────────────
export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};

export const smoothTransition: Transition = {
  duration: 0.3,
  ease: easings.quart,
};

export const pageTransition = {
  type: "tween" as const,
  ease: easings.expo,
  duration: 0.3,
};

// ─── Viewport Presets ────────────────────────────────────────────────────────
export const viewportOnce = { once: true, margin: "-50px" };
export const viewportAlways = { once: false, margin: "-50px" };
export const viewportNear = { once: true, margin: "-100px" };

// ─── Convenience Props Objects ───────────────────────────────────────────────
export const fadeInUpInView = {
  initial: "initial",
  whileInView: "visible",
  viewport: viewportOnce,
  variants: scrollFadeUp,
};

export const fadeInInView = {
  initial: "initial",
  whileInView: "visible",
  viewport: viewportOnce,
  variants: scrollFadeIn,
};

export const scaleInView = {
  initial: "initial",
  whileInView: "visible",
  viewport: viewportOnce,
  variants: scrollScaleIn,
};

export const staggerInView = {
  initial: "initial",
  whileInView: "visible",
  viewport: viewportOnce,
  variants: staggerContainer,
};

export const staggerInViewSlow = {
  initial: "initial",
  whileInView: "visible",
  viewport: viewportOnce,
  variants: staggerContainerSlow,
};

// ─── Page Transition Presets ─────────────────────────────────────────────────
export const pageTransitionUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: easings.expo },
};

export const pageTransitionFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.25 },
};

export const pageTransitionScale = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease: easings.expo },
};
