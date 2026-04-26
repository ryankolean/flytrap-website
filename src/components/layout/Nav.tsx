import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/press', label: 'Press' },
  { href: '/faq', label: 'FAQ' },
  { href: '/visit', label: 'Visit' },
  { href: '/order', label: 'Order' },
  { href: '/shop', label: 'Shop' },
];

export function Nav() {
  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl font-semibold tracking-tight text-[color:var(--color-flytrap-red-deep)]"
          >
            The Fly Trap
            <span className="hidden sm:block text-xs font-normal text-[color:var(--color-text-charcoal)]">
              22950 Woodward Ave, Ferndale MI
            </span>
          </Link>

          <details className="md:hidden">
            <summary
              className="cursor-pointer list-none rounded-sm border border-black/20 px-3 py-1 text-sm"
              aria-label="Open menu"
            >
              Menu
            </summary>
            <nav className="mt-3 flex flex-col gap-2 pb-2" aria-label="Primary mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-base text-[color:var(--color-text-ink)] hover:text-[color:var(--color-flytrap-red-deep)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>

        <nav
          className="hidden md:flex md:items-center md:gap-5"
          aria-label="Primary"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[color:var(--color-text-ink)] hover:text-[color:var(--color-flytrap-red-deep)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Nav;
