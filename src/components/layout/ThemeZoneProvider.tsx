'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';

export type Zone = 'red' | 'gray' | 'mustard';

interface ThemeZoneContextValue {
  zone: Zone;
  setZone: (zone: Zone) => void;
}

const ThemeZoneContext = createContext<ThemeZoneContextValue | undefined>(
  undefined
);

export function ThemeZoneProvider({
  children,
  initialZone = 'red',
}: {
  children: ReactNode;
  initialZone?: Zone;
}) {
  const [zone, setZone] = useState<Zone>(initialZone);
  const value = useMemo(() => ({ zone, setZone }), [zone]);

  return (
    <ThemeZoneContext.Provider value={value}>
      <div data-zone={zone}>{children}</div>
    </ThemeZoneContext.Provider>
  );
}

export function useThemeZone(): ThemeZoneContextValue {
  const ctx = useContext(ThemeZoneContext);
  if (!ctx) {
    return { zone: 'red', setZone: () => undefined };
  }
  return ctx;
}
