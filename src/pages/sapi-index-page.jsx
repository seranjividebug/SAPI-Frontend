import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ── Anonymized nation data (A–Z, AA–FF) ──────────────────────────────────
const nations = [
  { code:"A",  name:"Nation A",     zone:"Dormant",   sx:52.4, vy:39.4, accel:"steady",       arcDelta:-8,
    scores:{compute:29.8,capital:31.8,regulatory:45.4,data:50.8,di:41.0}, sapi:34.6 },
  { code:"B",  name:"Nation B",     zone:"Tethered",  sx:30.6, vy:36.5, accel:"steady",       arcDelta:-4,
    scores:{compute:9.6, capital:40.5,regulatory:40.0,data:37.5,di:29.0}, sapi:26.2 },
  { code:"C",  name:"Nation C",     zone:"Directing", sx:58.5, vy:51.1, accel:"accelerating", arcDelta:+5,
    scores:{compute:36.2,capital:48.6,regulatory:56.4,data:53.8,di:48.3}, sapi:43.5 },
  { code:"D",  name:"Nation D",     zone:"Directing", sx:55.4, vy:52.4, accel:"accelerating", arcDelta:+6,
    scores:{compute:31.4,capital:46.3,regulatory:53.3,data:53.8,di:57.5}, sapi:43.6 },
  { code:"E",  name:"Nation E",     zone:"Dormant",   sx:53.7, vy:46.1, accel:"accelerating", arcDelta:-2,
    scores:{compute:31.8,capital:43.5,regulatory:47.1,data:50.8,di:47.8}, sapi:39.6 },
  { code:"F",  name:"Nation F",     zone:"Tethered",  sx:44.6, vy:38.2, accel:"accelerating", arcDelta:+3,
    scores:{compute:23.6,capital:19.7,regulatory:42.4,data:45.0,di:52.5}, sapi:33.2 },
  { code:"G",  name:"Nation G",     zone:"Directing", sx:62.0, vy:56.8, accel:"accelerating", arcDelta:+8,
    scores:{compute:33.7,capital:50.7,regulatory:63.6,data:61.7,di:56.1}, sapi:46.9 },
  { code:"H",  name:"Nation H",     zone:"Directing", sx:81.6, vy:64.3, accel:"accelerating", arcDelta:+14,
    scores:{compute:65.8,capital:60.8,regulatory:69.4,data:59.7,di:62.7}, sapi:57.3 },
  { code:"I",  name:"Nation I",     zone:"Tethered",  sx:45.8, vy:25.1, accel:"stalling",     arcDelta:-18,
    scores:{compute:28.2,capital:13.3,regulatory:27.1,data:42.2,di:35.0}, sapi:23.4 },
  { code:"J",  name:"Nation J",     zone:"Dormant",   sx:62.7, vy:38.4, accel:"steady",       arcDelta:-14,
    scores:{compute:46.0,capital:24.3,regulatory:47.4,data:50.5,di:43.5}, sapi:35.6 },
  { code:"K",  name:"Nation K",     zone:"Tethered",  sx:11.7, vy:25.7, accel:"accelerating", arcDelta:+5,
    scores:{compute:1.0, capital:19.0,regulatory:24.9,data:17.0,di:33.2}, sapi:11.7 },
  { code:"L",  name:"Nation L",     zone:"Tethered",  sx:45.8, vy:30.6, accel:"steady",       arcDelta:-10,
    scores:{compute:22.4,capital:22.0,regulatory:39.4,data:48.0,di:30.5}, sapi:29.3 },
  { code:"M",  name:"Nation M",     zone:"Tethered",  sx:10.7, vy:12.2, accel:"steady",       arcDelta:-8,
    scores:{compute:1.0, capital:10.0,regulatory:11.3,data:15.5,di:15.3}, sapi:7.5 },
  { code:"N",  name:"Nation N",     zone:"Directing", sx:71.2, vy:61.5, accel:"accelerating", arcDelta:+12,
    scores:{compute:49.8,capital:61.3,regulatory:60.6,data:59.7,di:62.7}, sapi:53.4 },
  { code:"O",  name:"Nation O",     zone:"Directing", sx:56.1, vy:53.7, accel:"accelerating", arcDelta:+5,
    scores:{compute:33.8,capital:40.1,regulatory:70.9,data:52.5,di:50.0}, sapi:47.5 },
  { code:"P",  name:"Nation P",     zone:"Directing", sx:89.9, vy:51.7, accel:"stalling",     arcDelta:-22,
    scores:{compute:79.6,capital:49.2,regulatory:58.0,data:58.7,di:48.0}, sapi:56.1 },
  { code:"Q",  name:"Nation Q",     zone:"Tethered",  sx:36.5, vy:29.9, accel:"stalling",     arcDelta:-6,
    scores:{compute:29.6,capital:21.2,regulatory:38.1,data:43.3,di:21.7}, sapi:27.5 },
  { code:"R",  name:"Nation R",     zone:"Surging",   sx:34.3, vy:54.5, accel:"steady",       arcDelta:+21,
    scores:{compute:16.1,capital:40.0,regulatory:52.9,data:52.5,di:56.2}, sapi:36.7 },
  { code:"S",  name:"Nation S",     zone:"Surging",   sx:36.1, vy:50.9, accel:"steady",       arcDelta:+15,
    scores:{compute:30.0,capital:32.7,regulatory:57.6,data:42.2,di:44.2}, sapi:40.0 },
  { code:"T",  name:"Nation T",     zone:"Surging",   sx:42.2, vy:65.1, accel:"steady",       arcDelta:+20,
    scores:{compute:19.4,capital:34.0,regulatory:57.9,data:65.0,di:72.3}, sapi:41.3 },
  { code:"U",  name:"Nation U",     zone:"Tethered",  sx:31.8, vy:24.2, accel:"stalling",     arcDelta:-6,
    scores:{compute:23.6,capital:10.7,regulatory:23.6,data:40.0,di:24.8}, sapi:21.7 },
  { code:"V",  name:"Nation V",     zone:"Surging",   sx:41.7, vy:67.1, accel:"steady",       arcDelta:+23,
    scores:{compute:29.2,capital:37.8,regulatory:66.4,data:54.2,di:67.8}, sapi:44.7 },
  { code:"W",  name:"Nation W",     zone:"Directing", sx:52.8, vy:59.5, accel:"accelerating", arcDelta:-1,
    scores:{compute:38.0,capital:53.2,regulatory:63.6,data:67.5,di:55.3}, sapi:53.9 },
  { code:"X",  name:"Nation X",     zone:"Directing", sx:53.8, vy:54.5, accel:"steady",       arcDelta:-8,
    scores:{compute:43.9,capital:37.9,regulatory:60.2,data:63.8,di:48.7}, sapi:44.0 },
  { code:"Y",  name:"Nation Y",     zone:"Tethered",  sx:12.8, vy:16.6, accel:"stalling",     arcDelta:+1,
    scores:{compute:9.6, capital:9.2, regulatory:18.7,data:16.0,di:14.5}, sapi:13.0 },
  { code:"Z",  name:"Nation Z",     zone:"Surging",   sx:44.6, vy:55.6, accel:"steady",       arcDelta:+7,
    scores:{compute:36.0,capital:40.8,regulatory:63.3,data:53.3,di:47.9}, sapi:42.5 },
  { code:"AA", name:"Nation AA",    zone:"Tethered",  sx:27.9, vy:37.0, accel:"stalling",     arcDelta:+11,
    scores:{compute:6.6, capital:18.2,regulatory:37.6,data:49.3,di:36.3}, sapi:21.5 },
  { code:"BB", name:"Nation BB",    zone:"Directing", sx:52.8, vy:61.3, accel:"steady",       arcDelta:+1,
    scores:{compute:38.8,capital:40.2,regulatory:64.6,data:66.7,di:58.0}, sapi:46.6 },
  { code:"CC", name:"Nation CC",    zone:"Tethered",  sx:33.4, vy:39.8, accel:"steady",       arcDelta:+8,
    scores:{compute:21.3,capital:22.1,regulatory:42.4,data:45.4,di:37.2}, sapi:30.8 },
  { code:"DD", name:"Nation DD",    zone:"Tethered",  sx:24.7, vy:33.1, accel:"steady",       arcDelta:+10,
    scores:{compute:12.2,capital:26.5,regulatory:32.9,data:37.2,di:33.3}, sapi:24.4 },
  { code:"EE", name:"Nation EE",    zone:"Tethered",  sx:15.8, vy:26.4, accel:"stalling",     arcDelta:+10,
    scores:{compute:6.2, capital:11.3,regulatory:25.1,data:25.5,di:27.7}, sapi:15.3 },
  { code:"FF", name:"Nation FF",    zone:"Tethered",  sx:31.6, vy:41.2, accel:"accelerating", arcDelta:+11,
    scores:{compute:15.7,capital:45.0,regulatory:40.0,data:47.5,di:42.4}, sapi:36.1 },
];

// ── Theme ──────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0A0D14",
  bgCard:    "#0F1422",
  bgPanel:   "#141929",
  border:    "rgba(180,150,60,0.18)",
  borderMid: "rgba(180,150,60,0.35)",
  gold:      "#C9A227",
  goldDim:   "#8A6A10",
  goldLight: "#F0C84A",
  green:     "#1D9E75",
  red:       "#A32D2D",
  gray:      "#5F5E5A",
  textPri:   "rgba(240,220,160,0.92)",
  textSec:   "rgba(180,160,100,0.55)",
  textDim:   "rgba(140,120,70,0.35)",
  zone: {
    Tethered:  "#378ADD",
    Dormant:   "#5F5E5A",
    Surging:   "#C9A227",
    Directing: "#1D9E75",
  },
};

const PAD = { l: 64, r: 24, t: 44, b: 60 };

function arcVy(sx) {
  const t = sx / 100;
  return 10 + 78 * (1 / (1 + Math.exp(-8 * (t - 0.45))));
}

function toScreen(sx, vy, W, H) {
  const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;
  return { x: PAD.l + (sx / 100) * pw, y: PAD.t + ph - (vy / 100) * ph };
}

function getNodeColor(arcDelta) {
  if (arcDelta > 5) return T.green;
  if (arcDelta < -5) return T.red;
  return T.gray;
}

// ── Comet trail: fading dots along the arc BEHIND the nation (past 24mo) ──
// Each dot is a prior arc position, shrinking and fading backwards
function getCometTrailArc(n) {
  // trail goes BEHIND the nation along the arc (lower sx = earlier position)
  const dir = n.accel === "stalling" ? 1 : -1; // stalling: trail goes forward (losing ground)
  const spread = n.accel === "accelerating" ? 14 : n.accel === "stalling" ? 8 : 10;
  const dots = [];
  const count = 4;
  for (let i = 1; i <= count; i++) {
    const frac = i / count;
    const trailSx = Math.max(2, Math.min(98, n.sx + dir * frac * spread));
    const trailVy = arcVy(trailSx); // dots sit ON the arc
    dots.push({
      sx: trailSx,
      vy: trailVy,
      r: Math.max(2, 7 - i * 1.4),           // shrink toward tail
      opacity: 0.55 - i * 0.12,               // fade toward tail
    });
  }
  return dots;
}

// Get actual past positions of the country (not on the arc)
function getPastPositions(n) {
  const dir = n.accel === "stalling" ? 1 : -1; // stalling: trail goes forward (losing ground)
  const spread = n.accel === "accelerating" ? 14 : n.accel === "stalling" ? 8 : 10;
  const positions = [];
  const count = 4;
  
  for (let i = 1; i <= count; i++) {
    const frac = i / count;
    // Calculate past sovereignty position
    const pastSx = Math.max(2, Math.min(98, n.sx + dir * frac * spread));
    
    // Estimate past velocity based on movement pattern
    // This represents the country's actual past velocity, not the arc velocity
    let pastVy;
    if (n.accel === "accelerating") {
      // Accelerating: past velocity was lower
      pastVy = Math.max(5, n.vy - frac * spread * 0.6);
    } else if (n.accel === "stalling") {
      // Stalling: past velocity might have been higher
      pastVy = Math.min(95, n.vy + frac * spread * 0.4);
    } else {
      // Steady: similar velocity with small variation
      pastVy = n.vy + (Math.random() - 0.5) * spread * 0.2;
    }
    
    positions.push({
      sx: pastSx,
      vy: pastVy,
      r: Math.max(2, 7 - i * 1.4),           // shrink toward tail
      opacity: 0.55 - i * 0.12,               // fade toward tail
    });
  }
  return positions;
}

// Trajectory arrow: shows movement from past position to current node
// Connects from the past country position to the edge of the current country circle
function drawTrajectoryArrow(c, n, W, H) {
  const arrowColor = T.gold;
  const alpha = 0.8;

  // Get the first past position (most recent past position of the country)
  const pastPositions = getPastPositions(n);
  if (pastPositions.length === 0) return;
  
  const pastPos = pastPositions[0]; // Most recent past position
  const pastPt = toScreen(pastPos.sx, pastPos.vy, W, H);
  const currentPt = toScreen(n.sx, n.vy, W, H);
  
  // Calculate direction from past to current
  let dx = currentPt.x - pastPt.x;
  let dy = currentPt.y - pastPt.y;
  let len = Math.sqrt(dx*dx + dy*dy) || 1;
  
  // Apply upward momentum bias to reflect strategic progress
  // In canvas coordinates, smaller Y = up, so we need to make dy more positive
  const upwardBias = 0.25; // 25% upward bias for stronger effect
  dy = dy + (len * upwardBias); // Add to vertical component to create upward curve
  len = Math.sqrt(dx*dx + dy*dy) || 1; // Recalculate length
  const ux = dx/len, uy = dy/len;
  
  // Node radius (from the node drawing: arc with radius 18)
  const nodeRadius = 18;
  
  // Calculate end point at node boundary (not center)
  const endX = currentPt.x - ux * nodeRadius;
  const endY = currentPt.y - uy * nodeRadius;

  // Calculate extension point beyond node for future momentum
  const extensionDist = 70; // Distance beyond node edge
  const futureX = currentPt.x + ux * extensionDist;
  const futureY = currentPt.y + uy * extensionDist;

  // Draw thin golden line from past position through node to future point
  c.setLineDash([]);
  c.beginPath(); 
  c.moveTo(pastPt.x, pastPt.y); // Start from past position
  c.lineTo(futureX, futureY); // Extend beyond node to show future momentum
  c.strokeStyle = arrowColor; c.lineWidth = 1.2; c.globalAlpha = alpha; c.stroke(); c.globalAlpha = 1;

  // Draw arrowhead at the end of future trajectory
  const angle = Math.atan2(uy, ux);
  const hLen = 5, spread = 0.35;
  
  // Arrowhead tip is at future point (beyond node)
  c.beginPath();
  c.moveTo(futureX, futureY); // Tip of arrow at future point
  c.lineTo(futureX - hLen * Math.cos(angle - spread), futureY - hLen * Math.sin(angle - spread));
  c.moveTo(futureX, futureY); // Tip of arrow at future point
  c.lineTo(futureX - hLen * Math.cos(angle + spread), futureY - hLen * Math.sin(angle + spread));
  c.strokeStyle = arrowColor; c.lineWidth = 1.2; c.globalAlpha = alpha; c.stroke(); c.globalAlpha = 1;
}

// ── ArcCanvas ──────────────────────────────────────────────────────────────
function ArcCanvas({ highlight, scoreView, onTooltip, showTrails, showVectors }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const H = Math.round(W * 0.62);
    el.width = W * dpi; el.height = H * dpi; el.style.height = H + "px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    const pw = W - PAD.l - PAD.r, ph = H - PAD.t - PAD.b;

    // BG
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);

    // Zone quads
    [
      { label:"TETHERED",  x:0,  y:50, w:50, h:50, color:T.zone.Tethered },
      { label:"DORMANT",   x:0,  y:0,  w:50, h:50, color:T.zone.Dormant },
      { label:"SURGING",   x:50, y:50, w:50, h:50, color:T.zone.Surging },
      { label:"DIRECTING", x:50, y:0,  w:50, h:50, color:T.zone.Directing },
    ].forEach(z => {
      c.fillStyle = z.color; c.globalAlpha = 0.055;
      c.fillRect(PAD.l + (z.x/100)*pw, PAD.t + ((100-z.y-z.h)/100)*ph, (z.w/100)*pw, (z.h/100)*ph);
      c.globalAlpha = 1; c.font = "500 10px sans-serif"; c.fillStyle = z.color; c.globalAlpha = 0.5; c.textAlign = "left";
      const labelY = PAD.t + ((100-z.y-4)/100)*ph;
      c.fillText(z.label, PAD.l + ((z.x+2)/100)*pw, labelY); c.globalAlpha = 1;
    });

    // Grid
    for (let i = 0; i <= 10; i++) {
      c.strokeStyle = "rgba(180,150,60,0.06)"; c.lineWidth = 0.5;
      c.beginPath(); c.moveTo(PAD.l+(i/10)*pw, PAD.t); c.lineTo(PAD.l+(i/10)*pw, PAD.t+ph); c.stroke();
      c.beginPath(); c.moveTo(PAD.l, PAD.t+(i/10)*ph); c.lineTo(PAD.l+pw, PAD.t+(i/10)*ph); c.stroke();
    }
    // Mid dashes
    c.strokeStyle = T.borderMid; c.lineWidth = 0.5; c.setLineDash([3,3]);
    c.beginPath(); c.moveTo(PAD.l+0.5*pw,PAD.t); c.lineTo(PAD.l+0.5*pw,PAD.t+ph); c.stroke();
    c.beginPath(); c.moveTo(PAD.l,PAD.t+0.5*ph); c.lineTo(PAD.l+pw,PAD.t+0.5*ph); c.stroke();
    c.setLineDash([]);

    // Prescriptive Arc
    c.beginPath();
    for (let sx = 0; sx <= 100; sx += 0.5) {
      const p = toScreen(sx, arcVy(sx), W, H);
      sx === 0 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y);
    }
    c.strokeStyle = T.gold; c.lineWidth = 1.8; c.setLineDash([5,3]); c.globalAlpha = 0.7; c.stroke();
    c.setLineDash([]); c.globalAlpha = 1;

    // Arc label
    const alp = toScreen(55, arcVy(55), W, H);
    c.save(); c.translate(alp.x-10, alp.y-24); c.rotate(-0.38);
    c.font = "400 9px sans-serif"; c.fillStyle = T.gold; c.globalAlpha = 0.75;
    c.fillText("Sovereign Power Arc (prescriptive)", 0, 0); c.globalAlpha = 1; c.restore();

    // Nations
    nations.forEach(n => {
      const dimmed = highlight !== "all" && highlight !== n.code;
      const alpha = dimmed ? 0.12 : 1;
      const sxV = scoreView === "velocity" ? 50 : n.sx;
      const vyV = scoreView === "sovereignty" ? 50 : n.vy;
      const pt = toScreen(sxV, vyV, W, H);
      const nodeColor = getNodeColor(n.arcDelta);
      const accelColor = n.accel === "accelerating" ? T.gold : n.accel === "stalling" ? T.red : T.gray;

      // Past Position Trail: fading dots showing country's past positions
      if (!dimmed && showTrails && scoreView === "combined") {
        const trail = getPastPositions(n);
        trail.forEach(t => {
          const tp = toScreen(t.sx, t.vy, W, H);
          // Filled dot - gold/dim, shrinking and fading
          c.beginPath(); c.arc(tp.x, tp.y, t.r, 0, Math.PI*2);
          c.fillStyle = accelColor;
          c.globalAlpha = t.opacity * 0.75; c.fill(); c.globalAlpha = 1;
        });
      }

      // ── Arc deviation line ────────────────────────────────
      if (!dimmed) {
        const arcPt = toScreen(n.sx, arcVy(n.sx), W, H);
        c.beginPath(); c.moveTo(pt.x, pt.y); c.lineTo(arcPt.x, arcPt.y);
        c.strokeStyle = nodeColor; c.lineWidth = 0.8; c.setLineDash([2,2]); c.globalAlpha = 0.4; c.stroke();
        c.setLineDash([]); c.globalAlpha = 1;
      }

      // ── Highlight ring ────────────────────────────────────
      if (!dimmed && highlight !== "all") {
        c.beginPath(); c.arc(pt.x, pt.y, 26, 0, Math.PI*2);
        c.strokeStyle = T.gold; c.lineWidth = 1; c.globalAlpha = 0.3; c.stroke(); c.globalAlpha = 1;
      }

      // ── Accel ring ────────────────────────────────────────
      if (!dimmed && n.accel !== "steady") {
        c.beginPath(); c.arc(pt.x, pt.y, 22, 0, Math.PI*2);
        const accelCol = n.accel === "accelerating" ? T.gold : T.red;
        c.strokeStyle = accelCol; c.lineWidth = n.accel === "stalling" ? 1 : 1.8;
        c.globalAlpha = n.accel === "stalling" ? 0.25 : 0.55; c.stroke(); c.globalAlpha = 1;
      }

      // ── Node fill ─────────────────────────────────────────
      c.beginPath(); c.arc(pt.x, pt.y, 18, 0, Math.PI*2);
      c.fillStyle = nodeColor + "1A"; c.globalAlpha = alpha; c.fill();
      c.strokeStyle = nodeColor; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;

      // ── Code label ────────────────────────────────────────
      c.font = "600 9px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
      c.fillStyle = nodeColor; c.globalAlpha = alpha; c.fillText(n.code, pt.x, pt.y);
      c.font = "400 8px sans-serif"; c.fillStyle = T.textSec;
      c.fillText(n.name, pt.x, pt.y + 28); c.globalAlpha = 1;

      // ── Delta badge ──────────────────────────────────────
      if (!dimmed) {
        const bx = pt.x + 17, by = pt.y - 17;
        const dStr = (n.arcDelta >= 0 ? "+" : "") + n.arcDelta;
        c.font = "600 8px sans-serif";
        const bw = c.measureText(dStr).width + 8;
        c.fillStyle = nodeColor; c.globalAlpha = 0.92;
        c.beginPath(); c.roundRect(bx - bw/2, by - 6, bw, 12, 2); c.fill();
        c.globalAlpha = 1; c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(dStr, bx, by);
      }

      // // Trajectory arrow from previous position to current node
      if (!dimmed && showVectors && scoreView === "combined") {
        drawTrajectoryArrow(c, n, W, H);
      }
    });

    // ── Axes ──────────────────────────────────────────────
    c.strokeStyle = T.borderMid; c.lineWidth = 1;
    c.beginPath(); c.moveTo(PAD.l, PAD.t+ph); c.lineTo(PAD.l+pw+8, PAD.t+ph); c.stroke();
    c.beginPath(); c.moveTo(PAD.l, PAD.t+ph); c.lineTo(PAD.l, PAD.t-8); c.stroke();

    c.font = "400 10px sans-serif"; c.fillStyle = T.textSec;
    c.textAlign = "left"; c.textBaseline = "top";
    c.fillText("Structurally Dependent", PAD.l, PAD.t+ph+8);
    c.textAlign = "right"; c.fillText("Strategically Autonomous →", PAD.l+pw, PAD.t+ph+8);
    c.save(); c.translate(14, PAD.t+ph); c.rotate(-Math.PI/2);
    c.textAlign = "left"; c.textBaseline = "middle"; c.fillText("Latent", 0, 0);
    c.textAlign = "right"; c.fillText("Kinetic ↑", ph, 0); c.restore();

    // Title
    c.font = "500 13px sans-serif"; c.textAlign = "center"; c.textBaseline = "top";
    c.fillStyle = T.textPri; c.fillText("S.A.P.I. Power Arc — 32 Nations", W/2, 6);
    c.font = "400 10px sans-serif"; c.fillStyle = T.textSec;
    c.fillText("Sovereign AI Power Index · CoreIntel", W/2, 22);
  }, [highlight, scoreView, showTrails, showVectors]);

  useEffect(() => {
    let timeoutId;
    const ro = new ResizeObserver(() => {
      // Debounce resize events to prevent loop
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(draw, 100);
    });
    
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
    }
    
    // Initial draw
    timeoutId = setTimeout(draw, 50);
    
    return () => { 
      clearTimeout(timeoutId); 
      ro.disconnect(); 
    };
  }, [draw]);

  const handleMouseMove = useCallback((e) => {
    const el = canvasRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let found = null;
    nations.forEach(n => {
      const pt = toScreen(n.sx, n.vy, rect.width, rect.height);
      if (Math.sqrt((mx-pt.x)**2 + (my-pt.y)**2) < 22) found = n;
    });
    onTooltip(found, mx, my);
  }, [onTooltip]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", display: "block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onTooltip(null)}
    />
  );
}

// ── DeltaCanvas ──────────────────────────────────────────────────────────
function DeltaCanvas() {
  const canvasRef = useRef(null);
  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const H = Math.max(600, nations.length * 28 + 70);
    el.width = W * dpi; el.height = H * dpi; el.style.height = H + "px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const sorted = [...nations].sort((a, b) => b.arcDelta - a.arcDelta);
    const barH = 18, barGap = 8, maxAbs = 25, midX = W/2, startY = 52;

    c.font = "500 12px sans-serif"; c.textAlign = "center"; c.fillStyle = T.textPri;
    c.fillText("Execution Delta — performance vs prescriptive arc (32 nations)", W/2, 16);
    c.font = "400 10px sans-serif"; c.fillStyle = T.textSec;
    c.fillText("Positive = outperforming sovereign position · Negative = unrealised AI power", W/2, 32);

    c.strokeStyle = T.textSec; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(midX, startY-8); c.lineTo(midX, startY + sorted.length*(barH+barGap)+4); c.stroke();

    sorted.forEach((n, i) => {
      const y = startY + i*(barH+barGap);
      const barW = Math.abs(n.arcDelta)/maxAbs * (W*0.35);
      const color = n.arcDelta >= 0 ? T.green : T.red;
      const dStr = (n.arcDelta >= 0 ? "+" : "") + n.arcDelta;

      c.fillStyle = color; c.globalAlpha = 0.12;
      if (n.arcDelta >= 0) c.fillRect(midX, y, barW, barH); else c.fillRect(midX-barW, y, barW, barH);
      c.globalAlpha = 1; c.fillStyle = color; c.globalAlpha = 0.85;
      const thin = barH*0.35;
      if (n.arcDelta >= 0) c.fillRect(midX, y+barH/2-thin/2, barW, thin);
      else c.fillRect(midX-barW, y+barH/2-thin/2, barW, thin);
      c.globalAlpha = 1;

      c.font = "500 10px sans-serif"; c.textBaseline = "middle"; c.fillStyle = T.textPri;
      if (n.arcDelta >= 0) { c.textAlign = "right"; c.fillText(n.name, midX-6, y+barH/2); }
      else { c.textAlign = "left"; c.fillText(n.name, midX+6, y+barH/2); }

      c.font = "500 9px sans-serif"; c.fillStyle = color;
      if (n.arcDelta >= 0) { c.textAlign = "left"; c.fillText(dStr, midX+barW+5, y+barH/2); }
      else { c.textAlign = "right"; c.fillText(dStr, midX-barW-5, y+barH/2); }

      // Velocity vector indicator
      const accelCol = n.accel === "accelerating" ? T.gold : n.accel === "stalling" ? T.red : T.gray;
      const sym = n.accel === "accelerating" ? "▲" : n.accel === "stalling" ? "▼" : "▶";
      c.fillStyle = accelCol; c.font = "400 10px sans-serif"; c.textAlign = "center";
      c.fillText(sym, n.arcDelta >= 0 ? midX+barW+24 : midX-barW-24, y+barH/2);
    });

    c.font = "400 9px sans-serif"; c.fillStyle = T.textSec; c.textAlign = "center"; c.textBaseline = "top";
    c.fillText("Arc", midX, startY-18);
  }, []);

  useEffect(() => {
    let timeoutId;
    const ro = new ResizeObserver(() => {
      // Debounce resize events to prevent loop
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(draw, 100);
    });
    
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
    }
    
    // Initial draw
    timeoutId = setTimeout(draw, 50);
    
    return () => { 
      clearTimeout(timeoutId); 
      ro.disconnect(); 
    };
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width:"100%", display:"block", marginTop:12 }} />;
}

// ── ScoreboardCanvas ─────────────────────────────────────────────────────
function ScoreboardCanvas() {
  const canvasRef = useRef(null);
  const draw = useCallback(() => {
    const el = canvasRef.current; if (!el) return;
    const dpi = window.devicePixelRatio || 1;
    const W = el.parentElement.clientWidth || 680;
    const sorted = [...nations].sort((a, b) => b.sapi - a.sapi);
    const rowH = 28, headerH = 60, H = headerH + sorted.length*rowH + 16;
    el.width = W*dpi; el.height = H*dpi; el.style.height = H+"px";
    const c = el.getContext("2d"); c.scale(dpi, dpi);
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);

    c.font = "500 12px sans-serif"; c.textAlign = "center"; c.fillStyle = T.textPri; c.textBaseline = "top";
    c.fillText("SAPI Composite Scoreboard — 32 Nations Ranked", W/2, 10);
    c.font = "400 10px sans-serif"; c.fillStyle = T.textSec;
    c.fillText("Geometric mean composite · Sovereign AI Power Index v1.0", W/2, 26);

    const cols = [
      {label:"#",x:20,align:"center"},{label:"Code",x:50,align:"center"},{label:"Nation",x:90,align:"left"},
      {label:"SAPI",x:W*0.42,align:"right"},{label:"Compute",x:W*0.52,align:"right"},
      {label:"Capital",x:W*0.62,align:"right"},{label:"Regulatory",x:W*0.73,align:"right"},
      {label:"Data",x:W*0.83,align:"right"},{label:"DI",x:W*0.93,align:"right"},
    ];
    c.font = "500 9px sans-serif"; c.fillStyle = T.textSec;
    cols.forEach(col => { c.textAlign = col.align; c.fillText(col.label, col.x, 46); });

    sorted.forEach((n, i) => {
      const y = headerH + i*rowH;
      if (i%2===0) { c.fillStyle = "rgba(180,150,60,0.04)"; c.fillRect(0, y, W, rowH); }
      c.strokeStyle = T.border; c.lineWidth = 0.5;
      c.beginPath(); c.moveTo(0,y+rowH); c.lineTo(W,y+rowH); c.stroke();
      const nodeColor = getNodeColor(n.arcDelta);
      c.textBaseline = "middle"; const mid = y+rowH/2;
      c.font = "400 10px sans-serif"; c.fillStyle = T.textSec; c.textAlign="center"; c.fillText(i+1, cols[0].x, mid);
      c.fillStyle = nodeColor; c.font = "500 10px sans-serif"; c.textAlign="center"; c.fillText(n.code, cols[1].x, mid);
      c.fillStyle = T.textPri; c.font = "400 10px sans-serif"; c.textAlign="left"; c.fillText(n.name, cols[2].x, mid);
      const barMaxW = W*0.08, barW = (n.sapi/100)*barMaxW, barX = W*0.42-barMaxW;
      c.fillStyle = nodeColor; c.globalAlpha = 0.18; c.fillRect(barX, y+rowH/2-5, barW, 10); c.globalAlpha=1;
      c.fillStyle = nodeColor; c.font = "500 10px sans-serif"; c.textAlign="right"; c.fillText(n.sapi.toFixed(1), W*0.42, mid);
      const dims = [n.scores.compute, n.scores.capital, n.scores.regulatory, n.scores.data, n.scores.di];
      const dimCols = [W*0.52,W*0.62,W*0.73,W*0.83,W*0.93];
      dims.forEach((s, di) => {
        const col = s>=50 ? T.green : s>=30 ? T.gold : T.red;
        c.fillStyle = col; c.font = "400 9px sans-serif"; c.textAlign="right";
        c.fillText(s.toFixed(1), dimCols[di], mid);
      });
    });
  }, []);

  useEffect(() => {
    let timeoutId;
    const ro = new ResizeObserver(() => {
      // Debounce resize events to prevent loop
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(draw, 100);
    });
    
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
    }
    
    // Initial draw
    timeoutId = setTimeout(draw, 50);
    
    return () => { 
      clearTimeout(timeoutId); 
      ro.disconnect(); 
    };
  }, [draw]);

  return <canvas ref={canvasRef} style={{ width:"100%", display:"block", marginTop:12 }} />;
}

// ── Methodology Panel ─────────────────────────────────────────────────────
function MethodologyPanel() {
  const cards = [
    { title:"← Sovereignty Axis (x)", color:T.gold, items:[
      {n:"Compute sovereignty",w:"20 pts"},{n:"Semiconductor access & diversity",w:"20 pts"},
      {n:"Data jurisdiction control",w:"20 pts"},{n:"Model independence",w:"20 pts"},{n:"AI talent retention",w:"20 pts"}]},
    { title:"↑ Execution Velocity (y)", color:"#C9A227", items:[
      {n:"Policy velocity",w:"20 pts"},{n:"Public sector deployment rate",w:"20 pts"},
      {n:"Private sector adoption depth",w:"20 pts"},{n:"Investment coherence",w:"20 pts"},{n:"Institutional readiness",w:"20 pts"}]},
  ];
  return (
    <div style={{ padding:16, background:T.bg, minHeight:200 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {cards.map(card => (
          <div key={card.title} style={{ background:T.bgPanel, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"14px 16px" }}>
            <div style={{ fontSize:11, fontWeight:500, letterSpacing:1, textTransform:"uppercase", color:card.color, marginBottom:10 }}>{card.title}</div>
            {card.items.map((item, idx) => (
              <div key={idx} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:idx<card.items.length-1?`0.5px solid ${T.border}`:"none", gap:8 }}>
                <span style={{ fontSize:12, flex:1, color:T.textPri }}>{item.n}</span>
                <span style={{ fontSize:11, fontWeight:500, background:T.bgCard, border:`0.5px solid ${T.border}`, borderRadius:4, padding:"2px 7px", color:T.textSec, whiteSpace:"nowrap" }}>{item.w}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background:T.bgPanel, borderLeft:`2px solid ${T.gold}`, borderRadius:"0 6px 6px 0", padding:"12px 16px", fontSize:12, color:T.textSec, lineHeight:1.7 }}>
        <strong style={{ color:T.textPri, fontWeight:500 }}>How the prescriptive arc is set.</strong>{" "}
        At each sovereignty score, the arc plots the theoretical maximum velocity achievable given that structural position. The gap between a nation's actual velocity and its arc-prescribed ceiling is the{" "}
        <strong style={{ color:T.textPri, fontWeight:500 }}>Execution Delta</strong> — the S.A.P.I.'s most proprietary diagnostic metric.
      </div>
      {/* Trajectory Arrow Legend */}
      <div style={{ marginTop:12, background:T.bgPanel, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"12px 16px" }}>
        <div style={{ fontSize:11, fontWeight:500, color:T.gold, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Movement Trajectory</div>
        {[
          { color:T.gold,  sym:"Arrow", label:"Golden trajectory arrow connects previous position to current node" },
        ].map(row => (
          <div key={row.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:`0.5px solid ${T.border}` }}>
            <span style={{ color:row.color, fontWeight:700, fontSize:14, minWidth:24, textAlign:"center" }}>{row.sym}</span>
            <span style={{ fontSize:12, color:T.textSec }}>{row.label}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop:12, background:T.bgPanel, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"12px 16px", fontSize:11, color:T.textSec }}>
        <strong style={{ color:T.textPri }}>Dataset:</strong> 32 nations assessed. All scores from SAPI v1.0 (March 2026). Composite score is geometric mean of 5 weighted dimensions.
      </div>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────
function Tooltip({ nation, x, y }) {
  if (!nation) return null;
  const dStr = (nation.arcDelta >= 0 ? "+" : "") + nation.arcDelta;
  const accelColor = nation.accel === "accelerating" ? T.gold : nation.accel === "stalling" ? T.red : T.gray;
  const sym = nation.accel === "accelerating" ? "▲ Accelerating" : nation.accel === "stalling" ? "▼ Stalling" : "→ Steady";
  return (
    <div style={{ position:"absolute", left:x+14, top:y-10, background:T.bgCard, border:`0.5px solid ${T.borderMid}`, borderRadius:6, padding:"10px 14px", fontSize:12, boxShadow:"0 2px 16px rgba(0,0,0,0.6)", zIndex:10, maxWidth:240, pointerEvents:"none" }}>
      <div style={{ fontWeight:500, fontSize:13, marginBottom:4, color:T.textPri }}>{nation.name}</div>
      {[["SAPI Score",nation.sapi],["Zone",nation.zone],["Sovereignty",`${nation.sx}/100`],["Velocity",`${nation.vy}/100`],["Exec Delta",dStr]].map(([k,v]) => (
        <div key={k} style={{ color:T.textSec, lineHeight:1.8 }}>{k}: <span style={{ color:T.textPri, fontWeight:500 }}>{v}</span></div>
      ))}
      <div style={{ color:accelColor, lineHeight:1.8, fontWeight:500 }}>Momentum: {sym}</div>
      <div style={{ marginTop:6, paddingTop:6, borderTop:`0.5px solid ${T.border}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 12px", fontSize:11 }}>
        {[["Compute",nation.scores.compute],["Capital",nation.scores.capital],["Regulatory",nation.scores.regulatory],["Data Sov.",nation.scores.data],["DI Mat.",nation.scores.di]].map(([k,v]) => (
          <div key={k} style={{ color:T.textSec }}>{k}: <span style={{ color:T.textPri, fontWeight:500 }}>{v}</span></div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────
const TABS = ["arc","scoreboard","delta","method"];
const TAB_LABELS = { arc:"Power Arc", scoreboard:"Scoreboard", delta:"Execution Delta", method:"Methodology" };
const allNationOptions = [{ value:"all", label:"All nations" }, ...nations.map(n => ({ value:n.code, label:n.name }))];

export default function SAPIIndexPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("arc");
  const [highlight, setHighlight] = useState("all");
  const [scoreView, setScoreView] = useState("combined");
  const [showTrails, setShowTrails] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [tooltip, setTooltip] = useState({ nation:null, x:0, y:0 });
  const handleTooltip = useCallback((nation, x, y) => setTooltip({ nation, x:x||0, y:y||0 }), []);

  const tabStyle = (tab) => ({
    padding:"9px 16px", fontSize:12, cursor:"pointer", border:"none",
    background:"transparent",
    color: activeTab===tab ? T.goldLight : T.textSec,
    borderBottom: activeTab===tab ? `2px solid ${T.gold}` : "2px solid transparent",
    marginBottom:-1,
    fontWeight: activeTab===tab ? 500 : 400,
  });

  const selectStyle = {
    fontSize:11, padding:"4px 8px", border:`0.5px solid ${T.border}`,
    borderRadius:6, background:T.bgPanel, color:T.textPri, cursor:"pointer",
  };

  const toggleStyle = (active) => ({
    padding:"4px 10px", fontSize:11, cursor:"pointer", border:`0.5px solid ${active ? T.gold : T.border}`,
    borderRadius:6, background: active ? T.goldDim + "44" : T.bgPanel,
    color: active ? T.goldLight : T.textSec, transition:"all 0.15s",
  });

  return (
    <div style={{ width:"100%", fontFamily:"sans-serif", background:T.bg, color:T.textPri }}>
      {/* Header */}
        <header className="bg-[#0a0a12] border-b border-sapi-bronze py-2">
      <div className="pl-2 pr-8 py-1 max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/SAPI_Logo_B4.svg"
            alt="SAPI Logo"
            className="h-40 w-40 object-contain"
          />
          <div
            className="font-sans text-xl text-[#fbf5e6] cursor-pointer tracking-wide leading-tight"
            onClick={() => navigate('/main')}
          >
            THE SOVEREIGN<br />AI POWER INDEX
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/login')}
          >
            Index
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/methodology')}
          >
            Methodology
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/sapi-index')}
          >
            Sample
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/about')}
          >
            About Us
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-6 py-2 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
            onClick={() => navigate('/contact')}
          >
            Request Introduction
          </button>
        </div>
      </div>
    </header>

    {/* Tab bar */}
    <div className="px-8 max-w-container mx-auto" style={{ display:"flex", gap:2, borderBottom:`0.5px solid ${T.border}`, background:T.bgCard }}>
      {TABS.map(tab => (
        <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
          {TAB_LABELS[tab]}
        </button>
      ))}
      <div style={{ marginLeft:"auto", padding:"8px 16px", fontSize:11, color:T.textDim, alignSelf:"center" }}>
        {nations.length} nations · SAPI v1.0 (Anonymized)
      </div>
    </div>

      {/* Arc tab controls */}
      {activeTab === "arc" && (
        <>
          <div className="px-8 max-w-container mx-auto">
            <div style={{ display:"flex", gap:20, alignItems:"center", padding:"10px 0", flexWrap:"wrap", borderBottom:`0.5px solid ${T.border}`, background:T.bgCard }}>
              {[
                { label:"HIGHLIGHT", value:highlight, onChange:e=>setHighlight(e.target.value), options:allNationOptions },
                { label:"SCORE VIEW", value:scoreView, onChange:e=>setScoreView(e.target.value), options:[
                  {value:"combined",label:"Combined"},{value:"sovereignty",label:"Sovereignty axis"},{value:"velocity",label:"Velocity axis"}
                ]},
              ].map(ctrl => (
                <div key={ctrl.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, color:T.textSec, letterSpacing:0.5 }}>{ctrl.label}</span>
                  <select value={ctrl.value} onChange={ctrl.onChange} style={selectStyle}>
                    {ctrl.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
              {/* Toggle: Comet Trails */}
              <button onClick={() => setShowTrails(v => !v)} style={toggleStyle(showTrails)}>
                ☄ Comet Trails
              </button>
              {/* Toggle: Velocity Vectors */}
              <button onClick={() => setShowVectors(v => !v)} style={toggleStyle(showVectors)}>
                ↗ Velocity Vectors
              </button>
            </div>

            {/* Legend */}
            <div style={{ display:"flex", gap:20, flexWrap:"wrap", padding:"8px 0", borderBottom:`0.5px solid ${T.border}`, fontSize:11, color:T.textSec, background:T.bgCard }}>
              {[
                { color:T.green, label:"Above arc (outperforming)" },
                { color:T.gray,  label:"On arc (±5)" },
                { color:T.red,   label:"Below arc (underperforming)" },
                { color:T.gold,  label:"Trajectory arrow (movement path)" },
                { color:T.gray,  label:"Steady trajectory" },
                { color:T.red,   label:"Declining trajectory" },
              ].map(item => (
                <div key={item.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:item.color }} />{item.label}
                </div>
              ))}
            </div>

            <div style={{ position:"relative", background:T.bg }}>
              <ArcCanvas
                highlight={highlight}
                scoreView={scoreView}
                onTooltip={handleTooltip}
                showTrails={showTrails}
                showVectors={showVectors}
              />
              <Tooltip {...tooltip} />
            </div>

            {/* Explanation Section */}
            <div style={{ padding:"24px 0", background:T.bgCard, borderTop:`0.5px solid ${T.border}` }}>
              <div style={{ maxWidth:"900px", margin:"0 auto" }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.textPri, marginBottom:8, letterSpacing:0.5, textTransform:"uppercase", textAlign:"center" }}>Understanding the Index</div>
                <p style={{ fontSize:13, color:T.textSec, lineHeight:1.7, margin:"0 0 16px" }}>
                  The Sovereign AI Power Index maps 32 nations across two dimensions: structural independence (X-axis) and execution velocity (Y-axis). Each node represents a nation's strategic position in the global AI race. Nation identities are anonymized (A, B, C, etc.) in this preview.
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:16 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.gold, marginBottom:6 }}>Sovereignty Axis (X)</div>
                    <p style={{ fontSize:12, color:T.textSec, lineHeight:1.6, margin:0 }}>
                      Measures structural independence through compute infrastructure, semiconductor access, data jurisdiction, model independence, and AI talent retention.
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.gold, marginBottom:6 }}>Velocity Axis (Y)</div>
                    <p style={{ fontSize:12, color:T.textSec, lineHeight:1.6, margin:0 }}>
                      Measures execution and deployment speed through policy velocity, public/private sector adoption, investment coherence, and institutional readiness.
                    </p>
                  </div>
                </div>
                <div style={{ marginTop:16, padding:"12px 16px", background:T.bgPanel, borderLeft:`2px solid ${T.gold}`, borderRadius:"0 6px 6px 0" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:T.textPri, marginBottom:4 }}>The Execution Delta</div>
                  <p style={{ fontSize:12, color:T.textSec, lineHeight:1.6, margin:0 }}>
                    The prescriptive arc (dashed gold curve) represents the theoretical maximum velocity for a given sovereignty position. The gap between a nation's actual velocity and its arc-prescribed ceiling is the Execution Delta — the most important metric in the index. Positive delta = outperforming, Negative delta = unrealized potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "scoreboard" && (
        <div className="px-8 max-w-container mx-auto">
          <ScoreboardCanvas />
        </div>
      )}
      {activeTab === "delta" && (
        <div className="px-8 max-w-container mx-auto">
          <DeltaCanvas />
        </div>
      )}
      {activeTab === "method" && (
        <div className="px-8 max-w-container mx-auto">
          <MethodologyPanel />
        </div>
      )}
    </div>
  );
}
