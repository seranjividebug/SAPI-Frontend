import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Logo Component ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 96 }) {
  return (
    <img
      src="/logo.png"
      alt="SAPI Logo"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: 'transparent',
        borderRadius: '50%',
        padding: '4px',
        boxSizing: 'border-box',
        WebkitMaskImage: 'radial-gradient(circle, white 100%, transparent 100%)',
        maskImage: 'radial-gradient(circle, white 100%, transparent 100%)'
      }}
    />
  );
}

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
];

// ── Styles (inline, no external deps) ────────────────────────────────────────
const C = {
  void: "#06030E",
  navy: "#0F0830",
  midnight: "#1A1540",
  gold: "#C9963A",
  paleGold: "#EDD98A",
  parchment: "#FBF5E6",
  muted: "#9880B0",
  emerald: "#28A868",
  amber: "#F0C050",
  crimson: "#C03058",
  bronze: "rgba(107,69,8,0.22)",
  blue: "#4A7AE0",
};

const s = {
  page: {
    background: C.void,
    minHeight: "100vh",
    color: C.parchment,
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px",
  },
  // Header
  header: {
    borderBottom: `1px solid ${C.bronze}`,
    padding: "28px 0 24px",
  },
  headerInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px",
    display: "flex",
    alignItems: "center",
    gap: 20,
  },
  wordmark: {
    fontFamily: "'Georgia', serif",
    fontSize: 13,
    fontWeight: 400,
    letterSpacing: "0.18em",
    color: C.parchment,
    textTransform: "uppercase",
    lineHeight: 1.5,
  },
  classification: {
    marginLeft: "auto",
    fontFamily: "'Georgia', serif",
    fontSize: 10,
    letterSpacing: "0.18em",
    color: C.muted,
    textTransform: "uppercase",
    border: `1px solid ${C.bronze}`,
    padding: "4px 10px",
  },
  // Hero
  hero: {
    padding: "80px 32px 64px",
    maxWidth: 1100,
    margin: "0 auto",
    borderBottom: `1px solid ${C.bronze}`,
  },
  strapline: {
    fontFamily: "'Georgia', serif",
    fontSize: 32,
    fontWeight: 400,
    color: C.parchment,
    letterSpacing: "0.04em",
    lineHeight: 1.35,
    maxWidth: 680,
    marginBottom: 20,
  },
  sub: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 14,
    color: C.muted,
    letterSpacing: "0.12em",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  versionLine: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 11,
    color: C.muted,
    letterSpacing: "0.14em",
    marginTop: 16,
    opacity: 0.7,
  },
  // Dimension cards
  section: {
    padding: "56px 32px",
    maxWidth: 1100,
    margin: "0 auto",
    borderBottom: `1px solid ${C.bronze}`,
  },
  sectionLabel: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 10,
    letterSpacing: "0.2em",
    color: C.gold,
    textTransform: "uppercase",
    marginBottom: 28,
  },
  dimGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 16,
  },
  dimCard: {
    background: C.navy,
    borderLeft: `3px solid ${C.gold}`,
    padding: "22px 18px",
  },
  dimNum: {
    fontFamily: "'Georgia', serif",
    fontSize: 28,
    color: C.gold,
    fontWeight: 400,
    lineHeight: 1,
    marginBottom: 10,
    opacity: 0.7,
  },
  dimName: {
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    color: C.parchment,
    fontWeight: 400,
    marginBottom: 10,
    letterSpacing: "0.03em",
    lineHeight: 1.3,
  },
  dimDef: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 12,
    color: C.muted,
    lineHeight: 1.55,
  },
  // Tier table
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: C.muted,
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: `1px solid ${C.bronze}`,
    fontWeight: 500,
  },
  thHighlight: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: C.gold,
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: `2px solid ${C.gold}`,
    borderLeft: `2px solid ${C.gold}`,
    borderRight: `2px solid ${C.gold}`,
    borderTop: `2px solid ${C.gold}`,
    fontWeight: 500,
    background: "rgba(201,150,58,0.06)",
  },
  td: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    color: C.parchment,
    padding: "14px 16px",
    borderBottom: `1px solid ${C.bronze}`,
    verticalAlign: "top",
    lineHeight: 1.5,
  },
  tdHighlight: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    color: C.parchment,
    padding: "14px 16px",
    borderBottom: `1px solid rgba(201,150,58,0.3)`,
    borderLeft: `2px solid ${C.gold}`,
    borderRight: `2px solid ${C.gold}`,
    verticalAlign: "top",
    background: "rgba(201,150,58,0.04)",
    lineHeight: 1.5,
  },
  tdLastHighlight: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 13,
    color: C.paleGold,
    fontWeight: 500,
    padding: "14px 16px",
    borderBottom: `2px solid ${C.gold}`,
    borderLeft: `2px solid ${C.gold}`,
    borderRight: `2px solid ${C.gold}`,
    verticalAlign: "top",
    background: "rgba(201,150,58,0.04)",
    lineHeight: 1.5,
  },
  rowLabel: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.muted,
    display: "block",
    marginBottom: 2,
  },
  // CTA
  ctaSection: {
    padding: "60px 32px 72px",
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    borderBottom: `1px solid ${C.bronze}`,
  },
  ctaHeading: {
    fontFamily: "'Georgia', serif",
    fontSize: 20,
    color: C.parchment,
    letterSpacing: "0.08em",
    textAlign: "center",
    fontWeight: 400,
  },
  ctaNote: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 12,
    color: C.muted,
    letterSpacing: "0.1em",
    textAlign: "center",
    maxWidth: 520,
    lineHeight: 1.6,
  },
  ctaBtn: {
    background: C.gold,
    color: C.void,
    border: "none",
    padding: "14px 44px",
    fontFamily: "system-ui, sans-serif",
    fontSize: 12,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontWeight: 500,
    cursor: "pointer",
    borderRadius: 3,
    marginTop: 8,
  },
  footer: {
    padding: "24px 32px",
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  footerText: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 11,
    color: C.muted,
    letterSpacing: "0.1em",
    opacity: 0.6,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function SAPILanding({ onBegin }) {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const handleBegin = () => {
    window.scrollTo(0, 0);
    navigate('/preview');
    if (onBegin) onBegin();
  };

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <SAPIGlobe size={56} />
          <div style={s.wordmark}>
            The Sovereign AI<br />Power Index
          </div>
          <div style={s.classification}>For Government & Sovereign Institutions</div>
          <button
            onClick={() => navigate('/admin')}
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.void,
              background: C.gold,
              border: `1px solid ${C.gold}`,
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#B8862A";
              e.currentTarget.style.color = C.void;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.gold;
              e.currentTarget.style.color = C.void;
            }}
          >
            Admin
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.sub}>Sovereign AI Readiness Assessment · Free · 12 Minutes</div>
        <div style={s.strapline}>
          The nations that lead the AI era will not do so by accident.
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.8,
          maxWidth: 620,
          marginTop: 20,
          marginBottom: 28,
        }}>
          Governments that understand their AI position today will set the terms of global competition for the next two decades. Those that don't will find those terms set for them. SAPI gives your ministry the diagnostic clarity to make consequential decisions — on infrastructure, investment, governance, and strategic deployment — before the window closes.
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: 4,
        }}>
          {[
            ["Benchmark", "See exactly where your nation stands across five dimensions of AI power"],
            ["Prioritise", "Identify the highest-leverage gaps your government should close first"],
            ["Act", "Receive a prioritised roadmap tailored to your current score and development stage"],
          ].map(([label, desc]) => (
            <div key={label} style={{ flex: "1 1 160px", minWidth: 160 }}>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 10,
                letterSpacing: "0.18em",
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 6,
              }}>{label}</div>
              <div style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 12,
                color: C.muted,
                lineHeight: 1.6,
              }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Five Dimensions ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}>The Five Dimensions of Sovereign AI Readiness</div>
        <div style={s.dimGrid}>
          {DIMENSIONS.map((d) => (
            <div key={d.num} style={s.dimCard}>
              <div style={s.dimNum}>{d.num}</div>
              <div style={s.dimName}>{d.name}</div>
              <div style={s.dimDef}>{d.def}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tier Table ── */}
      <div style={s.section}>
        <div style={s.sectionLabel}>Assessment Architecture</div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {TIERS.map((t) => (
                  <th key={t.tier} style={t.highlight ? s.thHighlight : s.th}>
                    {t.tier}
                    <span style={{
                      display: "block",
                      fontSize: 11,
                      color: t.highlight ? C.paleGold : C.muted,
                      letterSpacing: "0.08em",
                      marginTop: 3,
                      textTransform: "none",
                      fontFamily: "'Georgia', serif",
                    }}>{t.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Depth row */}
              <tr>
                {TIERS.map((t) => (
                  <td key={t.tier} style={t.highlight ? s.tdHighlight : s.td}>
                    <span style={s.rowLabel}>Depth</span>
                    {t.depth}
                  </td>
                ))}
              </tr>
              {/* Description row */}
              <tr>
                {TIERS.map((t) => (
                  <td key={t.tier} style={t.highlight ? s.tdHighlight : s.td}>
                    <span style={s.rowLabel}>Description</span>
                    {t.description}
                  </td>
                ))}
              </tr>
              {/* Price row */}
              <tr>
                {TIERS.map((t) => (
                  <td key={t.tier} style={t.highlight ? s.tdLastHighlight : { ...s.td, color: t.highlight ? C.paleGold : C.parchment }}>
                    <span style={s.rowLabel}>Investment</span>
                    {t.price}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={s.ctaSection}>
        <div style={s.ctaHeading}>Begin Your Sovereign AI Assessment</div>
        <div style={s.ctaNote}>
          The Tier 1 assessment comprises 30 questions across five dimensions. Completion time: approximately 12–18 minutes. Results are generated automatically upon submission.
        </div>
        <button
          style={{
            ...s.ctaBtn,
            background: hovering ? "#B8862A" : C.gold,
            transition: "background 0.15s",
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={handleBegin}
        >
          Begin Tier 1 Assessment
        </button>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 11,
          color: C.muted,
          letterSpacing: "0.1em",
          opacity: 0.6,
          marginTop: 4,
        }}>
          No account required &nbsp;·&nbsp; Results delivered immediately &nbsp;·&nbsp; No data retained without consent
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${C.bronze}` }}>
        <div style={s.footer}>
          <div style={s.footerText}>© 2026 The Sovereign AI Power Index. All rights reserved.</div>
          <div style={s.footerText}>SAPI · Tier 1 Free Self-Assessment · v1.0</div>
        </div>
      </footer>

    </div>
  );
}
