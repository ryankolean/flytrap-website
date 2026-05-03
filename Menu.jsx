// Menu component with category tabs + veg toggle + search
function Menu() {
  const cats = window.FT_DATA.menuCategories;
  const items = window.FT_DATA.menuItems;
  const [active, setActive] = useState(cats[0].id);
  const [vegOnly, setVegOnly] = useState(false);
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    return items.filter(it => {
      if (it.cat !== active) return false;
      if (vegOnly && !it.veg) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        if (!it.nm.toLowerCase().includes(q) && !(it.desc || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [active, vegOnly, query]);

  const cat = cats.find(c => c.id === active);

  return (
    <section id="menu" className="section menu-section-bg" data-screen-label="Menu">
      <div className="container">
        <div className="section-head center reveal">
          <div className="eyebrow">What's cooking</div>
          <h2 className="title">The whole menu, right here.</h2>
          <p className="lede">Breakfast all day. Lunch all day. Twenty years of recipes the cooks won't quit. Vegetarian dishes are tagged — most can also go vegan with a small ask.</p>
        </div>

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
              <div className="menu-filters">
                <label className="toggle">
                  <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                  <span className="track" />
                  <span>Veg only</span>
                </label>
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
                      {it.veg ? <span className="veg-tag">Veg</span> : null}
                    </div>
                    <span className="pr">${it.price}</span>
                    {it.desc ? <p className="desc">{it.desc}</p> : null}
                  </div>
                ))}
                {visibleItems.length === 0 ? (
                  <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--color-text-charcoal)", fontStyle: "italic", padding: "24px 0" }}>
                    Nothing on this page matches. Try clearing the filter.
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
