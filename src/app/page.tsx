import Hero from '@/components/home/Hero';
import TodaysBuzzing from '@/components/home/TodaysBuzzing';
import { MenuTease } from '@/components/home/MenuTease';
import { OrderComingSoon } from '@/components/home/OrderComingSoon';
import { TheRoom } from '@/components/home/TheRoom';
import BuzzinSince2004 from '@/components/home/BuzzinSince2004';
import { SwatShop } from '@/components/home/SwatShop';
import VisitTeaser from '@/components/home/VisitTeaser';
import { ThemeZone } from '@/components/layout/ThemeZone';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'The Fly Trap',
  description:
    "Buzzin' since 2004. The Fly Trap is a finer diner at 22950 Woodward Ave, Ferndale MI. Mon to Sun, 8am to 3pm.",
  path: '/',
});

export default function Home() {
  return (
    <main>
      <ThemeZone zone="red">
        <Hero />
      </ThemeZone>

      <ThemeZone zone="mustard">
        <TodaysBuzzing />
      </ThemeZone>

      <ThemeZone zone="gray">
        <MenuTease />
      </ThemeZone>

      <ThemeZone zone="gray">
        <OrderComingSoon />
      </ThemeZone>

      <ThemeZone zone="gray">
        <TheRoom />
      </ThemeZone>

      <ThemeZone zone="mustard">
        <BuzzinSince2004 />
      </ThemeZone>

      <ThemeZone zone="gray">
        <SwatShop />
      </ThemeZone>

      <ThemeZone zone="mustard">
        <VisitTeaser />
      </ThemeZone>
    </main>
  );
}
