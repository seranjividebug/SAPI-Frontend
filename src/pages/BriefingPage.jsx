import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageHeader, PageFooter } from "./common";

// Helper to capitalize first letter
const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

// ── Dimension data ───────────────────────────────────────────────────────────
const DIMENSIONS = [
  { num: "01",  name: "Compute Capacity",               questions: 5 },
  { num: "02",  name: "Capital Formation",              questions: 6 },
  { num: "03",  name: "Regulatory Readiness",           questions: 7 },
  { num: "04",  name: "Data Sovereignty",               questions: 6 },
  { num: "05",  name: "Directed Intelligence Maturity", questions: 6 },
];

const COUNTRY_LABELS = {
  UK:  "United Kingdom",
  UAE: "United Arab Emirates",
  KSA: "Kingdom of Saudi Arabia",
  AZ:  "Republic of Azerbaijan",
  KZ:  "Republic of Kazakhstan",
  QA:  "State of Qatar",
  SG:  "Republic of Singapore",
  IN:  "Republic of India",
  RW:  "Republic of Rwanda",
};

const COUNTRY_FLAGS = {
  UK: "🇬🇧", UAE: "🇦🇪", KSA: "🇸🇦", AZ: "🇦🇿",
  KZ: "🇰🇿", QA: "🇶🇦", SG: "🇸🇬", IN: "🇮🇳", RW: "🇷🇼",
};

// ── HOW-TO bullet data ───────────────────────────────────────────────────────
const INSTRUCTIONS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#C9963A" strokeWidth="1.1" />
        <path d="M5.5 8.5L7 10L10.5 6" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Answer based on your nation's current state, not aspirational plans or strategies under development.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#C9963A" strokeWidth="1.1" />
        <path d="M5 8H11M5 5.5H11M5 10.5H8.5" stroke="#C9963A" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
    text: "Select the response that most accurately reflects present operational capability, not policy intent.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2.5V8L11 10.5" stroke="#C9963A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="6.5" stroke="#C9963A" strokeWidth="1.1" />
      </svg>
    ),
    text: "There are no right or wrong answers. Precision produces the most useful diagnostic and roadmap.",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div className="font-sans text-[12px] tracking-super-wide text-sapi-gold uppercase mb-4">
      {children}
    </div>
  );
}

function Rule() {
  return <div className="border-t border-sapi-bronze my-11" />;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function BriefingPage({ onBegin }) {
  const navigate = useNavigate();

  const [beginHover, setBeginHover] = useState(false);
  const [backHover,  setBackHover]  = useState(false);

  // Get profile from localStorage (set by PreviewPage after API call)
  const profile = JSON.parse(localStorage.getItem('sapi_profile') || '{}');
  const { 
    respondent_name: name = "", 
    title = "", 
    ministry_or_department: ministry = "", 
    country = ""
  } = profile;

  const countryLabel = COUNTRY_LABELS[country] || country;
  const countryFlag  = COUNTRY_FLAGS[country]  || "";

  function handleBegin() {
    if (onBegin) {
      onBegin();
    } else {
      navigate('/dimintro');
    }
  }

  function handleBack() {
    navigate('/preview', { state: { from: 'briefing' } });
  }

  return (
    <PageLayout>
      <PageHeader showAdmin={false} />

      {/* ── Step indicator ── */}
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
          Back
        </button>

        <div className="flex items-center gap-1.5">
          {[
            { n: 1, label: "Organisation Profile",  active: false },
            { n: 2, label: "Assessment Briefing",   active: true  },
            { n: 3, label: "Assessment",             active: false },
          ].map((step, i) => (
            <div key={step.n} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-5 h-px bg-sapi-bronze mx-0.5" />}
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center font-sans text-[12px] font-medium ${
                  step.active ? 'bg-sapi-gold text-sapi-void border border-sapi-gold' : 'bg-transparent text-sapi-muted border border-sapi-bronze/40'
                }`}>
                  {step.n === 1 ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#9880B0" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.n}
                </div>
                <span className={`font-sans text-[13px] tracking-wide uppercase ${step.active ? 'text-sapi-parchment' : 'text-sapi-muted'}`}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[700px] mx-auto px-8 pt-14 pb-25">
        {/* Step label */}
        <div className="font-sans text-[12px] tracking-super-wide text-sapi-gold uppercase mb-5">
          Step 2 of 3 &nbsp;·&nbsp; Assessment Briefing
        </div>

        {/* Title */}
        <h1 className="font-serif text-[32px] font-normal text-sapi-parchment tracking-wide leading-tight mb-7">
          Your Tier 1 Sovereign AI<br />Readiness Assessment
        </h1>

        {/* Personalised greeting */}
        <div className="bg-sapi-navy border-l-[3px] border-sapi-gold px-8 pt-4 pb-4 flex items-center gap-3.5 mb-11">
          {countryFlag && (
            <span className="text-2xl leading-none flex-shrink-0">{countryFlag}</span>
          )}
          <div>
            <div className="font-serif text-[17px] text-sapi-parchment tracking-wide mb-1">
              Welcome, <span className="text-sapi-paleGold">{capitalize(name) || "Respondent"}</span>
              {ministry ? ` from ${capitalize(ministry)}` : ""}
              {countryLabel ? `, ${capitalize(countryLabel)}` : ""}.
            </div>
            {/* {title && (
              <div className="font-sans text-[11px] text-sapi-muted tracking-wide">
                {capitalize(title)}
              </div>
            )} */}
          </div>
        </div>

        {/* ── Three-stat strip ── */}
        <div className="grid grid-cols-3 gap-3 mb-11">
          {[
            { value: "30",      label: "Questions" },
            { value: "12–15",   label: "Minutes" },
            { value: "5",       label: "Dimensions" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-sapi-midnight border border-sapi-bronze border-b-2 border-b-sapi-bronze/40 px-5 py-5.5 text-center">
              <div className="font-sans text-[34px] text-sapi-paleGold font-medium leading-none mb-2 mt-2 mb-2">
                {value}
              </div>
              <div className="font-sans text-[12px] text-sapi-muted tracking-extra-wide uppercase mb-2">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Section: What this assessment measures ── */}
        <SectionLabel>What this assessment measures</SectionLabel>
        <p className="font-sans text-[15px] text-sapi-muted leading-relaxed mb-5 tracking-wide">
          The SAPI Tier 1 assessment evaluates your nation's sovereign AI readiness across five dimensions, each representing a distinct institutional condition required for durable AI capacity. Your responses generate a composite SAPI score — calculated as a weighted geometric mean — which maps your nation to one of five readiness tiers.
        </p>

        {/* Dimension list */}
        <div className="flex flex-col gap-px mb-11 border border-sapi-bronze">
          {DIMENSIONS.map((d, i) => (
            <div key={d.num} className={`px-4.5 py-3.5 flex items-center gap-4 ${i % 2 === 0 ? 'bg-sapi-navy' : 'bg-sapi-midnight'} ${i < DIMENSIONS.length - 1 ? 'border-b border-sapi-bronze' : ''}`}>
              <div className="font-sans text-[22px] text-sapi-gold font-medium leading-none opacity-65 w-7 flex-shrink-0 pl-2">
                {d.num}
              </div>
              <div className="font-serif text-[15px] text-sapi-parchment flex-1">
                {d.name}
              </div>
              <div className="font-sans text-[13px] text-sapi-muted tracking-wide whitespace-nowrap pr-3">
                {d.questions} questions
              </div>
            </div>
          ))}
        </div>

        <Rule />

        {/* ── Section: How to answer ── */}
        <SectionLabel>How to answer</SectionLabel>
        <div className="flex flex-col gap-4 mb-11">
          {INSTRUCTIONS.map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <p className="font-sans text-[15px] text-sapi-muted leading-relaxed m-0 tracking-wide">
                {text}
              </p>
            </div>
          ))}
        </div>

        <Rule />

        {/* ── Section: How your score is used ── */}
        <SectionLabel>How your score is used</SectionLabel>
        <p className="font-sans text-[15px] text-sapi-muted leading-relaxed mb-4 tracking-wide">
          Scoring is fully automated. Upon submission, your five dimension scores and composite SAPI score are calculated instantly and mapped to a readiness tier — from <em className="text-sapi-parchment">Pre-conditions Unmet</em> through to <em className="text-sapi-parchment">Sovereign AI Leader</em>.
        </p>
        <p className="font-sans text-[15px] text-sapi-muted leading-relaxed m-0 tracking-wide">
          Your results include a prioritised 12–18 month improvement roadmap with targeted interventions for your lowest-scoring dimensions, and a clear pathway to Tier 2 deep-dive assessment where required.
        </p>

        <Rule />

        {/* ── Confidentiality box ── */}
        <div className="border border-sapi-gold/25 border-l-[3px] border-l-sapi-gold bg-sapi-gold/5 px-5 py-4 mb-13 mt-10">
          <div className="font-sans text-[12px] tracking-extra-wide uppercase text-sapi-gold mb-2">
            Data Classification
          </div>
          <p className="font-sans text-[13px] text-sapi-muted leading-relaxed m-0">
            Your responses are used solely to generate your Tier 1 SAPI assessment report. No individual data is shared with third parties without your explicit consent.{" "}
            <em className="text-sapi-parchment">Classification: Restricted.</em>
          </p>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col gap-3 mt-10">
          <button
            className={`w-full text-sapi-void border-none px-12 py-4 font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm transition-colors duration-150 ${
              beginHover ? 'bg-[#B8862A]' : 'bg-sapi-gold'
            }`}
            onMouseEnter={() => setBeginHover(true)}
            onMouseLeave={() => setBeginHover(false)}
            onClick={handleBegin}
          >
            Begin Assessment
          </button>

          <button
            className={`w-full bg-transparent border px-12 py-3.5 font-sans text-[13px] tracking-extra-wide uppercase font-normal cursor-pointer rounded-sm transition-colors duration-150 ${
              backHover ? 'text-sapi-parchment border-sapi-bronze/40' : 'text-sapi-muted border-sapi-bronze'
            }`}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            onClick={handleBack}
          >
            ← Back
          </button>
        </div>

        <div className="font-sans text-[13px] text-sapi-muted tracking-wide text-center mt-3.5 opacity-55 leading-relaxed">
          Estimated completion: 12–15 minutes &nbsp;·&nbsp; Results delivered immediately
        </div>
      </div>

      <PageFooter />
    </PageLayout>
  );
}
