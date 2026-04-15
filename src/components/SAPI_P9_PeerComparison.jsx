import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAssessmentResults } from "../services/assessmentService";

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
    <div className="relative h-[7px] bg-sapi-bronze/18 rounded-[2px] flex-1 overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 rounded-[2px]"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ── Scale tick row ───────────────────────────────────────────────────────────
function ScaleRuler() {
  return (
    <div className="flex items-center gap-3 mt-2.5">
      {/* label column spacer */}
      <div className="w-[108px] flex-shrink-0" />
      {/* tick marks */}
      <div className="flex-1 relative h-3.5">
        {[0, 25, 50, 75, 100].map(tick => (
          <span
            key={tick}
            className="absolute -translate-x-1/2 font-sans text-[9px] text-sapi-muted tracking-[0.06em] opacity-45 select-none"
            style={{ left: `${tick}%` }}
          >
            {tick}
          </span>
        ))}
      </div>
      {/* value column spacer */}
      <div className="w-[30px] flex-shrink-0" />
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
    <div className="bg-sapi-navy border border-sapi-bronze py-5 px-6 pb-4.5 mb-1.5">
      {/* ── Row header ── */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-baseline gap-2.5">
          <span className="font-sans text-[15px] text-sapi-gold opacity-55">
            {dim.num}
          </span>
          <span className="font-serif text-[17px] text-sapi-parchment tracking-[0.01em]">
            {dim.name}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.14em] uppercase whitespace-nowrap"
          style={{ color: status.color }}
        >
          <span className="text-[9px] opacity-90">{status.glyph}</span>
          <span>{status.text}</span>
          <span className="font-sans text-[13px] tracking-[0.04em] opacity-70">
            ({status.delta} pts)
          </span>
        </div>
      </div>

      {/* ── Bar rows ── */}
      <div className="flex flex-col gap-2">
        {barRows.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-[108px] flex-shrink-0 font-sans text-[10px] tracking-[0.12em] uppercase text-sapi-muted opacity-70">
              {label}
            </div>
            <HBar value={value} color={color} />
            <div
              className="w-[30px] flex-shrink-0 font-sans text-[15px] text-right tracking-[-0.01em]"
              style={{ color }}
            >
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
    <div className="font-sans text-[10px] tracking-[0.22em] text-sapi-gold uppercase mb-3.5">
      {children}
    </div>
  );
}

// ── Main exported component ──────────────────────────────────────────────────
export default function SAPIPeerComparison({ appState: passedState, setAppState, setCurrentPage }) {
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
          setError(response.error || 'Failed to load peer comparison data');
        }
      } catch (err) {
        setError(err.message || 'Failed to load peer comparison data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Merge API data with passed state
  const appState = passedState || (apiData ? {
    scores: {
      D1: Number(apiData.compute_capacity) || 0,
      D2: Number(apiData.capital_formation) || 0,
      D3: Number(apiData.regulatory_readiness) || 0,
      D4: Number(apiData.data_sovereignty) || 0,
      D5: Number(apiData.directed_intelligence) || 0,
    },
    orgProfile: { developmentStage: "Developing" },
  } : null);
  
  // eslint-disable-next-line no-unused-vars
  const nav = (page) => {
    if (typeof setCurrentPage === "function") setCurrentPage(page);
    navigate(`/${page}`);
  };
  
  const [upgradeHover, setUpgradeHover] = useState(false);
  const [backHover,    setBackHover]    = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center">
        <div className="font-sans text-sm text-sapi-muted tracking-[0.1em] mt-6">
          Loading peer comparison data…
        </div>
      </div>
    );
  }

  if (error || !appState) {
    return (
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center p-10">
        <div className="font-serif text-lg text-sapi-crimson mt-6 mb-4">
          {error || "Unable to load peer comparison"}
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

  const { scores = {}, orgProfile = {} } = appState;
  const stage = orgProfile.developmentStage || "Developing";

  // Resolve peer benchmarks (fallback to Developing if stage not found)
  const benchmarks = PEER_BENCHMARKS[stage] ?? PEER_BENCHMARKS["Developing"];

  // Normalise score keys
  const dimScores = extractScores(scores);

  return (
    <div className="bg-sapi-void min-h-screen text-sapi-parchment font-serif">

      {/* ── Header ── */}
      <header className="border-b border-sapi-bronze py-5">
        <div className="max-w-[1100px] mx-auto px-8 flex items-center gap-4">
          <div className="font-serif text-[11px] tracking-[0.2em] text-sapi-parchment uppercase leading-[1.5]">
            The Sovereign AI<br />Power Index
          </div>
          <div className="ml-auto font-sans text-[10px] tracking-[0.16em] text-sapi-muted uppercase border border-sapi-bronze px-2.5 py-1">
            Classification: Restricted
          </div>
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
      </header>

      {/* ── Main content ── */}
      <div className="max-w-[1100px] mx-auto px-8 py-8 pb-20">

        {/* ── Back button ── */}
        <button
          className="bg-none border-none cursor-pointer font-sans text-[11px] tracking-[0.14em] uppercase flex items-center gap-1.5 p-0 transition-colors duration-150 mb-9 hover:text-sapi-gold"
          style={{ color: backHover ? C.gold : C.muted }}
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
        <div className="mb-1.5">
          <SectionLabel>Analysis Module</SectionLabel>
          <h1 className="font-serif text-[30px] font-normal text-sapi-parchment m-0 mb-4 tracking-[0.015em] leading-[1.2]">
            Peer Comparison
          </h1>
        </div>

        {/* ── Stage context line ── */}
        <p className="font-sans text-[15px] text-sapi-muted leading-[1.7] m-0 tracking-[0.02em]">
          Your nation is assessed at the{" "}
          <span className="text-sapi-parchment italic">{stage}</span>{" "}
          stage. Peer data shown below is aggregated from nations at this development stage.
          Named-country benchmarks are available at Tier 2.
        </p>

        {/* ── Divider ── */}
        <div className="border-t border-sapi-bronze my-7" />

        {/* ── Legend ── */}
        <div className="flex items-center gap-7 mb-5 flex-wrap">
          <div className="font-sans text-[10px] tracking-[0.18em] uppercase text-sapi-muted opacity-60 mr-1">
            Legend
          </div>
          {[
            { color: C.gold,    label: "Your Score"   },
            { color: C.muted,   label: "Peer Median"  },
            { color: C.emerald, label: "Top Quartile" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="font-sans text-[11px] text-sapi-muted tracking-[0.1em]">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Per-dimension rows ── */}
        <div className="mb-10">
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
        {/* <div className="bg-sapi-navy border border-sapi-gold p-7 pb-7 relative">
          <div
            className="absolute -top-px -left-px -right-px h-0.5 pointer-events-none"
            style={{ background: `linear-gradient(90deg, ${C.gold} 0%, rgba(201,150,58,0.3) 100%)` }}
          />

          <div className="flex items-start gap-4 mb-4.5 flex-wrap">
            <div className="border border-sapi-gold text-sapi-gold font-sans text-[9px] tracking-[0.22em] uppercase px-2.5 py-1 flex-shrink-0 self-start">
              Tier 2
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-sapi-parchment m-0 mb-2.5 tracking-[0.01em] leading-[1.35]">
                Benchmark against named peer nations
              </h3>
              <p className="font-sans text-[15px] text-sapi-muted leading-[1.72] m-0 tracking-[0.02em]">
                Tier 1 peer data is aggregated by development stage. Upgrade to Tier 2 to see
                your nation benchmarked against specific peer nations by region, income level,
                and dimension profile.
              </p>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 border-none px-7 py-3.5 font-sans text-[11px] tracking-[0.22em] uppercase font-medium cursor-pointer rounded transition-colors duration-150 hover:bg-[#B8862A] mt-2"
            style={{
              background: upgradeHover ? "#B8862A" : C.gold,
              color: C.void,
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
        </div> */}

      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-sapi-bronze">
        <div className="max-w-[1100px] mx-auto px-8 py-4.5 flex justify-between flex-wrap gap-2">
          <span className="font-sans text-[11px] text-sapi-muted tracking-[0.1em] opacity-50">
            © 2026 The Sovereign AI Power Index. All rights reserved.
          </span>
          <span className="font-sans text-[11px] text-sapi-muted tracking-[0.1em] opacity-50">
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
