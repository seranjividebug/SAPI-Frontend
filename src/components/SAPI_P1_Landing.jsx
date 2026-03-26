import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Inline SVG Logo ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="32" cy="32" r="29" stroke="white" strokeWidth="1.2" />
      {/* Equatorial ellipse */}
      <ellipse cx="32" cy="32" rx="29" ry="11" stroke="white" strokeWidth="1" strokeDasharray="2 1.5" />
      {/* Tilted orbital ring */}
      <ellipse
        cx="32" cy="32" rx="22" ry="29"
        stroke="white" strokeWidth="1"
        transform="rotate(-28 32 32)"
        strokeDasharray="2 1.5"
      />
      {/* Second tilted orbital ring */}
      <ellipse
        cx="32" cy="32" rx="22" ry="29"
        stroke="white" strokeWidth="0.8"
        transform="rotate(28 32 32)"
        strokeDasharray="2 1.5"
      />
      {/* Constellation nodes */}
      {[
        [32, 3], [55, 20], [55, 44], [32, 61], [9, 44], [9, 20],
        [46, 12], [18, 52]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="white" />
      ))}
      {/* Constellation lines */}
      <line x1="32" y1="3" x2="55" y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="44" x2="32" y2="61" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="32" y1="61" x2="9" y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9" y1="44" x2="9" y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9" y1="20" x2="32" y2="3" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="46" y1="12" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="18" y1="52" x2="9" y2="20" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="46" y1="12" x2="18" y2="52" stroke="white" strokeWidth="0.6" opacity="0.3" />
    </svg>
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
export default function SAPILanding() {
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <SAPIGlobe size={40} />
          <div style={s.wordmark}>
            The Sovereign AI<br />Power Index
          </div>
          <div style={s.classification}>Classification: Restricted</div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div style={s.hero}>
        <div style={s.sub}>Tier 1 Free Assessment · Version 1.0 · March 2026</div>
        <div style={s.strapline}>
          The definitive measure of sovereign AI readiness.
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 14,
          color: C.muted,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
          Index &nbsp;·&nbsp; Council &nbsp;·&nbsp; Agent of Change
        </div>
        <div style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.7,
          maxWidth: 600,
          marginTop: 20,
        }}>
          SAPI is the first composite index designed to assess sovereign AI readiness as a compound institutional capability — measuring whether your nation controls its compute, finances its AI infrastructure at scale, governs deployment with legal clarity, protects strategic data, and converts capability into coordinated state action.
        </div>
        <div style={s.versionLine}>
          Version 1.0 &nbsp;·&nbsp; March 2026 &nbsp;·&nbsp; Classification: Restricted
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
          onClick={() => {
    window.scrollTo(0, 0);
    navigate('/preview');
  }}
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
