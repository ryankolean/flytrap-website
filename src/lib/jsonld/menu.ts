// menu.ts
// Generates Menu, MenuSection, MenuItem JSON-LD.
// Source: docs/01-design-document-v1.7.md §3, docs/03-seo-aeo-strategy.md §Part 1

import type { SchemaOrgObject } from "./restaurant";

/** Dietary flag values from the Sanity menuItem schema. */
export type SanityDietaryFlag =
  | "vegetarian"
  | "vegan"
  | "glutenFree"
  | "dairyFree"
  | "nutFree";

/** Map from Sanity dietary flag to Schema.org RestrictedDiet URL. */
const DIET_MAP: Partial<Record<SanityDietaryFlag, string>> = {
  vegetarian: "https://schema.org/VegetarianDiet",
  vegan: "https://schema.org/VeganDiet",
  glutenFree: "https://schema.org/GlutenFreeDiet",
};

export interface SanityMenuItem {
  name: string;
  description?: string;
  price?: number;
  suitableForDiet?: SanityDietaryFlag[];
}

export interface SanityMenuSection {
  name: string;
  description?: string;
  items: SanityMenuItem[];
}

export interface MenuInput {
  restaurantName?: string;
  restaurantUrl?: string;
  sections: SanityMenuSection[];
}

function buildMenuItem(item: SanityMenuItem): SchemaOrgObject {
  const diets = (item.suitableForDiet ?? [])
    .filter((flag) => flag in DIET_MAP)
    .map((flag) => DIET_MAP[flag as SanityDietaryFlag]);

  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: item.name,
    ...(item.description ? { description: item.description } : {}),
    ...(item.price !== undefined
      ? {
          offers: {
            "@type": "Offer",
            price: item.price.toFixed(2),
            priceCurrency: "USD",
          },
        }
      : {}),
    ...(diets.length > 0 ? { suitableForDiet: diets } : {}),
  };
}

function buildMenuSection(section: SanityMenuSection): SchemaOrgObject {
  return {
    "@context": "https://schema.org",
    "@type": "MenuSection",
    name: section.name,
    ...(section.description ? { description: section.description } : {}),
    hasMenuItem: section.items.map(buildMenuItem),
  };
}

export function generateMenuJsonLd(input: MenuInput): SchemaOrgObject {
  const {
    restaurantName = "The Fly Trap",
    restaurantUrl = "https://theflytrapferndale.com",
    sections,
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${restaurantName} Menu`,
    url: `${restaurantUrl}/menu`,
    hasMenuSection: sections.map(buildMenuSection),
  };
}
