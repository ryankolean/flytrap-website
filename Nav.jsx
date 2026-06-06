// Sticky navigation + mobile drawer
function Nav({ scrolled, darkBg, onNavigate, currentPage }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const links = [
    { href: "#menu", label: "Menu", num: "01" },
    { href: "#about", label: "About", num: "02" },
    { href: "#retail", label: "Retail", num: "03" },
    { href: "#press", label: "Press", num: "04" },
    { href: "#visit", label: "Visit", num: "05" },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  return (
    <React.Fragment>
      <nav className={"nav" + (scrolled ? " scrolled" : "") + (darkBg && !scrolled ? " dark-bg" : "")}>
        <div className="nav-inner">
          <a className="lockup" href="#top" onClick={(e) => handleClick(e, "#top")} aria-label="The Fly Trap — home">
            <img src={darkBg && !scrolled ? "assets/flytrap-wordmark-retro-cream.png" : "assets/flytrap-wordmark-retro-dark.png"} alt="The Fly Trap" />
          </a>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.href}><a href={l.href} onClick={(e) => handleClick(e, l.href)}>{l.label}</a></li>
            ))}
          </ul>
          <a href="https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue" className="nav-cta" target="_blank" rel="noopener">Order Now</a>
          <button
            className={"nav-burger" + (open ? " open" : "")}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={"drawer" + (open ? " open" : "")} aria-hidden={!open}>
        <ul>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => handleClick(e, l.href)}>
                <span>{l.label}</span>
                <span className="num">{l.num}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="drawer-order" href="https://order.toasttab.com/online/the-fly-trap-ferndale-22950-woodward-avenue" target="_blank" rel="noopener" onClick={() => setOpen(false)}>
          Order Now
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
        <div className="drawer-meta">
          <div className="open-pill"><span className="dot" /> Open now · 8a — 3p</div>
          22950 Woodward Avenue<br />
          Ferndale, MI 48220<br />
          <a href="tel:2483995150" style={{color:"inherit"}}>(248) 399-5150</a>
        </div>
      </div>
    </React.Fragment>
  );
}

window.Nav = Nav;
