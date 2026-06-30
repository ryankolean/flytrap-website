// About + Retail + Press + Buzz band + Visit + Footer + DailyBuzz page

function BuzzBand({ onGoBuzz }) {
  const today = new Date();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];
  const buzz = window.FT_DATA.buzz.find((b) => b.day === dayName) || window.FT_DATA.buzz[0];

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
          <a className="buzz-cta" href="#daily-buzz" onClick={(e) => {e.preventDefault();onGoBuzz();}}>
            See the week
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </section>);

}

function About() {
  return (
    <section id="about" className="section about" data-screen-label="About">
      <div className="container">
        <div className="about-grid">
          <div className="reveal">
            <div className="eyebrow">Buzzin' since 2004</div>
            <h2 className="title">Why 'The Fly Trap'?</h2>
            <p className="lede">The doors of The Fly Trap: a finer diner were eagerly thrown open for the first time on December 28th 2004. We welcomed our first customers and started our magnificent life as a business that continues on through today.</p>

            <p className="lede">Along with our beloved and inquisitive customers came the many questions of our origin. The most important of which we will address right here and now… "Why?" they asked. "Why did you name your restaurant The Fly Trap?"</p>

            <p className="about-pull">We always swore we would make up some exciting folklore tale of the origin of our now-venerated name, but we never quite came up with a story glorious enough to do justice to the wonderment.</p>

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
    </section>);

}

function DishScroll() {
  const dishes = window.FT_DATA.dishes || [];
  const trackRef = useRef(null);
  if (!dishes.length) return null;
  const nudge = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector(".dish-card");
    const step = card ? card.getBoundingClientRect().width + 18 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <section className="dishes" data-screen-label="Dishes">
      <div className="container">
        <div className="section-head center reveal" style={{ marginBottom: 24 }}>
          <div className="eyebrow">From the griddle</div>
          <h2 className="title" style={{ fontSize: 32 }}>A few of our favorites.</h2>
        </div>
      </div>
      <div className="dish-scroll">
        <button className="dish-nav prev" aria-label="Scroll to previous dishes" onClick={() => nudge(-1)}>‹</button>
        <div className="dish-track" ref={trackRef}>
          {dishes.map((d, i) =>
          <figure className="dish-card" key={i}>
              <img src={d.src} alt={d.label} loading="lazy" />
              <figcaption className="label">{d.label}</figcaption>
            </figure>
          )}
        </div>
        <button className="dish-nav next" aria-label="Scroll to more dishes" onClick={() => nudge(1)}>›</button>
      </div>
    </section>);

}

function Retail() {
  const cards = [
  { cls: "swat", label: "SWAT", photo: "assets/retail/swat-hot-sauce.png", title: "SWAT! Sauces", price: "$7 / bottle", ask: "", variants: [
    { name: "THE O.G. - HABANERO HOT SAUCE", desc: "YA MON! JAMAICAN-ISH IN STYLE WITH VIBRANT HABANERO, SMOKY CHIPOTLE AND WARM CARIBBEAN SPICES" },
    { name: "LA PICA – JALAPEÑO HOT SAUCE", desc: "¡OYE! MEXICAN-ISH IN STYLE WITH HERBACEOUS SPICES, EARTHLY JALAPEÑO & A GARLICKY ZING" },
    { name: "LIL' PRIK – THAI CHILI HOT SAUCE", desc: "THE SWEETEST OF THE BUNCH. THAI-ISH IN STYLE KICKED UP WITH CHILIES, TAMARI & CHARRED ONION" }] },
  { cls: "jam", label: "Wham! Jam", photo: "assets/retail/wham-jam.png", title: "Wham! Jam", desc: "These three flavors are always in stock: Strawberry Basil, Blackberry Ginger & Mango Tamarindo. Funky fun flavors are offered at the restaurant and bottled in limited quantities at the restaurant.", price: "$8 / jar", ask: "" },
  { cls: "tees", label: "the fly trap", title: "Other Fly Trap Swag", desc: "Sometimes there are T-Shirts, sometimes sweatshirts, maybe pins, maybe patches, come see us to find out!", price: "", ask: "" },
  { cls: "gift", label: "Gift Cards", title: "Gift Cards", desc: "Great gifts available in any denomination.", price: "", ask: "" }];

  return (
    <section id="retail" className="section retail" data-screen-label="Retail">
      <div className="container">
        <div className="section-head center reveal">
          <h2 className="title">Retail</h2>
        </div>
        <div className="retail-grid">
          {cards.map((c) =>
          <article key={c.cls} className={"retail-card reveal " + c.cls}>
              <div className="ph">
                {c.photo ?
              <img className="ph-img" src={c.photo} alt={c.title} loading="lazy" /> :
              <span className="ph-label">{c.label}</span>}
              </div>
              <div className="body">
                <h3>{c.title}</h3>
                {c.variants ?
              c.variants.map((v, i) =>
              <p className="desc" key={i}><strong>{v.name}</strong><br />{v.desc}</p>) :

              <p className="desc">{c.desc}</p>}
                {c.price || c.ask ?
              <div className="meta-row">
                    {c.price ? <span className="price">{c.price}</span> : null}
                    {c.ask ? <span className="ask">{c.ask}</span> : null}
                  </div> :
              null}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>);

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
          {items.map((it, i) =>
          <a key={i} className="press-item" href="#" onClick={(e) => e.preventDefault()}>
              <span className="year">{it.year}</span>
              <span className="body">
                <span className="outlet">{it.outlet}</span>
                <span className="title">{it.title}</span>
              </span>
              <span className="arrow">↗</span>
            </a>
          )}
        </div>
      </div>
    </section>);

}

function Visit() {
  const today = new Date().getDay();
  const days = [
  { i: 1, label: "Mon" }, { i: 2, label: "Tue" }, { i: 3, label: "Wed" },
  { i: 4, label: "Thu" }, { i: 5, label: "Fri" }, { i: 6, label: "Sat" }, { i: 0, label: "Sun" }];

  // Native maps deep link — universal "maps:" scheme falls back to https on web
  const mapsUrl = "https://maps.google.com/?q=22950+Woodward+Ave,+Ferndale,+MI+48220";

  return (
    <section id="visit" className="section visit" data-screen-label="Visit">
      <div className="container">
        <div className="section-head reveal">
          <div className="eyebrow">Find us</div>
          <h2 className="title">22950 Woodward Ave, Ferndale.</h2>
          <p className="lede">Walk-in only — no reservations. Municipal lot behind the building, plus street parking on Woodward. You can enter from the front or the rear.</p>
        </div>

        <div className="visit-grid">
          <div className="visit-card reveal">
            <h4>Address</h4>
            <a className="visit-addr-link" href={mapsUrl} target="_blank" rel="noopener" aria-label="Open in maps">
              <p className="visit-addr">22950 Woodward Avenue<br />Ferndale, MI 48220</p>
              <span className="addr-cta">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                Open in maps
              </span>
            </a>
            <div className="visit-contact">
              <a href="tel:2483995150">(248) 399-5150</a>
              <a href="mailto:dine@theflytrapferndale.com">dine@theflytrapferndale.com</a>
              <a href="https://www.instagram.com/theflytrapferndale/" target="_blank" rel="noopener">@theflytrapferndale</a>
            </div>
            <p className="visit-note">Walk in, sit down — the cooks know you.</p>
          </div>

          <div className="visit-card reveal">
            <h4>Hours</h4>
            <table className="hours">
              <tbody>
                {days.map((d) =>
                <tr key={d.i} className={d.i === today ? "today" : ""}>
                    <td>{d.label}{d.i === today ? " · today" : ""}</td>
                    <td>8:00a — 3:00p</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>);

}

function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="assets/brand/flytrap-logo-cream.png" alt="The Fly Trap" />
            <span className="tag">Catch a Buzz.</span>
            <p style={{ fontSize: 13, opacity: .7, lineHeight: 1.55, marginTop: 12, maxWidth: "32ch" }}>
              22950 Woodward Ave, Ferndale, MI 48220. Walk in, sit down, eat magnificently.
            </p>
          </div>
          <div className="footer-col">
            <h6>Eat</h6>
            <ul>
              <li><a href="#menu" onClick={(e) => {e.preventDefault();onNavigate("#menu");}}>Menu</a></li>
              <li><a href="#retail" onClick={(e) => {e.preventDefault();onNavigate("#retail");}}>Retail</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h6>Know</h6>
            <ul>
              <li><a href="#about" onClick={(e) => {e.preventDefault();onNavigate("#about");}}>About</a></li>
              <li><a href="#press" onClick={(e) => {e.preventDefault();onNavigate("#press");}}>Press</a></li>
              <li><a href="#visit" onClick={(e) => {e.preventDefault();onNavigate("#visit");}}>Contact</a></li>
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
    </footer>);

}

function DailyBuzzPage({ onBack }) {
  const todayIdx = new Date().getDay(); // 0=Sun..6=Sat
  const dayMap = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const buzz = window.FT_DATA.buzz;
  const soup = window.FT_DATA.soup;
  const pastry = window.FT_DATA.pastry;

  // Build calendar dates for upcoming week
  const today = new Date();
  const dateFor = (dayOfWeek) => {
    const d = new Date(today);
    const diff = (dayOfWeek - today.getDay() + 7) % 7;
    d.setDate(today.getDate() + diff);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <main data-screen-label="Daily Buzz Page">
      <section className="db-hero">
        <div className="container">
          <a href="#top" className="crumb" onClick={(e) => {e.preventDefault();onBack();}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
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
                    {b.veg ? <VegLeaf /> : null}
                    <span className="chip">Available 8a — 3p, while it lasts</span>
                  </div>
                </div>
              </div>);

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
    </main>);

}

window.BuzzBand = BuzzBand;
window.About = About;
window.Retail = Retail;
window.Press = Press;
window.Visit = Visit;
window.Footer = Footer;
window.DailyBuzzPage = DailyBuzzPage;