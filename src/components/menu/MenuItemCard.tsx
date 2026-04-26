// MenuItemCard.tsx
// Reused by MenuTease (compact) and /menu full page (full).
// from docs/01-design-document-v1.7.md §9.3

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

type DietaryFlag = 'vegetarian' | 'vegan' | 'glutenFree' | 'dairyFree' | 'nutFree';

const DIETARY_LABELS: Record<DietaryFlag, { short: string; label: string }> = {
  vegetarian: { short: 'V', label: 'Vegetarian' },
  vegan: { short: 'VG', label: 'Vegan' },
  glutenFree: { short: 'GF', label: 'Gluten-Free' },
  dairyFree: { short: 'DF', label: 'Dairy-Free' },
  nutFree: { short: 'NF', label: 'Nut-Free' },
};

export interface MenuItemCardProps {
  variant: 'compact' | 'full';
  name: string;
  description?: string;
  price?: number | null;
  needsReverification?: boolean;
  image?: SanityImageSource | null;
  suitableForDiet?: string[];
  ingredients?: string[];
}

function FlyPlaceholder() {
  return (
    <div
      className="flex items-center justify-center bg-stone-100 text-stone-400 text-xs font-medium tracking-wide"
      aria-hidden="true"
    >
      fly placeholder
    </div>
  );
}

function DietaryPills({ flags }: { flags: string[] }) {
  const known = flags.filter((f): f is DietaryFlag => f in DIETARY_LABELS);
  if (known.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-1 mt-1" aria-label="Dietary flags">
      {known.map((flag) => {
        const { short, label } = DIETARY_LABELS[flag];
        return (
          <li key={flag}>
            <span
              className="inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide border border-current rounded-sm text-stone-600"
              aria-label={label}
            >
              {short}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function PriceDisplay({
  price,
  needsReverification,
}: {
  price?: number | null;
  needsReverification?: boolean;
}) {
  if (needsReverification || price == null) {
    return <span className="text-stone-500 text-sm">Ask your server</span>;
  }
  return (
    <span className="text-stone-800 font-semibold text-sm">
      ${price.toFixed(2)}
    </span>
  );
}

export function MenuItemCard({
  variant,
  name,
  description,
  price,
  needsReverification,
  image,
  suitableForDiet = [],
  ingredients = [],
}: MenuItemCardProps) {
  const imageUrl = image
    ? urlFor(image).width(variant === 'compact' ? 240 : 480).height(variant === 'compact' ? 160 : 320).fit('crop').url()
    : null;

  if (variant === 'compact') {
    return (
      <article className="flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white">
        <div className="relative w-full aspect-[3/2]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="240px"
            />
          ) : (
            <FlyPlaceholder />
          )}
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h3 className="font-semibold text-stone-900 text-sm leading-snug">{name}</h3>
          <PriceDisplay price={price} needsReverification={needsReverification} />
        </div>
      </article>
    );
  }

  // full variant
  return (
    <article className="flex gap-4 py-4 border-b border-stone-100 last:border-0">
      <div className="relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <FlyPlaceholder />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold text-stone-900 text-base leading-snug">{name}</h3>
          <PriceDisplay price={price} needsReverification={needsReverification} />
        </div>
        {description && (
          <p className="text-stone-600 text-sm mt-0.5 leading-relaxed">{description}</p>
        )}
        {suitableForDiet.length > 0 && <DietaryPills flags={suitableForDiet} />}
        {ingredients.length > 0 && (
          <p className="text-stone-400 text-xs mt-1">{ingredients.join(', ')}</p>
        )}
      </div>
    </article>
  );
}
