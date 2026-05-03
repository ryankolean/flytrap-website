// Hero with rotating fly paintings
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Hero({ onOpenMenu }) {
  const paintings = window.FT_DATA.paintings;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(i => (i + 1) % paintings.length), 6000);
    return () => clearInterval(t);
  }, [paused, paintings.length]);

  return (
    <header className="hero" id="top">
      <div className="hero-bg" />
      {paintings.map((p, i) => (
        <div
          key={p.src}
          className={"hero-slide" + (i === idx ? " active" : "")}
          style={{ backgroundImage: `url(${p.src})` }}
          aria-hidden={i !== idx}
        />
      ))}
      <div className="hero-overlay" />

      <div className="hero-content">
        <div className="hero-kicker">a finer diner</div>
        <img className="hero-wordmark" src="assets/flytrap-wordmark.png" alt="The Fly Trap" />
        <p className="hero-lead">
          A neighborhood diner on Woodward, Buzzin' since 2004. American comfort food with a global cooks' table — pho, Thai peanut, Italian, breakfast all day.
        </p>
        <div className="hero-actions">
          <a href="#menu" className="btn btn-primary" onClick={(e) => { e.preventDefault(); onOpenMenu && onOpenMenu(); }}>
            See the Menu
          </a>
          <a href="#daily-buzz" className="btn btn-ghost">Today's Buzz →</a>
        </div>
      </div>

      <div className="hero-rail" role="tablist" aria-label="Painting selector">
        {paintings.map((p, i) => (
          <button
            key={i}
            className={i === idx ? "on" : ""}
            onClick={() => { setIdx(i); setPaused(true); setTimeout(() => setPaused(false), 12000); }}
            aria-label={`Show ${p.label}`}
          />
        ))}
      </div>

      <div className="hero-credit">
        <em>{paintings[idx].label}</em><br />
        one of seventeen on the wall
      </div>

      <div className="hero-strip">
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
}

window.Hero = Hero;
