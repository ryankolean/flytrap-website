/**
 * scripts/seed.ts
 *
 * One-shot seed for a freshly-created Sanity dataset.
 * Populates: menuSections, menuItems, flyPaintings (with photo uploads),
 *            siteSettings, faqEntries, and pressEntries.
 *
 * Idempotent: detects existing documents by slug and upserts rather than
 * creating duplicates. Run again at any time without data loss.
 *
 * Prerequisites — see scripts/SEED.md before running.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<token> SANITY_PROJECT_ID=<id> pnpm seed
 */

import { createClient, type SanityClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (!WRITE_TOKEN) {
  console.error(
    "FATAL: SANITY_API_WRITE_TOKEN env var is not set.\n" +
      "Create a write token at https://sanity.io → project → API → Tokens.\n" +
      "See scripts/SEED.md for full prerequisites."
  );
  process.exit(1);
}

const PROJECT_ID = process.env.SANITY_PROJECT_ID;
if (!PROJECT_ID) {
  console.error(
    "FATAL: SANITY_PROJECT_ID env var is not set.\n" +
      "Find your project ID at https://sanity.io → project → API.\n" +
      "See scripts/SEED.md for full prerequisites."
  );
  process.exit(1);
}

const DATASET = process.env.SANITY_DATASET ?? "production";

const client: SanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const REPO_ROOT = path.resolve(__dirname, "..");
const PHOTOS_ROOT = path.join(REPO_ROOT, "assets", "photos-web");
const PAINTINGS_DIR = path.join(PHOTOS_ROOT, "01-artwork", "fly-paintings");

// ---------------------------------------------------------------------------
// Helper: slugify
// ---------------------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Helper: upsert by slug field
// ---------------------------------------------------------------------------

async function upsertBySlug<T extends Record<string, unknown>>(
  docType: string,
  slugValue: string,
  doc: T
): Promise<string> {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{ _id }`,
    { type: docType, slug: slugValue }
  );

  if (existing) {
    await client
      .patch(existing._id)
      .set({ ...doc, _type: docType })
      .commit();
    console.log(`  ~ updated ${docType} "${slugValue}"`);
    return existing._id;
  } else {
    const created = await client.create({
      _type: docType,
      ...doc,
    });
    console.log(`  + created ${docType} "${slugValue}"`);
    return created._id;
  }
}

// ---------------------------------------------------------------------------
// Helper: upsert singleton (no slug, matched by _type + _id pattern)
// ---------------------------------------------------------------------------

async function upsertSingleton<T extends Record<string, unknown>>(
  docType: string,
  doc: T
): Promise<string> {
  const singletonId = `${docType}.singleton`;
  try {
    await client
      .patch(singletonId)
      .set({ _type: docType, ...doc })
      .commit();
    console.log(`  ~ updated singleton ${docType}`);
  } catch {
    await client.createOrReplace({
      _id: singletonId,
      _type: docType,
      ...doc,
    });
    console.log(`  + created singleton ${docType}`);
  }
  return singletonId;
}

// ---------------------------------------------------------------------------
// Helper: upload image asset if file exists; return asset ref or null
// ---------------------------------------------------------------------------

async function uploadImageAsset(
  filePath: string,
  label: string
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  if (!fs.existsSync(filePath)) {
    console.log(`  ! no file at ${filePath} — skipping asset upload for "${label}"`);
    return null;
  }

  const filename = path.basename(filePath);
  const stream = fs.createReadStream(filePath);

  const asset = await client.assets.upload("image", stream, {
    filename,
    label,
  });

  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

// ---------------------------------------------------------------------------
// Step 1 — Menu sections
// ---------------------------------------------------------------------------

interface RawMenuItem {
  id: string;
  name: string;
  description: string;
  price: string | null;
  price_unclear?: boolean;
  dietary_flags: string[];
  modifiers: string[];
  needs_reverification: boolean;
}

interface RawMenuSection {
  id: string;
  name: string;
  description: string;
  items: RawMenuItem[];
}

interface MenuJson {
  sections: RawMenuSection[];
}

async function seedMenu(): Promise<Map<string, string>> {
  console.log("\n--- Menu sections & items ---");

  const menuPath = path.join(REPO_ROOT, "docs", "menu-extracted.json");
  const raw: MenuJson = JSON.parse(fs.readFileSync(menuPath, "utf-8"));

  const sectionIdMap = new Map<string, string>();

  for (let i = 0; i < raw.sections.length; i++) {
    const section = raw.sections[i];
    const slug = section.id; // already kebab-case from source JSON

    const sectionDocId = await upsertBySlug("menuSection", slug, {
      name: section.name,
      slug: { _type: "slug", current: slug },
      description: section.description || null,
      orderRank: i + 1,
    });

    sectionIdMap.set(section.id, sectionDocId);
  }

  // Seed items after all sections exist so references resolve
  for (const section of raw.sections) {
    const sectionDocId = sectionIdMap.get(section.id);
    if (!sectionDocId) continue;

    for (let j = 0; j < section.items.length; j++) {
      const item = section.items[j];
      const itemSlug = item.id;

      // Items flagged needs_reverification get null price (rendered "Ask your server")
      const price: number | null = item.needs_reverification
        ? null
        : item.price !== null
          ? parseFloat(item.price)
          : null;

      const suitableForDiet: string[] = item.dietary_flags.flatMap((f) => {
        if (f === "vegetarian") return ["vegetarian"];
        if (f === "vegan") return ["vegan", "vegetarian"];
        return [];
      });

      await upsertBySlug("menuItem", itemSlug, {
        name: item.name,
        slug: { _type: "slug", current: itemSlug },
        description: item.description || null,
        price,
        suitableForDiet: suitableForDiet.length > 0 ? suitableForDiet : undefined,
        sectionRef: { _type: "reference", _ref: sectionDocId },
        needsReverification: item.needs_reverification,
        orderRank: j + 1,
      });
    }
  }

  return sectionIdMap;
}

// ---------------------------------------------------------------------------
// Step 2 — Fly paintings
// ---------------------------------------------------------------------------

/**
 * Canonical hero-rotation titles. Exactly five.
 * Source: docs/CLAUDE.md constraint #7 and docs/06-capture-debrief.md.
 */
const HERO_ROTATION_TITLES = new Set([
  "Fly Art Class",
  "Fly Fly-Fishing",
  "Flies on a Dinner Date",
  "Flies Kissing on a Hilltop",
  "The Eye Doctor",
]);

/**
 * Bathroom-context paintings: catalog-only, never in hero rotation.
 * Source: docs/CLAUDE.md constraint #7 and docs/06-capture-debrief.md.
 */
const BATHROOM_CONTEXT_TITLES = new Set([
  "Fly on the Toilet",
  "Bathroom Line",
  "Flies at Urinals",
]);

/**
 * People-photo exclusion list.
 * These files contain identifiable people and must not be published
 * until explicit consent is obtained post-handoff.
 * See scripts/SEED.md §People-photo exclusion list.
 */
const EXCLUDED_PEOPLE_PHOTOS = new Set([
  path.join(PHOTOS_ROOT, "02-bar", "back-bar-wide-with-staff.jpg"),
]);

interface PaintingDef {
  slug: string;
  title: string;
  description: string;
  inHeroRotation: boolean;
  category: "dining-room" | "bathroom-context";
  // artistAttribution: null — TODO: gather from next visit; see OPEN-QUESTIONS.md
  imageFile: string; // relative to PAINTINGS_DIR
  orderRank: number;
}

const PAINTINGS: PaintingDef[] = [
  {
    slug: "fly-perched-on-blank-page",
    title: "Fly Perched on Blank Page",
    description:
      "A single fly at top-right of an almost-empty page with a tiny landscape sketched along the bottom. Quiet and contemplative.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "01-fly-perched-on-blank-page.jpg",
    orderRank: 1,
  },
  {
    slug: "fly-asleep-in-the-recliner",
    title: "Fly Asleep in the Recliner",
    description:
      'A fly slumped in an armchair, drink in hand, ottoman present, TV in background, "zzz" floating up. A universal dad-nap.',
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "02-fly-asleep-recliner-tv.jpg",
    orderRank: 2,
  },
  {
    slug: "fly-art-class",
    title: "Fly Art Class",
    description:
      "An art class with a fly model on a pedestal at center, three fly artists at easels painting it. Recursive, self-aware, and the clearest statement of the brand thesis.",
    inHeroRotation: true,
    category: "dining-room",
    imageFile: "03-fly-art-class-portrait-session.jpg",
    orderRank: 3,
  },
  {
    slug: "fly-on-horseback",
    title: "Fly on Horseback",
    description:
      "A small bewildered horse with a fly mounted on it in cowboy posture. Touches of absurdist Westerns.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "04-fly-on-horseback-cowboy.jpg",
    orderRank: 4,
  },
  {
    slug: "flies-playing-hopscotch",
    title: "Flies Playing Hopscotch",
    description:
      "Two flies, one mid-jump, the other watching, with a hopscotch grid drawn out. Childhood and play.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "05-flies-playing-hopscotch.jpg",
    orderRank: 5,
  },
  {
    slug: "fly-fly-fishing",
    title: "Fly Fly-Fishing",
    description:
      "A fly in waders on a tackle box, casting a line at another fly. The pun is perfect and the execution earns it.",
    inHeroRotation: true,
    category: "dining-room",
    imageFile: "06-fly-fly-fishing.jpg",
    orderRank: 6,
  },
  {
    slug: "fly-band-and-buskers",
    title: "Fly Band and Buskers",
    description:
      "A fly band on the right (tuba, trumpet) with two flies on the left dropping coins in a tip jar. Music and community.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "07-fly-band-buskers-with-tip-jar.jpg",
    orderRank: 7,
  },
  {
    slug: "flies-on-a-dinner-date",
    title: "Flies on a Dinner Date",
    description:
      'Two flies at a candlelit dinner with wine, curtains, tablecloth. Marketing gold for "a finer diner" — this is the romance of the place.',
    inHeroRotation: true,
    category: "dining-room",
    imageFile: "08-flies-candlelit-dinner-date.jpg",
    orderRank: 8,
  },
  {
    slug: "suburban-summer",
    title: "Suburban Summer",
    description:
      "One fly mowing the lawn, another lounging under an umbrella with a martini, pointing back at the worker. Observational humor at its driest.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "09-fly-mowing-lawn-other-on-vacation.jpg",
    orderRank: 9,
  },
  {
    slug: "lightsaber-duel",
    title: "Lightsaber Duel",
    description:
      "Two flies in a Star Wars saber clash, blue vs. red blades. The artist is in conversation with the wider world.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "10-flies-lightsaber-duel.jpg",
    orderRank: 10,
  },
  {
    slug: "flies-kissing-on-a-hilltop",
    title: "Flies Kissing on a Hilltop",
    description:
      "Two flies kissing, hearts floating up. A tender Valentine-card piece and direct merch candidate.",
    inHeroRotation: true,
    category: "dining-room",
    imageFile: "11-flies-kissing-with-hearts.jpg",
    orderRank: 11,
  },
  {
    slug: "desert-castaway",
    title: "Desert Castaway",
    description:
      "A fly collapsed at the end of a long crawled trail through dunes under a relentless sun. Looney Tunes desert gag with empathy.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "12-fly-collapsed-in-desert.jpg",
    orderRank: 12,
  },
  {
    slug: "the-eye-doctor",
    title: "The Eye Doctor",
    description:
      'A fly optometrist points at a chart that reads "FLY / PROL / IZHN / BVRS"; a patient fly squints from a stool, guessing "K". The chart literally spells "FLY" — diegetic branding.',
    inHeroRotation: true,
    category: "dining-room",
    // Two versions of this painting exist (A and B). Seeding version A as primary.
    imageFile: "13-fly-eye-doctor-version-A.jpg",
    orderRank: 13,
  },
  {
    slug: "fly-on-the-toilet",
    title: "Fly on the Toilet",
    description:
      "A fly mid-business, reaching for toilet paper. Bathroom-context piece, likely hung near the restrooms.",
    inHeroRotation: false,
    category: "bathroom-context",
    imageFile: "14-fly-on-toilet.jpg",
    orderRank: 14,
  },
  {
    slug: "bathroom-line",
    title: "Bathroom Line",
    description:
      "A row of flies waiting at the men's and women's restroom doors, one visibly impatient. Bathroom-context companion piece.",
    inHeroRotation: false,
    category: "bathroom-context",
    imageFile: "15-flies-bathroom-line.jpg",
    orderRank: 15,
  },
  {
    slug: "flies-at-urinals",
    title: "Flies at Urinals",
    description:
      "Two flies at the urinals, body language doing all the work. Completes the bathroom-context triptych.",
    inHeroRotation: false,
    category: "bathroom-context",
    imageFile: "16-flies-at-urinals.jpg",
    orderRank: 16,
  },
  {
    slug: "drunk-fly",
    title: "Drunk Fly",
    description:
      "One fly partying with a beer, another looking forlorn near a paper-towel dispenser. Tonal range — the artist trusts the viewer with bittersweet.",
    inHeroRotation: false,
    category: "dining-room",
    imageFile: "17-drunk-fly-with-other-on-scale.jpg",
    orderRank: 17,
  },
];

// Runtime assertion — ensures the hero list stays exactly 5
const heroCount = PAINTINGS.filter((p) => p.inHeroRotation).length;
if (heroCount !== 5) {
  throw new Error(
    `Hero rotation count is ${heroCount}, expected exactly 5. ` +
      "Check PAINTINGS array in scripts/seed.ts."
  );
}

// Runtime assertion — bathroom-context paintings must not be in hero rotation
for (const p of PAINTINGS) {
  if (BATHROOM_CONTEXT_TITLES.has(p.title) && p.inHeroRotation) {
    throw new Error(
      `"${p.title}" is bathroom-context but has inHeroRotation: true. Fix PAINTINGS array.`
    );
  }
}

async function seedPaintings(): Promise<void> {
  console.log("\n--- Fly paintings ---");

  for (const painting of PAINTINGS) {
    const imagePath = path.join(PAINTINGS_DIR, painting.imageFile);
    const imageRef = await uploadImageAsset(imagePath, painting.title);

    await upsertBySlug("flyPainting", painting.slug, {
      title: painting.title,
      slug: { _type: "slug", current: painting.slug },
      description: painting.description,
      inHeroRotation: painting.inHeroRotation,
      catalogOnly: !painting.inHeroRotation,
      category: painting.category,
      // TODO: artistAttribution — not yet gathered. See OPEN-QUESTIONS.md.
      // Ask Kara post-handoff; highest priority for next visit.
      artistAttribution: null,
      orderRank: painting.orderRank,
      capturedDate: "2026-04-25",
      ...(imageRef ? { image: imageRef } : {}),
    });
  }
}

// ---------------------------------------------------------------------------
// Step 3 — Site settings (singleton)
// ---------------------------------------------------------------------------

async function seedSiteSettings(): Promise<void> {
  console.log("\n--- Site settings ---");

  await upsertSingleton("siteSettings", {
    businessName: "The Fly Trap",
    taglinePrimary: "a finer diner",
    taglineSecondary: "Under Old Management",
    taglineTertiary: "Catch a Buzz",
    originHandle: "Buzzin' since 2004",
    address: "22950 Woodward Ave, Ferndale, MI 48220",
    phone: "(248) 399-5150",
    // TODO: pressEmail — open question; leave null until confirmed post-handoff.
    // See docs/OPEN-QUESTIONS.md.
    pressEmail: null,
    hoursMonFri: "8am-3pm",
    hoursSatSun: "8am-3pm",
    latitude: 42.4503,
    longitude: -83.1449,
    currentOwners: "Kara & Gavin McMillian",
    foundedYear: 2004,
    ddDFeature: true,
    canonicalDomain: "theflytrapferndale.com",
    instagramHandle: "@theflytrapferndale",
    instagramUrl: "https://www.instagram.com/theflytrapferndale/",
    facebookUrl: "https://www.facebook.com/flytrapferndale/",
    seoDescription:
      "The Fly Trap is a beloved Ferndale diner serving elevated American comfort food since 2004. Featured on Food Network's Diners, Drive-Ins and Dives.",
  });
}

// ---------------------------------------------------------------------------
// Step 4 — FAQ entries
// Source: docs/03-seo-aeo-strategy.md §Part 2 and docs/discoverability/llms-full.txt
// TBD entries (needsContent: true) are stubs from llms-full.txt flagged there.
// ---------------------------------------------------------------------------

interface FaqDef {
  slug: string;
  question: string;
  answer: string | null;
  category: "visiting" | "food" | "business" | "ordering";
  needsContent: boolean;
  orderRank: number;
}

const FAQ_ENTRIES: FaqDef[] = [
  // Visiting
  {
    slug: "faq-what-are-hours",
    question: "What are The Fly Trap's hours?",
    answer: "Open Monday through Sunday, 8 a.m. to 3 p.m.",
    category: "visiting",
    needsContent: false,
    orderRank: 1,
  },
  {
    slug: "faq-where-located",
    question: "Where is The Fly Trap located?",
    answer: "22950 Woodward Ave, Ferndale, MI 48220.",
    category: "visiting",
    needsContent: false,
    orderRank: 2,
  },
  {
    slug: "faq-is-there-parking",
    question: "Is there parking at The Fly Trap?",
    answer: "Yes, there is on-site parking available.",
    category: "visiting",
    needsContent: false,
    orderRank: 3,
  },
  {
    slug: "faq-dog-friendly",
    question: "Is The Fly Trap dog-friendly?",
    answer: "Yes, The Fly Trap welcomes dogs in the outdoor seating area.",
    category: "visiting",
    needsContent: false,
    orderRank: 4,
  },
  {
    slug: "faq-takes-reservations",
    question: "Does The Fly Trap take reservations?",
    answer: "The Fly Trap operates on a walk-in basis. No reservations.",
    category: "visiting",
    needsContent: false,
    orderRank: 5,
  },
  {
    slug: "faq-wheelchair-accessible",
    question: "Is The Fly Trap wheelchair accessible?",
    answer: "Yes, the entrance and interior are wheelchair accessible.",
    category: "visiting",
    needsContent: false,
    orderRank: 6,
  },
  // Food
  {
    slug: "faq-what-kind-of-food",
    question: "What kind of food does The Fly Trap serve?",
    answer:
      "American comfort food with global influences, ranging from traditional diner fare to Vietnamese pho, Thai-inspired dishes, and vegetarian options.",
    category: "food",
    needsContent: false,
    orderRank: 7,
  },
  {
    slug: "faq-vegan-options",
    question: "Does The Fly Trap have vegan options?",
    answer: "Yes, vegan options are available on the menu.",
    category: "food",
    needsContent: false,
    orderRank: 8,
  },
  {
    slug: "faq-vegetarian-options",
    question: "Does The Fly Trap have vegetarian options?",
    answer: "Yes, vegetarian options are available on the menu.",
    category: "food",
    needsContent: false,
    orderRank: 9,
  },
  {
    slug: "faq-gluten-free",
    // TBD — flagged in llms-full.txt as "Coming from Sanity — please verify"
    question: "Is The Fly Trap gluten-free friendly?",
    answer: null,
    category: "food",
    needsContent: true,
    orderRank: 10,
  },
  {
    slug: "faq-popular-dishes",
    question: "What are The Fly Trap's most popular dishes?",
    answer:
      "Signature items include Gingerbread Waffles, The Forager, Lemongrass Pho Bowl, Red Chili Salmon Burger, Green Eggs and Ham, Thai Peanut Chicken, Cowboy Curtis, Red Flannel Hash, and Veggie Rumble.",
    category: "food",
    needsContent: false,
    orderRank: 11,
  },
  {
    slug: "faq-serves-alcohol",
    // TBD — flagged in llms-full.txt as "Coming from Sanity — please verify"
    question: "Does The Fly Trap serve alcohol?",
    answer: null,
    category: "food",
    needsContent: true,
    orderRank: 12,
  },
  // The Business
  {
    slug: "faq-when-opened",
    question: "When did The Fly Trap open?",
    answer: "December 28, 2004.",
    category: "business",
    needsContent: false,
    orderRank: 13,
  },
  {
    slug: "faq-who-owns",
    question: "Who owns The Fly Trap?",
    answer:
      "Kara and Gavin McMillian are the original founders and current owners, having returned to ownership in October 2024.",
    category: "business",
    needsContent: false,
    orderRank: 14,
  },
  {
    slug: "faq-been-on-tv",
    question: "Has The Fly Trap been on TV?",
    answer:
      "Yes, The Fly Trap was featured on Food Network's Diners, Drive-Ins and Dives.",
    category: "business",
    needsContent: false,
    orderRank: 15,
  },
  {
    slug: "faq-finer-diner-meaning",
    question: 'What does "a finer diner" mean?',
    answer:
      'It is the primary tagline, capturing the restaurant\'s positioning: elevated comfort food in a diner setting, decorated with personality and pride.',
    category: "business",
    needsContent: false,
    orderRank: 16,
  },
  {
    slug: "faq-name-origin",
    // TBD — flagged in llms-full.txt as "Coming from Sanity — please verify"
    question: 'Where did the name "Fly Trap" come from?',
    answer: null,
    category: "business",
    needsContent: true,
    orderRank: 17,
  },
  {
    slug: "faq-under-old-management-meaning",
    question: 'What does "Under Old Management" mean?',
    answer:
      "It is the secondary tagline. The McMillians use it to signal their return to ownership in October 2024 — a warm, self-aware flip of the typical \"Under New Management\" sign.",
    category: "business",
    needsContent: false,
    orderRank: 18,
  },
  {
    slug: "faq-changed-owners",
    question: "Did The Fly Trap change owners?",
    answer:
      "Kara and Gavin McMillian opened The Fly Trap in 2004 and ran it until 2021. They sold to Matt Buskard in February 2022. In October 2024, Buskard transferred operations back to the McMillians, who run the restaurant today.",
    category: "business",
    needsContent: false,
    orderRank: 19,
  },
  {
    slug: "faq-original-owners-back",
    question: "Are the original owners back at The Fly Trap?",
    answer:
      "Yes. The McMillians returned to full ownership and operation in October 2024 and have been running the restaurant ever since.",
    category: "business",
    needsContent: false,
    orderRank: 20,
  },
  // Ordering
  {
    slug: "faq-order-online",
    question: "Can I order from The Fly Trap online?",
    answer:
      "Online ordering through Toast is coming soon. Sign up at the site to be notified when it launches.",
    category: "ordering",
    needsContent: false,
    orderRank: 21,
  },
  {
    slug: "faq-delivery",
    // TBD — flagged in llms-full.txt as "Coming from Sanity — please verify"
    question: "Does The Fly Trap deliver?",
    answer: null,
    category: "ordering",
    needsContent: true,
    orderRank: 22,
  },
  {
    slug: "faq-swat-sauce-online",
    question: "Can I buy Swat Sauce online?",
    answer:
      "Yes, Swat Sauces and other retail items are available in the online shop.",
    category: "ordering",
    needsContent: false,
    orderRank: 23,
  },
  {
    slug: "faq-gift-cards",
    question: "Does The Fly Trap sell gift cards?",
    answer: "Yes, gift cards are available for purchase in-store and online.",
    category: "ordering",
    needsContent: false,
    orderRank: 24,
  },
];

async function seedFaqEntries(): Promise<void> {
  console.log("\n--- FAQ entries ---");

  for (const entry of FAQ_ENTRIES) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "faqEntry" && slug.current == $slug][0]{ _id }`,
      { slug: entry.slug }
    );

    const doc = {
      question: entry.question,
      slug: { _type: "slug", current: entry.slug },
      answer: entry.answer,
      category: entry.category,
      needsContent: entry.needsContent,
      orderRank: entry.orderRank,
    };

    if (existing) {
      await client.patch(existing._id).set({ _type: "faqEntry", ...doc }).commit();
      console.log(`  ~ updated faqEntry "${entry.slug}"`);
    } else {
      await client.create({ _type: "faqEntry", ...doc });
      console.log(`  + created faqEntry "${entry.slug}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Step 5 — Press entries
// Source: docs/02-press-page-spec.md
// ---------------------------------------------------------------------------

interface PressEntryDef {
  slug: string;
  headline: string;
  outlet: string;
  publishDate: string; // ISO date string
  pullQuote: string | null;
  sourceUrl: string;
  category: "national" | "regional" | "local" | "blog";
  isFeatured: boolean;
  isTvFeature: boolean;
  authorName: string | null;
  orderRank: number;
}

const PRESS_ENTRIES: PressEntryDef[] = [
  {
    slug: "press-food-network-ddd",
    headline: "Featured on Food Network's Diners, Drive-Ins and Dives",
    outlet: "Food Network — Diners, Drive-Ins and Dives",
    // TODO: exact air date not confirmed; placeholder year 2010 pending verification.
    // See docs/02-press-page-spec.md "Sources still to confirm."
    publishDate: "2010-01-01",
    pullQuote:
      "One of the first places I saw when the show started — it was fabulous.",
    // TODO: confirm episode number and direct clip URL post-handoff.
    sourceUrl: "https://www.foodnetwork.com/shows/diners-drive-ins-and-dives",
    category: "national",
    isFeatured: true,
    isTvFeature: true,
    authorName: "Guy Fieri",
    orderRank: 1,
  },
  {
    slug: "press-crains-oct-2024",
    headline: "McMillians take back ownership — the return story",
    outlet: "Crain's Detroit Business",
    publishDate: "2024-10-21",
    pullQuote: "We want to make sure the legacy of The Fly Trap lives on.",
    // TODO: confirm direct Crain's URL before launch.
    sourceUrl: "https://www.crainsdetroit.com",
    category: "regional",
    isFeatured: false,
    isTvFeature: false,
    authorName: "Jay Davis",
    orderRank: 2,
  },
  {
    slug: "press-detroit-free-press-feb-2022",
    headline: "Reopening under new ownership",
    outlet: "Detroit Free Press",
    publishDate: "2022-02-01",
    pullQuote: null,
    sourceUrl: "https://www.freep.com",
    category: "regional",
    isFeatured: false,
    isTvFeature: false,
    authorName: "Susan Selasky",
    orderRank: 3,
  },
  {
    slug: "press-detroit-news-jul-2022",
    headline: "As good as ever",
    outlet: "The Detroit News",
    publishDate: "2022-07-14",
    pullQuote: "as good as ever",
    // TODO: confirm direct Detroit News URL before launch.
    sourceUrl: "https://www.detroitnews.com",
    category: "regional",
    isFeatured: false,
    isTvFeature: false,
    authorName: null,
    orderRank: 4,
  },
  {
    slug: "press-metro-times-dining",
    headline: "Dining listings and ownership-change coverage",
    outlet: "Metro Times Detroit",
    // Approximate date for the most recent Metro Times coverage.
    publishDate: "2024-11-01",
    pullQuote: null,
    sourceUrl: "https://www.metrotimes.com",
    category: "regional",
    isFeatured: false,
    isTvFeature: false,
    authorName: null,
    orderRank: 5,
  },
  {
    slug: "press-oakland-county-times-dec-2020",
    headline: "Gingerbread Waffle and BLAT+C omelette feature",
    outlet: "Oakland County Times — Reporter Food",
    publishDate: "2020-12-01",
    pullQuote: null,
    sourceUrl: "https://www.oaklandcountytimes.com",
    category: "local",
    isFeatured: false,
    isTvFeature: false,
    authorName: null,
    orderRank: 6,
  },
  {
    slug: "press-oakland-county-times-apr-2022",
    headline: "Post-reopening revisit — nothing has changed",
    outlet: "Oakland County Times — Reporter Food",
    publishDate: "2022-04-01",
    pullQuote: null,
    sourceUrl: "https://www.oaklandcountytimes.com",
    category: "local",
    isFeatured: false,
    isTvFeature: false,
    authorName: null,
    orderRank: 7,
  },
  {
    slug: "press-utr-michigan-jun-2019",
    headline: "Eclectic decor and creative cuisine",
    outlet: "UTR Michigan",
    publishDate: "2019-06-01",
    pullQuote:
      "From the crazy decor to the creative cuisine, these three came up with a winning recipe.",
    sourceUrl: "https://www.umich.edu",
    category: "local",
    isFeatured: false,
    isTvFeature: false,
    authorName: null,
    orderRank: 8,
  },
];

async function seedPressEntries(): Promise<void> {
  console.log("\n--- Press entries ---");

  for (const entry of PRESS_ENTRIES) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "pressEntry" && slug.current == $slug][0]{ _id }`,
      { slug: entry.slug }
    );

    const doc = {
      headline: entry.headline,
      slug: { _type: "slug", current: entry.slug },
      outlet: entry.outlet,
      publishDate: entry.publishDate,
      pullQuote: entry.pullQuote,
      sourceUrl: entry.sourceUrl,
      category: entry.category,
      isFeatured: entry.isFeatured,
      isTvFeature: entry.isTvFeature,
      authorName: entry.authorName,
      orderRank: entry.orderRank,
    };

    if (existing) {
      await client.patch(existing._id).set({ _type: "pressEntry", ...doc }).commit();
      console.log(`  ~ updated pressEntry "${entry.slug}"`);
    } else {
      await client.create({ _type: "pressEntry", ...doc });
      console.log(`  + created pressEntry "${entry.slug}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log(`Seeding Sanity dataset "${DATASET}" (project: ${PROJECT_ID})\n`);

  await seedMenu();
  await seedPaintings();
  await seedSiteSettings();
  await seedFaqEntries();
  await seedPressEntries();

  console.log("\nSeed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
