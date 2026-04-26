// /menu — full menu page
// from docs/01-design-document-v1.7.md §9.3

import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { menuQuery } from '@/sanity/lib/queries';
import { pageMetadata } from '@/lib/metadata';
import { generateMenuJsonLd, JsonLd } from '@/lib/jsonld';
import type { SanityMenuSection as JsonLdMenuSection } from '@/lib/jsonld';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const metadata: Metadata = pageMetadata({
  title: 'Menu',
  description:
    'The full Fly Trap menu — All Things Eggs, Oh Sugar Shack, Green Things, Between Bread, and Other Stuff. Mon–Sun 8am–3pm at 22950 Woodward Ave, Ferndale MI.',
  path: '/menu',
});

interface RawSection {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  orderRank?: number;
}

interface RawItem {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  ingredients?: string[];
  price?: number | null;
  image?: SanityImageSource | null;
  sectionId: string;
  sectionName?: string;
  suitableForDiet?: string[];
  orderRank?: number;
  isSignatureDish?: boolean;
  needsReverification?: boolean;
}

interface MenuData {
  sections: RawSection[];
  items: RawItem[];
}

async function getMenuData(): Promise<MenuData> {
  try {
    const data = await client.fetch<MenuData>(menuQuery);
    return data ?? { sections: [], items: [] };
  } catch {
    return { sections: [], items: [] };
  }
}

function buildSectionSlug(section: RawSection): string {
  return section.slug?.current ?? section.name.toLowerCase().replace(/\s+/g, '-');
}

function SectionNav({ sections }: { sections: RawSection[] }) {
  if (sections.length === 0) return null;
  return (
    <nav
      aria-label="Menu sections"
      className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm"
    >
      <div
        className="flex gap-0 overflow-x-auto"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {sections.map((section) => {
          const slug = buildSectionSlug(section);
          return (
            <Link
              key={section._id}
              href={`#section-${slug}`}
              className="flex-shrink-0 px-4 py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors whitespace-nowrap"
              style={{ scrollSnapAlign: 'start' }}
            >
              {section.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default async function MenuPage() {
  const { sections, items } = await getMenuData();

  // Group items by sectionId, sorted by orderRank
  const itemsBySection = new Map<string, RawItem[]>();
  for (const item of items) {
    const group = itemsBySection.get(item.sectionId) ?? [];
    group.push(item);
    itemsBySection.set(item.sectionId, group);
  }
  for (const [key, group] of itemsBySection) {
    group.sort((a, b) => (a.orderRank ?? 999) - (b.orderRank ?? 999));
    itemsBySection.set(key, group);
  }

  // Build JSON-LD sections
  const jsonLdSections: JsonLdMenuSection[] = sections.map((section) => ({
    name: section.name,
    description: section.description,
    items: (itemsBySection.get(section._id) ?? []).map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price ?? undefined,
      suitableForDiet: item.suitableForDiet as Array<
        'vegetarian' | 'vegan' | 'glutenFree' | 'dairyFree' | 'nutFree'
      >,
    })),
  }));

  const menuJsonLd = generateMenuJsonLd({ sections: jsonLdSections });

  const isEmpty = sections.length === 0;

  return (
    <>
      <JsonLd data={menuJsonLd} />

      <main>
        <SectionNav sections={sections} />

        <div className="max-w-2xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 leading-tight">Menu</h1>
            <p className="text-stone-500 text-sm mt-1">Mon–Sun, 8am–3pm. Breakfast and lunch all day.</p>
          </header>

          {isEmpty && (
            <p className="text-stone-500 text-center py-16">
              The full menu is on its way. Stop in at 22950 Woodward Ave, Ferndale.
            </p>
          )}

          {sections.map((section) => {
            const slug = buildSectionSlug(section);
            const sectionItems = itemsBySection.get(section._id) ?? [];

            return (
              <section
                key={section._id}
                id={`section-${slug}`}
                className="mb-10 scroll-mt-14"
                aria-labelledby={`heading-${slug}`}
              >
                <div className="mb-3">
                  <h2
                    id={`heading-${slug}`}
                    className="text-xl font-bold text-stone-900"
                  >
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-stone-500 text-sm mt-0.5">{section.description}</p>
                  )}
                </div>

                {sectionItems.length === 0 ? (
                  <p className="text-stone-400 text-sm py-4">Items coming soon.</p>
                ) : (
                  <div>
                    {sectionItems.map((item) => (
                      <MenuItemCard
                        key={item._id}
                        variant="full"
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        needsReverification={item.needsReverification}
                        image={item.image}
                        suitableForDiet={item.suitableForDiet ?? []}
                        ingredients={item.ingredients ?? []}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}
