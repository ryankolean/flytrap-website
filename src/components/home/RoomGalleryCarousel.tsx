'use client';

// RoomGalleryCarousel.tsx
// Horizontal carousel of the five hero-rotation fly paintings.
// Painting name revealed on hover/tap.
// Used by TheRoom.tsx (server component hands data down).
// from plan Task 11.

import { useRef, useState } from 'react';

interface CarouselPainting {
  _id: string;
  title: string;
  imageUrl: string;
  alt: string;
}

interface RoomGalleryCarouselProps {
  paintings: CarouselPainting[];
}

export function RoomGalleryCarousel({ paintings }: RoomGalleryCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  if (paintings.length === 0) {
    // Graceful empty state — Sanity not yet populated.
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-[color:var(--color-bar-fog)]/30">
        <p className="font-serif text-sm italic text-[color:var(--color-checker-black)]/40">
          Paintings coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <ul
        ref={listRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Fly painting gallery"
      >
        {paintings.map((painting) => (
          <li
            key={painting._id}
            className="relative flex-none snap-start"
            style={{ width: 'min(72vw, 280px)' }}
          >
            <button
              onMouseEnter={() => setHoveredId(painting._id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(painting._id)}
              onBlur={() => setHoveredId(null)}
              className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-marble-gold)]"
              aria-label={painting.title}
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-[color:var(--color-bar-fog)]/30">
                <img
                  src={painting.imageUrl}
                  alt={painting.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              {/* Title overlay — visible on hover/focus */}
              <div
                className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-8 transition-opacity duration-200"
                style={{
                  opacity: hoveredId === painting._id ? 1 : 0,
                }}
                aria-hidden="true"
              >
                <span className="font-serif text-sm font-semibold text-[color:var(--color-cream-paper)]">
                  {painting.title}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Scroll hint fade on right edge */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[color:var(--color-cream-paper)]/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

export default RoomGalleryCarousel;
