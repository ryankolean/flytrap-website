// /about — Server Component
// TOP: Fly Art Class painting fills hero region. No competing headline copy.
// Below: return story, room narrative, full painting catalog, brand facts block.
// from docs/01-design-document-v1.7.md §2, §4, §9 Section 4; docs/06-capture-debrief.md.
// from CLAUDE.md: About-page anchor rule (Fly Art Class only at top, no headline).

import type { Metadata } from 'next';

import { PaintingGrid } from '@/components/about/PaintingGrid';
import type { Painting } from '@/components/about/PaintingGrid';
import { JsonLd, generateAboutPageJsonLd, generateSpeakableJsonLd } from '@/lib/jsonld';
import { pageMetadata } from '@/lib/metadata';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description:
    "Fly Trap is a finer diner on Woodward, Buzzin' since 2004. Kara and Gavin McMillian's twenty-two-year art project — magnificent eggs, a marble bar, and 17 fly paintings on the walls.",
  path: '/about',
});

// ------------------- Sanity fetch -------------------

interface SanityPainting {
  _id: string;
  title?: string;
  slug?: { current?: string };
  description?: string;
  inHeroRotation?: boolean;
  catalogOnly?: boolean;
  image?: unknown;
}

const ALL_PAINTINGS_QUERY = `
  *[_type == "flyPainting"] | order(orderRank asc) {
    _id,
    title,
    slug,
    description,
    inHeroRotation,
    catalogOnly,
    image
  }
`;

async function getAllPaintings(): Promise<Painting[]> {
  try {
    const results = await client.fetch<SanityPainting[]>(ALL_PAINTINGS_QUERY);
    if (!Array.isArray(results)) return [];
    return results.map((p) => ({
      _id: p._id,
      title: p.title ?? '',
      slug: p.slug,
      description: p.description,
      inHeroRotation: p.inHeroRotation,
      catalogOnly: p.catalogOnly,
      imageUrl: p.image
        ? urlFor(p.image as Parameters<typeof urlFor>[0])
            .width(600)
            .quality(80)
            .auto('format')
            .url()
        : undefined,
      alt: p.description ?? p.title ?? 'Fly Trap painting',
    }));
  } catch {
    return [];
  }
}

// Fly Art Class is the anchor piece — first inHeroRotation painting, or title match.
function findArtClass(paintings: Painting[]): Painting | undefined {
  return (
    paintings.find((p) =>
      p.title.toLowerCase().includes('art class')
    ) ?? paintings.find((p) => p.inHeroRotation)
  );
}

// ------------------- Page -------------------

export default async function AboutPage() {
  const paintings = await getAllPaintings();
  const artClass = findArtClass(paintings);

  // We need a wider image for the hero; re-derive from the painting's stored image
  // field by building a fresh urlFor URL at 1400px. artClass.imageUrl is already
  // built at 600px. Use it as-is — Sanity CDN auto-resizes, we just swap the width param.
  const artClassImageUrl = artClass?.imageUrl
    ? artClass.imageUrl.replace('w=600', 'w=1400')
    : undefined;

  const aboutJsonLd = generateAboutPageJsonLd({
    description:
      "Fly Trap is a finer diner on Woodward, Buzzin' since 2004. Kara and Gavin McMillian's twenty-two-year art project — magnificent eggs, a marble bar, and 17 fly paintings on the walls.",
  });

  const speakableJsonLd = generateSpeakableJsonLd({ page: 'about' });

  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <JsonLd data={speakableJsonLd} />

      {/* ---- Hero: Fly Art Class painting, no competing headline ---- */}
      <section aria-label="Fly Art Class" className="relative w-full">
        {artClassImageUrl ? (
          <div className="relative w-full">
            <img
              src={artClassImageUrl}
              alt={artClass?.alt ?? 'Fly Art Class — a fly model posed on a pedestal while three fly artists paint at their easels'}
              className="w-full object-contain"
              style={{ maxHeight: '85vh' }}
              fetchPriority="high"
            />
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center bg-[color:var(--color-bar-fog)]/30"
            style={{ minHeight: '60vh' }}
            aria-hidden="true"
          />
        )}
        {/* Small caption only — no competing headline */}
        <p className="px-5 py-3 text-center font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--color-checker-black)]/50 md:px-8">
          {artClass?.title ?? 'Fly Art Class'}
        </p>
      </section>

      {/* ---- Return story ---- */}
      <section
        data-speakable="about-intro"
        aria-label="About The Fly Trap"
        className="mx-auto w-full max-w-3xl px-5 py-14 md:px-8 md:py-20"
      >
        <div className="flex flex-col gap-6 font-serif text-xl leading-relaxed text-[color:var(--color-checker-black)]">
          <p>
            The Fly Trap opened on December 28, 2004, on Woodward Avenue in
            Ferndale. Kara and Gavin McMillian built it into a neighborhood
            institution over seventeen years — the kind of place where the menu
            names the bartender and the daily special is named after a Warren
            Zevon song.
          </p>
          <p>
            When the McMillians returned in October 2024, they brought back
            the original menu, all twelve staff from the interim era, and one
            extra line on every receipt: <em>Under Old Management.</em>
          </p>
          <p>
            They have been buzzing since 2004. The ceiling has been pressed tin
            since 1907. The eggs have always been magnificent.
          </p>
        </div>
      </section>

      {/* ---- Room narrative ---- */}
      <section
        aria-label="The room"
        className="mx-auto w-full max-w-3xl px-5 pb-14 md:px-8 md:pb-20"
      >
        <div className="flex flex-col gap-4 font-serif text-lg leading-relaxed text-[color:var(--color-checker-black)]/80">
          <p>
            The bar top is real marbles pressed into red epoxy, edge to edge
            at high density, each marble different from the one beside it —
            swirls, eye patterns, solid colors, semi-translucent. Mounted on
            the wall above it: a dozen large ceramic spheres, each unique, the
            same marble vocabulary scaled up to sculpture. The room earns the
            close looking.
          </p>
          <p>
            Overhead: the original pressed-tin ceiling, embossed square panels
            patinated silver-gray, modern track lighting bolted straight
            through it. Two giant fly silhouettes are painted directly on the
            plaster behind the bar. The checkerboard extends from the floor to
            the restroom signs — hand-fabricated bespoke signage, built into
            the building, not decorated onto it.
          </p>
        </div>
      </section>

      {/* ---- Painting catalog ---- */}
      <section
        aria-label="Fly painting collection"
        className="mx-auto w-full max-w-7xl px-5 pb-16 md:px-8 md:pb-24"
      >
        <h2 className="mb-8 font-serif text-2xl text-[color:var(--color-checker-black)] md:text-3xl">
          The Collection
        </h2>
        <PaintingGrid paintings={paintings} />
      </section>

      {/* ---- Brand facts block ---- */}
      <section
        data-speakable="about-owners"
        aria-label="Visit information"
        className="border-t border-[color:var(--color-checker-black)]/10 bg-[color:var(--color-bar-fog)]/10 px-5 py-12 md:px-8 md:py-16"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 font-sans md:flex-row md:gap-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-checker-black)]/40">
              Address
            </span>
            <address className="not-italic text-base leading-relaxed text-[color:var(--color-checker-black)]">
              22950 Woodward Ave
              <br />
              Ferndale, MI 48220
            </address>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-checker-black)]/40">
              Hours
            </span>
            <p className="text-base leading-relaxed text-[color:var(--color-checker-black)]">
              Mon&ndash;Sun, 8am&ndash;3pm
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-checker-black)]/40">
              Owners
            </span>
            <p className="text-base leading-relaxed text-[color:var(--color-checker-black)]">
              Kara &amp; Gavin McMillian
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-checker-black)]/40">
              Origin
            </span>
            <p className="font-serif text-base italic text-[color:var(--color-checker-black)]">
              Buzzin&rsquo; since 2004
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
