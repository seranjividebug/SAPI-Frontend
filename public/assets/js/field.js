/* ===========================================================================
   SAPI "Fifteen Hundred" — the homepage particle field (index.html only).

   ONE THREE.Points object, 1,500 vertices = 50 countries x 30 indicator slots.
   Every particle is one (country, indicator slot) pair. All motion between the
   four formations is computed in the vertex shader from four target attributes;
   the CPU sets a handful of uniforms per frame and nothing else.

   Formations (uniform uFormation, continuous):
     0  dust    random box (load only)
     1  sphere  30 particles per country clustered at its lat/lng centroid
                (data/countries-geo.json). Position = geography only.
     2  ruler   column x = composite (0-100 -> -5..+5 world units), 30 stacked.
     3  prism   five arms (CC top, then CF, RR, DS, DI clockwise); six particles
                per arm along the spoke, tip at the country's dimension score
                (0-100 -> 0-3.2 units). Layer z = rank (0.09 units per rank).
                The "solo" state is a modifier on the prism: the United States
                layer slides to the front, the other 49 recede and dim.

   Colour: gold = indicator sourced to a dated document or verified response;
           matte red (--down #A33A32) = one of that country's unsourced
           indicators. Red count per country = dataQuality.flags[].unsourcedIndicators
           exactly (161 in total). WHICH slot is red is arbitrary — the chip
           therefore never names an indicator.
   Size/brightness: composite normalised to 59.2 = 1.0.

   Numbers are read from data/cycle2.json + data/countries-geo.json at runtime.
   No composite is recomputed here: the two rings use the published constants
   (simple average 60.3; geometric mean 57.5) from the methodology page.

   Requires: THREE r160 (UMD), gsap + ScrollTrigger 3.12, motion.js (window.SAPI).
   =========================================================================== */
(function () {
  'use strict';
  var stage = document.getElementById('field-stage');
  if (!stage || !window.THREE || !window.SAPI) return;
  var SAPI = window.SAPI;
  var canvas = stage.querySelector('canvas');
  var ui = stage.querySelector('.field-ui');
  var chipEl = stage.querySelector('.field-chip');
  var cursorEl = document.querySelector('.field-cursor');
  var liveEl = document.getElementById('field-live');
  var exploreBtn = document.getElementById('field-explore');
  var act1 = document.getElementById('act1');
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  // The act heights in css are written `min-height: 300vh; min-height: 308svh`. The exit hold band
  // below is the difference between the two, so it is only real where svh is real; see the .act-dims
  // trigger end.
  var svhOK = !!(window.CSS && window.CSS.supports && window.CSS.supports('height', '1svh'));
  var isTouch = SAPI.isTouch;
  var reduced = SAPI.reduced;
  var DEG = Math.PI / 180;

  /* Published constants used by the solo beat (methodology.html, "The arithmetic") */
  var US_ARITHMETIC_APPROX = 60.3; // simple (weighted arithmetic) average of the US scores: 60.34 in the Cycle 2 workbook
  var US_COMPOSITE = 57.5;         // published weighted geometric mean
  var RADIAL = 3.2;                // world units at a score of 100 (prism / solo)
  var SPHERE_R = 2.3;
  var SOLO_Z = 1.6;
  var LAYER_STEP = 0.09;
  var LAYER_Z0 = 0.6;
  var LAYER_BACK = LAYER_Z0 - 49 * LAYER_STEP;   // z of the 50th layer (-3.81): the back of the stack
  var LAYER_MID = (LAYER_Z0 + LAYER_BACK) / 2;   // -1.6: where the side-view camera looks

  /* WebGL availability: if absent, the inline SVG plates stay visible. */
  function webglOK() {
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; }
  }
  if (!webglOK()) { document.documentElement.classList.add('no-webgl'); return; }

  Promise.all([
    fetch('data/cycle2.json').then(function (r) { return r.json(); }),
    fetch('data/countries-geo.json').then(function (r) { return r.json(); })
  ]).then(boot).catch(function () { document.documentElement.classList.add('no-webgl'); });

  /* Seeded PRNG so the layout is identical on every load (which slot is red, jitter). */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(rnd) { var u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  function boot(payload) {
    var data = payload[0], geo = payload[1];
    var countries = geo.countries.slice().sort(function (a, b) { return a.rank - b.rank; });
    var flags = data.dataQuality.flags;
    var N_C = countries.length, N_K = data.edition.indicators, N = N_C * N_K;   // 50 x 30 = 1,500
    var usIndex = countries.findIndex(function (c) { return c.country === 'United States'; });
    var CODES = ['CC', 'CF', 'RR', 'DS', 'DI'];
    var NAMES = ['Compute Capacity', 'Capital Formation', 'Regulatory Readiness', 'Data Sovereignty', 'Directed Intelligence'];
    var means = NAMES.map(function (n) { return data.field.dimensionMeans[n]; });
    var weights = NAMES.map(function (n) { return data.weights[n]; });
    var weightRanges = NAMES.map(function (n) { return data.weightRanges[n]; });
    var maxComposite = data.field.max;   // 59.2

    /* ---------------- attributes ---------------- */
    var aDust = new Float32Array(N * 3), aSphere = new Float32Array(N * 3), aStrip = new Float32Array(N * 3), aPrism = new Float32Array(N * 3);
    var aColor = new Float32Array(N * 3), aSeed = new Float32Array(N), aCountry = new Float32Array(N), aScore = new Float32Array(N), aDim = new Float32Array(N), aRed = new Float32Array(N), aParity = new Float32Array(N);
    var GOLD = [0xC9 / 255, 0x96 / 255, 0x3A / 255], GOLDB = [0xE3 / 255, 0xB7 / 255, 0x5C / 255], RED = [0xA3 / 255, 0x3A / 255, 0x32 / 255];
    var sphereAnchor = [], stripAnchor = [], tieSeen = {};
    var redTotal = 0;

    countries.forEach(function (c, ci) {
      var rnd = mulberry32(1000 + ci * 7919);
      var unsourced = (flags[c.country] || { unsourcedIndicators: 0 }).unsourcedIndicators;
      redTotal += unsourced;
      // choose which of the 30 slots are red (arbitrary, seeded, exact count)
      var slots = []; for (var s = 0; s < N_K; s++) slots.push(s);
      for (var s2 = slots.length - 1; s2 > 0; s2--) { var j = Math.floor(rnd() * (s2 + 1)); var tmp = slots[s2]; slots[s2] = slots[j]; slots[j] = tmp; }
      var redSet = {}; for (var r = 0; r < unsourced; r++) redSet[slots[r]] = true;
      // sphere centroid
      var lat = c.lat * DEG, lng = c.lng * DEG;
      var cx = Math.cos(lat) * Math.sin(lng), cy = Math.sin(lat), cz = Math.cos(lat) * Math.cos(lng);
      sphereAnchor.push([cx * SPHERE_R, cy * SPHERE_R, cz * SPHERE_R]);
      // ruler column
      var colX = c.composite / 100 * 10 - 5;
      var tieKey = c.composite.toFixed(1); var tieIdx = tieSeen[tieKey] || 0; tieSeen[tieKey] = tieIdx + 1;
      var colZ = tieIdx * 0.35;
      stripAnchor.push([colX, 1.75, colZ]);
      var score = c.composite / maxComposite;
      var parity = 0;
      for (var k = 0; k < N_K; k++) {
        var i = ci * N_K + k, i3 = i * 3;
        var isRed = !!redSet[k];
        // dust: a loose box around the sphere
        aDust[i3] = (rnd() - 0.5) * 12; aDust[i3 + 1] = (rnd() - 0.5) * 8; aDust[i3 + 2] = (rnd() - 0.5) * 6;
        // sphere: gaussian cluster (sigma 0.16) around the centroid, re-projected to the sphere
        var gx = cx * SPHERE_R + gauss(rnd) * 0.16, gy = cy * SPHERE_R + gauss(rnd) * 0.16, gz = cz * SPHERE_R + gauss(rnd) * 0.16;
        var gl = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1; var rr = SPHERE_R + (rnd() - 0.5) * 0.06;
        aSphere[i3] = gx / gl * rr; aSphere[i3 + 1] = gy / gl * rr; aSphere[i3 + 2] = gz / gl * rr;
        // ruler: tally of 30, stacked vertically
        aStrip[i3] = colX + (rnd() - 0.5) * 0.05; aStrip[i3 + 1] = (k - (N_K - 1) / 2) * 0.11; aStrip[i3 + 2] = colZ + (rnd() - 0.5) * 0.02;
        // prism: arm = k % 5, position along the spoke = floor(k / 5); tip (j = 5) at the score
        var d = k % 5, jj = Math.floor(k / 5);
        var sc = c.dimensions[CODES[d]] / 100 * RADIAL;
        var rad = sc * (jj + 1) / 6;
        var ang = (90 - d * 72) * DEG + (rnd() - 0.5) * 3 * DEG;
        aPrism[i3] = rad * Math.cos(ang); aPrism[i3 + 1] = rad * Math.sin(ang); aPrism[i3 + 2] = LAYER_Z0 - ci * LAYER_STEP + (rnd() - 0.5) * 0.02;
        // colour
        if (isRed) { aColor[i3] = RED[0]; aColor[i3 + 1] = RED[1]; aColor[i3 + 2] = RED[2]; }
        else { aColor[i3] = GOLD[0] + (GOLDB[0] - GOLD[0]) * score; aColor[i3 + 1] = GOLD[1] + (GOLDB[1] - GOLD[1]) * score; aColor[i3 + 2] = GOLD[2] + (GOLDB[2] - GOLD[2]) * score; }
        aSeed[i] = rnd(); aCountry[i] = ci; aScore[i] = score; aDim[i] = d; aRed[i] = isRed ? 1 : 0;
        aParity[i] = isRed ? 0 : (parity++ % 2);
      }
    });

    /* ---------------- geometry + materials ---------------- */
    var geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(aSphere.slice(), 3));
    geom.setAttribute('aDust', new THREE.BufferAttribute(aDust, 3));
    geom.setAttribute('aSphere', new THREE.BufferAttribute(aSphere, 3));
    geom.setAttribute('aStrip', new THREE.BufferAttribute(aStrip, 3));
    geom.setAttribute('aPrism', new THREE.BufferAttribute(aPrism, 3));
    geom.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
    geom.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
    geom.setAttribute('aCountry', new THREE.BufferAttribute(aCountry, 1));
    geom.setAttribute('aScore', new THREE.BufferAttribute(aScore, 1));
    geom.setAttribute('aDim', new THREE.BufferAttribute(aDim, 1));
    geom.setAttribute('aRed', new THREE.BufferAttribute(aRed, 1));
    geom.setAttribute('aParity', new THREE.BufferAttribute(aParity, 1));

    var U = {
      uFormation: { value: 0 }, uTime: { value: 0 }, uPixelRatio: { value: 1 }, uSizeScale: { value: 1 },
      uSpin: { value: 0.35 }, uActiveDim: { value: -1 }, uSoloCountry: { value: usIndex }, uSoloMix: { value: 0 }, uSoloZ: { value: SOLO_Z },
      // uLite: UNUSED HOOK. Nothing writes it (the frame-rate degradation that did was removed; see
      // the note in draw()), so the shader branch at the ':  if (uLite > 0.5' line below is dead code
      // kept deliberately as the one place a future quality fallback would attach.
      uDissolve: { value: 0 }, uHighlight: { value: -1 }, uPulse: { value: 0 }, uDrift: { value: 1 }, uLite: { value: 0 }
    };
    var VERT = [
      'attribute vec3 aDust, aSphere, aStrip, aPrism, aColor;',
      'attribute float aSeed, aCountry, aScore, aDim, aRed, aParity;',
      'uniform float uFormation, uTime, uPixelRatio, uSizeScale, uSpin, uActiveDim, uSoloCountry, uSoloMix, uSoloZ, uDissolve, uHighlight, uPulse, uDrift, uLite, uPass;',
      'varying vec3 vColor; varying float vAlpha;',
      'vec3 formPos(int i) {',
      '  if (i <= 0) return aDust;',
      '  if (i == 1) { float c = cos(uSpin), s = sin(uSpin); return vec3(aSphere.x * c + aSphere.z * s, aSphere.y, -aSphere.x * s + aSphere.z * c); }',
      '  if (i == 2) return aStrip;',
      '  vec3 p = aPrism; float isSolo = step(abs(aCountry - uSoloCountry), 0.5);',
      '  p.z = mix(p.z, mix(p.z - 0.6, uSoloZ, isSolo), uSoloMix);',
      '  return p;',
      '}',
      'void main() {',
      '  float show = (uPass < 0.5) ? (1.0 - aRed) : aRed;',
      '  if (uLite > 0.5 && aRed < 0.5 && aParity > 0.5) show = 0.0;',
      '  float f = clamp(uFormation, 0.0, 3.0); float fl = floor(f); float t = f - fl; int i0 = int(fl);',
      '  vec3 a = formPos(i0); vec3 b = formPos(int(min(fl + 1.0, 3.0)));',
      '  float e = clamp((t - aSeed * 0.35) / 0.65, 0.0, 1.0);',
      '  e = e < 0.5 ? 4.0 * e * e * e : 1.0 - pow(-2.0 * e + 2.0, 3.0) / 2.0;',
      '  vec3 p = mix(a, b, e);',
      '  p += (aSeed - 0.5) * sin(e * 3.14159) * 0.5 * vec3(0.3, 1.0, 0.5);',
      '  p += uDrift * sin(uTime * 0.6 + aSeed * 6.2832) * 0.02 * vec3(1.0, 0.7, 0.5);',
      '  p.y += uDissolve * (0.35 + aSeed * 0.45);',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position = projectionMatrix * mv;',
      '  float size = (1.05 + aScore * 1.35) * uPixelRatio * uSizeScale * (30.0 / max(1.0, -mv.z));',
      '  float isSolo = step(abs(aCountry - uSoloCountry), 0.5);',
      '  float alpha = aRed > 0.5 ? 0.95 : 0.72;',
      '  alpha *= mix(1.0, 0.12, uSoloMix * (1.0 - isSolo));',
      '  float noDim = step(uActiveDim, -0.5); float matchDim = step(abs(aDim - uActiveDim), 0.5);',
      '  float dimOk = clamp(noDim + matchDim + uSoloMix, 0.0, 1.0);',
      '  alpha *= mix(0.4, 1.0, dimOk);',
      '  float hiOn = step(-0.5, uHighlight); float isHi = step(abs(aCountry - uHighlight), 0.5) * hiOn;',
      '  alpha *= mix(1.0, mix(0.45, 1.0, isHi), hiOn);',
      '  float bright = mix(1.0, 1.5, isHi); size *= mix(1.0, 1.4, isHi);',
      '  float soloDim = isSolo * matchDim * (1.0 - noDim) * uSoloMix;   // solo: the active .dim lights its own vertex',
      '  bright *= 1.0 + 0.55 * soloDim; size *= 1.0 + 0.2 * soloDim;',
      '  float pulse = uPulse * isSolo * step(abs(aDim - 1.0), 0.5) * (0.5 + 0.5 * sin(uTime * 7.854));',
      '  bright *= 1.0 + 0.6 * pulse; size *= 1.0 + 0.25 * pulse;',
      '  alpha *= (1.0 - uDissolve);',
      '  vColor = aColor * bright; vAlpha = alpha;',
      '  gl_PointSize = max(size, 2.0 * uPixelRatio) * show;',
      '  if (show < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);',
      '}'
    ].join('\n');
    var FRAG = [
      'precision highp float; varying vec3 vColor; varying float vAlpha; uniform float uPass;',
      'void main() {',
      '  float d = length(gl_PointCoord - 0.5);',
      '  float a = smoothstep(0.5, 0.16, d);',
      '  if (a < 0.02) discard;',
      '  if (uPass < 0.5) gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);',
      '  else gl_FragColor = vec4(vColor, a * vAlpha);',
      '}'
    ].join('\n');
    function makeMat(pass) {
      var u = {}; Object.keys(U).forEach(function (k) { u[k] = U[k]; });   // shared value objects
      u.uPass = { value: pass };
      return new THREE.ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false,
        blending: pass === 0 ? THREE.AdditiveBlending : THREE.NormalBlending });
    }
    var matGold = makeMat(0), matRed = makeMat(1);
    var pointsGold = new THREE.Points(geom, matGold), pointsRed = new THREE.Points(geom, matRed);
    pointsGold.frustumCulled = pointsRed.frustumCulled = false;
    pointsRed.renderOrder = 2;

    /* ---------------- supporting objects (axes of each chart) ---------------- */
    var rig = new THREE.Group();
    rig.add(pointsGold); rig.add(pointsRed);
    function lineMat(opacity, color, dashed) {
      var M = dashed ? THREE.LineDashedMaterial : THREE.LineBasicMaterial;
      var m = new M({ color: color || 0xC9963A, transparent: true, opacity: opacity, depthTest: false });
      if (dashed) { m.dashSize = 0.12; m.gapSize = 0.08; }
      return m;
    }
    function line(points, mat, loop) {
      var g = new THREE.BufferGeometry().setFromPoints(points.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
      var l = loop ? new THREE.LineLoop(g, mat) : new THREE.Line(g, mat);
      if (mat.isLineDashedMaterial) l.computeLineDistances();
      l.frustumCulled = false; rig.add(l); return l;
    }
    // Graticule: the globe's own axes (latitude/longitude), fades on the first scroll.
    var gratPts = [];
    for (var m = 0; m < 12; m++) { var lng0 = m * 30 * DEG; for (var q = 0; q < 36; q++) { var la = -90 + q * 5, lb = la + 5; gratPts.push([Math.cos(la * DEG) * Math.sin(lng0) * SPHERE_R, Math.sin(la * DEG) * SPHERE_R, Math.cos(la * DEG) * Math.cos(lng0) * SPHERE_R]); gratPts.push([Math.cos(lb * DEG) * Math.sin(lng0) * SPHERE_R, Math.sin(lb * DEG) * SPHERE_R, Math.cos(lb * DEG) * Math.cos(lng0) * SPHERE_R]); } }
    for (var pl = -60; pl <= 60; pl += 30) { for (var q2 = 0; q2 < 48; q2++) { var l0 = q2 * 7.5 * DEG, l1 = l0 + 7.5 * DEG; gratPts.push([Math.cos(pl * DEG) * Math.sin(l0) * SPHERE_R, Math.sin(pl * DEG) * SPHERE_R, Math.cos(pl * DEG) * Math.cos(l0) * SPHERE_R]); gratPts.push([Math.cos(pl * DEG) * Math.sin(l1) * SPHERE_R, Math.sin(pl * DEG) * SPHERE_R, Math.cos(pl * DEG) * Math.cos(l1) * SPHERE_R]); } }
    var gratMat = lineMat(0.1);
    var gratGeom = new THREE.BufferGeometry().setFromPoints(gratPts.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
    var graticule = new THREE.LineSegments(gratGeom, gratMat); graticule.frustumCulled = false; rig.add(graticule);
    // Ruler: 0-100 axis, tier hairlines at 40/60/80, field mean 37.8 and median 38.7 ticks.
    var tierMat = lineMat(0), tiers = [40, 60, 80].map(function (v) { var x = v / 10 - 5; return line([[x, -2.3, 0], [x, 2.3, 0]], tierMat); });
    var axisMat = lineMat(0);
    var axisPts = [[-5, -1.95, 0], [5, -1.95, 0]]; for (var tk = 0; tk <= 10; tk++) { axisPts.push([tk - 5, -1.95, 0]); axisPts.push([tk - 5, -2.1, 0]); axisPts.push([tk - 5, -1.95, 0]); }
    var axis = line(axisPts, axisMat);
    var tickMat = lineMat(0, 0xE3B75C);
    var meanX = data.field.mean / 10 - 5, medianX = data.field.median / 10 - 5;
    var meanTick = line([[meanX, -2.35, 0], [meanX, 2.0, 0]], tickMat);
    var medianTick = line([[medianX, -2.2, 0], [medianX, -1.7, 0]], tickMat);
    // Prism: five arm hairlines (opacity 0.3 + weight * 2), field-mean pentagon outline.
    var armMats = [], arms = [];
    for (var ai = 0; ai < 5; ai++) { var angA = (90 - ai * 72) * DEG; var mA = lineMat(0); armMats.push(mA); arms.push(line([[0, 0, LAYER_Z0 + 0.1], [Math.cos(angA) * RADIAL * 1.05, Math.sin(angA) * RADIAL * 1.05, LAYER_Z0 + 0.1]], mA)); }
    var meanMat = lineMat(0, 0xE3B75C);
    var meanXY = means.map(function (v, i2) { var a2 = (90 - i2 * 72) * DEG, r2 = v / 100 * RADIAL; return [Math.cos(a2) * r2, Math.sin(a2) * r2]; });
    var meanPent = line(meanXY.map(function (q) { return [q[0], q[1], LAYER_Z0 + 0.1]; }), meanMat, true);
    // The field-mean pentagon extruded through the fifty layers: a back loop, five ridges (one per
    // dimension, each running the full depth of the stack at its mean score) and the spine. From the
    // side each ridge's distance from the spine IS its mean: Capital Formation 28.5 is the thin edge,
    // Data Sovereignty 53.8 the fat one. Shown only while the camera is orbiting (S.side).
    var meanBackMat = lineMat(0, 0xE3B75C);
    var meanBack = line(meanXY.map(function (q) { return [q[0], q[1], LAYER_BACK - 0.1]; }), meanBackMat, true);
    var ridgeMats = [], ridges = [];
    meanXY.forEach(function (q, ri) { var mR = lineMat(0, ri === 1 || ri === 3 ? 0xE3B75C : 0xC9963A); ridgeMats.push(mR); ridges.push(line([[q[0], q[1], LAYER_Z0 + 0.1], [q[0], q[1], LAYER_BACK - 0.1]], mR)); });
    var spineMat = lineMat(0, 0xA9A497);
    var spine = line([[0, 0, LAYER_Z0 + 0.1], [0, 0, LAYER_BACK - 0.1]], spineMat);
    // Solo: US pentagon outline, dashed ring at ~60 (arithmetic mean), solid ring at 57.5 (composite).
    var us = countries[usIndex];
    var usTips = CODES.map(function (code, i3) { var a3 = (90 - i3 * 72) * DEG, r3 = us.dimensions[code] / 100 * RADIAL; return [Math.cos(a3) * r3, Math.sin(a3) * r3, SOLO_Z]; });
    var usMat = lineMat(0, 0xE3B75C);
    var usPent = line(usTips, usMat, true);
    function ringPts(r, z) { var pts = []; for (var s3 = 0; s3 < 96; s3++) { var a4 = s3 / 96 * Math.PI * 2; pts.push([Math.cos(a4) * r, Math.sin(a4) * r, z]); } return pts; }
    var ringDashMat = lineMat(0, 0xA9A497, true), ringSolidMat = lineMat(0, 0xE3B75C);
    var ringDash = line(ringPts(US_ARITHMETIC_APPROX / 100 * RADIAL, SOLO_Z), ringDashMat, true);
    var ringSolid = line(ringPts(US_COMPOSITE / 100 * RADIAL, SOLO_Z), ringSolidMat, true);
    // Tier boundaries on the solo layer: the 60 pentagon (where Advanced begins; the dashed ring sits
    // exactly on its vertices) and, fainter, the 40 pentagon (where Developing begins).
    function pentPts(v, z) { return CODES.map(function (c0, i9) { var a9 = (90 - i9 * 72) * DEG, r9 = v / 100 * RADIAL; return [Math.cos(a9) * r9, Math.sin(a9) * r9, z]; }); }
    var pent60Mat = lineMat(0, 0xA9A497), pent40Mat = lineMat(0, 0xA9A497);
    var pent60 = line(pentPts(60, SOLO_Z), pent60Mat, true), pent40 = line(pentPts(40, SOLO_Z), pent40Mat, true);
    // The penalty, as an area: the annulus between the geometric mean (57.5) and the arithmetic mean
    // (roughly 60) fills gold as the dashed ring contracts. Both radii are the published constants.
    var annulusMat = new THREE.MeshBasicMaterial({ color: 0xC9963A, transparent: true, opacity: 0, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    var annulusGeom = new THREE.RingGeometry(US_COMPOSITE / 100 * RADIAL, US_ARITHMETIC_APPROX / 100 * RADIAL, 96, 1);
    var annulus = new THREE.Mesh(annulusGeom, annulusMat); annulus.position.z = SOLO_Z - 0.01; annulus.frustumCulled = false; rig.add(annulus);

    /* ---------------- renderer, camera ---------------- */
    var renderer;
    try {
      // depth:false, stencil:false — every material in this scene sets depthTest false (points at the
      // ShaderMaterial above, every line via lineMat, the annulus), so nothing ever tests or writes a
      // depth value that could change a pixel. Chrome otherwise allocates a depth AND a stencil
      // attachment for the full 2880x1800 drawing buffer (~20MB) and clears both every frame for
      // nothing. No visual change; invisible on this M2, worth something on an integrated GPU.
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance', preserveDrawingBuffer: reduced });
    } catch (e) { document.documentElement.classList.add('no-webgl'); return; }
    /* A GL CONTEXT LOST MID-VISIT MUST FALL BACK TO THE POSTER. The poster SVG is hidden while the
       stage carries is-live (it sits under an opaque canvas at inset 0, and leaving it visible is what
       put the gold globe back over the exit), so it is no longer a passive fallback: if the context
       goes and the canvas stops painting, the stage is simply black. The constructor-failure path is
       covered — the catch above sets no-webgl and never adds is-live — but a post-boot loss was not.
       preventDefault() is what allows a restore at all; stopping the loop and dropping is-live
       re-exposes the poster immediately. */
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      try { stop(); } catch (err) {}
      stage.classList.remove('is-live'); stage.classList.remove('is-done');
    });
    renderer.setClearColor(0x08060F, 1);
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    U.uPixelRatio.value = DPR;
    var scene = new THREE.Scene(); scene.add(rig);
    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    /* The scene state. Every value here is tweened by GSAP under scroll scrub, or by
       the load sequence; the frame loop just reads it. */
    var S = {
      /* formation 1 = sphere; the load factor (below) brings it up from dust */
      formation: 1, spin: 0.35, orbit: -0.22, elev: 0.08, fitW: 5.4, fitH: isMobile ? 5.2 : 6.9, tx: 0, ty: isMobile ? 0 : -0.15, tz: 0, shift: isMobile ? 0 : 0.5, roll: 0,
      grat: 1, tier: 0, axis: 0, ticks: 0, arms: 0, meanPent: 0, side: 0, solo: 0, usPent: 0, ringDash: 0, ringScale: 1, ringSolid: 0, pulse: 0,
      dissolve: 0, activeDim: -1, hi: -1, drift: 1, labels: 0, prog: 0, edition: 0, dims: 0,
      load: 1   // 0 -> 1 during the dust-to-sphere assembly; the shader gets formation x load (see apply)
    };
    SAPI.fieldState = S;   // read-only debug handle for QA (what the scene is doing right now)
    SAPI.fieldDraw = function () { if (!reduced) draw(performance.now()); };   // QA: draw one frame on demand
    var W = 1, H = 1;
    function resize() {
      var r = stage.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      U.uSizeScale.value = Math.min(1.25, Math.max(0.7, H / 800));
    }
    resize();

    function placeCamera() {
      var tanH = Math.tan(camera.fov / 2 * DEG), aspect = camera.aspect;
      var dist = Math.max(S.fitH / (2 * tanH), S.fitW / (2 * tanH * aspect));
      var halfW = dist * tanH * aspect;
      // shift moves the look-at point along the camera's own right vector (a fraction of the half
      // width), so the scene sits right of the text column at any orbit, not only face-on.
      var so = Math.sin(S.orbit), co = Math.cos(S.orbit), ce = Math.cos(S.elev), se = Math.sin(S.elev);
      var tx = S.tx - S.shift * halfW * co, tz = S.tz + S.shift * halfW * so;
      camera.position.set(tx + dist * ce * so, S.ty + dist * se, tz + dist * ce * co);
      camera.up.set(0, 1, 0);
      camera.lookAt(tx, S.ty, tz);
      camera.updateMatrixWorld(true);   // so the DOM labels project with THIS frame's camera, not the last one's
      rig.rotation.z = S.roll;
      rig.updateMatrixWorld(true);
    }

    /* ---------------- DOM labels (projected each frame) ---------------- */
    var labels = [];
    // anchor/tf/op/hiOn are the per-frame write caches read by setLabel/setOp; declared here so every
    // label object has one shape from the start
    function mkLabel(cls, html) { var li = document.createElement('li'); li.className = 'field-label ' + cls; li.innerHTML = html; ui.appendChild(li); var o = { el: li, on: false, x: 0, y: 0, z: 0, anchor: '', tf: '', op: '', hiOn: false }; labels.push(o); return o; }
    var countryLabels = countries.map(function (c) { return mkLabel('field-label--country', c.rank + ' · ' + c.country + ' <b>' + c.composite.toFixed(1) + '</b>'); });
    var tc = data.field.tierCounts;
    var tierLabels = [   // anchored at the midpoint of each band (x = band centre on the -5..5 axis)
      { x: -3, text: 'Nascent 0–40 · ' + (tc.Nascent || 0), empty: !tc.Nascent },
      { x: 0, text: 'Developing 40–60 · ' + (tc.Developing || 0), empty: !tc.Developing },
      { x: 2, text: 'Advanced 60–80 · ' + (tc.Advanced || 'empty'), empty: !tc.Advanced },
      { x: 4, text: 'Leading 80–100 · ' + (tc.Leading || 'empty'), empty: !tc.Leading }
    ].map(function (t, ti) { var l = mkLabel('field-label--tier' + (t.empty ? ' is-empty' : ''), t.text); l.x = t.x; l.y = 2.3; l.z = 0; l.tierIdx = ti; l.short = t.text.replace(' countries', '').replace(/^(\w+) [0-9–]+ · /, '$1 · '); return l; });
    // the 0-100 scale itself: eleven numerals under the axis, so the ruler carries its own units on screen
    var axisLabels = []; for (var av = 0; av <= 100; av += 10) { var al = mkLabel('field-label--axis', String(av)); al.x = av / 10 - 5; al.y = -2.15; al.z = 0; axisLabels.push(al); }
    var meanLabel = mkLabel('field-label--tick', 'mean ' + data.field.mean.toFixed(1)); meanLabel.x = meanX; meanLabel.y = -2.45; meanLabel.z = 0;
    var medianLabel = mkLabel('field-label--tick', 'median ' + data.field.median.toFixed(1)); medianLabel.x = medianX; medianLabel.y = -2.85; medianLabel.z = 0;
    // plates only: one readout beneath the axis numerals, centred on the mean tick (the live labels use two rows)
    var plateTickLabel = mkLabel('field-label--tick field-label--plate-tick', 'mean ' + data.field.mean.toFixed(1) + ' · median ' + data.field.median.toFixed(1)); plateTickLabel.x = meanX; plateTickLabel.y = -2.5; plateTickLabel.z = 0;   // under the axis numerals, centred on the mean tick: its own row, clear of the tier labels
    var armLabels = NAMES.map(function (n, i4) { var a5 = (90 - i4 * 72) * DEG, r5 = RADIAL * 0.92; var l = mkLabel('field-label--arm', n + '<small>weight ' + weightRanges[i4] + ' · mean ' + means[i4].toFixed(1) + '</small>'); l.x = Math.cos(a5) * r5; l.y = Math.sin(a5) * r5; l.z = LAYER_Z0 + 0.1; l.el.style.opacity = ''; return l; });
    var valLabels = CODES.map(function (code, i5) { var a6 = (90 - i5 * 72) * DEG, r6 = us.dimensions[code] / 100 * RADIAL + 0.32; var l = mkLabel('field-label--val', code + ' ' + us.dimensions[code].toFixed(1)); l.x = Math.cos(a6) * r6; l.y = Math.sin(a6) * r6; l.z = SOLO_Z; return l; });
    // the penalty count-down sits right of the pentagon, above the tier label (the two ring readings are in the 'rings' caption)
    var penaltyLabel = mkLabel('field-label--penalty', ''); penaltyLabel.x = 2.15; penaltyLabel.y = 1.3; penaltyLabel.z = SOLO_Z;
    var tierPentLabel = mkLabel('field-label--tierpent is-empty', 'Advanced tier begins · 60'); tierPentLabel.x = 0.6 * RADIAL * Math.cos(36 * DEG) * Math.cos(-18 * DEG) + 0.12; tierPentLabel.y = 0.6 * RADIAL * Math.cos(36 * DEG) * Math.sin(-18 * DEG); tierPentLabel.z = SOLO_Z;
    // side view: the two ridges the caption talks about, labelled at mid-stack
    var ridgeLabels = [1, 3].map(function (di) { var l = mkLabel('field-label--ridge', NAMES[di] + ' ' + means[di].toFixed(1) + '<small>' + (di === 1 ? 'the field\'s thinnest edge' : 'its fattest edge') + '</small>'); l.x = meanXY[di][0]; l.y = meanXY[di][1]; l.z = LAYER_MID; return l; });
    var captions = Array.prototype.slice.call(stage.querySelectorAll('.field-caption'));
    var captionOn = null;
    function caption(id) {
      if (id === captionOn) return;
      var first = captionOn === null; captionOn = id;
      // the opening caption appears without a transition (a transition started at boot can stall in a
      // background or headless tab); every later change fades
      captions.forEach(function (c) { c.classList.toggle('is-instant', first); c.classList.toggle('is-on', c.dataset.caption === id); });
    }
    /* WHERE THE FIVE FINALE BEATS START, AND THE ONE PLACE THEY ARE WRITTEN DOWN. The tweens below, the
       caption ladder, the activeDim ladder and SAPI.fieldBeats all read these, so a beat cannot move
       without its copy, its lit dimension and the measurement window moving with it. Three separate
       hand-maintained copies of these numbers is what let the ring beat drift 0.08 away from its own
       caption in the last round.
       The spacing is the frozen snapshot's, re-derived. The snapshot ran the beats over
       0.20 / 0.25 / 0.25 / 0.06 / 0.12 / 0.12 of a timeline that ended ON its last frame; this build
       has to finish the dissolve at 98% (the exit hold band, see the .act-dims end), so .act-dims is
       4.4% longer (308 -> 326svh) and every span is that 2% shorter as a fraction. Net, in scroll
       pixels, each beat is within ~1% of the snapshot's — except the dashed ring, which is 48% longer
       on purpose: 8 frames on a flick was never enough to read the imbalance-penalty point.
       capOff is where the caption clears. It is not a beat: it is 1/6 of the way into the dissolve,
       which is where the snapshot's fixed 0.9 sat when the dissolve ran 0.88 -> 1.00. */
    var BEAT = { side: 0.19, cross: 0.43, ring: 0.67, contract: 0.755, dissolve: 0.865, capOff: 0.885 };
    var BEAT_M = { capOff: 0.83 };   // the phone dissolve is 0.80 + 0.18, so 1/6 in is 0.83
    // Which caption belongs to what is on screen right now. Read from S alone so the hero, edition and
    // framework timelines cannot disagree about it.
    function captionFor() {
      if (S.dissolve > 0.5) return '';
      var p = S.dims;
      if (p > 0.03) {
        if (isMobile) return p < 0.55 ? 'solo' : (p < BEAT_M.capOff ? 'rings' : '');
        // EVERY BOUNDARY IS READ FROM BEAT, so the copy cannot describe a beat other than the one on
        // screen. Each is the position at which its beat's own tween starts; capOff is the point in the
        // dissolve at which the caption goes (see BEAT).
        return p < BEAT.side ? 'prism' : p < BEAT.cross ? 'side' : p < BEAT.ring ? 'solo' : p < BEAT.capOff ? 'rings' : '';
      }
      if (S.edition >= 0.7) return isMobile ? 'solo' : 'prism';
      if (S.formation >= 1.5) return 'field';
      return 'sphere';   // the opening: what the 1,500 points are, and why some are red
    }

    var v3 = new THREE.Vector3();
    function project(o) {
      v3.set(o.x, o.y, o.z).applyMatrix4(rig.matrixWorld).project(camera);
      return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H, behind: v3.z > 1 };
    }
    /* Writing on change only. Eighty-two labels are visited every frame, but under scrub most of them
       are asked for exactly the state they already have: the same rounded transform, the same is-on,
       the same opacity string. Every one of those assignments used to dirty the element's style.
       The anchor suffix lives on the plain JS object (o.anchor), not in a data-attribute: it is read
       every frame and nothing else — CSS, renderPlates, QA — ever looked at data-anchor. */
    function setLabel(o, on, hi) {
      if (on) {
        var p = project(o);
        var tf = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) ' + (o.anchor || 'translate(-50%,-100%)');
        if (tf !== o.tf) { o.tf = tf; o.el.style.transform = tf; }
        on = !p.behind;
      }
      if (on !== o.on) { o.on = on; o.el.classList.toggle('is-on', on); }
      if (hi !== undefined) { var hiOn = !!hi; if (hiOn !== o.hiOn) { o.hiOn = hiOn; o.el.classList.toggle('is-hi', hiOn); } }
    }
    /* Same discipline for the inline opacity the tier and axis labels carry. */
    function setOp(o, v) { if (v !== o.op) { o.op = v; o.el.style.opacity = v; } }
    tierLabels.forEach(function (l) { l.anchor = 'translate(-50%,-100%)'; });
    axisLabels.forEach(function (l) { l.anchor = 'translate(-50%,0)'; });
    meanLabel.anchor = medianLabel.anchor = 'translate(-50%,0)';
    armLabels.forEach(function (l) { l.anchor = 'translate(-50%,-50%)'; });
    valLabels.forEach(function (l) { l.anchor = 'translate(-50%,-50%)'; });
    penaltyLabel.anchor = 'translate(0,0)';
    tierPentLabel.anchor = 'translate(0,-50%)';
    ridgeLabels[0].anchor = 'translate(-50%,-130%)'; ridgeLabels[1].anchor = 'translate(-50%,30%)';
    countryLabels.forEach(function (l, i6) { l.x = stripAnchor[i6][0]; l.y = stripAnchor[i6][1] + 0.1; l.z = stripAnchor[i6][2]; });

    var MAX_LABELS = isMobile ? 3 : (window.innerWidth < 1280 ? 6 : 12);
    var LIST_X = 1.3, LIST_Y0 = 1.65, LIST_DY = 0.3;   // world units: just right of the 60 line, one row per rank
    /* The fifty country labels only ever exist inside the ruler beat. Once the ruler has gone, one more
       pass runs to clear them and then the loop is skipped until the ruler returns — so scrolling back
       up still replays it from the top. countryDirty is "the loop still has work to undo". */
    var countryDirty = true;
    var penLast = '';   // last penalty string written (was a data-attribute; see the contraction below)
    function updateLabels() {
      var f = S.formation, settled = S.load >= 1 && Math.abs(f - Math.round(f)) < 0.02, form = Math.round(f);
      var showRuler = settled && form === 2 && S.formation < 2.02 && S.dissolve < 0.5 && S.solo < 0.5;
      // country labels in the ruler: top ten (desktop) or the hovered / highlighted one
      var shown = 0;
      var topN = isMobile ? 0 : (S.edition > 0.12 ? 10 : 0);   // the list arrives with the edition beat, after the pinned evidence strip has scrolled away
      if (showRuler || countryDirty) {
        for (var i = 0; i < countries.length; i++) {
          var isHi = (S.hi === i), on = showRuler && (i < topN || isHi) && (shown < MAX_LABELS || isHi);
          if (on) shown++;
          // The top ten are listed in rank order inside the empty zone past the 60 line (the
          // columns sit 0.03-0.17 units apart, too close to label in place). A hovered or focused
          // country is labelled directly above its own column.
          if (i < topN && !isHi) { countryLabels[i].x = LIST_X; countryLabels[i].y = LIST_Y0 - i * LIST_DY; countryLabels[i].anchor = 'translate(0,-50%)'; }
          else { countryLabels[i].x = stripAnchor[i][0]; countryLabels[i].y = stripAnchor[i][1] + 0.1; countryLabels[i].anchor = 'translate(-50%,-100%)'; }
          setLabel(countryLabels[i], on, isHi);
        }
        countryDirty = showRuler;
      }
      // ruler furniture leaves with the hairlines (opacity follows S.tier) and is gone before the fold moves a particle
      var showTier = S.tier > 0.05 && S.formation < 2.05 && S.dissolve < 0.5 && !isMobile;
      var tierOp = Math.min(1, S.tier / 0.35).toFixed(2);
      // the opacity string is the same for every label in the group: build it once, not once per label
      var tierOpV = showTier ? tierOp : '';
      // The phone shows one tier label and it is index 2, handled once below. It used to be written
      // twice per frame — '' by this group loop (showTier is false on mobile) and then tierOp by the
      // line under it — so setOp's write-on-change cache never fired for it and that one label wrote
      // an inline opacity on every single frame of the ruler beat.
      tierLabels.forEach(function (l, i7) { if (isMobile && i7 === 2) return; setOp(l, tierOpV); setLabel(l, showTier); });
      if (isMobile) { setOp(tierLabels[2], tierOp); setLabel(tierLabels[2], S.tier > 0.05 && S.formation < 2.05 && S.dissolve < 0.5); }
      var showAxis = S.axis > 0.3 && S.formation < 2.05 && S.dissolve < 0.5;
      var axisOpV = showAxis ? Math.min(1, S.axis).toFixed(2) : '';
      axisLabels.forEach(function (l, i8) { setOp(l, axisOpV); setLabel(l, showAxis && (!isMobile || i8 % 2 === 0)); });
      var showTicks = S.ticks > 0.3 && S.formation < 2.05;
      setLabel(meanLabel, showTicks); setLabel(medianLabel, showTicks && !isMobile);
      /* THE FIVE ARM LABELS BLINK BACK ON FOR ~0.025 OF THE TIMELINE MID-CROSSFADE, AND THAT IS LEFT
         ALONE DELIBERATELY. The gate is true in the prism beat and again for a sliver of the
         side->solo crossfade, where side has already fallen below 0.5 but solo has not yet risen above
         it — about 60px of scroll, a third of a second on a trackpad. It is in the frozen snapshot
         too. The obvious fix, adding `S.usPent < 0.01`, was written and measured and is WORSE: the US
         value labels do not arrive until usPent > 0.5, so suppressing the arms leaves the crossfade
         with no labels at all (probed at matched dims progress: 5 labels -> 0 at dims 0.52 and 0.54).
         The arms themselves are still drawn through the crossfade, so the labels are not wrong for
         what is on screen; closing the gap properly means moving when the US values appear, which is
         a choreography decision for the owner and not a smoothness fix. Reverted, and recorded here
         so the next person does not re-derive it. */
      var showArms = S.arms > 0.3 && S.formation > 2.95 && S.solo < 0.5 && S.side < 0.5 && !isMobile;
      armLabels.forEach(function (l) { setLabel(l, showArms); });
      var showRidge = S.side > 0.5 && S.solo < 0.5 && S.dissolve < 0.5 && !isMobile;
      ridgeLabels.forEach(function (l) { setLabel(l, showRidge); });
      var showVals = S.usPent > 0.5 && S.dissolve < 0.5;
      valLabels.forEach(function (l, i9) { setLabel(l, showVals, S.solo > 0.5 && S.activeDim === i9); });
      setLabel(tierPentLabel, showVals && !isMobile);
      // the weak-link cost counts down with the contraction: 60.3 -> 57.5 (both from the Cycle 2 workbook)
      var showPen = S.ringSolid > 0.02 && S.dissolve < 0.5;
      if (showPen) {
        var pv = US_ARITHMETIC_APPROX - (US_ARITHMETIC_APPROX - US_COMPOSITE) * Math.min(1, S.ringSolid);
        var penText = '<strong>' + US_ARITHMETIC_APPROX.toFixed(1) + ' → ' + pv.toFixed(1) + '</strong>from the simple average to SAPI\'s score: the gold band is the weak-link cost, almost 3 points';
        // the guard used to live in a data-attribute, so every one of the ~25 changes through the
        // contraction wrote the 200-character string twice (innerHTML, then the attribute)
        if (penText !== penLast) { penLast = penText; penaltyLabel.el.innerHTML = penText; }
      }
      setLabel(penaltyLabel, showPen);
    }

    /* ---------------- hover: nearest cluster / column ---------------- */
    var anchorsSphere = sphereAnchor.map(function (a) { return { x: a[0], y: a[1], z: a[2] }; });
    var hover = { i: -1, px: 0, py: 0, over: false, inAct: false, keyboard: false };
    function chipHTML(i) {
      var c = countries[i], n = (flags[c.country] || { unsourcedIndicators: 0 }).unsourcedIndicators;
      return '<strong>' + c.rank + '. ' + c.country + ' · ' + c.composite.toFixed(1) + '</strong><br>' +
        '<span class="muted">' + c.tier + ' tier</span><br>' +
        'Strongest: ' + c.strongest + '<br>Weakest: ' + c.weakest + '<br>' +
        (n ? '<span class="red">' + n + ' of 30 indicators unsourced</span>' : '<span class="muted">All 30 indicators sourced</span>');
    }
    function showChip(i, x, y) {
      if (i < 0) { chipEl.classList.remove('is-on'); return; }
      chipEl.innerHTML = chipHTML(i);
      var cx2 = Math.min(x, W - 260), cy2 = Math.min(y, H - 120);
      chipEl.style.transform = 'translate(' + (cx2 + 14).toFixed(0) + 'px,' + (cy2 + 14).toFixed(0) + 'px)';
      chipEl.classList.add('is-on');
    }
    function nearest(px, py) {
      var f = S.formation, form = Math.round(f);
      if (S.load < 1 || Math.abs(f - form) > 0.02 || S.dissolve > 0.3 || S.solo > 0.3) return -1;
      if (form !== 1 && form !== 2) return -1;
      var best = -1, bestD = 1e9;
      for (var i = 0; i < countries.length; i++) {
        var o = form === 1 ? anchorsSphere[i] : { x: stripAnchor[i][0], y: 0, z: stripAnchor[i][2] };
        if (form === 1) { var c = Math.cos(S.spin), s = Math.sin(S.spin); o = { x: o.x * c + o.z * s, y: o.y, z: -o.x * s + o.z * c }; if (o.z < -0.2) continue; }
        var p = project(o);
        var dx = p.x - px, dy = form === 2 ? Math.max(0, Math.abs(p.y - py) - H * 0.28) : p.y - py;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestD) { bestD = d; best = i; }
      }
      var tol = form === 2 ? 16 : 30;
      return bestD <= tol ? best : -1;
    }
    function onPointerMove(e) {
      if (isTouch) return;
      var t = e.target;
      var inAct = t && t.closest && t.closest('#act1');
      var onText = t && t.closest && t.closest('.field-text, a, button, table, .field-chip, .masthead');
      var r = stage.getBoundingClientRect();
      hover.px = e.clientX - r.left; hover.py = e.clientY - r.top;
      // S.dissolve < 0.999: the gold snap-cursor is a document-level fixed element, so the
      // `.field-stage.is-done` rule that hides the canvas, the label layer and the poster does not
      // reach it. Past the dissolve the stage is black and empty, and the ring was the only thing
      // drawn on it — a gold circle following the pointer over nothing. #act1 also extends past the
      // dissolve now (the exit hold band), so "pointer inside act1" is no longer enough on its own.
      // hover.inAct is the pointer state WITHOUT the dissolve gate, so the is-done handoff in draw()
      // can restore the flag on the way back up instead of leaving it stale (see there).
      hover.inAct = !!inAct && !onText && hover.py >= 0 && hover.py <= r.height;
      hover.over = hover.inAct && S.dissolve < 0.999;
      if (cursorEl) { cursorEl.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; cursorEl.classList.toggle('is-on', hover.over); }
    }
    function updateHover() {
      if (hover.keyboard) return;
      var i = hover.over ? nearest(hover.px, hover.py) : -1;
      if (i !== hover.i) { hover.i = i; S.hi = i >= 0 ? i : (tableHi >= 0 ? tableHi : -1); }
      if (cursorEl) cursorEl.classList.toggle('is-snap', i >= 0);
      if (i >= 0) showChip(i, hover.px, hover.py); else if (!hover.keyboard && tableHi < 0) chipEl.classList.remove('is-on');
    }
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', function () { hover.over = false; hover.inAct = false; });
    if (isTouch) {
      stage.style.pointerEvents = 'auto';
      stage.addEventListener('pointerdown', function (e) {
        var r = stage.getBoundingClientRect(); var i = nearest(e.clientX - r.left, e.clientY - r.top);
        if (i >= 0) { S.hi = i; showChip(i, Math.min(e.clientX - r.left, W - 240), 8); } else { S.hi = -1; chipEl.classList.remove('is-on'); }
      });
      document.addEventListener('pointerdown', function (e) { if (!stage.contains(e.target)) { S.hi = -1; chipEl.classList.remove('is-on'); } });
    }
    // Top-ten table rows light their column
    var tableHi = -1;
    document.querySelectorAll('#act1 tr[data-country]').forEach(function (tr) {
      var i = countries.findIndex(function (c) { return c.country === tr.dataset.country; });
      function on() { tableHi = i; S.hi = i; tr.classList.add('is-hi'); }
      function off() { tableHi = -1; if (!hover.keyboard) S.hi = hover.i; tr.classList.remove('is-hi'); }
      tr.addEventListener('mouseenter', on); tr.addEventListener('mouseleave', off);
      tr.addEventListener('focus', on); tr.addEventListener('blur', off);
    });
    // Keyboard: the visually-hidden "Explore the field" button cycles clusters with arrow keys
    if (exploreBtn) {
      var kIndex = -1;
      function announce(i) {
        var c = countries[i], n = (flags[c.country] || { unsourcedIndicators: 0 }).unsourcedIndicators;
        if (liveEl) liveEl.textContent = c.rank + ', ' + c.country + ', composite ' + c.composite.toFixed(1) + ', ' + c.tier + ' tier. Strongest ' + c.strongest + ', weakest ' + c.weakest + '. ' + n + ' of 30 indicators unsourced.';
        S.hi = i; hover.keyboard = true; showChip(i, W * 0.55, H * 0.2);
      }
      exploreBtn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); kIndex = (kIndex + 1) % countries.length; announce(kIndex); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); kIndex = (kIndex - 1 + countries.length) % countries.length; announce(kIndex); }
        else if (e.key === 'Escape') { hover.keyboard = false; S.hi = -1; chipEl.classList.remove('is-on'); if (liveEl) liveEl.textContent = ''; }
      });
      exploreBtn.addEventListener('blur', function () { hover.keyboard = false; S.hi = -1; chipEl.classList.remove('is-on'); });
      exploreBtn.addEventListener('click', function () { kIndex = 0; announce(0); });
    }

    /* ---------------- apply state -> uniforms / materials ---------------- */
    function apply() {
      // formation x load: while the assembly plays (load < 1) the field is still gathering from dust,
      // whatever the scroll has asked for; continuous in time, and no two tweens ever share a property.
      U.uFormation.value = S.formation * S.load; U.uSpin.value = S.spin; U.uActiveDim.value = S.activeDim; U.uSoloMix.value = S.solo;
      U.uDissolve.value = S.dissolve; U.uHighlight.value = S.hi; U.uPulse.value = S.pulse; U.uDrift.value = S.drift;
      gratMat.opacity = 0.1 * S.grat; graticule.visible = S.grat > 0.01;
      tierMat.opacity = S.tier; tiers.forEach(function (t) { t.visible = S.tier > 0.01; });
      axisMat.opacity = 0.35 * S.axis; axis.visible = S.axis > 0.01;
      tickMat.opacity = 0.9 * S.ticks; meanTick.visible = medianTick.visible = S.ticks > 0.01;
      for (var i = 0; i < 5; i++) { var base = 0.3 + weights[i] * 2; var dimF = (S.activeDim < 0 || S.activeDim === i) ? 1 : 0.4; armMats[i].opacity = base * S.arms * dimF * (1 - S.solo * 0.6) * (1 - S.dissolve); arms[i].visible = armMats[i].opacity > 0.005; }
      var pentOn = S.meanPent * (1 - S.solo) * (1 - S.dissolve);
      meanMat.opacity = 0.9 * pentOn; meanPent.visible = meanMat.opacity > 0.01;
      meanBackMat.opacity = 0.5 * pentOn * S.side; meanBack.visible = meanBackMat.opacity > 0.01;
      spineMat.opacity = 0.4 * pentOn * S.side; spine.visible = spineMat.opacity > 0.01;
      for (var ri = 0; ri < 5; ri++) { ridgeMats[ri].opacity = (ri === 1 || ri === 3 ? 0.95 : 0.45) * pentOn * S.side; ridges[ri].visible = ridgeMats[ri].opacity > 0.01; }
      usMat.opacity = 0.85 * S.usPent * (1 - S.dissolve); usPent.visible = usMat.opacity > 0.01;
      pent60Mat.opacity = 0.6 * S.usPent * (1 - S.dissolve); pent60.visible = pent60Mat.opacity > 0.01;
      pent40Mat.opacity = 0.25 * S.usPent * (1 - S.dissolve); pent40.visible = pent40Mat.opacity > 0.01;
      ringDashMat.opacity = 0.9 * S.ringDash * (1 - S.dissolve); ringDash.visible = ringDashMat.opacity > 0.01; ringDash.scale.set(S.ringScale, S.ringScale, 1);
      ringSolidMat.opacity = S.ringSolid * (1 - S.dissolve); ringSolid.visible = ringSolidMat.opacity > 0.01;
      annulusMat.opacity = 0.3 * S.ringSolid * (1 - S.dissolve); annulus.visible = annulusMat.opacity > 0.01;
    }

    /* ---------------- render loop (only while visible + tab visible) ---------------- */
    var running = false, rafId = 0, visible = true, lastT = 0, ended = false, loadT0 = -1;
    var doneOn = false;   // is-done is currently on the stage (see the handoff at the end of draw)
    // The shader clock, ACCUMULATED from clamped frame deltas rather than read off the wall clock.
    // The loop stops whenever the stage leaves the viewport, whenever the tab is hidden and once the
    // dissolve completes; a wall-clock uTime would then advance the drift and the solo pulse by the
    // whole pause in the first frame after a wake -- a scintillation pop (the 0.04-unit drift swing is
    // up to ~7px on screen at fitW 5.4) rather than a smooth resume. The sphere spin one line below in
    // draw() was already clamped this way; the shader clock was simply missed.
    var tAcc = 0;
    var lastDimsT = -1, dimsFwdOK = false;   // see the dims-render note in draw(): forward-only forcing
    function frame(now) {
      rafId = 0;
      if (!running) return;
      if (!draw(now)) return;
      rafId = requestAnimationFrame(frame);
    }
    // One frame of work. Returns false when there is nothing left to draw (Act I dissolved).
    function draw(now) {
      var dt = now - lastT; lastT = now; SAPI.fieldFrames = (SAPI.fieldFrames || 0) + 1;
      // THE "LITE MODE" DEGRADATION IS GONE, DELIBERATELY. It watched for 30 consecutive frames slower
      // than 24ms and then set uLite permanently, with no path back; the shader then discards roughly
      // half of the 1,500 points for the rest of the visit. It was aimed at the wrong bottleneck (7.5
      // draw calls per frame is nowhere near fill-bound at dpr 2; a machine dropping 30 frames in a row
      // is stalling on the main thread, which the style-recalc work is what fixes) and the measured
      // longest run of dt>24 frames is 0 on trackpad, 1 on touch-390 and 5 under --cpu=4. So on
      // everything tested it was pure downside: it showed the slow visitor half the field. The uniform
      // and its shader branch stay as an unused hook; nothing sets it.
      if (S.formation <= 1.02 && !reduced) S.spin += 0.025 * Math.min(dt, 50) / 1000;   // 0.025 rad/s idle orbit of the globe
      tAcc += Math.min(dt, 50) / 1000; U.uTime.value = tAcc;   // see tAcc above: a paused loop must not jump the phase
      if (S.load < 1 && loadT0 > 0) {                        // the assembly: 1.4s expo.out from boot, on the wall clock
        var lp = Math.min(1, (Date.now() - loadT0) / 1400);   // (not rAF timestamps: frames may be starved, the clock is not)
        S.load = lp >= 1 ? 1 : 1 - Math.pow(2, -10 * lp);
      }
      /* THE DIMS TIMELINE GETS THE LAST WORD ON THE CAMERA, AND IT HAS TO BE TAKEN HERE.
         tlEd and tlDims write the same six camera keys — the fold's end pose IS CAM_PRISM. Past the
         edition trigger's end its scroll progress is pinned at 1 while its RENDERED progress creeps
         0.998 -> 1.0 over 15-23 frames, re-writing ~CAM_PRISM on each; whether that lands on top of
         tlDims is pure tick order, so the bug was intermittent. Measured on touch-768: the prism->side
         orbit did not move for 26 consecutive scrolling frames and then landed 78.6 degrees in one
         (318px of apparent screen movement; next worst frame in the beat, 48px). draw() is the LAST
         rAF callback of its turn, so re-rendering tlDims here makes the precedence explicit.
         THE 0.15 GATE IS THE PRECEDENCE RULE: below it no dims camera tween has started (roll 0.16,
         orbit 0.22) so nothing is written and the fold's own scrub tail keeps the camera, which is
         right. Snapping tlEd to its end instead clears the freeze but lands the fold's last 8% in one
         frame (0.365 step in fitW at y2662, touch-768) — do not.
         FORWARD ONLY, because a gsap timeline rewinds a child by re-rendering it at ratio 0 on the
         frame its time crosses back over that child's start, and forcing a render at an unchanged
         time suppresses that crossing. Scrolling back up out of the finale, the orbit tween was then
         never rewound and the camera snapped 84 degrees at y2440 (back-1440r, max dOrbit 1.4661).
         Nothing needs forcing on the way back: tlEd's scrub has long completed by then.
         AND THE FORCE IS ARMED BY A FORWARD MOVE, NOT BY dimsT >= lastDimsT. `>=` let the force fire at
         an UNCHANGED time on the frame after the playhead had moved BACKWARD, and a forced render of a
         gsap timeline re-renders children that lie after the playhead at ratio 1 — it writes their END
         values into S while the timeline itself is correct. Probed at 1440x900 with a backward teleport
         (dims 0.55 -> 0.20, exactly what the jump profile does): the timeline read progress 0.2000 with
         every child at the right ratio, while S held the full side pose (orbit -1.4661 = -84 deg, roll
         1.2566 = 72 deg, side 1.000, fitW 9.8) against the correct orbit 0 / roll 0.0643 / side 0 /
         fitW 8.4 — and it stayed there for the whole prism -> side beat, so a reader arriving by anchor,
         find-in-page, Home/End or scroll restoration never saw the front-on prism. Isolated by calling
         tlDims.render(tlDims.time(), true, true) by hand and watching S flip.
         So: a strictly forward step arms the force (the children are then in a forward-consistent state
         and re-asserting them is safe, which is the tlEd-clobber case this exists for); any backward
         step disarms it until the next forward step. An unchanged time keeps whatever the last real
         move decided, which is what the creeping-tlEd case needs. */
      if (tlDims && S.dims > 0.15) {
        var dimsT = tlDims.time();
        if (dimsT > lastDimsT) dimsFwdOK = true; else if (dimsT < lastDimsT) dimsFwdOK = false;
        /* Re-assert ONLY the children the playhead has reached. A forced render of the whole timeline also
           re-renders children that start AFTER the playhead, and once the finale has been played and
           scrolled back up those children carry their finished values: the forced render wrote them into
           S, so on the second pass down the camera snapped to the full side pose (orbit -84 deg, roll 72 deg)
           the moment dims passed 0.15 and held it through the front-on prism beat. Rendering each started
           child at its own local time, in start order, gives the same precedence over tlEd with no leak. */
        if (dimsFwdOK) {
          try {
            var kids = tlDims.getChildren(false, true, false);
            for (var ki = 0; ki < kids.length; ki++) {
              var kid = kids[ki], st0 = kid.startTime();
              if (st0 > dimsT) continue;   // not reached yet: leave it alone
              kid.render(Math.min(dimsT - st0, kid.duration()), true, true);
            }
          } catch (e) {}
        }
        lastDimsT = dimsT;
      } else { lastDimsT = -1; dimsFwdOK = false; }
      placeCamera(); apply(); updateHover(); updateLabels(); caption(captionFor());
      renderer.render(scene, camera);
      // Act I over: nothing left to draw. is-done is a state transition, not a per-frame write — the
      // stage is the ancestor of the canvas, the captions and the whole label layer, and the class
      // drives a descendant-combinator rule, so writing it every frame dirtied all of them.
      if (S.dissolve >= 0.999) { idle = true; if (!doneOn) { doneOn = true; stage.classList.add('is-done'); hover.over = false; if (cursorEl) { cursorEl.classList.remove('is-on'); cursorEl.classList.remove('is-snap'); } } return false; }
      // Scrolling back up out of the finale replays the beats, so the snap cursor has to come back with
      // them. hover.over is only ever recomputed in onPointerMove, so the forced clear above used to
      // survive the whole replayed finale until the reader happened to move the pointer. The
      // S.dissolve < 0.999 term in onPointerMove already keeps the ring off while the act is over, so
      // restoring the last known pointer state here is enough; hover.inAct is that state.
      if (doneOn) { doneOn = false; stage.classList.remove('is-done'); hover.over = hover.inAct; }
      return true;
    }
    // Settle frame: if requestAnimationFrame has been starved (throttled tab, low-power mode,
    // headless capture) the last drawn frame would be an early one from the assembly. Draw the
    // settled scene once from a timer. In a normal browser ~100 frames have run by now: a no-op.
    setTimeout(function () { if (running && !idle && (SAPI.fieldFrames || 0) < 30) draw(performance.now()); }, 1700);
    var idle = false;
    /* is-done is dropped by draw(), NOT here. Clearing it in wake() was tried, measured and backed out:
       it removes one sampled frame in which the stage still carries is-done while the dissolve has
       reversed below 0.999 — but that frame is never PAINTED with the class on, because draw() is the
       last rAF callback of its turn (sampler, lenis, ScrollTrigger's _rafBugFix, then frame) and it
       removes the class before returning. The harness samples in an earlier rAF callback, which is why
       it sees it. Sampling-order artefact, not a pop. What clearing it here cost: under scrub, gsap
       renders S.dissolve one tick AFTER the onUpdate that calls wake(), so wake() strips the class and
       the very next draw() puts it back, every frame, until the scrub catches up — doneFlips 2 -> 38
       and 42 on back, 1 -> 23 on stopgo, 1 -> 15 on trackpad. That is the per-frame class write on
       #field-stage, the ancestor of the canvas, the captions and the whole label layer, coming back by
       another door. Do not re-add it. */
    function wake() { if (running && idle && !rafId) { idle = false; lastT = performance.now(); rafId = requestAnimationFrame(frame); } }
    function start() { if (running || reduced || ended) return; running = true; idle = false; lastT = performance.now(); rafId = requestAnimationFrame(frame); }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
    function gate() { if (visible && document.visibilityState === 'visible' && !ended) start(); else stop(); }
    // rootMargin 300px: start the loop while the stage is still 300px outside the viewport, so the first
    // frame the reader can actually see has already been drawn rather than being the one that starts it.
    var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; gate(); if (!visible) flushRefresh(); }, { rootMargin: '300px 0px', threshold: 0 });
    io.observe(stage);
    document.addEventListener('visibilitychange', gate);
    /* A RESIZE THAT IS ONLY THE BROWSER CHROME MOVING MUST NOT REFRESH THE TRIGGERS.
       On a phone, scrolling collapses the address bar and fires `resize` with a 50-100px height change
       and no width change. ScrollTrigger.refresh() then recomputes every start and end against the new
       innerHeight: at 375x812 a 60px collapse steps the dims progress from 0.8955 to 0.9263 in ONE
       frame — a quarter of the dissolve beat — while the reader did nothing but keep scrolling.
       So resize() always runs (the canvas must stay the right size), but the refresh is gated on a
       real new layout: a width change, or a height change over 20% of the last height (a Chrome-Android
       bar is ~7% of 812, iOS Safari's ~13%). ScrollTrigger.config({ ignoreMobileResize: true }) below
       is GSAP's own guard for the same case. When a refresh does run, settleScrub() lands the scrubbed
       timelines on the new geometry in one frame instead of playing the difference as camera motion.
       WHAT THE MOBILE DEFERRAL CANNOT DO: any ScrollTrigger.refresh() taken part-way down Act I on the
       mobile layout comes back with garbage geometry — probed against the FROZEN SNAPSHOT too, so it is
       pre-existing. At y=3600 one refresh moves the dims trigger from [1858, 3751] to [-1742, 151] and
       pins dims at 1.000 for the rest of the visit. Gating out the address-bar case removes the whole
       of the exposure a real reader meets on every scroll. A rotation changes the WIDTH, so the library
       refreshes whatever this code does; holding ours buys recovery (flushed when Act I leaves view or
       the reader returns to the top, both positions where the measurement is correct), and
       repairGeometry() below is the backstop for when it does not. Desktop always refreshes at once. */
    var lastW = window.innerWidth, lastH = window.innerHeight;
    var refreshPending = false;
    function doRefresh() { refreshPending = false; ScrollTrigger.refresh(); settleScrub(); }
    function flushRefresh() { if (refreshPending && window.ScrollTrigger) doRefresh(); }

    /* THE LAST-RESORT REPAIR, for the refresh this handler cannot hold back. A rotation changes the
       width, so ScrollTrigger's own resize listener refreshes whatever we do — and on the mobile layout
       a refresh taken part-way down Act I comes back wrong in a specific, recognisable way: every start
       and end is displaced by exactly -scrollY (probed at 390x844, y=3600: dims [1858, 3751] becomes
       [-1742, 151]), i.e. the measurement was taken without the document being returned to the top.
       dims then sticks at 1.000 and Act I is over for the rest of the visit; a second refresh at the
       same position reproduces it. So do what the measurement needed: put the document at the top,
       refresh there, put the reader back. It fires ONLY when the geometry is already impossible — the
       .act-dims section has a positive layout top while its trigger claims to start above the document
       — so what it is weighed against is not a scroll flicker, it is a dead act. Both scrollTo calls
       are synchronous inside one frame, so nothing paints in between. */
    var repairing = false;
    function geometryBroken() {
      var st = tlDims && tlDims.scrollTrigger, sec = act1 && act1.querySelector('.act-dims');
      if (!st || !sec || !isFinite(st.start)) return false;
      return (sec.getBoundingClientRect().top + window.scrollY) > 0 && st.start < 0;
    }
    function repairGeometry() {
      if (repairing || !window.ScrollTrigger || !geometryBroken()) return;
      repairing = true;
      var y = window.scrollY, html = document.documentElement, prev = html.style.scrollBehavior;
      try {
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
        window.scrollTo(0, y);
        html.style.scrollBehavior = prev;
        ScrollTrigger.update();
        settleScrub();
      } catch (e) { html.style.scrollBehavior = prev; }
      repairing = false;
    }
    // Named rather than anonymous so the disposer at the end of the file can remove it: after the
    // mid-page "Reduce motion" toggle this handler would otherwise still be calling resize() ->
    // renderer.setSize() on a renderer the cleanup has just disposed.
    var resizeT; function onWindowResize() {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        resize();
        var w = window.innerWidth, h = window.innerHeight;
        var layoutChanged = (w !== lastW) || Math.abs(h - lastH) > lastH * 0.2;
        lastW = w; lastH = h;
        // resize() only re-sizes the framebuffer; something has to draw into it. An idle stage (loop
        // stopped because Act I finished, or because the stage is off screen) would otherwise keep the
        // old-size buffer until the next thing woke it. Not while the act is over: waking then would
        // flip is-done off and straight back on for a stage that is invisible anyway.
        if (S.dissolve < 0.999) { wake(); if (running) draw(performance.now()); }
        // Settle on EVERY resize, refresh or no refresh. ScrollTrigger keeps its own resize listener and
        // recomputes whether or not this handler asks it to, so the trigger progress can step without us;
        // under scrub that step is played as camera motion. Settling is idempotent and costs one frame —
        // but doRefresh() already ends with one, so a layout-changing resize used to settle twice in a
        // row for no reason; the else is what stops that.
        if (layoutChanged && window.ScrollTrigger && !(isMobile && visible && window.scrollY > 4)) doRefresh();
        else {
          if (layoutChanged && window.ScrollTrigger) refreshPending = true;   // see the note above
          settleScrub();
        }
      }, 150);
    }
    window.addEventListener('resize', onWindowResize);
    // the other safe moment: the reader is back at the top, where the measurement is exact
    function onTopScroll() { if (refreshPending && window.scrollY <= 4) flushRefresh(); }
    window.addEventListener('scroll', onTopScroll, { passive: true });

    /* ---------------- disposal ---------------- */
    SAPI.disposers.push(function () {
      stop(); io.disconnect();
      geom.dispose(); matGold.dispose(); matRed.dispose(); gratGeom.dispose();
      rig.traverse(function (o) { if (o.geometry && o.geometry !== geom) o.geometry.dispose(); if (o.material && o.material.dispose && o.material !== matGold && o.material !== matRed) o.material.dispose(); });
      renderer.dispose();
    });

    /* =====================================================================
       REDUCED MOTION: three plates, rendered once, then the renderer is disposed.
       ===================================================================== */
    if (reduced) { renderPlates(); return; }

    /* THE MASTHEAD'S "REDUCE MOTION" BUTTON, PRESSED PART-WAY DOWN THE PAGE. motion.js removes
       js-motion, sets data-motion="reduce" and fires SAPI.onMotion — and field.js registered nothing
       there. The result, probed at y=3297 on the frozen snapshot as well as here: the stage loses its
       height and collapses to 0px while still carrying is-live, the poster is display:none, and the
       three .plate figures still hold their SVG placeholders because nothing rendered them. The
       right-hand half of the viewport is empty for the rest of the visit. (Switching back to full
       motion reloads, so that direction is fine.) renderPlates() is exactly the reduced-motion boot
       path: it draws the three plates and then flushes every disposer. Guarded against running twice
       because the disposer list is emptied on the first pass. */
    var platesDrawn = false;
    if (SAPI.onMotion) SAPI.onMotion.push(function (r) {
      if (!r || platesDrawn) return;
      platesDrawn = true; reduced = true;
      stop(); stage.classList.remove('is-live'); stage.classList.remove('is-done');
      // renderPlates() flushes the disposers in a finally now, so a plate that fails to paint can no
      // longer leak the GL context, the observer, the window listeners or the triggers. This catch
      // only keeps a cosmetic failure from propagating out of a click handler.
      try { renderPlates(); } catch (e) {}
    });

    function renderPlates() {
      var plates = [
        { id: '1', pose: function () { S.formation = 2; S.orbit = 0; S.elev = 0; S.fitW = 11.6; S.fitH = 5.6; S.tx = 0; S.shift = 0; S.tier = 0.35; S.axis = 1; S.ticks = 1; S.grat = 0; S.edition = 0.2; }, labels: function () { return tierLabels.concat([plateTickLabel], axisLabels); } },
        { id: '2', pose: function () { S.formation = 2; S.orbit = 0; S.elev = 0; S.fitW = 8.2; S.fitH = 5.6; S.tx = 1.1; S.shift = 0; S.tier = 0.35; S.axis = 1; S.ticks = 1; S.edition = 1; }, labels: function () { var l = countryLabels.slice(0, 10); l.forEach(function (o, i) { o.x = LIST_X; o.y = LIST_Y0 - i * LIST_DY; }); return l.concat(tierLabels.slice(1)); } },
        { id: '3', pose: function () { S.formation = 3; S.orbit = 0.26; S.elev = 0.04; S.fitW = 7.6; S.fitH = 8.6; S.tx = 0; S.ty = 0.3; S.tz = SOLO_Z; S.shift = 0; S.tier = 0; S.axis = 0; S.ticks = 0; S.solo = 1; S.usPent = 1; S.ringDash = 1; S.ringSolid = 1; S.ringScale = 1; S.arms = 0.6; S.meanPent = 0; S.side = 0; }, labels: function () { return valLabels.concat([tierPentLabel]); } }
      ];
      var cvs = document.createElement('canvas'), ctx = cvs.getContext('2d');
      try {
      plates.forEach(function (p) {
        var fig = document.querySelector('.plate[data-plate="' + p.id + '"]'); if (!fig) return;
        var w = Math.max(320, Math.round(fig.getBoundingClientRect().width || 560)), h = Math.round(w * (p.id === '3' ? 0.9 : 0.58));
        W = w; H = h; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); U.uSizeScale.value = Math.min(1.25, Math.max(0.7, h / 800));
        p.pose(); S.drift = 0; U.uTime.value = 0; placeCamera(); apply(); renderer.render(scene, camera);
        cvs.width = w * DPR; cvs.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.drawImage(renderer.domElement, 0, 0, w, h);
        ctx.font = '11px ui-monospace, Menlo, monospace'; ctx.textBaseline = 'bottom';
        var placed = [];   // label boxes already painted on this plate
        p.labels().forEach(function (o) {
          var pt = project(o); if (pt.behind) return;
          var isTier = o.el.classList.contains('field-label--tier') || o.el.classList.contains('field-label--tierpent'), isCountry = o.el.classList.contains('field-label--country');
          // `o.short` only exists on the three ruler tier labels (mkLabel does not create it); isTier
          // also matches field-label--tierpent, which is plate 3's "Advanced tier begins · 60" and has
          // none. Plate 3's figure measures 532px, so w < 700 was true and this threw
          // "Cannot read properties of undefined (reading 'replace')" part-way through the plate —
          // silently, because the mid-page reduce-motion handler wraps renderPlates in a catch. The
          // plate was left unrendered AND the disposer flush at the end of renderPlates never ran, so
          // the GL context, the IntersectionObserver and all four ScrollTriggers stayed alive after the
          // reader had asked for reduced motion. Pre-existing: the frozen snapshot throws it at the
          // reduced-motion boot too. Guarding the ternary keeps the full text when there is no short
          // form, which is what the tierpent label wants anyway — it is already short.
          var text = (isTier && w < 700 && o.short ? o.short : o.el.textContent).replace(/\s+/g, ' ').trim();
          ctx.fillStyle = o.el.classList.contains('is-empty') ? '#E3B75C' : (isTier ? '#A9A497' : '#FBF5E6');
          ctx.textAlign = (isTier || isCountry) ? 'left' : 'center';
          var tx = isTier ? pt.x + 6 : (isCountry ? pt.x : pt.x), ty = (o.el.classList.contains('field-label--tick') || o.el.classList.contains('field-label--axis')) ? pt.y + 14 : (isCountry ? pt.y + 6 : pt.y);
          if (o.el.classList.contains('field-label--tier')) { ctx.textAlign = 'center'; tx = pt.x; }   // band-centred, like the live labels
          if (o.el.classList.contains('field-label--plate-tick')) { ctx.textAlign = 'center'; tx = pt.x; ty = pt.y + 14; }   // its own row under the numerals, centred on the mean tick
          if (o.tierIdx !== undefined) ty += (o.tierIdx % 2) * 14;   // two rows so neighbouring tier labels never overprint
          var wdt = ctx.measureText(text).width + 8;
          var rx = ctx.textAlign === 'left' ? tx - 2 : (ctx.textAlign === 'right' ? tx - wdt + 2 : tx - wdt / 2);
          // collision pass: anything that still lands on an already-placed label in the same row is pushed right
          // (or clamped inside the plate) before it is painted, so no two readouts ever abut
          for (var pi = 0; pi < placed.length; pi++) { var q = placed[pi]; if (Math.abs(q.y - ty) < 12 && rx < q.x + q.w + 6 && rx + wdt > q.x - 6) { var dx = (q.x + q.w + 6) - rx; rx += dx; tx += dx; } }
          if (rx + wdt > w - 2) { var back = rx + wdt - (w - 2); rx -= back; tx -= back; }
          if (rx < 2) { tx += 2 - rx; rx = 2; }
          placed.push({ x: rx, y: ty, w: wdt });
          ctx.save(); ctx.fillStyle = 'rgba(8,6,15,.75)'; ctx.fillRect(rx, ty - 13, wdt, 15); ctx.restore();
          ctx.fillStyle = o.el.classList.contains('is-empty') ? '#E3B75C' : (isTier ? '#A9A497' : (o.el.classList.contains('field-label--val') ? '#E3B75C' : '#FBF5E6'));
          ctx.fillText(text, tx, ty);
        });
        var img = document.createElement('img');
        img.width = w; img.height = h; img.src = cvs.toDataURL('image/png');
        var svg = fig.querySelector('svg, img'); img.alt = svg && svg.getAttribute('aria-label') ? svg.getAttribute('aria-label') : 'Plate ' + p.id;
        if (svg) svg.replaceWith(img); else fig.insertBefore(img, fig.firstChild);
      });
      } finally {
        /* THE CLEANUP IS IN A finally ON PURPOSE. It stops the render loop, disconnects the observer,
           kills the ScrollTriggers, removes the window listeners and frees the GL context, and it is
           the whole point of the mid-page "Reduce motion" path. If a plate throws while painting (one
           did: see the o.short guard above) the plate is a cosmetic loss, but skipping this would
           leave a page that the reader has just asked to stop still running its loop and driving its
           triggers. Paint what can be painted, then detach either way. */
        SAPI.disposers.forEach(function (fn) { try { fn(); } catch (e) {} }); SAPI.disposers.length = 0;
      }
    }

    /* =====================================================================
       MOTION: load sequence + scroll choreography
       ===================================================================== */
    /* ONE INVISIBLE WARM-UP FRAME, before the canvas is ever shown. Five GL programs are needed across
       Act I, but three belong to objects that start .visible = false and are only switched on by apply()
       from the scrubbed state. Instrumented on a cold profile that put two linkProgram calls at boot and
       THREE in the middle of the finale (dims 0.74, and two at 0.81). On this Mac ANGLE Metal compiles
       in parallel and it costs nothing, but the brief's own shader-cache-cold capture names 66.7ms and
       33.4ms dropped frames at exactly that beat. renderer.compile() is NOT a substitute: it walks
       traverseVisible and would skip precisely the three objects that matter. So force everything
       visible at opacity 0, render one frame into a 1x1 scissor while the canvas is still
       visibility:hidden, then restore. Recording is a SEPARATE pass from the mutation because several
       objects share one material (the three tier hairlines share tierMat) and a record-as-you-go loop
       would save the already-zeroed value for the second and third of them. */
    function warmUp() {
      var saved = [];
      rig.traverse(function (o) { if (o !== rig) saved.push({ o: o, v: o.visible, m: o.material || null, op: o.material ? o.material.opacity : 0 }); });
      for (var i = 0; i < saved.length; i++) { saved[i].o.visible = true; if (saved[i].m) saved[i].m.opacity = 0; }
      try {
        renderer.setScissorTest(true); renderer.setScissor(0, 0, 1, 1);
        placeCamera();
        renderer.render(scene, camera);
      } catch (e) { /* a warm-up must never be able to break the page */ }
      renderer.setScissorTest(false);
      for (var j = 0; j < saved.length; j++) { saved[j].o.visible = saved[j].v; if (saved[j].m) saved[j].m.opacity = saved[j].op; }
      renderer.clear();
    }
    warmUp();

    caption(captionFor());   // the sphere key is on from the first frame
    if (!window.gsap || !window.ScrollTrigger) { S.formation = 1; stage.classList.add('is-live'); start(); return; }
    gsap.registerPlugin(ScrollTrigger);
    /* GSAP's own guard for the mobile address bar: a resize that is only the URL bar collapsing or
       expanding is ignored, rather than recomputing every trigger's start and end under the reader.
       It is the library-side half of the gated resize handler above; grep confirmed it was nowhere in
       assets/js/ before this pass. */
    ScrollTrigger.config({ ignoreMobileResize: true });
    // repairGeometry (above) runs after ANY refresh, ours or the library's own resize refresh, one frame
    // later so the layout has settled. Registered here rather than beside the function so it is
    // unambiguously after gsap.registerPlugin.
    // Named so the disposer below can remove it: it was the one listener this file adds that the
    // disposal block missed, so after a mid-page "Reduce motion" it stayed subscribed for the life of
    // the document.
    function onSTRefresh() { if (!repairing) requestAnimationFrame(repairGeometry); }
    ScrollTrigger.addEventListener('refresh', onSTRefresh);
    SAPI.disposers.push(function () { try { ScrollTrigger.removeEventListener('refresh', onSTRefresh); } catch (e) {} });
    /* SCRUB. 0.9 on the desktop was a 0.9-second power1.out catch-up stacked on top of Lenis's own
       smoothing, so the scene ran measurably behind the text it is illustrating: 150px max / 58px mean
       on a flick, 83/56 on a gesture, 62/47 on a wheel. The .field-text columns and the sticky .dims
       column are laid out at Lenis's UNSCRUBBED position, so on a fast scroll the reader had the next
       paragraph in front of them while the scene was still a beat behind. 0.5 keeps enough smoothing to
       absorb a wheel's steps without letting the scene lag the copy.
       The touch branch stays at 0.5 and is written out rather than collapsed: raising it to 0.9 was
       measured on touch-768 and made every axis worse (hitches 61 -> 71, exit.dissolve 0.999 -> 0.977,
       CLS 0.0025 -> 0.0033), and lowering it further is untested on the worst profile in the matrix. */
    var scrub = isTouch ? 0.5 : 0.5;
    stage.classList.add('is-live');
    start();
    // Every scrubbed tween below is a fromTo with explicit start values (immediateRender:false).
    // Plain .to() tweens record their start value at first render, which for a scrubbed timeline is
    // whatever a neighbouring timeline or the load tween had set at that instant; a fast scroll would
    // then lock in a corrupt start forever. Explicit starts make each beat deterministic.
    /* ZERO IS THE POSE THE THREE TIMELINES HOLD BEFORE ANY OF THEM HAS RUN, collected here as the
       tweens are built. FIRST WRITER WINS: the earliest tween that owns a key defines that key's value
       from the top of the page down to its own start, which is exactly what a fromTo holds before it
       runs (`side` is owned by side-in from 0 at 0.19 and by side-out from 1 at 0.43 — 0 is the right
       answer at the top, so the later one must not overwrite it).
       settleScrub needs it because gsap only renders a tween when the playhead CROSSES it. A key whose
       only tween lies AHEAD of where the reader lands is never re-rendered, so it keeps the value it
       had at the position they came from. Probed at 1440x900, teleporting dims 0.55 -> 0.20: `solo`
       and `usPent` (one tween each, at 0.43) stayed at 0.5968 while every other value was correct —
       the United States pentagon still 60% faded up, over the front-on prism. Restoring ZERO before
       replaying gives every such key its own from-value instead. */
    var ZERO = {};
    var FT = function (tl, from, to, pos) { to.immediateRender = false; for (var zk in from) if (!(zk in ZERO)) ZERO[zk] = from[zk]; tl.fromTo(S, from, to, pos); };
    var CAM0 = { orbit: S.orbit, elev: S.elev, fitW: S.fitW, fitH: S.fitH, shift: S.shift, ty: S.ty };
    var CAM_RULER = { orbit: 0, elev: 0, fitW: 11.6, fitH: 5.6, shift: 0, ty: 0 };

    // 0. Load: dust -> sphere over 1.4s (expo.out); the per-particle stagger is in the shader.
    // 0. Load: dust -> sphere over 1.4s, expo.out, driven by the render loop's own clock (see frame):
    //    the intro must not wait on any library ticker. Per-particle stagger is in the shader.
    S.load = 0; loadT0 = Date.now();

    // 1. Hero -> "the field": sphere -> ruler, camera swings frontal, graticule dies, tier lines arrive.
    // Timeline ranges at 1440x900: hero 0-1170px of scroll, edition 792-2442, framework 2082-4512.
    // EASING, and it is the whole reason this act did not FEEL smooth while measuring at a flat 60fps.
    // Under scrub an ease is applied to SCROLL POSITION, not to time, so its derivative is how far the
    // camera moves per pixel of wheel travel. expo.inOut's peak derivative is 6.93x its own average:
    // the camera crawled through most of a beat and then covered the middle of it in a rush (measured
    // on the baseline, an 11.9x peak-to-mean). power2.inOut peaks at 2.0x, power1.inOut at 1.57x. Every
    // start pose, every end pose and every beat's position is unchanged; only the curve between.
    // THE HERO DOLLY is the biggest single camera move in the act — orbit -0.22 -> 0, fitW 5.4 -> 11.6,
    // shift 0.5 -> 0 — and it had 527px, because the edition timeline used to start at y540 and
    // immediately write fitW/fitH/tx. That is the ten consecutive camera-jumps at y329-499 in the
    // baseline flick (deltas up to 23x the median). It now gets 819px (0.70 of the hero timeline),
    // bought by starting the edition trigger a third of a viewport later; see 'top 42%' below.
    var tlHero = gsap.timeline({ scrollTrigger: { trigger: '.hero--field', start: 'top top', end: 'bottom top', scrub: scrub, invalidateOnRefresh: true,
      // refreshPriority orders the three timelines explicitly after any ScrollTrigger.refresh(). They
      // share one mutable state object S and all carry invalidateOnRefresh, so without it the post-refresh
      // write order is incidental and the last writer wins; hero (3) -> edition (2) -> dims (1) is the
      // order they occur in, so later acts overwrite earlier ones rather than the other way round.
      refreshPriority: 3,
      onUpdate: function (st) { S.prog = st.progress; } } });
    FT(tlHero, { grat: 1 }, { grat: 0, duration: 0.3, ease: 'none' }, 0);
    FT(tlHero, { formation: 1 }, { formation: 2, duration: 0.6, ease: 'none' }, 0);      // the map is destroyed on the first scroll tick
    // ease power2.inOut -> power1.inOut. The dolly is the largest camera move in the act and it is
    // crossed fastest by the coarsest input: a touch drag advances 26px per frame through a 484px
    // beat on the phone, so power2's 2.0x peak derivative put a run of six camera-jumps at y592-771
    // on touch-390 and six more in the first quarter-second of the desktop stopgo run. power1's peak
    // is 1.57x, which is the curve the edition pan and the fold — the act's other two big moves —
    // already use, so the dolly now matches them rather than being the one steeper exception. Start
    // pose, end pose and duration are unchanged.
    FT(tlHero, CAM0, Object.assign({ duration: 0.70, ease: 'power1.inOut' }, CAM_RULER), 0);
    FT(tlHero, { tier: 0, axis: 0 }, { tier: 0.35, axis: 1, duration: 0.4, ease: 'none' }, 0.6);   // the ruler is the image that holds

    // 2. Current edition: the ruler holds, the camera pans right into the empty space past 60,
    //    mean/median ticks draw at 20%; the last 25% folds the columns into the prism.
    // START MOVED 'top 70%' -> 'top 42%' (y540 -> y792 at 1440x900). This is the other half of the hero
    // dolly fix: the edition pan is what the hero camera was colliding with. The timeline now spans
    // 792-2442 instead of 540-2442, which absorbs without compressing a beat because y1300-2000 is dead
    // camera time in the measured velocity profile -- the ruler simply holds there. The hero dolly ends
    // at 819 and the edition pan's first 27px write fitW/fitH within 0.001 of the hero's end values, so
    // the handover is continuous; refreshPriority makes the edition the later writer of the two.
    var tlEd = gsap.timeline({ scrollTrigger: { trigger: '.act-edition', start: 'top 42%', end: 'bottom 30%', scrub: scrub, invalidateOnRefresh: true,
      refreshPriority: 2,
      onUpdate: function (st) { S.edition = st.progress; if (st.progress > 0.02 && st.progress < 0.7) caption('field'); else if (st.progress >= 0.7 && st.progress < 0.98) caption(isMobile ? 'solo' : 'prism'); else if (st.progress <= 0.02) caption(''); } } });
    // The pan: a gentle dolly to the right so the 50-60 columns, the empty zone and the listed top ten
    // sit clear of the text column, while the 40 line and the tier labels stay on screen. The mean and
    // median ticks project under the text column at 1280, so the readout is also in the 'field' caption.
    var CAM_PAN = isMobile ? { tx: 0.9, fitW: 8.6, fitH: 5.4 } : { tx: 0.55, fitW: 10.4, fitH: 5.4 };
    // ease: see the hero note. power1.inOut rather than power2 because this pan is a large, slow move
    // across a stretch where nothing else is happening, so the harness's camera-delta median in the
    // edition segment is ~0.001 and power2's 2.0x peak still stood out against it as a camera-jump on a
    // flick (measured at y1517-1529). power1's 1.57x peak puts it under the detector's absolute floor.
    /* THE PAN STARTS INSIDE THE EDITION TIMELINE, AND THAT IS A BUG FIX, NOT A TASTE CALL. This tween's
       FROM values are the hero dolly's END pose, so the frame the edition timeline first renders it, it
       writes fitW 11.6 over whatever the dolly has reached. On desktop that is harmless (the dolly ends
       at y819, the edition starts at y792). On the phone the two triggers land 147px apart, and at
       offset 0 fitW stepped 8.125 -> 11.600 in ONE frame at y657 — 23x its own local median, a visible
       snap of the globe to its ruler framing. (The frozen snapshot is worse: a 6.19-unit step at y404.)
       Desktop takes 0.02 (33px, first write at y825, six clear of the dolly) for a smaller version of
       the same reason; at 0 it cost one camera-jump at the handover on flick, gesture and
       trackpad-1920r (cam 0.0141 against a median of 0.0034 at y797).
    /* THE PHONE OFFSET IS 0.18, NOT 0.12, AND THE EXTRA 0.06 IS MEASURED. 0.12 (190px, first write at
       y802 against a dolly ending at y759) took the handover from the snapshot's 94x-the-local-median
       step down to 3.8x — better by a factor of five, but still three consecutive camera-jump frames at
       y647-722 on touch-390, i.e. a visible reframe pop in the first second of a phone visit. 43px of
       clearance is not enough because power1.inOut's tail is not flat: the dolly is still moving at
       ~0.8 of its mean rate over its last 40px, so the pan's from-pose lands on a moving target.
       0.18 is 285px, putting the first write at y897, 138px clear of the dolly's end, where the dolly
       has genuinely stopped. The pan's duration, from-pose and to-pose are unchanged and it still ends
       (0.18 + 0.5 = 0.68) well before the fold at 0.75. Desktop stays at 0.02: its two triggers are
       only 27px apart by construction, the dolly ends at y819 and the pan's first write is at y825. */
    FT(tlEd, { tx: 0, fitW: 11.6, fitH: 5.6 }, Object.assign({ duration: 0.5, ease: 'power1.inOut' }, CAM_PAN), isMobile ? 0.18 : 0.02);
    FT(tlEd, { ticks: 0 }, { ticks: 1, duration: 0.15, ease: 'none' }, 0.15);
    // ruler furniture (hairlines, axis, ticks, and with them the labels) is gone before the fold moves a particle
    FT(tlEd, { tier: 0.35, axis: 1, ticks: 1 }, { tier: 0, axis: 0, ticks: 0, duration: 0.06, ease: 'none' }, 0.72);
    if (!isMobile) {
      FT(tlEd, { formation: 2 }, { formation: 3, duration: 0.25, ease: 'none' }, 0.75);
      // the fold is one of the two largest moves in the act, so it takes the gentlest curve available:
      // power1.inOut, peak derivative 1.57x its average against expo.inOut's 6.93x
      // START 0.75 -> 0.73, DURATION 0.25 -> 0.27, SO THE END IS UNMOVED. The ruler holds dead still from
      // edition 0.50 to 0.75, and the fold's formation tween is linear, so the first frame of the fold
      // used to go from "nothing has moved at all" to full rate in one step -- a stall-catchup at the
      // fold in the baseline, pass 2 and here. Easing the camera in 33px early breaks that: by the time
      // formation starts at 0.75 the camera has already been drifting, imperceptibly (2% of the move,
      // fitW 10.4 -> 10.35), for two frames. formation itself is untouched, so no label, caption or
      // ruler-visibility timing moves; showArms is gated on formation > 2.95, not on arms, so the arm
      // labels still arrive exactly where they did.
      FT(tlEd, { orbit: 0, elev: 0, fitW: CAM_PAN.fitW, fitH: CAM_PAN.fitH, tx: CAM_PAN.tx, ty: 0, tz: 0, shift: 0, arms: 0 },
              { orbit: 0, elev: 0.05, fitW: 8.4, fitH: 12.4, tx: 0, ty: 0, tz: LAYER_MID, shift: 0.44, arms: 1, duration: 0.27, ease: 'power1.inOut' }, 0.73);
      FT(tlEd, { meanPent: 0 }, { meanPent: 1, duration: 0.08, ease: 'none' }, 0.92);
    } else {
      // Mobile: pan right, then fold straight into the flat US pentagon (the stack is skipped).
      /* SOLO IS A RAMP, NOT A SWITCH. It was duration 0.01 — 19px of scroll on the phone — so on any
         real touch scroll the whole field CUT to the United States in a single frame: every non-US
         point's alpha dropped 1 -> 0.12 (the VERT line `alpha *= mix(1.0, 0.12, uSoloMix * ...)`) and
         its z jumped to uSoloZ between one frame and the next. Measured on touch-390: solo 0.000 ->
         1.0000 across 16.6ms at y1898, a scene delta of 1.0000 against a local median of 0.064, which
         is the largest single discontinuity anywhere in either build. It is in the frozen snapshot
         too; the earlier passes left it because they scoped themselves to the desktop branch.
         IT KEEPS ITS OWN WINDOW, 0.66 -> 0.76, RATHER THAN SHARING THE FOLD'S. Sharing the fold's
         0.75 + 0.25 did remove the one-frame cut, but it merged two beats: at matched edition progress
         the phone showed the full undimmed field where the approved build showed one bright gold US
         column against a dimmed red field, because solo was still 0 where the snapshot had it at 1.
         Its own window keeps the beat where the snapshot put it (the snapshot cut at 0.74; this ramp's
         midpoint is 0.71, which is also where captionFor flips to 'solo' at edition 0.70) and still
         spreads the dimming over ~158px instead of 19px — about 0.17 of solo per frame at the fastest
         touch velocity in the matrix, against 1.00 before. It finishes 0.01 after the fold's formation
         tween starts, so the field is already the United States when the ruler begins to fold, exactly
         as it was. power1.inOut so it starts and ends gently rather than stepping on its first frame. */
      FT(tlEd, { solo: 0 }, { solo: 1, duration: 0.10, ease: 'power1.inOut' }, 0.66);
      FT(tlEd, { formation: 2 }, { formation: 3, duration: 0.25, ease: 'none' }, 0.75);
      // ease power2.inOut -> power1.inOut: the same change the desktop fold took, for the same reason
      // and never applied here. This is the phone's largest camera move and power2's 2.0x peak
      // derivative read as five consecutive camera-jumps at y2117-2170 on touch-390 (cam up to 0.056
      // against a local median of 0.0001). power1's peak is 1.57x. Both poses are unchanged.
      FT(tlEd, { orbit: 0, elev: 0, fitW: CAM_PAN.fitW, fitH: CAM_PAN.fitH, tx: CAM_PAN.tx, ty: 0, tz: 0, usPent: 0, arms: 0 },
              { orbit: 0.2, elev: 0.04, fitW: 7.4, fitH: 8.2, tx: 0, ty: 0.15, tz: SOLO_Z, usPent: 1, arms: 0.6, duration: 0.25, ease: 'power1.inOut' }, 0.75);
    }


    // 3. The framework: A front-on labels -> B orbit to side view (CF thin, DS fat) ->
    //    C the United States pulled to the front -> D the two rings -> E dissolve.
    // THE EXIT HOLD BAND. The sticky stage releases when .act-dims' bottom reaches the viewport bottom,
    // which is exactly where 'bottom bottom' put the timeline's end — so the stage began scrolling away
    // on the same pixel the dissolve was still finishing, and under scrub (which lags the pointer) every
    // fast scroller saw the stage leave mid-dissolve: baseline exit.dissolve flick 0.695, touch-768 0.700,
    // gesture 0.740, wheel 0.846, trackpad 0.926.
    // 'bottom bottom+=N' fires the end EARLIER (the trigger's bottom only has to reach N px BELOW the
    // viewport bottom), so the timeline now completes 0.6 of a viewport before the release. The css
    // .act-dims rule adds that same 0.6 viewport (300 -> 360svh) back onto the section, so the scroll
    // length is unchanged and no beat is compressed; the band is pure margin after the dissolve.
    // isMobile is NOT tidiness: at <=767px css gives .act-dims min-height 0 and the stage is a 25svh
    // band, which already leaves a ~545px hold (measured at 375x812), and the phone reaches
    // exit.dissolve 1.000 without help. Applying the band there steals that hold from the beats
    // themselves — measured: the D-C solo beat collapsing from 75 frames to 14.
    var tlDims = gsap.timeline({ scrollTrigger: { trigger: '.act-dims', start: 'top 70%',
      // THE BAND IS SIZED TO THE WORST MEASURED SCRUB LAG WITH A FACTOR OF ABOUT TWO, and every pixel
      // of it is a black screen: once the dissolve completes the field is gone, the caption is off and
      // the .dims column has scrolled by. So it is as small as it can be and no smaller — which is the
      // correction. It was 0.6 of a viewport (580px, 4.7s of nothing on a trackpad), then 0.15, then
      // 0.08; 0.08 was sized against the worst lag EXACTLY, with no factor, and the verification round
      // caught what that costs: touch-768 returned exit.dissolve 0.996 on one of three fresh runs and
      // 1.000 with 0px of margin on the other two, and 1280x800 under --cpu=4 completed the dissolve
      // just 29px before the sticky stage released. A 1.000 at 0px of margin is a coin flip, not a pass.
      // The budget is band + the dissolve's 2% pad; the bill is maxScrubLagInFinale x the timeline:
      //   desktop 0.14 vh = 126px at 900 + 51px pad = 177px against 0.039 x 2538 = 99px
      //   1280x800         112px          + 45px     = 157px against 0.039 x 2256 = 88px
      //   touch   0.20 vh = 205px at 1024 + 57px     = 262px against 0.043 x 2826 = 122px
      // Touch is separate because touch-768 is the only profile in the matrix that measures 0.043, and
      // it is a tablet, where a taller band costs proportionally less of the screen.
      // Keep in step with the css .act-dims rule: the band is subtracted from the timeline's own
      // length, so the section carries it as well as the 4.4% the re-spacing needs — 312vh / 326svh.
      // SVH IS FEATURE-DETECTED because the two halves are otherwise coupled only by comments: the css
      // writes `min-height: 300vh; min-height: 308svh`, so an engine without svh would keep the section
      // at 300vh while this end reached 0.08 viewport past it — the timeline would end after the sticky
      // release and the dissolve would be cut again, the exact defect the band exists to fix. No band
      // there is the safe direction: it is the snapshot's own geometry.
      // isMobile is read live, not from the one-shot at the top of the file: this end is a function and
      // re-runs on every refresh, so a desktop window dragged below 767px would otherwise keep
      // subtracting a band from a section the mobile css has already collapsed.
      end: function () { return (!svhOK || window.matchMedia('(max-width: 767px)').matches) ? 'bottom bottom' : 'bottom bottom+=' + Math.round(window.innerHeight * (isTouch ? 0.20 : 0.14)); },
      scrub: scrub, invalidateOnRefresh: true, refreshPriority: 1,
      onUpdate: function (st) {
        var p = st.progress; S.dims = p; wake();
        // The active dimension follows the beat the reader is in (the .dims column is sticky, so
        // per-element triggers would not track what is on screen): A = 01, B = 02, C = 03/04, D = 05.
        // READ FROM BEAT, like captionFor, so the lit card cannot drift away from the beat it names.
        //   0.06  inside the prism beat, where 01 takes over from "no dimension yet" (unchanged)
        //   BEAT.side   01 -> 02, the side view
        //   BEAT.cross  02 -> 03, the side->solo crossfade
        //   0.60  THE SNAPSHOT'S OWN VALUE, and a literal on purpose: it is not a beat start, it is the
        //         03/04 split inside the solo beat, and what it controls is how long 03's arm value is
        //         lit (that needs solo > 0.5 AND activeDim === 2). solo crosses 0.5 at 0.5275 here
        //         against the snapshot's 0.525, so 0.60 gives 03 the same 0.07 window the snapshot gave
        //         it, and leaves 04 the 0.155 that ends at the contraction against the snapshot's 0.16.
        //   BEAT.contract  04 -> 05: 05 Directed Intelligence is the contraction's own card
        var d = p < 0.06 ? -1 : p < BEAT.side ? 0 : p < BEAT.cross ? 1 : p < 0.60 ? 2 : p < BEAT.contract ? 3 : 4;
        if (d !== S.activeDim) { S.activeDim = d; setActive(d); }
      } } });
    // (the camera targets the middle of the 50-layer stack, z = -1.6; the front layers sit 2.3 units nearer
    //  and are magnified ~1.15x by perspective, so the prism is framed a little wider than it looks on paper)
    var CAM_PRISM = { orbit: 0, elev: 0.05, roll: 0, fitW: 8.4, fitH: 12.4, tx: 0, ty: 0, tz: LAYER_MID, shift: 0.44 };
    // Side view: roll 72 deg puts the Capital Formation ridge at the top of the prism and Data
    // Sovereignty at the bottom, so the silhouette's two edges ARE the two means; the near-profile orbit
    // keeps a sliver of the front face so the stack still reads as fifty layers.
    var CAM_SIDE = { orbit: -84 * DEG, elev: 0.16, roll: 72 * DEG, fitW: 9.8, fitH: 11, tx: 0, ty: 0.2, tz: LAYER_MID, shift: 0.45 };
    var CAM_SOLO = { orbit: 0.26, elev: 0.04, roll: 0, fitW: 7.6, fitH: 9.4, tx: 0, ty: 0.35, tz: SOLO_Z, shift: 0.4 };
    if (!isMobile) {
      /* THE TWO SIDE-VIEW MOVES ARE SPLIT IN TWO TWEENS EACH, ROLL SEPARATELY FROM THE REST.
         CAM_SIDE composes an 84-degree orbit with a 72-degree roll. Run over identical windows with
         identical easing, their peak angular rates land on the same frames and ADD: about 110 degrees
         of apparent rotation going in and about 170 coming out, ~0.32 deg per pixel of scroll at the
         peak, which a flick crosses at over 100px per frame. Offsetting the roll window from the orbit
         window puts the two peaks on different frames -- roll in 0.16-0.41 against orbit in 0.22-0.45,
         roll out 0.46-0.70 against orbit out 0.46-0.74 -- while the end poses, CAM_PRISM -> CAM_SIDE ->
         CAM_SOLO, are untouched and still read from the same constants, so the composed pose at the end
         of each move is identical to before.
         noRoll() splits the constant rather than restating its numbers, so the two halves cannot drift
         apart from the pose they came from. The roll windows never overlap (in ends 0.40, out starts
         0.44), so nothing ever writes S.roll twice in one frame; see the dwell note below.
         THE TWO PEAK OFFSETS ARE THE POINT AND THEY ARE PRESERVED EXACTLY: both curves are easeInOut,
         so each peaks at its own midpoint. Going in, roll peaks at 0.275 and the orbit at 0.325; coming
         out, roll at 0.53 and the orbit at 0.55. Those are the same 0.05 and 0.02 separations the
         previous spacing had. Any future re-spacing has to carry them. */
      var noRoll = function (c) { var o = {}; for (var k in c) if (k !== 'roll') o[k] = c[k]; return o; };
      /* THE ROLL GETS A DWELL AT THE TOP, 0.41 -> 0.46, AND IT IS LOAD-BEARING. The roll is the only
         camera property that turns around: it climbs to 72 degrees for the side view and unwinds to 0
         for the solo. expo.inOut used to hide that turn because it is almost perfectly flat at its ends,
         so the frames either side of the peak were identical; power1.inOut is not, and with the in- and
         out-tweens butted together the harness correctly reported a camera direction REVERSAL in D-C solo
         on every flick run. A flick advances at most 0.0095 of this timeline per frame (measured), so a
         0.05 dwell is ~5 frames of the camera genuinely holding the side pose -- which the side view,
         the one beat that had no camera hold at all, wanted anyway. Keep any future dwell above ~0.03.
         The dwell is 0.40 -> 0.44 and is aligned with the `side` scalar, which reaches 1 at 0.40 and
         holds to 0.43. */
      FT(tlDims, { roll: CAM_PRISM.roll }, { roll: CAM_SIDE.roll, duration: 0.25, ease: 'power1.inOut' }, 0.15);
      // 0.21 + 0.23 = 0.44, which is 0.01 PAST the side->solo camera move's start at BEAT.cross. The
      // overlap is deliberate and it is the same 0.01 the previous spacing had: over it both tweens
      // write the same pose to within 0.0003 of the move (power2.inOut is at 0.9997 by 0.43 going in,
      // and at 0.0003 by 0.44 coming out), i.e. 0.03 of a degree on an 84-degree orbit. Rendering
      // order (insertion order) makes the out-tween the writer, so there is no step at the handover.
      // Do not widen it: at 0.02 the residual is eight times larger and would be a real discontinuity.
      FT(tlDims, noRoll(CAM_PRISM), Object.assign({ duration: 0.23, ease: 'power2.inOut' }, noRoll(CAM_SIDE)), 0.21);
      /* THE FINALE RAMPS ARE WIDENED INTO THE SCROLL THE HOLD BAND FREED. The dashed-ring beat was 145px
         of scroll against 607px for the side view and 606px for the solo: the baseline flick run spent
         8 frames -- 133ms -- on the entire set-up for the imbalance-penalty point. They are also eased
         now rather than linear, because halving the scrub above makes the scene track a fast scroll more
         tightly, and a linear opacity ramp crossed at 100px/frame produces a visible step.
         Every value, and the order of the beats, is exactly as it was. Only the spans change. */
      // 0.22/0.12 -> 0.20/0.22. It starts on the caption boundary now, so the copy and the scene change
      // together, and the extra span cuts its peak per-frame change by a quarter -- that peak was the
      // five-in-a-row scene-jump at y2918-2966 on the baseline flick, which this width takes to zero.
      // WHAT THE WIDER RAMP COSTS, because it is not free and nothing else records it: the five arm
      // labels are shown while side < 0.5, so widening side-in from 0.12 to 0.22 of the timeline moves
      // the arm-label -> ridge-label handover from timeline 0.28 to 0.31, about 73px of scroll later.
      // Same labels, same order, same text; only the moment they swap. Anyone diffing a pose sheet
      // against the frozen snapshot at a matched dims progress will see it and should not read it as
      // an accidental content change.
      FT(tlDims, { side: 0 }, { side: 1, duration: 0.21, ease: 'power1.inOut' }, BEAT.side);
      // side-out and solo-in start on the SAME position (0.45 -> 0.44) and cross at the same place they
      // always did. Keeping them together matters: the five arm labels are shown while side < 0.5 AND
      // solo < 0.5, so pulling one ramp ahead of the other would widen the window in which they briefly
      // reappear mid-crossfade. At these spans that window is 0.025 of the timeline, exactly as before.
      FT(tlDims, { side: 1 }, { side: 0, duration: 0.145, ease: 'power1.inOut' }, BEAT.cross);
      FT(tlDims, { solo: 0, usPent: 0 }, { solo: 1, usPent: 1, duration: 0.195, ease: 'power1.inOut' }, BEAT.cross);
      /* THE SOLO CAMERA MOVE ENDS WHERE THE DASHED RING BEGINS, AND THAT ORDERING IS THE BEAT.
         In the frozen snapshot the camera's last movement and the ring's first visible frame are the
         SAME frame on every profile (trackpad 0.710/0.710, wheel 0.723/0.726, flick 0.752/0.752): the
         camera arrives, the pentagon holds still, and only then are the rings drawn on it. The previous
         spacing ran the camera to 0.74 while the ring started at 0.62, so the whole ring beat played
         while the pentagon was still swinging into place — measured 33.2 degrees of orbit INSIDE the
         ring window on a trackpad against the snapshot's 0.1, a 6.98-degree single-frame step on
         flick-1920, 15.06 degrees on touch-768, and a ring-beat camera-jump on every fast-scroll
         configuration in the matrix. Ending at BEAT.ring restores the sequence.
         IT STARTS ON BEAT.cross AND KEEPS THE SNAPSHOT'S OWN SPAN IN SCROLL PIXELS: the snapshot began
         this move on the crossfade too, and 0.24 of a timeline 4.4% longer is 0.2507 of the
         snapshot's — its 0.25, to within a pixel. It was tried at 0.22 starting 0.02 later, and the
         measurement said no: an 18% shorter span put a run of five camera-jumps into D-C solo on
         flick, nine on cpu4-flick and three on stopgo, at dims 0.60-0.65 where the move should be
         settling. Keeping the span is what keeps the per-pixel rate the reader actually feels.
         power2.inOut reaches 99% after 86.4% of its span, so the camera is at the solo pose by dims
         0.637 — 0.033 of the timeline (84px) before the ring starts, and then locked for the whole
         216px of the ring beat: 300px of settled pentagon before the contraction, against the
         snapshot's 189px.
         THE EASE STAYS power2.inOut ON BOTH ORBIT GROUPS, and power1.inOut was tried and measured.
         power1's lower peak did not reduce the flick hitch count (8 / 9 / 1 against 5 / 9 / 11) and it
         cost THREE camera direction reversals on every run: the roll is the only camera property that
         turns around, and with the orbit on the same curve family the two no longer hide each other at
         the dwell. Reversals are a hard zero. Do not re-try without re-reading the dwell note above. */
      FT(tlDims, { roll: CAM_SIDE.roll }, { roll: CAM_SOLO.roll, duration: 0.18, ease: 'power1.inOut' }, 0.44);
      FT(tlDims, noRoll(CAM_SIDE), Object.assign({ duration: 0.24, ease: 'power2.inOut' }, noRoll(CAM_SOLO)), BEAT.cross);
      // THE DASHED RING GETS ITS OWN BEAT BACK, AND THE RING/CONTRACTION OVERLAP GOES. The snapshot drew
      // it over 0.70-0.76 and began the contraction at 0.76: two clean beats, but only 146px of scroll
      // for the first — 8 frames on a flick for the whole set-up of the imbalance-penalty point.
      // It now runs BEAT.ring -> BEAT.contract, 0.085 of a 4.4% longer timeline: 216px against the
      // snapshot's 146px, 48% more. What pays for it is the extra length in .act-dims, NOT the solo
      // hold — the previous attempt took 169px off the end of the solo beat (the comment here claimed
      // 97px; measured, it was 169) and cost the United States beat half its frames on a flick, 83
      // down to 37. Every other beat in the finale is now within about 1% of the snapshot's own scroll
      // distance. captionFor's 'rings' boundary and the harness's window both read BEAT.ring.
      FT(tlDims, { ringDash: 0 }, { ringDash: 1, duration: 0.085, ease: 'none' }, BEAT.ring);
      /* The contraction runs BEAT.contract -> BEAT.dissolve, and it must still finish exactly where the
         dissolve begins. Overlapping the two would have the ring still contracting
         while the field dissolves, which is a different beat from the one the caption describes.
         EASE power2.inOut -> power1.inOut, measured at both ends of the speed range. ringScale is the
         only scene value moving in this beat, so the harness's scene-delta is its derivative alone: at
         flick speed power2's 2.0x peak put three scene-jumps in a 16-frame beat, and power1's 1.57x
         keeps every frame under the detector's threshold. At the other extreme power2's tail is so flat
         that the last ~0.7% of the beat fell below the recorder's precision, leaving one frame in which
         nothing moved before the dissolve began — a stall-catchup at y4233 on slow trackpad runs. Both
         endpoints are unchanged. */
      FT(tlDims, { ringScale: 1, ringSolid: 0, pulse: 0 }, { ringScale: US_COMPOSITE / US_ARITHMETIC_APPROX, ringSolid: 1, pulse: 1, duration: 0.11, ease: 'power1.inOut' }, BEAT.contract);
      // The dissolve used to land ON the timeline's last frame (0.88 + 0.12 = 1.0), so it only ever
      // completed if the scrub caught up EXACTLY at the end — which under a lagging scrub it never
      // quite does. It now finishes at 98% of the timeline, leaving the last 2% plus the hold band
      // above as margin. ease stays 'none': an eased tail leaves a residual fraction behind.
      // IT KEEPS ITS FULL SCROLL LENGTH — 292px at 1440x900, exactly the snapshot's — because 0.115 of
      // a timeline 4.4% longer is the snapshot's own 0.12. The
      // first attempt bought the 2% by cutting the duration to 0.10 instead, and that shortened the
      // closing gesture of the whole act by a third: measured 170 -> 106 frames on trackpad and
      // 108 -> 63 on a flick, with the peak per-frame dissolve rate up 53%. Shortening the beat is
      // not what "let people experience the full thing" asks for; taking the 2% from the position is.
      FT(tlDims, { dissolve: 0 }, { dissolve: 1, duration: 0.115, ease: 'none' }, BEAT.dissolve);
      /* The padding tween is what actually BUYS that 2%. A gsap timeline's progress is normalised over
         its real duration, so simply ending the dissolve at 0.98 would have made 0.98 the new 1.0 and
         changed nothing (measured: dissolve still 0.993 at progress 0.999). This empty 0.02 tween holds
         the duration at 1.0 so the dissolve genuinely completes before the timeline does.
         IT IS EMPTY ON PURPOSE AND THE ALTERNATIVE WAS MEASURED. Because nothing in S moves across it,
         the back run reports exactly one stall-catchup where the reader crosses out of it into the
         dissolve (y4448, on a screen that is already black). Carrying the dissolve's last thousandth
         across the 2% instead does remove that hitch — and puts TWELVE scene-jumps into the flick run's
         dissolve, because the tail moves 1/150th as fast as the beat and the detector's median window
         mixes the two. One artefact on one profile is the cheaper of the two; do not re-try it without
         re-running flick. */
      tlDims.to({}, { duration: 0.02 }, 0.98);
    } else {
      /* THE PHONE FINALE, RE-EASED AND RE-SPACED. No new or removed beats and no change to any pose.
       - contraction ease power2.inOut -> power1.inOut, exactly the desktop change: ringScale is the only
         value moving in that beat, so its derivative IS the harness's scene delta, and power2's 2.0x
         peak is what put scene-jumps in an 8-frame beat.
       - the dissolve gets 0.18 of the timeline instead of 0.12 and starts at 0.80 instead of 0.88. The
         mobile dims timeline is 1893px, so 0.12 was 227px — four touch frames, measured at 0.11-0.13 of
         the dissolve PER FRAME: the field did not dissolve, it vanished. 0.18 is 341px, and starting at
         0.80 also means more of it plays while the trigger is still moving rather than as a scrub tail.
       - and the same 2% padding tween the desktop branch uses, so the dissolve completes at 98% of the
         timeline rather than on its last frame. The phone reached exit.dissolve 1.000 without it only
         because the mobile layout leaves a large natural hold; this makes it deterministic. */
      FT(tlDims, { ringDash: 0 }, { ringDash: 1, duration: 0.1, ease: 'none' }, 0.45);
      FT(tlDims, { ringScale: 1, ringSolid: 0, pulse: 0 }, { ringScale: US_COMPOSITE / US_ARITHMETIC_APPROX, ringSolid: 1, pulse: 1, duration: 0.2, ease: 'power1.inOut' }, 0.55);
      FT(tlDims, { dissolve: 0 }, { dissolve: 1, duration: 0.18, ease: 'none' }, 0.80);
      tlDims.to({}, { duration: 0.02 }, 0.98);   // see the desktop note: empty on purpose
    }
    var dimEls = document.querySelectorAll('.act-dims .dim');
    function setActive(i) { dimEls.forEach(function (d, j) { d.classList.toggle('is-active', i === j); }); }
    // Wordmark inner square fills with Act I progress (UI state, not data).
    // This used to be written on document.documentElement. An unregistered custom property on the root
    // is inherited by every element, so each scroll frame invalidated the style of the whole document:
    // measured at 1.72ms per style recalculation against 0.24ms once the write is scoped, with the
    // recalculation COUNT unchanged — the same work, over two spans instead of the page. The only
    // consumers are the two .wordmark__mark spans (css:39, masthead + footer); :root { --wm-fill: 1 }
    // at css:14 stays as the default for the other pages and the JS-off / reduced-motion paths.
    var wmEls = Array.prototype.slice.call(document.querySelectorAll('.wordmark__mark'));
    var wmLast = '';
    function setWmFill(v) {
      if (v === wmLast) return;   // scrub asks for the same rounded value on many consecutive frames
      wmLast = v;
      for (var wi = 0; wi < wmEls.length; wi++) wmEls[wi].style.setProperty('--wm-fill', v);
    }
    ScrollTrigger.create({ trigger: act1, start: 'top top', end: 'bottom bottom',
      onUpdate: function (st) { setWmFill((0.2 + 0.8 * st.progress).toFixed(3)); },
      onLeave: function () { setWmFill('1'); },
      onLeaveBack: function () { setWmFill('0.2'); } });
    SAPI.fieldTl = { hero: tlHero, ed: tlEd, dims: tlDims };   // debug handle for QA
    /* WHERE THE BEATS ARE, published for the measurement harness — read straight out of BEAT, which is
       what the tweens above are positioned from, so this can no longer drift from them (it did: the
       last round's published ring window and its own ringDash tween were 0.05 apart). The harness used
       to hard-code the frozen snapshot's values (0.2 / 0.45 / 0.7 / 0.76 / 0.88) and so counted frames
       in windows the beats had moved out of; it can also be told to use those on the command line, so
       any per-beat number can be reported in both window sets. `fold` is the sE at which the ruler
       furniture is killed, which is the edition/fold split and has never moved.
       MOBILE PUBLISHES NOTHING ON PURPOSE: the phone's dims timeline has no prism, side or solo
       tweens at all (the fold goes straight to the solo pentagon), so there is nothing for those
       three windows to track, and letting the harness fall back keeps every mobile run comparable
       with runs/before. */
    if (!isMobile) SAPI.fieldBeats = { dims: [BEAT.side, BEAT.cross, BEAT.ring, BEAT.contract, BEAT.dissolve], fold: 0.72 };
    SAPI.disposers.push(function () { ScrollTrigger.killAll(); });

    /* ---------------- landing on a coherent frame ----------------
       A scrub is a TWEEN towards the target progress, not the progress itself: exactly what makes a
       scroll feel smooth, and exactly what goes wrong when the position changes without a scroll — a
       refresh, a bfcache restore, a reload part-way down, an anchor or a find-in-page landing. The
       target steps from 0 to 0.55 in one frame and the scrub then plays half of Act I at ~60x scroll
       speed while the page stands perfectly still. Measured on the untouched build
       (runs/before/jump-1440r): 20 hitches at two FIXED scroll positions, per-frame camera deltas up to
       109x the median. settleScrub() ends that catch-up: complete the scrub tween, set each timeline to
       its trigger's own progress, draw once. It is only ever called when the position was not produced
       by scrolling, so it can never shorten a real scrub. */
    function settleScrub() {
      if (!tlDims) return;   // reduced-motion / no-gsap paths never build the timelines
      var tls = [tlHero, tlEd, tlDims], i;
      /* Finish any in-flight scrub tween FIRST, on all three, before anything is written: gsap's next
         tick would otherwise pull the timeline back towards the value it was heading for before the
         position jumped, undoing the landing one frame later. */
      for (i = 0; i < tls.length; i++) {
        var st0 = tls[i] && tls[i].scrollTrigger, tw = st0 && st0.getTween && st0.getTween();
        if (tw) { try { tw.progress(1); } catch (e) {} }
      }
      /* RESTORE THE PRE-ACT POSE, THEN REPLAY FORWARD TO THE TARGET. Setting each timeline's progress
         in place is not enough — see ZERO above — because a tween the playhead does not cross is never
         re-rendered. From ZERO, the forward pass writes every key whose tween starts at or before the
         landing position and leaves the rest on their own from-values, which is the pose a reader
         would have reached by scrolling there. The order is hero -> edition -> dims, the same order
         refreshPriority gives them, so where two timelines write the same camera key the later act
         wins. Both renders happen inside one JS turn, before the frame is painted: nothing flickers. */
      for (var zk in ZERO) S[zk] = ZERO[zk];
      for (i = 0; i < tls.length; i++) {
        var t = tls[i], st = t && t.scrollTrigger;
        if (!st) continue;
        var p = st.progress;
        /* invalidate() BEFORE the rewind, and it is load-bearing. Without it the rewind-and-replay
           pair, run inside one JS turn, leaves every tween the playhead crosses at ratio 1 rather than
           at its real ratio (probed: roll 1.2566 = the full 72-degree side roll at dims 0.20, where it
           should be 0.0643) — gsap collapses the two moves and re-renders the children from a state it
           has already recorded. invalidate() drops those recorded values; every tween here is a fromTo
           with explicit numbers (see FT), so re-recording them is deterministic and free. */
        try { t.invalidate(); } catch (e) {}
        t.progress(0, true);   // a real move of the playhead, so the forward pass cannot short-circuit
        t.progress(p);
      }
      // the timeline has just been re-played forward to the target, so the next frame's forced dims
      // render (see draw) starts from a known-good state rather than inheriting a stale high water mark
      lastDimsT = -1; dimsFwdOK = false;
      // the loop may be idle (Act I over, or the stage off screen); the settled pose has to be painted
      if (S.dissolve < 0.999) { wake(); if (running) draw(performance.now()); }
    }
    SAPI.fieldSettle = settleScrub;   // debug handle for QA, beside SAPI.fieldTl; the page never calls it

    /* A bfcache restore (back/forward on this page) replays the old scroll position with no scroll
       event of its own, so the scrubs would catch up as motion. One frame later everything is laid out;
       settle there. */
    window.addEventListener('pageshow', function (e) { if (e.persisted) requestAnimationFrame(settleScrub); });

    /* A TELEPORT: the scroll position moved further between two consecutive scroll events than any
       input device can move it — a reload's scroll restoration, an anchor jump, find-in-page, a screen
       reader jump, a programmatic scrollTo. (pageshow and the boot hook cover arrivals with no scroll
       event at all.) THE THRESHOLD IS MEASURED: scroll events fire once per frame while a scroll is
       happening, so the delta between two IS the per-frame velocity, and the largest anywhere in the
       run matrix is 194px (stopgo's own programmatic scrollTo; flick peaks at 31, trackpad 5, touch
       54). Half a viewport is 405px at 1440x900, more than twice the fastest thing ever recorded.
       IT SETTLES SYNCHRONOUSLY, in the scroll event, which runs before that frame's rAF callbacks and
       so before gsap's tick: there is no in-between frame in which the scrub plays part of the journey.
       It does not fight motion.js's keyboard handler — a PageDown's largest step is 145px, well under
       the threshold — but it DOES fire on Home and End, where settling is the right answer anyway.
       The second, deferred settle is for Lenis, whose animatedScroll can land a frame behind
       window.scrollY after an immediate scrollTo; it only runs if the page is genuinely standing still. */
    var watchY = window.scrollY;
    function onTeleportScroll() {
      var y = window.scrollY;
      if (Math.abs(y - watchY) > window.innerHeight * 0.45) {
        settleScrub();
        var y0 = y;
        requestAnimationFrame(function () { if (Math.abs(window.scrollY - y0) < 8) settleScrub(); });
      }
      watchY = y;
    }
    window.addEventListener('scroll', onTeleportScroll, { passive: true });
    /* The three window listeners this file adds are detached with everything else. Until now only the
       GL objects, the loop and the observer were disposed, so a mid-page "Reduce motion" (or the
       pagehide path) left a resize handler that still resized a disposed renderer and two scroll
       handlers that still ran on every scroll for the rest of the visit. */
    SAPI.disposers.push(function () {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('scroll', onTopScroll);
      window.removeEventListener('scroll', onTeleportScroll);
      clearTimeout(resizeT);
    });

    ScrollTrigger.refresh();

    /* A READER WHO RELOADS PART-WAY DOWN, OR FOLLOWS A LINK INTO THE MIDDLE OF THE PAGE.
       (a) The 1.4s dust assembly is unconditional at boot: S.load ramps 0 -> 1 on the wall clock and
       the shader is fed uFormation = S.formation * S.load. The refresh above has just set S.formation
       to 3 for a scroll restored into the framework act, so uFormation would sweep 0 -> 3 for 1.4
       seconds — replaying dust, sphere, ruler, prism — while every other value in S is already at its
       finale value: the rings drawn, the pentagon up, the caption right, and the particles arriving
       from nowhere behind them. Past the hero trigger's end there is no hero left to play, so the
       scene starts settled. A top-of-page load is untouched and still gets the full assembly.
       (b) And settle the scrubs, for the same reason as a teleport: the restored position is a step
       change in target progress that nobody scrolled. */
    var heroSt = tlHero.scrollTrigger;
    if (heroSt && window.scrollY > heroSt.end) { S.load = 1; loadT0 = -1; }
    if (window.scrollY > 4) requestAnimationFrame(settleScrub);
  }
}());
