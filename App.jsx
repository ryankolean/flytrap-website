// App + Tweaks panel
const { useState: uS, useEffect: uE, useMemo: uM, useCallback: uC, useRef: uR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroMode": "solid",
  "heroColor": "flytrap-red-deep",
  "aboutZone": "flytrap-red-deep",
  "pressZone": "checker-black",
  "showRetail": true,
  "showPress": true,
  "rotationSeconds": 6
} /*EDITMODE-END*/;

function App() {
  const [page, setPage] = uS(window.location.hash === "#daily-buzz" ? "buzz" : "home");
  const [scrolled, setScrolled] = uS(false);
  const [pastHero, setPastHero] = uS(false);
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  uE(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Header lockup hands off from the hero wordmark: it fades in the moment the hero
      // "the fly trap" scrolls up past the nav's lower edge, and back out on scroll-up.
      const heroWm = document.querySelector(".hero-wordmark");
      if (heroWm) {
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
      <Nav scrolled={scrolled} darkBg={false} pastHero={pastHero} onNavigate={navigate} currentPage={page} />

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
        </main> :

      <main>
          <Hero onOpenMenu={() => navigate("#menu")} heroColor={tweaks.heroColor} />
          <Menu />
          <About />
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
          <window.TweakToggle label="Show retail" value={tweaks.showRetail} onChange={(v) => setTweak("showRetail", v)} />
          <window.TweakToggle label="Show press" value={tweaks.showPress} onChange={(v) => setTweak("showPress", v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </React.Fragment>);

}

// Solid-color hero
window.Hero = function HeroWrap(props) {
  const isOpen = window.useOpenNow();
  const flyRef = uR(null);

  // Scroll-linked hero fly: its flight is locked to scroll position (not time).
  // It rests in the open whitespace above the wordmark and, as you scroll, rides
  // up-and-left a fixed gap above the rising copy — so it never touches the hero
  // text — then parks and dissolves into the upper-left header lockup.
  uE(() => {
    const fly = flyRef.current;
    if (!fly) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let anchor = null;  // fly's own (untransformed) box center — x viewport, y page (scroll-independent)
    let target = null;  // nav lockup-fly center — viewport coords (the nav is fixed)
    let perchX = 0;     // resting x (viewport): above the final "p" of "the fly trap"
    let refTop = 0;     // topmost hero-text edge in page space; its viewport y is refTop - scrollY
    let gap = 0;        // vertical clearance the fly always keeps above the wordmark top
    let dockS = 1;      // scroll position at which the fly reaches the lockup height and parks
    let flyW = 0;       // fly width — scales the wander + loop so they stay proportional
    let flyH = 0;       // fly height — for header/hero clearance math
    let navBoxes = [];  // visible header content (links / CTA / burger) the fly must clear

    const measure = () => {
      const host = fly.offsetParent;
      if (!host) return;
      const hr = host.getBoundingClientRect();
      anchor = {
        x: hr.left + fly.offsetLeft + fly.offsetWidth / 2,
        y: hr.top + window.scrollY + fly.offsetTop + fly.offsetHeight / 2
      };
      const wm = document.querySelector(".hero-wordmark");
      const wr = (wm || host).getBoundingClientRect();
      perchX = wr.left + wr.width * 0.9;
      flyW = fly.offsetWidth;
      flyH = fly.offsetHeight;
      // Rest the fly on the kicker's row — right of "a finer diner", above the "p".
      // Negative gap centers it on that line; it still lifts above every line of copy
      // the instant you scroll (rise tracks scroll 1:1, drift is slow).
      const kicker = document.querySelector(".hero-kicker");
      const kr = kicker ? kicker.getBoundingClientRect() : null;
      const kH = kr ? kr.height : flyH;
      gap = -(kH / 2);
      // Ride above the TOPMOST hero-text edge (the kicker sits just above the
      // wordmark) so the fly clears every line of copy, not only the wordmark.
      let topY = wr.top + window.scrollY;
      [".hero-kicker", ".hero-lead", ".hero-actions"].forEach((sel) => {
        const el = document.querySelector(sel);
        if (el) topY = Math.min(topY, el.getBoundingClientRect().top + window.scrollY);
      });
      refTop = topY;
      const lock = document.querySelector(".nav .lockup-fly") || document.querySelector(".nav .lockup");
      const lr = lock ? lock.getBoundingClientRect() : null;
      target = lr && lr.width ?
        { x: lr.left + lr.width / 2, y: lr.top + lr.height / 2 } :
        { x: 44, y: 34 };
      dockS = Math.max(120, refTop - gap - target.y);

      // Visible header content the flight must never cross (the lockup is excluded —
      // it is hidden at dock time and is the fly's destination).
      navBoxes = [".nav-links", ".nav-cta", ".nav-burger"]
        .map((sel) => document.querySelector(sel))
        .filter(Boolean)
        .map((el) => {
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          return (cs.display !== "none" && +cs.opacity > 0.5 && r.width > 0) ?
            { left: r.left, right: r.right, bottom: r.bottom } : null;
        })
        .filter(Boolean);
    };

    let raf = 0;

    // Full flight position at scroll depth s — a pure function, so render can also
    // sample s + ds and orient the fly along its direction of travel.
    const flyPos = (s) => {
      const xp = Math.min(1, Math.max(0, s / dockS));
      const ex = xp * xp * (3 - 2 * xp);

      // Ride a fixed gap above the topmost copy; drift left toward the lockup.
      const baseY = Math.max(target.y, (refTop - s) - gap);
      const baseX = perchX + (target.x - perchX) * ex;

      // Three-phase path: an upward loop that breaks right + up, a downward loop that
      // dives back down behind the "a finer diner" kicker (the hero copy layers over
      // the fly), then a decaying serpentine into the upper-left lockup.
      const B0 = 0.2, B1 = 0.45;
      let ox = 0, oy = 0;
      if (xp < B0) {
        const t = xp / B0;                                     // Phase 1 — upward loop (right, then up)
        const ph = t * Math.PI * 2;
        ox += Math.sin(ph) * (flyW * 1.0);
        oy += -(1 - Math.cos(ph)) * (flyW * 1.2);              // bulges UP
      } else if (xp < B1) {
        const t = (xp - B0) / (B1 - B0);                       // Phase 2 — downward loop, behind the kicker
        const ph = t * Math.PI * 2;
        ox += Math.sin(ph) * (flyW * 0.9);
        oy += (1 - Math.cos(ph)) * (flyW * 0.8);               // dives DOWN, occluded by the copy
      } else {
        const t = (xp - B1) / (1 - B1);                        // Phase 3 — serpentine into the lockup
        const d = 1 - t;                                       // amplitude decays into the corner
        ox += Math.sin(t * Math.PI * 3) * (flyW * 0.8) * d;    // zig-zag across the drift
        oy += -Math.abs(Math.sin(t * Math.PI * 3)) * (flyW * 0.35) * d;
      }

      let x = baseX + ox;
      let y = baseY + oy;

      // Header clamp: if the fly's x overlaps a visible nav item, keep it below that item;
      // in clear x it may rise near the top edge, giving the loop room.
      let ceil = 0;
      for (let i = 0; i < navBoxes.length; i++) {
        const b = navBoxes[i];
        if (x + flyW * 0.5 > b.left && x - flyW * 0.5 < b.right) ceil = Math.max(ceil, b.bottom);
      }
      const minY = ceil > 0 ? (ceil + flyH * 0.5 + 5) : (flyH * 0.35);
      if (minY < baseY && y < minY) y = minY;

      return {
        x: x,
        y: y,
        scale: 1 - 0.5 * ex,                                   // gradual 50% shrink as it flies off
        opacity: 0.9 * (1 - Math.min(1, Math.max(0, (xp - 0.72) / 0.28)))
      };
    };

    // Smoothing: instead of snapping the fly to f(scrollY) on each scroll event, ease a
    // displayed scroll value toward the real one every animation frame. That inserts extra
    // in-between frames between coarse (e.g. mouse-wheel) scroll steps -> smoother motion.
    let dispS = window.scrollY;
    const SMOOTH = 0.5;                 // ease fraction per frame — lower = smoother / more frames
    const MAX_LAG = 22;                 // cap the lag below the 30px hero clearance so never-touch holds
    const render = () => {
      raf = 0;
      if (!anchor || !target) return;
      const realS = window.scrollY;
      dispS += (realS - dispS) * SMOOTH;
      if (dispS < realS - MAX_LAG) dispS = realS - MAX_LAG;
      if (dispS > realS + MAX_LAG) dispS = realS + MAX_LAG;
      if (Math.abs(realS - dispS) < 0.3) dispS = realS;
      const cur = flyPos(dispS);
      const tx = cur.x - anchor.x;
      const ty = cur.y - (anchor.y - realS);   // place vs the REAL box position (it scrolls with realS)
      fly.style.transform = "translate(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px) scale(" + cur.scale.toFixed(3) + ")";
      fly.style.opacity = cur.opacity.toFixed(3);
      if (Math.abs(realS - dispS) > 0.1) raf = requestAnimationFrame(render);   // keep easing toward target
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { dispS = window.scrollY; measure(); render(); };

    measure();
    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    const settle = setTimeout(onResize, 400); // re-measure once brand images lay out
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Inverted hero: white field with electric-red branding (the inverse of the
  // red-field/white-branding hero). Logo + fly use the red glyph assets.
  return (
    <header className="hero hero-solid" id="top" style={{ background: "var(--color-bg-white)", color: "var(--color-flytrap-red-deep)" }}>
      <div className="hero-content">
        <div className="hero-kicker" style={{ color: "var(--color-flytrap-red-deep)" }}>a finer diner</div>
        <div className="hero-wordmark-wrap">
          <img className="hero-wordmark" src="assets/brand/flytrap-logo-red.png" alt="The Fly Trap" />
          <img ref={flyRef} className="hero-fly" src="assets/brand/fly-red.png" alt="" aria-hidden="true" />
        </div>
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