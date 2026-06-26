// Menu component with category tabs + search
function VegLeaf() {
  return (
    <svg className="veg-leaf" viewBox="0 0 24 24" width="15" height="15" role="img" aria-label="Vegetarian" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <title>Vegetarian</title>
      <path d="M11 20A7 7 0 0 1 4 13C4 8 8 4 18 4c0 8-4 12-7 13z" />
      <path d="M9 16c1-3 3-5 6-6" />
    </svg>
  );
}

function Menu() {
  const cats = window.FT_DATA.menuCategories;
  const items = window.FT_DATA.menuItems;
  const [active, setActive] = useState(cats[0].id);
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
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

            <div className="menu-cat" key={cat.id}>
              <h3>{cat.title}</h3>
              {cat.sub ? <p className="sub">{cat.sub}</p> : null}
              <div className="menu-items">
                {visibleItems.map((it, i) => (
                  <div className="menu-item" key={cat.id + i}>
                    <div className="nm-row">
                      <span className="nm">{it.nm}</span>
                      {it.veg ? <VegLeaf /> : null}
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
