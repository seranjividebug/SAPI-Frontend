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
    <svg width="300" height="300" viewBox="0 0 300 300" style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={DIMENSIONS.map((_, i) => {
            const v = vertex(i, R * level);
            return `${v.x},${v.y}`;
          }).join(" ")}
          fill="none"
          stroke={level === 1.0 ? "#2E2560" : "#1E1845"}
          strokeWidth={level === 1.0 ? 1 : 0.8}
        />
      ))}
      {/* Axes */}
      {maxVerts.map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v.x} y2={v.y}
          stroke="#231D5A" strokeWidth="0.8" />
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
            fontSize="10.5" fill="#9880B0"
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
        stroke="#9880B0" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2"
        stroke="#9880B0" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="1" fill="#9880B0" />
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
      <div style={{
        background: "#06030E",
        minHeight: "auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#FBF5E6",
        paddingBottom: "40px",
      }}>

      <PageHeader showAdmin={false} />

      {/* ─── ZONE A: SCORE REVEAL ─────────────────────────────────────────── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px" }}>

        {/* Back to Results */}
        <button
          onClick={() => navigate('/results')}
          style={{
            background: "transparent",
            border: "none",
            padding: "0 0 16px 0",
            color: "#9880B0",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#C9963A"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#9880B0"}
        >
          <span style={{ fontSize: "14px" }}>←</span> BACK TO RESULTS
        </button>

        {/* Hero Score Card */}
        <div style={{
          background: "linear-gradient(145deg, #0A0514 0%, #14102C 100%)",
          border: "1px solid rgba(107,69,8,0.25)",
          borderRadius: "16px",
          padding: "48px 40px",
          marginBottom: "32px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {/* Header Row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#9880B0",
              fontWeight: 500,
            }}>
              COMPOSITE SAPI SCORE — TIER 1 ASSESSMENT
            </div>
            {/* Generate PDF Button */}
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
              style={{
                background: "#C9963A",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                color: "#06030E",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              GENERATE PDF
            </button>
          </div>

          {/* Score Display */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "28px",
          }}>
            <span style={{
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(80px, 12vw, 120px)",
              fontWeight: 700,
              color: "#EDD98A",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textShadow: "0 2px 20px rgba(237,217,138,0.15)",
            }}>
              {displayScore}
            </span>
            <span style={{
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 400,
              color: "rgba(237,217,138,0.35)",
              lineHeight: 1,
            }}>
              / 100
            </span>
          </div>

          {/* Tier Badge */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              // background: `rgba(${tierMeta.colour === '#28A868' ? '40,168,104' : tierMeta.colour === '#F0C050' ? '240,192,80' : '192,48,88'}, 0.12)`,
              // border: `1.5px solid ${tierMeta.colour}`,
              borderRadius: "20px",
              fontSize: "12px",
              letterSpacing: "0.15em",
              // color: tierMeta.colour,
              fontWeight: 600,
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                // background: tierMeta.colour,
                // boxShadow: `0 0 8px ${tierMeta.colour}`,
              }} />
              {/* {tierMeta.label} */}
            </span>
          </div>

          {/* Editorial Line */}
          <div style={{
            textAlign: "center",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "#FBF5E6",
            opacity: 0.75,
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            {/* {tierMeta.editorial} */}
          </div>
        </div>

        {/* ── Dimension Score Strip ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
          marginBottom: "40px",
        }}>
          {DIMENSIONS.map((d) => {
            const s = rawScores[d.key];
            const bc = getBandColour(s);
            return (
              <div key={d.key} style={{
                background: "#0F0830",
                border: "1px solid rgba(107,69,8,0.2)",
                borderRadius: "6px",
                padding: "16px 12px",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "#9880B0",
                  marginBottom: "10px",
                  fontWeight: 500,
                }}>
                  {d.short.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "#EDD98A",
                  lineHeight: 1,
                  marginBottom: "10px",
                  letterSpacing: "-0.02em",
                }}>
                  {s}
                </div>
                <div style={{
                  width: "100%",
                  height: "3px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${s}%`,
                    height: "100%",
                    background: bc,
                    borderRadius: "2px",
                    transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── EMAIL CAPTURE PANEL ─────────────────────────────────────────── */}
        <div style={{
          background: "#0F0830",
          border: "1px solid rgba(107,69,8,0.2)",
          borderLeft: "3px solid #C9963A",
          borderRadius: "0 8px 8px 0",
          padding: "32px 36px",
          marginBottom: "40px",
        }}>
          {!emailSubmitted ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div style={{ marginTop: "2px", flexShrink: 0 }}>
                  <EnvelopeLockIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "18px",
                    color: "#FBF5E6",
                    marginBottom: "8px",
                    lineHeight: 1.35,
                  }}>
                    Your classified report has been prepared.
                  </div>
                  <div style={{
                    fontSize: "13px",
                    color: "#9880B0",
                    marginBottom: "24px",
                    lineHeight: 1.6,
                  }}>
                    Enter your institutional email address to save your results
                    and receive your secure access link.
                  </div>

                  {/* Input + button row */}
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      placeholder="minister@government.gov"
                      style={{
                        flex: "1",
                        minWidth: "220px",
                        background: "#06030E",
                        border: `1px solid ${emailError ? "#C03058" : "rgba(107,69,8,0.4)"}`,
                        borderRadius: "4px",
                        padding: "12px 16px",
                        color: "#FBF5E6",
                        fontSize: "13px",
                        fontFamily: "system-ui, sans-serif",
                        outline: "none",
                        boxShadow: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
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
                      style={{
                        background: "#C9963A",
                        border: "none",
                        borderRadius: "4px",
                        padding: "12px 24px",
                        color: "#06030E",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "system-ui, sans-serif",
                        whiteSpace: "nowrap",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.88")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >
                      Save My Report
                    </button>
                  </div>

                  {/* Validation error */}
                  {emailError && (
                    <div style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#C03058",
                    }}>
                      {emailError}
                    </div>
                  )}

                  {/* Trust signals */}
                  <div style={{
                    marginTop: "16px",
                    display: "flex",
                    gap: "24px",
                    flexWrap: "wrap",
                  }}>
                    {["No account creation required", "Secured access link dispatched instantly"].map((t) => (
                      <div key={t} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: "rgba(152,128,176,0.7)",
                      }}>
                        <div style={{
                          width: "4px",
                          height: "4px",
                          borderRadius: "50%",
                          background: "rgba(201,150,58,0.5)",
                        }} />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Confirmed state */
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}>
              <TickIcon />
              <div>
                <div style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "15px",
                  color: "#EDD98A",
                  marginBottom: "4px",
                }}>
                  Your secure access link has been dispatched to{" "}
                  <span style={{ color: "#C9963A" }}>{confirmedEmail}</span>
                </div>
                <div style={{
                  fontSize: "12px",
                  color: "rgba(152,128,176,0.7)",
                }}>
                  Your full results are now unlocked below.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── ZONE B: GATED RESULTS ────────────────────────────────────────── */}
        <div style={{ 
          position: "relative", 
          marginBottom: zoneRevealed ? "48px" : "16px",
          minHeight: zoneRevealed ? "auto" : "120px",
          maxHeight: zoneRevealed ? "none" : "120px",
          overflow: "hidden",
        }}>

          {/* Radar + Scorecard content */}
          <div style={{
            opacity: zoneRevealed ? 1 : 0,
            filter: zoneRevealed ? "none" : "blur(8px)",
            transition: "opacity 0.6s ease, filter 0.6s ease",
            pointerEvents: zoneRevealed ? "auto" : "none",
            display: zoneRevealed ? "block" : "none",
          }}>

            {/* Section header */}
            <div style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: "#9880B0",
              marginBottom: "32px",
              fontWeight: 500,
              borderBottom: "1px solid rgba(107,69,8,0.18)",
              paddingBottom: "14px",
            }}>
              DIMENSION ANALYSIS
            </div>

            {/* Radar chart + legend row */}
            <div style={{
              display: "flex",
              gap: "48px",
              alignItems: "center",
              marginBottom: "48px",
              flexWrap: "wrap",
            }}>
              <div style={{ flexShrink: 0 }}>
                <RadarChart scores={rawScores} />
              </div>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  color: "#9880B0",
                  fontStyle: "italic",
                  marginBottom: "20px",
                  lineHeight: 1.7,
                }}>
                  Each axis represents a dimension of sovereign AI readiness.
                  The gold polygon reflects your nation's current capability profile.
                </div>
                {/* Mini legend */}
                {DIMENSIONS.map((d) => {
                  const s = rawScores[d.key];
                  const bc = getBandColour(s);
                  return (
                    <div key={d.key} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}>
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: bc,
                        flexShrink: 0,
                      }} />
                      <div style={{ fontSize: "11px", color: "#9880B0", flex: 1 }}>
                        {d.full}
                      </div>
                      <div style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "14px",
                        color: "#EDD98A",
                      }}>
                        {s}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dimension scorecard rows */}
            <div style={{ marginBottom: "40px" }}>
              {DIMENSIONS.map((d, idx) => {
                const s = rawScores[d.key];
                const bc = getBandColour(s);
                return (
                  <div
                    key={d.key}
                    onClick={() => zoneRevealed && setCurrentPage && setCurrentPage("scorecard")}
                    style={{
                      padding: "20px 0",
                      borderBottom: idx < 4 ? "1px solid rgba(107,69,8,0.15)" : "none",
                      cursor: zoneRevealed ? "pointer" : "default",
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
                    <div style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                        <span style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "11px",
                          color: "rgba(152,128,176,0.5)",
                          letterSpacing: "0.1em",
                        }}>
                          {d.num}
                        </span>
                        <span style={{
                          fontSize: "13px",
                          letterSpacing: "0.06em",
                          color: "#FBF5E6",
                          fontWeight: 500,
                        }}>
                          {d.full.toUpperCase()}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "22px",
                        color: "#EDD98A",
                        lineHeight: 1,
                      }}>
                        {s}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      width: "100%",
                      height: "4px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "2px",
                      overflow: "hidden",
                      marginBottom: "12px",
                    }}>
                      <div style={{
                        width: `${s}%`,
                        height: "100%",
                        background: bc,
                        borderRadius: "2px",
                        transition: "width 1s cubic-bezier(0.4,0,0.2,1) 0.2s",
                      }} />
                    </div>

                    {/* Editorial insight */}
                    <div style={{
                      fontFamily: "Georgia, serif",
                      fontStyle: "italic",
                      fontSize: "12.5px",
                      color: "rgba(152,128,176,0.8)",
                      lineHeight: 1.65,
                    }}>
                      {d.insight}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Peer comparison teaser */}
            <div style={{
              position: "relative",
              background: "#0F0830",
              border: "1px solid rgba(107,69,8,0.2)",
              borderRadius: "8px",
              padding: "28px",
              overflow: "hidden",
              marginBottom: "12px",
            }}>
              {/* Blurred background bars (decorative) */}
              <div style={{
                position: "absolute",
                inset: 0,
                padding: "40px 28px 20px",
                filter: "blur(6px)",
                opacity: 0.25,
                pointerEvents: "none",
              }}>
                {[72, 58, 81, 45, 63, 38].map((v, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}>
                    <div style={{ width: "60px", height: "6px", background: "#2A2060", borderRadius: "2px" }} />
                    <div style={{ width: `${v}%`, height: "6px", background: "#C9963A", borderRadius: "2px" }} />
                  </div>
                ))}
              </div>

              {/* Foreground lock card */}
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "14px",
                }}>
                  <LockIcon />
                  <span style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    color: "#9880B0",
                    fontWeight: 500,
                  }}>
                    PEER COMPARISON — TIER 2
                  </span>
                </div>
                <div style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "16px",
                  color: "#FBF5E6",
                  marginBottom: "10px",
                  lineHeight: 1.4,
                }}>
                  See how {country} ranks against nations at equivalent development stages.
                </div>
                <div style={{
                  fontSize: "13px",
                  color: "#9880B0",
                  marginBottom: "20px",
                  lineHeight: 1.6,
                }}>
                  Named country benchmarks are available in the Tier 2 practitioner assessment.
                </div>
                <button
                  onClick={() => setCurrentPage && setCurrentPage("upgrade")}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(201,150,58,0.5)",
                    borderRadius: "4px",
                    padding: "8px 20px",
                    color: "#C9963A",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 500,
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(201,150,58,0.08)";
                    e.target.style.borderColor = "#C9963A";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.borderColor = "rgba(201,150,58,0.5)";
                  }}
                >
                  Explore Tier 2 →
                </button>
              </div>
            </div>
          </div>

          {/* Frosted gate overlay */}
          {!emailCaptured && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(6,3,14,0.72)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              zIndex: 5,
              transition: "opacity 0.6s ease",
              opacity: emailCaptured ? 0 : 1,
              pointerEvents: emailCaptured ? "none" : "auto",
            }}>
              <div style={{ marginBottom: "4px" }}><LockIcon /></div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontSize: "15px",
                color: "#9880B0",
                textAlign: "center",
              }}>
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
