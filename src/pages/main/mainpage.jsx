import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DimensionChart } from "./DimensionChart";
import { PageLayout, EnhancedFooter } from "../common";
import { SAPIGlobe } from "../common/Logo";

// Placeholder components for the imports that don't exist in this project
const FadeIn = ({ children, className = "", delay = 0 }) => (
  <div className={className} style={{ '--animation-delay': `${delay}s`, animationDelay: 'var(--animation-delay)' }}>
    {children}
  </div>
);

const SectionLabel = ({ children, tone = "default" }) => (
  <div className={`font-sans text-[13px] tracking-[0.22em] uppercase ${
    tone === "accent" ? "text-sapi-gold" : "text-sapi-muted"
  }`}>
    {children}
  </div>
);

const HorizontalRule = () => (
  <div className="w-full h-px bg-sapi-bronze" />
);

const AnimatedStat = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  return <span>{value}</span>;
};

const StatRow = ({ label, value }) => (
  <div className="border-l border-sapi-bronze pl-6">
    <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">{label}</p>
    <p className="font-sans text-5xl leading-none text-sapi-parchment mt-4">{value}</p>
  </div>
);

const CustomHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a0a12] border-b border-sapi-bronze py-2">
      <div className="px-8 py-4 max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/main')} className="cursor-pointer">
            <SAPIGlobe size={180} />
          </div>
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
            onClick={() => navigate('/methodology')}
          >
            Methodology
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/about')}
          >
            About
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/contact')}
          >
            Request Introduction
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-6 py-2 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
            onClick={() => navigate('/login')}
          >
            Index
          </button>
        </div>
      </div>
    </header>
  );
};

const HeroSection = ({ title, description, primaryCta }) => {
  const navigate = useNavigate();
  
  return (
    <div className="px-8 py-8 max-w-container mx-auto">
      <h1 className="font-sans text-5xl leading-tight text-sapi-parchment mb-6 max-w-4xl">
        {title}
      </h1>
      <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl mb-8">
        {description}
      </p>
      <button 
        onClick={() => navigate(primaryCta.href)}
        className="font-sans text-[15px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm px-11 py-3.5 bg-sapi-gold text-sapi-void hover:bg-[#B8862A] transition-colors duration-150"
      >
        {primaryCta.label}
      </button>
    </div>
  );
};

// Constants
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

const standardStats = [
  { label: "SOVEREIGN CAPITAL INVESTED", value: "£584M" },
  { label: "REVIEW SESSIONS PER YEAR", value: "4" },
  { label: "AI DIMENSIONS MEASURED", value: "5" },
];

export default function MainPage() {
  return (
    <PageLayout>
      <CustomHeader />
      
      <div className="bg-[#0a0a12] min-h-screen">
        {/* Hero Section */}
        <HeroSection
        description="SAPI scores national and corporate AI readiness across five dimensions, convenes quarterly in Westminster, and architects the governance systems that determine which entities lead and which depend."
        primaryCta={{ href: "/contact", label: "Request an Introduction" }}
        title="Sovereign AI readiness intelligence for nations and capital."
      />

      {/* The Standard Section */}
      <section className="bg-[#0a0a12] border-b border-sapi-bronze">
        <div className="px-8 py-20 max-w-container mx-auto">
          <FadeIn className="space-y-10">
            <SectionLabel tone="accent">The Standard</SectionLabel>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="space-y-6">
                <h2 className="font-sans text-4xl leading-tight text-sapi-parchment sm:text-5xl lg:text-6xl max-w-4xl">
                  Every consequential standard began the same way.
                </h2>
                <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
                  A credible measure entered the market. Capital reorganised around it. Policy followed. Access
                  became conditional on it.
                </p>
                <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
                  Credit ratings did this for sovereign debt. ESG scores did it for institutional allocation. SAPI is
                  doing it for sovereign AI.
                </p>
              </div>

              <div className="border-l border-sapi-bronze pl-6">
                <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">Lead market signal</p>
                <p className="font-sans text-6xl leading-none text-sapi-parchment sm:text-7xl lg:text-[6.5rem] mt-4">
                  <AnimatedStat value="64" />
                </p>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-sapi-muted/70 mt-3">
                  SAPI Composite Score
                </p>
                <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-sapi-gold mt-3">
                  SAMPLE COUNTRY
                </p>
              </div>
            </div>

            <div className="grid gap-10 pt-8 md:grid-cols-3">
              {standardStats.map((stat) => (
                <StatRow key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </FadeIn>
        </div>
        <HorizontalRule />
      </section>

      {/* Methodology Section */}
      <section className="bg-[#0a0a12]">
        <div className="px-8 py-20 max-w-container mx-auto">
          <FadeIn className="mb-14 space-y-6">
            <SectionLabel>Methodology</SectionLabel>
            <h2 className="font-sans text-4xl leading-tight text-sapi-parchment sm:text-5xl lg:text-6xl">
              Five dimensions. One score.
            </h2>
            <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
              SAPI translates sovereign readiness into a decision-grade frame.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <DimensionChart dimensions={dimensions} />
          </FadeIn>
        </div>
      </section>

      {/* Westminster Council Section */}
      <section className="border-y border-sapi-bronze bg-[#0a0a12]">
        <div className="px-8 py-20 max-w-container mx-auto">
          <FadeIn className="space-y-6">
            <SectionLabel>The Westminster Sovereign AI Council</SectionLabel>
            <h2 className="font-sans text-4xl leading-tight text-sapi-parchment sm:text-5xl lg:text-6xl">
              Westminster. Quarterly.
            </h2>
            <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
              Nations present. Corporations present. Sovereign capital evaluates. The SAPI assessment is the shared
              language. If your institution deploys capital into national AI infrastructure, or your government is
              seeking it, this is the room where it begins.
            </p>
          </FadeIn>
        </div>
      </section>
      </div>

      <EnhancedFooter />
    </PageLayout>
  );
}
