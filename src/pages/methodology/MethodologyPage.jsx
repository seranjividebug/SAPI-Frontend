import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DimensionChart } from "../main/DimensionChart";
import { PageLayout, EnhancedFooter } from "../common";

// Placeholder components
const FadeIn = ({ children, className = "", delay = 0 }) => (
  <div className={className} style={{ '--animation-delay': `${delay}s`, animationDelay: 'var(--animation-delay)' }}>
    {children}
  </div>
);

const SectionLabel = ({ children, tone = "default", className = "" }) => (
  <div className={`font-sans text-[13px] tracking-[0.22em] uppercase ${
    tone === "accent" || tone === "white" ? "text-sapi-gold" : "text-sapi-muted"
  } ${className}`}>
    {children}
  </div>
);

const Button = ({ href, variant = "default", children }) => {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate(href)}
      className={`font-sans text-[15px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-11 py-3.5 transition-colors duration-150 ${
        variant === "text" 
          ? "text-sapi-gold hover:text-[#B8862A]" 
          : "bg-sapi-gold text-sapi-void hover:bg-[#B8862A]"
      }`}
    >
      {children}
    </button>
  );
};

const PageHero = ({ cta, description, label, title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <SectionLabel tone="accent">{label}</SectionLabel>
      <h1 className="font-sans text-5xl leading-tight text-sapi-parchment max-w-4xl">
        {title}
      </h1>
      <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
        {description}
      </p>
      <button 
        onClick={() => navigate(cta.href)}
        className="font-sans text-[15px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-11 py-3.5 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
      >
        {cta.label}
      </button>
    </div>
  );
};

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a0a12] border-b border-sapi-bronze py-2">
      <div className="pl-2 pr-8 py-1 max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/SAPI_Logo_B4.svg"
            alt="SAPI Logo"
            className="h-40 w-40 object-contain"
          />
          <div
            className="font-sans text-xl text-[#fbf5e6] cursor-pointer tracking-wide leading-tight"
            onClick={() => navigate('/main')}
          >
            THE SOVEREIGN<br />AI POWER INDEX
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/sapi-index')}
          >
            Index
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/methodology')}
          >
            Methodology
          </button>
          {/* <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/sapi-index')}
          >
            Preview
          </button> */}
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/about')}
          >
            About Us
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-6 py-2 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
            onClick={() => navigate('/contact')}
          >
            Request Introduction
          </button>
        </div>
      </div>
    </header>
  );
};

const dimensions = [
   {
    key: "compute",
    label: "Compute Capacity",
    shortDescription: "Sovereign access to high-performance compute and energy.",
    description:
      "Assesses access to hyperscale compute, power resilience, grid capacity, and the physical infrastructure required to host strategic AI workloads.",
    sampleScore: 58,
  },
  {
    key: "capital",
    label: "Capital Formation",
    shortDescription: "The depth and strategic orientation of capital for AI development: sovereign wealth deployment, venture ecosystems, and mechanisms directing capital toward sovereign priorities.",
    description:
      "The depth and strategic orientation of capital for AI development: sovereign wealth deployment, venture ecosystems, and mechanisms directing capital toward sovereign priorities.",
    sampleScore: 72,
  },
  {
    key: "regulatory",
    label: "Regulatory Readiness",
    shortDescription: "The policy conditions that allow AI infrastructure to move with velocity.",
    description:
      "Scores legal clarity, procurement maturity, licensing pathways, and the coherence of national AI policy to support deployment.",
    sampleScore: 65,
  },
  {
    key: "dataSov",
    label: "Data Sovereignty",
    shortDescription: "Control over strategic data, hosting and trusted operating environments.",
    description:
      "Evaluates national control over data localisation, trusted cloud environments, security frameworks, and jurisdictional certainty.",
    sampleScore: 62,
  },
  {
    key: "di",
    label: "Directed Intelligence Maturity",
    shortDescription: "How effectively a nation or corporation turns AI capability into AI revenue.",
    description:
      "Captures the operating maturity required to convert AI capability into state and corporate level execution, from mission design to durable institutional adoption.",
    sampleScore: 63,
    proprietary: true,
  },
];

const dimensionWeights = [
  { dimension: "Compute Capacity", weightRange: "15 - 20%" },
  { dimension: "Capital Formation", weightRange: "20 - 25%" },
  { dimension: "Regulatory Readiness", weightRange: "15 - 20%" },
  { dimension: "Data Sovereignty", weightRange: "10 - 15%" },
  { dimension: "Directed Intelligence Maturity", weightRange: "25 - 30%" },
];

export const methodologyLevels = [
  {
    level: "Experimental",
    description: "AI activity is fragmented, opportunistic, and not yet tied to state capacity.",
  },
  {
    level: "Emergent",
    description: "Pilot programmes exist, but national coordination remains inconsistent.",
  },
  {
    level: "Structured",
    description: "Core institutions have defined mandates, funding paths, and operating models.",
  },
  {
    level: "Directed",
    description: "AI capability is aligned to sovereign priorities and executed through durable governance.",
  },
  {
    level: "Intelligence Fabric",
    description: "AI is embedded across state operations as a coordinated national system.",
  },
];

export default function MethodologyPage() {
  return (
    <PageLayout>
      <CustomHeader />
      <section className="bg-[#0a0a12] pt-2 min-h-screen font-sans">
        <div className="px-8 py-8 max-w-container mx-auto">
          <div className="space-y-8">
            {/* <button
              className="bg-none border-none cursor-pointer font-sans text-[11px] tracking-[0.14em] uppercase flex items-center gap-1.5 p-0 transition-colors duration-150 mb-9 hover:text-sapi-gold text-sapi-muted"
              onClick={() => window.location.href = '/main'}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Main Page
            </button> */}
            <PageHero
              cta={{ href: "/contact", label: "Request an Introduction" }}
              description="The methodology explains the five dimensions, the scoring architecture and the institutional lens applied to sovereign AI readiness - with proprietary mechanics underpinning every scoring layer."
              label="Methodology"
              title="The Sovereign AI Power Index Methodology"
            />
          </div>

        <div className="grid gap-12 border-t border-sapi-bronze pt-12 lg:grid-cols-[0.82fr_1.18fr]">
          <FadeIn className="space-y-5">
            <SectionLabel>Institutional Lens</SectionLabel>
            <h2 className="font-sans max-w-xl text-3xl leading-tight text-sapi-parchment sm:text-4xl">
              What the framework is designed to test
            </h2>
          </FadeIn>

          <FadeIn className="space-y-8">
            <p className="text-lg leading-8 text-sapi-muted">
              SAPI is designed to answer a simple question: who can translate AI ambition into durable
              strategic capacity. The framework rewards more than technical capability. It tests whether capital,
              infrastructure, policy, and execution are aligned.
            </p>
            <p className="text-lg leading-8 text-sapi-muted">
              That alignment matters because sovereign AI readiness is not won by compute alone. It emerges when a
              nation can deploy, govern, finance, and protect intelligence infrastructure as a coherent system.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-10 pt-12">
          <FadeIn className="space-y-6">
            <SectionLabel>Five Dimensions</SectionLabel>
            <h2 className="font-sans max-w-4xl text-4xl leading-tight text-sapi-parchment sm:text-5xl lg:text-6xl">
              The scoring architecture
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-sapi-muted">
              Each dimension isolates a separate source of sovereign strength so the final score can be read like an
              institutional ratings sheet rather than an infographic.
            </p>
          </FadeIn>

          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <DimensionChart dimensions={dimensions} />
            </FadeIn>
          </div>
        </div>

        <div className="grid gap-10 pt-16 lg:grid-cols-2 lg:gap-x-14">
          {dimensions.map((dimension, index) => (
            <FadeIn key={dimension.key} delay={index * 0.04}>
              <div className="space-y-4 border-b border-sapi-bronze pb-10">
                <div className="flex flex-wrap items-center gap-3">
                  <SectionLabel className="text-sapi-parchment" tone="white">
                    {dimension.label}
                  </SectionLabel>
                  {dimension.proprietary ? (
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-sapi-gold">
                      Proprietary
                    </span>
                  ) : null}
                </div>
                <p className="text-base leading-8 text-sapi-muted">{dimension.description}</p>
              </div>
            </FadeIn>
          ))}

          <FadeIn className="border-l border-sapi-gold pl-6 lg:col-span-2">
            <p className="max-w-3xl text-base leading-8 text-sapi-muted">
              <span className="text-sapi-gold">Directed Intelligence Maturity</span> is proprietary to The Sovereign AI Power Index.
            </p>
            <div className="mt-6">
              <Button href="/contact" variant="text">Learn more</Button>
            </div>
          </FadeIn>
        </div>

        <div className="grid gap-12 border-t border-sapi-bronze pt-16 lg:grid-cols-[0.82fr_1.18fr]">
          <FadeIn className="space-y-5">
            <SectionLabel>Scoring Architecture</SectionLabel>
            <h2 className="font-sans max-w-xl text-3xl leading-tight text-sapi-parchment sm:text-4xl">
              How dimensions are weighted and scored.
            </h2>
          </FadeIn>

          <FadeIn className="space-y-8">
            <p className="max-w-3xl text-base leading-8 text-sapi-muted">
              Each dimension is scored on a 0 - 100 scale using a composite of quantitative indicators and qualitative
              practitioner assessment. The five dimension scores are weighted to produce a single composite SAPI score.
              Weightings are not equal, they reflect the relative contribution of each dimension to durable sovereign
              AI capability, not just current capacity.
            </p>

            <div className="border-t border-sapi-bronze">
              <div className="grid gap-3 border-b border-sapi-bronze py-5 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">Dimension</p>
                <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">Weight Range</p>
              </div>
              {dimensionWeights.map((row, index) => (
                <FadeIn key={row.dimension} delay={index * 0.04}>
                  <div className="grid gap-3 border-b border-sapi-bronze py-5 md:grid-cols-[1.2fr_0.8fr] md:items-start">
                    <p className={`text-lg leading-8 ${row.dimension === "Directed Intelligence Maturity" ? "text-sapi-gold" : "text-sapi-parchment"}`}>{row.dimension}</p>
                    <p className="text-base leading-8 text-sapi-muted">{row.weightRange}</p>
                  </div>
                </FadeIn>
              ))}
              <p className="font-sans pt-3 text-[0.72rem] uppercase tracking-[0.22em] text-sapi-muted/70">[National scoring architecture]</p>
            </div>

            <p className="max-w-3xl text-base leading-8 text-sapi-muted">
              Weights are expressed as ranges rather than fixed values because SAPI applies contextual adjustment based
              on a nation's development stage. A nation at Level 2 on the DI Maturity scale may have its Regulatory
              Readiness weight increased to reflect the outsized role that policy frameworks play at that stage. The
              full weighting methodology is available under NDA to institutional counterparts.
            </p>

            <div className="space-y-5 border-t border-sapi-bronze pt-8">
              <h3 className="font-sans text-3xl leading-tight text-sapi-parchment sm:text-4xl">Data sources</h3>
              <p className="max-w-3xl text-base leading-8 text-sapi-muted">
                SAPI scores are derived from a combination of public data (government AI strategies, budget filings,
                energy grid capacity reports, regulatory frameworks), proprietary practitioner assessment, and
                structured interviews with in-country AI and corporate leads. No single data source determines a score. The Directed Intelligence Maturity dimension is exclusive to The Sovereign AI Power Index.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="grid gap-12 border-t border-sapi-bronze pt-12 lg:grid-cols-[0.82fr_1.18fr]">
          <FadeIn className="space-y-5">
            <SectionLabel tone="accent">Directed Intelligence Maturity</SectionLabel>
            <h2 className="font-sans max-w-xl text-3xl leading-tight text-sapi-parchment sm:text-4xl">
              Five stages of institutional adoption
            </h2>
          </FadeIn>

          <div className="grid gap-6">
            {methodologyLevels.map((level, index) => (
              <FadeIn key={level.level} delay={index * 0.04}>
                <div className="border-b border-sapi-bronze pb-6">
                  <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-parchment">{level.level}</p>
                  <p className="mt-3 text-base leading-8 text-sapi-muted">{level.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn>
          <div className="max-w-xl">
            <Button href="/contact" variant="text">
              Request the Full Methodology Paper →
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
    <EnhancedFooter />
    </PageLayout>
  );
}
