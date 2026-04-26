// /visit — hours, address, parking, accessibility, dog policy, consent-gated map
// from docs/01-design-document-v1.7.md §2 (brand facts, hours, address)
// from docs/03-seo-aeo-strategy.md §Part 1 (LocalBusiness JSON-LD, amenityFeature)

import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { generateRestaurantJsonLd, JsonLd } from '@/lib/jsonld';
import { MapEmbed } from '@/components/visit/MapEmbed';

export const metadata: Metadata = pageMetadata({
  title: 'Visit',
  description:
    'The Fly Trap is at 22950 Woodward Ave, Ferndale MI. Open Monday through Sunday, 8am to 3pm. Free parking lot. Dog-friendly patio. Wheelchair accessible.',
  path: '/visit',
});

const restaurantJsonLd = generateRestaurantJsonLd({
  description:
    "Neighborhood diner on Woodward Ave in Ferndale, Michigan. Serving elevated American comfort food with global accents since 2004. Featured on Food Network's Diners, Drive-Ins and Dives.",
});

export default function VisitPage() {
  return (
    <>
      <JsonLd data={restaurantJsonLd} />

      <main>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 leading-tight">
              Find us in Ferndale
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              22950 Woodward Ave, Ferndale, MI 48220
            </p>
          </header>

          {/* Hours */}
          <section className="mb-8" aria-labelledby="hours-heading">
            <h2 id="hours-heading" className="text-xl font-bold text-stone-900 mb-3">
              Hours
            </h2>
            <table className="w-full text-sm text-stone-700">
              <tbody>
                <tr>
                  <td className="py-1 font-semibold pr-8">Monday – Sunday</td>
                  <td className="py-1">8am – 3pm</td>
                </tr>
              </tbody>
            </table>
            <p className="text-stone-500 text-sm mt-2">
              Breakfast and lunch all day, every day. No reservations — walk-ins only.
            </p>
          </section>

          {/* Address & Phone */}
          <section className="mb-8" aria-labelledby="address-heading">
            <h2 id="address-heading" className="text-xl font-bold text-stone-900 mb-3">
              Address &amp; Phone
            </h2>
            <address className="not-italic text-stone-700 text-sm leading-relaxed">
              <p>22950 Woodward Ave</p>
              <p>Ferndale, MI 48220</p>
              <p className="mt-2">
                <a
                  href="tel:+12483995150"
                  className="underline underline-offset-2 hover:text-stone-900 transition-colors"
                >
                  (248) 399-5150
                </a>
              </p>
            </address>
          </section>

          {/* Parking */}
          <section className="mb-8" aria-labelledby="parking-heading">
            <h2 id="parking-heading" className="text-xl font-bold text-stone-900 mb-3">
              Parking
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">
              Free parking lot directly behind the building, accessible from the alley off Woodward.
              Street parking is also available on Woodward Ave and the surrounding side streets.
            </p>
          </section>

          {/* Accessibility */}
          <section className="mb-8" aria-labelledby="accessibility-heading">
            <h2 id="accessibility-heading" className="text-xl font-bold text-stone-900 mb-3">
              Accessibility
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">
              The Fly Trap has a wheelchair-accessible entrance. If you have specific accessibility
              questions before your visit, call us at{' '}
              <a
                href="tel:+12483995150"
                className="underline underline-offset-2 hover:text-stone-900 transition-colors"
              >
                (248) 399-5150
              </a>
              .
            </p>
          </section>

          {/* Dog policy */}
          <section className="mb-8" aria-labelledby="dogs-heading">
            <h2 id="dogs-heading" className="text-xl font-bold text-stone-900 mb-3">
              Dogs
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">
              Well-behaved dogs are welcome on our outdoor patio. Water bowls available on request.
              Please keep dogs leashed and off the furniture.
            </p>
          </section>

          {/* Map — consent-gated */}
          <section className="mb-8" aria-labelledby="map-heading">
            <h2 id="map-heading" className="text-xl font-bold text-stone-900 mb-3">
              Map
            </h2>
            <MapEmbed />
            <p className="text-stone-400 text-xs mt-2">
              Map loads from Google. Click to consent to Google's privacy policy.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
