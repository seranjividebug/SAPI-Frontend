import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",               shortName: "Compute",     shortCode: "D1", weight: 0.175 },
  { name: "Capital Formation",              shortName: "Capital",     shortCode: "D2", weight: 0.225 },
  { name: "Regulatory Readiness",           shortName: "Regulatory",  shortCode: "D3", weight: 0.175 },
  { name: "Data Sovereignty",               shortName: "Data Sov.",   shortCode: "D4", weight: 0.125 },
  { name: "Directed Intelligence Maturity", shortName: "DI Maturity", shortCode: "D5", weight: 0.275 },
];

// ── Tier engine ───────────────────────────────────────────────────────────────
function getTier(score) {
  if (score >= 80) return { label: "Sovereign AI Leader",  color: C.emerald, bg: "rgba(40,168,104,0.12)" };
  if (score >= 60) return { label: "Advanced",             color: C.blue,    bg: "rgba(74,122,224,0.12)" };
  if (score >= 40) return { label: "Developing",           color: C.amber,   bg: "rgba(240,192,80,0.12)" };
  if (score >= 20) return { label: "Nascent",              color: C.gold,    bg: "rgba(201,150,58,0.12)" };
  return               { label: "Pre-conditions Unmet",   color: C.crimson, bg: "rgba(192,48,88,0.12)"  };
}

function getBand(score) {
  if (score >= 65) return { label: "High",   color: C.emerald, bg: "rgba(40,168,104,0.15)"  };
  if (score >= 40) return { label: "Medium", color: C.amber,   bg: "rgba(240,192,80,0.15)"  };
  return               { label: "Low",    color: C.crimson, bg: "rgba(192,48,88,0.15)"  };
}

// ── Logo Component ──────────────────────────────────────────────────────────
function SAPILogo({ size = 120 }) {
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
        padding: '4px',
        boxSizing: 'border-box',
        WebkitMaskImage: 'radial-gradient(circle, white 100%, transparent 100%)',
        maskImage: 'radial-gradient(circle, white 100%, transparent 100%)'
      }}
    />
  );
}

// ── Pentagon Radar Chart ──────────────────────────────────────────────────────
function RadarChart({ scores }) {
  const cx = 160, cy = 155, r = 112;
  const n = 5;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const outerPt = (i, scale = 1) => ({
    x: cx + r * scale * Math.cos(angle(i)),
    y: cy + r * scale * Math.sin(angle(i)),
  });

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPts = scores.map((s, i) => {
    const scale = Math.max(s, 1) / 100;
    return outerPt(i, scale);
  });
  const dataPath = dataPts.map((p, i) =>
    `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  ).join(" ") + " Z";

  const dimLabels = [
    ["Compute", "Capacity"],
    ["Capital", "Formation"],
    ["Regulatory", "Readiness"],
    ["Data", "Sovereignty"],
    ["DI", "Maturity"],
  ];

  return (
    <svg width="320" height="310" viewBox="0 0 320 310" style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((scale, ri) => {
        const pts = Array.from({ length: n }, (_, i) => outerPt(i, scale));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
        return (
          <path key={ri} d={path} fill="none"
            stroke={ri === 4 ? "rgba(107,69,8,0.55)" : "rgba(107,69,8,0.28)"}
            strokeWidth={ri === 4 ? 1.2 : 0.8} />
        );
      })}

      {/* Axis spokes */}
      {Array.from({ length: n }, (_, i) => {
        const outer = outerPt(i);
        return (
          <line key={i} x1={cx} y1={cy}
            x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
            stroke="rgba(107,69,8,0.4)" strokeWidth="0.9" />
        );
      })}

      {/* Data polygon fill */}
      <path d={dataPath}
        fill="rgba(201,150,58,0.18)"
        stroke={C.gold} strokeWidth="1.8" strokeLinejoin="round" />

      {/* Data point dots */}
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={C.gold} opacity="0.9" />
      ))}

      {/* Ring value labels */}
      {[20, 40, 60, 80].map((val) => {
        const scale = val / 100;
        const pt = outerPt(0, scale);
        return (
          <text key={val} x={pt.x + 4} y={pt.y - 2}
            fill="rgba(152,128,176,0.55)" fontSize="7.5"
            fontFamily="system-ui, sans-serif">
            {val}
          </text>
        );
      })}

      {/* Dimension labels */}
      {Array.from({ length: n }, (_, i) => {
        const labelScale = 1.28;
        const pt = outerPt(i, labelScale);
        const lines = dimLabels[i];
        const ax = pt.x - cx;
        const textAnchor = Math.abs(ax) < 12 ? "middle" : ax < 0 ? "end" : "start";

        // Vertical alignment: push top label up, bottom down
        const ay = pt.y - cy;
        let baseY = pt.y;
        if (ay < -30) baseY -= 4;
        if (ay > 30) baseY += 4;

        return (
          <text key={i}
            textAnchor={textAnchor}
            fill={C.parchment} fontSize="10" fontFamily="system-ui, sans-serif" opacity="0.85">
            {lines.map((line, li) => (
              <tspan key={li} x={pt.x.toFixed(1)} dy={li === 0 ? `${baseY - cy}` : "13"}
                y={li === 0 ? baseY.toFixed(1) : undefined}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* Score annotations near dots */}
      {scores.map((s, i) => {
        const scale = Math.max(s, 1) / 100;
        // eslint-disable-next-line no-unused-vars
        const dotPt = outerPt(i, scale);
        const offPt = outerPt(i, scale + 0.16);
        const ax = offPt.x - cx;
        const textAnchor = Math.abs(ax) < 12 ? "middle" : ax < 0 ? "end" : "start";
        return (
          <text key={i} x={offPt.x.toFixed(1)} y={(offPt.y + 3).toFixed(1)}
            textAnchor={textAnchor}
            fill={C.paleGold} fontSize="9" fontFamily="Georgia, serif" opacity="0.8">
            {s.toFixed(0)}
          </text>
        );
      })}
    </svg>
  );
}

// ── Peer Comparison Strip ─────────────────────────────────────────────────────
function PeerComparisonStrip({ compositeScore }) {
  const score = Math.min(Math.max(compositeScore, 0), 100);
  const globalMedian = 42;
  const topQuartile = 65;

  return (
    <div style={{ width: "100%", position: "relative", paddingTop: 28, paddingBottom: 32 }}>

      {/* Above-bar labels */}
      {[
        { value: globalMedian, label: "Global Median", sublabel: `${globalMedian}`, color: C.muted },
        { value: topQuartile,  label: "Top Quartile",  sublabel: `${topQuartile}`,  color: C.blue  },
      ].map((m) => (
        <div key={m.label} style={{
          position: "absolute",
          left: `${m.value}%`,
          top: 0,
          transform: "translateX(-50%)",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif", fontSize: 8.5,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: m.color, opacity: 0.8, whiteSpace: "nowrap",
          }}>
            {m.label}
          </div>
          <div style={{
            fontFamily: "Georgia, serif", fontSize: 10,
            color: m.color, opacity: 0.65,
          }}>
            {m.sublabel}
          </div>
        </div>
      ))}

      {/* Track */}
      <div style={{ position: "relative", height: 8, borderRadius: 4, overflow: "visible" }}>
        {/* Gradient fill */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          background: `linear-gradient(90deg, ${C.crimson} 0%, ${C.amber} 39%, ${C.blue} 65%, ${C.emerald} 100%)`,
          opacity: 0.22,
        }} />
        {/* Base track */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          border: `1px solid ${C.bronzeHi}`,
          background: "rgba(255,255,255,0.03)",
        }} />

        {/* Median tick */}
        <div style={{
          position: "absolute",
          left: `${globalMedian}%`, top: -3, bottom: -3,
          width: 1.5,
          background: C.muted,
          opacity: 0.5,
          transform: "translateX(-50%)",
        }} />

        {/* Top quartile tick */}
        <div style={{
          position: "absolute",
          left: `${topQuartile}%`, top: -3, bottom: -3,
          width: 1.5,
          background: C.blue,
          opacity: 0.5,
          transform: "translateX(-50%)",
        }} />

        {/* User score dot */}
        <div style={{
          position: "absolute",
          left: `${score}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 14, height: 14,
          borderRadius: "50%",
          background: C.void,
          border: `2.5px solid ${C.gold}`,
          boxShadow: `0 0 12px rgba(201,150,58,0.55), 0 0 4px rgba(201,150,58,0.9)`,
          zIndex: 2,
        }} />
      </div>

      {/* Below-bar user label */}
      <div style={{
        position: "absolute",
        left: `${score}%`,
        bottom: 2,
        transform: "translateX(-50%)",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "system-ui, sans-serif", fontSize: 8.5,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: C.gold, whiteSpace: "nowrap",
        }}>
          Your Score
        </div>
        <div style={{
          fontFamily: "Georgia, serif", fontSize: 11,
          color: C.paleGold, fontWeight: 400,
        }}>
          {score.toFixed(1)}
        </div>
      </div>

      {/* Axis ticks */}
      <div style={{
        position: "absolute", bottom: -18, left: 0, right: 0,
        display: "flex", justifyContent: "space-between",
        fontFamily: "system-ui, sans-serif", fontSize: 8.5,
        color: C.muted, opacity: 0.4, letterSpacing: "0.06em",
      }}>
        {[0, 25, 50, 75, 100].map(v => <span key={v}>{v}</span>)}
      </div>
    </div>
  );
}

// ── Number font constant ────────────────────────────────────────────────────
const NUMBER_FONT = "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace";
function DimCard({ dim, score, onClick }) {
  const [hover, setHover] = useState(false);
  const band = getBand(score);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? C.midnight : C.navy,
        border: `1px solid ${hover ? "rgba(201,150,58,0.4)" : C.bronze}`,
        borderTop: `2.5px solid ${band.color}`,
        borderRadius: 6,
        padding: "18px 16px 14px",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        flex: "1 1 160px",
        minWidth: 148,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{
          fontFamily: "Georgia, serif", fontSize: 11,
          color: C.gold, letterSpacing: "0.15em", opacity: 0.75,
        }}>
          {dim.shortCode}
        </span>
        <span style={{
          fontFamily: "system-ui, sans-serif", fontSize: 8,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: band.color, background: band.bg,
          padding: "2px 7px", borderRadius: 2,
        }}>
          {band.label}
        </span>
      </div>

      <div style={{
        fontFamily: "system-ui, sans-serif", fontSize: 10.5,
        color: C.muted, lineHeight: 1.4, marginBottom: 12,
        letterSpacing: "0.01em",
      }}>
        {dim.name}
      </div>

      <div style={{
        fontFamily: NUMBER_FONT, fontSize: 30,
        color: C.paleGold, lineHeight: 1, marginBottom: 12,
        fontWeight: 500, letterSpacing: "0.02em",
      }}>
        {score.toFixed(1)}
      </div>

      <div style={{ height: 3, background: C.bronze, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
        <div style={{
          height: "100%", width: `${score}%`,
          background: band.color, borderRadius: 2, opacity: 0.7,
        }} />
      </div>

      <div style={{
        fontFamily: "system-ui, sans-serif", fontSize: 8.5,
        color: C.muted, opacity: hover ? 0.65 : 0.25,
        letterSpacing: "0.1em", transition: "opacity 0.15s",
      }}>
        View scorecard →
      </div>
    </div>
  );
}

function Rule() {
  return <div style={{ height: 1, background: C.bronze, margin: "36px 0" }} />;
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif", fontSize: 9.5,
      letterSpacing: "0.24em", textTransform: "uppercase",
      color: C.gold, opacity: 0.7, marginBottom: 18,
    }}>
      {children}
    </div>
  );
}

// ── P7 Main ───────────────────────────────────────────────────────────────────
export default function SAPIResults() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiResults, setApiResults] = useState(location.state?.results || null);
  // eslint-disable-next-line no-unused-vars
  const [assessmentId, setAssessmentId] = useState(location.state?.assessmentId || null);
  
  // Fetch results from API if not available in state
  useEffect(() => {
    const fetchResults = async () => {
      // Always use localStorage as the source of truth for assessment ID
      const id = localStorage.getItem('sapi_assessment_id') || location.state?.assessmentId;
      
      // If we have results in state and matching ID, use them
      if (location.state?.results && location.state?.assessmentId === id) {
        setApiResults(location.state.results);
        setAssessmentId(id);
        setLoading(false);
        return;
      }
      
      if (!id) {
        setError('No assessment ID found. Please complete the assessment first.');
        setLoading(false);
        return;
      }
      
      try {
        setAssessmentId(id);
        const response = await getAssessmentResults(id);
        if (response.success) {
          setApiResults(response.data);
        } else {
          setError(response.error || 'Failed to load results');
        }
      } catch (err) {
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [location.state]);
  
  // Map API response to component format
  const appState = useMemo(() => {
    if (apiResults) {
      // Get country from sapi_profile in localStorage
      const storedProfile = JSON.parse(localStorage.getItem('sapi_profile') || '{}');
      return {
        orgProfile: {
          nationName: storedProfile.country || "Your nation",
          assessmentDate: new Date().toLocaleDateString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
          }),
        },
        scores: {
          D1: apiResults.compute_capacity,
          D2: apiResults.capital_formation,
          D3: apiResults.regulatory_readiness,
          D4: apiResults.data_sovereignty,
          D5: apiResults.directed_intelligence,
        },
        compositeScore: apiResults.sapi_score,
        tier: apiResults.tier,
      };
    }
    return null;
  }, [apiResults]);

  // Calculate derived values always (before any early returns)
  const tier = useMemo(() => appState ? getTier(Number(appState.compositeScore) ?? 0) : null, [appState]);
  const dimScores = useMemo(() => appState ? DIMENSIONS.map(d => Number(appState.scores?.[d.shortCode]) || 0) : [], [appState]);
  const ranked = useMemo(() =>
    appState ? DIMENSIONS.map((d, i) => ({ ...d, score: Number(dimScores[i]) || 0 })).sort((a, b) => b.score - a.score) : [],
    [dimScores, appState]
  );
  const highest = ranked[0];
  const secondHighest = ranked[1];
  const lowest = ranked[ranked.length - 1];

  // Return loading or error state if no data
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: C.paleGold, fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
          Loading results...
        </div>
      </div>
    );
  }

  if (error || !appState) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ color: C.crimson, fontFamily: "Georgia, serif", fontSize: 18, marginBottom: 16 }}>
          {error || "Unable to load assessment results"}
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: C.gold, color: C.void, border: "none", padding: "12px 24px",
            fontFamily: "system-ui, sans-serif", fontSize: 12, cursor: "pointer", borderRadius: 3
          }}
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  const compositeScore = appState.compositeScore != null ? Number(appState.compositeScore) : null;
  // eslint-disable-next-line no-unused-vars
  const scores = appState.scores;
  const orgProfile = appState.orgProfile;

  const nationName = orgProfile?.nationName || "Your nation";
  const date = orgProfile?.assessmentDate ||
    new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const nav = (page, extra) => {
    // Navigate to the requested page
    navigate(`/${page}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.void, fontFamily: "system-ui, sans-serif" }}>

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div style={{
        background: C.navy,
        borderBottom: `1px solid ${C.bronze}`,
        padding: "0 40px",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <SAPILogo size={34} />
            <div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: 9.5,
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: C.parchment, opacity: 0.88,
              }}>
                The Sovereign AI Power Index
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif", fontSize: 8.5,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: C.gold, opacity: 0.6, marginTop: 2,
              }}>
                Assessment Results
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "Georgia, serif", fontSize: 13,
              color: C.parchment, opacity: 0.9, letterSpacing: "0.04em",
            }}>
              {nationName}
            </div>
            <div style={{
              fontFamily: "system-ui, sans-serif", fontSize: 8.5,
              color: C.muted, opacity: 0.6, letterSpacing: "0.1em",
              textTransform: "uppercase", marginTop: 2,
            }}>
              {date} · Tier 1 Assessment
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "44px 40px 80px" }}>

        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 0,
          background: C.navy,
          border: `1px solid ${C.bronzeHi}`,
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Ambient radial */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 75% 50%, rgba(201,150,58,0.05) 0%, transparent 60%)",
            pointerEvents: "none",
          }} />

          {/* LEFT PANEL */}
          <div style={{
            flex: "0 0 auto",
            padding: "44px 44px 44px 48px",
            borderRight: `1px solid ${C.bronze}`,
            display: "flex",
            flexDirection: "column",
            minWidth: 280,
          }}>
            {/* Label */}
            <div style={{
              fontFamily: "system-ui, sans-serif", fontSize: 8.5,
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: C.muted, opacity: 0.65, marginBottom: 12,
            }}>
              Composite SAPI Score
            </div>

            {/* Giant number */}
            <div style={{
              fontFamily: NUMBER_FONT, fontSize: 90,
              color: C.paleGold, lineHeight: 0.9,
              letterSpacing: "-0.02em", marginBottom: 22,
              fontWeight: 500,
            }}>
              {compositeScore != null ? compositeScore.toFixed(1) : "—"}
            </div>

            {/* Tier pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: `1.5px solid ${tier.color}`,
              background: tier.bg,
              padding: "7px 16px",
              borderRadius: 40,
              marginBottom: 32,
              alignSelf: "flex-start",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: tier.color, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "system-ui, sans-serif", fontSize: 9.5,
                letterSpacing: "0.22em", textTransform: "uppercase",
                color: tier.color, fontWeight: 500,
              }}>
                {tier.label}
              </span>
            </div>

            {/* Tier scale mini-legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { range: "80–100", label: "Sovereign AI Leader",  color: C.emerald },
                { range: "60–79",  label: "Advanced",             color: C.blue    },
                { range: "40–59",  label: "Developing",           color: C.amber   },
                { range: "20–39",  label: "Nascent",              color: C.gold    },
                { range: "1–19",   label: "Pre-conditions Unmet", color: C.crimson },
              ].map((t) => {
                const isActive = t.label === tier.label;
                return (
                  <div key={t.label} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    opacity: isActive ? 1 : 0.3,
                  }}>
                    <div style={{
                      width: 16, height: 2.5,
                      background: t.color,
                      borderRadius: 1, flexShrink: 0,
                    }} />
                    <span style={{
                      fontFamily: "system-ui, sans-serif", fontSize: 8.5,
                      color: isActive ? t.color : C.muted,
                      letterSpacing: "0.05em",
                    }}>
                      {t.range} — {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL — Radar */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 32px",
          }}>
            <div style={{
              fontFamily: "system-ui, sans-serif", fontSize: 9,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: C.muted, opacity: 0.55,
              marginBottom: 8, alignSelf: "flex-start",
            }}>
              Dimension Profile · 0–100 Scale
            </div>
            <RadarChart scores={dimScores} />
          </div>
        </div>

        <Rule />

        {/* ── DIMENSION SUMMARY ────────────────────────────────────── */}
        <SectionLabel>Dimension Scores</SectionLabel>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {DIMENSIONS.map((dim, i) => (
            <DimCard
              key={dim.shortCode}
              dim={dim}
              score={dimScores[i]}
              onClick={() => nav("scorecard", { selectedDimension: dim.shortCode })}
            />
          ))}
        </div>

        <Rule />

        {/* ── EXECUTIVE SUMMARY ────────────────────────────────────── */}
        <SectionLabel>Executive Summary</SectionLabel>
        <div style={{
          background: C.navy,
          border: `1px solid ${C.bronze}`,
          borderLeft: `3px solid ${C.gold}`,
          borderRadius: 6,
          padding: "26px 30px",
        }}>
          <p style={{
            fontFamily: "Georgia, serif", fontSize: 14,
            color: C.parchment, lineHeight: 1.9,
            margin: 0, letterSpacing: "0.015em",
          }}>
            {nationName} has achieved a composite SAPI score of{" "}
            <strong style={{ color: C.paleGold, fontWeight: 500, fontFamily: NUMBER_FONT }}>
              {compositeScore?.toFixed(1)}
            </strong>,
            placing it in the{" "}
            <span style={{ color: tier.color }}>{tier.label}</span> tier.
            The primary constraint on sovereign AI capacity is{" "}
            <em style={{ color: C.parchment }}>{lowest.name}</em>,
            which scored{" "}
            <span style={{ color: getBand(lowest.score).color, fontFamily: NUMBER_FONT }}>{lowest.score.toFixed(1)}</span>.
            Relative strengths were identified in{" "}
            <em style={{ color: C.parchment }}>{highest.name}</em>
            {" "}(<span style={{ color: C.paleGold, fontFamily: NUMBER_FONT }}>{highest.score.toFixed(1)}</span>)
            {" "}and{" "}
            <em style={{ color: C.parchment }}>{secondHighest.name}</em>
            {" "}(<span style={{ color: C.paleGold, fontFamily: NUMBER_FONT }}>{secondHighest.score.toFixed(1)}</span>).
            The 12–18 month roadmap below identifies priority interventions aligned to these findings.
          </p>
        </div>

        <Rule />

        {/* ── PEER COMPARISON ──────────────────────────────────────── */}
        <SectionLabel>Global Positioning</SectionLabel>
        <div style={{
          background: C.navy,
          border: `1px solid ${C.bronze}`,
          borderRadius: 6,
          padding: "28px 36px 36px",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            color: C.muted, lineHeight: 1.65, marginBottom: 24,
            letterSpacing: "0.02em", opacity: 0.8,
          }}>
            Composite score benchmarked against Tier 1 respondent distribution.
            Reference markers based on aggregate cross-government assessment data.
            Individual national scores are not disclosed.
          </div>
          <PeerComparisonStrip compositeScore={compositeScore || 0} />
          
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => nav("peercomparison")}
              style={{
                background: "transparent",
                color: C.gold,
                border: `1px solid ${C.gold}`,
                padding: "10px 20px",
                fontFamily: "system-ui, sans-serif",
                fontSize: 10, letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 500,
                cursor: "pointer",
                borderRadius: 3,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                e.target.style.background = C.gold;
                e.target.style.color = C.void;
              }}
              onMouseLeave={e => {
                e.target.style.background = "transparent";
                e.target.style.color = C.gold;
              }}
            >
              View Detailed Comparison →
            </button>
          </div>
        </div>

        <Rule />

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 14, justifyContent: "flex-end", alignItems: "center" }}>
          <button
            onClick={() => nav("scorecard")}
            style={{
              background: "transparent",
              color: C.muted,
              border: `1px solid rgba(152,128,176,0.35)`,
              padding: "13px 32px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 10, letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = C.parchment;
              e.currentTarget.style.borderColor = "rgba(152,128,176,0.65)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = C.muted;
              e.currentTarget.style.borderColor = "rgba(152,128,176,0.35)";
            }}
          >
            View Full Scorecard
          </button>

          <button
            onClick={() => nav("roadmap")}
            style={{
              background: C.gold,
              color: C.void,
              border: "none",
              padding: "13px 36px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 10, letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#B8862A"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.gold; }}
          >
            View Roadmap →
          </button>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div style={{
          marginTop: 52,
          paddingTop: 20,
          borderTop: `1px solid ${C.bronze}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif", fontSize: 8.5,
            color: C.muted, opacity: 0.45,
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            Classification: Restricted · Tier 1 Automated Assessment
          </div>
          <div style={{
            fontFamily: "system-ui, sans-serif", fontSize: 8.5,
            color: C.muted, opacity: 0.45, letterSpacing: "0.1em",
          }}>
            SAPI © {new Date().getFullYear()} · CoreIntel
          </div>
        </div>
      </div>
    </div>
  );
}
