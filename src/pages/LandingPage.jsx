import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, PageHeader, PageFooter } from "./common";

// ── Data ─────────────────────────────────────────────────────────────────────
const DIMENSIONS = [
  { num: "01", name: "Compute Capacity", def: "Sovereign access to high-performance compute and energy infrastructure." },
  { num: "02", name: "Capital Formation", def: "Institutional capital available for long-horizon AI infrastructure investment." },
  { num: "03", name: "Regulatory Readiness", def: "Governance frameworks that enable public trust in AI systems." },
  { num: "04", name: "Data Sovereignty", def: "National control over the data AI learns from and acts upon." },
  { num: "05", name: "Directed Intelligence Maturity", def: "How effectively your nation turns AI capability into coordinated state action." },
];

const TIERS = [
  {
    tier: "TIER 1",
    name: "Free Self-Assessment",
    depth: "30 questions",
    description: "30 multiple-choice questions. Automated scoring. Instant results with dimension scores and tier classification. Automated roadmap generated from scoring gaps.",
    price: "Free",
    highlight: true,
  },
  {
    tier: "TIER 2",
    name: "Enhanced Assessment",
    depth: "60–90 questions",
    description: "Deeper follow-up questions triggered by Tier 1 responses. AI agent conducts structured dialogue to clarify ambiguous answers. Sub-indicator level scoring.",
    price: "£5,000–£15,000",
    highlight: false,
  },
  {
    tier: "TIER 3",
    name: "Practitioner Assessment",
    depth: "Full assessment",
    description: "SAPI practitioner-led assessment with structured interviews, document review, and institutional analysis. Cross-referenced against public data sources.",
    price: "£50,000–£150,000",
    highlight: false,
  },
  {
    tier: "TIER 4",
    name: "Sovereign Deep Dive",
    depth: "Full assessment + longitudinal",
    description: "Comprehensive institutional evaluation including classified briefings (where applicable), multi-year trend analysis, peer benchmarking, and council membership pathway.",
    price: "£250,000+",
    highlight: false,
  },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage({ onBegin }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const handleBegin = () => {
    window.scrollTo(0, 0);
    navigate('/preview');
    if (onBegin) onBegin();
  };

  return (
    <PageLayout>
      {/* ── Header ── */}
      <PageHeader showAdmin={true} />

      {/* ── Hero ── */}
      <div className="px-8 pt-10 pb-16 max-w-container mx-auto border-b border-sapi-bronze">
        <div className="font-sans text-[17px] text-sapi-muted tracking-extra-wide uppercase mb-2">
          Sovereign AI Readiness Assessment · Free · 12 Minutes
        </div>
        <div className="font-serif text-[36px] font-normal text-sapi-parchment tracking-wide leading-[1.35] max-w-[680px] mb-5">
          The nations that lead the AI era will not do so by accident.
        </div>
        <div className="font-sans text-[16px] text-sapi-muted leading-[1.8] max-w-[620px] mt-5 mb-7">
          Governments that understand their AI position today will set the terms of global competition for the next two decades. Those that don't will find those terms set for them. SAPI gives your ministry the diagnostic clarity to make consequential decisions — on infrastructure, investment, governance, and strategic deployment — before the window closes.
        </div>
        <div className="flex flex-wrap gap-6 mb-1 px-19">
          {[
            ["Benchmark", "See exactly where your nation stands across five dimensions of AI power"],
            ["Prioritise", "Identify the highest-leverage gaps your government should close first"],
            ["Act", "Receive a prioritised roadmap tailored to your current score and development stage"],
          ].map(([label, desc]) => (
            <div key={label} className="flex-1 min-w-[160px]">
              <div className="font-sans text-[14px] tracking-extra-wide text-sapi-gold uppercase mb-1.5">
                {label}
              </div>
              <div className="font-sans text-[15px] text-sapi-muted leading-relaxed">
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Five Dimensions ── */}
      <div className="px-8 py-14 max-w-container mx-auto border-b border-sapi-bronze">
        <div className="font-sans text-[14px] tracking-super-wide text-sapi-gold uppercase mb-7">
          The Five Dimensions of Sovereign AI Readiness
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
          {DIMENSIONS.map((d) => (
            <div key={d.num} className="bg-sapi-navy border-l-[3px] border-sapi-gold px-5 py-6">
              <div className="font-sans text-[32px] text-sapi-gold font-normal leading-none mb-2.5 opacity-70">
                {d.num}
              </div>
              <div className="font-serif text-[17px] text-sapi-parchment font-normal mb-2.5 tracking-wide leading-tight">
                {d.name}
              </div>
              <div className="font-sans text-[15px] text-sapi-muted leading-relaxed">
                {d.def}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier Table ── */}
      <div className="px-8 py-14 max-w-container mx-auto border-b border-sapi-bronze">
        <div className="font-sans text-[14px] tracking-super-wide text-sapi-gold uppercase mb-7">
          Assessment Architecture
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {TIERS.map((t) => (
                  <th 
                    key={t.tier} 
                    className={`text-left p-3 font-sans text-[14px] tracking-extra-wide uppercase font-medium ${
                      t.highlight 
                        ? 'text-sapi-gold border-2 border-sapi-gold bg-[rgba(201,150,58,0.06)]' 
                        : 'text-sapi-muted border-b border-sapi-bronze'
                    }`}
                  >
                    {t.tier}
                    <span className={`block text-[15px] mt-0.5 tracking-wide normal-case font-serif ${
                      t.highlight ? 'text-sapi-paleGold' : 'text-sapi-muted'
                    }`}>
                      {t.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Depth row */}
              <tr>
                {TIERS.map((t) => (
                  <td 
                    key={t.tier} 
                    className={`p-3 font-sans text-[17px] text-sapi-parchment align-top leading-normal ${
                      t.highlight 
                        ? 'border-b border-[rgba(201,150,58,0.3)] border-l-2 border-r-2 border-sapi-gold bg-[rgba(201,150,58,0.04)]' 
                        : 'border-b border-sapi-bronze'
                    }`}
                  >
                    <span className="block font-sans text-[14px] tracking-extra-wide text-sapi-muted uppercase mb-0.5">
                      Depth
                    </span>
                    {t.depth}
                  </td>
                ))}
              </tr>
              {/* Description row */}
              <tr>
                {TIERS.map((t) => (
                  <td 
                    key={t.tier} 
                    className={`p-3 font-sans text-[17px] text-sapi-parchment align-top leading-normal ${
                      t.highlight 
                        ? 'border-b border-[rgba(201,150,58,0.3)] border-l-2 border-r-2 border-sapi-gold bg-[rgba(201,150,58,0.04)]' 
                        : 'border-b border-sapi-bronze'
                    }`}
                  >
                    <span className="block font-sans text-[14px] tracking-extra-wide text-sapi-muted uppercase mb-0.5">
                      Description
                    </span>
                    {t.description}
                  </td>
                ))}
              </tr>
              {/* Price row */}
              <tr>
                {TIERS.map((t) => (
                  <td 
                    key={t.tier} 
                    className={`p-3 font-sans text-[17px] align-top leading-normal ${
                      t.highlight 
                        ? 'border-b-2 border-l-2 border-r-2 border-sapi-gold bg-[rgba(201,150,58,0.04)] text-sapi-paleGold font-medium' 
                        : 'border-b border-sapi-bronze text-sapi-parchment'
                    }`}
                  >
                    <span className="block font-sans text-[14px] tracking-extra-wide text-sapi-muted uppercase mb-0.5">
                      Investment
                    </span>
                    {t.price}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-8 py-16 pb-[72px] max-w-container mx-auto border-b border-sapi-bronze flex flex-col items-center gap-5">
        <div className="font-serif text-[24px] text-sapi-parchment tracking-wide text-center font-normal">
          Begin Your Sovereign AI Assessment
        </div>
        <div className="font-sans text-[15px] text-sapi-muted tracking-extra-wide text-center max-w-[520px] leading-relaxed">
          The Tier 1 assessment comprises 30 questions across five dimensions. Completion time: approximately 12–18 minutes. Results are generated automatically upon submission.
        </div>
        <button
          className={`font-sans text-[15px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm mt-2 px-11 py-3.5 border-none transition-colors duration-150 ${
            hovering ? 'bg-[#B8862A] text-sapi-void' : 'bg-sapi-gold text-sapi-void'
          }`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={handleBegin}
        >
          Begin Tier 1 Assessment
        </button>
      </div>

      {/* ── Footer ── */}
      <PageFooter />
    </PageLayout>
  );
}
