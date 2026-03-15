"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface TerminalLine {
  readonly text: string;
  readonly className?: string;
  /** Delay in ms before this line starts typing */
  readonly delay?: number;
}

interface TypingTerminalProps {
  readonly lines: readonly TerminalLine[];
  /** Typing speed in ms per character */
  readonly typingSpeed?: number;
}

export function TypingTerminal({
  lines,
  typingSpeed = 30,
}: TypingTerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show everything immediately if reduced motion is preferred
  useEffect(() => {
    if (prefersReduced) {
      setDisplayedLines(lines.map((l) => l.text));
      setCurrentLine(lines.length);
      setIsComplete(true);
    }
  }, [prefersReduced, lines]);

  // Typing animation loop
  useEffect(() => {
    if (prefersReduced || isComplete) return;
    if (currentLine >= lines.length) {
      setIsComplete(true);
      return;
    }

    const line = lines[currentLine];
    const delay =
      currentChar === 0 && line.delay ? line.delay : typingSpeed;

    timerRef.current = setTimeout(() => {
      if (currentChar < line.text.length) {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = line.text.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar((c) => c + 1);
      } else {
        // Move to next line
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
        setDisplayedLines((prev) => [...prev, ""]);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentLine, currentChar, isComplete, lines, typingSpeed, prefersReduced]);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        const text = displayedLines[i];
        if (text === undefined && i > currentLine) return null;

        return (
          <div key={i} className={line.className ?? "text-slate-400"}>
            {text ?? ""}
            {i === currentLine && !isComplete && (
              <span className="inline-block h-4 w-1.5 animate-pulse bg-brand-400 align-text-bottom" />
            )}
          </div>
        );
      })}
    </div>
  );
}
