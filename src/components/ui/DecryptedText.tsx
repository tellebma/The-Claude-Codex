"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface DecryptedTextProps {
  readonly text: string;
  readonly className?: string;
  /** Characters used for the scramble effect */
  readonly chars?: string;
  /** Duration in ms */
  readonly duration?: number;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export function DecryptedText({
  text,
  className = "",
  chars = DEFAULT_CHARS,
  duration = 1000,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const revealCount = Math.floor(progress * text.length);

      const result = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealCount) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplayText(result);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(text);
        setHasAnimated(true);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, chars, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate, hasAnimated]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {displayText}
    </span>
  );
}
