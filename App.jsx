// App
const { useState: uS, useEffect: uE, useMemo: uM, useCallback: uC, useRef: uR } = React;

const SITE_DEFAULTS = {
  heroColor: "flytrap-red-deep",
  aboutZone: "terracotta",
  pressZone: "plum",
  showGallery: true,
  showRetail: true,
  showPress: true
};

function App() {
  const [page, setPage] = uS(window.location.hash === "#daily-buzz" ? "buzz" : "home");
  const [scrolled, setScrolled] = uS(false);
  const [overHero, setOverHero] = uS(true);
  const tweaks = SITE_DEFAULTS;

  uE(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setOverHero(y < window.innerHeight - 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  uE(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (h === "#daily-buzz") {
        setPage("buzz");
        window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        setPage("home");
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Reveal-on-scroll observer
  uE(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [page]);

  const navigate = (href) => {
    if (href === "#daily-buzz") {
      window.location.hash = "#daily-buzz";
      setPage("buzz");
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (page === "buzz") {
      window.location.hash = "";
      setPage("home");
      setTimeout(() => {
        if (href && href !== "#top") {
          const el = document.querySelector(href);
          if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 60);
      return;
    }
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  const zoneColors = {
    terracotta: "var(--color-terracotta)",
    plum: "var(--color-plum)",
    "navy-slate": "var(--color-navy-slate)",
    "back-bar-mauve": "var(--color-back-bar-mauve)",
    butter: "var(--color-butter-yellow)",
    chartreuse: "var(--color-chartreuse)"
  };

  uE(() => {
    const aboutEl = document.querySelector("#about.about");
    if (aboutEl) aboutEl.style.background = zoneColors[tweaks.aboutZone] || "";
    const pressEl = document.querySelector("#press.press");
    if (pressEl) pressEl.style.background = zoneColors[tweaks.pressZone] || "";
  }, [page]);

  return (
    <React.Fragment>
      <Nav scrolled={scrolled} darkBg={page === "home" && overHero} onNavigate={navigate} currentPage={page} />
      <main>
        <Hero onOpenMenu={() => navigate("#menu")} heroColor={tweaks.heroColor} />
        <Menu />
        <About />
        {tweaks.showGallery ? <Gallery /> : null}
        {tweaks.showRetail ? <Retail /> : null}
        {tweaks.showPress ? <Press /> : null}
        <Visit />
        <Footer onNavigate={navigate} />
      </main>
    </React.Fragment>
  );
}

// Solid-color hero
window.Hero = function HeroWrap(props) {
  const colorMap = {
    "flytrap-red-deep": "var(--color-flytrap-red-deep)",
    "flytrap-red-bright": "var(--color-flytrap-red-bright)",
    "checker-black": "var(--color-checker-black)",
    "terracotta": "var(--color-terracotta)",
    "plum": "var(--color-plum)",
    "butter": "var(--color-butter-yellow)",
    "chartreuse": "var(--color-chartreuse)",
    "back-bar-mauve": "var(--color-back-bar-mauve)"
  };
  const bg = colorMap[props.heroColor] || "var(--color-flytrap-red-deep)";
  const lightOnDark = !["butter", "chartreuse"].includes(props.heroColor);

  return (
    <header className="hero hero-solid" id="top" style={{ background: bg, color: lightOnDark ? "var(--color-cream-paper)" : "var(--color-checker-black)" }}>
      <div className="hero-content">
        <div className="hero-kicker" style={{ color: lightOnDark ? "var(--color-cream-paper)" : "var(--color-flytrap-red-deep)" }}>a finer diner</div>
        <img className="hero-wordmark" src={lightOnDark ? "assets/flytrap-wordmark-retro-cream.png" : "assets/flytrap-wordmark-retro-dark.png"} alt="The Fly Trap" />
        <p className="hero-lead" style={{ color: "inherit" }}>A neighborhood diner on Woodward, Buzzin' since 2004. American comfort food with a global cooks' table.</p>
        <div className="hero-actions">
          <a href="#menu" className="btn btn-primary" onClick={(e) => { e.preventDefault(); props.onOpenMenu && props.onOpenMenu(); }}>
            See the Menu
          </a>
          <a href="#visit" className="btn btn-ghost" style={{ color: "inherit", borderColor: "currentColor" }} onClick={(e) => { e.preventDefault(); const el = document.querySelector("#visit"); if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" }); }}>Visit Us →</a>
        </div>
      </div>

      <div className="hero-strip" style={{ color: "inherit" }}>
        <div className="grp">
          <span className="open-now"><span className="dot" /> Open now</span>
          <span>Mon–Sun · 8a — 3p</span>
        </div>
        <div className="grp">
          <span>22950 Woodward Ave, Ferndale</span>
        </div>
      </div>
    </header>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
