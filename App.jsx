// App + Tweaks panel
const { useState: uS, useEffect: uE, useMemo: uM, useCallback: uC, useRef: uR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroMode": "solid",
  "heroColor": "flytrap-red-deep",
  "aboutZone": "checker-black",
  "pressZone": "checker-black",
  "showRetail": true,
  "showPress": true,
  "rotationSeconds": 6
} /*EDITMODE-END*/;

// Second fly — a small electric-red accent that accompanies each section header as it
// scrolls through the viewport: right->left over About, left->right over Retail,
// right->left over News (press), then in from the right to park beside/above "Find us"
// in Location (visit). It rides the header row out in the side margins and lifts into
// the clear band above the text where its sweep would cross a glyph, so it never
// collides with the header. Sized to ~half the header text; transform/opacity eased.
function BackFly() {
  const ref = uR(null);

  uE(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // sec: section whose header the fly rides; dir: 1 = L->R, -1 = R->L;
    // park: end beside the header instead of sweeping across. Always the red glyph.
    const TARGETS = [
      { sec: "#about",  dir: 1 },    // left -> right
      { sec: "#retail", dir: -1 },   // right -> left
      { sec: "#press",  dir: 1 },    // left -> right
      { sec: "#visit",  park: true } // in from the right, beside/above "Find us"
    ];

    let vw = 0, vh = 0;
    const measure = () => { vw = window.innerWidth; vh = window.innerHeight; };
    const clamp01 = (v) => Math.min(1, Math.max(0, v));

    // Union box of a section's header text (eyebrow + title) — the region the fly must
    // never overlap. Viewport-relative.
    const headBox = (secSel) => {
      const sec = document.querySelector(secSel);
      if (!sec) return null;
      const rs = [sec.querySelector("h2.title"), sec.querySelector(".eyebrow")]
        .filter(Boolean).map((n) => n.getBoundingClientRect());
      if (!rs.length) return null;
      const top = Math.min.apply(null, rs.map((r) => r.top));
      const bottom = Math.max.apply(null, rs.map((r) => r.bottom));
      const left = Math.min.apply(null, rs.map((r) => r.left));
      const right = Math.max.apply(null, rs.map((r) => r.right));
      return { top: top, bottom: bottom, left: left, right: right, cy: (top + bottom) / 2 };
    };

    const headFont = (secSel, useEyebrow) => {
      const sec = document.querySelector(secSel);
      const node = sec && (useEyebrow
        ? (sec.querySelector(".eyebrow") || sec.querySelector("h2.title"))
        : (sec.querySelector("h2.title") || sec.querySelector(".eyebrow")));
      return node ? parseFloat(getComputedStyle(node).fontSize) : 32;
    };

    // Pick the section header nearest the viewport center; it owns the fly.
    const activeTarget = () => {
      let best = null, bestDist = Infinity;
      for (const tg of TARGETS) {
        const box = headBox(tg.sec);
        if (!box) continue;
        const dist = Math.abs(box.cy - vh * 0.5);
        if (dist < bestDist) { bestDist = dist; best = { tg: tg, box: box }; }
      }
      return best;
    };

    let curSel = null;
    let dispX = null, dispY = null, dispO = 0;
    let raf = 0;

    const frame = () => {
      raf = 0;
      const a = activeTarget();
      let tgtX = dispX, tgtY = dispY, tgtO = 0;

      if (a) {
        const tg = a.tg, box = a.box;
        // Size to ~half the text it accompanies (the eyebrow for the parked target,
        // the title otherwise) when a new section takes over.
        if (tg.sec !== curSel) {
          curSel = tg.sec;
          el.style.width = (headFont(tg.sec, tg.park) * 0.52).toFixed(1) + "px";
        }
        const fw = el.offsetWidth, fh = el.offsetHeight;
        // t: 0 as the header sits low in the viewport, 1 as it rises near the top.
        const t = clamp01((vh * 0.8 - box.top) / (vh * 0.8 - vh * 0.15));
        const left = vw * 0.08, right = vw * 0.92;

        if (tg.park) {
          const eb = document.querySelector(tg.sec + " .eyebrow").getBoundingClientRect();
          const endX = eb.right + fw * 0.7;                              // next to "Find us"
          tgtX = right + (endX - right) * clamp01(t / 0.8);              // in from the right, then hold
          tgtY = eb.top - fh * 0.25;                                     // slightly above the eyebrow
          tgtO = 0.92 * clamp01(t / 0.12) * (eb.top < vh * 0.12 ? clamp01(eb.top / (vh * 0.12)) : 1);
        } else {
          const sX = tg.dir > 0 ? left : right;
          const eX = tg.dir > 0 ? right : left;
          tgtX = sX + (eX - sX) * t;
          const bob = Math.sin(t * Math.PI * 3) * (fh * 0.6);           // small vertical drift
          // Route through open space with a smooth arc: ride the header row out in the
          // side margins, rise into the clear band above the header as the sweep nears
          // the text, then settle back after. The rise is a smoothstep of horizontal
          // proximity — no hard step — so the motion stays natural and never overlaps a glyph.
          const pad = fw * 0.5 + Math.min(vw * 0.1, 120);
          const edge = Math.min(tgtX - (box.left - pad), (box.right + pad) - tgtX);
          const wRaw = clamp01(edge / pad);
          const w = wRaw * wRaw * (3 - 2 * wRaw);
          const baseY = box.cy + bob;
          const overY = box.top - fh * 0.5 - 8;                        // clear band above the header
          tgtY = baseY + (overY - baseY) * w;
          tgtO = 0.92 * clamp01(Math.min(t, 1 - t) / 0.12);             // fade in and out at the band ends
        }
      }

      if (dispX === null) { dispX = tgtX; dispY = tgtY; }
      if (dispO < 0.05) { dispX = tgtX; dispY = tgtY; }                  // teleport while invisible (no cross-screen slide)
      dispX += (tgtX - dispX) * 0.5;
      dispY += (tgtY - dispY) * 0.5;
      dispO += (tgtO - dispO) * 0.5;
      el.style.transform = "translate(" + (dispX - el.offsetWidth / 2).toFixed(1) + "px," + (dispY - el.offsetHeight / 2).toFixed(1) + "px)";
      el.style.opacity = dispO.toFixed(3);

      const settled = Math.abs(tgtX - dispX) < 0.3 && Math.abs(tgtY - dispY) < 0.3 && Math.abs(tgtO - dispO) < 0.01;
      if (!settled) raf = requestAnimationFrame(frame);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onResize = () => { measure(); if (!raf) raf = requestAnimationFrame(frame); };

    measure();
    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    const settle = setTimeout(onResize, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <img ref={ref} className="back-fly" src="assets/brand/fly-red.png" alt="" aria-hidden="true" />;
}

function App() {
  const [page, setPage] = uS(window.location.hash === "#daily-buzz" ? "buzz" : "home");
  const [scrolled, setScrolled] = uS(false);
  const [pastHero, setPastHero] = uS(false);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  uE(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Header lockup hands off from the hero wordmark: it fades in the moment the hero
      // "the fly trap" scrolls up past the nav's lower edge, and back out on scroll-up.
      const heroWm = document.querySelector(".hero-wordmark");
      if (heroWm) {
        // Shrink + lift + fade the hero logo off the page as you scroll through the hero,
        // handing off to the small nav lockup. Skipped under reduced-motion.
        if (!reduceMotion) {
          const heroEl = heroWm.closest(".hero");
          const heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
          const p = Math.min(1, Math.max(0, y / (heroH * 0.85)));
          heroWm.style.transformOrigin = "50% 0";
          heroWm.style.transform = "scale(" + (1 - 0.4 * p).toFixed(3) + ") translateY(" + (-p * 20).toFixed(1) + "px)";
          heroWm.style.opacity = (1 - p).toFixed(3);
        }
        const navEl = document.querySelector(".nav");
        const navB = navEl ? navEl.getBoundingClientRect().bottom : 70;
        setPastHero(heroWm.getBoundingClientRect().bottom <= navB);
      } else {
        setPastHero(y > window.innerHeight - 80);
      }
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
  }, [page, tweaks.showRetail, tweaks.showPress]);

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
    "checker-black": "var(--color-checker-black)",
    "bg-white": "var(--color-bg-white)"
  };

  uE(() => {
    const aboutEl = document.querySelector("#about.about");
    if (aboutEl) aboutEl.style.background = zoneColors[tweaks.aboutZone] || "";
    const pressEl = document.querySelector("#press.press");
    if (pressEl) pressEl.style.background = zoneColors[tweaks.pressZone] || "";
  }, [tweaks.aboutZone, tweaks.pressZone, page]);

  return (
    <React.Fragment>
      <Nav scrolled={scrolled} pastHero={pastHero} onNavigate={navigate} />

      {page === "home" ?
      <main>
          <Hero onOpenMenu={() => navigate("#menu")} heroColor={tweaks.heroColor} />
          <Menu />
          <About />
          <DishScroll />
          {tweaks.showRetail ? <Retail /> : null}
          {tweaks.showPress ? <Press /> : null}
          <Visit />
          <Footer onNavigate={navigate} />
          <BackFly />
        </main> :

      <DailyBuzzPage onBack={backHome} />
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
            { value: "bg-white", label: "White (hero match, default)" },
            { value: "flytrap-red-deep", label: "Fly Trap red" },
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
          <window.TweakToggle label="Show retail" value={tweaks.showRetail} onChange={(v) => setTweak("showRetail", v)} />
          <window.TweakToggle label="Show press" value={tweaks.showPress} onChange={(v) => setTweak("showPress", v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </React.Fragment>);

}

// Solid-color hero
window.Hero = function HeroWrap(props) {
  const isOpen = window.useOpenNow();

  // Compact hero: black field, electric-red original-form logo (the art includes
  // "a finer diner" and the fly). Shrink-on-scroll is driven from App's scroll
  // handler; menu/specials ride directly beneath.
  return (
    <header className="hero hero-solid" id="top" style={{ background: "var(--color-checker-black)", color: "var(--color-flytrap-red-bright)" }}>
      <div className="hero-content">
        <div className="hero-wordmark-wrap">
          <img className="hero-wordmark" src="assets/brand/flytrap-logo-original-red.png" alt="The Fly Trap — a finer diner" />
        </div>
        <div className="hero-actions">
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