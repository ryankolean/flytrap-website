// About + Gallery + Retail + Press + Buzz band + Visit + Footer + DailyBuzz page

function BuzzBand({ onGoBuzz }) {
  const today = new Date();
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][today.getDay()];
  const buzz = window.FT_DATA.buzz.find(b => b.day === dayName) || window.FT_DATA.buzz[0];

  return (
    <section className="buzz-band" id="daily-buzz-band" data-screen-label="Buzz Band">
      <div className="container">
        <div className="buzz-grid">
          <div className="buzz-stamp">
            Today's Buzz
            <span className="day">{dayName}</span>
          </div>
          <div className="buzz-body">
            <h3>{buzz.name}</h3>
            <p>{buzz.desc}</p>
          </div>
          <a className="buzz-cta" href="#daily-buzz" onClick={(e) => { e.preventDefault(); onGoBuzz(); }}>
            See the week
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about" data-screen-label="About">
      <div className="container">
        <div className="about-grid">
          <div className="about-photo reveal" style={{ backgroundImage: "url(assets/details/marble-bar-A.jpg)" }}>
            <div className="frame" />
            <div className="tag">The marble bar — 22 ft, real gemstones, real epoxy.</div>
          </div>
          <div className="reveal">
            <div className="eyebrow">Buzzin' since 2004</div>
            <h2 className="title">Under old management.</h2>
            <p className="lede">Twenty years on Woodward, then a quiet handoff, then home again. Kara &amp; Gavin McMillian came back in October 2024. The eggs are still magnificent, the marbles are still in the bar, and the seventeen flies are still painting flies.</p>

            <p className="about-pull">"Come in, sit down, catch a buzz."</p>
            <p className="about-attr">— Kara McMillian, owner</p>

            <div className="about-stats">
              <div>
                <p className="stat-num">20</p>
                <div className="stat-label">years on Woodward</div>
              </div>
              <div>
                <p className="stat-num">17</p>
                <div className="stat-label">flies on the walls</div>
              </div>
              <div>
                <p className="stat-num">∞</p>
                <div className="stat-label">cups of coffee poured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const paintings = window.FT_DATA.paintings;
  return (
    <section className="gallery" data-screen-label="Gallery">
      <div className="container">
        <div className="section-head center" style={{ marginBottom: 24 }}>
          <div className="eyebrow">On the walls</div>
          <h2 className="title" style={{ fontSize: 32 }}>Seventeen flies, painted by hand.</h2>
        </div>
      </div>
      <div className="gallery-track">
        {paintings.map((p, i) => (
          <div className="gallery-card" key={i} style={{ backgroundImage: `url(${p.src})` }}>
            <div className="label">{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Retail() {
  const cards = [
    { cls: "swat", label: "SWAT", title: "SWAT Hot Sauces", desc: "Three heat levels, named like a tactical unit. Smoky and slow, sharp and green, or the one that goes on the eggs whether you like it or not. Bottled at the diner.", price: "$8 / bottle", ask: "Ask at the counter" },
    { cls: "jam", label: "Seasonal Jam", title: "Seasonal Jam", desc: "Whatever's in season, cooked down in the same pan as the gingerbread waffle topping. Cherry in summer, plum in fall, marmalade in February.", price: "$10 / jar", ask: "Limited supply" },
    { cls: "tees", label: "the fly trap", title: "T-Shirts", desc: "Black tee, the wordmark on the chest, the fly on the sleeve. Soft after one wash, softer after twenty.", price: "$25", ask: "S · M · L · XL · XXL" },
    { cls: "gift", label: "Gift Cards", title: "Gift Cards", desc: "Any amount you like. Hand-written on a card with the wordmark, sealed in an envelope. Use it on breakfast, on a burger, on the bar tab.", price: "$25 / $50 / $100", ask: "In person or by phone" },
  ];
  return (
    <section id="retail" className="section retail" data-screen-label="Retail">
      <div className="container">
        <div className="section-head center reveal">
          <div className="eyebrow">Take a piece home</div>
          <h2 className="title">The Fly Trap, but for your kitchen.</h2>
          <p className="lede">Hot sauces made in-house, jam from the back of the back of the kitchen, t-shirts that have outlasted three managers, gift cards in any amount. Available at the front counter — ask Kara.</p>
        </div>
        <div className="retail-grid">
          {cards.map(c => (
            <article key={c.cls} className={"retail-card reveal " + c.cls}>
              <div className="ph"><span className="ph-label">{c.label}</span></div>
              <div className="body">
                <h3>{c.title}</h3>
                <p className="desc">{c.desc}</p>
                <div className="meta-row">
                  <span className="price">{c.price}</span>
                  <span className="ask">{c.ask}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Press() {
  const items = window.FT_DATA.press;
  return (
    <section id="press" className="section press" data-screen-label="Press">
      <div className="container">
        <div className="section-head reveal">
          <div className="eyebrow">In the news</div>
          <h2 className="title">People keep writing about us.</h2>
        </div>
        <p className="press-pull reveal">A long love letter to the marble bar and the seventeen flies.</p>
        <p className="press-pull-attr reveal">— Metro Times</p>
        <div className="press-list reveal">
          {items.map((it, i) => (
            <a key={i} className="press-item" href="#" onClick={e => e.preventDefault()}>
              <span className="year">{it.year}</span>
              <span className="body">
                <span className="outlet">{it.outlet}</span>
                <span className="title">{it.title}</span>
              </span>
              <span className="arrow">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  const today = new Date().getDay();
  const days = [
    { i: 1, label: "Mon" }, { i: 2, label: "Tue" }, { i: 3, label: "Wed" },
    { i: 4, label: "Thu" }, { i: 5, label: "Fri" }, { i: 6, label: "Sat" }, { i: 0, label: "Sun" },
  ];
  // Native maps deep link — universal "maps:" scheme falls back to https on web
  const mapsUrl = "https://maps.google.com/?q=22950+Woodward+Ave,+Ferndale,+MI+48220";

  return (
    <section id="visit" className="section visit" data-screen-label="Visit">
      <div className="container">
        <div className="section-head reveal">
          <div className="eyebrow">Find us</div>
          <h2 className="title">22950 Woodward Ave, Ferndale.</h2>
          <p className="lede">Walk-in only — no reservations. Lot beside the building, plus street parking on Woodward.</p>
        </div>

        <div className="visit-grid">
          <div className="visit-card reveal">
            <h4>Address</h4>
            <a className="visit-addr-link" href={mapsUrl} target="_blank" rel="noopener" aria-label="Open in maps">
              <p className="visit-addr">22950 Woodward Avenue<br />Ferndale, MI 48220</p>
              <span className="addr-cta">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Open in maps
              </span>
            </a>
            <div className="visit-contact">
              <a href="tel:2483995150">(248) 399-5150</a>
              <a href="https://www.instagram.com/theflytrapferndale/" target="_blank" rel="noopener">@theflytrapferndale</a>
            </div>
            <p className="visit-note">Toast online ordering is coming. Until then — walk in, sit down, the cooks know you.</p>
          </div>

          <div className="visit-card reveal">
            <h4>Hours</h4>
            <table className="hours">
              <tbody>
                {days.map(d => (
                  <tr key={d.i} className={d.i === today ? "today" : ""}>
                    <td>{d.label}{d.i === today ? " · today" : ""}</td>
                    <td>8:00a — 3:00p</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="assets/flytrap-wordmark-retro-cream.png" alt="The Fly Trap" />
            <span className="tag">Catch a Buzz.</span>
            <p style={{ fontSize: 13, opacity: .7, lineHeight: 1.55, marginTop: 12, maxWidth: "32ch" }}>
              22950 Woodward Ave, Ferndale, MI 48220. Walk in, sit down, eat magnificently.
            </p>
          </div>
          <div className="footer-col">
            <h6>Eat</h6>
            <ul>
              <li><a href="#menu" onClick={(e) => { e.preventDefault(); onNavigate("#menu"); }}>Menu</a></li>
              <li><a href="#retail" onClick={(e) => { e.preventDefault(); onNavigate("#retail"); }}>Retail</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>Know</h6>
            <ul>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); onNavigate("#about"); }}>About</a></li>
              <li><a href="#press" onClick={(e) => { e.preventDefault(); onNavigate("#press"); }}>Press</a></li>
              <li><a href="#visit" onClick={(e) => { e.preventDefault(); onNavigate("#visit"); }}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>Follow</h6>
            <ul>
              <li><a href="https://www.instagram.com/theflytrapferndale/" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="tel:2483995150">(248) 399-5150</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 The Fly Trap · Buzzin' since 2004 · Ferndale, MI</span>
          <span>Designed with marbles, hot sauce, and seventeen flies.</span>
        </div>
      </div>
    </footer>
  );
}

function DailyBuzzPage({ onBack }) {
  const todayIdx = new Date().getDay(); // 0=Sun..6=Sat
  const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const buzz = window.FT_DATA.buzz;
  const soup = window.FT_DATA.soup;
  const pastry = window.FT_DATA.pastry;

  // Build calendar dates for upcoming week
  const today = new Date();
  const dateFor = (dayOfWeek) => {
    const d = new Date(today);
    const diff = ((dayOfWeek - today.getDay()) + 7) % 7;
    d.setDate(today.getDate() + diff);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <main data-screen-label="Daily Buzz Page">
      <section className="db-hero">
        <div className="container">
          <a href="#top" className="crumb" onClick={(e) => { e.preventDefault(); onBack(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to home
          </a>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 32, color: "var(--color-flytrap-red-deep)", transform: "rotate(-2deg)", display: "inline-block", marginBottom: 4 }}>
            this week's
          </div>
          <h1>Daily Buzz.</h1>
          <p className="sub">A different rotating dish every morning, named after a pop-culture figure who probably eats here in another universe. Plus the soup of the day and whatever the Sugar Shack pulled out of the oven.</p>
        </div>
      </section>

      <section className="db-week">
        <div className="container">
          {buzz.map((b, i) => {
            const dayNum = dayMap[b.day];
            const isToday = dayNum === todayIdx;
            return (
              <div key={i} className={"db-day" + (isToday ? " today" : "")}>
                <div className="when">
                  {b.day}{isToday ? " · today" : ""}
                  <span className="date">{dateFor(dayNum)}</span>
                </div>
                <div>
                  <h3 className="nm">{b.name}</h3>
                  <p className="desc">{b.desc}</p>
                  <div className="meta">
                    <span className="chip price">${b.price}</span>
                    {b.veg ? <span className="chip veg">Vegetarian</span> : null}
                    <span className="chip">Available 8a — 3p, while it lasts</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="db-soup">
        <div className="container">
          <div className="grid">
            <div className="col">
              <h4>Soup of the day</h4>
              <h3>{soup.name}</h3>
              <p>{soup.desc}</p>
            </div>
            <div className="col">
              <h4>From the Sugar Shack</h4>
              <h3>{pastry.name}</h3>
              <p>{pastry.desc}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

window.BuzzBand = BuzzBand;
window.About = About;
window.Gallery = Gallery;
window.Retail = Retail;
window.Press = Press;
window.Visit = Visit;
window.Footer = Footer;
window.DailyBuzzPage = DailyBuzzPage;
