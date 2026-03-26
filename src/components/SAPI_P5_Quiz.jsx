import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline SVG Logo ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" stroke="white" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="29" ry="11" stroke="white" strokeWidth="1" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="1" transform="rotate(-28 32 32)" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="0.8" transform="rotate(28 32 32)" strokeDasharray="2 1.5" />
      {[[32,3],[55,20],[55,44],[32,61],[9,44],[9,20],[46,12],[18,52]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="white" />
      ))}
      <line x1="32" y1="3"  x2="55" y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="44" x2="32" y2="61" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="32" y1="61" x2="9"  y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="44" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="20" x2="32" y2="3"  stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="46" y1="12" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="18" y1="52" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="46" y1="12" x2="18" y2="52" stroke="white" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  void:       "#06030E",
  navy:       "#0F0830",
  midnight:   "#1A1540",
  gold:       "#C9963A",
  paleGold:   "#EDD98A",
  parchment:  "#FBF5E6",
  muted:      "#9880B0",
  bronze:     "rgba(107,69,8,0.22)",
  bronzeStr:  "rgba(107,69,8,0.40)",
  emerald:    "#28A868",
  amber:      "#F0C050",
  crimson:    "#C03058",
  blue:       "#4A7AE0",
};

// ── Complete question data ────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // DIMENSION 1 — COMPUTE CAPACITY
  {
    id: "Q1", dimIndex: 0, dimName: "Compute Capacity",
    text: "What is your nation's primary AI compute infrastructure?",
    options: [
      { label: "Public cloud only", score: 25 },
      { label: "Mix of cloud + on-premise", score: 50 },
      { label: "Dedicated on-premise GPU clusters", score: 75 },
      { label: "Sovereign / air-gapped compute", score: 95 },
      { label: "No dedicated AI compute", score: 5 },
    ],
  },
  {
    id: "Q2", dimIndex: 0, dimName: "Compute Capacity",
    text: "What percentage of AI workloads run within national borders?",
    options: [
      { label: "0–20%", score: 15 },
      { label: "21–50%", score: 40 },
      { label: "51–80%", score: 70 },
      { label: "81–100%", score: 95 },
    ],
  },
  {
    id: "Q3", dimIndex: 0, dimName: "Compute Capacity",
    text: "How resilient is your AI compute infrastructure to energy disruption?",
    options: [
      { label: "No energy planning", score: 10 },
      { label: "Standard commercial contracts", score: 35 },
      { label: "Dedicated energy supply agreements", score: 65 },
      { label: "National grid / renewable contracts dedicated to AI", score: 90 },
    ],
  },
  {
    id: "Q4", dimIndex: 0, dimName: "Compute Capacity",
    text: "What is your AI hardware supply chain's foreign dependency level?",
    options: [
      { label: "100% foreign, no visibility", score: 10 },
      { label: "Foreign but diversified + stockpiles", score: 30 },
      { label: "Some domestic assembly, foreign fab", score: 50 },
      { label: "Partial domestic fab or strategic alliance", score: 75 },
      { label: "Sovereign fab or guaranteed allied supply", score: 95 },
    ],
  },
  {
    id: "Q5", dimIndex: 0, dimName: "Compute Capacity",
    text: "What is your total data centre capacity dedicated to AI?",
    options: [
      { label: "No dedicated capacity", score: 5 },
      { label: "Less than 10 MW", score: 25 },
      { label: "10–50 MW", score: 50 },
      { label: "50–200 MW", score: 75 },
      { label: "More than 200 MW", score: 95 },
    ],
  },

  // DIMENSION 2 — CAPITAL FORMATION
  {
    id: "Q6", dimIndex: 1, dimName: "Capital Formation",
    text: "What percentage of your national R&D budget is allocated to AI?",
    options: [
      { label: "No dedicated AI budget", score: 5 },
      { label: "Less than 1% of R&D", score: 20 },
      { label: "1–3% of R&D", score: 45 },
      { label: "3–5% of R&D", score: 70 },
      { label: "More than 5% of R&D", score: 95 },
    ],
  },
  {
    id: "Q7", dimIndex: 1, dimName: "Capital Formation",
    text: "What is your sovereign wealth fund's AI mandate?",
    options: [
      { label: "No sovereign wealth fund", score: 5 },
      { label: "SWF exists, no AI allocation", score: 25 },
      { label: "SWF with general technology allocation", score: 55 },
      { label: "SWF with explicit AI infrastructure allocation", score: 90 },
    ],
  },
  {
    id: "Q8", dimIndex: 1, dimName: "Capital Formation",
    text: "How developed is your AI venture capital ecosystem?",
    options: [
      { label: "Minimal VC activity", score: 10 },
      { label: "Some deals, less than $500M annually", score: 35 },
      { label: "Active ecosystem $500M–$5B", score: 65 },
      { label: "Deep market over $5B + domestic LPs", score: 95 },
    ],
  },
  {
    id: "Q9", dimIndex: 1, dimName: "Capital Formation",
    text: "What is your development finance institutions' AI capability?",
    options: [
      { label: "No DFI involvement", score: 5 },
      { label: "DFI finances general tech, not AI-specific", score: 30 },
      { label: "DFI financed AI-adjacent infrastructure in past 3 years", score: 60 },
      { label: "DFI has published AI mandate + active pipeline", score: 90 },
    ],
  },
  {
    id: "Q10", dimIndex: 1, dimName: "Capital Formation",
    text: "What is the typical timeframe from AI budget commitment to delivery?",
    options: [
      { label: "More than 36 months or unknown", score: 15 },
      { label: "24–36 months", score: 40 },
      { label: "12–24 months", score: 70 },
      { label: "Less than 12 months", score: 95 },
    ],
  },
  {
    id: "Q11", dimIndex: 1, dimName: "Capital Formation",
    text: "Does your nation have a multi-year AI infrastructure funding commitment?",
    options: [
      { label: "No multi-year commitment", score: 10 },
      { label: "Exists in strategy documents, no legislative backing", score: 35 },
      { label: "Legislative / cabinet commitment 3–5 years", score: 60 },
      { label: "5–10 year committed funding with legislation", score: 95 },
    ],
  },

  // DIMENSION 3 — REGULATORY READINESS
  {
    id: "Q12", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How mature is your national AI strategy?",
    options: [
      { label: "No formal AI strategy", score: 5 },
      { label: "Published, no measurable objectives", score: 30 },
      { label: "Published with objectives, timelines, and ownership", score: 60 },
      { label: "Published, implemented, with public progress reporting", score: 90 },
    ],
  },
  {
    id: "Q13", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How clear is the legal framework for AI deployment?",
    options: [
      { label: "No AI-specific legislation", score: 10 },
      { label: "General technology law only", score: 30 },
      { label: "AI-specific legislation enacted", score: 60 },
      { label: "Comprehensive AI legislation with enforcement", score: 90 },
    ],
  },
  {
    id: "Q14", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Does your nation have a national procurement system for AI?",
    options: [
      { label: "Standard IT procurement, no AI provisions", score: 20 },
      { label: "Some AI guidelines, not widely adopted", score: 40 },
      { label: "AI-specific frameworks + pre-approved panels", score: 65 },
      { label: "Rapid AI procurement with sandbox + oversight", score: 90 },
    ],
  },
  {
    id: "Q15", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "What is your AI ethics governance architecture?",
    options: [
      { label: "No AI ethics board", score: 5 },
      { label: "Advisory body, no statutory authority", score: 30 },
      { label: "Ethics board with statutory authority", score: 60 },
      { label: "Mandatory impact assessments + algorithmic audit", score: 90 },
    ],
  },
  {
    id: "Q16", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "What is your level of participation in international AI standards?",
    options: [
      { label: "No formal participation", score: 5 },
      { label: "Formal membership, limited participation", score: 25 },
      { label: "Active working group membership (ISO/IEC JTC1/SC42)", score: 60 },
      { label: "Standards leadership: chairing groups, contributing documents", score: 90 },
    ],
  },
  {
    id: "Q17", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How effective is cross-government AI regulation coordination?",
    options: [
      { label: "Fragmented, no coordination", score: 10 },
      { label: "Some coordination, informal channels", score: 35 },
      { label: "Formal cross-ministry body with published mandate", score: 65 },
      { label: "Centralised AI governance office with authority", score: 90 },
    ],
  },
  {
    id: "Q18", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "What is your strategy-to-implementation ratio?",
    options: [
      { label: "Less than 10% implemented or no measurable milestones", score: 10 },
      { label: "10–30% implemented", score: 30 },
      { label: "31–60% implemented with evidence", score: 60 },
      { label: "More than 60% implemented with public reporting", score: 90 },
    ],
  },

  // DIMENSION 4 — DATA SOVEREIGNTY
  {
    id: "Q19", dimIndex: 3, dimName: "Data Sovereignty",
    text: "What data residency requirements does your nation enforce?",
    options: [
      { label: "No data localisation requirements", score: 10 },
      { label: "Laws exist but enforcement is limited", score: 35 },
      { label: "Enforcement for strategic / government data", score: 65 },
      { label: "Comprehensive framework, public + private sectors", score: 90 },
    ],
  },
  {
    id: "Q20", dimIndex: 3, dimName: "Data Sovereignty",
    text: "What proportion of government cloud workloads run on sovereign infrastructure?",
    options: [
      { label: "Most on commercial foreign cloud", score: 15 },
      { label: "Some on sovereign, majority on foreign", score: 40 },
      { label: "Majority on sovereign / domestic", score: 70 },
      { label: "All sensitive workloads on sovereign with air-gap", score: 95 },
    ],
  },
  {
    id: "Q21", dimIndex: 3, dimName: "Data Sovereignty",
    text: "How developed is your cross-border data transfer governance?",
    options: [
      { label: "No regulations", score: 10 },
      { label: "GDPR adequacy or bilateral framework", score: 40 },
      { label: "Active controls with enforcement for government data", score: 65 },
      { label: "Comprehensive: adequacy + contractual + technical controls", score: 90 },
    ],
  },
  {
    id: "Q22", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Do you have classified / air-gapped environments configured for AI?",
    options: [
      { label: "None exist", score: 5 },
      { label: "Classified environments exist, not AI-configured", score: 30 },
      { label: "Classified AI-ready + sovereign cloud regions", score: 65 },
      { label: "Full trusted operating environment + AI integration", score: 90 },
    ],
  },
  {
    id: "Q23", dimIndex: 3, dimName: "Data Sovereignty",
    text: "How mature is your government data governance?",
    options: [
      { label: "No formal catalogue or quality management", score: 10 },
      { label: "Some departments, no whole-of-government framework", score: 35 },
      { label: "Whole-of-government strategy + cataloguing + access controls", score: 65 },
      { label: "Mature: real-time cataloguing + quality + stewardship", score: 90 },
    ],
  },
  {
    id: "Q24", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Are your AI models trained on domestically controlled data?",
    options: [
      { label: "Foreign models, no domestic fine-tuning", score: 10 },
      { label: "Some fine-tuning, training data largely foreign", score: 35 },
      { label: "Significant domestic training data for key use cases", score: 65 },
      { label: "Sovereign AI training pipeline: domestic data + curation + training", score: 95 },
    ],
  },

  // DIMENSION 5 — DIRECTED INTELLIGENCE MATURITY
  {
    id: "Q25", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Are your AI deployments explicitly tied to sovereign priorities?",
    options: [
      { label: "Opportunistic, no link to national strategy", score: 10 },
      { label: "Some reference to priorities, mostly ad hoc", score: 35 },
      { label: "Systematically mapped to sovereign priority areas", score: 65 },
      { label: "Mission-first: sovereign priorities drive technology selection", score: 90 },
    ],
  },
  {
    id: "Q26", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "What percentage of AI initiatives have moved beyond pilot to production?",
    options: [
      { label: "Less than 5% or unknown", score: 10 },
      { label: "5–15%", score: 30 },
      { label: "16–30%", score: 60 },
      { label: "More than 30%", score: 90 },
    ],
  },
  {
    id: "Q27", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "How effective is cross-departmental AI coordination?",
    options: [
      { label: "No cross-departmental coordination", score: 5 },
      { label: "Informal coordination only", score: 30 },
      { label: "Formal body with mandate but limited authority", score: 55 },
      { label: "Systematic coordination with shared infrastructure + budgets", score: 90 },
    ],
  },
  {
    id: "Q28", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "How rigorously are outcomes attributed to AI deployments?",
    options: [
      { label: "No formal outcome measurement", score: 5 },
      { label: "Anecdotal outcomes, not systematically measured", score: 25 },
      { label: "Some deployments have documented measured outcomes", score: 55 },
      { label: "Systematic attribution: all production AI systems measured", score: 90 },
    ],
  },
  {
    id: "Q29", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "What human-agent decision governance framework exists?",
    options: [
      { label: "No human-agent governance framework", score: 5 },
      { label: "General AI ethics principles, no operational rules", score: 25 },
      { label: "Human-agent policies defined for some departments", score: 55 },
      { label: "Comprehensive framework: ratios + override + accountability per dept", score: 90 },
    ],
  },
  {
    id: "Q30", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "How durable are your AI programme institutions across leadership transitions?",
    options: [
      { label: "Programmes too new to have faced transition", score: 20 },
      { label: "Programmes disrupted by leadership / budget changes", score: 30 },
      { label: "Core programmes survived one transition with continuity", score: 60 },
      { label: "Survived multiple transitions with documented continuity", score: 90 },
    ],
  },
];

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",             shortCode: "D1", weight: "17.5%" },
  { name: "Capital Formation",            shortCode: "D2", weight: "22.5%" },
  { name: "Regulatory Readiness",         shortCode: "D3", weight: "17.5%" },
  { name: "Data Sovereignty",             shortCode: "D4", weight: "12.5%" },
  { name: "Directed Intelligence Maturity", shortCode: "D5", weight: "27.5%" },
];

// ── Scoring engine ────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const dimScore = (answers, questionIds) => {
  const scores = questionIds.map(id => answers[id] || 0);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

// eslint-disable-next-line no-unused-vars
const compositeScore = (d1, d2, d3, d4, d5) =>
  Math.pow(d1, 0.175) * Math.pow(d2, 0.225) * Math.pow(d3, 0.175) * Math.pow(d4, 0.125) * Math.pow(d5, 0.275);

// eslint-disable-next-line no-unused-vars
const getTier = (score) => {
  if (score >= 80) return { label: "Sovereign AI Leader",      color: "#28A868" };
  if (score >= 60) return { label: "Advanced",                 color: "#4A7AE0" };
  if (score >= 40) return { label: "Developing",               color: "#F0C050" };
  if (score >= 20) return { label: "Nascent",                  color: "#C9963A" };
  return               { label: "Pre-conditions Unmet",        color: "#C03058" };
};

// ── Helper: get questions for a dimension index ──────────────────────────────
const getDimQuestions = (dimIndex) =>
  ALL_QUESTIONS.filter(q => q.dimIndex === dimIndex);

// ── Overall progress tracking ────────────────────────────────────────────────
const getQuestionsBeforeDim = (dimIndex) =>
  ALL_QUESTIONS.filter(q => q.dimIndex < dimIndex).length;

// ── Dual Progress Bar ────────────────────────────────────────────────────────
function DualProgressBar({ dimIndex, questionIndexInDim, totalInDim }) {
  const dimPct        = ((questionIndexInDim + 1) / totalInDim) * 100;
  const answeredBefore = getQuestionsBeforeDim(dimIndex);
  const overallPct    = ((answeredBefore + questionIndexInDim + 1) / 30) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Dimension progress */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 5,
        }}>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: C.muted, opacity: 0.7,
          }}>
            Dimension Progress
          </span>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            color: C.gold, letterSpacing: "0.08em",
          }}>
            {questionIndexInDim + 1} / {totalInDim}
          </span>
        </div>
        <div style={{
          height: 3, background: "rgba(107,69,8,0.2)", borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${dimPct}%`,
            background: `linear-gradient(90deg, ${C.gold} 0%, #EDD98A 100%)`,
            borderRadius: 2, transition: "width 0.35s ease",
          }} />
        </div>
      </div>
      {/* Overall progress */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 5,
        }}>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: C.muted, opacity: 0.7,
          }}>
            Overall Assessment
          </span>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            color: C.muted, letterSpacing: "0.08em",
          }}>
            {answeredBefore + questionIndexInDim + 1} / 30
          </span>
        </div>
        <div style={{
          height: 3, background: "rgba(107,69,8,0.14)", borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${overallPct}%`,
            background: "rgba(201,150,58,0.35)",
            borderRadius: 2, transition: "width 0.35s ease",
          }} />
        </div>
      </div>
    </div>
  );
}

// ── 5-segment dimension stepper ───────────────────────────────────────────────
function DimensionStepper({ currentDimIndex }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {DIMENSIONS.map((dim, i) => {
        const isComplete = i < currentDimIndex;
        const isCurrent  = i === currentDimIndex;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <div style={{
              height: 3, width: "100%", borderRadius: 2,
              background:   isComplete ? C.gold
                          : isCurrent  ? "transparent"
                          :              "rgba(107,69,8,0.2)",
              border:       isCurrent  ? `1px solid ${C.gold}` : "1px solid transparent",
              transition:   "background 0.2s",
            }} />
            <span style={{
              fontFamily: "system-ui, sans-serif", fontSize: 9,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: isComplete ? C.gold : isCurrent ? C.paleGold : C.muted,
              opacity: isCurrent ? 1 : isComplete ? 0.8 : 0.4,
              whiteSpace: "nowrap",
            }}>
              {dim.shortCode}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Answer Option Card ────────────────────────────────────────────────────────
function AnswerCard({ label, optIndex, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "relative",
        display:        "flex",
        alignItems:     "flex-start",
        gap:            14,
        padding:        "15px 18px",
        background:     isSelected
                          ? "rgba(201,150,58,0.09)"
                          : hovered
                            ? "rgba(201,150,58,0.04)"
                            : C.midnight,
        border:         `1px solid ${
                          isSelected
                            ? "rgba(201,150,58,0.45)"
                            : hovered
                              ? "rgba(107,69,8,0.4)"
                              : "rgba(107,69,8,0.22)"
                        }`,
        borderLeft:     isSelected
                          ? `3px solid ${C.gold}`
                          : hovered
                            ? "3px solid rgba(201,150,58,0.3)"
                            : "3px solid transparent",
        borderRadius:   3,
        cursor:         "pointer",
        transition:     "background 0.15s, border-color 0.15s",
        userSelect:     "none",
        marginBottom:   0,
      }}
    >
      {/* Letter indicator */}
      <div style={{
        flexShrink:   0,
        width:        24,
        height:       24,
        borderRadius: 2,
        background:   isSelected ? C.gold : "rgba(107,69,8,0.2)",
        border:       `1px solid ${isSelected ? C.gold : "rgba(107,69,8,0.35)"}`,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        marginTop:    1,
        transition:   "background 0.15s, border-color 0.15s",
      }}>
        <span style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      10,
          fontWeight:    500,
          letterSpacing: "0.06em",
          color:         isSelected ? C.void : C.muted,
          lineHeight:    1,
        }}>
          {letters[optIndex]}
        </span>
      </div>

      {/* Answer text */}
      <span style={{
        fontFamily:    "system-ui, sans-serif",
        fontSize:      14,
        color:         isSelected ? C.parchment : hovered ? C.parchment : "rgba(251,245,230,0.8)",
        lineHeight:    1.55,
        letterSpacing: "0.012em",
        paddingTop:    4,
        transition:    "color 0.15s",
        flex:          1,
      }}>
        {label}
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <div style={{
          flexShrink: 0,
          marginTop:  5,
          marginLeft: 4,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke={C.gold} strokeWidth="1" />
            <path d="M4 7L6.2 9.2L10 5" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────
export default function SAPIQuiz() {
  const navigate = useNavigate();
  
  // For demo purposes, using mock data
  const dimIndex = 0;
  const dimQuestions = getDimQuestions(dimIndex);
  const [qIndex, setQIndex] = useState(0);
  const [selectedScore, setSelectedScore] = useState(null);
  const [nextHover, setNextHover]   = useState(false);
  const [backHover, setBackHover]   = useState(false);

  const currentQuestion    = dimQuestions[qIndex];
  const isLastInDim        = qIndex === dimQuestions.length - 1;
  const isLastDimension    = dimIndex === 4;
  const answeredCount      = 0; // Mock data

  // reset qIndex when dimension changes
  // (handled by setCurrentPage flow; component remounts)

  function handleSelect(score) {
    setSelectedScore(score);
    console.log("Selected score:", score);
  }

  function handleBack() {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    } else {
      navigate('/dimintro');
    }
  }

  function handleNext() {
    if (selectedScore == null) return;

    if (!isLastInDim) {
      setQIndex(qIndex + 1);
      setSelectedScore(null); // Reset selection for next question
    } else {
      // For demo purposes, navigate to calculating when dimension is complete
      navigate('/calculating');
    }
  }

  // Overall progress numbers
  const questionsBeforeDim = getQuestionsBeforeDim(dimIndex);
  const globalQNum         = questionsBeforeDim + qIndex + 1;
  const dim                = DIMENSIONS[dimIndex];

  // Next button label
  const nextLabel = !isLastInDim
    ? "Next Question"
    : isLastDimension
      ? "Complete Assessment"
      : `Continue to ${DIMENSIONS[dimIndex + 1]?.name}`;

  return (
    <div style={{
      minHeight:   "100vh",
      background:  C.void,
      display:     "flex",
      flexDirection: "column",
    }}>

      {/* ── Header ── */}
      <header style={{
        borderBottom: `1px solid rgba(107,69,8,0.18)`,
        background:   "rgba(15,8,48,0.6)",
        backdropFilter: "blur(8px)",
        position:     "sticky",
        top:          0,
        zIndex:       100,
      }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "14px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SAPIGlobe size={32} />
            <div>
              <div style={{
                fontFamily:    "'Georgia', 'Times New Roman', serif",
                fontSize:      11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         C.parchment,
                lineHeight:    1.2,
              }}>
                The Sovereign AI Power Index
              </div>
              <div style={{
                fontFamily:    "system-ui, sans-serif",
                fontSize:      10,
                letterSpacing: "0.12em",
                color:         C.muted,
                opacity:       0.65,
              }}>
                Tier 1 Assessment · {30 - globalQNum} questions remaining
              </div>
            </div>
          </div>

          {/* Q counter pill */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            background:    "rgba(201,150,58,0.08)",
            border:        `1px solid rgba(201,150,58,0.2)`,
            borderRadius:  20,
            padding:       "5px 13px",
          }}>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      11,
              color:         C.muted,
              letterSpacing: "0.08em",
            }}>
              Q
            </span>
            <span style={{
              fontFamily:    "'Georgia', 'Times New Roman', serif",
              fontSize:      16,
              color:         C.paleGold,
              lineHeight:    1,
            }}>
              {globalQNum}
            </span>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              color:         C.muted,
              opacity:       0.5,
            }}>
              / 30
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{
        flex:      1,
        maxWidth:  800,
        width:     "100%",
        margin:    "0 auto",
        padding:   "32px 24px 64px",
      }}>

        {/* ── Progress & context bar ── */}
        <div style={{
          background:   C.navy,
          border:       `1px solid ${C.bronze}`,
          borderRadius: 3,
          padding:      "18px 20px",
          marginBottom: 28,
        }}>
          {/* Dimension label row */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            justifyContent: "space-between",
            marginBottom:  16,
            flexWrap:      "wrap",
            gap:           8,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                fontFamily:    "'Georgia', 'Times New Roman', serif",
                fontSize:      13,
                color:         C.gold,
                letterSpacing: "0.04em",
              }}>
                {dim.shortCode}
              </div>
              <div style={{
                width:     1,
                height:    14,
                background: "rgba(201,150,58,0.3)",
              }} />
              <div style={{
                fontFamily:    "system-ui, sans-serif",
                fontSize:      11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color:         C.parchment,
                opacity:       0.85,
              }}>
                {dim.name}
              </div>
            </div>

            <div style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              letterSpacing: "0.12em",
              color:         C.muted,
              opacity:       0.65,
            }}>
              Dimension {dimIndex + 1} of 5&nbsp;&nbsp;·&nbsp;&nbsp;Question {qIndex + 1} of {dimQuestions.length}
            </div>
          </div>

          {/* Dimension stepper */}
          <div style={{ marginBottom: 18 }}>
            <DimensionStepper currentDimIndex={dimIndex} />
          </div>

          {/* Dual progress bar */}
          <DualProgressBar
            dimIndex={dimIndex}
            questionIndexInDim={qIndex}
            totalInDim={dimQuestions.length}
          />
        </div>

        {/* ── Question card ── */}
        <div style={{
          background:   C.navy,
          border:       `1px solid ${C.bronze}`,
          borderRadius: 3,
          padding:      "28px 28px 24px",
          marginBottom: 20,
        }}>
          {/* Question number */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           10,
            marginBottom:  20,
          }}>
            <div style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color:         C.gold,
              opacity:       0.75,
            }}>
              Question {globalQNum}
            </div>
            <div style={{
              flex:       1,
              height:     1,
              background: "rgba(201,150,58,0.15)",
            }} />
            {/* Answered indicator for dim */}
            <div style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      9,
              letterSpacing: "0.12em",
              color:         C.muted,
              opacity:       0.5,
            }}>
              {answeredCount} / {dimQuestions.length} answered in this dimension
            </div>
          </div>

          {/* Question text */}
          <p style={{
            fontFamily:    "'Georgia', 'Times New Roman', serif",
            fontSize:      17,
            color:         C.parchment,
            lineHeight:    1.7,
            letterSpacing: "0.012em",
            margin:        "0 0 28px",
            fontWeight:    400,
          }}>
            {currentQuestion.text}
          </p>

          {/* Answer cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentQuestion.options.map((opt, i) => (
              <AnswerCard
                key={i}
                label={opt.label}
                optIndex={i}
                isSelected={selectedScore === opt.score}
                onSelect={() => handleSelect(opt.score)}
              />
            ))}
          </div>
        </div>

        {/* ── Selection required notice ── */}
        {selectedScore == null && (
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           8,
            marginBottom:  20,
            opacity:       0.55,
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke={C.muted} strokeWidth="1" />
              <path d="M6 3.5V6" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="8.2" r="0.6" fill={C.muted} />
            </svg>
            <span style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      11,
              color:         C.muted,
              letterSpacing: "0.08em",
            }}>
              Select an option to proceed
            </span>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Next / Continue button */}
          <button
            disabled={selectedScore == null}
            onMouseEnter={() => setNextHover(true)}
            onMouseLeave={() => setNextHover(false)}
            onClick={handleNext}
            style={{
              width:         "100%",
              background:    selectedScore == null
                               ? "rgba(201,150,58,0.15)"
                               : nextHover
                                 ? "#B8862A"
                                 : C.gold,
              color:         selectedScore == null ? "rgba(201,150,58,0.4)" : C.void,
              border:        selectedScore == null
                               ? "1px solid rgba(201,150,58,0.2)"
                               : "none",
              padding:       "16px 48px",
              fontFamily:    "system-ui, sans-serif",
              fontSize:      12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight:    500,
              cursor:        selectedScore == null ? "not-allowed" : "pointer",
              borderRadius:  3,
              transition:    "background 0.15s, color 0.15s",
              display:       "flex",
              alignItems:    "center",
              justifyContent: "center",
              gap:           10,
            }}
          >
            {nextLabel}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M4.5 2.5L9 6.5L4.5 10.5"
                stroke={selectedScore == null ? "rgba(201,150,58,0.35)" : C.void}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Back button */}
          <button
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            onClick={handleBack}
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
          >
            ← Back
          </button>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.bronze}` }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", padding: "16px 24px",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            color: C.muted, letterSpacing: "0.1em", opacity: 0.45,
          }}>
            © 2026 The Sovereign AI Power Index. All rights reserved.
          </span>
          <span style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            color: C.muted, letterSpacing: "0.1em", opacity: 0.45,
          }}>
            SAPI · Tier 1 · v1.0
          </span>
        </div>
      </footer>

    </div>
  );
}

// ── Demo wrapper ──────────────────────────────────────────────────────────────
export function SAPIQuizDemo() {
  const [appState, setAppState] = useState({
    currentDimension: 0,
    answers:          {},
    scores:           {},
    compositeScore:   null,
    tier:             null,
  });
  const [currentPage, setCurrentPage] = useState("quiz");

  function mockSetPage(page) {
    console.log("→ navigate to:", page, "appState:", appState);
    // In demo, if we navigate to dimIntro after last dim, show a complete message
    if (page === "calculating") {
      alert(
        `Assessment complete!\nComposite SAPI Score: ${appState.compositeScore?.toFixed(1)}\nTier: ${appState.tier?.label}`
      );
      return;
    }
    if (page === "dimIntro") {
      // Remount quiz for next dimension by toggling page
      setCurrentPage("dimIntro_stub");
      setTimeout(() => setCurrentPage("quiz"), 50);
    }
  }

  if (currentPage === "dimIntro_stub") {
    return (
      <div style={{ background: C.void, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.parchment, fontFamily: "system-ui" }}>Loading next dimension…</div>
      </div>
    );
  }

  return (
    <SAPIQuiz
      appState={appState}
      setAppState={setAppState}
      setCurrentPage={mockSetPage}
    />
  );
}
