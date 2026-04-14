import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DimensionChart } from "./DimensionChart";
import { PageLayout, PageFooter } from "../common";

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
    <header className="bg-[#0a0a12] border-b border-sapi-bronze py-4">
      <div className="px-8 py-4 max-w-container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="SAPI Logo" 
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => navigate('/main')}
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
            Try now
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
    sampleScore: 72,
    shortDescription: "Sovereign access to high-performance compute and energy infrastructure.",
    description: "The foundational layer of sovereign AI capability. Nations with domestic compute infrastructure maintain strategic independence and control over AI model training and deployment.",
    proprietary: false,
  },
  {
    key: "capital",
    label: "Capital Formation",
    sampleScore: 68,
    shortDescription: "Institutional capital available for long-horizon AI infrastructure investment.",
    description: "The financial mechanisms and institutional structures that enable sustained investment in AI infrastructure over multi-year time horizons.",
    proprietary: false,
  },
  {
    key: "regulatory",
    label: "Regulatory Readiness",
    sampleScore: 61,
    shortDescription: "Governance frameworks that enable public trust in AI systems.",
    description: "The legal and regulatory frameworks that establish accountability, safety standards, and public trust mechanisms for AI deployment at national scale.",
    proprietary: false,
  },
  {
    key: "data",
    label: "Data Sovereignty",
    sampleScore: 58,
    shortDescription: "National control over the data AI learns from and acts upon.",
    description: "The ability to control, govern, and leverage national data assets for AI training and inference while maintaining security and privacy standards.",
    proprietary: false,
  },
  {
    key: "di",
    label: "Directed Intelligence Maturity",
    sampleScore: 64,
    shortDescription: "How effectively your nation turns AI capability into coordinated state action.",
    description: "The institutional capacity to translate AI capabilities into coordinated, effective state action across government functions and strategic priorities.",
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
      
      <PageFooter />
    </PageLayout>
  );
}
