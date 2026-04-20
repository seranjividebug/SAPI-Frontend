import { useState, useEffect, useRef } from "react";
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

// ── Score Bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score, color }) {
  return (
    <div className="relative h-1 rounded-[2px] bg-white/[0.06] overflow-hidden flex-1 min-w-[80px]">
      <div
        className="absolute left-0 top-0 bottom-0 rounded-[2px] opacity-75 transition-[width] duration-[0.4s] ease-[ease]"
        style={{ width: `${Math.max(score, 2)}%`, background: color }}
      />
    </div>
  );
}

// ── Sub-indicator row ─────────────────────────────────────────────────────────
function SubIndicatorRow({ name, score, isPrimaryGap }) {
  const color = getScoreColor(score);
  return (
    <div
      className="flex items-center gap-4 py-2"
      style={{ borderBottom: `1px solid ${C.bronze}` }}
    >
      {/* Gap marker */}
      <div
        className="w-[3px] h-7 rounded-[2px] flex-shrink-0"
        style={{ background: isPrimaryGap ? C.crimson : "transparent" }}
      />

      {/* Name */}
      <div
        className="font-sans text-[13.5px] tracking-[0.02em] min-w-[190px] leading-[1.3]"
        style={{ color: isPrimaryGap ? C.parchment : C.muted }}
      >
        {name}
        {isPrimaryGap && (
          <span
            className="inline-block ml-2 font-sans text-[10px] tracking-[0.14em] uppercase px-1.5 py-0.5 rounded-[2px]"
            style={{ color: C.crimson, background: "rgba(192,48,88,0.12)" }}
          >
            Primary Gap
          </span>
        )}
      </div>

      {/* Score bar */}
      <ScoreBar score={score} color={color} />

      {/* Score value */}
      <div
        className="font-sans text-[15px] min-w-[36px] text-right font-medium"
        style={{ color: isPrimaryGap ? C.crimson : color, opacity: isPrimaryGap ? 1 : 0.85 }}
      >
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
        className="w-full border-none cursor-pointer px-6 py-5 flex items-center gap-5 transition-colors text-left"
        style={{
          background: isOpen ? C.midnight : (hovered ? "rgba(26,21,64,0.6)" : C.navy),
        }}
      >
        {/* Dimension number */}
        <div
          className="font-sans text-[24px] leading-none min-w-7 flex-shrink-0 font-medium"
          style={{ color: isOpen ? C.paleGold : C.gold, opacity: isOpen ? 0.9 : 0.6 }}
        >
          D{dim.number}
        </div>

        {/* Name + weight */}
        <div className="flex-1">
          <div className="font-serif text-[15px] text-sapi-parchment tracking-[0.03em] leading-[1.25] mb-0.5">
            {dim.name}
          </div>
          <div className="font-sans text-[11px] tracking-[0.2em] uppercase text-sapi-muted opacity-50">
            Weight {dim.weight} · {dim.subIndicators.length} sub-indicators
          </div>
        </div>

        {/* Score */}
        <div className="text-right mr-4 flex-shrink-0">
          <div
            className="font-sans text-[28px] leading-none font-medium"
            style={{ color: isOpen ? band.color : C.paleGold }}
          >
            {Number(dimScore).toFixed(1)}
          </div>
          <div className="font-sans text-[10px] tracking-[0.12em] text-sapi-muted opacity-45 mt-0.5">
            / 100
          </div>
        </div>

        {/* Band pill */}
        <div
          className="font-sans text-[10.5px] tracking-[0.18em] uppercase pl-4 pr-2.5 py-1 rounded-[3px] min-w-[62px] text-center flex-shrink-0"
          style={{
            color: band.color,
            background: band.bg,
            border: `1px solid ${band.color}22`,
          }}
        >
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
        <div
          className="py-7 pl-14 pr-7 pb-8"
          style={{ background: C.void, borderTop: `1px solid ${C.bronze}` }}
        >
          {/* Top row: large score + band classification */}
          <div className="flex gap-6 mb-7">
            {/* Score hero */}
            <div
              className="text-center min-w-[110px] flex-shrink-0 py-5 px-7"
              style={{
                background: C.navy,
                border: `1px solid ${C.bronze}`,
                borderTop: `2.5px solid ${band.color}`,
                borderRadius: 6,
              }}
            >
              <div className="font-sans text-[10.5px] tracking-[0.22em] uppercase text-sapi-muted opacity-50 mb-2">
                Dimension Score
              </div>
              <div
                className="font-sans text-[46px] leading-none mb-1 font-medium"
                style={{ color: band.color }}
              >
                {Number(dimScore).toFixed(1)}
              </div>
              <div
                className="inline-block font-sans text-[11px] tracking-[0.16em] uppercase px-2.5 py-0.5 rounded-[2px]"
                style={{ color: band.color, background: band.bg }}
              >
                {band.label} Band
              </div>
            </div>

            {/* Band classification + description */}
            <div
              className="flex-1 py-5 pl-5 px-5.5"
              style={{
                background: C.navy,
                border: `1px solid ${C.bronze}`,
                borderLeft: `3px solid ${band.color}`,
                borderRadius: 6,
              }}
            >
              <div
                className="font-sans text-[11px] tracking-[0.22em] uppercase mb-2.5 opacity-80"
                style={{ color: band.color }}
              >
                Band Classification · {band.label} (
                {band.label === "High" ? "65–100" : band.label === "Medium" ? "40–64" : "1–39"}
                )
              </div>
              <p className="font-serif text-[15px] text-sapi-parchment leading-[1.8] m-0 tracking-[0.01em]">
                {bandDesc}
              </p>

              {/* Primary gap callout */}
              <div className="mt-3.5 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5" stroke={C.crimson} strokeWidth="1" />
                  <path d="M6 3.5V6.5" stroke={C.crimson} strokeWidth="1.1" strokeLinecap="round" />
                  <circle cx="6" cy="8.5" r="0.6" fill={C.crimson} />
                </svg>
                <span className="font-sans text-[13px] text-sapi-crimson tracking-[0.02em]">
                  Primary gap:{" "}
                  <strong className="font-medium">
                    {primaryGap.name}
                  </strong>{" "}
                  ({Number(primaryGapScore).toFixed(0)})
                </span>
              </div>
            </div>
          </div>

          {/* Sub-indicators table */}
          <div className="mb-6">
            <div
              className="font-sans text-[11px] tracking-[0.22em] uppercase text-sapi-muted opacity-50 mb-1 pl-5 flex items-center gap-4"
            >
              <span className="min-w-[190px]">Sub-Indicator</span>
              <span className="flex-1">Score Distribution</span>
              <span className="min-w-[36px] text-right">Score</span>
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
          <div
            className="flex items-start gap-3 py-5 px-4.5 rounded"
            style={{
              background: C.navy,
              border: `1px solid ${C.bronze}`,
              borderLeft: `3px solid rgba(201,150,58,0.45)`,
            }}
          >
            {/* Icon */}
            <svg width="18" height="18" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 pl-2">
              <circle cx="7.5" cy="7.5" r="6.5" stroke={C.gold} strokeWidth="1" opacity="0.7" />
              <path d="M7.5 4.5V8" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
              <circle cx="7.5" cy="10.2" r="0.7" fill={C.gold} opacity="0.7" />
            </svg>
            <div>
              <div className="font-sans text-[10.5px] tracking-[0.2em] uppercase text-sapi-gold opacity-60 mb-1">
                Priority Intervention · {band.label} Band
              </div>
              <p className="font-sans text-[13px] text-sapi-parchment leading-[1.65] m-0 tracking-[0.015em] opacity-85">
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
  return <div className="h-px bg-sapi-bronze my-8" />;
}

// ── P8 Main ───────────────────────────────────────────────────────────────────
export default function SAPIScorecard({ appState: passedState, setAppState, setCurrentPage }) {
  const navigate = useNavigate();

  // API data states
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("sapi_current_user") || "{}");
  const email = currentUser.email || "";
  const firstLetter = email.charAt(0).toUpperCase() || "U";

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center">
        <div className="font-sans text-[15px] text-sapi-muted tracking-[0.1em] mt-6">
          Loading scorecard data…
        </div>
      </div>
    );
  }

  if (error || !appState) {
    return (
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center p-10">
        <div className="font-serif text-[19px] text-sapi-crimson mt-6 mb-4">
          {error || "Unable to load scorecard"}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-sapi-gold text-sapi-void border-none px-6 py-3 font-sans text-[13px] cursor-pointer rounded hover:opacity-90"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sapi-void font-sans">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div
        style={{ background: C.navy, borderBottom: `1px solid ${C.bronze}` }}
      >
        <div className="max-w-[1100px] mx-auto pl-3 pr-10 h-[67px] flex items-center justify-between mt-1 mb-3">
          <div className="flex items-center gap-3.5">
            <img
              src="/SAPI_Logo_B4.svg"
              alt="SAPI Logo"
              className="h-40 w-40 object-contain"
            />
            <div>
              <div
                className="font-serif text-[11.5px] tracking-[0.3em] uppercase opacity-88"
                style={{ color: C.parchment }}
              >
                The Sovereign AI Power Index
              </div>
              <div
                className="font-sans text-[10.5px] tracking-[0.22em] uppercase text-sapi-gold opacity-60 mt-0.5"
              >
                Dimension Scorecard
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <div
                className="font-serif text-[15px] tracking-[0.04em] opacity-90"
                style={{ color: C.parchment }}
              >
                {nationName}
              </div>
              <div
                className="font-sans text-[10.5px] text-sapi-muted opacity-50 tracking-[0.1em] uppercase mt-0.5"
              >
                {date} · Tier 1
              </div>
            </div>
            {/* <div
              className="font-serif text-[11.5px] tracking-[0.15em] text-sapi-muted px-2.5 py-1 uppercase opacity-70"
              style={{ border: `1px solid ${C.bronze}` }}
            >
              Classification: Restricted
            </div> */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 text-sapi-parchment focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-sapi-gold flex items-center justify-center text-sapi-void font-sans text-sm font-medium">
                  {firstLetter}
                </div>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-[#0a0a12] border border-sapi-bronze rounded-md shadow-lg z-50">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-sapi-parchment hover:bg-sapi-navy transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-10 py-10 pb-22">

        {/* ── Back + Page title ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-9">
          <div>
            <button
              onClick={() => nav("results")}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              className="bg-transparent border-none cursor-pointer p-0 font-sans text-[13px] tracking-[0.14em] uppercase flex items-center gap-1.5 mb-4 transition-colors"
              style={{ color: backHover ? C.gold : C.muted }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2.5L4.5 7L9 11.5"
                  stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
              Back to Results
            </button>

            <h1
              className="font-serif text-[30px] font-normal tracking-[0.04em] m-0 leading-[1.2]"
              style={{ color: C.parchment }}
            >
              Dimension Scorecard
            </h1>
            <div
              className="font-sans text-[13px] text-sapi-muted mt-1.5 tracking-[0.02em] leading-[1.55]"
            >
              Sub-indicator breakdown · Gap identification · Intervention priorities
              <span
                className="inline-block ml-3 text-[13px] text-sapi-paleGold opacity-65"
              >
                {nationName}
              </span>
            </div>
          </div>

          {/* Expand / Collapse all */}
          <button
            onClick={toggleAll}
            onMouseEnter={() => setExpandAllHover(true)}
            onMouseLeave={() => setExpandAllHover(false)}
            className="bg-transparent px-4.5 py-2.5 font-sans text-[11.5px] tracking-[0.2em] uppercase cursor-pointer rounded flex-shrink-0 transition-all"
            style={{
              border: `1px solid ${expandAllHover ? "rgba(152,128,176,0.5)" : C.bronze}`,
              color: expandAllHover ? C.parchment : C.muted,
              marginTop: 38,
            }}
          >
            {allOpen ? "Collapse All" : "Expand All"}
          </button>
        </div>

        {/* ── Summary score strip ───────────────────────────────────────── */}
        <div
          className="rounded-md py-5 px-7 flex items-center gap-0 mb-8 overflow-hidden relative"
          style={{ background: C.navy, border: `1px solid ${C.bronzeHi}` }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(201,150,58,0.04) 0%, transparent 55%)" }}
          />

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
                className="flex-1 py-1 px-5 cursor-pointer text-center"
                style={{ borderRight: isLast ? "none" : `1px solid ${C.bronze}` }}
              >
                <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-sapi-muted opacity-45 mb-1.5">
                  {dim.code}
                </div>
                <div
                  className="font-sans text-[24px] leading-none mb-1 font-medium"
                  style={{ color: band.color }}
                >
                  {Number(score).toFixed(1)}
                </div>
                <div className="font-sans text-[11px] text-sapi-muted tracking-[0.01em] mb-2 opacity-65">
                  {dim.name.split(" ").map((w, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {w}
                    </span>
                  ))}
                </div>
                {/* Mini bar */}
                <div className="h-[2.5px] rounded-[2px] bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-[2px] opacity-70"
                    style={{ width: `${score}%`, background: band.color }}
                  />
                </div>
                <div
                  className="font-sans text-[10px] tracking-[0.14em] uppercase mt-1 opacity-75"
                  style={{ color: band.color }}
                >
                  {band.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Instruction note ─────────────────────────────────────────── */}
        <div className="font-sans text-[13px] text-sapi-muted opacity-50 tracking-[0.02em] mb-5 italic">
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
        <div
          className="rounded py-4 px-5.5 flex gap-3.5 items-start mb-8"
          style={{ background: C.navy, border: `1px solid ${C.bronze}` }}
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none" className="flex-shrink-0 mt-0.5 pl-2">
            <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="0.9" opacity="0.5" />
            <path d="M7 4V7.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
            <circle cx="7" cy="9.5" r="0.6" fill="white" opacity="0.5" />
          </svg>
          <p className="font-sans text-[13px] text-sapi-muted opacity-60 leading-[1.65] m-0 tracking-[0.015em]">
            Sub-indicator scores are derived directly from individual question responses.
            Dimension scores represent arithmetic means across their respective question sets.
            Composite SAPI score is computed as a geometric mean weighted by dimension coefficients.
            Tier 1 assessment is automated and indicative — Tier 2 and above apply practitioner validation.
          </p>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div className="flex justify-end items-center gap-3.5">
          <button
            onClick={() => nav("results")}
            className="bg-transparent text-sapi-muted border border-sapi-muted/30 px-7 py-3.5 font-sans text-[12px] tracking-[0.22em] uppercase font-medium cursor-pointer rounded transition-colors hover:text-sapi-parchment hover:border-sapi-muted/55"
          >
            ← Back to Results
          </button>

          <button
            onClick={() => nav("roadmap")}
            onMouseEnter={() => setRoadmapHover(true)}
            onMouseLeave={() => setRoadmapHover(false)}
            className="bg-sapi-gold text-sapi-void border-none px-9 py-3.5 font-sans text-[12px] tracking-[0.22em] uppercase font-medium cursor-pointer rounded transition-colors hover:bg-[#B8862A]"
          >
            View 12–18 Month Roadmap →
          </button>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="mt-13 pt-5 border-t border-sapi-bronze flex justify-between items-center">
          <div className="font-sans text-[10.5px] text-sapi-muted opacity-40 tracking-[0.12em] uppercase">
            Classification: Restricted · Tier 1 Automated Assessment · Sub-Indicator Analysis
          </div>
          <div className="font-sans text-[10.5px] text-sapi-muted opacity-40 tracking-[0.1em]">
            SAPI © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
