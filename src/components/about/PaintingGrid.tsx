'use client';

// PaintingGrid.tsx
// Full 17-painting catalog grid for /about.
// Dining-room pieces first; bathroom-context pieces under a divider.
// Click any card to open PaintingModal.
// from docs/06-capture-debrief.md (painting catalog, categories)
// and plan Task 11.

import { useState } from 'react';

import { PaintingModal } from './PaintingModal';

export interface Painting {
  _id: string;
  title: string;
  slug?: { current?: string };
  description?: string;
  inHeroRotation?: boolean;
  catalogOnly?: boolean;
  imageUrl?: string;
  alt?: string;
}

interface PaintingGridProps {
  paintings: Painting[];
}

// Bathroom-context pieces per CLAUDE.md constraint #8 and docs/06-capture-debrief.md §Catalog.
const BATHROOM_TITLES = [
  'Fly on the Toilet',
  'Bathroom Line',
  'Flies at Urinals',
];

function isBathroom(painting: Painting): boolean {
  return (
    painting.catalogOnly === true ||
    BATHROOM_TITLES.some((t) =>
      painting.title.toLowerCase().includes(t.toLowerCase())
    )
  );
}

function PaintingCard({
  painting,
  onClick,
}: {
  painting: Painting;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-[color:var(--color-checker-black)] text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-marble-gold)]"
      aria-label={`View ${painting.title}`}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {painting.imageUrl ? (
          <img
            src={painting.imageUrl}
            alt={painting.alt ?? painting.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-[color:var(--color-bar-fog)]"
            aria-hidden="true"
          >
            <span className="font-serif text-5xl text-[color:var(--color-cream-paper)]/20">~</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="px-3 pb-3 font-sans text-sm font-medium text-[color:var(--color-cream-paper)]">
            {painting.title}
          </span>
        </div>
      </div>
      <div className="px-3 py-3">
        <p className="font-serif text-sm font-semibold leading-snug text-[color:var(--color-cream-paper)]">
          {painting.title}
        </p>
        {painting.description && (
          <p className="mt-1 font-sans text-xs leading-relaxed text-[color:var(--color-cream-paper)]/60 line-clamp-2">
            {painting.description}
          </p>
        )}
      </div>
    </button>
  );
}

export function PaintingGrid({ paintings }: PaintingGridProps) {
  const [activePainting, setActivePainting] = useState<Painting | null>(null);

  const diningRoom = paintings.filter((p) => !isBathroom(p));
  const bathroom = paintings.filter((p) => isBathroom(p));

  return (
    <>
      {/* Dining-room collection */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {diningRoom.map((p) => (
          <PaintingCard
            key={p._id}
            painting={p}
            onClick={() => setActivePainting(p)}
          />
        ))}
      </div>

      {/* Bathroom-context pieces — separated per CLAUDE.md constraint #8 */}
      {bathroom.length > 0 && (
        <>
          <div className="mt-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-[color:var(--color-cream-paper)]/20" />
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-cream-paper)]/50">
              Also in the bathroom
            </h2>
            <div className="h-px flex-1 bg-[color:var(--color-cream-paper)]/20" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bathroom.map((p) => (
              <PaintingCard
                key={p._id}
                painting={p}
                onClick={() => setActivePainting(p)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {activePainting && (
        <PaintingModal
          painting={activePainting}
          onClose={() => setActivePainting(null)}
        />
      )}
    </>
  );
}

export default PaintingGrid;
