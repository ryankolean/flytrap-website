// restaurant.ts
// Generates Restaurant + LocalBusiness merged JSON-LD graph.
// Source: docs/01-design-document-v1.7.md §2, docs/03-seo-aeo-strategy.md §Part 1

export interface RestaurantInput {
  name?: string;
  url?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  openingHours?: string[];
  servesCuisine?: string[];
  priceRange?: string;
  image?: string;
  description?: string;
}

export interface SchemaOrgObject {
  "@context": string;
  "@type": string | string[];
  [key: string]: unknown;
}

export function generateRestaurantJsonLd(input: RestaurantInput = {}): SchemaOrgObject {
  const {
    name = "The Fly Trap",
    url = "https://theflytrapferndale.com",
    telephone = "(248) 399-5150",
    address = {
      streetAddress: "22950 Woodward Ave",
      addressLocality: "Ferndale",
      addressRegion: "MI",
      postalCode: "48220",
      addressCountry: "US",
    },
    openingHours = [
      "Mo-Su 08:00-15:00",
    ],
    servesCuisine = ["American", "Diner"],
    priceRange = "$$",
    image,
    description,
  } = input;

  return {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "LocalBusiness"],
    name,
    url,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress ?? "22950 Woodward Ave",
      addressLocality: address.addressLocality ?? "Ferndale",
      addressRegion: address.addressRegion ?? "MI",
      postalCode: address.postalCode ?? "48220",
      addressCountry: address.addressCountry ?? "US",
    },
    openingHours,
    servesCuisine,
    priceRange,
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Outdoor seating",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Dog-friendly",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Wheelchair accessible entrance",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Free parking lot",
        value: true,
      },
    ],
    ...(image ? { image } : {}),
    ...(description ? { description } : {}),
  };
}
