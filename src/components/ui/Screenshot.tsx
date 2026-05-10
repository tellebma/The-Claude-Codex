"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ScreenshotProps = Readonly<{
  /** Path to the image (relative to /public) */
  src: string;
  /** Accessible alt text — required */
  alt: string;
  /** Optional caption displayed below the image */
  caption?: string;
  /** Intrinsic width of the image in pixels */
  width?: number;
  /** Intrinsic height of the image in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}>;

/**
 * Generic screenshot component with lightbox zoom on click and lazy loading.
 * Dark/light mode compatible.
 *
 * Accessibility:
 * - Focus moves to the close button when the lightbox opens (WCAG 2.4.3).
 * - Focus returns to the trigger button when the lightbox closes.
 * - Escape key closes the lightbox.
 * - Close button has a minimum 48×48px touch target (WCAG 2.5.5 AAA, AA recommended).
 * - Overlay click closes the lightbox; inner content click is trapped.
 */
export function Screenshot({
  src,
  alt,
  caption,
  width,
  height,
  className = "",
}: ScreenshotProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Refs for focus management
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    // Return focus to the element that opened the lightbox
    triggerRef.current?.focus();
  }, []);

  // Move focus to the close button when lightbox opens
  useEffect(() => {
    if (lightboxOpen) {
      // Defer to allow the DOM to render the close button first
      const id = setTimeout(() => closeButtonRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [lightboxOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  return (
    <>
      <figure className={`my-6 ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={openLightbox}
          className="group w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700"
          aria-label={`Agrandir l'image : ${alt}`}
          aria-haspopup="dialog"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            className="w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
          />
        </button>
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-slate-700 dark:text-slate-300">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Image agrandie : ${alt}`}
        >
          {/*
           * Invisible backdrop button — covers the overlay behind the
           * image + close button and handles the click-to-close UX via
           * a native <button> (satisfies Sonar S6847/S6848). Escape
           * closes via the document-level keydown listener above.
           */}
          <button
            type="button"
            aria-label="Fermer l'image agrandie (arrière-plan)"
            tabIndex={-1}
            onClick={closeLightbox}
            className="absolute inset-0 z-0 cursor-default"
            data-testid="lightbox-backdrop"
          />
          {/*
           * Close button — p-3 gives 24px icon + 12px padding on each axis = 48px touch target.
           * Meets WCAG 2.5.5 (44px minimum) on all sides.
           */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Fermer l'image agrandie"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/*
           * Image container — positioned above the backdrop button so
           * clicks on the image don't trigger close. z-10 > z-0 of the
           * backdrop button.
           */}
          <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            />
            {caption && (
              <p className="mt-3 text-center text-sm text-white/70">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
