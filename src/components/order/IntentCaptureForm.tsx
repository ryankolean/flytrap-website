'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitIntentCapture } from '@/app/actions/intent-capture';

interface IntentCaptureFormProps {
  source: 'home' | 'order-page' | 'shop';
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-stone-800 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
    >
      {pending ? 'Sending...' : 'Notify me'}
    </button>
  );
}

export function IntentCaptureForm({ source }: IntentCaptureFormProps) {
  const [state, formAction] = useActionState(submitIntentCapture, {
    ok: false,
    error: undefined,
  });

  if (state.ok) {
    return (
      <p className="text-sm text-stone-700">Thanks. We&apos;ll be in touch.</p>
    );
  }

  return (
    <form action={formAction} noValidate>
      <input type="hidden" name="source" value={source} />

      {/* Honeypot — hidden from real users, bots fill it */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor={`email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`email-${source}`}
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="w-full px-3 py-2 border border-stone-300 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-600"
          />
        </div>
        <SubmitButton />
      </div>

      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
    </form>
  );
}
