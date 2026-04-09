import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "./PageHeader";
import { PageFooter } from "./PageFooter";
import { getAssessmentResults, generateDimensionAnalysisPDF } from "../../services/assessmentService";

// ── Override Chrome Autofill White Background ───────────────────────────────
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #0a0a12 inset !important;
    -webkit-text-fill-color: #F5F3EE !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

// ─── Scoring Utilities ────────────────────────────────────────────────────────

function getTier(score) {
  if (score >= 80) return "leader";
  if (score >= 60) return "advanced";
  if (score >= 40) return "developing";
  if (score >= 20) return "nascent";
  return "preConditions";
}

function getBandColour(score) {
  if (score >= 65) return "#28A868";
  if (score >= 40) return "#F0C050";
  return "#C03058";
}

function calcComposite(scores) {
  return (
    Math.pow(Math.max(scores.D1, 0.01), 0.175) *
    Math.pow(Math.max(scores.D2, 0.01), 0.225) *
    Math.pow(Math.max(scores.D3, 0.01), 0.175) *
    Math.pow(Math.max(scores.D4, 0.01), 0.125) *
    Math.pow(Math.max(scores.D5, 0.01), 0.275)
  );
}

const DEMO_SCORES = { D1: 58, D2: 44, D3: 67, D4: 51, D5: 39 };

// const TIER_META = {
//   leader: {
//     label: "SOVEREIGN AI LEADER",
//     colour: "#28A868",
//     editorial: "Your nation operates at the frontier of sovereign AI capability.",
//   },
//   advanced: {
//     label: "ADVANCED",
//     colour: "#F0C050",
//     editorial: "Significant capacity exists — strategic gaps remain in high-leverage dimensions.",
//   },
//   developing: {
//     label: "DEVELOPING",
//     colour: "#F0C050",
//     editorial: "Foundational conditions are present. The window to accelerate is now.",
//   },
//   nascent: {
//     label: "NASCENT",
//     colour: "#C03058",
//     editorial: "Structural investment in AI sovereignty is urgently required.",
//   },
//   preConditions: {
//     label: "PRE-CONDITIONS UNMET",
//     colour: "#C03058",
//     editorial: "Immediate sovereign action is required to avoid strategic displacement.",
//   },
// };

const DIMENSIONS = [
  {
    key: "D1",
    num: "01",
    short: "Compute",
    full: "Compute Capacity",
    insight: "Sovereign compute is the physical foundation of AI independence.",
  },
  {
    key: "D2",
    num: "02",
    short: "Capital",
    full: "Capital Formation",
    insight: "Capital allocation signals long-term institutional commitment to AI leadership.",
  },
  {
    key: "D3",
    num: "03",
    short: "Regulatory",
    full: "Regulatory Readiness",
    insight: "Governance frameworks determine how quickly capability can be deployed at scale.",
  },
  {
    key: "D4",
    num: "04",
    short: "Data",
    full: "Data Sovereignty",
    insight: "Control over training data is control over the intelligence your nation can produce.",
  },
  {
    key: "D5",
    num: "05",
    short: "Intelligence",
    full: "Directed Intelligence Maturity",
    insight: "The ability to direct AI toward national objectives is the ultimate measure of sovereign capability.",
  },
];

// ─── SAPI Logo ────────────────────────────────────────────────────────────────

function SAPILogo() {
  const nodes = [
    [20, 2], [35, 9], [38, 20], [34, 31], [20, 38],
    [6, 31], [2, 20], [6, 9],
  ];
  const connections = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,4],[1,5],[2,6],[3,7]];
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="0.7" opacity="0.9" />
      <ellipse cx="20" cy="20" rx="18" ry="7" stroke="white" strokeWidth="0.7" opacity="0.7" />
      <ellipse cx="20" cy="20" rx="7" ry="18" stroke="white" strokeWidth="0.7" opacity="0.7" />
      <ellipse cx="20" cy="20" rx="18" ry="10"
        transform="rotate(50 20 20)" stroke="white" strokeWidth="0.5" opacity="0.5" />
      {connections.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke="white" strokeWidth="0.4" opacity="0.35" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill="white" opacity="0.9" />
      ))}
    </svg>
  );
}

// ─── Pentagon Radar Chart ─────────────────────────────────────────────────────

function RadarChart({ scores }) {
  const cx = 150, cy = 150, R = 112;

  const vertex = (i, radius) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), angle };
  };

  const maxVerts = DIMENSIONS.map((_, i) => vertex(i, R));
  const scoreVerts = DIMENSIONS.map((d, i) => vertex(i, R * (scores[d.key] / 100)));

  const toPoints = (verts) => verts.map((v) => `${v.x},${v.y}`).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const labelOffset = (i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    const lx = cx + (R + 22) * Math.cos(angle);
    const ly = cy + (R + 22) * Math.sin(angle);
    const anchor = lx < cx - 4 ? "end" : lx > cx + 4 ? "start" : "middle";
    const dy = ly < cy - 4 ? -4 : ly > cy + 4 ? 12 : 4;
    return { lx, ly: ly + dy, anchor };
  };

  return (
    <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
      {/* Grid rings */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={DIMENSIONS.map((_, i) => {
            const v = vertex(i, R * level);
            return `${v.x},${v.y}`;
          }).join(" ")}
          fill="none"
          stroke={level === 1.0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}
          strokeWidth={level === 1.0 ? 1 : 0.8}
        />
      ))}
      {/* Axes */}
      {maxVerts.map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v.x} y2={v.y}
          stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
      ))}
      {/* Score fill */}
      <polygon
        points={toPoints(scoreVerts)}
        fill="#C9963A"
        fillOpacity="0.12"
        stroke="#C9963A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Score dots */}
      {scoreVerts.map((v, i) => (
        <g key={i}>
          <circle cx={v.x} cy={v.y} r="5" fill="#0F0830" />
          <circle cx={v.x} cy={v.y} r="3.5" fill="#EDD98A" />
        </g>
      ))}
      {/* Axis labels */}
      {DIMENSIONS.map((d, i) => {
        const { lx, ly, anchor } = labelOffset(i);
        return (
          <text key={d.key} x={lx} y={ly} textAnchor={anchor}
            fontSize="12.5" fill="white"
            fontFamily="system-ui, sans-serif" letterSpacing="0.06em">
            {d.short.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Envelope/Lock Icon ───────────────────────────────────────────────────────

function EnvelopeLockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="8" width="18" height="13" rx="2"
        stroke="#C9963A" strokeWidth="1.2" />
      <path d="M2 10l9 7 9-7" stroke="#C9963A" strokeWidth="1.2"
        strokeLinecap="round" />
      <rect x="18" y="14" width="8" height="7" rx="1.5"
        stroke="#C9963A" strokeWidth="1.2" />
      <path d="M20 14v-2a2 2 0 014 0v2"
        stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="22" cy="17.5" r="1" fill="#C9963A" />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="#28A868" strokeWidth="1.2" />
      <path d="M6 10l3 3 5-6" stroke="#28A868" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="8" rx="1.5"
        stroke="white" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2"
        stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="1" fill="white" />
    </svg>
  );
}

export default function P7Results({ appState: appStateProp, setAppState, setCurrentPage }) {
  const location = useLocation();
  const navigate = useNavigate();

  // API data state
  const [apiResults, setApiResults] = useState(null);

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      // If we have appState from props with scores, use that
      if (appStateProp?.scores && Object.keys(appStateProp.scores).length > 0) {
        setApiResults(null);
        return;
      }

      // Otherwise fetch from API
      const id = localStorage.getItem('sapi_assessment_id') || location.state?.assessmentId;

      if (!id) return;

      try {
        const response = await getAssessmentResults(id);
        if (response.success) {
          setApiResults(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch results:', err);
      }
    };

    fetchResults();
  }, [appStateProp, location.state]);

  // Build appState from API data or props
  const appState = useMemo(() => {
    if (apiResults) {
      const storedProfile = JSON.parse(localStorage.getItem('sapi_profile') || '{}');
      return {
        orgProfile: {
          country: storedProfile.country || "Your Nation",
          nationName: storedProfile.country || "Your Nation",
        },
        scores: {
          D1: apiResults.compute_capacity ?? DEMO_SCORES.D1,
          D2: apiResults.capital_formation ?? DEMO_SCORES.D2,
          D3: apiResults.regulatory_readiness ?? DEMO_SCORES.D3,
          D4: apiResults.data_sovereignty ?? DEMO_SCORES.D4,
          D5: apiResults.directed_intelligence ?? DEMO_SCORES.D5,
        },
        compositeScore: apiResults.sapi_score ?? null,
        tier: apiResults.tier ?? null,
        emailCaptured: false,
        email: "",
      };
    }
    return appStateProp || {
      orgProfile: { country: "Your Nation", nationName: "Your Nation" },
      scores: DEMO_SCORES,
      compositeScore: null,
      tier: null,
      emailCaptured: false,
      email: "",
    };
  }, [apiResults, appStateProp]);

  const rawScores = appState.scores;
  const composite = appState.compositeScore ?? Math.round(calcComposite(rawScores));
  const tier = appState.tier ?? getTier(composite);
  // const tierMeta = TIER_META[tier] || TIER_META.preConditions;
  const country = appState.orgProfile?.country || "Your Nation";

  // Score count-up
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    // Only animate if composite is a valid number
    if (isNaN(composite) || composite === null || composite === undefined) {
      setDisplayScore(0);
      return;
    }

    let start = null;
    const duration = 1500;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(eased * composite));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [composite]);

  // Email gate state
  const [emailCaptured, setEmailCaptured] = useState(appState.emailCaptured || false);
  const [zoneRevealed, setZoneRevealed] = useState(appState.emailCaptured || false);
  const [emailInput, setEmailInput] = useState(appState.email || "");
  const [emailSubmitted, setEmailSubmitted] = useState(appState.emailCaptured || false);
  const [confirmedEmail, setConfirmedEmail] = useState(appState.email || "");
  const [emailError, setEmailError] = useState("");
  const [downloadTooltip, setDownloadTooltip] = useState(false);

  const handleEmailSubmit = () => {
    const val = emailInput.trim();
    if (!val.includes("@") || !val.includes(".")) {
      setEmailError("Please enter a valid institutional email address.");
      return;
    }
    setEmailError("");
    setConfirmedEmail(val);
    setEmailSubmitted(true);
    setAppState((prev) => ({ ...prev, email: val, emailCaptured: true }));
    setTimeout(() => {
      setEmailCaptured(true);
      setTimeout(() => setZoneRevealed(true), 80);
    }, 350);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{autofillStyles}</style>
      <div className="bg-sapi-void min-h-auto font-sans text-sapi-parchment pb-10">

      <PageHeader showAdmin={false} />

      {/* ─── ZONE A: SCORE REVEAL ─────────────────────────────────────────── */}
      <div className="max-w-[900px] mx-auto px-10">

        {/* Back to Results */}
        <button
          onClick={() => navigate('/results')}
          className="bg-transparent border-none pb-4 mt-2 text-sapi-muted text-[13px] font-medium tracking-[0.1em] cursor-pointer flex items-center gap-2 hover:text-sapi-gold transition-colors"
        >
          <span className="text-[15px]">←</span> BACK TO RESULTS
        </button>

        {/* Hero Score Card */}
        <div
          className="rounded-2xl p-12 px-10 mb-8"
          style={{
            background: "linear-gradient(145deg, #0A0514 0%, #14102C 100%)",
            border: "1px solid rgba(107,69,8,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header Row */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="text-[12px] tracking-[0.25em] text-sapi-muted font-medium">
                COMPOSITE SAPI SCORE — TIER 1 ASSESSMENT
              </div>
            </div>
            {/* Generate PDF Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={async () => {
                  const id = localStorage.getItem('sapi_assessment_id') || location.state?.assessmentId;
                  if (id) {
                    try {
                      const blob = await generateDimensionAnalysisPDF(id);
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `SAPI-Dimension-Analysis-${id}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      console.error('PDF generation error:', err);
                      alert('Failed to generate PDF. Please try again.');
                    }
                  } else {
                    alert('No assessment ID found');
                  }
                }}
                className="bg-sapi-gold border-none rounded-md px-5 py-2.5 text-sapi-void text-[13px] font-semibold tracking-[0.08em] cursor-pointer hover:opacity-85 transition-opacity"
              >
                GENERATE PDF
              </button>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex items-baseline justify-center gap-3 mb-7">
            <span
              className="font-sans font-bold text-sapi-paleGold leading-none tracking-[-0.04em]"
              style={{
                fontSize: "clamp(80px, 12vw, 120px)",
                textShadow: "0 2px 20px rgba(237,217,138,0.15)",
              }}
            >
              {displayScore}
            </span>
            <span
              className="font-sans font-normal leading-none"
              style={{
                fontSize: "clamp(28px, 4vw, 36px)",
                color: "rgba(237,217,138,0.35)",
              }}
            >
              / 100
            </span>
          </div>

          {/* Tier Badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-2 px-5 py-2 rounded-[20px] text-[13px] tracking-[0.15em] font-semibold"
              style={{
                // background: `rgba(${tierMeta.colour === '#28A868' ? '40,168,104' : tierMeta.colour === '#F0C050' ? '240,192,80' : '192,48,88'}, 0.12)`,
                // border: `1.5px solid ${tierMeta.colour}`,
                // color: tierMeta.colour,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  // background: tierMeta.colour,
                  // boxShadow: `0 0 8px ${tierMeta.colour}`,
                }}
              />
              {/* {tierMeta.label} */}
            </span>
          </div>

          {/* Editorial Line */}
          <div className="text-center font-sans text-[17px] font-normal text-sapi-parchment opacity-75 max-w-[520px] mx-auto leading-[1.7]">
            {/* {tierMeta.editorial} */}
          </div>
        </div>

        {/* ── Dimension Score Strip ── */}
        <div className="grid grid-cols-5 gap-2.5 mb-10">
          {DIMENSIONS.map((d) => {
            const s = rawScores[d.key];
            const bc = getBandColour(s);
            return (
              <div key={d.key} className="bg-sapi-navy border border-sapi-bronze/20 rounded-md py-4 px-3 text-center">
                <div className="text-[11px] tracking-[0.14em] text-sapi-muted mb-2.5 font-medium">
                  {d.short.toUpperCase()}
                </div>
                <div className="font-sans text-[34px] font-semibold text-sapi-paleGold leading-none mb-2.5 tracking-[-0.02em]">
                  {s}
                </div>
                <div className="w-full h-[3px] bg-white/[0.06] rounded-[2px] overflow-hidden">
                  <div
                    className="h-full rounded-[2px] transition-[width] duration-[1.2s]"
                    style={{
                      width: `${s}%`,
                      background: bc,
                      transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── EMAIL CAPTURE PANEL ─────────────────────────────────────────── */}
        <div className="bg-sapi-navy border border-sapi-bronze/20 border-l-[3px] border-l-sapi-gold rounded-r-lg py-8 px-9 mb-10">
          {!emailSubmitted ? (
            <>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <EnvelopeLockIcon />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-[19px] text-sapi-parchment mb-2 leading-[1.35]">
                    Your classified report has been prepared.
                  </div>
                  <div className="text-[15px] text-sapi-muted mb-6 leading-[1.6]">
                    Enter your institutional email address to save your results
                    and receive your secure access link.
                  </div>

                  {/* Input + button row */}
                  <div className="flex gap-2.5 flex-wrap">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      placeholder="minister@government.gov"
                      className="flex-1 min-w-[220px] bg-sapi-void rounded px-4 py-3 text-sapi-parchment text-[15px] font-sans outline-none shadow-none transition-colors"
                      style={{
                        border: `1px solid ${emailError ? "#C03058" : "rgba(107,69,8,0.4)"}`,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#C9963A";
                        e.target.style.boxShadow = "inset 0 0 0 1px rgba(201,150,58,0.3)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = emailError
                          ? "#C03058"
                          : "rgba(107,69,8,0.4)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      className="bg-sapi-gold border-none rounded px-6 py-3 text-sapi-void text-[13px] tracking-[0.1em] font-medium cursor-pointer font-sans whitespace-nowrap hover:opacity-88 transition-opacity"
                    >
                      Save My Report
                    </button>
                  </div>

                  {/* Validation error */}
                  {emailError && (
                    <div className="mt-2 text-[13px] text-sapi-crimson">
                      {emailError}
                    </div>
                  )}

                  {/* Trust signals */}
                  {/* <div className="mt-4 flex gap-6 flex-wrap">
                    {["No account creation required", "Secured access link dispatched instantly"].map((t) => (
                      <div key={t} className="flex items-center gap-1.5 text-[13px] text-sapi-muted/70">
                        <div className="w-1 h-1 rounded-full bg-sapi-gold/50" />
                        {t}
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </>
          ) : (
            /* Confirmed state */
            <div className="flex items-center gap-3.5">
              <TickIcon />
              <div>
                <div className="font-serif text-[17px] text-sapi-paleGold mb-1">
                  Your secure access link has been dispatched to{" "}
                  <span className="text-sapi-gold">{confirmedEmail}</span>
                </div>
                <div className="text-[13px] text-sapi-muted/70">
                  Your full results are now unlocked below.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── ZONE B: GATED RESULTS ────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            marginBottom: zoneRevealed ? "48px" : "16px",
            minHeight: zoneRevealed ? "auto" : "120px",
            maxHeight: zoneRevealed ? "none" : "120px",
          }}
        >

          {/* Radar + Scorecard content */}
          <div
            className="transition-all duration-[0.6s] ease-[ease]"
            style={{
              opacity: zoneRevealed ? 1 : 0,
              filter: zoneRevealed ? "none" : "blur(8px)",
              pointerEvents: zoneRevealed ? "auto" : "none",
              display: zoneRevealed ? "block" : "none",
            }}
          >

            {/* Section header */}
            <div className="text-[12px] tracking-[0.18em] text-sapi-muted mb-8 font-medium border-b border-sapi-bronze/18 pb-3.5">
              DIMENSION ANALYSIS
            </div>

            {/* Radar chart + legend row */}
            <div className="flex gap-12 items-center mb-12 flex-wrap">
              <div className="flex-shrink-0">
                <RadarChart scores={rawScores} />
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-serif text-[15px] text-sapi-muted italic mb-5 leading-[1.7]">
                  Each axis represents a dimension of sovereign AI readiness.
                  The gold polygon reflects your nation's current capability profile.
                </div>
                {/* Mini legend */}
                {DIMENSIONS.map((d) => {
                  const s = rawScores[d.key];
                  const bc = getBandColour(s);
                  return (
                    <div key={d.key} className="flex items-center gap-2.5 mb-2.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: bc }}
                      />
                      <div className="text-[13px] text-sapi-muted flex-1">
                        {d.full}
                      </div>
                      <div className="font-sans text-[15px] text-sapi-paleGold font-medium">
                        {s}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dimension scorecard rows */}
            <div className="mb-10">
              {DIMENSIONS.map((d, idx) => {
                const s = rawScores[d.key];
                const bc = getBandColour(s);
                return (
                  <div
                    key={d.key}
                    onClick={() => zoneRevealed && setCurrentPage && setCurrentPage("scorecard")}
                    className={`py-5 transition-all ${zoneRevealed ? 'cursor-pointer' : 'cursor-default'}`}
                    style={{
                      borderBottom: idx < 4 ? "1px solid rgba(107,69,8,0.15)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (zoneRevealed) {
                        e.currentTarget.style.background = "rgba(201,150,58,0.03)";
                        e.currentTarget.style.paddingLeft = "8px";
                        e.currentTarget.style.paddingRight = "8px";
                        e.currentTarget.style.marginLeft = "-8px";
                        e.currentTarget.style.marginRight = "-8px";
                        e.currentTarget.style.borderRadius = "4px";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.paddingLeft = "0";
                      e.currentTarget.style.paddingRight = "0";
                      e.currentTarget.style.marginLeft = "0";
                      e.currentTarget.style.marginRight = "0";
                      e.currentTarget.style.borderRadius = "0";
                    }}
                  >
                    <div className="flex items-baseline justify-between mb-2.5 gap-4 flex-wrap">
                      <div className="flex items-baseline gap-3">
                        <span className="font-sans text-[13px] text-sapi-muted/50 tracking-[0.1em]">
                          {d.num}
                        </span>
                        <span className="text-[15px] tracking-[0.06em] text-sapi-parchment font-medium">
                          {d.full.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-sans text-[24px] text-sapi-paleGold leading-none font-medium">
                        {s}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 bg-white/[0.06] rounded-[2px] overflow-hidden mb-3">
                      <div
                        className="h-full rounded-[2px] transition-[width] duration-1000"
                        style={{
                          width: `${s}%`,
                          background: bc,
                          transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                          transitionDelay: "0.2s",
                        }}
                      />
                    </div>

                    {/* Editorial insight */}
                    <div className="font-serif italic text-[15px] text-sapi-muted/80 leading-[1.65]">
                      {d.insight}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Frosted gate overlay */}
          {!emailCaptured && (
            <div
              className="absolute inset-0 backdrop-blur-[8px] rounded-lg flex flex-col items-center justify-center gap-3 z-[5] transition-opacity duration-[0.6s]"
              style={{
                background: "rgba(6,3,14,0.72)",
                WebkitBackdropFilter: "blur(8px)",
                opacity: emailCaptured ? 0 : 1,
                pointerEvents: emailCaptured ? "none" : "auto",
              }}
            >
              <div className="mb-1"><LockIcon /></div>
              <div className="font-serif text-[17px] text-sapi-muted text-center">
                Save your report to unlock your full dimension analysis.
              </div>
            </div>
          )}
        </div>
      </div>
    
      <PageFooter />
    </div>
    </>
  );
}
