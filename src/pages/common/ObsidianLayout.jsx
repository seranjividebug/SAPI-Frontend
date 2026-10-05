import { memo, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

/*
 * Shared shell for pages built on the "SAPI Obsidian" design (home, methodology). The design ships
 * as plain CSS + scripts under public/assets, which style the whole document (body, h1, a...).
 * They are attached only while such a page is mounted and removed on unmount, so the Tailwind
 * pages elsewhere in the app are unaffected.
 */

const STYLESHEETS = ["/assets/css/sapi.css", "/assets/css/fifteen-hundred.css", "/assets/css/spa-overrides.css"];

// CDN libraries, keyed by the window global they define. Loaded once per session and left in place.
const VENDOR_SCRIPTS = {
  THREE: "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js",
  gsap: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  ScrollTrigger: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  Lenis: "https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js",
};

const HTML_CLASSES = ["js", "js-motion", "no-webgl", "lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling"];

function loadStylesheet(href) {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.sapiObsidian = "";
    link.onload = link.onerror = () => resolve(link);
    document.head.appendChild(link);
  });
}

function loadScript(src, { keep = false } = {}) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.crossOrigin = "anonymous";
    if (!keep) script.dataset.sapiObsidian = "";
    script.onload = script.onerror = () => resolve(script);
    document.body.appendChild(script);
  });
}

// Same gate the reference pages run inline in <head>: decide reduced motion before first paint.
function applyMotionGate() {
  const root = document.documentElement;
  let stored = null;
  try { stored = localStorage.getItem("sapi-motion"); } catch (e) { /* private mode */ }
  const reduced = stored === "reduce" ||
    (stored !== "full" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  root.classList.add("js");
  root.setAttribute("data-motion", reduced ? "reduce" : "full");
  if (!reduced) root.classList.add("js-motion");
}

function teardown() {
  const SAPI = window.SAPI;
  if (SAPI) {
    (SAPI.disposers || []).forEach((fn) => { try { fn(); } catch (e) { /* already gone */ } });
    SAPI.disposers = [];
    if (SAPI.lenis) { try { SAPI.lenis.destroy(); } catch (e) { /* already gone */ } SAPI.lenis = null; }
  }
  if (window.ScrollTrigger) { try { window.ScrollTrigger.killAll(); } catch (e) { /* none */ } }
  document.querySelectorAll("[data-sapi-obsidian]").forEach((el) => el.remove());
  document.documentElement.classList.remove(...HTML_CLASSES);
  document.documentElement.removeAttribute("data-motion");
  delete document.body.dataset.page;
}

function Masthead() {
  const [navOpen, setNavOpen] = useState(false);

  useLayoutEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setNavOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const close = () => setNavOpen(false);

  return (
    <header className="masthead">
      <div className="shell masthead__inner">
        <Link className="wordmark" to="/main">
          <span className="wordmark__mark" aria-hidden="true"></span>
          <span className="wordmark__text">The Sovereign<br />AI Power Index</span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={navOpen}
          aria-controls="primary-nav"
          onClick={() => setNavOpen((open) => !open)}
        >
          Menu
        </button>
        {/* NavLink sets aria-current="page", which the design styles as the active tab. */}
        <nav className="nav" id="primary-nav" aria-label="Primary" data-open={String(navOpen)}>
          <NavLink to="/sapi-index" onClick={close}>The Index</NavLink>
          <NavLink to="/methodology" onClick={close}>Methodology</NavLink>
          <NavLink to="/about" onClick={close}>About</NavLink>
          {/* Wired up by motion.js */}
          <button className="motion-toggle" type="button" aria-pressed="false" title="Show the site as still plates instead of motion">Reduce motion</button>
          <Link className="btn btn--primary" to="/contact" onClick={close}>Request a briefing</Link>
        </nav>
      </div>
    </header>
  );
}

const SiteFooter = memo(function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="site-foot__grid">
          <div>
            <a className="wordmark" href="/main" style={{ marginBottom: "1rem" }}>
              <span className="wordmark__mark" aria-hidden="true"></span>
              <span className="wordmark__text">The Sovereign<br />AI Power Index</span>
            </a>
            <p style={{ fontSize: ".9rem", maxWidth: "34ch" }}>An independent UK sovereign AI intelligence company.
              Quarter 2 Rankings 2026 published 2 July 2026.</p>
          </div>
          <div>
            <h2>Research</h2>
            <ul>
              <li><a href="/sapi-index">The Index</a></li>
              <li><a href="/methodology">Methodology</a></li>
            </ul>
          </div>
          <div>
            <h2>Organisation</h2>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="https://www.linkedin.com/company/the-sovereign-ai-power-index/">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h2>Enquiries</h2>
            <ul>
              <li><a href="/contact">Request a briefing</a></li>
              <li><a href="/contact">Commission an assessment</a></li>
              <li><a href="/contact">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="site-foot__field" aria-hidden="false">
    <svg className="field-strip field-strip--foot" viewBox="0 0 600 40" preserveAspectRatio="none" role="img" aria-label="Fifty countries placed by composite score on a 0 to 100 axis. Tier lines at 40, 60 and 80. The highest column is South Korea at 59.2; the field mean is 37.8. No column lies beyond 60.">
    <line className="fs-tier" x1="244.8" y1="4" x2="244.8" y2="28" />
    <line className="fs-tier" x1="355.2" y1="4" x2="355.2" y2="28" />
    <line className="fs-tier" x1="465.6" y1="4" x2="465.6" y2="28" />
    <g className="fs-cols">
    <line x1="350.8" y1="28.0" x2="350.8" y2="6.0"><title>South Korea 59.2</title></line>
    <line x1="349.1" y1="28.0" x2="349.1" y2="6.1"><title>United Arab Emirates 58.9</title></line>
    <line x1="345.3" y1="28.0" x2="345.3" y2="6.2"><title>Singapore 58.2</title></line>
    <line x1="341.4" y1="28.0" x2="341.4" y2="6.3"><title>United States 57.5</title></line>
    <line x1="336.4" y1="28.0" x2="336.4" y2="6.4"><title>Estonia 56.6</title></line>
    <line x1="330.9" y1="28.0" x2="330.9" y2="6.6"><title>France 55.6</title></line>
    <line x1="323.2" y1="28.0" x2="323.2" y2="6.8"><title>Saudi Arabia 54.2</title></line>
    <line x1="314.9" y1="28.0" x2="314.9" y2="7.1"><title>Oman 52.7</title></line>
    <line x1="303.3" y1="28.0" x2="303.3" y2="7.4"><title>Japan 50.6</title></line>
    <line x1="293.4" y1="28.0" x2="293.4" y2="7.7"><title>Italy 48.8</title></line>
    <line x1="292.3" y1="28.0" x2="292.3" y2="7.8"><title>Canada 48.6</title></line>
    <line x1="290.6" y1="28.0" x2="290.6" y2="7.8"><title>United Kingdom 48.3</title></line>
    <line x1="280.1" y1="28.0" x2="280.1" y2="8.1"><title>Finland 46.4</title></line>
    <line x1="279.6" y1="28.0" x2="279.6" y2="8.2"><title>Germany 46.3</title></line>
    <line x1="275.7" y1="28.0" x2="275.7" y2="8.3"><title>Australia 45.6</title></line>
    <line x1="273.5" y1="28.0" x2="273.5" y2="8.3"><title>India 45.2</title></line>
    <line x1="271.3" y1="28.0" x2="271.3" y2="8.4"><title>Norway 44.8</title></line>
    <line x1="268.0" y1="28.0" x2="268.0" y2="8.5"><title>Sweden 44.2</title></line>
    <line x1="266.9" y1="28.0" x2="266.9" y2="8.5"><title>Qatar 44.0</title></line>
    <line x1="261.4" y1="28.0" x2="261.4" y2="8.7"><title>Vietnam 43.0</title></line>
    <line x1="253.1" y1="28.0" x2="253.1" y2="9.0"><title>Chile 41.5</title></line>
    <line x1="250.3" y1="28.0" x2="250.3" y2="9.0"><title>Malaysia 41.0</title></line>
    <line x1="245.4" y1="28.0" x2="245.4" y2="9.2"><title>Egypt 40.1</title></line>
    <line x1="244.8" y1="28.0" x2="244.8" y2="9.2"><title>Kazakhstan 40.0</title></line>
    <line x1="242.0" y1="28.0" x2="242.0" y2="9.3"><title>Switzerland 39.5</title></line>
    <line x1="233.8" y1="28.0" x2="233.8" y2="9.5"><title>Brazil 38.0</title></line>
    <line x1="230.4" y1="28.0" x2="230.4" y2="9.6"><title>Türkiye 37.4</title></line>
    <line x1="211.1" y1="28.0" x2="211.1" y2="10.2"><title>Uzbekistan 33.9</title></line>
    <line x1="206.7" y1="28.0" x2="206.7" y2="10.4"><title>New Zealand 33.1</title></line>
    <line x1="204.0" y1="28.0" x2="204.0" y2="10.4"><title>Indonesia 32.6</title></line>
    <line x1="201.7" y1="28.0" x2="201.7" y2="10.5"><title>Bahrain 32.2</title></line>
    <line x1="200.6" y1="28.0" x2="200.6" y2="10.5"><title>Argentina 32.0</title></line>
    <line x1="192.4" y1="28.0" x2="192.4" y2="10.8"><title>Mexico 30.5</title></line>
    <line x1="190.7" y1="28.0" x2="190.7" y2="10.8"><title>Morocco 30.2</title></line>
    <line x1="185.7" y1="28.0" x2="185.7" y2="11.0"><title>Pakistan 29.3</title></line>
    <line x1="184.6" y1="28.0" x2="184.6" y2="11.0"><title>Kenya 29.1</title></line>
    <line x1="183.0" y1="28.0" x2="183.0" y2="11.1"><title>Azerbaijan 28.8</title></line>
    <line x1="175.2" y1="28.0" x2="175.2" y2="11.3"><title>Kuwait 27.4</title></line>
    <line x1="168.1" y1="28.0" x2="168.1" y2="11.5"><title>South Africa 26.1</title></line>
    <line x1="167.0" y1="28.0" x2="167.0" y2="11.6"><title>Rwanda 25.9</title></line>
    <line x1="167.0" y1="28.0" x2="167.0" y2="11.6"><title>Senegal 25.9</title></line>
    <line x1="161.4" y1="28.0" x2="161.4" y2="11.7"><title>Jordan 24.9</title></line>
    <line x1="156.5" y1="28.0" x2="156.5" y2="11.9"><title>Nigeria 24.0</title></line>
    <line x1="153.7" y1="28.0" x2="153.7" y2="12.0"><title>Ghana 23.5</title></line>
    <line x1="150.4" y1="28.0" x2="150.4" y2="12.1"><title>Kyrgyzstan 22.9</title></line>
    <line x1="147.1" y1="28.0" x2="147.1" y2="12.2"><title>Ethiopia 22.3</title></line>
    <line x1="132.2" y1="28.0" x2="132.2" y2="12.6"><title>Tajikistan 19.6</title></line>
    <line x1="131.6" y1="28.0" x2="131.6" y2="12.6"><title>Paraguay 19.5</title></line>
    <line x1="117.3" y1="28.0" x2="117.3" y2="13.1"><title>Iraq 16.9</title></line>
    <line x1="106.2" y1="28.0" x2="106.2" y2="13.4"><title>Turkmenistan 14.9</title></line>
    </g>
    <line className="fs-mean" x1="232.7" y1="6" x2="232.7" y2="32" />
    <line className="fs-tier" style={{ strokeDasharray: "none", opacity: ".5" }} x1="237.6" y1="18" x2="237.6" y2="32" />
    <line className="fs-axis" x1="24" y1="28" x2="576" y2="28" stroke="#241F33" />
    </svg>
    <p>The field, Quarter 2 Rankings 2026 · fifty countries by composite · tier lines at 40, 60 and 80 · the bright tick is the mean, 37.8 · nothing beyond 60</p>
    </div>
        <div className="site-foot__legal">
          <span>© 2026 The Sovereign AI Power Index (SAPI)</span>
        </div>
      </div>
    </footer>  );
});

/**
 * @param {string} page - body[data-page] value the design's CSS and motion.js key off ("home", "methodology")
 * @param {string[]} vendors - VENDOR_SCRIPTS globals this page needs, in load order
 * @param {string[]} scripts - page scripts under public/assets/js, re-run on every mount
 */
export default function ObsidianLayout({ page, vendors = ["Lenis"], scripts = ["/assets/js/motion.js"], children }) {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  // Layout effect so teardown runs before React removes the DOM the scripts are bound to.
  useLayoutEffect(() => {
    let cancelled = false;
    document.body.dataset.page = page;
    applyMotionGate();

    (async () => {
      await Promise.all(STYLESHEETS.map(loadStylesheet));
      if (cancelled) return;
      rootRef.current.style.visibility = "";

      for (const name of vendors) {
        if (!window[name]) await loadScript(VENDOR_SCRIPTS[name], { keep: true });
        if (cancelled) return;
      }
      for (const src of scripts) {
        await loadScript(src);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
      teardown();
    };
    // Props are static per page; the scripts must run exactly once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The ported markup uses plain <a href>; route internal ones through the SPA router.
  const handleClick = (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute("href");
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    // Hidden until the design's stylesheets arrive, so the unstyled markup never flashes.
    <div ref={rootRef} style={{ visibility: "hidden" }} onClick={handleClick}>
      <a className="skip" href="#main">Skip to main content</a>
      <Masthead />
      {children}
      <SiteFooter />
    </div>
  );
}
