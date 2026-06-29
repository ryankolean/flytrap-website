// App + Tweaks panel
const { useState: uS, useEffect: uE, useMemo: uM, useCallback: uC, useRef: uR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroMode": "solid",
  "heroColor": "flytrap-red-deep",
  "aboutZone": "flytrap-red-deep",
  "pressZone": "checker-black",
  "showGallery": false,
  "showRetail": true,
  "showPress": true,
  "rotationSeconds": 6
} /*EDITMODE-END*/;

function App() {
  const [page, setPage] = uS(window.location.hash === "#daily-buzz" ? "buzz" : "home");
  const [scrolled, setScrolled] = uS(false);
  const [overHero, setOverHero] = uS(true);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

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
  }, [page, tweaks.showGallery, tweaks.showRetail, tweaks.showPress]);

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
      // wait a tick for render then scroll
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

  const goBuzz = () => navigate("#daily-buzz");
  const backHome = () => navigate("#top");

  // Apply zone color overrides via inline styles
  const zoneColors = {
    terracotta: "var(--color-terracotta)",
    plum: "var(--color-plum)",
    "navy-slate": "var(--color-navy-slate)",
    "back-bar-mauve": "var(--color-back-bar-mauve)",
    butter: "var(--color-butter-yellow)",
    chartreuse: "var(--color-chartreuse)",
    "flytrap-red-deep": "var(--color-flytrap-red-deep)",
    "flytrap-red-bright": "var(--color-flytrap-red-bright)",
    "checker-black": "var(--color-checker-black)"
  };

  uE(() => {
    const aboutEl = document.querySelector("#about.about");
    if (aboutEl) aboutEl.style.background = zoneColors[tweaks.aboutZone] || "";
    const pressEl = document.querySelector("#press.press");
    if (pressEl) pressEl.style.background = zoneColors[tweaks.pressZone] || "";
  }, [tweaks.aboutZone, tweaks.pressZone, page]);

  return (
    <React.Fragment>
      <Nav scrolled={scrolled} darkBg={page === "home" && overHero} onNavigate={navigate} currentPage={page} />

      {page === "home" ?
      <main>
          <Hero onOpenMenu={() => navigate("#menu")} heroColor={tweaks.heroColor} />
          <Specials />
          <Menu />
          <About />
          {tweaks.showGallery ? <Gallery /> : null}
          <DishScroll />
          {tweaks.showRetail ? <Retail /> : null}
          {tweaks.showPress ? <Press /> : null}
          <Visit />
          <Footer onNavigate={navigate} />
        </main> :

      <main>
          <Hero onOpenMenu={() => navigate("#menu")} heroColor={tweaks.heroColor} />
          <Specials />
          <Menu />
          <About />
          {tweaks.showGallery ? <Gallery /> : null}
          <DishScroll />
          {tweaks.showRetail ? <Retail /> : null}
          {tweaks.showPress ? <Press /> : null}
          <Visit />
          <Footer onNavigate={navigate} />
        </main>
      }

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="Hero">
          <window.TweakSelect
            label="Hero color"
            value={tweaks.heroColor}
            onChange={(v) => setTweak("heroColor", v)}
            options={[
            { value: "flytrap-red-deep", label: "Fly Trap red (deep)" },
            { value: "flytrap-red-bright", label: "Fly Trap red (bright)" },
            { value: "checker-black", label: "Checker black" },
            { value: "terracotta", label: "Terracotta" },
            { value: "plum", label: "Plum" },
            { value: "butter", label: "Butter yellow" },
            { value: "chartreuse", label: "Chartreuse" },
            { value: "back-bar-mauve", label: "Back-bar mauve" }]
            } />
          
        </window.TweakSection>

        <window.TweakSection title="Wall zones">
          <window.TweakSelect
            label="About section"
            value={tweaks.aboutZone}
            onChange={(v) => setTweak("aboutZone", v)}
            options={[
            { value: "flytrap-red-deep", label: "Fly Trap red (default)" },
            { value: "checker-black", label: "Checker black" },
            { value: "terracotta", label: "Terracotta" },
            { value: "plum", label: "Plum" },
            { value: "butter", label: "Butter yellow" },
            { value: "back-bar-mauve", label: "Back-bar mauve" },
            { value: "navy-slate", label: "Navy slate" }]
            } />
          
          <window.TweakSelect
            label="Press section"
            value={tweaks.pressZone}
            onChange={(v) => setTweak("pressZone", v)}
            options={[
            { value: "checker-black", label: "Checker black (default)" },
            { value: "flytrap-red-deep", label: "Fly Trap red" },
            { value: "plum", label: "Plum" },
            { value: "navy-slate", label: "Navy slate" },
            { value: "back-bar-mauve", label: "Back-bar mauve" },
            { value: "terracotta", label: "Terracotta" }]
            } />
          
        </window.TweakSection>

        <window.TweakSection title="Sections">
          <window.TweakToggle label="Show painting gallery" value={tweaks.showGallery} onChange={(v) => setTweak("showGallery", v)} />
          <window.TweakToggle label="Show retail" value={tweaks.showRetail} onChange={(v) => setTweak("showRetail", v)} />
          <window.TweakToggle label="Show press" value={tweaks.showPress} onChange={(v) => setTweak("showPress", v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </React.Fragment>);

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
  const isOpen = window.useOpenNow();

  return (
    <header className="hero hero-solid" id="top" style={{ background: bg, color: lightOnDark ? "var(--color-cream-paper)" : "var(--color-checker-black)" }}>
      <div className="hero-content">
        <div className="hero-kicker" style={{ color: lightOnDark ? "var(--color-cream-paper)" : "var(--color-flytrap-red-deep)" }}>a finer diner</div>
        <img className="hero-wordmark" src={lightOnDark ? "assets/brand/flytrap-logo-cream.png" : "assets/brand/flytrap-logo.png"} alt="The Fly Trap" />
        <p className="hero-lead" style={{ color: "inherit" }}>A neighborhood diner on Woodward, Buzzin' since 2004.</p>
        <div className="hero-actions">
          <a href="#menu" className="btn btn-primary" onClick={(e) => {e.preventDefault();props.onOpenMenu && props.onOpenMenu();}}>
            See the Menu
          </a>
          <a
            href="#visit"
            className="btn btn-ghost hero-cta-desktop"
            style={{ color: "inherit", borderColor: "currentColor" }}
            onClick={(e) => {e.preventDefault();const el = document.querySelector("#visit");if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });}}
          >Visit Us →</a>
          <a
            href="https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue"
            className="btn btn-ghost hero-cta-mobile"
            style={{ color: "inherit", borderColor: "currentColor" }}
            target="_blank"
            rel="noopener"
          >Order Takeout →</a>
        </div>
      </div>

      <div className="hero-strip" style={{ color: "inherit" }}>
        <div className="grp">
          <span className={"open-now" + (isOpen ? "" : " closed")}><span className="dot" /> {isOpen ? "Open now" : "Closed"}</span>
          <span>Mon–Sun · 8a — 3p</span>
        </div>
        <div className="grp">
          <span>22950 Woodward Ave, Ferndale</span>
        </div>
      </div>
    </header>);

};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);