import { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeBody, HomeFooter } from "./HomeMarkup";

/*
 * Home page ("SAPI Obsidian" design). The design ships as plain CSS + scripts under public/assets,
 * which style the whole document (body, h1, a...). They are attached only while this page is
 * mounted and removed on unmount, so the Tailwind pages elsewhere in the app are unaffected.
 */

const STYLESHEETS = ["/assets/css/sapi.css", "/assets/css/fifteen-hundred.css"];

// Loaded once per session and left in place (window globals).
const VENDOR_SCRIPTS = [
  { src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js", global: "THREE" },
  { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", global: "gsap" },
  { src: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", global: "ScrollTrigger" },
  { src: "https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js", global: "Lenis" },
];

// Re-run on every mount: they bind to the DOM rendered by HomeBody.
const PAGE_SCRIPTS = ["/assets/js/motion.js", "/assets/js/field.js"];

const HTML_CLASSES = ["js", "js-motion", "no-webgl", "lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling"];

function loadStylesheet(href) {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.sapiHome = "";
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
    if (!keep) script.dataset.sapiHome = "";
    script.onload = script.onerror = () => resolve(script);
    document.body.appendChild(script);
  });
}

// Same gate the reference page runs inline in <head>: decide reduced motion before first paint.
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
  document.querySelectorAll("[data-sapi-home]").forEach((el) => el.remove());
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
        <nav className="nav" id="primary-nav" aria-label="Primary" data-open={String(navOpen)}>
          <Link to="/sapi-index" onClick={close}>The Index</Link>
          <Link to="/methodology" onClick={close}>Methodology</Link>
          <Link to="/about" onClick={close}>About</Link>
          {/* Wired up by motion.js */}
          <button className="motion-toggle" type="button" aria-pressed="false" title="Show the site as still plates instead of motion">Reduce motion</button>
          <Link className="btn btn--primary" to="/contact" onClick={close}>Request a briefing</Link>
        </nav>
      </div>
    </header>
  );
}

export default function MainPage() {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  // Layout effect so teardown runs before React removes the DOM the scripts are bound to.
  useLayoutEffect(() => {
    let cancelled = false;
    document.body.dataset.page = "home";
    applyMotionGate();

    (async () => {
      await Promise.all(STYLESHEETS.map(loadStylesheet));
      if (cancelled) return;
      rootRef.current.style.visibility = "";

      for (const { src, global } of VENDOR_SCRIPTS) {
        if (!window[global]) await loadScript(src, { keep: true });
        if (cancelled) return;
      }
      for (const src of PAGE_SCRIPTS) {
        await loadScript(src);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
      teardown();
    };
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
      <HomeBody />
      <HomeFooter />
    </div>
  );
}
