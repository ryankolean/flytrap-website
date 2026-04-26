'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { client } from '@/sanity/lib/client';

const emailSchema = z.string().email();

// Module-scope rate-limit store: IP -> array of timestamps
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    rateLimitStore.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

export async function submitIntentCapture(
  _prevState: { ok: boolean; error?: string },
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const honeypot = formData.get('website');
  if (honeypot) {
    // Silent reject — bot trap triggered
    return { ok: true };
  }

  const email = formData.get('email');
  const source = formData.get('source');

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { ok: false, error: 'Please enter a valid email.' };
  }

  const headersList = await headers();
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return { ok: false, error: 'Too many requests. Try again later.' };
  }

  try {
    await client.create({
      _type: 'intentCaptureSubmission',
      email: parsed.data,
      source: source ?? 'unknown',
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[intent-capture] Sanity write failed:', err);
    return { ok: false, error: 'Something went sideways. Try again.' };
  }

  return { ok: true };
}
