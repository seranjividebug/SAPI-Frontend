import { useState, useEffect } from "react";
import SubmissionsList from './SAPI_B1_SubmissionsList';
import SubmissionDetail from './SAPI_B2_SubmissionDetail';
import QuestionEditor from './SAPI_E1_QuestionEditor';
import Sidebar from './SAPI_Sidebar';

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

const shortCountry = (name) =>
  name
    .replace('Republic of ', '')
    .replace('Federal Republic of ', '')
    .replace('Kingdom of ', '')
    .replace('United Arab Emirates', 'UAE');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });





// ============================================================
// DASHBOARD - Professional Design
// ============================================================

// SVG Flag Components
const GhanaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="5.33" fill="#CE1126"/>
    <rect y="5.33" width="24" height="5.33" fill="#FCD116"/>
    <rect y="10.67" width="24" height="5.33" fill="#006B3F"/>
    <polygon points="12,6.5 13.5,9.5 10.5,9.5" fill="#000"/>
  </svg>
);

const IndiaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="5.33" fill="#FF9932"/>
    <rect y="5.33" width="24" height="5.33" fill="#FFFFFF"/>
    <rect y="10.67" width="24" height="5.33" fill="#138808"/>
    <circle cx="12" cy="8" r="2" fill="#000080" stroke="#000080" strokeWidth="0.3"/>
  </svg>
);

const RwandaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="8" fill="#00A1DE"/>
    <rect y="8" width="24" height="8" fill="#FAD201"/>
    <rect y="12" width="24" height="4" fill="#00A1DE"/>
    <circle cx="8" cy="5" r="2" fill="#E5BE01"/>
  </svg>
);

const UAEFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="6" height="16" fill="#FF0000"/>
    <rect x="6" width="18" height="5.33" fill="#00732F"/>
    <rect x="6" y="5.33" width="18" height="5.33" fill="#FFFFFF"/>
    <rect x="6" y="10.67" width="18" height="5.33" fill="#000000"/>
  </svg>
);

const KenyaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="4" fill="#000000"/>
    <rect y="4" width="24" height="1" fill="#FFFFFF"/>
    <rect y="5" width="24" height="6" fill="#CE1126"/>
    <rect y="11" width="24" height="1" fill="#FFFFFF"/>
    <rect y="12" width="24" height="4" fill="#006600"/>
    <circle cx="12" cy="8" r="2.5" fill="#000"/>
  </svg>
);

const NigeriaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="8" height="16" fill="#008751"/>
    <rect x="8" width="8" height="16" fill="#FFFFFF"/>
    <rect x="16" width="8" height="16" fill="#008751"/>
  </svg>
);

const SingaporeFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="8" fill="#ED2939"/>
    <rect y="8" width="24" height="8" fill="#FFFFFF"/>
    <circle cx="6" cy="5" r="2.5" fill="#FFFFFF"/>
    <polygon points="6,3 7,4 6.5,4.5" fill="#FFFFFF"/>
  </svg>
);

const SaudiArabiaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="16" fill="#006C35"/>
    <text x="12" y="10" fontSize="8" fill="#FFFFFF" textAnchor="middle">لا إله</text>
  </svg>
);

const countryFlagComponents = {
  'Kingdom of Saudi Arabia': SaudiArabiaFlag,
  'Republic of Singapore': SingaporeFlag,
  'Federal Republic of Nigeria': NigeriaFlag,
  'Republic of Kenya': KenyaFlag,
  'United Arab Emirates': UAEFlag,
  'Republic of Rwanda': RwandaFlag,
  'Republic of India': IndiaFlag,
  'Republic of Ghana': GhanaFlag,
};

function Dashboard({ setAdminPage, setSelectedSubmission }) {
  const total = DEMO_SUBMISSIONS.length;
  const upgradeReqs = DEMO_SUBMISSIONS.filter(s => s.upgradeStatus === 'requested').length;
  const avgScore = (DEMO_SUBMISSIONS.reduce((s, r) => s + r.compositeScore, 0) / total).toFixed(1);
  const completed = DEMO_SUBMISSIONS.filter(s => s.upgradeStatus !== 'none' || s.leadStage !== 'New').length;
  const completionRate = Math.round((completed / total) * 100);

  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  // Top scoring countries
  const topCountries = [...DEMO_SUBMISSIONS]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 5);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(DEMO_SUBMISSIONS.length / itemsPerPage);
  const paginatedData = DEMO_SUBMISSIONS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={{ padding: '1.5rem 2rem', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8F9FA', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1A1A2E', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
            Welcome back, Admin
          </h1>
          <div style={{ fontSize: 13, color: '#6B6577' }}>{todayStr}</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 6, fontSize: 12, color: '#1A1A2E', cursor: 'pointer'
          }}>
            <span>↓</span> Export CSV
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', background: '#1A1A2E', border: 'none',
            borderRadius: 6, fontSize: 12, color: '#FFFFFF', cursor: 'pointer'
          }}>
            <span>↓</span> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9963A" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
          value={total} 
          label="Total Assessments" 
          trend="+12%" 
          trendLabel="from last month" 
          color="#C9963A"
        />
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A7AE0" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
          value={avgScore} 
          label="Avg SAPI Score" 
          trend="No change" 
          trendLabel="composite weighted mean" 
          color="#4A7AE0"
        />
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A868" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
          value={`${completionRate}%`} 
          label="Completion Rate" 
          trend="No change" 
          trendLabel="assessments completed" 
          color="#28A868"
        />
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A830" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
          value={upgradeReqs} 
          label="Upgrade Requests" 
          trend="22 new" 
          trendLabel="upgrades this week" 
          color="#D4A830"
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search country, name or ministry..."
            style={{
              padding: '9px 12px 9px 32px', fontSize: 13,
              border: '0.5px solid #D0C8BC', borderRadius: 6,
              background: '#FFFFFF', color: '#1A1A2E',
              width: 280, outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9880B0', fontSize: 14 }}>🔍</span>
        </div>
        <select style={{
          padding: '9px 12px', fontSize: 13,
          border: '0.5px solid #D0C8BC', borderRadius: 6,
          background: '#FFFFFF', color: '#1A1A2E',
        }}>
          <option>All countries</option>
          {DEMO_SUBMISSIONS.map(s => <option key={s.id}>{shortCountry(s.country)}</option>)}
        </select>
        <select style={{
          padding: '9px 12px', fontSize: 13,
          border: '0.5px solid #D0C8BC', borderRadius: 6,
          background: '#FFFFFF', color: '#1A1A2E',
        }}>
          <option>All score ranges</option>
          <option>90-100 (Excellent)</option>
          <option>70-89 (Good)</option>
          <option>50-69 (Average)</option>
          <option>Below 50 (Needs Improvement)</option>
        </select>
        <select style={{
          padding: '9px 12px', fontSize: 13,
          border: '0.5px solid #D0C8BC', borderRadius: 6,
          background: '#FFFFFF', color: '#1A1A2E',
        }}>
          <option>All dates</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '9px 12px', background: 'transparent', border: 'none',
          color: '#6B6577', fontSize: 12, cursor: 'pointer'
        }}>
          <span>↺</span> Reset Filters
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Table */}
        <div style={{
          background: '#FFFFFF', border: '0.5px solid #E0D8CC',
          borderRadius: 8, overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8F9FA', borderBottom: '0.5px solid #E0D8CC' }}>
                {['COUNTRY', 'RESPONDENT', 'MINISTRY', 'SCORE', 'TIER', 'DATE', 'ACTIONS'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 600, color: '#6B6577',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    fontFamily: 'system-ui, sans-serif',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((sub, i) => (
                <tr 
                  key={sub.id}
                  onClick={() => { setSelectedSubmission(sub); setAdminPage('submissionDetail'); }}
                  style={{
                    background: i % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                    borderBottom: '0.5px solid #F0EBE3',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FBF5E6'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FAFBFC'}
                >
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {(() => {
                        const FlagComponent = countryFlagComponents[sub.country];
                        return FlagComponent ? <FlagComponent /> : <span>🏳️</span>;
                      })()}
                      <span style={{ color: '#1A1A2E', fontWeight: 500 }}>{shortCountry(sub.country)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ color: '#1A1A2E', fontWeight: 500 }}>{sub.respondentName}</div>
                    <div style={{ color: '#9880B0', fontSize: 11 }}>{sub.title}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#6B6577', fontSize: 12 }}>
                    {sub.ministry.length > 30 ? sub.ministry.slice(0, 30) + '…' : sub.ministry}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{ color: '#C9963A', fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600 }}>
                        {sub.compositeScore}
                      </span>
                      <span style={{ color: '#9880B0', fontSize: 11 }}>/100</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: `${tierColor(sub.tier)}15`, color: tierColor(sub.tier),
                      border: `0.5px solid ${tierColor(sub.tier)}40`,
                      padding: '4px 10px', borderRadius: 4,
                      fontSize: 11, fontWeight: 500,
                    }}>{sub.tier}</span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#6B6577', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {fmtDate(sub.completedAt)}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button style={{
                      background: 'transparent', border: 'none',
                      color: '#4A7AE0', fontSize: 12, cursor: 'pointer'
                    }}>View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderTop: '0.5px solid #E0D8CC', background: '#FAFBFC'
          }}>
            <div style={{ fontSize: 12, color: '#6B6577' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, DEMO_SUBMISSIONS.length)} of {DEMO_SUBMISSIONS.length} results
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px', background: '#FFFFFF', border: '0.5px solid #E0D8CC',
                  borderRadius: 4, fontSize: 12, cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '6px 12px', 
                    background: currentPage === page ? '#1A1A2E' : '#FFFFFF', 
                    border: '0.5px solid #E0D8CC',
                    borderRadius: 4, fontSize: 12, cursor: 'pointer',
                    color: currentPage === page ? '#FFFFFF' : '#1A1A2E',
                  }}
                >{page}</button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 12px', background: '#FFFFFF', border: '0.5px solid #E0D8CC',
                  borderRadius: 4, fontSize: 12, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >→</button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                padding: '6px 14px', background: '#1A1A2E', border: 'none',
                borderRadius: 4, fontSize: 12, color: '#FFFFFF', cursor: 'pointer'
              }}>Export CSV</button>
              <button style={{
                padding: '6px 14px', background: '#FFFFFF', border: '0.5px solid #E0D8CC',
                borderRadius: 4, fontSize: 12, color: '#1A1A2E', cursor: 'pointer'
              }}>Export PDF</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top Scoring Countries */}
          <div style={{
            background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 8, padding: '16px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 14px' }}>
              Top Scoring Countries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topCountries.map((country, idx) => (
                <div key={country.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {(() => {
                    const FlagComponent = countryFlagComponents[country.country];
                    return FlagComponent ? <FlagComponent /> : <span>🏳️</span>;
                  })()}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 500 }}>{shortCountry(country.country)}</div>
                  </div>
                  <div style={{ 
                    width: 100, height: 6, background: '#F0EBE3', borderRadius: 3,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${country.compositeScore}%`, height: '100%',
                      background: idx === 0 ? '#28A868' : idx === 1 ? '#4A7AE0' : idx === 2 ? '#C9963A' : '#D0C8BC',
                      borderRadius: 3,
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: '#1A1A2E', fontWeight: 600, width: 40, textAlign: 'right' }}>
                    {country.compositeScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Distribution */}
          <div style={{
            background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 8, padding: '16px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 14px' }}>
              Tier Distribution
            </h3>
            <TierDistributionChart submissions={DEMO_SUBMISSIONS} />
          </div>

          {/* Completion Rate Chart */}
          <div style={{
            background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 8, padding: '16px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 14px' }}>
              Completion Rate
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: `conic-gradient(#28A868 ${completionRate * 3.6}deg, #F0EBE3 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E' }}>{completionRate}%</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28A868' }} />
                <span style={{ fontSize: 11, color: '#6B6577' }}>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F0EBE3' }} />
                <span style={{ fontSize: 11, color: '#6B6577' }}>Pending</span>
              </div>
            </div>
          </div>

          {/* Submissions Over Time */}
          <div style={{
            background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 8, padding: '16px',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', margin: '0 0 14px' }}>
              Submissions Over Time
            </h3>
            <MiniLineChart data={DEMO_SUBMISSIONS} />
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KpiCard({ icon, value, label, trend, trendLabel, color }) {
  const isPositive = trend.includes('+') || trend.includes('No change');
  return (
    <div style={{
      background: '#FFFFFF', border: '0.5px solid #E0D8CC',
      borderRadius: 8, padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
      </div>
      <div style={{
        fontSize: 32, fontWeight: 600, color: '#1A1A2E',
        fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6577', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          fontSize: 11, color: isPositive ? '#28A868' : '#C03058',
          fontWeight: 500,
        }}>{trend}</span>
        <span style={{ fontSize: 11, color: '#9880B0' }}>{trendLabel}</span>
      </div>
    </div>
  );
}

// Tier Distribution Chart
function TierDistributionChart({ submissions }) {
  const tiers = ['Sovereign AI Leader', 'Advanced', 'Developing', 'Nascent', 'Pre-conditions Unmet'];
  const counts = tiers.reduce((acc, t) => {
    acc[t] = submissions.filter(s => s.tier === t).length;
    return acc;
  }, {});
  const total = submissions.length;

  const tierColors = {
    'Sovereign AI Leader': '#28A868',
    'Advanced': '#4A7AE0',
    'Developing': '#F0C050',
    'Nascent': '#C9963A',
    'Pre-conditions Unmet': '#C03058',
  };

  const shortNames = {
    'Sovereign AI Leader': 'Leader',
    'Advanced': 'Advanced',
    'Developing': 'Developing',
    'Nascent': 'Nascent',
    'Pre-conditions Unmet': 'Unmet',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {tiers.filter(t => counts[t] > 0).map(tier => {
        const pct = Math.round((counts[tier] / total) * 100);
        return (
          <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#6B6577', width: 70 }}>{shortNames[tier]}</span>
            <div style={{ flex: 1, height: 8, background: '#F0EBE3', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: tierColors[tier], borderRadius: 4,
              }} />
            </div>
            <span style={{ fontSize: 11, color: '#1A1A2E', fontWeight: 500, width: 30, textAlign: 'right' }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// Mini Line Chart
function MiniLineChart({ data }) {
  const sorted = [...data].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  const points = sorted.map((d, i) => ({ x: i, y: d.compositeScore }));
  
  return (
    <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 4px' }}>
      {points.map((p, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(p.y / 100) * 100}%`,
          background: i === points.length - 1 ? '#C9963A' : '#D0C8BC',
          borderRadius: '2px 2px 0 0',
          minHeight: 4,
        }} />
      ))}
    </div>
  );
}

// ============================================================
// USERS & SETTINGS PAGE
// ============================================================
function UsersSettingsPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@sapi.ai', role: 'Super Admin', status: 'Active', lastLogin: '2026-04-03' },
    { id: 2, name: 'John Smith', email: 'john@example.com', role: 'Editor', status: 'Active', lastLogin: '2026-04-02' },
    { id: 3, name: 'Sarah Chen', email: 'sarah@example.com', role: 'Viewer', status: 'Inactive', lastLogin: '2026-03-28' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const roles = ['Super Admin', 'Admin', 'Editor', 'Viewer'];

  const handleSaveUser = (user) => {
    if (user.id) {
      setUsers(users.map(u => u.id === user.id ? user : u));
    } else {
      setUsers([...users, { ...user, id: Date.now() }]);
    }
    setShowAddModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const roleColors = {
    'Super Admin': '#C9963A',
    'Admin': '#4A7AE0',
    'Editor': '#28A868',
    'Viewer': '#6B6577',
  };

  return (
    <div style={{ padding: '1.75rem 2rem 2.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 22, fontWeight: 400, color: '#1A1A2E', margin: '0 0 4px', fontFamily: 'Georgia, serif' }}>
          Users & Settings
        </h1>
        <div style={{ fontSize: 12, color: '#9880B0' }}>Manage users and system configuration</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid #E0D8CC', marginBottom: 24 }}>
        {[
          { key: 'users', label: 'Users', count: users.length },
          { key: 'settings', label: 'Settings' },
          { key: 'security', label: 'Security' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab.key ? '#C9963A' : 'transparent'}`,
              color: activeTab === tab.key ? '#1A1A2E' : '#6B6577',
              fontSize: 13,
              fontWeight: activeTab === tab.key ? 500 : 400,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {tab.label}
            {tab.count && (
              <span style={{
                background: activeTab === tab.key ? '#C9963A20' : '#F0EBE3',
                color: activeTab === tab.key ? '#C9963A' : '#6B6577',
                padding: '2px 8px', borderRadius: 10, fontSize: 11,
              }}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          {/* Actions Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search users..."
                style={{
                  padding: '8px 12px', fontSize: 13,
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                  background: '#FFFFFF', color: '#1A1A2E',
                  width: 240, outline: 'none',
                }}
              />
              <select style={{
                padding: '8px 12px', fontSize: 13,
                border: '0.5px solid #D0C8BC', borderRadius: 6,
                background: '#FFFFFF', color: '#1A1A2E',
              }}>
                <option value="">All Roles</option>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
              <select style={{
                padding: '8px 12px', fontSize: 13,
                border: '0.5px solid #D0C8BC', borderRadius: 6,
                background: '#FFFFFF', color: '#1A1A2E',
              }}>
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: '#C9963A', color: '#FFFFFF',
                border: 'none', borderRadius: 6,
                padding: '9px 18px', fontSize: 13,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              + Add User
            </button>
          </div>

          {/* Users Table */}
          <div style={{
            background: '#FFFFFF', border: '0.5px solid #E0D8CC',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F0EBE3' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 500, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>User</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 500, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 500, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10.5, fontWeight: 500, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Login</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10.5, fontWeight: 500, color: '#1A1A2E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} style={{
                    background: i % 2 === 0 ? '#FFFFFF' : '#FDFAF6',
                    borderBottom: '0.5px solid #F0EBE3',
                  }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: '#C9963A20',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#C9963A', fontSize: 14, fontWeight: 500,
                        }}>{user.name.charAt(0)}</div>
                        <div>
                          <div style={{ color: '#1A1A2E', fontWeight: 500 }}>{user.name}</div>
                          <div style={{ color: '#9880B0', fontSize: 11 }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        background: `${roleColors[user.role]}20`, color: roleColors[user.role],
                        border: `0.5px solid ${roleColors[user.role]}50`,
                        padding: '3px 10px', borderRadius: 4,
                        fontSize: 11, fontWeight: 500,
                      }}>{user.role}</span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        color: user.status === 'Active' ? '#28A868' : '#6B6577',
                        fontSize: 12,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: user.status === 'Active' ? '#28A868' : '#6B6577',
                        }} />
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6B6577', fontSize: 12 }}>{user.lastLogin}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => { setEditingUser(user); setShowAddModal(true); }}
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#4A7AE0', fontSize: 12, cursor: 'pointer',
                          marginRight: 12,
                        }}
                      >Edit</button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#C94646', fontSize: 12, cursor: 'pointer',
                        }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: 600 }}>
          {[ 
            { label: 'Organization Name', value: 'SAPI Organization', type: 'text' },
            { label: 'Support Email', value: 'support@sapi.ai', type: 'email' },
            { label: 'Default Language', value: 'English', type: 'select', options: ['English', 'French', 'Spanish', 'Arabic'] },
            { label: 'Timezone', value: 'UTC+05:30', type: 'select', options: ['UTC', 'UTC+05:30', 'UTC+08:00', 'UTC-05:00'] },
          ].map((field, idx) => (
            <div key={idx} style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#6B6577', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select style={{
                  width: '100%', padding: '10px 12px', fontSize: 13,
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                  background: '#FFFFFF', color: '#1A1A2E',
                }}>
                  {field.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  defaultValue={field.value}
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: 13,
                    border: '0.5px solid #D0C8BC', borderRadius: 6,
                    background: '#FFFFFF', color: '#1A1A2E',
                  }}
                />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button style={{
              background: '#C9963A', color: '#FFFFFF',
              border: 'none', borderRadius: 6,
              padding: '10px 20px', fontSize: 13, cursor: 'pointer',
            }}>Save Changes</button>
            <button style={{
              background: 'transparent', color: '#6B6577',
              border: '0.5px solid #D0C8BC', borderRadius: 6,
              padding: '10px 20px', fontSize: 13, cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{ maxWidth: 600 }}>
          {[ 
            { label: 'Two-Factor Authentication', desc: 'Require 2FA for all admin users', enabled: true },
            { label: 'Password Expiry', desc: 'Force password reset every 90 days', enabled: false },
            { label: 'Login Notifications', desc: 'Email alerts for new device logins', enabled: true },
            { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
          ].map((setting, idx) => (
            <div key={idx} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 0', borderBottom: '0.5px solid #F0EBE3',
            }}>
              <div>
                <div style={{ color: '#1A1A2E', fontWeight: 500, fontSize: 14 }}>{setting.label}</div>
                <div style={{ color: '#9880B0', fontSize: 12, marginTop: 2 }}>{setting.desc}</div>
              </div>
              <button style={{
                width: 44, height: 24, borderRadius: 12,
                background: setting.enabled ? '#C9963A' : '#D0C8BC',
                border: 'none', cursor: 'pointer',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: 2,
                  left: setting.enabled ? 22 : 2,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#FFFFFF',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 8, width: 400,
            padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 20px', fontFamily: 'Georgia, serif', color: '#1A1A2E' }}>
              {editingUser ? 'Edit User' : 'Add User'}
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#6B6577', marginBottom: 6 }}>Name</label>
              <input
                type="text"
                defaultValue={editingUser?.name || ''}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 13,
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#6B6577', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                defaultValue={editingUser?.email || ''}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 13,
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#6B6577', marginBottom: 6 }}>Role</label>
              <select
                defaultValue={editingUser?.role || 'Viewer'}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: 13,
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                }}
              >
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => { setShowAddModal(false); setEditingUser(null); }}
                style={{
                  background: 'transparent', color: '#6B6577',
                  border: '0.5px solid #D0C8BC', borderRadius: 6,
                  padding: '9px 16px', fontSize: 13, cursor: 'pointer',
                }}
              >Cancel</button>
              <button
                onClick={() => handleSaveUser(editingUser || { name: '', email: '', role: 'Viewer', status: 'Active', lastLogin: '-' })}
                style={{
                  background: '#C9963A', color: '#FFFFFF',
                  border: 'none', borderRadius: 6,
                  padding: '9px 16px', fontSize: 13, cursor: 'pointer',
                }}
              >{editingUser ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
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
  const [adminPage, setAdminPage] = useState('dashboard');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Ensure dashboard is the default page on mount
  useEffect(() => {
    setAdminPage('dashboard');
  }, []);

  const handleSignOut = () => {
    setAdminPage('login');
  };

  const pageTitle = {
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
        {adminPage === 'submissionDetail' && selectedSubmission && (
          <SubmissionDetail
            submission={selectedSubmission}
            onBack={() => setAdminPage('submissions')}
          />
        )}
        {adminPage === 'questionEditor' && (
          <QuestionEditor />
        )}
        {adminPage === 'userMgmt' && (
          <UsersSettingsPage />
        )}
        {adminPage !== 'dashboard' && adminPage !== 'submissions' && adminPage !== 'submissionDetail' && adminPage !== 'questionEditor' && adminPage !== 'userMgmt' && (
          <StubPage title={pageTitle[adminPage] || adminPage} />
        )}
      </main>
    </div>
  );
}
