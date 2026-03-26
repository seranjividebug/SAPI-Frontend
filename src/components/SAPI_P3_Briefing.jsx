import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline SVG Logo ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" stroke="white" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="29" ry="11" stroke="white" strokeWidth="1" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="1" transform="rotate(-28 32 32)" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="0.8" transform="rotate(28 32 32)" strokeDasharray="2 1.5" />
      {[[32,3],[55,20],[55,44],[32,61],[9,44],[9,20],[46,12],[18,52]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="white" />
      ))}
      <line x1="32" y1="3"  x2="55" y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="44" x2="32" y2="61" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="32" y1="61" x2="9"  y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="44" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="20" x2="32" y2="3"  stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="46" y1="12" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="18" y1="52" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="46" y1="12" x2="18" y2="52" stroke="white" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

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

// ── Dimension data ───────────────────────────────────────────────────────────
const DIMENSIONS = [
  { num: "01", name: "Compute Capacity",              questions: 5 },
  { num: "02", name: "Capital Formation",              questions: 6 },
  { num: "03", name: "Regulatory Readiness",           questions: 7 },
  { num: "04", name: "Data Sovereignty",               questions: 6 },
  { num: "05", name: "Directed Intelligence Maturity", questions: 6 },
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
        <circle cx="8" cy="8" r="6.5" stroke={C.gold} strokeWidth="1.1" />
        <path d="M5.5 8.5L7 10L10.5 6" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: "Answer based on your nation's current state, not aspirational plans or strategies under development.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="1.5" stroke={C.gold} strokeWidth="1.1" />
        <path d="M5 8H11M5 5.5H11M5 10.5H8.5" stroke={C.gold} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
    text: "Select the response that most accurately reflects present operational capability, not policy intent.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2.5V8L11 10.5" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="6.5" stroke={C.gold} strokeWidth="1.1" />
      </svg>
    ),
    text: "There are no right or wrong answers. Precision produces the most useful diagnostic and roadmap.",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      fontSize: 10,
      letterSpacing: "0.2em",
      color: C.gold,
      textTransform: "uppercase",
      marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function Rule() {
  return <div style={{ borderTop: `1px solid ${C.bronze}`, margin: "44px 0" }} />;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function SAPIBriefing() {
  const navigate = useNavigate();

  const [beginHover, setBeginHover] = useState(false);
  const [backHover,  setBackHover]  = useState(false);

  // For demo purposes, using mock data since we're not passing appState
  const orgProfile = { name: "Demo User", title: "Demo Title", ministry: "Demo Ministry", country: "SA" };
  const { name = "", title = "", ministry = "", country = "" } = orgProfile;

  const countryLabel = COUNTRY_LABELS[country] || country;
  const countryFlag  = COUNTRY_FLAGS[country]  || "";

  function handleBegin() {
    navigate('/dimintro');
  }

  function handleBack() {
    navigate('/preview');
  }

  return (
    <div style={{
      background: C.void,
      minHeight: "100vh",
      color: C.parchment,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>

      {/* ── Header ── */}
      <header style={{ borderBottom: `1px solid ${C.bronze}`, padding: "20px 0" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <SAPIGlobe size={32} />
          <div style={{
            fontFamily: "'Georgia', serif", fontSize: 11, letterSpacing: "0.2em",
            color: C.parchment, textTransform: "uppercase", lineHeight: 1.5,
          }}>
            The Sovereign AI<br />Power Index
          </div>
          <div style={{
            marginLeft: "auto", fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase",
            border: `1px solid ${C.bronze}`, padding: "4px 10px",
          }}>
            Classification: Restricted
          </div>
        </div>
      </header>

      {/* ── Step indicator ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 32px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <button
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: backHover ? C.gold : C.muted,
            fontFamily: "system-ui, sans-serif", fontSize: 11,
            letterSpacing: "0.14em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 6,
            padding: 0, transition: "color 0.15s",
          }}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          onClick={handleBack}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { n: 1, label: "Organisation Profile",  active: false },
            { n: 2, label: "Assessment Briefing",   active: true  },
            { n: 3, label: "Assessment",             active: false },
          ].map((step, i) => (
            <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <div style={{ width: 20, height: 1, background: C.bronze, margin: "0 2px" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: step.active ? C.gold : "transparent",
                  border: `1px solid ${step.active ? C.gold : C.bronzeStr}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "system-ui, sans-serif", fontSize: 10,
                  color: step.active ? C.void : step.n === 1 ? C.muted : C.muted,
                  fontWeight: 500,
                }}>
                  {step.n === 1 ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5L4 7.5L8.5 2.5" stroke={C.muted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.n}
                </div>
                <span style={{
                  fontFamily: "system-ui, sans-serif", fontSize: 11,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: step.active ? C.parchment : C.muted,
                }}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "52px 32px 100px" }}>

        {/* Step label */}
        <div style={{
          fontFamily: "system-ui, sans-serif", fontSize: 10,
          letterSpacing: "0.22em", color: C.gold,
          textTransform: "uppercase", marginBottom: 20,
        }}>
          Step 2 of 3 &nbsp;·&nbsp; Assessment Briefing
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Georgia', serif", fontSize: 30, fontWeight: 400,
          color: C.parchment, letterSpacing: "0.02em", lineHeight: 1.28,
          margin: "0 0 28px",
        }}>
          Your Tier 1 Sovereign AI<br />Readiness Assessment
        </h1>

        {/* Personalised greeting */}
        <div style={{
          background: C.navy,
          borderLeft: `3px solid ${C.gold}`,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 44,
        }}>
          {countryFlag && (
            <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{countryFlag}</span>
          )}
          <div>
            <div style={{
              fontFamily: "'Georgia', serif", fontSize: 15,
              color: C.parchment, letterSpacing: "0.02em", marginBottom: 4,
            }}>
              Welcome, <span style={{ color: C.paleGold }}>{name || "Respondent"}</span>
              {ministry ? ` from ${ministry}` : ""}
              {countryLabel ? `, ${countryLabel}` : ""}.
            </div>
            {title && (
              <div style={{
                fontFamily: "system-ui, sans-serif", fontSize: 11,
                color: C.muted, letterSpacing: "0.08em",
              }}>
                {title}
              </div>
            )}
          </div>
        </div>

        {/* ── Three-stat strip ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 44,
        }}>
          {[
            { value: "30",      label: "Questions" },
            { value: "12–15",   label: "Minutes" },
            { value: "5",       label: "Dimensions" },
          ].map(({ value, label }) => (
            <div key={label} style={{
              background: C.midnight,
              border: `1px solid ${C.bronze}`,
              borderBottom: `2px solid ${C.bronzeStr}`,
              padding: "22px 20px",
              textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Georgia', serif", fontSize: 32,
                color: C.paleGold, fontWeight: 400, lineHeight: 1,
                marginBottom: 8,
              }}>
                {value}
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif", fontSize: 10,
                color: C.muted, letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Section: What this assessment measures ── */}
        <SectionLabel>What this assessment measures</SectionLabel>
        <p style={{
          fontFamily: "system-ui, sans-serif", fontSize: 13,
          color: C.muted, lineHeight: 1.75, margin: "0 0 20px",
          letterSpacing: "0.02em",
        }}>
          The SAPI Tier 1 assessment evaluates your nation's sovereign AI readiness across five dimensions, each representing a distinct institutional condition required for durable AI capacity. Your responses generate a composite SAPI score — calculated as a weighted geometric mean — which maps your nation to one of five readiness tiers.
        </p>

        {/* Dimension list */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 1,
          marginBottom: 44, border: `1px solid ${C.bronze}`,
        }}>
          {DIMENSIONS.map((d, i) => (
            <div key={d.num} style={{
              background: i % 2 === 0 ? C.navy : C.midnight,
              padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 16,
              borderBottom: i < DIMENSIONS.length - 1 ? `1px solid ${C.bronze}` : "none",
            }}>
              <div style={{
                fontFamily: "'Georgia', serif", fontSize: 20,
                color: C.gold, fontWeight: 400, lineHeight: 1,
                opacity: 0.65, width: 28, flexShrink: 0,
              }}>
                {d.num}
              </div>
              <div style={{
                fontFamily: "'Georgia', serif", fontSize: 13,
                color: C.parchment, flex: 1,
              }}>
                {d.name}
              </div>
              <div style={{
                fontFamily: "system-ui, sans-serif", fontSize: 11,
                color: C.muted, letterSpacing: "0.1em",
                whiteSpace: "nowrap",
              }}>
                {d.questions} questions
              </div>
            </div>
          ))}
        </div>

        <Rule />

        {/* ── Section: How to answer ── */}
        <SectionLabel>How to answer</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 44 }}>
          {INSTRUCTIONS.map(({ icon, text }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>{icon}</div>
              <p style={{
                fontFamily: "system-ui, sans-serif", fontSize: 13,
                color: C.muted, lineHeight: 1.7, margin: 0,
                letterSpacing: "0.02em",
              }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        <Rule />

        {/* ── Section: How your score is used ── */}
        <SectionLabel>How your score is used</SectionLabel>
        <p style={{
          fontFamily: "system-ui, sans-serif", fontSize: 13,
          color: C.muted, lineHeight: 1.75, margin: "0 0 16px",
          letterSpacing: "0.02em",
        }}>
          Scoring is fully automated. Upon submission, your five dimension scores and composite SAPI score are calculated instantly and mapped to a readiness tier — from <em style={{ color: C.parchment }}>Pre-conditions Unmet</em> through to <em style={{ color: C.parchment }}>Sovereign AI Leader</em>.
        </p>
        <p style={{
          fontFamily: "system-ui, sans-serif", fontSize: 13,
          color: C.muted, lineHeight: 1.75, margin: 0,
          letterSpacing: "0.02em",
        }}>
          Your results include a prioritised 12–18 month improvement roadmap with targeted interventions for your lowest-scoring dimensions, and a clear pathway to Tier 2 deep-dive assessment where required.
        </p>

        <Rule />

        {/* ── Confidentiality box ── */}
        <div style={{
          border: `1px solid rgba(201,150,58,0.25)`,
          borderLeft: `3px solid ${C.gold}`,
          background: "rgba(201,150,58,0.04)",
          padding: "16px 20px",
          marginBottom: 52,
        }}>
          <div style={{
            fontFamily: "system-ui, sans-serif", fontSize: 10,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: C.gold, marginBottom: 8,
          }}>
            Data Classification
          </div>
          <p style={{
            fontFamily: "system-ui, sans-serif", fontSize: 12,
            color: C.muted, lineHeight: 1.7, margin: 0,
          }}>
            Your responses are used solely to generate your Tier 1 SAPI assessment report. No individual data is shared with third parties without your explicit consent.{" "}
            <em style={{ color: C.parchment }}>Classification: Restricted.</em>
          </p>
        </div>

        {/* ── CTAs ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            style={{
              width: "100%",
              background: beginHover ? "#B8862A" : C.gold,
              color: C.void,
              border: "none",
              padding: "16px 48px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
              cursor: "pointer",
              borderRadius: 3,
              transition: "background 0.15s",
            }}
            onMouseEnter={() => setBeginHover(true)}
            onMouseLeave={() => setBeginHover(false)}
            onClick={handleBegin}
          >
            Begin Assessment
          </button>

          <button
            style={{
              width: "100%",
              background: "transparent",
              color: backHover ? C.parchment : C.muted,
              border: `1px solid ${backHover ? C.bronzeStr : C.bronze}`,
              padding: "14px 48px",
              fontFamily: "system-ui, sans-serif",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 400,
              cursor: "pointer",
              borderRadius: 3,
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            onClick={handleBack}
          >
            ← Back
          </button>
        </div>

        <div style={{
          fontFamily: "system-ui, sans-serif", fontSize: 11,
          color: C.muted, letterSpacing: "0.1em",
          textAlign: "center", marginTop: 14,
          opacity: 0.55, lineHeight: 1.6,
        }}>
          Estimated completion: 12–15 minutes &nbsp;·&nbsp; Results delivered immediately
        </div>

      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.bronze}` }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "18px 32px",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
        }}>
          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.1em", opacity: 0.5 }}>
            © 2026 The Sovereign AI Power Index. All rights reserved.
          </span>
          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, color: C.muted, letterSpacing: "0.1em", opacity: 0.5 }}>
            SAPI · Tier 1 · v1.0
          </span>
        </div>
      </footer>

    </div>
  );
}
