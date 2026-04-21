import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../common";
import { EnhancedFooter } from "../common/EnhancedFooter";

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

const PageHero = ({ description, label, title }) => {
  return (
    <div className="space-y-6">
      <SectionLabel tone="accent">{label}</SectionLabel>
      <h1 className="font-sans text-5xl leading-tight text-sapi-parchment max-w-4xl">
        {title}
      </h1>
      <p className="font-sans text-lg leading-8 text-sapi-muted max-w-2xl">
        {description}
      </p>
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
            onClick={() => navigate('/login')}
          >
            Index
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/methodology')}
          >
            Methodology
          </button>
          <button
            className="font-sans text-[13px] tracking-extra-wide uppercase text-sapi-parchment hover:text-sapi-gold transition-colors duration-150"
            onClick={() => navigate('/sapi-index')}
          >
            Preview
          </button>
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

export default function AboutPage() {
  return (
    <PageLayout>
      <CustomHeader />
      <section className="bg-[#0a0a12] pt-2 min-h-screen font-sans">
        <div className="px-8 py-8 max-w-container mx-auto">
          <div className="mx-auto max-w-5xl">
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
              description="Founded in the UK, The Sovereign AI Power Index is an intelligence and convening platform built for a single purpose: to make sovereign AI readiness measurable, investable, and governable. It serves governments, sovereign wealth funds, infrastructure operators building national AI systems and corporate entities."
              label="About SAPI"
              title="The institutional standard for sovereign AI readiness."
            />
          </div>

          <div className="mt-24 grid gap-16">
            <div className="grid gap-12 border-t border-sapi-bronze pt-12 lg:grid-cols-[0.82fr_1.18fr]">
              <FadeIn className="space-y-5">
                <SectionLabel>Platform Model</SectionLabel>
                <h2 className="font-sans max-w-xl text-3xl leading-tight text-sapi-parchment sm:text-4xl">
                  Three functions.<br />One standard.
                </h2>
              </FadeIn>

              <FadeIn className="grid gap-6">
                <div className="border-b border-sapi-bronze pb-6">
                  <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">The Sovereign AI Power Index</p>
                  <p className="mt-4 text-base leading-8 text-sapi-muted">
                    The benchmark. Scores national AI readiness across five dimensions: compute capacity, capital
                    formation, regulatory readiness, data sovereignty, and directed intelligence maturity. Published
                    annually. Used by sovereign wealth funds, government AI leads, infrastructure investors and corporate entities to
                    compare, prioritise, and act.
                  </p>
                </div>
                <div className="border-b border-sapi-bronze pb-6">
                  <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">Westminster. Quarterly</p>
                  <p className="mt-4 text-base leading-8 text-sapi-muted">
                    Nations present. Corporations present. Sovereign capital evaluates. Strategic partners deliver. Chatham House Rule throughout. The Room.
                  </p>
                </div>
                <div className="border-b border-sapi-bronze pb-6">
                  <p className="font-sans text-[13px] tracking-[0.22em] uppercase text-sapi-muted/70">Assessments</p>
                  <p className="mt-4 text-base leading-8 text-sapi-muted">
                    The intelligence. Bespoke country and corporate assessments that identify readiness gaps, score
                    governance maturity, and produce the decision-grade intelligence that capital and delivery partners
                    require before they commit.
                  </p>
                </div>
              </FadeIn>
            </div>

            <FadeIn className="grid gap-12 border-t border-sapi-bronze pt-12 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="space-y-5">
                <SectionLabel>Launch Status</SectionLabel>
                <h2 className="font-sans max-w-xl text-3xl leading-tight text-sapi-parchment sm:text-4xl">
                  SAPI operates as an independent UK organisation.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="max-w-2xl text-base leading-8 text-sapi-muted">
                  Advisory relationships, institutional affiliations, and leadership appointments are disclosed as they
                  are formalised. SAPI does not pre-announce partnerships. Formal updates will be published on this page
                  as they are confirmed.
                </p>
              </div>
            </FadeIn>

            <FadeIn className="border-t border-sapi-bronze pt-12">
              <SectionLabel tone="accent">Next Step</SectionLabel>
              <div className="mt-8">
                <Button href="/contact">Request an Introduction</Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <EnhancedFooter />
    </PageLayout>
  );
}
