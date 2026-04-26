// Buzzin' Since 2004 — the return story.
// Narrative facts pulled only from docs/01-design-document-v1.7.md §2 (timeline) and §9 Section 5.
// Voice-matched to the existing About-page register: "magnificent life", warm, theatrical, unhurried.
// Visual: Fly Art Class painting (the brand thesis in one image, per §9 Section 4).

import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface FlyArtClassPainting {
  imageUrl: string;
  alt: string;
}

interface SanityFlyArtClass {
  _id: string;
  title?: string;
  description?: string;
  image?: { asset?: { _ref?: string } } | null;
}

const flyArtClassQuery = `*[_type == "flyPainting" && title == "Fly Art Class"][0] {
  _id,
  title,
  description,
  image
}`;

async function fetchFlyArtClass(): Promise<FlyArtClassPainting | null> {
  try {
    const result = await client.fetch<SanityFlyArtClass | null>(flyArtClassQuery);
    if (!result?.image) return null;
    return {
      imageUrl: urlFor(result.image as { asset?: { _ref?: string } })
        .width(1400)
        .quality(85)
        .auto('format')
        .url(),
      alt: result.description ?? 'Fly Art Class — flies painting flies, the brand thesis in one image.',
    };
  } catch {
    return null;
  }
}

export async function BuzzinSince2004() {
  const painting = await fetchFlyArtClass();

  return (
    <div className="px-5 py-16 md:px-8 md:py-24" style={{ color: 'var(--color-text-ink)' }}>
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center md:gap-16">
        <div className="order-2 flex flex-col gap-6 md:order-1">
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Buzzin&rsquo; Since 2004
          </h2>

          <div className="flex flex-col gap-4 font-serif text-lg leading-relaxed md:text-xl">
            <p>
              The doors of The Fly Trap were thrown open on a December morning
              in 2004, and Kara &amp; Gavin McMillian welcomed their first
              customers and started a magnificent life as a corner of Woodward
              Avenue that has been buzzing ever since.
            </p>
            <p>
              For twenty years, beloved and inquisitive customers asked after
              the name, the flies on the walls, the marbles set into the bar.
              In 2021, after a long pandemic stretch, the founders stepped
              back. A trusted friend and fellow restaurateur held the room for
              them, kept the menu honest, and waited.
            </p>
            <p>
              In October 2024, the McMillians came home. The receipts now read
              <em> Under Old Management</em>, the eggs are still magnificent,
              and the flies are still painting flies. Twenty-plus years on,
              <em> a finer diner</em> means what it has always meant: come in,
              sit down, catch a buzz.
            </p>
          </div>
        </div>

        <div className="order-1 flex justify-center md:order-2">
          {painting ? (
            <figure className="w-full max-w-md">
              <Image
                src={painting.imageUrl}
                alt={painting.alt}
                width={700}
                height={700}
                className="h-auto w-full rounded-md shadow-xl"
                sizes="(max-width: 768px) 100vw, 448px"
              />
              <figcaption className="mt-3 font-sans text-sm italic text-[color:var(--color-text-charcoal)]">
                Fly Art Class — flies painting flies, on the back wall.
              </figcaption>
            </figure>
          ) : (
            <div
              className="aspect-square w-full max-w-md rounded-md"
              style={{ backgroundColor: 'var(--color-flytrap-red-deep)' }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default BuzzinSince2004;
