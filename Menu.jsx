// Menu: all sections stacked, sticky jump-nav with scrollspy (Group 7)
function VegLeaf() {
  return (
    <svg className="veg-leaf" viewBox="0 0 24 24" width="15" height="15" role="img" aria-label="Vegetarian" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <title>Vegetarian</title>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.52-4.48 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

const MENU_SPECIALS = "specials";

function Menu() {
  const cats = window.FT_DATA.menuCategories;
  const items = window.FT_DATA.menuItems;
  const specials = window.FT_DATA.specials || [];

  // Jump-nav sections: Specials first, then every category — all rendered stacked.
  const sections = [{ id: MENU_SPECIALS, title: "Specials" }].concat(
    cats.map((c) => ({ id: c.id, title: c.title }))
  );

  const [active, setActive] = useState(MENU_SPECIALS);
  const navRef = useRef(null);
  const clickLock = useRef(0); // ignore scrollspy briefly after a click-jump

  // Scrollspy: the active tab follows the section currently under the sticky nav.
  useEffect(() => {
    const secEls = sections
      .map((s) => document.getElementById("menu-sec-" + s.id))
      .filter(Boolean);
    if (!secEls.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (Date.now() < clickLock.current) return;
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown[0]) setActive(shown[0].target.id.replace("menu-sec-", ""));
      },
      { rootMargin: "-120px 0px -68% 0px", threshold: 0 }
    );
    secEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Follow the active section: slide the sticky tab strip horizontally so the
  // current section's tab stays in view as you scroll (and on click-jump).
  useEffect(() => {
    const strip = navRef.current && navRef.current.querySelector(".menu-tabs");
    if (!strip) return;
    const btn = strip.querySelector("button.on");
    if (!btn) return;
    const target = btn.offsetLeft - strip.clientWidth / 2 + btn.offsetWidth / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollTo({ left: Math.max(0, target), behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  const jumpTo = (id) => {
    const el = document.getElementById("menu-sec-" + id);
    if (!el) return;
    const siteNav = document.querySelector(".nav");
    const siteH = siteNav ? siteNav.offsetHeight : 60;
    const navH = navRef.current ? navRef.current.offsetHeight : 0;
    const y = window.scrollY + el.getBoundingClientRect().top - siteH - navH - 8;
    setActive(id);
    clickLock.current = Date.now() + 700;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section id="menu" className="section menu-section-bg" data-screen-label="Menu">
      <div className="container">
        <div className="menu-frame reveal">
          <span className="edge-l" /><span className="edge-r" />
          <div className="menu-inner">

            <div className="menu-toolbar menu-jumpnav" ref={navRef}>
              <nav className="menu-tabs" aria-label="Jump to a menu section">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    className={s.id === active ? "on" : ""}
                    onClick={() => jumpTo(s.id)}
                    aria-current={s.id === active ? "location" : undefined}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
              <p className="veg-legend"><VegLeaf /> = Vegetarian. All dishes can also be made vegan with modifications (except the Mac).</p>
            </div>

            <div className="menu-cat" id="menu-sec-specials">
              <h3>This week's specials</h3>
              <div className="specials-grid">
                {specials.map((s) => (
                  <article className={"special-card" + (s.photo ? "" : " no-photo")} key={s.id}>
                    {s.photo ? (
                      <div className="special-photo">
                        <img src={s.photo} alt={s.name} loading="lazy" />
                      </div>
                    ) : null}
                    <div className="special-body">
                      <div className="special-headline">
                        <h3>{s.name}</h3>
                        {s.veg ? <VegLeaf /> : null}
                      </div>
                      <p className="special-desc">{s.desc}</p>
                    </div>
                  </article>
                ))}
                {specials.length === 0 ? (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-charcoal)", fontStyle: "italic", padding: "24px 0" }}>
                    No specials running this week — check back soon.
                  </p>
                ) : null}
              </div>
            </div>

            {cats.map((c) => (
              <div className="menu-cat" id={"menu-sec-" + c.id} key={c.id}>
                <h3>{c.title}</h3>
                {c.sub ? <p className="sub">{c.sub}</p> : null}
                <div className="menu-items">
                  {items.filter((it) => it.cat === c.id).map((it, i) => (
                    <div className="menu-item" key={c.id + i}>
                      <div className="nm-row">
                        <span className="nm">{it.nm}</span>
                        {it.veg ? <VegLeaf /> : null}
                      </div>
                      <span className="pr">${it.price}</span>
                      {it.desc ? <p className="desc">{it.desc}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="menu-callout">
              <span className="stars">∗∗∗</span> Full Bar — Beer, Wine & Booze. Catch a Buzz! <span className="stars">∗∗∗</span>
            </p>

            <div className="menu-foot">
              All menu items available for carry out.<br />
              Consuming raw or undercooked meats, shellfish, or eggs may increase the risk of foodborne illness.
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

window.Menu = Menu;
