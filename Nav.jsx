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
          <a href="#visit" className="nav-cta" onClick={(e) => handleClick(e, "#visit")}>Visit</a>
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
