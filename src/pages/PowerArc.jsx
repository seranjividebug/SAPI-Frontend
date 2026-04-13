import { useState, useRef, useEffect, useCallback } from "react";

// Global ResizeObserver error handler to prevent console spam
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    return;
  }
  console.error(e);
};

window.addEventListener('error', resizeObserverErrorHandler);

// Debounce utility to prevent rapid successive calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const nations = [
  // ── Original 16 nations ──────────────────────────────────────────────────
  { code:"UZ", name:"Uzbekistan",     zone:"Dormant",   sx:52.4, vy:39.4, accel:"steady",       arcDelta:-8,
    scores:{compute:29.8,capital:31.8,regulatory:45.4,data:50.8,di:41.0}, sapi:34.6 },
  { code:"NG", name:"Nigeria",        zone:"Tethered",  sx:30.6, vy:36.5, accel:"steady",       arcDelta:-4,
    scores:{compute:9.6, capital:40.5,regulatory:40.0,data:37.5,di:29.0}, sapi:26.2 },
  { code:"NO", name:"Norway",         zone:"Directing", sx:58.5, vy:51.1, accel:"accelerating", arcDelta:+5,
    scores:{compute:36.2,capital:48.6,regulatory:56.4,data:53.8,di:48.3}, sapi:43.5 },
  { code:"OM", name:"Oman",           zone:"Directing", sx:55.4, vy:52.4, accel:"accelerating", arcDelta:+6,
    scores:{compute:31.4,capital:46.3,regulatory:53.3,data:53.8,di:57.5}, sapi:43.6 },
  { code:"QA", name:"Qatar",          zone:"Dormant",   sx:53.7, vy:46.1, accel:"accelerating", arcDelta:-2,
    scores:{compute:31.8,capital:43.5,regulatory:47.1,data:50.8,di:47.8}, sapi:39.6 },
  { code:"RW", name:"Rwanda",         zone:"Tethered",  sx:44.6, vy:38.2, accel:"accelerating", arcDelta:+3,
    scores:{compute:23.6,capital:19.7,regulatory:42.4,data:45.0,di:52.5}, sapi:33.2 },
  { code:"SA", name:"Saudi Arabia",   zone:"Directing", sx:62.0, vy:56.8, accel:"accelerating", arcDelta:+8,
    scores:{compute:33.7,capital:50.7,regulatory:63.6,data:61.7,di:56.1}, sapi:46.9 },
  { code:"SG", name:"Singapore",      zone:"Directing", sx:81.6, vy:64.3, accel:"accelerating", arcDelta:+14,
    scores:{compute:65.8,capital:60.8,regulatory:69.4,data:59.7,di:62.7}, sapi:57.3 },
  { code:"ZA", name:"South Africa",   zone:"Tethered",  sx:45.8, vy:25.1, accel:"stalling",     arcDelta:-18,
    scores:{compute:28.2,capital:13.3,regulatory:27.1,data:42.2,di:35.0}, sapi:23.4 },
  { code:"CH", name:"Switzerland",    zone:"Dormant",   sx:62.7, vy:38.4, accel:"steady",       arcDelta:-14,
    scores:{compute:46.0,capital:24.3,regulatory:47.4,data:50.5,di:43.5}, sapi:35.6 },
  { code:"TJ", name:"Tajikistan",     zone:"Tethered",  sx:11.7, vy:25.7, accel:"accelerating", arcDelta:+5,
    scores:{compute:1.0, capital:19.0,regulatory:24.9,data:17.0,di:33.2}, sapi:11.7 },
  { code:"TR", name:"Turkiye",        zone:"Tethered",  sx:45.8, vy:30.6, accel:"steady",       arcDelta:-10,
    scores:{compute:22.4,capital:22.0,regulatory:39.4,data:48.0,di:30.5}, sapi:29.3 },
  { code:"TM", name:"Turkmenistan",   zone:"Tethered",  sx:10.7, vy:12.2, accel:"steady",       arcDelta:-8,
    scores:{compute:1.0, capital:10.0,regulatory:11.3,data:15.5,di:15.3}, sapi:7.5 },
  { code:"AE", name:"UAE",            zone:"Directing", sx:71.2, vy:61.5, accel:"accelerating", arcDelta:+12,
    scores:{compute:49.8,capital:61.3,regulatory:60.6,data:59.7,di:62.7}, sapi:53.4 },
  { code:"GB", name:"United Kingdom", zone:"Directing", sx:56.1, vy:53.7, accel:"accelerating", arcDelta:+5,
    scores:{compute:33.8,capital:40.1,regulatory:70.9,data:52.5,di:50.0}, sapi:47.5 },
  { code:"US", name:"United States",  zone:"Directing", sx:89.9, vy:51.7, accel:"stalling",     arcDelta:-22,
    scores:{compute:79.6,capital:49.2,regulatory:58.0,data:58.7,di:48.0}, sapi:56.1 },

  // ── 10 New nations (from SAPI Assessment Files) ──────────────────────────
  { code:"AZ", name:"Azerbaijan",     zone:"Tethered",  sx:36.5, vy:29.9, accel:"stalling",     arcDelta:-6,
    scores:{compute:29.6,capital:21.2,regulatory:38.1,data:43.3,di:21.7}, sapi:27.5 },
  { code:"BH", name:"Bahrain",        zone:"Surging",   sx:34.3, vy:54.5, accel:"steady",       arcDelta:+21,
    scores:{compute:16.1,capital:40.0,regulatory:52.9,data:52.5,di:56.2}, sapi:36.7 },
  { code:"CA", name:"Canada",         zone:"Surging",   sx:36.1, vy:50.9, accel:"steady",       arcDelta:+15,
    scores:{compute:30.0,capital:32.7,regulatory:57.6,data:42.2,di:44.2}, sapi:40.0 },
  { code:"EE", name:"Estonia",        zone:"Surging",   sx:42.2, vy:65.1, accel:"steady",       arcDelta:+20,
    scores:{compute:19.4,capital:34.0,regulatory:57.9,data:65.0,di:72.3}, sapi:41.3 },
  { code:"ET", name:"Ethiopia",       zone:"Tethered",  sx:31.8, vy:24.2, accel:"stalling",     arcDelta:-6,
    scores:{compute:23.6,capital:10.7,regulatory:23.6,data:40.0,di:24.8}, sapi:21.7 },
  { code:"FI", name:"Finland",        zone:"Surging",   sx:41.7, vy:67.1, accel:"steady",       arcDelta:+23,
    scores:{compute:29.2,capital:37.8,regulatory:66.4,data:54.2,di:67.8}, sapi:44.7 },
  { code:"FR", name:"France",         zone:"Directing", sx:52.8, vy:59.5, accel:"accelerating", arcDelta:-1,
    scores:{compute:38.0,capital:53.2,regulatory:63.6,data:67.5,di:55.3}, sapi:53.9 },
  { code:"DE", name:"Germany",        zone:"Directing", sx:53.8, vy:54.5, accel:"steady",       arcDelta:-8,
    scores:{compute:43.9,capital:37.9,regulatory:60.2,data:63.8,di:48.7}, sapi:44.0 },
  { code:"IQ", name:"Iraq",           zone:"Tethered",  sx:12.8, vy:16.6, accel:"stalling",     arcDelta:+1,
    scores:{compute:9.6, capital:9.2, regulatory:18.7,data:16.0,di:14.5}, sapi:13.0 },
  { code:"IT", name:"Italy",          zone:"Surging",   sx:44.6, vy:55.6, accel:"steady",       arcDelta:+7,
    scores:{compute:36.0,capital:40.8,regulatory:63.3,data:53.3,di:47.9}, sapi:42.5 },
];

const PAD = { l: 64, r: 24, t: 40, b: 56 };

function arcVy(sx) {
  const t = sx / 100;
  return 10 + 78 * (1 / (1 + Math.exp(-8 * (t - 0.45))));
}

function toScreen(sx, vy, W, H) {
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  return { x: PAD.l + (sx / 100) * pw, y: PAD.t + ph - (vy / 100) * ph };
}

function getNodeColor(arcDelta) {
  if (arcDelta > 5) return "#0F6E56";
  if (arcDelta < -5) return "#A32D2D";
  return "#5F5E5A";
}

function getAccelColor(accel) {
  if (accel === "accelerating") return "#B87E2A";
  if (accel === "stalling") return "#A32D2D";
  return "#888780";
}

function ArcCanvas({ highlight, scoreView, onTooltip }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const H = Math.round(W * 0.62);
    el.width = W * dpi; el.height = H * dpi; el.style.height = H + "px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const gridColor = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
    const axisColor = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)";
    const textColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
    const textPrimary = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
    const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
    c.clearRect(0, 0, W, H);

    [
      { label:"TETHERED",  x:0,  y:50, w:50, h:50, color:"#378ADD" },
      { label:"DORMANT",   x:0,  y:0,  w:50, h:50, color:"#888780" },
      { label:"SURGING",   x:50, y:50, w:50, h:50, color:"#BA7517" },
      { label:"DIRECTING", x:50, y:0,  w:50, h:50, color:"#1D9E75" },
    ].forEach(z => {
      c.fillStyle = z.color; c.globalAlpha = 0.045;
      c.fillRect(PAD.l + (z.x / 100) * pw, PAD.t + (z.y / 100) * ph, (z.w / 100) * pw, (z.h / 100) * ph);
      c.globalAlpha = 1; c.font = `500 10px sans-serif`; c.fillStyle = z.color; c.globalAlpha = 0.7; c.textAlign = "left";
      c.fillText(z.label, PAD.l + ((z.x + 2) / 100) * pw, PAD.t + ((z.y + z.h - 4) / 100) * ph); c.globalAlpha = 1;
    });

    for (let i = 0; i <= 10; i++) {
      c.strokeStyle = gridColor; c.lineWidth = 0.5;
      c.beginPath(); c.moveTo(PAD.l + (i/10)*pw, PAD.t); c.lineTo(PAD.l + (i/10)*pw, PAD.t+ph); c.stroke();
      c.beginPath(); c.moveTo(PAD.l, PAD.t + (i/10)*ph); c.lineTo(PAD.l+pw, PAD.t + (i/10)*ph); c.stroke();
    }
    c.strokeStyle = axisColor; c.lineWidth = 0.5; c.setLineDash([3,3]);
    c.beginPath(); c.moveTo(PAD.l+0.5*pw, PAD.t); c.lineTo(PAD.l+0.5*pw, PAD.t+ph); c.stroke();
    c.beginPath(); c.moveTo(PAD.l, PAD.t+0.5*ph); c.lineTo(PAD.l+pw, PAD.t+0.5*ph); c.stroke();
    c.setLineDash([]);

    c.beginPath();
    for (let sx = 0; sx <= 100; sx += 0.5) {
      const p = toScreen(sx, arcVy(sx), W, H);
      sx === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y);
    }
    c.strokeStyle = "#B87E2A"; c.lineWidth = 1.5; c.setLineDash([5,3]); c.globalAlpha = 0.6; c.stroke();
    c.setLineDash([]); c.globalAlpha = 1;

    const alp = toScreen(55, arcVy(55), W, H);
    c.save(); c.translate(alp.x - 10, alp.y - 22); c.rotate(-0.38);
    c.font = `400 9px sans-serif`; c.fillStyle = "#B87E2A"; c.globalAlpha = 0.8;
    c.fillText("Sovereign Power Arc (prescriptive)", 0, 0); c.globalAlpha = 1; c.restore();

    nations.forEach(n => {
      const dimmed = highlight !== "all" && highlight !== n.code;
      const alpha = dimmed ? 0.15 : 1;
      const pt = toScreen(scoreView === "velocity" ? 50 : n.sx, scoreView === "sovereignty" ? 50 : n.vy, W, H);
      const nodeColor = getNodeColor(n.arcDelta);

      if (!dimmed) {
        const arcPt = toScreen(n.sx, arcVy(n.sx), W, H);
        c.beginPath(); c.moveTo(pt.x, pt.y); c.lineTo(arcPt.x, arcPt.y);
        c.strokeStyle = nodeColor; c.lineWidth = 0.8; c.setLineDash([2,2]); c.globalAlpha = 0.5; c.stroke();
        c.setLineDash([]); c.globalAlpha = 1;
      }
      if (!dimmed && highlight !== "all") {
        c.beginPath(); c.arc(pt.x, pt.y, 24, 0, Math.PI*2);
        c.strokeStyle = nodeColor; c.lineWidth = 1; c.globalAlpha = 0.2; c.stroke(); c.globalAlpha = 1;
      }
      if (!dimmed) {
        c.beginPath(); c.arc(pt.x, pt.y, 21, 0, Math.PI*2);
        c.strokeStyle = getAccelColor(n.accel); c.lineWidth = 1.5;
        c.globalAlpha = n.accel === "stalling" ? 0.2 : 0.4; c.stroke(); c.globalAlpha = 1;
      }

      c.beginPath(); c.arc(pt.x, pt.y, 18, 0, Math.PI*2);
      c.fillStyle = nodeColor + "22"; c.globalAlpha = alpha; c.fill();
      c.strokeStyle = nodeColor; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;

      c.font = `500 9px sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = nodeColor; c.globalAlpha = alpha; c.fillText(n.code, pt.x, pt.y);
      c.font = `400 8px sans-serif`; c.fillStyle = textColor;
      c.fillText(n.name, pt.x, pt.y + 27); c.globalAlpha = 1;

      if (!dimmed) {
        const bx = pt.x + 16, by = pt.y - 16;
        const dStr = (n.arcDelta >= 0 ? "+" : "") + n.arcDelta;
        c.font = `500 9px sans-serif`;
        const bw = c.measureText(dStr).width + 8;
        c.fillStyle = nodeColor; c.globalAlpha = 0.9;
        c.beginPath(); c.roundRect(bx - bw/2, by - 7, bw, 13, 3); c.fill();
        c.globalAlpha = 1; c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(dStr, bx, by);
      }
    });

    c.strokeStyle = axisColor; c.lineWidth = 1;
    c.beginPath(); c.moveTo(PAD.l, PAD.t+ph); c.lineTo(PAD.l+pw+8, PAD.t+ph); c.stroke();
    c.beginPath(); c.moveTo(PAD.l, PAD.t+ph); c.lineTo(PAD.l, PAD.t-8); c.stroke();
    c.font = `400 10px sans-serif`; c.fillStyle = textColor;
    c.textAlign = "left"; c.textBaseline = "top"; c.fillText("Structurally Dependent", PAD.l, PAD.t+ph+8);
    c.textAlign = "right"; c.fillText("Strategically Autonomous →", PAD.l+pw, PAD.t+ph+8);
    c.save(); c.translate(14, PAD.t+ph); c.rotate(-Math.PI/2);
    c.textAlign = "left"; c.textBaseline = "middle"; c.fillText("Latent", 0, 0);
    c.textAlign = "right"; c.fillText("Kinetic ↑", ph, 0); c.restore();
    c.font = `500 13px sans-serif`; c.textAlign = "center"; c.textBaseline = "top";
    c.fillStyle = textPrimary; c.fillText("S.A.P.I. Power Arc — 26 Nations", W/2, 6);
    c.font = `400 10px sans-serif`; c.fillStyle = textColor;
    c.fillText("Sovereign AI Power Index · CoreIntel", W/2, 22);
  }, [highlight, scoreView]);

  useEffect(() => {
    const t = setTimeout(draw, 50);
    const debouncedDraw = debounce(() => {
      try {
        draw();
      } catch (error) {
        console.warn('ResizeObserver error in ArcCanvas:', error);
      }
    }, 100);
    const ro = new ResizeObserver(debouncedDraw);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [draw]);

  const handleMouseMove = useCallback((e) => {
    const el = canvasRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let found = null;
    nations.forEach(n => {
      const pt = toScreen(n.sx, n.vy, rect.width, rect.height);
      if (Math.sqrt((mx - pt.x)**2 + (my - pt.y)**2) < 22) found = n;
    });
    onTooltip(found, mx, my);
  }, [onTooltip]);

  return <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} onMouseMove={handleMouseMove} onMouseLeave={() => onTooltip(null)} />;
}

function DeltaCanvas() {
  const canvasRef = useRef(null);
  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const H = Math.max(560, nations.length * 28 + 70);
    el.width = W * dpi; el.height = H * dpi; el.style.height = H + "px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const textColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
    const textPrimary = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
    c.clearRect(0, 0, W, H);
    const sorted = [...nations].sort((a, b) => b.arcDelta - a.arcDelta);
    const barH = 18, barGap = 8, maxAbs = 25, midX = W / 2, startY = 52;
    c.font = `500 12px sans-serif`; c.textAlign = "center"; c.fillStyle = textPrimary;
    c.fillText("Execution Delta — performance vs prescriptive arc (26 nations)", W/2, 16);
    c.font = `400 10px sans-serif`; c.fillStyle = textColor;
    c.fillText("Positive = outperforming sovereign position · Negative = unrealised AI power", W/2, 32);
    c.strokeStyle = textColor; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(midX, startY - 8); c.lineTo(midX, startY + sorted.length*(barH+barGap) + 4); c.stroke();
    sorted.forEach((n, i) => {
      const y = startY + i * (barH + barGap);
      const barW = Math.abs(n.arcDelta) / maxAbs * (W * 0.35);
      const color = n.arcDelta >= 0 ? "#0F6E56" : "#A32D2D";
      const dStr = (n.arcDelta >= 0 ? "+" : "") + n.arcDelta;
      c.fillStyle = color; c.globalAlpha = 0.15;
      if (n.arcDelta >= 0) c.fillRect(midX, y, barW, barH); else c.fillRect(midX - barW, y, barW, barH);
      c.globalAlpha = 1; c.fillStyle = color; c.globalAlpha = 0.8;
      const thin = barH * 0.35;
      if (n.arcDelta >= 0) c.fillRect(midX, y+barH/2-thin/2, barW, thin); else c.fillRect(midX - barW, y+barH/2-thin/2, barW, thin);
      c.globalAlpha = 1;
      c.font = `500 10px sans-serif`; c.textBaseline = "middle"; c.fillStyle = textPrimary;
      if (n.arcDelta >= 0) { c.textAlign = "right"; c.fillText(n.name, midX - 6, y + barH/2); }
      else { c.textAlign = "left"; c.fillText(n.name, midX + 6, y + barH/2); }
      c.font = `500 9px sans-serif`; c.fillStyle = color;
      if (n.arcDelta >= 0) { c.textAlign = "left"; c.fillText(dStr, midX + barW + 5, y + barH/2); }
      else { c.textAlign = "right"; c.fillText(dStr, midX - barW - 5, y + barH/2); }
      c.fillStyle = getAccelColor(n.accel); c.font = `400 10px sans-serif`; c.textAlign = "center";
      c.fillText(n.accel === "accelerating" ? "↑" : n.accel === "stalling" ? "↓" : "→",
        n.arcDelta >= 0 ? midX + barW + 24 : midX - barW - 24, y + barH/2);
    });
    c.font = `400 9px sans-serif`; c.fillStyle = textColor; c.textAlign = "center"; c.textBaseline = "top";
    c.fillText("Arc", midX, startY - 18);
  }, []);
  useEffect(() => {
    const t = setTimeout(draw, 50);
    const debouncedDraw = debounce(() => {
      try {
        draw();
      } catch (error) {
        console.warn('ResizeObserver error in DeltaCanvas:', error);
      }
    }, 100);
    const ro = new ResizeObserver(debouncedDraw);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [draw]);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block", marginTop: 12 }} />;
}

function ScoreboardCanvas() {
  const canvasRef = useRef(null);
  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const sorted = [...nations].sort((a, b) => b.sapi - a.sapi);
    const rowH = 28, headerH = 60, H = headerH + sorted.length * rowH + 16;
    el.width = W * dpi; el.height = H * dpi; el.style.height = H + "px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const bg = isDark ? "#111" : "#fff";
    const rowBg = isDark ? "#1a1a1a" : "#f9f9f9";
    const border = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textPrimary = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)";
    const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
    c.clearRect(0, 0, W, H);
    c.font = `500 12px sans-serif`; c.textAlign = "center"; c.fillStyle = textPrimary; c.textBaseline = "top";
    c.fillText("SAPI Composite Scoreboard — 26 Nations Ranked", W/2, 10);
    c.font = `400 10px sans-serif`; c.fillStyle = textColor;
    c.fillText("Geometric mean composite · Sovereign AI Power Index v1.0", W/2, 26);
    const cols = [
      { label:"#", x: 20, align:"center" },
      { label:"Code", x: 50, align:"center" },
      { label:"Nation", x: 90, align:"left" },
      { label:"SAPI", x: W*0.42, align:"right" },
      { label:"Compute", x: W*0.52, align:"right" },
      { label:"Capital", x: W*0.62, align:"right" },
      { label:"Regulatory", x: W*0.73, align:"right" },
      { label:"Data", x: W*0.83, align:"right" },
      { label:"DI", x: W*0.93, align:"right" },
    ];
    c.font = `500 9px sans-serif`; c.fillStyle = textColor;
    cols.forEach(col => { c.textAlign = col.align; c.fillText(col.label, col.x, 46); });
    sorted.forEach((n, i) => {
      const y = headerH + i * rowH;
      if (i % 2 === 0) { c.fillStyle = rowBg; c.fillRect(0, y, W, rowH); }
      c.strokeStyle = border; c.lineWidth = 0.5;
      c.beginPath(); c.moveTo(0, y+rowH); c.lineTo(W, y+rowH); c.stroke();
      const nodeColor = getNodeColor(n.arcDelta);
      c.font = `400 10px sans-serif`; c.textBaseline = "middle"; const mid = y + rowH/2;
      c.fillStyle = textColor; c.textAlign = "center"; c.fillText(i+1, cols[0].x, mid);
      c.fillStyle = nodeColor; c.font = `500 10px sans-serif`;
      c.textAlign = "center"; c.fillText(n.code, cols[1].x, mid);
      c.fillStyle = textPrimary; c.font = `400 10px sans-serif`;
      c.textAlign = "left"; c.fillText(n.name, cols[2].x, mid);
      // SAPI score with mini bar
      const barMaxW = W * 0.08;
      const barW = (n.sapi / 100) * barMaxW;
      const barX = W * 0.42 - barMaxW;
      c.fillStyle = nodeColor; c.globalAlpha = 0.18;
      c.fillRect(barX, y + rowH/2 - 5, barW, 10);
      c.globalAlpha = 1;
      c.fillStyle = nodeColor; c.font = `500 10px sans-serif`;
      c.textAlign = "right"; c.fillText(n.sapi.toFixed(1), W*0.42, mid);
      // Dimension scores
      const dims = [n.scores.compute, n.scores.capital, n.scores.regulatory, n.scores.data, n.scores.di];
      const dimCols = [W*0.52, W*0.62, W*0.73, W*0.83, W*0.93];
      dims.forEach((s, di) => {
        const col = s >= 50 ? "#0F6E56" : s >= 30 ? "#B87E2A" : "#A32D2D";
        c.fillStyle = col; c.font = `400 9px sans-serif`;
        c.textAlign = "right"; c.fillText(s.toFixed(1), dimCols[di], mid);
      });
    });
  }, []);
  useEffect(() => {
    const t = setTimeout(draw, 50);
    const debouncedDraw = debounce(() => {
      try {
        draw();
      } catch (error) {
        console.warn('ResizeObserver error in ScoreboardCanvas:', error);
      }
    }, 100);
    const ro = new ResizeObserver(debouncedDraw);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [draw]);
  return <canvas ref={canvasRef} style={{ width: "100%", display: "block", marginTop: 12 }} />;
}

function MethodologyPanel() {
  const cards = [
    { title: "← Sovereignty Axis (x)", color: "#185FA5", items: [
      {n:"Compute sovereignty",w:"20 pts"},{n:"Semiconductor access & diversity",w:"20 pts"},
      {n:"Data jurisdiction control",w:"20 pts"},{n:"Model independence",w:"20 pts"},{n:"AI talent retention",w:"20 pts"}]},
    { title: "↑ Execution Velocity (y)", color: "#854F0B", items: [
      {n:"Policy velocity",w:"20 pts"},{n:"Public sector deployment rate",w:"20 pts"},
      {n:"Private sector adoption depth",w:"20 pts"},{n:"Investment coherence",w:"20 pts"},{n:"Institutional readiness",w:"20 pts"}]},
  ];
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {cards.map(card => (
          <div key={card.title} style={{ background: "var(--color-background-secondary,#f5f5f5)", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase", color: card.color, marginBottom: 10 }}>{card.title}</div>
            {card.items.map((item, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: idx < card.items.length-1 ? "0.5px solid rgba(0,0,0,0.08)" : "none", gap: 8 }}>
                <span style={{ fontSize: 12, flex: 1 }}>{item.n}</span>
                <span style={{ fontSize: 11, fontWeight: 500, background: "var(--color-background-primary,#fff)", border: "0.5px solid rgba(0,0,0,0.12)", borderRadius: 4, padding: "2px 7px", color: "rgba(0,0,0,0.5)", whiteSpace: "nowrap" }}>{item.w}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: "var(--color-background-secondary,#f5f5f5)", borderLeft: "2px solid #B87E2A", borderRadius: "0 6px 6px 0", padding: "12px 16px", fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.7 }}>
        <strong style={{ color: "var(--color-text-primary,#111)", fontWeight: 500 }}>How the prescriptive arc is set.</strong>{" "}
        At each sovereignty score, the arc plots the theoretical maximum velocity achievable given that structural position. The gap between a nation's actual velocity and its arc-prescribed ceiling is the{" "}
        <strong style={{ color: "var(--color-text-primary,#111)", fontWeight: 500 }}>Execution Delta</strong> — the S.A.P.I.'s most proprietary diagnostic metric.
      </div>
      <div style={{ marginTop: 12, background: "var(--color-background-secondary,#f5f5f5)", borderRadius: 8, padding: "12px 16px", fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
        <strong style={{ color: "var(--color-text-primary,#111)" }}>Dataset:</strong> 26 nations assessed (16 original + 10 new: Azerbaijan, Bahrain, Canada, Estonia, Ethiopia, Finland, France, Germany, Iraq, Italy). All scores from SAPI v1.0 (March 2026) assessments. Composite score is geometric mean of 5 weighted dimensions.
      </div>
    </div>
  );
}

function Tooltip({ nation, x, y }) {
  if (!nation) return null;
  const dStr = (nation.arcDelta >= 0 ? "+" : "") + nation.arcDelta;
  return (
    <div style={{ position: "absolute", left: x + 14, top: y - 10, background: "var(--color-background-primary,#fff)", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 6, padding: "10px 14px", fontSize: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.1)", zIndex: 10, maxWidth: 240, pointerEvents: "none" }}>
      <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>{nation.name}</div>
      {[["SAPI Score", nation.sapi], ["Zone", nation.zone], ["Sovereignty", `${nation.sx}/100`], ["Velocity", `${nation.vy}/100`], ["Exec Delta", dStr], ["Momentum", nation.accel]].map(([k, v]) => (
        <div key={k} style={{ color: "rgba(0,0,0,0.5)", lineHeight: 1.8 }}>{k}: <span style={{ color: "#111", fontWeight: 500 }}>{v}</span></div>
      ))}
      <div style={{ marginTop: 6, paddingTop: 6, borderTop: "0.5px solid rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px", fontSize: 11 }}>
        {[["Compute", nation.scores.compute], ["Capital", nation.scores.capital], ["Regulatory", nation.scores.regulatory], ["Data Sov.", nation.scores.data], ["DI Mat.", nation.scores.di]].map(([k, v]) => (
          <div key={k} style={{ color: "rgba(0,0,0,0.45)" }}>{k}: <span style={{ color: "#111", fontWeight: 500 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

const TABS = ["arc", "scoreboard", "delta", "method"];
const TAB_LABELS = { arc: "Power Arc", scoreboard: "Scoreboard", delta: "Execution Delta", method: "Methodology" };
const allNationOptions = [{ value: "all", label: "All nations" }, ...nations.map(n => ({ value: n.code, label: n.name }))];

export default function SAPIArcDashboard() {
  const [activeTab, setActiveTab] = useState("arc");
  const [highlight, setHighlight] = useState("all");
  const [scoreView, setScoreView] = useState("combined");
  const [tooltip, setTooltip] = useState({ nation: null, x: 0, y: 0 });
  const handleTooltip = useCallback((nation, x, y) => setTooltip({ nation, x: x || 0, y: y || 0 }), []);

  return (
    <div style={{ 
      width: "100%", 
      fontFamily: "sans-serif",
      backgroundColor: "#ffffff",
      color: "#111111",
      minHeight: "100vh"
    }}>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 2, borderBottom: "0.5px solid rgba(0,0,0,0.1)" }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ padding: "8px 16px", fontSize: 12, color: activeTab === tab ? "var(--color-text-primary,#111)" : "rgba(0,0,0,0.45)", cursor: "pointer", border: "none", background: "transparent", borderBottom: activeTab === tab ? "2px solid #B87E2A" : "2px solid transparent", marginBottom: -1, fontWeight: activeTab === tab ? 500 : 400 }}>
            {TAB_LABELS[tab]}
          </button>
        ))}
        <div style={{ marginLeft: "auto", padding: "8px 16px", fontSize: 11, color: "rgba(0,0,0,0.35)", alignSelf: "center" }}>
          {nations.length} nations · SAPI v1.0
        </div>
      </div>

      {/* Arc tab */}
      {activeTab === "arc" && (
        <>
          <div style={{ display: "flex", gap: 20, alignItems: "center", padding: "10px 16px", flexWrap: "wrap", borderBottom: "0.5px solid rgba(0,0,0,0.08)" }}>
            {[
              { label: "HIGHLIGHT", value: highlight, onChange: e => setHighlight(e.target.value), options: allNationOptions },
              { label: "SCORE VIEW", value: scoreView, onChange: e => setScoreView(e.target.value), options: [{ value: "combined", label: "Combined" }, { value: "sovereignty", label: "Sovereignty axis" }, { value: "velocity", label: "Velocity axis" }] },
            ].map(ctrl => (
              <div key={ctrl.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", letterSpacing: 0.5 }}>{ctrl.label}</span>
                <select value={ctrl.value} onChange={ctrl.onChange}
                  style={{ fontSize: 11, padding: "4px 8px", border: "0.5px solid rgba(0,0,0,0.15)", borderRadius: 6, background: "var(--color-background-primary,#fff)", color: "var(--color-text-primary,#111)", cursor: "pointer" }}>
                  {ctrl.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", padding: "8px 16px", borderBottom: "0.5px solid rgba(0,0,0,0.08)", fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
            {[
              { color: "#0F6E56", label: "Above arc (outperforming)" },
              { color: "#5F5E5A", label: "On arc (±5)" },
              { color: "#A32D2D", label: "Below arc (underperforming)" },
              { color: "#B87E2A", label: "↑ Accelerating" },
              { color: "#888780", label: "→ Steady" },
              { color: "#A32D2D", label: "↓ Stalling" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />{item.label}
              </div>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <ArcCanvas highlight={highlight} scoreView={scoreView} onTooltip={handleTooltip} />
            <Tooltip {...tooltip} />
          </div>
        </>
      )}

      {activeTab === "scoreboard" && <ScoreboardCanvas />}
      {activeTab === "delta" && <div><DeltaCanvas /></div>}
      {activeTab === "method" && <MethodologyPanel />}
    </div>
  );
}
