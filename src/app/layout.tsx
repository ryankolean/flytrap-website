import type { Viewport } from 'next';
import './globals.css';
import { defaultMetadata } from '@/lib/metadata';

export const metadata = defaultMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#992F1E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-900 focus:shadow-lg focus:outline focus:outline-2 focus:outline-stone-900"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
