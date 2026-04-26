// PressCard — renders a single press entry (NewsArticle or Review visual style)
// from docs/02-press-page-spec.md (card layout, pull-quote rules)

import { generateNewsArticleJsonLd, generateReviewJsonLd, JsonLd } from '@/lib/jsonld';

export interface PressEntry {
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
  // 'review' renders pull-quote style; anything else renders long-form NewsArticle style
  entryType?: 'review' | 'article';
}

function formatDate(iso: string): string {
  // iso is "YYYY-MM-DD" from Sanity date field
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function PressCard({ entry }: { entry: PressEntry }) {
  const isReview = entry.entryType === 'review';

  const jsonLd = isReview
    ? generateReviewJsonLd({
        headline: entry.headline,
        outlet: entry.outlet,
        publishDate: entry.publishDate,
        sourceUrl: entry.sourceUrl,
        authorName: entry.authorName,
        pullQuote: entry.pullQuote,
      })
    : generateNewsArticleJsonLd({
        headline: entry.headline,
        outlet: entry.outlet,
        publishDate: entry.publishDate,
        sourceUrl: entry.sourceUrl,
        authorName: entry.authorName,
        pullQuote: entry.pullQuote,
      });

  return (
    <>
      <JsonLd data={jsonLd} />
      <article
        className="border border-stone-200 rounded-sm p-5 flex flex-col gap-3"
        aria-label={`${entry.outlet}: ${entry.headline}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              {entry.outlet}
              {entry.isTvFeature && (
                <span className="ml-2 inline-block bg-stone-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider">
                  TV
                </span>
              )}
            </p>
            <p className="text-xs text-stone-400 mt-0.5">{formatDate(entry.publishDate)}</p>
          </div>
        </div>

        {isReview && entry.pullQuote ? (
          <blockquote className="border-l-2 border-stone-900 pl-3 text-stone-700 text-base italic leading-snug">
            &ldquo;{entry.pullQuote}&rdquo;
          </blockquote>
        ) : (
          <>
            <h3 className="text-base font-semibold text-stone-900 leading-snug">
              {entry.headline}
            </h3>
            {entry.pullQuote && (
              <blockquote className="border-l-2 border-stone-200 pl-3 text-stone-500 text-sm italic leading-snug">
                &ldquo;{entry.pullQuote}&rdquo;
              </blockquote>
            )}
          </>
        )}

        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-stone-900 underline underline-offset-2 hover:text-stone-600 transition-colors self-start"
        >
          Read the full piece &rarr;
        </a>
      </article>
    </>
  );
}
