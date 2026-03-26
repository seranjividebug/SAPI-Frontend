import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  void:      "#06030E",
  navy:      "#0F0830",
  midnight:  "#1A1540",
  gold:      "#C9963A",
  paleGold:  "#EDD98A",
  parchment: "#FBF5E6",
  muted:     "#9880B0",
  bronze:    "rgba(107,69,8,0.22)",
  bronzeHi:  "rgba(107,69,8,0.45)",
};

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",               shortCode: "D1", weight: 0.175, ids: ["Q1","Q2","Q3","Q4","Q5"] },
  { name: "Capital Formation",              shortCode: "D2", weight: 0.225, ids: ["Q6","Q7","Q8","Q9","Q10","Q11"] },
  { name: "Regulatory Readiness",           shortCode: "D3", weight: 0.175, ids: ["Q12","Q13","Q14","Q15","Q16","Q17","Q18"] },
  { name: "Data Sovereignty",               shortCode: "D4", weight: 0.125, ids: ["Q19","Q20","Q21","Q22","Q23","Q24"] },
  { name: "Directed Intelligence Maturity", shortCode: "D5", weight: 0.275, ids: ["Q25","Q26","Q27","Q28","Q29","Q30"] },
];

// ── Scoring engine (mirrors P5) ───────────────────────────────────────────────
function computeAllScores(answers = {}) {
  const dimScores = DIMENSIONS.map(dim => {
    const vals = dim.ids.map(id => answers[id] || 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
  const [d1, d2, d3, d4, d5] = dimScores;
  // Guard: prevent Math.pow(0, x) collapsing the whole score
  const safe = v => Math.max(v, 0.001);
  const composite =
    Math.pow(safe(d1), 0.175) *
    Math.pow(safe(d2), 0.225) *
    Math.pow(safe(d3), 0.175) *
    Math.pow(safe(d4), 0.125) *
    Math.pow(safe(d5), 0.275);
  return { dimScores, composite: Math.min(composite, 100) };
}

function getTier(score) {
  if (score >= 80) return { label: "Sovereign AI Leader",   color: "#28A868" };
  if (score >= 60) return { label: "Advanced",              color: "#4A7AE0" };
  if (score >= 40) return { label: "Developing",            color: "#F0C050" };
  if (score >= 20) return { label: "Nascent",               color: "#C9963A" };
  return               { label: "Pre-conditions Unmet",     color: "#C03058" };
}

// ── Animated SAPI Globe ───────────────────────────────────────────────────────
// Three independent orbital animations for analytical weight
function SAPIGlobeAnimated({ size = 96 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Outer sphere */}
      <circle cx="32" cy="32" r="29" stroke="white" strokeWidth="1.1" opacity="0.9" />

      {/* Orbit ring 1 — equatorial, slow counter-rotation */}
      <ellipse
        cx="32" cy="32" rx="29" ry="11"
        stroke={C.gold} strokeWidth="1" strokeDasharray="2 1.5"
        style={{
          transformOrigin: "32px 32px",
          animation: "orbitSpin1 6s linear infinite",
          opacity: 0.85,
        }}
      />

      {/* Orbit ring 2 — tilted, medium rotation */}
      <ellipse
        cx="32" cy="32" rx="22" ry="29"
        stroke="white" strokeWidth="0.9" strokeDasharray="2 2"
        transform="rotate(-28 32 32)"
        style={{
          transformOrigin: "32px 32px",
          animation: "orbitSpin2 9s linear infinite",
          opacity: 0.65,
        }}
      />

      {/* Orbit ring 3 — counter-tilt, slow counter-rotation */}
      <ellipse
        cx="32" cy="32" rx="22" ry="29"
        stroke="white" strokeWidth="0.7" strokeDasharray="1.5 2.5"
        transform="rotate(28 32 32)"
        style={{
          transformOrigin: "32px 32px",
          animation: "orbitSpin3 12s linear infinite reverse",
          opacity: 0.5,
        }}
      />

      {/* Constellation nodes — pulsing */}
      {[[32,3],[55,20],[55,44],[32,61],[9,44],[9,20],[46,12],[18,52]].map(([cx,cy], i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r="2.2"
          fill="white"
          style={{
            animation: `nodePulse 2.4s ease-in-out ${(i * 0.28).toFixed(2)}s infinite`,
          }}
        />
      ))}

      {/* Constellation lines */}
      <line x1="32" y1="3"  x2="55" y2="20" stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="55" y1="44" x2="32" y2="61" stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="32" y1="61" x2="9"  y2="44" stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="9"  y1="44" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="9"  y1="20" x2="32" y2="3"  stroke="white" strokeWidth="0.6" opacity="0.45" />
      <line x1="46" y1="12" x2="55" y2="44" stroke="white" strokeWidth="0.5" opacity="0.30" />
      <line x1="18" y1="52" x2="9"  y2="20" stroke="white" strokeWidth="0.5" opacity="0.30" />
      <line x1="46" y1="12" x2="18" y2="52" stroke="white" strokeWidth="0.5" opacity="0.22" />
    </svg>
  );
}

// ── Dimension score bar ───────────────────────────────────────────────────────
function DimBar({ dim, score, active, staggerIndex }) {
  // Staggered reveal: each bar starts after a small delay
  const delay = 0.25 + staggerIndex * 0.12;
  const duration = 1.6 + staggerIndex * 0.1;

  return (
    <div style={{
      opacity: active ? 1 : 0,
      transition: `opacity 0.4s ease ${delay}s`,
    }}>
      {/* Label row */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 6,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: C.gold, opacity: 0.9,
          }}>
            {dim.shortCode}
          </span>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            letterSpacing: "0.06em",
            color: C.muted, opacity: 0.75,
          }}>
            {dim.name}
          </span>
        </div>
        <span style={{
          fontFamily: "Georgia, serif", fontSize: 13,
          color: C.paleGold, letterSpacing: "0.04em",
          transition: `opacity 0.3s ease ${delay + 0.4}s`,
          opacity: active ? 1 : 0,
        }}>
          {score > 0 ? score.toFixed(1) : "—"}
        </span>
      </div>

      {/* Bar track */}
      <div style={{
        height: 3, background: C.bronze, borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${C.bronzeHi}`,
      }}>
        <div style={{
          height: "100%",
          width: active ? `${Math.min(score, 100)}%` : "0%",
          background: `linear-gradient(90deg, ${C.gold} 0%, ${C.paleGold} 85%, #FFF8E0 100%)`,
          borderRadius: 2,
          transition: `width ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`,
          boxShadow: `0 0 8px rgba(201,150,58,0.4)`,
        }} />
      </div>
    </div>
  );
}

// ── P6 Main Component ─────────────────────────────────────────────────────────
export default function SAPICalculating() {
  const navigate = useNavigate();
  const [barsActive,     setBarsActive]     = useState(false);
  const [completeActive, setCompleteActive] = useState(false);

  // Compute scores once on mount (synchronous — fast)
  const { dimScores, composite } = useMemo(
    () => computeAllScores({}), // Mock empty answers
    []
  );
  // eslint-disable-next-line no-unused-vars
  const tier = useMemo(() => getTier(composite), [composite]);

  useEffect(() => {
    // Bars start filling ~350ms after mount
    const t1 = setTimeout(() => setBarsActive(true), 350);

    // "Assessment complete." appears ~2.7s in
    const t2 = setTimeout(() => setCompleteActive(true), 2700);

    // Commit results and navigate at 3.6s
    const t3 = setTimeout(() => {
      // In real app would commit to global state
      navigate('/results');
    }, 3600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{
      background:    C.void,
      minHeight:     "100vh",
      display:       "flex",
      flexDirection: "column",
      alignItems:    "center",
      justifyContent:"center",
      padding:       "40px 24px",
      position:      "relative",
      overflow:      "hidden",
    }}>

      {/* ── CSS Keyframes ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes orbitSpin1 {
          from { transform: rotateX(72deg) rotateZ(0deg); }
          to   { transform: rotateX(72deg) rotateZ(360deg); }
        }
        @keyframes orbitSpin2 {
          from { transform: rotate(-28deg) rotateY(0deg); }
          to   { transform: rotate(-28deg) rotateY(360deg); }
        }
        @keyframes orbitSpin3 {
          from { transform: rotate(28deg) rotateY(0deg); }
          to   { transform: rotate(28deg) rotateY(360deg); }
        }
        @keyframes nodePulse {
          0%,100% { opacity: 0.55; r: 2.2; }
          50%     { opacity: 1;    r: 2.8; }
        }
        @keyframes globeBreathe {
          0%,100% { transform: scale(1);    opacity: 0.92; }
          50%     { transform: scale(1.04); opacity: 1;    }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-100%); opacity: 0; }
          10%  { opacity: 0.12; }
          90%  { opacity: 0.12; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .sapi-line-1 {
          opacity: 0;
          animation: fadeSlideUp 0.55s ease forwards;
          animation-delay: 0.35s;
        }
        .sapi-line-2 {
          opacity: 0;
          animation: fadeSlideUp 0.55s ease forwards;
          animation-delay: 0.9s;
        }
        .sapi-line-3 {
          opacity: 0;
          animation: fadeSlideUp 0.55s ease forwards;
          animation-delay: 1.45s;
        }
      `}</style>

      {/* ── Ambient scan line (subtle atmosphere) ──────────────────────── */}
      <div style={{
        position:     "absolute",
        top:          0, left: 0, right: 0,
        height:       "2px",
        background:   `linear-gradient(90deg, transparent 0%, ${C.gold} 50%, transparent 100%)`,
        opacity:      0,
        pointerEvents:"none",
        animation:    "scanLine 3.6s ease-in-out 0.2s 1 forwards",
      }} />

      {/* ── Radial glow behind globe ────────────────────────────────────── */}
      <div style={{
        position:      "absolute",
        top:           "50%", left: "50%",
        transform:     "translate(-50%, -68%)",
        width:         240, height: 240,
        borderRadius:  "50%",
        background:    `radial-gradient(circle, rgba(201,150,58,0.08) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* ── SAPI Globe ──────────────────────────────────────────────────── */}
      <div style={{
        marginBottom: 36,
        animation:    "globeBreathe 2.8s ease-in-out infinite",
      }}>
        <SAPIGlobeAnimated size={96} />
      </div>

      {/* ── SAPI wordmark ───────────────────────────────────────────────── */}
      <div style={{
        marginBottom: 40, textAlign: "center",
      }}>
        <div style={{
          fontFamily:    "Georgia, serif",
          fontSize:      11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color:         C.muted,
          opacity:       0.55,
        }}>
          The Sovereign AI Power Index
        </div>
      </div>

      {/* ── Status text sequence ────────────────────────────────────────── */}
      <div style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            12,
        marginBottom:   48,
        textAlign:      "center",
      }}>
        <span className="sapi-line-1" style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      13,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color:         C.muted,
        }}>
          Analysing sovereign AI readiness...
        </span>
        <span className="sapi-line-2" style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      13,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color:         C.muted,
        }}>
          Computing dimension scores...
        </span>
        <span className="sapi-line-3" style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      13,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color:         C.muted,
        }}>
          Generating composite SAPI index...
        </span>
      </div>

      {/* ── Five dimension bars ─────────────────────────────────────────── */}
      <div style={{
        width:    "100%",
        maxWidth: 500,
        display:  "flex",
        flexDirection: "column",
        gap:      14,
        padding:  "24px 28px",
        background: C.navy,
        borderRadius: 10,
        border:   `1px solid ${C.bronzeHi}`,
        marginBottom: 40,
      }}>
        {/* Panel header */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          paddingBottom:  12,
          borderBottom:   `1px solid ${C.bronze}`,
          marginBottom:   4,
        }}>
          <span style={{
            fontFamily:    "system-ui, sans-serif",
            fontSize:      10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color:         C.muted,
            opacity:       0.6,
          }}>
            Dimension Analysis
          </span>
          <span style={{
            fontFamily:    "system-ui, sans-serif",
            fontSize:      10,
            letterSpacing: "0.14em",
            color:         C.gold,
            opacity:       0.7,
          }}>
            Tier 1 · 30 Indicators
          </span>
        </div>

        {DIMENSIONS.map((dim, i) => (
          <DimBar
            key={dim.shortCode}
            dim={dim}
            score={dimScores[i]}
            active={barsActive}
            staggerIndex={i}
          />
        ))}
      </div>

      {/* ── Assessment complete ─────────────────────────────────────────── */}
      <div style={{
        opacity:    completeActive ? 1 : 0,
        transform:  completeActive ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        textAlign:  "center",
      }}>
        <div style={{
          display:       "flex",
          alignItems:    "center",
          gap:           10,
          justifyContent:"center",
          marginBottom:  8,
        }}>
          {/* Tiny gold chevron decoration */}
          <div style={{
            width: 28, height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold})`,
          }} />
          <span style={{
            fontFamily:    "Georgia, serif",
            fontSize:      15,
            color:         C.parchment,
            letterSpacing: "0.1em",
          }}>
            Assessment complete.
          </span>
          <div style={{
            width: 28, height: 1,
            background: `linear-gradient(90deg, ${C.gold}, transparent)`,
          }} />
        </div>
        <div style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      11,
          letterSpacing: "0.12em",
          color:         C.muted,
          opacity:       0.6,
          textTransform: "uppercase",
        }}>
          Preparing your SAPI report...
        </div>
      </div>

    </div>
  );
}

// ── Demo wrapper (standalone preview) ────────────────────────────────────────
export function SAPICalculatingDemo() {
  const [appState, setAppState] = useState({
    orgProfile:     {},
    answers: {
      // D1 – Compute Capacity (Q1–Q5)
      Q1: 75, Q2: 70, Q3: 65, Q4: 50, Q5: 40,
      // D2 – Capital Formation (Q6–Q11)
      Q6: 55, Q7: 60, Q8: 45, Q9: 50, Q10: 40, Q11: 35,
      // D3 – Regulatory Readiness (Q12–Q18)
      Q12: 65, Q13: 50, Q14: 55, Q15: 60, Q16: 45, Q17: 55, Q18: 50,
      // D4 – Data Sovereignty (Q19–Q24)
      Q19: 35, Q20: 40, Q21: 50, Q22: 45, Q23: 35, Q24: 65,
      // D5 – Directed Intelligence Maturity (Q25–Q30)
      Q25: 65, Q26: 60, Q27: 55, Q28: 50, Q29: 45, Q30: 60,
    },
    scores:         {},
    compositeScore: null,
    tier:           null,
  });

  const [currentPage, setCurrentPage] = useState("calculating");

  function handleSetPage(page) {
    // In demo: show final state instead of navigating
    if (page === "results") {
      setCurrentPage("results_stub");
    }
  }

  if (currentPage === "results_stub") {
    const { composite } = computeAllScores(appState.answers);
    const tier = getTier(composite);
    return (
      <div style={{
        background:     C.void,
        minHeight:      "100vh",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        gap:            16,
        padding:        32,
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Navigation target
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 48, color: C.paleGold }}>
          {composite.toFixed(1)}
        </div>
        <div style={{
          fontFamily: "system-ui", fontSize: 13, letterSpacing: "0.14em",
          textTransform: "uppercase", color: tier.color,
        }}>
          {tier.label}
        </div>
        <div style={{ fontFamily: "system-ui", fontSize: 12, color: C.muted, marginTop: 8 }}>
          Page would now render: <strong style={{ color: C.parchment }}>results</strong>
        </div>
        <button
          onClick={() => {
            setAppState(prev => ({ ...prev, scores: {}, compositeScore: null, tier: null }));
            setCurrentPage("calculating");
          }}
          style={{
            marginTop: 24, padding: "10px 24px",
            background: "transparent",
            border: `1px solid ${C.gold}`,
            borderRadius: 4, color: C.gold,
            fontFamily: "system-ui", fontSize: 12,
            letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Replay animation
        </button>
      </div>
    );
  }

  return (
    <SAPICalculating
      appState={appState}
      setAppState={setAppState}
      setCurrentPage={handleSetPage}
    />
  );
}
