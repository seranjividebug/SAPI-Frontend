/* ===========================================================================
   SAPI "Fifteen Hundred" — shared motion layer (every page).
   Progressive enhancement only: every page reads with this file absent.

   What lives here
     1. Motion preference: prefers-reduced-motion OR the masthead "Reduce motion"
        toggle (persisted in localStorage). Sets html[data-motion] + html.js-motion.
     2. Reveal grammar ("rule, then text"): IntersectionObserver marks .rv targets .is-in once.
     3. Count-ups for [data-count] numbers (0 -> real value, once, never overshoot).
     4. Masthead: reading-progress hairline on article pages, wordmark fill var.
     5. Scroll-spy for the research-note .spine chips.
     6. Lenis smooth scroll on desktop pointer devices (not briefing, not reduced).
     7. Disposal on pagehide (Lenis, ScrollTrigger, any registered disposer).
   =========================================================================== */
(function () {
  'use strict';
  var doc = document.documentElement;
  var SAPI = window.SAPI = window.SAPI || {};
  SAPI.disposers = [];
  SAPI.onMotion = [];          // callbacks(reduced:boolean) fired when the toggle changes
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function stored() { try { return localStorage.getItem('sapi-motion'); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem('sapi-motion', v); } catch (e) { /* private mode: ignore */ } }
  function computeReduced() {
    var s = stored();
    if (s === 'reduce') return true;
    if (s === 'full') return false;
    return mq.matches;
  }
  SAPI.reduced = computeReduced();
  SAPI.isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  SAPI.page = document.body.getAttribute('data-page') || '';

  function applyState() {
    doc.setAttribute('data-motion', SAPI.reduced ? 'reduce' : 'full');
    doc.classList.toggle('js-motion', !SAPI.reduced);
    doc.classList.add('js');
    document.querySelectorAll('.motion-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', SAPI.reduced ? 'true' : 'false');
    });
  }
  applyState();
  window.SAPI_OK = true;

  /* ---- 1. Toggle --------------------------------------------------------- */
  document.querySelectorAll('.motion-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = !SAPI.reduced;
      store(next ? 'reduce' : 'full');
      if (!next) { location.reload(); return; }     // full motion needs a clean boot of the scenes
      SAPI.reduced = true;
      applyState();
      revealAll();
      if (SAPI.lenis) { SAPI.lenis.destroy(); SAPI.lenis = null; doc.classList.remove('lenis'); }
      SAPI.onMotion.forEach(function (fn) { try { fn(true); } catch (e) {} });
    });
  });
  mq.addEventListener && mq.addEventListener('change', function () {
    if (stored()) return;                         // an explicit choice wins over the OS
    var r = computeReduced();
    if (r === SAPI.reduced) return;
    if (!r) { location.reload(); return; }
    SAPI.reduced = true; applyState(); revealAll();
    if (SAPI.lenis) { SAPI.lenis.destroy(); SAPI.lenis = null; }
    SAPI.onMotion.forEach(function (fn) { try { fn(true); } catch (e) {} });
  });

  /* ---- 2. Reveal grammar --------------------------------------------------- */
  var CONTAINERS = '.grid, .dims, .article-body, .dims-with-figure, .facts, .stack, .grid--field, .field-text, form, aside, .spine, .flag-wall-wrap';
  var targets = [];
  function mark(el, i) {
    if (el.classList.contains('rv')) return;
    el.classList.add('rv');
    el.style.setProperty('--i', i);
    targets.push(el);
  }
  function markChildren(parent, skipContainers) {
    var i = 0;
    Array.prototype.forEach.call(parent.children, function (ch) {
      if (ch.tagName === 'SCRIPT' || ch.tagName === 'STYLE') return;
      if (skipContainers && ch.matches(CONTAINERS)) { markChildren(ch, true); return; }
      if (ch.matches('.table-wrap')) { mark(ch, i++); markRows(ch); return; }
      mark(ch, i++);
    });
  }
  function markRows(wrap) {
    wrap.querySelectorAll('tbody > tr').forEach(function (tr, i) {
      if (tr.hidden) return;
      tr.classList.add('rv'); tr.style.setProperty('--i', Math.min(i, 30)); targets.push(tr);
    });
  }
  function collect() {
    document.querySelectorAll('.section > .shell, .hero > .shell, .hero .hero__inner > .grid--field > *, .event-hero__body, article > .shell, .article-head').forEach(function (shell) {
      if (shell.classList.contains('article-head')) { markChildren(shell, false); return; }
      markChildren(shell, true);
    });
    document.querySelectorAll('.card, .service, .person, .callout, .dim, .facts > li, .stack > li, .plate, .mover').forEach(function (el) {
      if (!el.classList.contains('rv')) {
        var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        mark(el, sib);
      }
    });
    document.querySelectorAll('.flag-wall').forEach(function (el) { mark(el, 0); });
    // the event record's header photo slot sits outside any shell: its dashed border draws in as a rule
    document.querySelectorAll('.event-hero > .photo-slot').forEach(function (el) { mark(el, 0); });
  }
  var io;
  function enter(el) {
    el.classList.add('is-in');
    // the methodology's US figure: the dashed ring (roughly 60) contracts to the solid ring (57.5) once, on entry
    el.querySelectorAll('.pg--us').forEach(function (s) { s.classList.add('is-in'); });
    el.dispatchEvent(new CustomEvent('sapi:in', { bubbles: false }));
  }
  function observe() {
    if (SAPI.reduced || !('IntersectionObserver' in window)) { revealAll(); return; }
    // The load sequence: everything already inside the first viewport reveals now, in document
    // order (the --i stagger), without waiting for the observer, whose callbacks are deferred in a
    // background tab. getBoundingClientRect flushes the .rv start state first, so the transition plays.
    var vh = window.innerHeight, pending = [];
    targets.forEach(function (t) {
      var r = t.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) enter(t); else pending.push(t);   // anything intersecting the first viewport (no 92% factor: the hero's pinned evidence strip sits in the last 8%)
    });
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        enter(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    pending.forEach(function (t) { io.observe(t); });
  }
  /* Late-inserted targets (minis.js builds the movers tracks and the flag wall after a fetch) */
  SAPI.watch = function (el, i) {
    mark(el, i || 0);
    if (SAPI.reduced || !io) el.classList.add('is-in'); else io.observe(el);
  };
  function revealAll() {
    targets.forEach(function (t) { t.classList.add('is-in'); });
    document.querySelectorAll('.eyebrow').forEach(function (e) { e.classList.add('is-in'); });
    document.querySelectorAll('[data-count]').forEach(function (el) { if (el.dataset.countDone !== '1') { el.textContent = el.dataset.count; el.dataset.countDone = '1'; } });
  }
  if (SAPI.page !== 'briefing') {
    collect();
    // above-the-fold items animate in on load in document order (the load sequence)
    observe();
  } else {
    doc.classList.remove('js-motion');            // the enquiry page is instant by design
  }

  /* ---- 3. Count-ups ---------------------------------------------------------- */
  function countUp(el) {
    if (el.dataset.countDone === '1') return;
    el.dataset.countDone = '1';
    var raw = el.dataset.count, target = parseFloat(raw);
    if (isNaN(target) || SAPI.reduced) { el.textContent = raw; return; }
    var decimals = (raw.split('.')[1] || '').length;
    var t0 = performance.now(), dur = 900, done = false;
    function frame(now) {
      if (done) return;
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 2);              // power2.out: never overshoots
      el.textContent = (target * e).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame); else el.textContent = raw;
    }
    el.textContent = (0).toFixed(decimals);
    requestAnimationFrame(frame);
    setTimeout(function () { done = true; el.textContent = raw; }, dur + 200);   // wall-clock guard: the real value always lands
  }
  var counts = document.querySelectorAll('[data-count]');
  if (counts.length) {
    if (SAPI.reduced || !('IntersectionObserver' in window)) counts.forEach(function (el) { el.textContent = el.dataset.count; });
    else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.2 });
      counts.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---- 4. Masthead ------------------------------------------------------------ */
  var progress = document.querySelector('.masthead__progress');
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (progress) {
        var max = doc.scrollHeight - window.innerHeight;
        var f = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        progress.style.transform = 'scaleX(' + f.toFixed(4) + ')';
      }
      spy();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- 5. Scroll-spy for the .spine ------------------------------------------- */
  var spineLinks = Array.prototype.slice.call(document.querySelectorAll('.spine a[href^="#"]'));
  var spyTargets = spineLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  function spy() {
    if (!spineLinks.length) return;
    var line = window.innerHeight * 0.4, current = -1;
    spyTargets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) current = i; });
    spineLinks.forEach(function (a, i) {
      if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  spy();
  if (progress) onScroll();

  /* ---- 6. Lenis --------------------------------------------------------------- */
  SAPI.lenis = null;
  if (!SAPI.reduced && !SAPI.isTouch && SAPI.page !== 'briefing' && window.Lenis) {
    try {
      // lerp 0.09 -> 0.12: a little of the page smoothing taken back, now that the field's scrub has
      // come down from 0.9 to 0.5 (field.js). The two used to stack -- a 0.9s catch-up on top of an
      // already-heavily-smoothed scroll position -- and the scene ran behind the copy it illustrates.
      // Lenis smooths the whole page at once, so what it smooths stays in step with the text columns;
      // the scrub only smooths the canvas, which is what put the two out of step.
      var lenis = new window.Lenis({ lerp: 0.12, anchors: true, autoRaf: false });
      SAPI.lenis = lenis;
      if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        lenis.on('scroll', ScrollTrigger.update);
        /* PRIORITISED (the third argument to gsap.ticker.add is `prioritize`, which puts this callback
           at the FRONT of the ticker's listener list, ahead of gsap's own root render).
           Why: in the default order gsap renders the scrubbed timelines FIRST, using the scroll position
           left over from the previous tick, and only then does lenis.raf advance the scroll and fire
           ScrollTrigger.update — which merely retargets the scrub tween for the NEXT tick. That is one
           whole frame of input-to-pixel latency on every frame of Act I. It is not a dropped frame, so
           the gap counters cannot see it; the instrument that can is the harness's maxScrubLagInFinale
           (dims scroll progress minus dims RENDERED progress).
           Running lenis first means the scroll position is current before gsap renders against it.
           lagSmoothing(0) below must stay: gsap would otherwise clamp a long frame's delta and the
           scrub would fall behind again after any stall. */
        var lenisTick = function (t) { lenis.raf(t * 1000); };
        gsap.ticker.add(lenisTick, false, true);
        // React SPA: the home page mounts and unmounts without a page load, so detach the tick too.
        SAPI.disposers.push(function () { gsap.ticker.remove(lenisTick); });
        gsap.ticker.lagSmoothing(0);
      } else {
        var rafId;
        var loop = function (t) { lenis.raf(t); rafId = requestAnimationFrame(loop); };
        rafId = requestAnimationFrame(loop);
        document.addEventListener('visibilitychange', function () {
          if (document.hidden) cancelAnimationFrame(rafId); else rafId = requestAnimationFrame(loop);
        });
      }

      /* ---- 6b. Keyboard scrolling, routed through Lenis ----------------------
         Lenis 1.1.18 has no keyboard handling of its own (grep -c keydown on the published bundle
         returns 0) and it is constructed here without normalizeScroll, so PageDown, Space, Home, End
         and the arrows fall through to the browser's native scroll. Meanwhile Lenis puts `lenis` on
         <html>, and fifteen-hundred.css cancels sapi.css's `html { scroll-behavior: smooth }` with
         `html.lenis { scroll-behavior: auto !important }` — as it must, or the two smoothers would
         fight. Net effect: a pointer-device visitor who scrolls with the keyboard gets a hard
         one-viewport teleport with no smoothing on either side, and Act I's scrub then has to traverse
         a whole beat in half a second. (The jump profile's 20 hitches against trackpad's 0 on the same
         viewport is the same defect measured with a programmatic jump.)
         Routing these keys through lenis.scrollTo gives them the same easing every other scroll on the
         page has. Touch is untouched on purpose: Lenis is never constructed there, html.lenis is never
         applied, and the native scroll-behavior:smooth still covers programmatic scrolls.
         WHAT IS DELIBERATELY NOT INTERCEPTED, because preventDefault here is the one thing in this pass
         that could break the page for a keyboard user:
           - anything with a modifier held (cmd+Down is "end of document", ctrl+Home likewise);
           - an event another handler already claimed (defaultPrevented);
           - text entry and native widgets, which own their own arrow and space keys;
           - #field-explore, the visually-hidden "Explore the field" control, which binds
             ArrowLeft/Right/Up/Down and Escape to step through the fifty countries (field.js);
           - Space on anything activatable — a button, a link, a <summary> — where space means "press
             this", not "page down".
         The top-ten table rows carry tabindex="0" but bind no keys, so a focused row keeps scrolling
         with the page exactly as it did, just smoothly. */
      var KEY_OWNS_KEYS = 'input, textarea, select, [contenteditable], [contenteditable="true"], ' +
        '[role="listbox"], [role="menu"], [role="menubar"], [role="tablist"], [role="slider"], [role="spinbutton"], ' +
        'audio, video, #field-explore';
      var KEY_ACTIVATABLE = 'button, a[href], summary, [role="button"], input, textarea, select, [contenteditable]';
      function keyTargetOwns(t, sel) { return !!(t && t.closest && t.closest(sel)); }
      // Named and disposed: the handler is already a no-op once SAPI.lenis is null (the reduce path
      // destroys Lenis), but leaving a live keydown listener attached to a page that has asked to
      // stop is the same leak as the field's resize and scroll listeners, and it detaches the same way.
      function onKeyScroll(e) {
        if (!SAPI.lenis || e.defaultPrevented) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        var t = e.target;
        if (keyTargetOwns(t, KEY_OWNS_KEYS)) return;
        var vh = window.innerHeight;
        var maxY = Math.max(0, doc.scrollHeight - vh);
        /* WHERE "HERE" IS. lenis.targetScroll is the right base while Lenis is animating, so repeated
           key presses accumulate instead of each one restarting from the visible position. But it goes
           STALE whenever something scrolls the page without Lenis — and the commonest cause of that is
           the keyboard itself: Tab-focusing an off-screen control makes the browser scroll it into
           view. Measured on this page: focus a top-ten table row and window.scrollY is 1605 while
           lenis.targetScroll is still 0, so a PageDown built on targetScroll would have jumped the
           reader BACKWARDS by a screen and a half. Use the real position whenever Lenis is idle. */
        var L = SAPI.lenis;
        var base = (L.isScrolling && isFinite(L.targetScroll)) ? L.targetScroll : window.scrollY;
        var to = null, dur = 0.6;
        switch (e.key) {
          case 'PageDown': to = base + vh * 0.9; break;
          case 'PageUp': to = base - vh * 0.9; break;
          case ' ': case 'Spacebar':
            if (keyTargetOwns(t, KEY_ACTIVATABLE)) return;          // space activates the control
            to = base + (e.shiftKey ? -1 : 1) * vh * 0.9; break;
          case 'Home': to = 0; break;
          case 'End': to = maxY; break;
          // 40px is Chrome's own arrow step, which is the point: intercepting these keys is only
          // defensible if the distance a press moves is the distance the reader already expects. It
          // was 100px, i.e. 2.5x the native step, which is a behaviour change dressed up as a
          // smoothness fix. 0.4s so a held key repeats without the tweens queueing up behind each
          // other; PageDown/Space remain the one-screen controls.
          case 'ArrowDown': to = base + 40; dur = 0.4; break;
          case 'ArrowUp': to = base - 40; dur = 0.4; break;
          default: return;
        }
        if (e.shiftKey && e.key !== ' ' && e.key !== 'Spacebar') return;   // shift+arrow/page is selection
        e.preventDefault();
        SAPI.lenis.scrollTo(Math.max(0, Math.min(maxY, to)), { duration: dur });
      }
      window.addEventListener('keydown', onKeyScroll);
      SAPI.disposers.push(function () { window.removeEventListener('keydown', onKeyScroll); });
    } catch (e) { SAPI.lenis = null; }
  }

  /* ---- 7. Disposal ------------------------------------------------------------- */
  /* A BFCACHE HIDE IS NOT A TEARDOWN. This ran on EVERY pagehide, including `persisted: true` — the
     page going into the back/forward cache to be restored intact. It killed every ScrollTrigger and
     destroyed Lenis, so a reader who followed a link and pressed Back came back to a stage frozen
     mid-finale that never advanced again: measured on both this build and the frozen snapshot, from
     y=3300 (dims 0.5012) the restored page reports the dims trigger gone and dims pinned at 0.5012,
     and scrolling on to y=4344 leaves dissolve at 0.0000 — Act I unreachable for the rest of the
     visit, with the render loop still running and drawing the same frame. field.js's
     pageshow(persisted) settle could never have helped, because settleScrub skips a timeline whose
     scrollTrigger is null. Returning early on a persisted hide leaves everything alive and lets that
     settle do what its comment says. A real unload still tears down. */
  window.addEventListener('pagehide', function (e) {
    if (e && e.persisted) return;
    SAPI.disposers.forEach(function (fn) { try { fn(); } catch (e) {} });
    if (SAPI.lenis) { try { SAPI.lenis.destroy(); } catch (e) {} }
    if (window.ScrollTrigger) { try { ScrollTrigger.killAll(); } catch (e) {} }
  });
}());
