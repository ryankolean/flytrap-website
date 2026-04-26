// /faq — expandable Q&A, FAQPage JSON-LD
// from docs/03-seo-aeo-strategy.md §Part 2 (FAQPage schema, answer-first formatting)

import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import { faqQuery } from '@/sanity/lib/queries';
import { pageMetadata } from '@/lib/metadata';
import { generateFaqPageJsonLd, JsonLd } from '@/lib/jsonld';

export const metadata: Metadata = pageMetadata({
  title: 'FAQ',
  description:
    'Common questions about The Fly Trap — hours, parking, dogs, reservations, vegan options, ownership, and the Diners Drive-Ins and Dives feature.',
  path: '/faq',
});

interface RawFaqEntry {
  _id: string;
  question: string;
  answer: string | null;
  category: string;
  orderRank?: number;
  needsContent?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  visiting: 'Visiting',
  food: 'Food',
  business: 'The Business',
  ordering: 'Ordering',
};

const CATEGORY_ORDER = ['visiting', 'food', 'business', 'ordering'];

async function getFaqEntries(): Promise<RawFaqEntry[]> {
  try {
    const entries = await client.fetch<RawFaqEntry[]>(faqQuery);
    return entries ?? [];
  } catch {
    return [];
  }
}

export default async function FaqPage() {
  const allEntries = await getFaqEntries();

  // Filter out entries with no content or null answers
  const visible = allEntries.filter(
    (e) => !e.needsContent && e.answer != null && e.answer.trim() !== '',
  );

  // Group by category
  const byCategory = new Map<string, RawFaqEntry[]>();
  for (const entry of visible) {
    const group = byCategory.get(entry.category) ?? [];
    group.push(entry);
    byCategory.set(entry.category, group);
  }

  // Build JSON-LD from visible entries
  const faqJsonLd = generateFaqPageJsonLd({
    entries: visible.map((e) => ({
      question: e.question,
      answer: e.answer as string,
    })),
  });

  const isEmpty = visible.length === 0;

  return (
    <>
      <JsonLd data={faqJsonLd} />

      <main>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Everything you want to know before your first — or fiftieth — visit.
            </p>
          </header>

          {isEmpty && (
            <p className="text-stone-500 text-center py-16">
              Questions and answers are on their way. In the meantime, call us at{' '}
              <a
                href="tel:+12483995150"
                className="underline underline-offset-2 hover:text-stone-900 transition-colors"
              >
                (248) 399-5150
              </a>
              .
            </p>
          )}

          {CATEGORY_ORDER.filter((cat) => byCategory.has(cat)).map((cat) => {
            const entries = byCategory.get(cat)!;
            const label = CATEGORY_LABELS[cat] ?? cat;
            return (
              <section key={cat} className="mb-8" aria-labelledby={`cat-${cat}`}>
                <h2 id={`cat-${cat}`} className="text-xl font-bold text-stone-900 mb-4">
                  {label}
                </h2>
                <dl className="divide-y divide-stone-200">
                  {entries.map((entry) => (
                    <details
                      key={entry._id}
                      className="py-4 group"
                    >
                      <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                        <dt className="text-sm font-semibold text-stone-900 leading-snug">
                          {entry.question}
                        </dt>
                        <span
                          className="flex-shrink-0 text-stone-400 group-open:rotate-180 transition-transform duration-150 mt-0.5"
                          aria-hidden="true"
                        >
                          &#9650;
                        </span>
                      </summary>
                      <dd className="mt-2 text-sm text-stone-600 leading-relaxed">
                        {entry.answer}
                      </dd>
                    </details>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
