'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-3xl text-[color:var(--color-flytrap-red-deep)]">
        A glitch in the wing.
      </h1>
      <p className="mt-4 text-base text-[color:var(--color-text-ink)]">
        Something went sideways. Try again, or head back to the diner.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-sm bg-[color:var(--color-flytrap-red-deep)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--color-flytrap-red-bright)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm underline text-[color:var(--color-text-ink)]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
