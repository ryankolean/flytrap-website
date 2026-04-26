'use client';

import type { CSSProperties, ReactNode } from 'react';

export type Zone = 'red' | 'gray' | 'mustard';

interface ThemeZoneProps {
  zone: Zone;
  children: ReactNode;
  className?: string;
}

const zoneStyles: Record<Zone, CSSProperties> = {
  red: {
    ['--bg' as string]: 'var(--color-flytrap-red-deep)',
    ['--fg' as string]: 'var(--color-text-light)',
    ['--accent' as string]: 'var(--color-flytrap-red-bright)',
  },
  gray: {
    ['--bg' as string]: 'var(--color-bar-fog)',
    ['--fg' as string]: 'var(--color-text-light)',
    ['--accent' as string]: 'var(--color-marble-white)',
  },
  mustard: {
    ['--bg' as string]: 'var(--color-corridor-mustard)',
    ['--fg' as string]: 'var(--color-text-ink)',
    ['--accent' as string]: 'var(--color-flytrap-red-deep)',
  },
};

export function ThemeZone({ zone, children, className }: ThemeZoneProps) {
  return (
    <section
      data-zone={zone}
      className={className}
      style={zoneStyles[zone]}
    >
      {children}
    </section>
  );
}
