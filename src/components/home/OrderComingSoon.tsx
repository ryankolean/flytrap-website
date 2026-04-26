import { IntentCaptureForm } from '@/components/order/IntentCaptureForm';

export function OrderComingSoon() {
  return (
    <section className="w-full px-4 py-8">
      <div className="max-w-md mx-auto border border-stone-200 bg-stone-50 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-stone-900 leading-tight">
          Online ordering &mdash; coming soon
        </h2>

        <p className="text-sm text-stone-600">
          We&apos;ll send one email when ordering goes live. No marketing.
        </p>

        <IntentCaptureForm source="home" />

        <p className="text-xs text-stone-400">Powered by Toast</p>
      </div>
    </section>
  );
}
