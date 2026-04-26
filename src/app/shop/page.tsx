// TODO: Replace with real product cards + Shopify Lite or Square integration post-handoff.

import { pageMetadata } from '@/lib/metadata';
import { IntentCaptureForm } from '@/components/order/IntentCaptureForm';

export const metadata = pageMetadata({
  title: 'Shop',
  description: 'Swat Sauces, gift cards, T-shirts. Coming soon to The Fly Trap.',
  path: '/shop',
});

const PRODUCTS = [
  {
    id: 'swat-sauces',
    name: 'Swat Sauces',
    description:
      'The same house-made hot sauces that show up on your plate — bottled and ready for your kitchen. Rotating flavors, limited batches.',
    priceRange: '$8–$14',
    details: 'Glass bottle, 5 oz. Refrigerate after opening.',
  },
  {
    id: 'gift-cards',
    name: 'Gift Cards',
    description:
      'Give someone a magnificent morning on Woodward. Redeemable in-diner, no expiration.',
    priceRange: '$10–$50',
    details: 'Available in $10, $25, and $50 denominations.',
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description:
      'Soft unisex tees featuring the fly art from our walls. Buzzin\' since 2004 — now on cotton.',
    priceRange: '$24–$32',
    details: 'Sizes XS–3XL. Printed locally in Michigan.',
  },
] as const;

export default function ShopPage() {
  return (
    <main id="main" className="min-h-screen bg-amber-50">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-stone-900 mb-3">Swat Shop</h1>
          <p className="text-stone-600">
            A little piece of the Fly Trap — to go. Everything here is coming soon.
            Drop your email and we&apos;ll let you know when it opens.
          </p>
        </header>

        <section
          aria-label="Notify me when the shop opens"
          className="mb-14 p-6 border border-stone-200 bg-white"
        >
          <h2 className="text-base font-semibold text-stone-900 mb-1">
            Be the first to know
          </h2>
          <p className="text-sm text-stone-600 mb-4">
            We&apos;ll send one email when the shop goes live. No newsletters.
          </p>
          <IntentCaptureForm source="shop" />
        </section>

        <ul className="flex flex-col gap-10">
          {PRODUCTS.map((product) => (
            <li
              key={product.id}
              id={product.id}
              className="border border-stone-200 bg-white"
            >
              {/* Photo placeholder — Task 13 will replace with spot illustration */}
              <div
                className="w-full h-56 bg-stone-100 flex items-center justify-center text-stone-400 text-xs"
                aria-hidden="true"
              >
                fly placeholder
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-xl font-bold text-stone-900">{product.name}</h2>
                  <span className="shrink-0 text-xs bg-stone-800 text-white px-2 py-1">
                    Coming soon
                  </span>
                </div>
                <p className="text-stone-600 mb-2">{product.description}</p>
                <p className="text-sm text-stone-500 mb-4">{product.details}</p>
                <p className="font-semibold text-stone-800">{product.priceRange}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
