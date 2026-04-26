'use client';

// Home hero — three-tagline lockup, painting cross-fade, dual CTA, live open badge.
// Voice and rotation rules per docs/01-design-document-v1.7.md §6, §9 Section 4 and CLAUDE.md constraint #7.
// Single-file client component: fetches the five hero-eligible paintings from Sanity on mount,
// then cross-fades every 6 seconds. Respects prefers-reduced-motion (no rotation, first frame only).

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { OpenBadge } from '@/components/layout/OpenBadge';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

interface HeroPainting {
  _id: string;
  title: string;
  alt: string;
  imageUrl: string;
}

interface SanityHeroPainting {
  _id: string;
  title?: string;
  description?: string;
  image?: { asset?: { _ref?: string } } | null;
}

const heroPaintingsQuery = `*[_type == "flyPainting" && inHeroRotation == true] | order(orderRank asc) {
  _id,
  title,
  description,
  image
}`;

const ROTATION_MS = 6000;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function Hero() {
  const [paintings, setPaintings] = useState<HeroPainting[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    reducedMotionRef.current = prefersReducedMotion();

    async function load() {
      try {
        const results = await client.fetch<SanityHeroPainting[]>(heroPaintingsQuery);
        if (cancelled || !Array.isArray(results)) return;
        const mapped = results
          .filter((p) => p?.image)
          .map<HeroPainting>((p) => ({
            _id: p._id,
            title: p.title ?? '',
            alt: p.description ?? p.title ?? 'Fly Trap painting',
            imageUrl: urlFor(p.image as { asset?: { _ref?: string } })
              .width(2000)
              .quality(85)
              .auto('format')
              .url(),
          }));
        setPaintings(mapped);
      } catch {
        if (!cancelled) setPaintings([]);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;
    if (paintings.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % paintings.length);
    }, ROTATION_MS);
    return () => window.clearInterval(id);
  }, [paintings.length]);

  const visiblePaintings = useMemo(() => {
    if (reducedMotionRef.current && paintings.length > 0) {
      return [paintings[0]];
    }
    return paintings;
  }, [paintings]);

  return (
    <div
      className="relative flex min-h-[100vh] w-full flex-col items-center justify-center overflow-hidden px-5 py-20 text-center md:min-h-[80vh] md:px-8"
      style={{ backgroundColor: 'var(--color-flytrap-red-deep)' }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {visiblePaintings.map((painting, i) => (
          <Image
            key={painting._id}
            src={painting.imageUrl}
            alt=""
            fill
            priority={i === 0}
            className="object-cover transition-opacity duration-1000 ease-in-out"
            sizes="100vw"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-[color:var(--color-flytrap-red-deep)]/60" />
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-[color:var(--color-text-light)]">
          <span className="font-serif text-4xl leading-tight tracking-tight md:text-7xl">
            a finer diner
          </span>
          <span className="font-script text-2xl leading-snug text-[color:var(--color-marble-gold)] md:text-4xl">
            Under Old Management
          </span>
          <span className="font-sans text-sm uppercase tracking-[0.25em] text-[color:var(--color-cream-paper)]/85 md:text-base">
            Catch a Buzz
          </span>
        </div>

        <p className="max-w-xl font-serif text-lg leading-relaxed text-[color:var(--color-cream-paper)] md:text-xl">
          Twenty years of Buzzin&rsquo;, a room loud in the best way, and a pan
          of magnificent eggs waiting on Woodward.
        </p>

        <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/order"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[color:var(--color-flytrap-red-bright)] px-7 py-3 font-sans text-base font-semibold text-[color:var(--color-text-light)] shadow-md transition hover:bg-[color:var(--color-flytrap-red-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-marble-gold)] sm:w-auto"
          >
            Order Online
          </Link>
          <Link
            href="/menu"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border-2 border-[color:var(--color-cream-paper)] px-7 py-3 font-sans text-base font-semibold text-[color:var(--color-cream-paper)] transition hover:bg-[color:var(--color-cream-paper)] hover:text-[color:var(--color-flytrap-red-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-marble-gold)] sm:w-auto"
          >
            See Menu
          </Link>
        </div>

        <OpenBadge />
      </div>
    </div>
  );
}

export default Hero;
