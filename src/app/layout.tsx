import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Fly Trap',
  description: 'A finer diner in Ferndale, Michigan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
