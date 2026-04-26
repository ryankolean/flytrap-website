import Image from 'next/image';
import { getCurrentDailySpecial } from '@/lib/dailySpecial';
// FlyPouringCoffee will be wired after Task 13 lands
import { FlyPouringCoffee } from '@/components/illustrations';

export default async function TodaysBuzzing() {
  const special = await getCurrentDailySpecial();

  if (!special) return null;

  return (
    <section aria-label="Today's Buzzing">
      <div className="flex items-center gap-3 mb-4">
        <FlyPouringCoffee className="w-10 h-10 shrink-0" aria-hidden={true} />
        <h2 className="font-display text-2xl leading-tight">
          Today&rsquo;s Buzzing
        </h2>
      </div>

      <div className="bg-surface-warm rounded-lg overflow-hidden">
        {special.image && (
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={special.image.url}
              alt={special.image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        )}

        <div className="p-4 space-y-2">
          <h3 className="font-display text-xl">{special.title}</h3>

          {special.description && (
            <p className="text-body leading-relaxed">{special.description}</p>
          )}

          {special.price !== undefined && (
            <p className="text-sm font-medium text-accent">
              ${special.price.toFixed(2)}
            </p>
          )}

          {special.sourceUrl && special.source === 'instagram' && (
            <a
              href={special.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm underline underline-offset-2 hover:text-accent transition-colors"
            >
              See on Instagram
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
