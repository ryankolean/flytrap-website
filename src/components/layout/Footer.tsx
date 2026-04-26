import Link from 'next/link';

const footerLinks = [
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/press', label: 'Press' },
  { href: '/faq', label: 'FAQ' },
  { href: '/visit', label: 'Visit' },
  { href: '/order', label: 'Order' },
  { href: '/shop', label: 'Shop' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full bg-[color:var(--color-checker-black)] text-[color:var(--color-text-light)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-3">
        <section aria-labelledby="footer-contact">
          <h2
            id="footer-contact"
            className="font-serif text-lg text-[color:var(--color-cream-paper)]"
          >
            Visit
          </h2>
          <address className="mt-3 not-italic text-sm leading-6">
            <Link href="/visit" className="block hover:underline">
              22950 Woodward Ave
              <br />
              Ferndale, MI 48220
            </Link>
            <a
              href="tel:+12483995150"
              className="mt-2 block hover:underline"
            >
              (248) 399-5150
            </a>
            <span className="mt-2 block text-[color:var(--color-marble-white)]/80">
              Mon–Sun, 8am to 3pm
            </span>
          </address>
        </section>

        <nav aria-labelledby="footer-nav">
          <h2
            id="footer-nav"
            className="font-serif text-lg text-[color:var(--color-cream-paper)]"
          >
            Find your way
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-credits" className="text-sm">
          <h2
            id="footer-credits"
            className="font-serif text-lg text-[color:var(--color-cream-paper)]"
          >
            The Fly Trap
          </h2>
          <p className="mt-3 text-[color:var(--color-marble-white)]/80">
            Buzzin' since 2004.
          </p>
          <p className="mt-2 text-[color:var(--color-marble-white)]/60">
            &copy; {year} The Fly Trap. All rights reserved.
          </p>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
