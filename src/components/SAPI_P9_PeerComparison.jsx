import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Logo Component ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 32 }) {
  return (
    <img
      src="/logo.png"
      alt="SAPI Logo"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: 'transparent',
        borderRadius: '50%',
        padding: '2px',
        boxSizing: 'border-box',
        WebkitMaskImage: 'radial-gradient(circle, white 100%, transparent 100%)',
        maskImage: 'radial-gradient(circle, white 100%, transparent 100%)'
      }}
    />
  );
}

// ── Colour palette ───────────────────────────────────────────────────────────
const C = {
  void:      "#06030E",
  navy:      "#0F0830",
  midnight:  "#1A1540",
  gold:      "#C9963A",
  paleGold:  "#EDD98A",
  parchment: "#FBF5E6",
  muted:     "#9880B0",
  bronze:    "rgba(107,69,8,0.22)",
  bronzeStr: "rgba(107,69,8,0.40)",
  emerald:   "#28A868",
  amber:     "#F0C050",
  crimson:   "#C03058",
  blue:      "#4A7AE0",
};

// ── Dimension definitions ────────────────────────────────────────────────────
const DIMENSIONS = [
  { key: "compute",    name: "Compute Capacity",              num: "01", scoreKey: "D1" },
  { key: "capital",    name: "Capital Formation",              num: "02", scoreKey: "D2" },
  { key: "regulatory", name: "Regulatory Readiness",           num: "03", scoreKey: "D3" },
  { key: "data",       name: "Data Sovereignty",               num: "04", scoreKey: "D4" },
  { key: "di",         name: "Directed Intelligence Maturity", num: "05", scoreKey: "D5" },
];

// ── Notional peer benchmarks by development stage ────────────────────────────
// Tier 1: aggregated by development stage only. Named-country data is Tier 2.
const PEER_BENCHMARKS = {
  "Pre-conditions Unmet": {
    medians: { compute: 10, capital:  9, regulatory: 13, data:  9, di:  7 },
    topQ:    { compute: 20, capital: 17, regulatory: 24, data: 17, di: 14 },
  },
  "Nascent": {
    medians: { compute: 22, capital: 20, regulatory: 26, data: 19, di: 16 },
    topQ:    { compute: 38, capital: 34, regulatory: 44, data: 32, di: 28 },
  },
  "Developing": {
    medians: { compute: 38, capital: 35, regulatory: 42, data: 32, di: 28 },
    topQ:    { compute: 58, capital: 55, regulatory: 62, data: 50, di: 45 },
  },
  "Advanced": {
    medians: { compute: 58, capital: 55, regulatory: 62, data: 50, di: 48 },
    topQ:    { compute: 75, capital: 72, regulatory: 78, data: 68, di: 65 },
  },
  "Sovereign AI Leader": {
    medians: { compute: 75, capital: 72, regulatory: 78, data: 68, di: 65 },
    topQ:    { compute: 88, capital: 86, regulatory: 90, data: 82, di: 80 },
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function getComparisonStatus(yourScore, median) {
  const delta = yourScore - median;
  if (delta >  1.5) return { text: "Above peer median", color: C.emerald, glyph: "▲", delta: `+${Math.round(delta)}` };
  if (delta < -1.5) return { text: "Below peer median", color: C.crimson, glyph: "▼", delta: `${Math.round(delta)}`  };
  return               { text: "At peer median",    color: C.muted,   glyph: "—", delta: "0"                      };
}

// Extract a dimension score from the appState.scores object.
// Supports both array form (dimScores[i]) and keyed form ({ D1, D2, … }).
function extractScores(scores = {}) {
  // If scores is an object with D1..D5 keys
  if (typeof scores.D1 === "number") {
    return {
      compute:    scores.D1,
      capital:    scores.D2,
      regulatory: scores.D3,
      data:       scores.D4,
      di:         scores.D5,
    };
  }
  // If scores has a dimScores array (from P6 computeAllScores)
  if (Array.isArray(scores.dimScores)) {
    const [d1, d2, d3, d4, d5] = scores.dimScores;
    return { compute: d1, capital: d2, regulatory: d3, data: d4, di: d5 };
  }
  // Direct key form
  return {
    compute:    scores.compute    ?? 0,
    capital:    scores.capital    ?? 0,
    regulatory: scores.regulatory ?? 0,
    data:       scores.data       ?? 0,
    di:         scores.di         ?? 0,
  };
}

// ── Horizontal bar component ─────────────────────────────────────────────────
function HBar({ value, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{
      position: "relative",
      height: 7,
      background: "rgba(107,69,8,0.18)",
      borderRadius: 2,
      flex: 1,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: `${pct}%`,
        background: color,
        borderRadius: 2,
      }} />
    </div>
  );
}

// ── Scale tick row ───────────────────────────────────────────────────────────
function ScaleRuler() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 10,
    }}>
      {/* label column spacer */}
      <div style={{ width: 108, flexShrink: 0 }} />
      {/* tick marks */}
      <div style={{ flex: 1, position: "relative", height: 14 }}>
        {[0, 25, 50, 75, 100].map(tick => (
          <span
            key={tick}
            style={{
              position: "absolute",
              left: `${tick}%`,
              transform: "translateX(-50%)",
              fontFamily: "system-ui, sans-serif",
              fontSize: 9,
              color: C.muted,
              letterSpacing: "0.06em",
              opacity: 0.45,
              userSelect: "none",
            }}
          >
            {tick}
          </span>
        ))}
      </div>
      {/* value column spacer */}
      <div style={{ width: 30, flexShrink: 0 }} />
    </div>
  );
}

// ── Single dimension comparison row ─────────────────────────────────────────
function DimensionRow({ dim, yourScore, median, topQ }) {
  const status = getComparisonStatus(yourScore, median);

  const barRows = [
    { label: "Your Score",   value: yourScore, color: C.gold    },
    { label: "Peer Median",  value: median,    color: C.muted   },
    { label: "Top Quartile", value: topQ,      color: C.emerald },
  ];

  return (
    <div style={{
      background: C.navy,
      border: `1px solid ${C.bronze}`,
      padding: "20px 24px 18px",
      marginBottom: 6,
    }}>
      {/* ── Row header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 13,
            color: C.gold,
            opacity: 0.55,
          }}>
            {dim.num}
          </span>
          <span style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 15,
            color: C.parchment,
            letterSpacing: "0.01em",
          }}>
            {dim.name}
          </span>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "system-ui, sans-serif",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: status.color,
          whiteSpace: "nowrap",
        }}>
          <span style={{ fontSize: 9, opacity: 0.9 }}>{status.glyph}</span>
          <span>{status.text}</span>
          <span style={{
            fontFamily: "'Georgia', serif",
            fontSize: 11,
            letterSpacing: "0.04em",
            opacity: 0.7,
          }}>
            ({status.delta} pts)
          </span>
        </div>
      </div>

      {/* ── Bar rows ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {barRows.map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 108,
              flexShrink: 0,
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: C.muted,
              opacity: 0.7,
            }}>
              {label}
            </div>
            <HBar value={value} color={color} />
            <div style={{
              width: 30,
              flexShrink: 0,
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 13,
              color: color,
              textAlign: "right",
              letterSpacing: "-0.01em",
            }}>
              {Math.round(value)}
            </div>
          </div>
        ))}
      </div>

      <ScaleRuler />
    </div>
  );
}

// ── Shared section label ──────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      fontSize: 10,
      letterSpacing: "0.22em",
      color: C.gold,
      textTransform: "uppercase",
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

// ── Main exported component ──────────────────────────────────────────────────
export default function SAPIPeerComparison({ appState, setAppState, setCurrentPage }) {
  const navigate = useNavigate();
  
  // eslint-disable-next-line no-unused-vars
  const nav = (page) => {
    if (typeof setCurrentPage === "function") setCurrentPage(page);
    navigate(`/${page}`);
  };
  
  const [upgradeHover, setUpgradeHover] = useState(false);
  const [backHover,    setBackHover]    = useState(false);

  const { scores = {}, orgProfile = {} } = appState || {};
  const stage = orgProfile.developmentStage || "Developing";

  // Resolve peer benchmarks (fallback to Developing if stage not found)
  const benchmarks = PEER_BENCHMARKS[stage] ?? PEER_BENCHMARKS["Developing"];

  // Normalise score keys
  const dimScores = extractScores(scores);

  return (
    <div style={{
      background: C.void,
      minHeight: "100vh",
      color: C.parchment,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${C.bronze}`, padding: "20px 0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <SAPIGlobe size={32} />
          <div style={{
            fontFamily: "'Georgia', serif", fontSize: 11, letterSpacing: "0.2em",
            color: C.parchment, textTransform: "uppercase", lineHeight: 1.5,
          }}>
            The Sovereign AI<br />Power Index
          </div>
          <div style={{
            marginLeft: "auto", fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase",
            border: `1px solid ${C.bronze}`, padding: "4px 10px",
          }}>
            Classification: Restricted
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 80px" }}>

        {/* ── Back button ── */}
        <button
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: backHover ? C.gold : C.muted,
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            letterSpacing: "0.14em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
            padding: 0, transition: "color 0.15s", marginBottom: 36,
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          onClick={() => nav("results")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Results
        </button>

        {/* ── Page heading ── */}
        <div style={{ marginBottom: 6 }}>
          <SectionLabel>Analysis Module</SectionLabel>
          <h1 style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 30,
            fontWeight: 400,
            color: C.parchment,
            margin: "0 0 16px",
            letterSpacing: "0.015em",
            lineHeight: 1.2,
          }}>
            Peer Comparison
          </h1>
        </div>

        {/* ── Stage context line ── */}
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.7,
          margin: "0 0 0",
          letterSpacing: "0.02em",
        }}>
          Your nation is assessed at the{" "}
          <span style={{ color: C.parchment, fontStyle: "italic" }}>{stage}</span>{" "}
          stage. Peer data shown below is aggregated from nations at this development stage.
          Named-country benchmarks are available at Tier 2.
        </p>

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${C.bronze}`, margin: "28px 0" }} />

        {/* ── Legend ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginBottom: 20,
          flexWrap: "wrap",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.muted,
            opacity: 0.6,
            marginRight: 4,
          }}>
            Legend
          </div>
          {[
            { color: C.gold,    label: "Your Score"   },
            { color: C.muted,   label: "Peer Median"  },
            { color: C.emerald, label: "Top Quartile" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 9, height: 9,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 11,
                color: C.muted,
                letterSpacing: "0.1em",
              }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Per-dimension rows ── */}
        <div style={{ marginBottom: 40 }}>
          {DIMENSIONS.map(dim => (
            <DimensionRow
              key={dim.key}
              dim={dim}
              yourScore={dimScores[dim.key] ?? 0}
              median={benchmarks.medians[dim.key]}
              topQ={benchmarks.topQ[dim.key]}
            />
          ))}
        </div>

        {/* ── Upgrade hook card ── */}
        <div style={{
          background: C.navy,
          border: `1px solid ${C.gold}`,
          padding: "30px 30px 28px",
          position: "relative",
        }}>
          {/* Gold top accent line */}
          <div style={{
            position: "absolute",
            top: -1, left: -1, right: -1,
            height: 2,
            background: `linear-gradient(90deg, ${C.gold} 0%, rgba(201,150,58,0.3) 100%)`,
            pointerEvents: "none",
          }} />

          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            marginBottom: 18,
            flexWrap: "wrap",
          }}>
            {/* Tier badge */}
            <div style={{
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontFamily: "system-ui, sans-serif",
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              padding: "4px 10px",
              flexShrink: 0,
              alignSelf: "flex-start",
            }}>
              Tier 2
            </div>
            <div>
              <h3 style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: 18,
                fontWeight: 400,
                color: C.parchment,
                margin: "0 0 10px",
                letterSpacing: "0.01em",
                lineHeight: 1.35,
              }}>
                Benchmark against named peer nations
              </h3>
              <p style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 13,
                color: C.muted,
                lineHeight: 1.72,
                margin: 0,
                letterSpacing: "0.02em",
              }}>
                Tier 1 peer data is aggregated by development stage. Upgrade to Tier 2 to see
                your nation benchmarked against specific peer nations by region, income level,
                and dimension profile.
              </p>
            </div>
          </div>

          <button
            style={{
              background: upgradeHover ? "#B8862A" : C.gold,
              color: C.void,
              border: "none",
              padding: "13px 30px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "background 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={() => setUpgradeHover(true)}
            onMouseLeave={() => setUpgradeHover(false)}
            onClick={() => setCurrentPage("upgrade")}
          >
            Upgrade to Tier 2
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2L8 6L4 10" stroke={C.void} strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.bronze}` }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "18px 32px",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            color: C.muted, letterSpacing: "0.1em", opacity: 0.5,
          }}>
            © 2026 The Sovereign AI Power Index. All rights reserved.
          </span>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            color: C.muted, letterSpacing: "0.1em", opacity: 0.5,
          }}>
            SAPI · Tier 1 · v1.0
          </span>
        </div>
      </footer>

    </div>
  );
}

// ── Demo wrapper (remove in production) ─────────────────────────────────────
// Simulates a Developing-stage nation with mixed scores for design review.
export function SAPIPeerComparisonDemo() {
  const mockAppState = {
    orgProfile: { developmentStage: "Developing" },
    scores: {
      // Dimension scores on 0–100 scale
      D1: 45,   // Compute — above median (38), below top (58)
      D2: 31,   // Capital — below median (35)
      D3: 58,   // Regulatory — below top (62), at/above median (42)
      D4: 26,   // Data — below median (32)
      D5: 42,   // DI — above median (28), below top (45)
    },
  };

  return (
    <SAPIPeerComparison
      appState={mockAppState}
      setAppState={() => {}}
      setCurrentPage={() => {}}
    />
  );
}
