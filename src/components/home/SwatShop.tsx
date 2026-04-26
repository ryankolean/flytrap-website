import Link from 'next/link';

const PRODUCTS = [
  {
    slug: 'swat-sauces',
    name: 'Swat Sauces',
    description: 'House-made hot sauces born in the kitchen. Bring the Fly Trap home.',
    priceRange: '$8–$14',
  },
  {
    slug: 'gift-cards',
    name: 'Gift Cards',
    description: 'The gift that guarantees a magnificent meal on Woodward.',
    priceRange: '$10–$50',
  },
  {
    slug: 't-shirts',
    name: 'T-Shirts',
    description: 'Wear your buzz. Soft tees with the fly art you know and love.',
    priceRange: '$24–$32',
  },
] as const;

export function SwatShop() {
  return (
    <section aria-labelledby="swat-shop-heading" className="py-16 px-4 bg-amber-50">
      <div className="max-w-5xl mx-auto">
        <h2
          id="swat-shop-heading"
          className="text-2xl font-bold text-stone-900 mb-2 text-center"
        >
          Swat Shop
        </h2>
        <p className="text-center text-stone-600 mb-10 text-sm">
          A little piece of the Fly Trap — to go.
        </p>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/shop#${product.slug}`}
                className="group block border border-stone-200 bg-white hover:border-stone-400 transition-colors"
              >
                {/* Photo placeholder — Task 13 will replace with spot illustration */}
                <div
                  className="w-full h-48 bg-stone-100 flex items-center justify-center text-stone-400 text-xs"
                  aria-hidden="true"
                >
                  fly placeholder
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {product.name}
                    </h3>
                    <span className="shrink-0 text-xs bg-stone-800 text-white px-2 py-0.5">
                      Coming soon
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 mb-3">{product.description}</p>
                  <p className="text-sm font-medium text-stone-800">{product.priceRange}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-block text-sm underline underline-offset-4 text-stone-700 hover:text-stone-900 transition-colors"
          >
            See everything in the shop
          </Link>
        </div>
      </div>
    </section>
  );
}
