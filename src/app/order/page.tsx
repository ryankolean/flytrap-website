import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { OrderComingSoon } from '@/components/home/OrderComingSoon';

export const metadata: Metadata = pageMetadata({
  title: 'Order',
  description: "Online ordering at The Fly Trap, Buzzin since 2004. Coming soon.",
  path: '/order',
});

export default function OrderPage() {
  return (
    <main id="main" className="min-h-screen flex items-start justify-center pt-16 px-4">
      <OrderComingSoon />
    </main>
  );
}
