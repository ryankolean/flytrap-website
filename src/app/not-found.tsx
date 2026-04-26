import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif text-3xl text-[color:var(--color-flytrap-red-deep)]">
        We could not find that page.
      </h1>
      <p className="mt-4 text-base text-[color:var(--color-text-ink)]">
        It might be on the other side of the screen door. Try the menu, or visit the diner.
      </p>
      <ul className="mt-8 flex flex-wrap gap-4 text-sm">
        <li>
          <Link href="/" className="underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/menu" className="underline">
            Menu
          </Link>
        </li>
        <li>
          <Link href="/visit" className="underline">
            Visit
          </Link>
        </li>
      </ul>
    </main>
  );
}
