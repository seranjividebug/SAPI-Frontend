import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAssessmentResults } from "../services/assessmentService";

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
  emerald:   "#28A868",
  amber:     "#F0C050",
  crimson:   "#C03058",
  blue:      "#4A7AE0",
};

// ── Dimension & sub-indicator definitions ────────────────────────────────────
const DIMENSIONS = [
  {
    code: "D1",
    number: 1,
    name: "Compute Capacity",
    weight: "17.5%",
    questionRange: [1, 5],
    subIndicators: [
      { qId: "Q1",  name: "GPU/TPU Density" },
      { qId: "Q2",  name: "Sovereign Compute Ratio" },
      { qId: "Q3",  name: "Energy Sovereignty" },
      { qId: "Q4",  name: "Semiconductor Supply Chain" },
      { qId: "Q5",  name: "Data Centre Capacity" },
    ],
    interventions: {
      Low:    "Commission a national compute audit to map current GPU/TPU assets and energy capacity.",
      Medium: "Establish a National Compute Authority to coordinate procurement and benchmarking.",
      High:   "Optimise existing compute for cost-per-inference efficiency.",
    },
    bandDescriptions: {
      Low:    "Critical compute infrastructure gaps. Sovereign AI operations are severely constrained by dependency on foreign or commercial cloud providers.",
      Medium: "Foundational compute capacity is established but sovereign coverage, energy resilience, or supply chain independence remain underdeveloped.",
      High:   "Compute posture is strong. Focus should shift to efficiency optimisation, renewable integration, and strategic stockpile programmes.",
    },
  },
  {
    code: "D2",
    number: 2,
    name: "Capital Formation",
    weight: "22.5%",
    questionRange: [6, 11],
    subIndicators: [
      { qId: "Q6",  name: "Govt AI Budget" },
      { qId: "Q7",  name: "SWF AI Exposure" },
      { qId: "Q8",  name: "AI VC Density" },
      { qId: "Q9",  name: "DFI Readiness" },
      { qId: "Q10", name: "Capital Deployment Efficiency" },
      { qId: "Q11", name: "Long-Horizon Framework" },
    ],
    interventions: {
      Low:    "Establish a dedicated AI budget line within government R&D.",
      Medium: "Create a multi-year (5+ year) committed AI infrastructure fund.",
      High:   "Optimise capital deployment velocity (target: < 12 months from commitment to delivery).",
    },
    bandDescriptions: {
      Low:    "Insufficient capital structures to sustain sovereign AI ambitions. Budget lines, DFI vehicles, and sovereign wealth mechanisms are largely absent or nascent.",
      Medium: "Capital instruments exist but lack multi-year commitment horizons, deployment velocity, or adequate catalytic private sector engagement.",
      High:   "Capital formation is robust. Priority should shift to deployment velocity, SWF allocation expansion, and export financing capacity.",
    },
  },
  {
    code: "D3",
    number: 3,
    name: "Regulatory Readiness",
    weight: "17.5%",
    questionRange: [12, 18],
    subIndicators: [
      { qId: "Q12", name: "AI Strategy Maturity" },
      { qId: "Q13", name: "Legal Clarity" },
      { qId: "Q14", name: "Procurement Readiness" },
      { qId: "Q15", name: "Ethical Governance" },
      { qId: "Q16", name: "Standards Alignment" },
      { qId: "Q17", name: "Regulatory Coherence" },
      { qId: "Q18", name: "Strategy-to-Implementation" },
    ],
    interventions: {
      Low:    "Publish a national AI strategy with measurable objectives and institutional ownership.",
      Medium: "Enact AI-specific legislation covering liability and IP.",
      High:   "Achieve > 60% strategy-to-implementation ratio.",
    },
    bandDescriptions: {
      Low:    "Governance foundations are largely absent. No enforceable AI strategy, limited legal clarity, and institutional ownership gaps create systemic risk.",
      Medium: "A governance framework exists in outline but lacks statutory authority, procurement operationalisation, and international standards integration.",
      High:   "Regulatory posture is mature. Effort should focus on strategy-implementation coherence, international leadership, and algorithmic impact frameworks.",
    },
  },
  {
    code: "D4",
    number: 4,
    name: "Data Sovereignty",
    weight: "12.5%",
    questionRange: [19, 24],
    subIndicators: [
      { qId: "Q19", name: "Data Localisation" },
      { qId: "Q20", name: "Cloud Sovereignty" },
      { qId: "Q21", name: "Cross-Border Controls" },
      { qId: "Q22", name: "Trusted Environment" },
      { qId: "Q23", name: "Data Governance Maturity" },
      { qId: "Q24", name: "AI Training Data Sovereignty" },
    ],
    interventions: {
      Low:    "Conduct a data residency audit for government workloads.",
      Medium: "Migrate majority of government workloads to sovereign cloud.",
      High:   "Achieve full sovereign cloud coverage for sensitive workloads.",
    },
    bandDescriptions: {
      Low:    "Sovereign data controls are critically underdeveloped. Foreign cloud dependency, absent localisation requirements, and cataloguing gaps expose strategic data assets.",
      Medium: "Data localisation policies are in formation but enforcement gaps, cloud migration progress, and training data supply chains remain incomplete.",
      High:   "Data sovereignty posture is strong. Emphasis should shift to comprehensive governance frameworks, real-time cataloguing, and domestic training data pipelines.",
    },
  },
  {
    code: "D5",
    number: 5,
    name: "Directed Intelligence Maturity",
    weight: "27.5%",
    questionRange: [25, 30],
    subIndicators: [
      { qId: "Q25", name: "Mission Alignment" },
      { qId: "Q26", name: "Pilot-to-Production" },
      { qId: "Q27", name: "Cross-Govt Coordination" },
      { qId: "Q28", name: "Outcome Attribution" },
      { qId: "Q29", name: "Human-Agent Governance" },
      { qId: "Q30", name: "Institutional Durability" },
    ],
    interventions: {
      Low:    "Map all AI pilots to national strategy priorities.",
      Medium: "Formalise mission alignment: sovereign priorities must drive technology selection.",
      High:   "Achieve Intelligence Fabric: real-time AI coordination across government.",
    },
    bandDescriptions: {
      Low:    "AI deployment is fragmented and unaligned with sovereign priorities. Pilots are disconnected from strategy, coordination mechanisms are absent, and outcomes go unmeasured.",
      Medium: "AI programmes exist at scale but mission alignment, pilot conversion rates, and institutional durability remain significant vulnerabilities.",
      High:   "Directed intelligence capacity is advanced. Priority focus: outcome attribution rigour, human-agent governance frameworks, and cross-political-cycle institutional continuity.",
    },
  },
];

// ── Scoring utilities ─────────────────────────────────────────────────────────
function getBand(score) {
  if (score >= 65) return { label: "High",   color: C.emerald, bg: "rgba(40,168,104,0.12)"  };
  if (score >= 40) return { label: "Medium", color: C.amber,   bg: "rgba(240,192,80,0.12)"  };
  return               { label: "Low",    color: C.crimson, bg: "rgba(192,48,88,0.12)"  };
}

function getScoreColor(score) {
  if (score >= 65) return C.emerald;
  if (score >= 40) return C.amber;
  return C.crimson;
}

// ── Demo state (used when no real appState is passed) ─────────────────────────
// eslint-disable-next-line no-unused-vars
const DEMO_ANSWERS = {
  Q1: 75, Q2: 40, Q3: 65, Q4: 50, Q5: 75,      // D1 avg ~61
  Q6: 50, Q7: 40, Q8: 25, Q9: 35, Q10: 70, Q11: 50, // D2 avg ~45
  Q12: 90, Q13: 75, Q14: 65, Q15: 75, Q16: 65, Q17: 50, Q18: 70, // D3 avg ~70
  Q19: 40, Q20: 25, Q21: 35, Q22: 40, Q23: 35, Q24: 40, // D4 avg ~36
  Q25: 50, Q26: 35, Q27: 65, Q28: 40, Q29: 70, Q30: 55, // D5 avg ~52.5
};

// eslint-disable-next-line no-unused-vars
const DEMO_SCORES = { D1: 61.0, D2: 45.0, D3: 70.0, D4: 35.8, D5: 52.5 };

// eslint-disable-next-line no-unused-vars
const DEMO_PROFILE = {
  nationName: "United Kingdom",
  assessmentDate: new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  }),
};

// ── Logo Component ───────────────────────────────────────────────────────────
function SAPILogo({ size = 34 }) {
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

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score, color }) {
  return (
    <div style={{
      position: "relative",
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,0.06)",
      overflow: "hidden",
      flex: 1,
      minWidth: 80,
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: `${Math.max(score, 2)}%`,
        background: color,
        borderRadius: 2,
        opacity: 0.75,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// ── Sub-indicator row ─────────────────────────────────────────────────────────
function SubIndicatorRow({ name, score, isPrimaryGap }) {
  const color = getScoreColor(score);
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "9px 0",
      borderBottom: `1px solid ${C.bronze}`,
    }}>
      {/* Gap marker */}
      <div style={{
        width: 3, height: 28, borderRadius: 2, flexShrink: 0,
        background: isPrimaryGap ? C.crimson : "transparent",
      }} />

      {/* Name */}
      <div style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: 11.5,
        color: isPrimaryGap ? C.parchment : C.muted,
        letterSpacing: "0.02em",
        minWidth: 190,
        lineHeight: 1.3,
      }}>
        {name}
        {isPrimaryGap && (
          <span style={{
            display: "inline-block",
            marginLeft: 8,
            fontFamily: "system-ui, sans-serif",
            fontSize: 8,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: C.crimson,
            background: "rgba(192,48,88,0.12)",
            padding: "2px 6px",
            borderRadius: 2,
          }}>
            Primary Gap
          </span>
        )}
      </div>

      {/* Score bar */}
      <ScoreBar score={score} color={color} />

      {/* Score value */}
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: 13,
        color: isPrimaryGap ? C.crimson : color,
        minWidth: 36,
        textAlign: "right",
        opacity: isPrimaryGap ? 1 : 0.85,
      }}>
        {Number(score).toFixed(0)}
      </div>
    </div>
  );
}

// ── Accordion Dimension Panel ─────────────────────────────────────────────────
function DimensionPanel({ dim, dimScore, answers, isOpen, onToggle }) {
  const band = getBand(dimScore);
  const intervention = dim.interventions[band.label];
  const bandDesc = dim.bandDescriptions[band.label];

  // Derive sub-indicator scores directly from answers
  const subScores = dim.subIndicators.map(si => answers?.[si.qId] ?? 0);
  const primaryGapIndex = subScores.indexOf(Math.min(...subScores));
  const primaryGap = dim.subIndicators[primaryGapIndex];
  const primaryGapScore = subScores[primaryGapIndex];

  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      border: `1px solid ${isOpen ? C.bronzeHi : C.bronze}`,
      borderLeft: `3px solid ${isOpen ? band.color : "rgba(107,69,8,0.35)"}`,
      borderRadius: 6,
      overflow: "hidden",
      transition: "border-color 0.2s",
      marginBottom: 10,
    }}>
      {/* ── Accordion Header ── */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "100%",
          background: isOpen ? C.midnight : (hovered ? "rgba(26,21,64,0.6)" : C.navy),
          border: "none",
          cursor: "pointer",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          transition: "background 0.15s",
          textAlign: "left",
        }}
      >
        {/* Dimension number */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 22,
          color: isOpen ? C.paleGold : C.gold,
          opacity: isOpen ? 0.9 : 0.6,
          lineHeight: 1,
          minWidth: 28,
          flexShrink: 0,
        }}>
          D{dim.number}
        </div>

        {/* Name + weight */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 14,
            color: C.parchment,
            letterSpacing: "0.03em",
            lineHeight: 1.25,
            marginBottom: 3,
          }}>
            {dim.name}
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: C.muted,
            opacity: 0.5,
          }}>
            Weight {dim.weight} · {dim.subIndicators.length} sub-indicators
          </div>
        </div>

        {/* Score */}
        <div style={{ textAlign: "right", marginRight: 16, flexShrink: 0 }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 26,
            color: isOpen ? band.color : C.paleGold,
            lineHeight: 1,
          }}>
            {Number(dimScore).toFixed(1)}
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 8,
            letterSpacing: "0.12em",
            color: C.muted,
            opacity: 0.45,
            marginTop: 2,
          }}>
            / 100
          </div>
        </div>

        {/* Band pill */}
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 8.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: band.color,
          background: band.bg,
          padding: "4px 10px",
          borderRadius: 3,
          border: `1px solid ${band.color}22`,
          minWidth: 62,
          textAlign: "center",
          flexShrink: 0,
        }}>
          {band.label}
        </div>

        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{
            flexShrink: 0,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M2.5 5L7 9.5L11.5 5"
            stroke={C.muted} strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Expanded Content ── */}
      {isOpen && (
        <div style={{
          background: C.void,
          borderTop: `1px solid ${C.bronze}`,
          padding: "28px 28px 32px",
        }}>
          {/* Top row: large score + band classification */}
          <div style={{
            display: "flex",
            gap: 24,
            marginBottom: 28,
          }}>
            {/* Score hero */}
            <div style={{
              background: C.navy,
              border: `1px solid ${C.bronze}`,
              borderTop: `2.5px solid ${band.color}`,
              borderRadius: 6,
              padding: "20px 28px",
              textAlign: "center",
              minWidth: 110,
              flexShrink: 0,
            }}>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 8.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.muted,
                opacity: 0.5,
                marginBottom: 8,
              }}>
                Dimension Score
              </div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 44,
                color: band.color,
                lineHeight: 1,
                marginBottom: 4,
              }}>
                {Number(dimScore).toFixed(1)}
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 9,
                letterSpacing: "0.16em",
                color: band.color,
                background: band.bg,
                padding: "3px 10px",
                borderRadius: 2,
                display: "inline-block",
                textTransform: "uppercase",
              }}>
                {band.label} Band
              </div>
            </div>

            {/* Band classification + description */}
            <div style={{
              flex: 1,
              background: C.navy,
              border: `1px solid ${C.bronze}`,
              borderLeft: `3px solid ${band.color}`,
              borderRadius: 6,
              padding: "20px 22px",
            }}>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: band.color,
                marginBottom: 10,
                opacity: 0.8,
              }}>
                Band Classification · {band.label} (
                {band.label === "High" ? "65–100" : band.label === "Medium" ? "40–64" : "1–39"}
                )
              </div>
              <p style={{
                fontFamily: "Georgia, serif",
                fontSize: 13,
                color: C.parchment,
                lineHeight: 1.8,
                margin: 0,
                letterSpacing: "0.01em",
              }}>
                {bandDesc}
              </p>

              {/* Primary gap callout */}
              <div style={{
                marginTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke={C.crimson} strokeWidth="1" />
                  <path d="M6 3.5V6.5" stroke={C.crimson} strokeWidth="1.1" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.6" fill={C.crimson} />
                </svg>
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 11,
                  color: C.crimson,
                  letterSpacing: "0.02em",
                }}>
                  Primary gap:{" "}
                  <strong style={{ fontWeight: 500 }}>
                    {primaryGap.name}
                  </strong>{" "}
                  ({Number(primaryGapScore).toFixed(0)})
                </span>
              </div>
            </div>
          </div>

          {/* Sub-indicators table */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 9,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.muted,
              opacity: 0.5,
              marginBottom: 4,
              paddingLeft: 19,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}>
              <span style={{ minWidth: 190 }}>Sub-Indicator</span>
              <span style={{ flex: 1 }}>Score Distribution</span>
              <span style={{ minWidth: 36, textAlign: "right" }}>Score</span>
            </div>

            {dim.subIndicators.map((si, i) => (
              <SubIndicatorRow
                key={si.qId}
                name={si.name}
                score={subScores[i]}
                isPrimaryGap={i === primaryGapIndex}
              />
            ))}
          </div>

          {/* Intervention hint */}
          <div style={{
            background: C.navy,
            border: `1px solid ${C.bronze}`,
            borderLeft: `3px solid rgba(201,150,58,0.45)`,
            borderRadius: 4,
            padding: "14px 18px",
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }}>
            {/* Icon */}
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="7.5" cy="7.5" r="6.5" stroke={C.gold} strokeWidth="1" opacity="0.7" />
              <path d="M7.5 4.5V8" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              <circle cx="7.5" cy="10.2" r="0.7" fill={C.gold} opacity="0.7" />
            </svg>
            <div>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 8.5,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: C.gold,
                opacity: 0.6,
                marginBottom: 5,
              }}>
                Priority Intervention · {band.label} Band
              </div>
              <p style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 12,
                color: C.parchment,
                lineHeight: 1.65,
                margin: 0,
                letterSpacing: "0.015em",
                opacity: 0.85,
              }}>
                {intervention}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Horizontal divider ────────────────────────────────────────────────────────
function Rule() {
  return <div style={{ height: 1, background: C.bronze, margin: "32px 0" }} />;
}

// ── P8 Main ───────────────────────────────────────────────────────────────────
export default function SAPIScorecard({ appState: passedState, setAppState, setCurrentPage }) {
  const navigate = useNavigate();
  
  // API data states
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch results from API on mount
  useEffect(() => {
    const fetchData = async () => {
      const assessmentId = localStorage.getItem('sapi_assessment_id');
      if (!assessmentId) {
        setError('No assessment found. Please complete the assessment first.');
        setLoading(false);
        return;
      }
      
      try {
        const response = await getAssessmentResults(assessmentId);
        if (response.success) {
          setApiData(response.data);
        } else {
          setError(response.error || 'Failed to load scorecard data');
        }
      } catch (err) {
        setError(err.message || 'Failed to load scorecard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Transform API response to component format
  const appState = passedState || (apiData ? {
    answers: transformApiAnswers(apiData),
    scores: {
      D1: apiData.compute_capacity,
      D2: apiData.capital_formation,
      D3: apiData.regulatory_readiness,
      D4: apiData.data_sovereignty,
      D5: apiData.directed_intelligence,
    },
    orgProfile: {
      nationName: apiData?.country || apiData?.country_name || "-",
      assessmentDate: new Date().toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      }),
    },
  } : null);
  
  // Helper to transform API answers to component format
  function transformApiAnswers(data) {
    // Map question scores from API to Q1, Q2, etc. format
    const answers = {};
    
    // Use dimension_sub_indicators if available (new API format)
    if (data.dimension_sub_indicators && Array.isArray(data.dimension_sub_indicators)) {
      data.dimension_sub_indicators.forEach((dim) => {
        if (dim.sub_indicators && Array.isArray(dim.sub_indicators)) {
          dim.sub_indicators.forEach((sub) => {
            const qKey = `Q${sub.question_id}`;
            answers[qKey] = sub.score;
          });
        }
      });
    }
    // Fallback to question_scores if dimension_sub_indicators not available
    else if (data.question_scores) {
      data.question_scores.forEach((qs, index) => {
        answers[`Q${index + 1}`] = qs.score;
      });
    }
    
    return answers;
  }
  
  const { answers = {}, scores = {}, orgProfile = {} } = appState || {};

  const nationName = orgProfile?.nationName || "Your Nation";
  const date = orgProfile?.assessmentDate ||
    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  // Open state per dimension — all collapsed by default
  const [openDims, setOpenDims] = useState({});

  function toggleDim(code) {
    setOpenDims(prev => ({ ...prev, [code]: !prev[code] }));
  }

  const nav = (page) => {
    if (typeof setCurrentPage === "function") setCurrentPage(page);
    navigate(`/${page}`);
  };

  const [backHover, setBackHover] = useState(false);
  const [roadmapHover, setRoadmapHover] = useState(false);
  const [expandAllHover, setExpandAllHover] = useState(false);

  const allOpen = DIMENSIONS.every(d => openDims[d.code]);
  function toggleAll() {
    if (allOpen) {
      setOpenDims({});
    } else {
      const newState = {};
      DIMENSIONS.forEach(d => { newState[d.code] = true; });
      setOpenDims(newState);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SAPILogo size={64} />
        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 14, color: C.muted, letterSpacing: "0.1em", marginTop: 24 }}>
          Loading scorecard data…
        </div>
      </div>
    );
  }

  if (error || !appState) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <SAPILogo size={64} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: C.crimson, marginTop: 24, marginBottom: 16 }}>
          {error || "Unable to load scorecard"}
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{ background: C.gold, color: C.void, border: "none", padding: "12px 24px", fontFamily: "system-ui, sans-serif", fontSize: 12, cursor: "pointer", borderRadius: 3 }}
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.void, fontFamily: "system-ui, sans-serif" }}>

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{
        background: C.navy,
        borderBottom: `1px solid ${C.bronze}`,
        padding: "0 40px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SAPILogo size={34} />
            <div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 9.5,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.parchment,
                opacity: 0.88,
              }}>
                The Sovereign AI Power Index
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 8.5,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: C.gold,
                opacity: 0.6,
                marginTop: 2,
              }}>
                Dimension Scorecard
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: 13,
                color: C.parchment,
                opacity: 0.9,
                letterSpacing: "0.04em",
              }}>
                {nationName}
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 8.5,
                color: C.muted,
                opacity: 0.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: 2,
              }}>
                {date} · Tier 1
              </div>
            </div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 9.5,
              letterSpacing: "0.15em",
              color: C.muted,
              border: `1px solid ${C.bronze}`,
              padding: "4px 10px",
              textTransform: "uppercase",
              opacity: 0.7,
            }}>
              Classification: Restricted
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 88px" }}>

        {/* ── Back + Page title ─────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 36,
        }}>
          <div>
            <button
              onClick={() => nav("results")}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: backHover ? C.gold : C.muted,
                fontFamily: "system-ui, sans-serif",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 16,
                transition: "color 0.15s",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2.5L4.5 7L9 11.5"
                  stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              Back to Results
            </button>

            <h1 style={{
              fontFamily: "Georgia, serif",
              fontSize: 28,
              color: C.parchment,
              fontWeight: 400,
              letterSpacing: "0.04em",
              margin: 0,
              lineHeight: 1.2,
            }}>
              Dimension Scorecard
            </h1>
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 12,
              color: C.muted,
              marginTop: 6,
              letterSpacing: "0.02em",
              lineHeight: 1.55,
            }}>
              Sub-indicator breakdown · Gap identification · Intervention priorities
              <span style={{
                display: "inline-block",
                marginLeft: 12,
                fontSize: 11,
                color: C.paleGold,
                opacity: 0.65,
              }}>
                {nationName}
              </span>
            </div>
          </div>

          {/* Expand / Collapse all */}
          <button
            onClick={toggleAll}
            onMouseEnter={() => setExpandAllHover(true)}
            onMouseLeave={() => setExpandAllHover(false)}
            style={{
              background: "transparent",
              border: `1px solid ${expandAllHover ? "rgba(152,128,176,0.5)" : C.bronze}`,
              color: expandAllHover ? C.parchment : C.muted,
              padding: "9px 18px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 9.5,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 3,
              transition: "all 0.15s",
              flexShrink: 0,
              marginTop: 38,
            }}
          >
            {allOpen ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* ── Summary score strip ───────────────────────────────────────── */}
        <div style={{
          background: C.navy,
          border: `1px solid ${C.bronzeHi}`,
          borderRadius: 6,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          gap: 0,
          marginBottom: 32,
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 10% 50%, rgba(201,150,58,0.04) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />

          {DIMENSIONS.map((dim, i) => {
            const score = scores[dim.code] ?? 0;
            const band = getBand(score);
            const isLast = i === DIMENSIONS.length - 1;
            return (
              <div
                key={dim.code}
                onClick={() => {
                  setOpenDims(prev => ({ ...prev, [dim.code]: true }));
                  // Scroll to accordion — handled visually
                }}
                style={{
                  flex: 1,
                  borderRight: isLast ? "none" : `1px solid ${C.bronze}`,
                  padding: "4px 20px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 8,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: C.muted,
                  opacity: 0.45,
                  marginBottom: 6,
                }}>
                  {dim.code}
                </div>
                <div style={{
                  fontFamily: "Georgia, serif",
                  fontSize: 24,
                  color: band.color,
                  lineHeight: 1,
                  marginBottom: 4,
                }}>
                  {Number(score).toFixed(1)}
                </div>
                <div style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 9,
                  color: C.muted,
                  letterSpacing: "0.01em",
                  marginBottom: 8,
                  opacity: 0.65,
                }}>
                  {dim.name.split(" ").map((w, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {w}
                    </span>
                  ))}
                </div>
                {/* Mini bar */}
                <div style={{
                  height: 2.5,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${score}%`,
                    background: band.color,
                    opacity: 0.7,
                    borderRadius: 2,
                  }} />
                </div>
                <div style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: band.color,
                  marginTop: 5,
                  opacity: 0.75,
                }}>
                  {band.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Instruction note ─────────────────────────────────────────── */}
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          color: C.muted,
          opacity: 0.5,
          letterSpacing: "0.02em",
          marginBottom: 20,
          fontStyle: "italic",
        }}>
          Select a dimension to view sub-indicator scores, gap analysis, and recommended interventions.
          Primary gaps are flagged in crimson.
        </div>

        {/* ── Accordion panels ─────────────────────────────────────────── */}
        <div>
          {DIMENSIONS.map((dim) => (
            <DimensionPanel
              key={dim.code}
              dim={dim}
              dimScore={scores[dim.code] ?? 0}
              answers={answers}
              isOpen={!!openDims[dim.code]}
              onToggle={() => toggleDim(dim.code)}
            />
          ))}
        </div>

        <Rule />

        {/* ── Methodology note ─────────────────────────────────────────── */}
        <div style={{
          background: C.navy,
          border: `1px solid ${C.bronze}`,
          borderRadius: 4,
          padding: "16px 22px",
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
          marginBottom: 32,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="7" cy="7" r="6" stroke={C.muted} strokeWidth="0.9" opacity="0.5" />
            <path d="M7 4V7.5" stroke={C.muted} strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
            <circle cx="7" cy="9.5" r="0.6" fill={C.muted} opacity="0.5" />
          </svg>
          <p style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 11,
            color: C.muted,
            opacity: 0.6,
            lineHeight: 1.65,
            margin: 0,
            letterSpacing: "0.015em",
          }}>
            Sub-indicator scores are derived directly from individual question responses.
            Dimension scores represent arithmetic means across their respective question sets.
            Composite SAPI score is computed as a geometric mean weighted by dimension coefficients.
            Tier 1 assessment is automated and indicative — Tier 2 and above apply practitioner validation.
          </p>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 14,
        }}>
          <button
            onClick={() => nav("results")}
            style={{
              background: "transparent",
              color: C.muted,
              border: `1px solid rgba(152,128,176,0.3)`,
              padding: "13px 28px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = C.parchment;
              e.currentTarget.style.borderColor = "rgba(152,128,176,0.55)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = C.muted;
              e.currentTarget.style.borderColor = "rgba(152,128,176,0.3)";
            }}
          >
            ← Back to Results
          </button>

          <button
            onClick={() => nav("roadmap")}
            onMouseEnter={() => setRoadmapHover(true)}
            onMouseLeave={() => setRoadmapHover(false)}
            style={{
              background: roadmapHover ? "#B8862A" : C.gold,
              color: C.void,
              border: "none",
              padding: "13px 36px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "background 0.15s",
            }}
          >
            View 12–18 Month Roadmap →
          </button>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 52,
          paddingTop: 20,
          borderTop: `1px solid ${C.bronze}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 8.5,
            color: C.muted,
            opacity: 0.4,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Classification: Restricted · Tier 1 Automated Assessment · Sub-Indicator Analysis
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 8.5,
            color: C.muted,
            opacity: 0.4,
            letterSpacing: "0.1em",
          }}>
            SAPI © {new Date().getFullYear()} · CoreIntel
          </div>
        </div>
      </div>
    </div>
  );
}
