"use client";

import { useState } from "react";

// Lightweight embed: shows the thumbnail until clicked, then loads the
// privacy-enhanced player (no YouTube cookies before the visitor opts in).
export default function YouTube({ id, title }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="video-frame">
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="video-poster" onClick={() => setPlay(true)} aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video-play">
            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l14 8-14 8z" fill="currentColor" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
