import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Logo Component ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 58 }) {
  return (
    <img
      src="/logo.png"
      alt="SAPI Logo"
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  );
}

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
  bronzeStr: "rgba(107,69,8,0.40)",
  emerald:   "#28A868",
  amber:     "#F0C050",
  crimson:   "#C03058",
  blue:      "#4A7AE0",
};

// ── All Five Dimension Data ───────────────────────────────────────────────────
const DIMENSION_DATA = [
  {
    number: "01",
    name: "Compute Capacity",
    insight: "The infrastructure floor — sovereign compute determines whether your AI capability is owned or merely rented.",
    definition: "Sovereign access to high-performance compute and energy infrastructure — the foundational hardware layer that determines a nation's ability to train, run, and scale AI systems independently.",
    questionCount: 5,
    subIndicators: [
      "GPU / TPU Density",
      "Energy Sovereignty",
      "Data Centre Capacity",
      "Sovereign Compute Ratio",
      "Semiconductor Supply Chain Exposure",
    ],
  },
  {
    number: "02",
    name: "Capital Formation",
    insight: "Capital is the binding constraint for most nations — this dimension separates strategic intent from execution.",
    definition: "Institutional capital available for long-horizon AI infrastructure investment — encompassing sovereign wealth deployment, public-private co-investment mechanisms, and AI-dedicated budget structures.",
    questionCount: 6,
    subIndicators: [
      "Sovereign AI Budget Allocation",
      "Public-Private Co-investment",
      "SWF / Pension Fund Exposure",
      "R&D Expenditure Intensity",
      "Foreign Direct Investment Controls",
      "AI Procurement Capacity",
    ],
  },
  {
    number: "03",
    name: "Regulatory Readiness",
    insight: "Legal clarity is what converts AI capability into public trust and deployment at scale.",
    definition: "The maturity of governance frameworks that enable public trust, legal clarity, and responsible deployment of AI systems — covering legislation, institutional capacity, and international alignment.",
    questionCount: 7,
    subIndicators: [
      "AI Legislation Status",
      "Regulatory Institutional Capacity",
      "Liability Frameworks",
      "Algorithmic Accountability",
      "International Standards Alignment",
      "Digital Identity Infrastructure",
      "Cybersecurity Governance",
    ],
  },
  {
    number: "04",
    name: "Data Sovereignty",
    insight: "Your AI systems are only as sovereign as the data they learn from.",
    definition: "National control over the data AI systems learn from and act upon — encompassing data localisation, cross-border transfer governance, and the strategic integrity of national data assets.",
    questionCount: 6,
    subIndicators: [
      "Data Localisation Policy",
      "Cross-border Transfer Controls",
      "National Data Strategy",
      "Open Government Data Maturity",
      "Biometric & Sensitive Data Regime",
      "Strategic Data Asset Inventory",
    ],
  },
  {
    number: "05",
    name: "Directed Intelligence Maturity",
    insight: "Most nations possess latent AI capability that never becomes coordinated state action. This dimension measures the gap.",
    definition: "How effectively your nation converts AI capability into coordinated state action — measuring deployment in public services, civil service AI literacy, and the institutional capacity to direct AI as a strategic instrument.",
    questionCount: 6,
    subIndicators: [
      "Government AI Deployment",
      "Civil Service AI Literacy",
      "Central AI Coordination Body",
      "AI in National Security",
      "AI Strategy Coherence",
      "Citizen-Facing AI Services",
    ],
  },
];

// ── 5-Segment Progress Bar ────────────────────────────────────────────────────
function DimensionProgressBar({ currentIndex }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {DIMENSION_DATA.map((_, i) => {
        const isComplete = i < currentIndex;
        const isCurrent  = i === currentIndex;
        return (
          <div
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              background:   isComplete ? C.gold
                          : isCurrent  ? "transparent"
                          :              "rgba(107,69,8,0.25)",
              border:       isCurrent  ? `1px solid ${C.gold}`
                          :              "1px solid transparent",
              transition:   "background 0.2s",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Sub-indicator Chip ────────────────────────────────────────────────────────
function SubChip({ label }) {
  return (
    <div style={{
      fontFamily:    "system-ui, sans-serif",
      fontSize:      11,
      letterSpacing: "0.08em",
      color:         C.muted,
      border:        `1px solid rgba(107,69,8,0.35)`,
      background:    C.navy,
      padding:       "5px 11px",
      borderRadius:  2,
      whiteSpace:    "nowrap",
      lineHeight:    1.4,
    }}>
      {label}
    </div>
  );
}

// ── Decorative dimension glyph ────────────────────────────────────────────────
function DimGlyph({ number }) {
  // A simple SVG with the number and radiating tick marks — adds institutional gravitas
  return (
    <div style={{ position: "relative", marginBottom: 8, userSelect: "none" }}>
      {/* Large ghost number */}
      <div style={{
        fontFamily:    "'Georgia', 'Times New Roman', serif",
        fontSize:      120,
        fontWeight:    400,
        color:         C.gold,
        lineHeight:    1,
        opacity:       0.12,
        position:      "absolute",
        top:           -28,
        left:          -8,
        letterSpacing: "-0.04em",
        pointerEvents: "none",
      }}>
        {number}
      </div>
      {/* Foreground number */}
      <div style={{
        fontFamily:    "'Georgia', 'Times New Roman', serif",
        fontSize:      56,
        fontWeight:    400,
        color:         C.gold,
        lineHeight:    1,
        opacity:       0.9,
        letterSpacing: "-0.02em",
        position:      "relative",
        zIndex:        1,
      }}>
        {number}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SAPIDimIntro({ currentIndex = 0, onBegin, onBack }) {
  const navigate = useNavigate();

  const [ctaHover,  setCtaHover]  = useState(false);
  const [backHover, setBackHover] = useState(false);

  // Get dimension data based on currentIndex prop
  const dim = DIMENSION_DATA[currentIndex] || DIMENSION_DATA[0];
  const isFirst = currentIndex === 0;

  function handleBegin() {
    if (onBegin) {
      onBegin();
    } else {
      navigate('/quiz');
    }
  }

  function handleBack() {
    if (onBack) {
      onBack();
    } else {
      if (currentIndex === 0) {
        navigate('/briefing');
      } else {
        navigate('/briefing');
      }
    }
  }

  return (
    <div style={{
      background: C.void,
      minHeight:  "100vh",
      color:      C.parchment,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${C.bronze}`, padding: "20px 0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <SAPIGlobe size={48} />
          <div style={{
            fontFamily:    "'Georgia', serif",
            fontSize:      11,
            letterSpacing: "0.2em",
            color:         C.parchment,
            textTransform: "uppercase",
            lineHeight:    1.5,
          }}>
            The Sovereign AI<br />Power Index
          </div>
          <div style={{
            marginLeft:    "auto",
            fontFamily:    "system-ui, sans-serif",
            fontSize:      10,
            letterSpacing: "0.16em",
            color:         C.muted,
            textTransform: "uppercase",
            border:        `1px solid ${C.bronze}`,
            padding:       "4px 10px",
          }}>
            Tier 1 · Free Assessment
          </div>
        </div>
      </header>

      {/* ── Top nav bar: back + wizard steps ── */}
      <div style={{
        maxWidth:        1100,
        margin:          "0 auto",
        padding:         "20px 32px 0",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        flexWrap:        "wrap",
        gap:             16,
      }}>
        <button
          style={{
            background:    "none",
            border:        "none",
            cursor:        "pointer",
            color:         backHover ? C.gold : C.muted,
            fontFamily:    "system-ui, sans-serif",
            fontSize:      11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            display:       "flex",
            alignItems:    "center",
            gap:           6,
            padding:       0,
            transition:    "color 0.15s",
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          onClick={handleBack}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isFirst ? "Back to Briefing" : `Back to Dimension ${currentIndex}`}
        </button>

        {/* Wizard step pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { n: 1, label: "Organisation Profile", done: true  },
            { n: 2, label: "Assessment Briefing",  done: true  },
            { n: 3, label: "Assessment",            done: false },
          ].map((step, i) => (
            <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && (
                <div style={{ width: 20, height: 1, background: C.bronze }} />
              )}
              <div style={{
                display:       "flex",
                alignItems:    "center",
                gap:           6,
                opacity:       step.done ? 0.7 : 1,
              }}>
                <div style={{
                  width:      18,
                  height:     18,
                  borderRadius: "50%",
                  background: step.done ? "rgba(201,150,58,0.18)"
                            : step.n === 3 ? C.gold : "transparent",
                  border:     step.done ? `1px solid rgba(201,150,58,0.4)`
                            : `1px solid ${C.gold}`,
                  display:    "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {step.done ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M2 4.5L3.8 6.5L7 3" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{
                      fontFamily: "system-ui, sans-serif",
                      fontSize:   9,
                      color:      step.n === 3 ? C.void : C.muted,
                      fontWeight: 500,
                    }}>
                      {step.n}
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily:    "system-ui, sans-serif",
                  fontSize:      10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color:         step.n === 3 ? C.parchment : C.muted,
                  display:       window.innerWidth < 600 ? "none" : "inline",
                }}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        maxWidth: 720,
        margin:   "0 auto",
        padding:  "52px 32px 80px",
      }}>

        {/* ── Dimension progress + label ── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            marginBottom:    10,
          }}>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color:         C.gold,
            }}>
              Dimension {currentIndex + 1} of 5
            </span>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         C.muted,
              opacity:       0.7,
            }}>
              {dim.questionCount} Questions
            </span>
          </div>
          <DimensionProgressBar currentIndex={currentIndex} />
        </div>

        {/* ── Dimension number + name ── */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <DimGlyph number={dim.number} />

          <h1 style={{
            fontFamily:    "'Georgia', 'Times New Roman', serif",
            fontSize:      32,
            fontWeight:    400,
            color:         C.parchment,
            letterSpacing: "0.04em",
            lineHeight:    1.25,
            margin:        "14px 0 0",
          }}>
            {dim.name}
          </h1>

          {/* Decorative underline rule */}
          <div style={{
            marginTop:    16,
            height:       1,
            background:   `linear-gradient(to right, ${C.gold}, rgba(201,150,58,0.08))`,
            maxWidth:     240,
          }} />
        </div>

        {/* ── Weight badge ── */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           7,
            border:        `1px solid rgba(201,150,58,0.45)`,
            borderRadius:  2,
            padding:       "5px 12px 5px 10px",
            background:    "rgba(201,150,58,0.05)",
          }}>
            {/* Small diamond bullet */}
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
              <rect x="3.5" y="0.5" width="4.24" height="4.24" rx="0.4" transform="rotate(45 3.5 0.5)" fill={C.gold} />
            </svg>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color:         C.paleGold,
            }}>
              Weight in SAPI Composite: {dim.weight}
            </span>
          </span>
        </div>

        {/* ── Definition ── */}
        <p style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      14,
          color:         C.parchment,
          lineHeight:    1.8,
          letterSpacing: "0.015em",
          margin:        "0 0 40px",
          opacity:       0.88,
        }}>
          {dim.definition}
        </p>

        {/* ── Divider ── */}
        <div style={{
          borderTop:  `1px solid ${C.bronze}`,
          marginBottom: 32,
        }} />

        {/* ── Sub-indicators ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily:    "system-ui, sans-serif",
            fontSize:      10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color:         C.muted,
            marginBottom:  14,
            opacity:       0.7,
          }}>
            Sub-Indicators Assessed
          </div>

          <div style={{
            display:   "flex",
            flexWrap:  "wrap",
            gap:       8,
          }}>
            {dim.subIndicators.map((indicator, i) => (
              <SubChip key={i} label={indicator} />
            ))}
          </div>
        </div>

        {/* ── Contextual note card ── */}
        <div style={{
          background:   C.navy,
          border:       `1px solid ${C.bronze}`,
          borderLeft:   `3px solid rgba(201,150,58,0.35)`,
          padding:      "14px 18px",
          marginBottom: 44,
          display:      "flex",
          alignItems:   "flex-start",
          gap:          12,
        }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7.5" cy="7.5" r="6.5" stroke={C.muted} strokeWidth="1" />
            <path d="M7.5 5V7.5" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7.5" cy="10" r="0.7" fill={C.muted} />
          </svg>
          <p style={{
            fontFamily:    "system-ui, sans-serif",
            fontSize:      12,
            color:         C.muted,
            lineHeight:    1.65,
            margin:        0,
            letterSpacing: "0.02em",
          }}>
            Answer based on your nation's <em style={{ color: C.parchment, fontStyle: "italic" }}>current operational state</em>, not plans or aspirational strategies under development. Precision in your responses produces the most actionable diagnostic output.
          </p>
        </div>

        {/* ── CTA button ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            style={{
              width:         "100%",
              background:    ctaHover ? "#B8862A" : C.gold,
              color:         C.void,
              border:        "none",
              padding:       "16px 48px",
              fontFamily:    "system-ui, sans-serif",
              fontSize:      12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight:    500,
              cursor:        "pointer",
              borderRadius:  3,
              transition:    "background 0.15s",
              display:       "flex",
              alignItems:    "center",
              justifyContent: "center",
              gap:           10,
            }}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onClick={handleBegin}
          >
            Begin {dim.name} Questions
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2.5L9.5 7L5 11.5" stroke={C.void} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {!isFirst && (
            <button
              style={{
                width:         "100%",
                background:    "transparent",
                color:         backHover ? C.parchment : C.muted,
                border:        `1px solid ${backHover ? C.bronzeStr : C.bronze}`,
                padding:       "14px 48px",
                fontFamily:    "system-ui, sans-serif",
                fontSize:      12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight:    400,
                cursor:        "pointer",
                borderRadius:  3,
                transition:    "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              onClick={handleBack}
            >
              ← Back to Dimension {currentIndex}
            </button>
          )}
        </div>

        {/* ── Meta line ── */}
        <div style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      11,
          color:         C.muted,
          letterSpacing: "0.1em",
          textAlign:     "center",
          marginTop:     14,
          opacity:       0.5,
          lineHeight:    1.6,
        }}>
          {dim.questionCount} questions in this dimension &nbsp;·&nbsp; {30 - DIMENSION_DATA.slice(0, currentIndex).reduce((a, d) => a + d.questionCount, 0)} questions remaining
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

// ── Demo wrapper (remove in production) ──────────────────────────────────────
// This allows standalone preview of each dimension by cycling through them.
export function SAPIDimIntroDemo() {
  return (
    <SAPIDimIntro />
  );
}
