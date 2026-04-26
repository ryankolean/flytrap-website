'use client';

import { useEffect, useState } from 'react';

const OPEN_HOUR = 8;
const CLOSE_HOUR = 15;
const TIME_ZONE = 'America/Detroit';

interface OpenState {
  isOpen: boolean;
  label: string;
}

function computeOpenState(now: Date): OpenState {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  const minutesSinceMidnight = hour * 60 + minute;
  const openMinutes = OPEN_HOUR * 60;
  const closeMinutes = CLOSE_HOUR * 60;

  const isOpen =
    minutesSinceMidnight >= openMinutes && minutesSinceMidnight < closeMinutes;

  return {
    isOpen,
    label: isOpen ? 'Open now' : 'Closed — opens 8:00 AM',
  };
}

export function OpenBadge() {
  const [state, setState] = useState<OpenState>(() =>
    computeOpenState(new Date())
  );

  useEffect(() => {
    const tick = () => setState(computeOpenState(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={
        state.isOpen
          ? 'inline-flex items-center gap-2 rounded-full bg-[color:var(--color-marble-emerald)]/15 px-3 py-1 text-xs font-medium text-[color:var(--color-marble-emerald)]'
          : 'inline-flex items-center gap-2 rounded-full bg-[color:var(--color-text-charcoal)]/15 px-3 py-1 text-xs font-medium text-[color:var(--color-text-charcoal)]'
      }
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={
          state.isOpen
            ? 'h-2 w-2 rounded-full bg-[color:var(--color-marble-emerald)]'
            : 'h-2 w-2 rounded-full bg-[color:var(--color-text-charcoal)]'
        }
      />
      {state.label}
    </span>
  );
}

export default OpenBadge;
