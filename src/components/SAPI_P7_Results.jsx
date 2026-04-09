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
      className="object-contain bg-transparent rounded-full p-1 box-border"
      style={{
        width: size,
        height: size,
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
    <svg width="320" height="310" viewBox="0 0 320 310" className="overflow-visible">
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
    <div className="w-full relative pt-7 pb-8">

      {/* Above-bar labels */}
      {[
        { value: globalMedian, label: "Global Median", sublabel: `${globalMedian}`, color: "white" },
        { value: topQuartile,  label: "Top Quartile",  sublabel: `${topQuartile}`,  color: "white"  },
      ].map((m) => (
        <div
          key={m.label}
          className="absolute top-0 -translate-x-1/2 text-center"
          style={{ left: `${m.value}%` }}
        >
          <div
            className="font-sans text-[8.5px] tracking-[0.12em] uppercase whitespace-nowrap"
            style={{ color: m.color, opacity: 0.8 }}
          >
            {m.label}
          </div>
          <div
            className="font-serif text-[10px]"
            style={{ color: m.color, opacity: 0.65 }}
          >
            {m.sublabel}
          </div>
        </div>
      ))}

      {/* Track */}
      <div className="relative h-2 rounded overflow-visible">
        {/* Gradient fill */}
        <div
          className="absolute inset-0 rounded opacity-[0.22]"
          style={{ background: `linear-gradient(90deg, ${C.crimson} 0%, ${C.amber} 39%, ${C.blue} 65%, ${C.emerald} 100%)` }}
        />
        {/* Base track */}
        <div
          className="absolute inset-0 rounded border"
          style={{ borderColor: C.bronzeHi, background: "rgba(255,255,255,0.03)" }}
        />

        {/* Median tick */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-[1.5px] opacity-50 -translate-x-1/2"
          style={{ left: `${globalMedian}%`, background: "white" }}
        />

        {/* Top quartile tick */}
        <div
          className="absolute top-[-3px] bottom-[-3px] w-[1.5px] opacity-50 -translate-x-1/2"
          style={{ left: `${topQuartile}%`, background: "white" }}
        />

        {/* User score dot */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-[2]"
          style={{
            left: `${score}%`,
            background: C.void,
            border: `2.5px solid ${C.gold}`,
            boxShadow: `0 0 12px rgba(201,150,58,0.55), 0 0 4px rgba(201,150,58,0.9)`,
          }}
        />
      </div>

      {/* Below-bar user label */}
      <div
        className="absolute bottom-0.5 -translate-x-1/2 text-center"
        style={{ left: `${score}%` }}
      >
        <div className="font-sans text-[8.5px] tracking-[0.12em] uppercase text-sapi-gold whitespace-nowrap">
          Your Score
        </div>
        <div className="font-serif text-[11px] text-sapi-paleGold font-normal">
          {score.toFixed(1)}
        </div>
      </div>

      {/* Axis ticks */}
      <div
        className="absolute -bottom-[18px] left-0 right-0 flex justify-between font-sans text-[8.5px] text-sapi-muted opacity-40 tracking-[0.06em]"
      >
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
      className="p-4.5 px-4 pt-3.5 cursor-pointer transition-colors duration-150 flex-[1_1_160px] min-w-[148px]"
      style={{
        background: hover ? C.midnight : C.navy,
        border: `1px solid ${hover ? "rgba(201,150,58,0.4)" : C.bronze}`,
        borderTop: `2.5px solid ${band.color}`,
        borderRadius: 6,
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-serif text-[11px] text-sapi-gold tracking-[0.15em] opacity-75">
          {dim.shortCode}
        </span>
        <span
          className="font-sans text-[8px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded-[2px]"
          style={{ color: band.color, background: band.bg }}
        >
          {band.label}
        </span>
      </div>

      <div className="font-sans text-[10.5px] text-sapi-muted leading-[1.4] mb-3 tracking-[0.01em]">
        {dim.name}
      </div>

      <div className="font-mono text-[30px] text-sapi-paleGold leading-none mb-3 font-medium tracking-[0.02em]">
        {score.toFixed(1)}
      </div>

      <div className="h-[3px] bg-sapi-bronze rounded-[2px] overflow-hidden mb-2">
        <div
          className="h-full rounded-[2px] opacity-70"
          style={{ width: `${score}%`, background: band.color }}
        />
      </div>

      <div
        className="font-sans text-[8.5px] text-sapi-muted tracking-[0.1em] transition-opacity duration-150"
        style={{ opacity: hover ? 0.65 : 0.25 }}
      >
        View scorecard →
      </div>
    </div>
  );
}

function Rule() {
  return <div className="h-px bg-sapi-bronze my-9" />;
}

function SectionLabel({ children }) {
  return (
    <div className="font-sans text-[9.5px] tracking-[0.24em] uppercase text-sapi-gold opacity-70 mb-4.5">
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
      <div className="min-h-screen bg-sapi-void flex items-center justify-center">
        <div className="text-sapi-paleGold font-sans text-sm">
          Loading results...
        </div>
      </div>
    );
  }

  if (error || !appState) {
    return (
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center p-10">
        <div className="font-serif text-lg text-sapi-crimson mb-4">
          {error || "Unable to load assessment results"}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-sapi-gold text-sapi-void border-none px-6 py-3 font-sans text-xs cursor-pointer rounded hover:opacity-90"
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
    <div className="min-h-screen bg-sapi-void font-sans">

      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="bg-sapi-navy border-b border-sapi-bronze px-10">
        <div className="max-w-[1080px] mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <SAPILogo size={34} />
            <div>
              <div className="font-serif text-[9.5px] tracking-[0.3em] uppercase text-sapi-parchment opacity-[0.88]">
                The Sovereign AI Power Index
              </div>
              <div className="font-sans text-[8.5px] tracking-[0.22em] uppercase text-sapi-gold opacity-60 mt-0.5">
                Assessment Results
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="font-serif text-[13px] text-sapi-parchment opacity-90 tracking-[0.04em]">
                {nationName}
              </div>
              <div className="font-sans text-[8.5px] text-sapi-muted opacity-60 tracking-[0.1em] uppercase mt-0.5">
                {date} · Tier 1 Assessment
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="max-w-[1080px] mx-auto px-10 py-11 pb-20">

        {/* ── HERO SECTION ─────────────────────────────────────────── */}
        <div className="flex bg-sapi-navy border border-sapi-bronzeHi rounded-[10px] overflow-hidden relative">
          {/* Ambient radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 75% 50%, rgba(201,150,58,0.05) 0%, transparent 60%)" }}
          />

          {/* LEFT PANEL */}
          <div className="flex-shrink-0 p-11 pr-11 pl-12 border-r border-sapi-bronze flex flex-col min-w-[280px]">
            {/* Label */}
            <div className="font-sans text-[8.5px] tracking-[0.26em] uppercase text-sapi-muted opacity-65 mb-3">
              Composite SAPI Score
            </div>

            {/* Giant number */}
            <div className="font-mono text-[90px] text-sapi-paleGold leading-[0.9] tracking-[-0.02em] mb-5.5 font-medium">
              {compositeScore != null ? compositeScore.toFixed(1) : "—"}
            </div>

            {/* Tier pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[40px] mb-8 self-start"
              style={{ border: `1.5px solid ${tier.color}`, background: tier.bg }}
            >
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tier.color }} />
              <span className="font-sans text-[9.5px] tracking-[0.22em] uppercase font-medium" style={{ color: tier.color }}>
                {tier.label}
              </span>
            </div>

            {/* Tier scale mini-legend */}
            <div className="flex flex-col gap-1.5">
              {[
                { range: "80–100", label: "Sovereign AI Leader",  color: C.emerald },
                { range: "60–79",  label: "Advanced",             color: C.blue    },
                { range: "40–59",  label: "Developing",           color: C.amber   },
                { range: "20–39",  label: "Nascent",              color: C.gold    },
                { range: "1–19",   label: "Pre-conditions Unmet", color: C.crimson },
              ].map((t) => {
                const isActive = t.label === tier.label;
                return (
                  <div key={t.label} className="flex items-center gap-2" style={{ opacity: isActive ? 1 : 0.3 }}>
                    <div className="w-4 h-0.5 rounded-[1px] flex-shrink-0" style={{ background: t.color }} />
                    <span className="font-sans text-[8.5px] tracking-[0.05em]" style={{ color: isActive ? t.color : C.muted }}>
                      {t.range} — {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL — Radar */}
          <div className="flex-1 flex flex-col items-center justify-center p-9 relative">
            {/* Report Button - Top Right of Radar Panel */}
            <button
              onClick={() => navigate('/results-report')}
              className="absolute top-5 right-5 px-4 py-2 bg-sapi-gold border-none rounded font-sans text-[11px] font-medium text-sapi-void cursor-pointer transition-opacity duration-200 z-10 hover:opacity-85"
            >
              Report
            </button>

            <div className="font-sans text-[9px] tracking-[0.22em] uppercase text-sapi-muted opacity-55 mb-2 self-start">
              Dimension Profile · 0–100 Scale
            </div>
            <RadarChart scores={dimScores} />
          </div>
        </div>

        <Rule />

        {/* ── DIMENSION SUMMARY ────────────────────────────────────── */}
        <SectionLabel>Dimension Scores</SectionLabel>
        <div className="flex gap-3 flex-wrap">
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
        <div className="bg-sapi-navy border border-sapi-bronze border-l-[3px] border-l-sapi-gold rounded-md py-6 px-7">
          <p className="font-serif text-sm text-sapi-parchment leading-[1.9] m-0 tracking-[0.015em]">
            {nationName} has achieved a composite SAPI score of{" "}
            <strong className="text-sapi-paleGold font-medium font-mono">
              {compositeScore?.toFixed(1)}
            </strong>,
            placing it in the{" "}
            <span style={{ color: tier.color }}>{tier.label}</span> tier.
            The primary constraint on sovereign AI capacity is{" "}
            <em className="text-sapi-parchment not-italic">{lowest.name}</em>,
            which scored{" "}
            <span className="font-mono" style={{ color: getBand(lowest.score).color }}>{lowest.score.toFixed(1)}</span>.
            Relative strengths were identified in{" "}
            <em className="text-sapi-parchment not-italic">{highest.name}</em>
            {" "}(<span className="text-sapi-paleGold font-mono">{highest.score.toFixed(1)}</span>)
            {" "}and{" "}
            <em className="text-sapi-parchment not-italic">{secondHighest.name}</em>
            {" "}(<span className="text-sapi-paleGold font-mono">{secondHighest.score.toFixed(1)}</span>).
            The 12–18 month roadmap below identifies priority interventions aligned to these findings.
          </p>
        </div>

        <Rule />

        {/* ── PEER COMPARISON ──────────────────────────────────────── */}
        <SectionLabel>Global Positioning</SectionLabel>
        <div className="bg-sapi-navy border border-sapi-bronze rounded-md py-7 px-9">
          <div className="font-sans text-[11px] text-sapi-muted leading-[1.65] mb-6 tracking-[0.02em] opacity-80">
            Composite score benchmarked against Tier 1 respondent distribution.
            Reference markers based on aggregate cross-government assessment data.
            Individual national scores are not disclosed.
          </div>
          <PeerComparisonStrip compositeScore={compositeScore || 0} />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => nav("peercomparison")}
              className="bg-transparent text-sapi-gold border border-sapi-gold px-5 py-2.5 font-sans text-[10px] tracking-[0.14em] uppercase font-medium cursor-pointer rounded hover:bg-sapi-gold hover:text-sapi-void transition-all duration-150"
            >
              View Detailed Comparison →
            </button>
          </div>
        </div>

        <Rule />

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <div className="flex gap-3.5 justify-end items-center">
          <button
            onClick={() => nav("scorecard")}
            className="bg-transparent text-sapi-muted border border-sapi-muted/35 px-8 py-3.5 font-sans text-[10px] tracking-[0.22em] uppercase font-medium cursor-pointer rounded hover:text-sapi-parchment hover:border-sapi-muted/65 transition-colors duration-150"
          >
            View Full Scorecard
          </button>

          <button
            onClick={() => nav("roadmap")}
            className="bg-sapi-gold text-sapi-void border-none px-9 py-3.5 font-sans text-[10px] tracking-[0.22em] uppercase font-medium cursor-pointer rounded hover:bg-[#B8862A] transition-colors duration-150"
          >
            View Roadmap →
          </button>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="mt-13 pt-5 border-t border-sapi-bronze flex justify-between items-center">
          <div className="font-sans text-[8.5px] text-sapi-muted opacity-45 tracking-[0.12em] uppercase">
            Classification: Restricted · Tier 1 Automated Assessment
          </div>
          <div className="font-sans text-[8.5px] text-sapi-muted opacity-45 tracking-[0.1em]">
            SAPI © {new Date().getFullYear()} · CoreIntel
          </div>
        </div>
      </div>
    </div>
  );
}
