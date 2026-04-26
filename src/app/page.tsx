import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'The Fly Trap',
  description:
    "Buzzin' since 2004. The Fly Trap is a finer diner at 22950 Woodward Ave, Ferndale MI. Mon to Sun, 8am to 3pm.",
  path: '/',
});

export default function Home() {
  return (
    <main id="main" className="min-h-screen bg-cream-paper text-text-ink">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="font-serif text-h1 text-flytrap-red-deep">
          the fly trap
        </h1>
        <p className="mt-2 font-script text-h3 text-text-charcoal">
          a finer diner
        </p>
        <p className="mt-8 text-body-base">
          Single-page rebuild placeholder. See{' '}
          <code className="rounded bg-bg-off-white px-2 py-1 font-mono text-body-sm">
            docs/CLAUDE-DESIGN.md
          </code>{' '}
          for section outline and tokens.
        </p>
      </div>
    </main>
  );
}
