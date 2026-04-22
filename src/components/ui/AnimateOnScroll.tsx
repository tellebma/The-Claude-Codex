"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variant,
} from "framer-motion";

type AnimationPreset =
  | "fade-up"
  | "fade-in"
  | "fade-left"
  | "fade-right"
  | "scale";

interface AnimateOnScrollProps {
  readonly children: React.ReactNode;
  /** Animation preset to use */
  readonly preset?: AnimationPreset;
  /** Delay in seconds before animation starts */
  readonly delay?: number;
  /** Duration of the animation in seconds */
  readonly duration?: number;
  /** How much of the element must be visible to trigger (0-1) */
  readonly threshold?: number;
  /** Whether to animate only once or every time element enters viewport */
  readonly once?: boolean;
  /** Additional CSS class names */
  readonly className?: string;
  /** HTML tag to render as */
  readonly as?:
    | "div"
    | "section"
    | "article"
    | "aside"
    | "header"
    | "footer"
    | "span";
}

const presets: Record<AnimationPreset, { hidden: Variant; visible: Variant }> = {
  "fade-up": {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

/**
 * Wrapper component that animates children when they scroll into view.
 * Respects `prefers-reduced-motion` by showing content immediately without animation.
 */
export function AnimateOnScroll({
  children,
  preset = "fade-up",
  delay = 0,
  duration = 0.5,
  threshold = 0.15,
  once = true,
  className,
  as = "div",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });
  const prefersReducedMotion = useReducedMotion();

  const { hidden, visible } = presets[preset];

  const MotionComponent = motion[as];

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return (
      <MotionComponent ref={ref} className={className}>
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden,
        visible: {
          ...visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
      style={{
        willChange: isInView ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </MotionComponent>
  );
}

/**
 * Wrapper that staggers children animations.
 * Each child animates with an incremental delay.
 * Respects `prefers-reduced-motion`.
 */
interface StaggerChildrenProps {
  readonly children: React.ReactNode;
  /** Delay between each child animation in seconds */
  readonly staggerDelay?: number;
  /** Base delay before the first child starts */
  readonly baseDelay?: number;
  /** Duration of each child animation */
  readonly duration?: number;
  /** Additional CSS class names */
  readonly className?: string;
  /** Whether to animate only once */
  readonly once?: boolean;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  baseDelay = 0,
  duration = 0.5,
  className,
  once = true,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.1,
  });
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: baseDelay,
          },
        },
      }}
      className={className}
    >
      <StaggerItemsRenderer duration={duration}>
        {children}
      </StaggerItemsRenderer>
    </motion.div>
  );
}

function StaggerItemsRenderer({
  children,
  duration,
}: {
  readonly children: React.ReactNode;
  readonly duration: number;
}) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, index) => {
            // Honor existing React keys if the caller provided them; fall
            // back to a prefixed index for primitive/unkeyed children. The
            // prefix makes the fallback explicit (Sonar S6479).
            const childKey =
              (child as { key?: React.Key | null } | null)?.key ??
              `stagger-item-${index}`;
            return (
              <motion.div
                key={childKey}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  },
                }}
              >
                {child}
              </motion.div>
            );
          })
        : children}
    </>
  );
}
