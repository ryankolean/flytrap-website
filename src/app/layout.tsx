import type { Viewport } from 'next';
import './globals.css';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ThemeZoneProvider } from '@/components/layout/ThemeZoneProvider';
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
        <ThemeZoneProvider>
          <Nav />
          {children}
          <Footer />
        </ThemeZoneProvider>
      </body>
    </html>
  );
}
