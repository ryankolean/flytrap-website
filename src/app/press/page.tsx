// /press — press timeline, pull-quote bank, JSON-LD per entry, press inquiry stub
// from docs/02-press-page-spec.md (layout, inventory, pull-quote bank, inquiry)
// from docs/03-seo-aeo-strategy.md §Part 1 (NewsArticle / Review schema per entry)

import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { pressQuery } from '@/sanity/lib/queries';
import { pageMetadata } from '@/lib/metadata';
import { PressCard } from '@/components/press/PressCard';
import type { PressEntry } from '@/components/press/PressCard';

export const metadata: Metadata = pageMetadata({
  title: 'Press',
  description:
    'Twenty-plus years of coverage — Food Network Diners Drive-Ins and Dives, Crain\'s Detroit Business, Detroit Free Press, Detroit News, and more.',
  path: '/press',
});

// Pull-quote bank — verbatim from docs/02-press-page-spec.md
// Each quote must link to its source; sources below are from the press inventory.
const PULL_QUOTES = [
  {
    quote:
      'When I started watching the show, one of the first restaurants I saw was a little joint in Ferndale, MI called The Fly Trap. It was fabulous.',
    attribution: 'Guy Fieri, Food Network — Diners, Drive-Ins and Dives',
    sourceUrl: 'https://www.foodnetwork.com/shows/diners-drive-ins-and-dives',
  },
  {
    quote: 'We want to make sure the legacy of The Fly Trap lives on.',
    attribution: 'Kara McMillian, Crain\'s Detroit Business, October 2024',
    sourceUrl: 'https://www.crainsdetroit.com',
  },
  {
    quote: 'Coming back wasn\'t exactly something that was anticipated.',
    attribution: 'Kara McMillian, Crain\'s Detroit Business, October 2024',
    sourceUrl: 'https://www.crainsdetroit.com',
  },
  {
    quote: 'As good as ever.',
    attribution: 'The Detroit News, July 2022',
    sourceUrl: 'https://www.detroitnews.com',
  },
];

interface RawPressEntry {
  _id: string;
  headline: string;
  outlet: string;
  publishDate: string;
  pullQuote?: string;
  sourceUrl: string;
  category: string;
  isFeatured?: boolean;
  isTvFeature?: boolean;
  authorName?: string;
  orderRank?: number;
}

async function getPressEntries(): Promise<RawPressEntry[]> {
  try {
    const entries = await client.fetch<RawPressEntry[]>(pressQuery);
    return entries ?? [];
  } catch {
    return [];
  }
}

export default async function PressPage() {
  const rawEntries = await getPressEntries();

  // Map raw Sanity entries to PressCard props
  // The pressEntry schema doesn't carry an explicit type field; infer from category:
  // 'blog' entries render as review style, everything else as article style.
  const entries: PressEntry[] = rawEntries.map((e) => ({
    _id: e._id,
    headline: e.headline,
    outlet: e.outlet,
    publishDate: e.publishDate,
    pullQuote: e.pullQuote,
    sourceUrl: e.sourceUrl,
    category: e.category,
    isFeatured: e.isFeatured,
    isTvFeature: e.isTvFeature,
    authorName: e.authorName,
    entryType: e.category === 'blog' ? 'review' : 'article',
  }));

  const featured = entries.filter((e) => e.isFeatured);
  const rest = entries.filter((e) => !e.isFeatured);

  const isEmpty = entries.length === 0;

  return (
    <main>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 leading-tight">
            Press
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Twenty-plus years of third-party validation — national TV, Detroit&rsquo;s biggest
            papers, and the neighborhood press that has always had our back.
          </p>
        </header>

        {/* Pull-quote bank */}
        <section className="mb-10" aria-labelledby="quotes-heading">
          <h2 id="quotes-heading" className="sr-only">
            What people say
          </h2>
          <div className="flex flex-col gap-4">
            {PULL_QUOTES.map(({ quote, attribution, sourceUrl }) => (
              <figure key={attribution} className="border-l-2 border-stone-900 pl-4">
                <blockquote className="text-stone-700 text-base italic leading-snug">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <figcaption className="mt-1.5 text-xs text-stone-400">
                  &mdash;{' '}
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-stone-700 transition-colors"
                  >
                    {attribution}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Featured / hero entries */}
        {featured.length > 0 && (
          <section className="mb-8" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="text-xl font-bold text-stone-900 mb-4">
              Featured Coverage
            </h2>
            <div className="flex flex-col gap-4">
              {featured.map((entry) => (
                <PressCard key={entry._id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Main timeline */}
        {rest.length > 0 && (
          <section className="mb-10" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-xl font-bold text-stone-900 mb-4">
              In the News
            </h2>
            <div className="flex flex-col gap-4">
              {rest.map((entry) => (
                <PressCard key={entry._id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {isEmpty && (
          <p className="text-stone-500 text-center py-16">
            Press archive is being assembled. Check back soon.
          </p>
        )}

        {/* Press inquiries */}
        <section
          className="border-t border-stone-200 pt-8 mt-8"
          aria-labelledby="inquiries-heading"
        >
          <h2 id="inquiries-heading" className="text-xl font-bold text-stone-900 mb-2">
            Press Inquiries
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            For interview requests, press kit access, or event coverage inquiries, reach us at{' '}
            {/* TODO open-question:5 — confirm address at handoff */}
            <a
              href="mailto:press@theflytrapferndale.com"
              className="underline underline-offset-2 hover:text-stone-900 transition-colors"
            >
              press@theflytrapferndale.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
