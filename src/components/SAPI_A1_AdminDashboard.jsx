import { useState } from "react";
import SubmissionsList from "./SAPI_B1_SubmissionsList";

// ============================================================
// SEED DATA
// ============================================================
const DEMO_SUBMISSIONS = [
  {
    id: "sub_001",
    country: "Kingdom of Saudi Arabia",
    respondentName: "H.E. Faisal Al-Ibrahim",
    title: "Minister of Economy and Planning",
    ministry: "Ministry of Economy and Planning",
    email: "f.alibrahim@mep.gov.sa",
    developmentStage: "Advanced",
    completedAt: "2026-03-14T09:22:00Z",
    compositeScore: 71.4,
    tier: "Advanced",
    scores: { compute: 78, capital: 82, regulatory: 65, data: 60, di: 68 },
    answers: { q1: 95, q2: 70, q3: 90, q4: 75, q5: 75, q6: 95, q7: 90, q8: 65, q9: 90, q10: 95, q11: 60, q12: 90, q13: 60, q14: 65, q15: 60, q16: 25, q17: 65, q18: 60, q19: 65, q20: 70, q21: 65, q22: 65, q23: 65, q24: 35, q25: 90, q26: 60, q27: 55, q28: 55, q29: 55, q30: 60 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "High-value lead. Minister attended SAPI launch event.",
    leadStage: "Proposal Sent"
  },
  {
    id: "sub_002",
    country: "Republic of Singapore",
    respondentName: "Dr. Janice Tan",
    title: "Deputy Secretary, Smart Nation",
    ministry: "Smart Nation and Digital Government Office",
    email: "janice_tan@smartnation.gov.sg",
    developmentStage: "Leading",
    completedAt: "2026-03-15T14:05:00Z",
    compositeScore: 83.2,
    tier: "Sovereign AI Leader",
    scores: { compute: 85, capital: 88, regulatory: 90, data: 80, di: 78 },
    answers: { q1: 95, q2: 95, q3: 90, q4: 75, q5: 95, q6: 95, q7: 90, q8: 95, q9: 90, q10: 95, q11: 95, q12: 90, q13: 90, q14: 90, q15: 90, q16: 90, q17: 90, q18: 90, q19: 90, q20: 95, q21: 90, q22: 90, q23: 65, q24: 65, q25: 90, q26: 90, q27: 90, q28: 55, q29: 55, q30: 60 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New"
  },
  {
    id: "sub_003",
    country: "Federal Republic of Nigeria",
    respondentName: "Hon. Bosun Tijani",
    title: "Minister of Communications, Innovation and Digital Economy",
    ministry: "Federal Ministry of Communications",
    email: "minister@fmcide.gov.ng",
    developmentStage: "Developing",
    completedAt: "2026-03-17T11:30:00Z",
    compositeScore: 38.6,
    tier: "Nascent",
    scores: { compute: 28, capital: 35, regulatory: 42, data: 30, di: 45 },
    answers: { q1: 25, q2: 15, q3: 35, q4: 30, q5: 25, q6: 45, q7: 25, q8: 35, q9: 30, q10: 40, q11: 35, q12: 60, q13: 30, q14: 40, q15: 30, q16: 25, q17: 35, q18: 30, q19: 35, q20: 40, q21: 40, q22: 30, q23: 35, q24: 10, q25: 65, q26: 30, q27: 30, q28: 25, q29: 25, q30: 60 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "Introduced via GIZ partnership.",
    leadStage: "Contacted"
  },
  {
    id: "sub_004",
    country: "Republic of Kenya",
    respondentName: "Eliud Owalo",
    title: "Cabinet Secretary, Information & Digital Economy",
    ministry: "Ministry of Information, Communications and Digital Economy",
    email: "cs@ict.go.ke",
    developmentStage: "Emerging",
    completedAt: "2026-03-18T08:14:00Z",
    compositeScore: 29.1,
    tier: "Nascent",
    scores: { compute: 22, capital: 28, regulatory: 35, data: 25, di: 32 },
    answers: { q1: 25, q2: 15, q3: 10, q4: 30, q5: 25, q6: 20, q7: 25, q8: 10, q9: 30, q10: 40, q11: 10, q12: 30, q13: 30, q14: 40, q15: 30, q16: 25, q17: 35, q18: 30, q19: 10, q20: 15, q21: 40, q22: 30, q23: 35, q24: 10, q25: 35, q26: 30, q27: 30, q28: 25, q29: 25, q30: 30 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New"
  },
  {
    id: "sub_005",
    country: "United Arab Emirates",
    respondentName: "H.E. Omar Al Olama",
    title: "Minister of State for Artificial Intelligence",
    ministry: "Ministry of AI, Digital Economy and Remote Work Applications",
    email: "minister.ai@uaecabinet.ae",
    developmentStage: "Leading",
    completedAt: "2026-03-19T10:00:00Z",
    compositeScore: 78.9,
    tier: "Advanced",
    scores: { compute: 85, capital: 88, regulatory: 75, data: 72, di: 70 },
    answers: { q1: 95, q2: 95, q3: 90, q4: 75, q5: 95, q6: 95, q7: 90, q8: 65, q9: 60, q10: 95, q11: 95, q12: 90, q13: 60, q14: 65, q15: 60, q16: 60, q17: 65, q18: 60, q19: 65, q20: 70, q21: 65, q22: 65, q23: 65, q24: 65, q25: 65, q26: 60, q27: 90, q28: 55, q29: 55, q30: 60 },
    upgradeStatus: "requested",
    requestedTier: "Tier 3",
    adminNotes: "Priority account. Met Asim at WEF Davos.",
    leadStage: "Won"
  },
  {
    id: "sub_006",
    country: "Republic of Rwanda",
    respondentName: "Paula Ingabire",
    title: "Minister of ICT and Innovation",
    ministry: "Ministry of ICT and Innovation",
    email: "minister@minict.gov.rw",
    developmentStage: "Developing",
    completedAt: "2026-03-20T13:45:00Z",
    compositeScore: 46.3,
    tier: "Developing",
    scores: { compute: 40, capital: 42, regulatory: 55, data: 38, di: 50 },
    answers: { q1: 50, q2: 40, q3: 35, q4: 30, q5: 50, q6: 45, q7: 25, q8: 35, q9: 60, q10: 40, q11: 35, q12: 60, q13: 60, q14: 40, q15: 60, q16: 25, q17: 65, q18: 30, q19: 35, q20: 40, q21: 40, q22: 30, q23: 35, q24: 35, q25: 65, q26: 30, q27: 55, q28: 55, q29: 25, q30: 60 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New"
  },
  {
    id: "sub_007",
    country: "Republic of India",
    respondentName: "Sh. S. Krishnan",
    title: "Secretary, Ministry of Electronics and Information Technology",
    ministry: "MeitY",
    email: "secretary@meity.gov.in",
    developmentStage: "Advanced",
    completedAt: "2026-03-21T07:30:00Z",
    compositeScore: 62.7,
    tier: "Advanced",
    scores: { compute: 65, capital: 70, regulatory: 68, data: 52, di: 58 },
    answers: { q1: 75, q2: 70, q3: 65, q4: 50, q5: 50, q6: 70, q7: 55, q8: 65, q9: 60, q10: 70, q11: 60, q12: 90, q13: 60, q14: 65, q15: 60, q16: 60, q17: 65, q18: 60, q19: 65, q20: 40, q21: 65, q22: 65, q23: 65, q24: 35, q25: 65, q26: 60, q27: 55, q28: 55, q29: 55, q30: 60 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "Referred via UK FCDO digital programme.",
    leadStage: "Contacted"
  },
  {
    id: "sub_008",
    country: "Republic of Ghana",
    respondentName: "Ursula Owusu-Ekuful",
    title: "Minister for Communications and Digitalisation",
    ministry: "Ministry of Communications and Digitalisation",
    email: "minister@moc.gov.gh",
    developmentStage: "Emerging",
    completedAt: "2026-03-22T15:10:00Z",
    compositeScore: 33.4,
    tier: "Nascent",
    scores: { compute: 28, capital: 30, regulatory: 40, data: 28, di: 36 },
    answers: { q1: 25, q2: 15, q3: 35, q4: 30, q5: 25, q6: 20, q7: 25, q8: 35, q9: 30, q10: 40, q11: 10, q12: 30, q13: 30, q14: 40, q15: 30, q16: 25, q17: 35, q18: 30, q19: 35, q20: 15, q21: 40, q22: 30, q23: 35, q24: 10, q25: 35, q26: 30, q27: 30, q28: 25, q29: 25, q30: 30 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New"
  }
];

// ============================================================
// HELPERS
// ============================================================
const tierColor = (tier) => ({
  'Sovereign AI Leader': '#28A868',
  'Advanced': '#4A7AE0',
  'Developing': '#F0C050',
  'Nascent': '#C9963A',
  'Pre-conditions Unmet': '#C03058'
}[tier] || '#9880B0');

const stageColor = (stage) => ({
  'New': '#9880B0',
  'Contacted': '#4A7AE0',
  'Proposal Sent': '#F0C050',
  'Won': '#28A868',
  'Lost': '#C03058'
}[stage] || '#9880B0');

const shortCountry = (name) =>
  name
    .replace('Republic of ', '')
    .replace('Federal Republic of ', '')
    .replace('Kingdom of ', '')
    .replace('United Arab Emirates', 'UAE');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtShortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const attempt = () => {
    if (email === 'admin@sapi.ai' && pass === 'SAPI2026admin') {
      onLogin();
    } else {
      setErr('Invalid email or password. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid #2A204A',
    borderRadius: 6, color: '#FBF5E6',
    fontSize: 14, outline: 'none',
    boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#06030E',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        width: 380,
        background: '#0F0830',
        border: '0.5px solid #2A204A',
        borderRadius: 12,
        padding: '2.5rem 2.25rem',
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, background: '#C9963A', borderRadius: 8,
            marginBottom: 14, fontSize: 20, fontFamily: 'Georgia, serif',
            color: '#06030E', fontWeight: 400,
          }}>S</div>
          <div style={{ color: '#C9963A', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
            Sovereign AI Power Index
          </div>
          <div style={{ color: '#FBF5E6', fontSize: 20, fontFamily: 'Georgia, serif', fontWeight: 400 }}>
            Admin Panel
          </div>
        </div>

        {/* Fields */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#9880B0', marginBottom: 7, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Email address
          </label>
          <input
            type="email"
            value={email}
            placeholder="admin@sapi.ai"
            onChange={e => { setEmail(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: err ? 12 : 20 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#9880B0', marginBottom: 7, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Password
          </label>
          <input
            type="password"
            value={pass}
            placeholder="••••••••••••"
            onChange={e => { setPass(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            style={inputStyle}
          />
        </div>

        {err && (
          <div style={{ color: '#C03058', fontSize: 12, marginBottom: 14, padding: '8px 10px', background: 'rgba(192,48,88,0.1)', borderRadius: 5, border: '0.5px solid rgba(192,48,88,0.3)' }}>
            {err}
          </div>
        )}

        <button
          onClick={attempt}
          style={{
            width: '100%', padding: '11px 0',
            background: '#C9963A', border: 'none', borderRadius: 6,
            color: '#06030E', fontSize: 14, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Sign In
        </button>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 11, color: '#2A204A' }}>
          Restricted access — authorised personnel only
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
const NAV_ITEMS = [
  { key: 'dashboard',      label: 'Dashboard',        glyph: '⊞' },
  { key: 'submissions',    label: 'Submissions',       glyph: '≡' },
  { key: 'leads',          label: 'Leads Pipeline',    glyph: '◈' },
  { key: 'questionEditor', label: 'Question Editor',   glyph: '✎' },
  { key: 'userMgmt',       label: 'Users & Settings',  glyph: '⚙' },
];

function Sidebar({ adminPage, setAdminPage, onSignOut }) {
  return (
    <div style={{
      width: 220, flexShrink: 0,
      background: '#0F0830',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      borderRight: '0.5px solid #1E1650',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 16px', borderBottom: '0.5px solid #1E1650' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, background: '#C9963A', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#06030E', fontFamily: 'Georgia, serif', fontSize: 16, flexShrink: 0,
          }}>S</div>
          <div>
            <div style={{ color: '#FBF5E6', fontSize: 13, fontWeight: 500, lineHeight: 1.25 }}>SAPI</div>
            <div style={{ color: '#9880B0', fontSize: 9.5, letterSpacing: '0.09em', textTransform: 'uppercase', lineHeight: 1 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, paddingTop: 8 }}>
        {NAV_ITEMS.map(item => {
          const active = adminPage === item.key || (adminPage === 'submissionDetail' && item.key === 'submissions') || (adminPage === 'leadDetail' && item.key === 'leads');
          return (
            <button
              key={item.key}
              onClick={() => setAdminPage(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '9px 16px',
                background: active ? '#1A1540' : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${active ? '#C9963A' : 'transparent'}`,
                color: active ? '#EDD98A' : '#FBF5E6',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'system-ui, sans-serif',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 13, opacity: active ? 1 : 0.55, width: 16 }}>{item.glyph}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom: user + sign out */}
      <div style={{ padding: '14px 16px', borderTop: '0.5px solid #1E1650' }}>
        <div style={{ color: '#6B5E80', fontSize: 11, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          admin@sapi.ai
        </div>
        <button
          onClick={onSignOut}
          style={{ background: 'transparent', border: 'none', color: '#C9963A', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'system-ui, sans-serif' }}
        >
          ← Sign out
        </button>
      </div>
    </div>
  );
}

// ============================================================
// METRIC CARD
// ============================================================
function MetricCard({ label, value, color, subtext }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, padding: '1.25rem 1.25rem 1rem',
      flex: 1, minWidth: 0,
    }}>
      <div style={{
        fontSize: 32, fontFamily: 'Georgia, serif', fontWeight: 400,
        color, lineHeight: 1, marginBottom: 6,
      }}>{value}</div>
      <div style={{
        fontSize: 11, color: '#6B6577', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1.4,
      }}>{label}</div>
      {subtext && (
        <div style={{ fontSize: 11, color: '#9880B0', marginTop: 3 }}>{subtext}</div>
      )}
    </div>
  );
}

// ============================================================
// TIER DISTRIBUTION BAR
// ============================================================
function TierDistributionBar({ submissions }) {
  const TIERS = ['Sovereign AI Leader', 'Advanced', 'Developing', 'Nascent', 'Pre-conditions Unmet'];
  const total = submissions.length;
  const counts = TIERS.reduce((acc, t) => {
    acc[t] = submissions.filter(s => s.tier === t).length;
    return acc;
  }, {});
  const active = TIERS.filter(t => counts[t] > 0);

  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, padding: '1.25rem',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 500, color: '#6B6577',
        textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14,
      }}>
        Score tier distribution
      </div>

      {/* Stacked bar */}
      <div style={{ display: 'flex', height: 30, borderRadius: 5, overflow: 'hidden', gap: 2, marginBottom: 12 }}>
        {active.map(tier => {
          const pct = (counts[tier] / total) * 100;
          return (
            <div
              key={tier}
              title={`${tier}: ${counts[tier]}`}
              style={{
                width: `${pct}%`, background: tierColor(tier),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'width 0.3s',
              }}
            >
              {pct > 9 && (
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 500, mixBlendMode: 'overlay' }}>
                  {Math.round(pct)}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
        {active.map(tier => (
          <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: tierColor(tier), display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#1A1A2E' }}>{tier}</span>
            <span style={{ fontSize: 12, color: '#9880B0' }}>({counts[tier]})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// RECENT SUBMISSIONS TABLE
// ============================================================
function RecentSubmissionsTable({ submissions, setAdminPage, setSelectedSubmission }) {
  const [hovered, setHovered] = useState(null);
  const recent = [...submissions]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 5);

  const COL_HEADERS = ['Country', 'Respondent', 'Score', 'Tier', 'Stage', 'Date'];

  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, overflow: 'hidden', flex: '1 1 0', minWidth: 0,
    }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '0.5px solid #E0D8CC',
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#6B6577', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Recent assessments
        </span>
        <button
          onClick={() => setAdminPage('submissions')}
          style={{ background: 'none', border: 'none', color: '#C9963A', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'system-ui, sans-serif' }}
        >
          View all →
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#F0EBE3' }}>
            {COL_HEADERS.map(h => (
              <th key={h} style={{
                padding: '7px 12px', textAlign: 'left',
                fontSize: 10.5, fontWeight: 500, color: '#1A1A2E',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recent.map((sub, i) => {
            const isHov = hovered === sub.id;
            const baseBg = i % 2 === 0 ? '#FFFFFF' : '#FDFAF6';
            return (
              <tr
                key={sub.id}
                onClick={() => { setSelectedSubmission(sub); setAdminPage('submissionDetail'); }}
                onMouseEnter={() => setHovered(sub.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHov ? '#FBF5E6' : baseBg,
                  cursor: 'pointer',
                  borderBottom: '0.5px solid #F0EBE3',
                  transition: 'background 0.1s',
                }}
              >
                <td style={{ padding: '9px 12px', color: '#1A1A2E', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {shortCountry(sub.country)}
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <div style={{ color: '#1A1A2E', fontSize: 13, lineHeight: 1.3 }}>{sub.respondentName}</div>
                  <div style={{ color: '#9880B0', fontSize: 11 }}>{sub.title.split(',')[0]}</div>
                </td>
                <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#EDD98A', fontFamily: 'Georgia, serif', fontSize: 15 }}>
                    {sub.compositeScore}
                  </span>
                  <span style={{ color: '#9880B0', fontSize: 11 }}>/100</span>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{
                    background: `${tierColor(sub.tier)}20`,
                    color: tierColor(sub.tier),
                    border: `0.5px solid ${tierColor(sub.tier)}50`,
                    padding: '2px 7px', borderRadius: 4,
                    fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
                  }}>{sub.tier}</span>
                </td>
                <td style={{ padding: '9px 12px' }}>
                  <span style={{
                    background: `${stageColor(sub.leadStage)}20`,
                    color: stageColor(sub.leadStage),
                    border: `0.5px solid ${stageColor(sub.leadStage)}50`,
                    padding: '2px 7px', borderRadius: 4,
                    fontSize: 11, fontWeight: 500,
                  }}>{sub.leadStage}</span>
                </td>
                <td style={{ padding: '9px 12px', color: '#6B6577', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {fmtShortDate(sub.completedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// LEADS PIPELINE SUMMARY
// ============================================================
function LeadsPipelineSummary({ submissions, setAdminPage }) {
  const STAGES = [
    { key: 'New',           sub: 'Awaiting outreach' },
    { key: 'Contacted',     sub: 'In discussion'      },
    { key: 'Proposal Sent', sub: 'Decision pending'   },
    { key: 'Won',           sub: 'Converted'          },
  ];
  const counts = STAGES.reduce((acc, s) => {
    acc[s.key] = submissions.filter(sub => sub.leadStage === s.key).length;
    return acc;
  }, {});

  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, flexShrink: 0, width: 270, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '0.5px solid #E0D8CC',
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color: '#6B6577', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Leads pipeline
        </span>
        <button
          onClick={() => setAdminPage('leads')}
          style={{ background: 'none', border: 'none', color: '#C9963A', fontSize: 12, cursor: 'pointer', padding: 0, fontFamily: 'system-ui, sans-serif' }}
        >
          View all →
        </button>
      </div>

      <div style={{ padding: '14px' }}>
        {STAGES.map((stage, i) => {
          const color = stageColor(stage.key);
          return (
            <div
              key={stage.key}
              onClick={() => setAdminPage('leads')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 7,
                marginBottom: i < STAGES.length - 1 ? 8 : 0,
                background: `${color}16`,
                border: `0.5px solid ${color}40`,
                cursor: 'pointer', transition: 'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}2A`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${color}16`; }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A2E', lineHeight: 1.3 }}>
                  {stage.key}
                </div>
                <div style={{ fontSize: 11, color: '#6B6577' }}>{stage.sub}</div>
              </div>
              <div style={{
                fontSize: 26, fontFamily: 'Georgia, serif', fontWeight: 400,
                color, lineHeight: 1,
              }}>{counts[stage.key]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// AVERAGE DIMENSION SCORES
// ============================================================
const DIM_LABELS = {
  compute:    'Compute Capacity',
  capital:    'Capital Formation',
  regulatory: 'Regulatory Readiness',
  data:       'Data Sovereignty',
  di:         'Directed Intelligence Maturity',
};

function AvgDimensionScores({ submissions }) {
  const dims = Object.keys(DIM_LABELS);
  const avgs = dims.reduce((acc, d) => {
    const sum = submissions.reduce((s, sub) => s + sub.scores[d], 0);
    acc[d] = Math.round((sum / submissions.length) * 10) / 10;
    return acc;
  }, {});

  // Find weakest dimension for callout
  const weakest = dims.reduce((a, b) => avgs[a] < avgs[b] ? a : b);

  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, padding: '1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#6B6577', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Average dimension scores across all submissions
        </div>
        <div style={{ fontSize: 11, color: '#9880B0', textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
          n = {submissions.length} submissions
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {dims.map(dim => {
          const avg = avgs[dim];
          const pct = avg;
          const isWeakest = dim === weakest;
          return (
            <div key={dim}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, color: '#1A1A2E' }}>{DIM_LABELS[dim]}</span>
                  {isWeakest && (
                    <span style={{
                      fontSize: 10, background: '#C0305820', color: '#C03058',
                      border: '0.5px solid #C0305840',
                      padding: '1px 6px', borderRadius: 3, fontWeight: 500,
                    }}>Weakest</span>
                  )}
                </div>
                <span style={{
                  fontSize: 14, fontFamily: 'Georgia, serif', fontWeight: 400,
                  color: avg < 40 ? '#C03058' : avg < 60 ? '#F0C050' : '#EDD98A',
                }}>{avg}</span>
              </div>
              <div style={{ height: 7, background: '#F0EBE3', borderRadius: 4 }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: avg < 40 ? '#C03058' : avg < 60 ? '#C9963A' : '#C9963A',
                  borderRadius: 4,
                }} />
              </div>
              {/* Tick marks */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                {[0, 25, 50, 75, 100].map(t => (
                  <span key={t} style={{ fontSize: 9, color: '#C8C0B8' }}>{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ setAdminPage, setSelectedSubmission }) {
  const total = DEMO_SUBMISSIONS.length;
  const upgradeReqs = DEMO_SUBMISSIONS.filter(s => s.upgradeStatus === 'requested').length;
  const convRate = Math.round((upgradeReqs / total) * 100);
  const activePipeline = DEMO_SUBMISSIONS.filter(s => s.leadStage === 'Contacted' || s.leadStage === 'Proposal Sent').length;

  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div style={{ padding: '1.75rem 2rem 2.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Page header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontSize: 22, fontWeight: 400, color: '#1A1A2E',
          margin: '0 0 4px', fontFamily: 'Georgia, serif',
        }}>Dashboard</h1>
        <div style={{ fontSize: 12, color: '#9880B0' }}>{todayStr}</div>
      </div>

      {/* Metric cards */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
        <MetricCard
          label="Total assessments"
          value={total}
          color="#C9963A"
        />
        <MetricCard
          label="Upgrade requests"
          value={upgradeReqs}
          color="#4A7AE0"
        />
        <MetricCard
          label="Tier 1 → upgrade rate"
          value={`${convRate}%`}
          color="#C9963A"
        />
        <MetricCard
          label="Active leads"
          value={activePipeline}
          color="#D4A830"
          subtext="Contacted or Proposal Sent"
        />
      </div>

      {/* Tier distribution */}
      <div style={{ marginBottom: 18 }}>
        <TierDistributionBar submissions={DEMO_SUBMISSIONS} />
      </div>

      {/* Recent table + leads pipeline */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
        <RecentSubmissionsTable
          submissions={DEMO_SUBMISSIONS}
          setAdminPage={setAdminPage}
          setSelectedSubmission={setSelectedSubmission}
        />
        <LeadsPipelineSummary
          submissions={DEMO_SUBMISSIONS}
          setAdminPage={setAdminPage}
        />
      </div>

      {/* Dimension scores */}
      <AvgDimensionScores submissions={DEMO_SUBMISSIONS} />
    </div>
  );
}

// ============================================================
// STUB PAGES
// ============================================================
function StubPage({ title, note }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 20, fontWeight: 400, color: '#1A1A2E', fontFamily: 'Georgia, serif', margin: '0 0 8px' }}>
        {title}
      </h2>
      <p style={{ color: '#6B6577', fontSize: 14, margin: 0 }}>
        {note || 'This section will be built in a subsequent session.'}
      </p>
    </div>
  );
}

// ============================================================
// ROOT COMPONENT
// ============================================================
export default function SAPIAdmin() {
  const [adminPage, setAdminPage] = useState('login');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setAdminPage('dashboard');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setAdminPage('login');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pageTitle = {
    submissions:      'Submissions',
    submissionDetail: selectedSubmission ? `${selectedSubmission.country} — Assessment Detail` : 'Assessment Detail',
    leads:            'Leads Pipeline',
    leadDetail:       'Lead Detail',
    questionEditor:   'Question Editor',
    userMgmt:         'Users & Settings',
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Sidebar
        adminPage={adminPage}
        setAdminPage={setAdminPage}
        onSignOut={handleSignOut}
      />
      <main style={{ flex: 1, overflow: 'auto', background: '#F7F4EF' }}>
        {adminPage === 'dashboard' && (
          <Dashboard
            setAdminPage={setAdminPage}
            setSelectedSubmission={setSelectedSubmission}
          />
        )}
        {adminPage === 'submissions' && (
          <SubmissionsList
            setAdminPage={setAdminPage}
            setSelectedSubmission={setSelectedSubmission}
            setSelectedLead={setSelectedSubmission}
          />
        )}
        {adminPage !== 'dashboard' && adminPage !== 'submissions' && (
          <StubPage title={pageTitle[adminPage] || adminPage} />
        )}
      </main>
    </div>
  );
}
