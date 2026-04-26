// MenuTease.tsx
// Five horizontally-scrolling chapter cards on the home page.
// from docs/01-design-document-v1.7.md §9.3

import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { MenuItemCard } from '@/components/menu/MenuItemCard';

const MENU_TEASE_QUERY = `
  *[_type == 'menuSection'] | order(orderRank asc) {
    _id,
    name,
    slug,
    "items": *[_type == 'menuItem' && references(^._id)] | order(orderRank asc)[0..2] {
      _id,
      name,
      description,
      price,
      image,
      suitableForDiet,
      needsReverification
    }
  }
`;

interface TeaseItem {
  _id: string;
  name: string;
  description?: string;
  price?: number | null;
  image?: unknown;
  suitableForDiet?: string[];
  needsReverification?: boolean;
}

interface TeaseSection {
  _id: string;
  name: string;
  slug: { current: string };
  items: TeaseItem[];
}

async function getSections(): Promise<TeaseSection[]> {
  try {
    const data = await client.fetch<TeaseSection[]>(MENU_TEASE_QUERY);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function MenuTease() {
  const sections = await getSections();

  if (sections.length === 0) {
    return null;
  }

  return (
    <section aria-label="Menu chapters" className="py-10 overflow-hidden">
      <div className="px-4 mb-5">
        <h2 className="text-2xl font-bold text-stone-900 leading-tight">What we make</h2>
        <p className="text-stone-600 text-sm mt-1">Mon–Sun, 8am–3pm. 22950 Woodward Ave, Ferndale.</p>
      </div>

      {/* snap-scroll track */}
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-4"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {sections.map((section) => {
          const sectionSlug = section.slug?.current ?? section.name.toLowerCase().replace(/\s+/g, '-');

          return (
            <div
              key={section._id}
              className="flex-shrink-0 w-72 flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="px-4 pt-4 pb-2 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-base">{section.name}</h3>
              </div>

              <div className="flex flex-col gap-0 px-3 py-2 flex-1">
                {section.items.length > 0 ? (
                  section.items.map((item) => (
                    <MenuItemCard
                      key={item._id}
                      variant="compact"
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      needsReverification={item.needsReverification}
                      image={item.image ?? null}
                      suitableForDiet={item.suitableForDiet ?? []}
                    />
                  ))
                ) : (
                  <p className="text-stone-400 text-sm py-4 text-center">Coming soon</p>
                )}
              </div>

              <div className="px-4 pb-4 pt-2">
                <Link
                  href={`/menu#section-${sectionSlug}`}
                  className="text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  See full chapter
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
