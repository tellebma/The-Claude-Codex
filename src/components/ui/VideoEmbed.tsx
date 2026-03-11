"use client";

import { useState } from "react";

type VideoEmbedProps = {
  /** YouTube video ID (the part after ?v= in the URL) */
  videoId: string;
  /** Accessible title for the video */
  title: string;
  /** Optional caption displayed below the video */
  caption?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Lazy-loading YouTube embed with a click-to-play placeholder.
 * The iframe is only inserted into the DOM after the user clicks,
 * avoiding heavy network requests on page load.
 */
export function VideoEmbed({
  videoId,
  title,
  caption,
  className = "",
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <figure className={`my-6 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
        {/* Aspect ratio wrapper — 16:9 */}
        <div className="relative aspect-video w-full">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex w-full items-center justify-center bg-slate-900"
              aria-label={`Lancer la vidéo : ${title}`}
            >
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl}
                alt={`Miniature de la vidéo : ${title}`}
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-90"
                loading="lazy"
              />

              {/* Play button overlay */}
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform duration-200 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 translate-x-0.5 text-white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
