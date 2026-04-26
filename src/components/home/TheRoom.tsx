// TheRoom.tsx
// "The Room" home-page section — room narrative + fly gallery carousel teaser.
// Two-column on desktop, stacked on mobile.
// Descriptive phrases from docs/01-design-document-v1.7.md §4, §6 and docs/06-capture-debrief.md.
// No invented details. No bathroom-context paintings. Five hero-rotation paintings only.
// from plan Task 11.

import Link from 'next/link';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { RoomGalleryCarousel } from './RoomGalleryCarousel';

interface HeroPainting {
  _id: string;
  title: string;
  imageUrl: string;
  alt: string;
}

const ROOM_PAINTINGS_QUERY = `
  *[_type == "flyPainting" && inHeroRotation == true] | order(orderRank asc) {
    _id,
    title,
    description,
    image
  }
`;

async function getRoomPaintings(): Promise<HeroPainting[]> {
  try {
    const results = await client.fetch<
      Array<{
        _id: string;
        title?: string;
        description?: string;
        image?: unknown;
      }>
    >(ROOM_PAINTINGS_QUERY);

    if (!Array.isArray(results)) return [];

    return results
      .filter((p) => p?.image)
      .map((p) => ({
        _id: p._id,
        title: p.title ?? '',
        alt: p.description ?? p.title ?? 'Fly Trap painting',
        imageUrl: urlFor(p.image as Parameters<typeof urlFor>[0])
          .width(800)
          .quality(85)
          .auto('format')
          .url(),
      }));
  } catch {
    return [];
  }
}

export async function TheRoom() {
  const paintings = await getRoomPaintings();

  return (
    <section
      aria-label="The Room"
      className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-16 md:flex-row md:items-start md:gap-14 md:py-24 lg:px-8"
    >
      {/* Left: room narrative */}
      <div className="flex flex-col gap-6 md:w-[42%] md:shrink-0">
        <h2 className="font-serif text-3xl leading-tight text-[color:var(--color-checker-black)] md:text-4xl">
          The Room
        </h2>
        <div className="flex flex-col gap-4 font-serif text-lg leading-relaxed text-[color:var(--color-checker-black)]/80">
          <p>
            The pressed-tin ceiling overhead is original to the 1907 building
            — embossed panels patinated silver-gray, track lights bolted
            straight through, decades of breakfast rising into it. Beneath it:
            a marble-inlay bar top where every marble is different, hundreds of
            them pressed into red epoxy edge to edge, the whole surface a kind
            of accidental jewel.
          </p>
          <p>
            The walls hold jewel-tone spheres, giant fly silhouettes painted
            straight onto the plaster, and twenty-two years of fly paintings
            hung where lesser diners hang mirrors. This is a room that rewards
            close looking.
          </p>
          <p>
            Checkerboard floors, fire-engine red where it counts, and the kind
            of careful weirdness that takes two decades to build. Come for the
            magnificent eggs. Stay because you can&rsquo;t stop looking at the
            bar.
          </p>
        </div>
        <Link
          href="/about"
          className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full border-2 border-[color:var(--color-checker-black)] px-6 py-2.5 font-sans text-sm font-semibold text-[color:var(--color-checker-black)] transition hover:bg-[color:var(--color-checker-black)] hover:text-[color:var(--color-cream-paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-marble-gold)]"
        >
          See the full collection
        </Link>
      </div>

      {/* Right: fly gallery carousel */}
      <div className="min-w-0 flex-1">
        <RoomGalleryCarousel paintings={paintings} />
      </div>
    </section>
  );
}

export default TheRoom;
