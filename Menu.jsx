// Menu: all sections stacked, sticky jump-nav with scrollspy (Group 7)
const MENU_SPECIALS = "specials";

// Format an extras price: under $1 shows in cents (0.99 -> "99¢"), $1+ in dollars
// (5 -> "$5.00"). Blank/invalid -> "".
function fmtExtraPrice(p) {
  const n = Number(p);
  if (!isFinite(n) || n <= 0) return "";
  return n < 1 ? Math.round(n * 100) + "¢" : "$" + n.toFixed(2);
}

// Categories hidden from the public menu — everything after "Other Stuff": all
// sides, the kid's menu, and the full drink/liquor list. Kara wants only the food
// categories on the site; the bar + sides stay in Toast for in-house use. Matches
// the live Toast category ids (assets/menu.json) and the data.js backup ids.
// Sean/Kara feedback 2026-07-16.
const HIDDEN_CATEGORIES = new Set([
  // live Toast ids
  "b-sides", "kid-s-menu", "beverages", "free-flowing", "get-canned",
  "all-bottled-up", "mimosas-wine", "mixed-drinks",
  "brown-booze", "gin", "rum", "sweet-sips", "tequila", "vodka",
  // data.js backup ids
  "sides", "drinks",
]);

// Drop hidden categories (and their items) from a { categories, items } menu.
function visibleMenu(cats, items) {
  return {
    cats: (cats || []).filter((c) => !HIDDEN_CATEGORIES.has(c.id)),
    items: (items || []).filter((it) => !HIDDEN_CATEGORIES.has(it.cat)),
  };
}

// Load the full menu from assets/menu.json (kept fresh by the Toast sync). On any
// fetch/parse failure, fall back to the hand-curated menu inlined in data.js
// (FT_DATA.menuItems) so the menu is never blank on page load. Returns
// { cats, items, source } where source is null while loading, then 'live' | 'backup'.
function useLiveMenu() {
  const [state, setState] = useState({ cats: null, items: null, source: null });
  useEffect(() => {
    let alive = true;
    const useBackup = (why) => {
      if (!alive) return;
      if (why) console.warn("[menu] live menu unavailable, showing saved backup:", why);
      const v = visibleMenu(window.FT_DATA.menuCategories, window.FT_DATA.menuItems);
      setState({ cats: v.cats, items: v.items, source: "backup" });
    };
    fetch("assets/menu.json", { cache: "no-store" })
      .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then((j) => {
        if (!alive) return;
        if (!j || !Array.isArray(j.categories) || !Array.isArray(j.items) || !j.categories.length) {
          throw new Error("menu.json empty or malformed");
        }
        const v = visibleMenu(j.categories, j.items);
        setState({ cats: v.cats, items: v.items, source: "live" });
      })
      .catch((err) => useBackup(err.message));
    return () => { alive = false; };
  }, []);
  return state;
}

function Menu() {
  const menu = useLiveMenu();
  const loading = menu.source === null;
  const cats = menu.cats || [];
  const items = menu.items || [];
  const specials = window.FT_DATA.specials || [];
  const muffinSpecial = window.FT_DATA.muffinSpecial;
  const soupSpecial = window.FT_DATA.soupSpecial;
  // Soup of the day always shows whenever Toast gives it a flavor — including an
  // out-of-stock message ("No soup on the weekend!"), which passes straight
  // through; only a truly empty soupSpecial is hidden. Prices show only when the
  // soup is in stock (available), so an out-of-stock day shows the message alone.
  // When only one extras card remains it centers instead of sitting in the left
  // grid column.
  const muffinAvailable = !!muffinSpecial;
  const soupShown = !!(soupSpecial && soupSpecial.flavor);
  const extrasCount = (muffinAvailable ? 1 : 0) + (soupShown ? 1 : 0);

  // Jump-nav sections: Specials first, then every loaded category — all stacked.
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
  }, [cats.length]);

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
                      </div>
                      <p className="special-desc">{s.desc}</p>
                      {s.price ? (
                        <div className="special-foot">
                          <span className="special-price">${s.price}</span>
                        </div>
                      ) : null}
                    </div>
                  </article>
                ))}
                {specials.length === 0 ? (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-charcoal)", fontStyle: "italic", padding: "24px 0" }}>
                    No specials running this week — check back soon.
                  </p>
                ) : null}
              </div>
              {extrasCount ? (
                <div className={"specials-extras" + (extrasCount === 1 ? " solo" : "")}>
                  {muffinAvailable ? (
                    <div className="extra-card">
                      <span className="extra-label">{muffinSpecial.name}</span>
                      <p className="extra-flavor">{muffinSpecial.flavor}</p>
                      {muffinSpecial.price ? <p className="extra-price">{fmtExtraPrice(muffinSpecial.price)}</p> : null}
                    </div>
                  ) : null}
                  {soupShown ? (
                    <div className="extra-card">
                      <span className="extra-label">{soupSpecial.name}</span>
                      <p className="extra-flavor">{soupSpecial.flavor}</p>
                      {soupSpecial.available && (soupSpecial.cup || soupSpecial.bowl) ? (
                        <p className="extra-price">
                          {soupSpecial.cup ? "Cup " + fmtExtraPrice(soupSpecial.cup) : null}
                          {soupSpecial.cup && soupSpecial.bowl ? " · " : null}
                          {soupSpecial.bowl ? "Bowl " + fmtExtraPrice(soupSpecial.bowl) : null}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {menu.source === "backup" ? (
              <p className="menu-backup-note" role="status">
                Showing our saved menu — the live menu is briefly unavailable.
              </p>
            ) : null}

            {loading ? (
              <p className="menu-loading" role="status">Loading the menu…</p>
            ) : cats.map((c) => (
              <div className="menu-cat" id={"menu-sec-" + c.id} key={c.id}>
                <h3>{c.title}</h3>
                {c.sub ? <p className="sub">{c.sub}</p> : null}
                <div className="menu-items">
                  {items.filter((it) => it.cat === c.id).map((it, i) => (
                    <div className="menu-item" key={c.id + i}>
                      <div className="nm-row">
                        <span className="nm">{it.nm}</span>
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
              <span className="veg-legend">🥬 = Vegetarian. All dishes can also be made vegan with modifications (except the Mac).</span><br />
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
