import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageHeader, PageFooter } from "./common";

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
    weight: "22%",
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
    weight: "20%",
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
    weight: "18%",
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
    weight: "18%",
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
    weight: "22%",
  },
];

// ── 5-Segment Progress Bar ────────────────────────────────────────────────────
function DimensionProgressBar({ currentIndex }) {
  return (
    <div className="flex gap-1.5 items-center">
      {DIMENSION_DATA.map((_, i) => {
        const isComplete = i < currentIndex;
        const isCurrent  = i === currentIndex;
        return (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm transition-colors duration-200 ${
              isComplete ? 'bg-sapi-gold' : isCurrent ? 'bg-transparent border border-sapi-gold' : 'bg-[rgba(107,69,8,0.25)]'
            }`}
          />
        );
      })}
    </div>
  );
}

// ── Sub-indicator Chip ────────────────────────────────────────────────────────
function SubChip({ label }) {
  return (
    <div className="font-sans text-[17px] tracking-wide text-sapi-muted border border-sapi-bronze/35 bg-sapi-navy px-2.5 py-1 rounded-sm whitespace-nowrap leading-snug">
      {label}
    </div>
  );
}

// ── Decorative dimension glyph ────────────────────────────────────────────────
function DimGlyph({ number }) {
  return (
    <div className="relative mb-2 select-none">
      {/* Foreground number only */}
      <div className="font-sans text-[58px] font-medium text-sapi-gold leading-none opacity-90 -tracking-wide">
        {number}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DimIntroPage({ currentIndex = 0, onBegin, onBack }) {
  const navigate = useNavigate();

  const [ctaHover,  setCtaHover]  = useState(false);
  const [backHover, setBackHover] = useState(false);

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
    <PageLayout>
      <PageHeader />

      {/* ── Top nav bar: back + wizard steps ── */}
      <div className="max-w-container mx-auto px-8 pt-5 flex items-center justify-between flex-wrap gap-4">
        <button
          className={`bg-none border-none cursor-pointer font-sans text-[13px] tracking-wide uppercase flex items-center gap-1.5 p-0 transition-colors duration-150 ${backHover ? 'text-sapi-gold' : 'text-sapi-muted'}`}
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
        <div className="flex items-center gap-1.5">
          {[
            { n: 1, label: "Organisation Profile", done: true  },
            { n: 2, label: "Assessment Briefing",  done: true  },
            { n: 3, label: "Assessment",            done: false },
          ].map((step, i) => (
            <div key={step.n} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-5 h-px bg-sapi-bronze" />}
              <div className={`flex items-center gap-1.5 ${step.done ? 'opacity-70' : 'opacity-100'}`}>
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${
                  step.done ? 'bg-sapi-gold/18 border border-sapi-gold/40' : 'border border-sapi-gold'
                } ${step.n === 3 ? 'bg-sapi-gold' : ''}`}>
                  {step.done ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M2 4.5L3.8 6.5L7 3" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className={`font-sans text-[11px] font-medium ${step.n === 3 ? 'text-sapi-void' : 'text-sapi-muted'}`}>
                      {step.n}
                    </span>
                  )}
                </div>
                <span className={`font-sans text-[12px] tracking-wide uppercase hidden sm:inline ${step.n === 3 ? 'text-sapi-parchment' : 'text-sapi-muted'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[720px] mx-auto px-8 pt-14 pb-20">
        {/* ── Dimension progress + label ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-sans text-[12px] tracking-super-wide uppercase text-sapi-gold">
              Dimension {currentIndex + 1} of 5
            </span>
            <span className="font-sans text-[12px] tracking-extra-wide uppercase text-sapi-muted opacity-70">
              {dim.questionCount} Questions
            </span>
          </div>
          <DimensionProgressBar currentIndex={currentIndex} />
        </div>

        {/* ── Dimension number + name ── */}
        <div className="relative mb-7">
          <DimGlyph number={dim.number} />

          <h1 className="font-serif text-[34px] font-normal text-sapi-parchment tracking-wide leading-tight mt-3.5">
            {dim.name}
          </h1>

          {/* Decorative underline rule */}
          <div className="mt-4 h-px bg-gradient-to-r from-sapi-gold to-sapi-gold/10 max-w-[240px]" />
        </div>

        {/* ── Weight badge ── */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 border border-sapi-gold/45 rounded-sm px-3 py-1 bg-sapi-gold/5">
            {/* Small diamond bullet */}
            <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
              <rect x="3.5" y="0.5" width="4.24" height="4.24" rx="0.4" transform="rotate(45 3.5 0.5)" fill="#C9963A" />
            </svg>
            <span className="font-sans text-[12px] tracking-extra-wide uppercase text-sapi-paleGold">
              Weight in SAPI Composite: {dim.weight}
            </span>
          </span>
        </div>

        {/* ── Definition ── */}
        <p className="font-sans text-[15px] text-sapi-parchment leading-relaxed mb-10 tracking-wide opacity-88">
          {dim.definition}
        </p>

        {/* ── Divider ── */}
        <div className="border-t border-sapi-bronze mb-8" />

        {/* ── Sub-indicators ── */}
        <div className="mb-12">
          <div className="font-sans text-[12px] tracking-super-wide uppercase text-sapi-muted mb-3.5 opacity-70">
            Sub-Indicators Assessed
          </div>

          <div className="flex flex-wrap gap-2">
            {dim.subIndicators.map((indicator, i) => (
              <SubChip key={i} label={indicator} />
            ))}
          </div>
        </div>

        {/* ── Contextual note card ── */}
        <div className="bg-sapi-navy border border-sapi-bronze border-l-[3px] border-l-sapi-gold/35 px-4.5 py-3.5 mb-11 flex items-start gap-3">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="7.5" cy="7.5" r="6.5" stroke="#9880B0" strokeWidth="1" />
            <path d="M7.5 5V7.5" stroke="#9880B0" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7.5" cy="10" r="0.7" fill="#9880B0" />
          </svg>
          <p className="font-sans text-[13px] text-sapi-muted leading-snug m-0 tracking-wide">
            Answer based on your nation's <em className="text-sapi-parchment italic">current operational state</em>, not plans or aspirational strategies under development. Precision in your responses produces the most actionable diagnostic output.
          </p>
        </div>

        {/* ── CTA button ── */}
        <div className="flex flex-col gap-3">
          <button
            className={`w-full text-sapi-void border-none px-12 py-4 font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm transition-colors duration-150 flex items-center justify-center gap-2.5 ${
              ctaHover ? 'bg-[#B8862A]' : 'bg-sapi-gold'
            }`}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onClick={handleBegin}
          >
            Begin {dim.name} Questions
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2.5L9.5 7L5 11.5" stroke="#06030E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {!isFirst && (
            <button
              className={`w-full bg-transparent border px-12 py-3.5 font-sans text-xs tracking-extra-wide uppercase font-normal cursor-pointer rounded-sm transition-colors duration-150 ${
                backHover ? 'text-sapi-parchment border-sapi-bronze/40' : 'text-sapi-muted border-sapi-bronze'
              }`}
              onMouseEnter={() => setBackHover(true)}
              onMouseLeave={() => setBackHover(false)}
              onClick={handleBack}
            >
              ← Back to Dimension {currentIndex}
            </button>
          )}
        </div>

        {/* ── Meta line ── */}
        <div className="font-sans text-[13px] text-sapi-muted tracking-wide text-center mt-3.5 opacity-50 leading-relaxed">
          {dim.questionCount} questions in this dimension &nbsp;·&nbsp; {30 - DIMENSION_DATA.slice(0, currentIndex).reduce((a, d) => a + d.questionCount, 0)} questions remaining
        </div>
      </div>

      <PageFooter />
    </PageLayout>
  );
}
