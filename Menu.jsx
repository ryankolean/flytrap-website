// Menu component with category tabs + search
function VegLeaf() {
  return (
    <svg className="veg-leaf" viewBox="0 0 24 24" width="15" height="15" role="img" aria-label="Vegetarian" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <title>Vegetarian</title>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.52-4.48 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  );
}

function Menu() {
  const cats = window.FT_DATA.menuCategories;
  const items = window.FT_DATA.menuItems;
  const specials = window.FT_DATA.specials || [];
  const SPECIALS_TAB = "specials";
  const [active, setActive] = useState(SPECIALS_TAB);
  const [query, setQuery] = useState("");
  const showingSpecials = active === SPECIALS_TAB;

  const visibleItems = useMemo(() => {
    if (showingSpecials) return [];
    return items.filter(it => {
      if (it.cat !== active) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!it.nm.toLowerCase().includes(q) && !(it.desc || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [active, query]);

  const cat = cats.find(c => c.id === active);

  return (
    <section id="menu" className="section menu-section-bg" data-screen-label="Menu">
      <div className="container">
        <div className="menu-frame reveal">
          <span className="edge-l" /><span className="edge-r" />
          <div className="menu-inner">

            <div className="menu-toolbar">
              <div className="menu-tabs" role="tablist">
                <button
                  key={SPECIALS_TAB}
                  className={showingSpecials ? "on" : ""}
                  onClick={() => setActive(SPECIALS_TAB)}
                  role="tab"
                  aria-selected={showingSpecials}
                >
                  Specials
                </button>
                {cats.map(c => (
                  <button
                    key={c.id}
                    className={c.id === active ? "on" : ""}
                    onClick={() => setActive(c.id)}
                    role="tab"
                    aria-selected={c.id === active}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>

            {showingSpecials ? (
              <div className="menu-specials" key="specials">
                <div className="menu-cat">
                  <h3>This week's specials</h3>
                  <p className="sub">What the cooks are running this week. Get it before it's gone.</p>
                </div>
                <div className="specials-grid">
                  {specials.map((s) => (
                    <article className="special-card" key={s.id}>
                      <div className="special-photo">
                        <img src={s.photo} alt={s.name} loading="lazy" />
                      </div>
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
            ) : (
              <div className="menu-cat" key={cat.id}>
                <h3>{cat.title}</h3>
                {cat.sub ? <p className="sub">{cat.sub}</p> : null}
                <div className="menu-items">
                  {visibleItems.map((it, i) => (
                    <div className={"menu-item" + (it.soldOut ? " sold-out" : "")} key={cat.id + i} aria-disabled={it.soldOut ? "true" : undefined}>
                      <div className="nm-row">
                        <span className="nm">{it.nm}</span>
                        {it.veg ? <VegLeaf /> : null}
                        {it.soldOut ? <span className="oos-tag">Out of stock</span> : null}
                      </div>
                      <span className="pr">${it.price}</span>
                      {it.desc ? <p className="desc">{it.desc}</p> : null}
                    </div>
                  ))}
                  {visibleItems.length === 0 ? (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-charcoal)", fontStyle: "italic", padding: "24px 0" }}>
                      Nothing on this page matches.
                    </p>
                  ) : null}
                </div>
              </div>
            )}

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
