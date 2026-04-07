import { useState, useMemo, useEffect } from "react";
import { getDashboardAssessments, exportDashboardCSV } from "../services/dashboardService";

// ============================================================
// SEED DATA  (shared — define once in the top-level admin file)
// ============================================================
const DEMO_SUBMISSIONS = [
  {
    id: "sub_001", country: "Kingdom of Saudi Arabia",
    respondentName: "H.E. Faisal Al-Ibrahim", title: "Minister of Economy and Planning",
    ministry: "Ministry of Economy and Planning", email: "f.alibrahim@mep.gov.sa",
    developmentStage: "Advanced", completedAt: "2026-03-14T09:22:00Z",
    compositeScore: 71.4, tier: "Advanced",
    scores: { compute: 78, capital: 82, regulatory: 65, data: 60, di: 68 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "High-value lead. Minister attended SAPI launch event.", leadStage: "Proposal Sent",
  },
  {
    id: "sub_002", country: "Republic of Singapore",
    respondentName: "Dr. Janice Tan", title: "Deputy Secretary, Smart Nation",
    ministry: "Smart Nation and Digital Government Office", email: "janice_tan@smartnation.gov.sg",
    developmentStage: "Leading", completedAt: "2026-03-15T14:05:00Z",
    compositeScore: 83.2, tier: "Sovereign AI Leader",
    scores: { compute: 85, capital: 88, regulatory: 90, data: 80, di: 78 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_003", country: "Federal Republic of Nigeria",
    respondentName: "Hon. Bosun Tijani", title: "Minister of Communications, Innovation and Digital Economy",
    ministry: "Federal Ministry of Communications", email: "minister@fmcide.gov.ng",
    developmentStage: "Developing", completedAt: "2026-03-17T11:30:00Z",
    compositeScore: 38.6, tier: "Nascent",
    scores: { compute: 28, capital: 35, regulatory: 42, data: 30, di: 45 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "Introduced via GIZ partnership.", leadStage: "Contacted",
  },
  {
    id: "sub_004", country: "Republic of Kenya",
    respondentName: "Eliud Owalo", title: "Cabinet Secretary, Information & Digital Economy",
    ministry: "Ministry of Information, Communications and Digital Economy", email: "cs@ict.go.ke",
    developmentStage: "Emerging", completedAt: "2026-03-18T08:14:00Z",
    compositeScore: 29.1, tier: "Nascent",
    scores: { compute: 22, capital: 28, regulatory: 35, data: 25, di: 32 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_005", country: "United Arab Emirates",
    respondentName: "H.E. Omar Al Olama", title: "Minister of State for Artificial Intelligence",
    ministry: "Ministry of AI, Digital Economy and Remote Work Applications", email: "minister.ai@uaecabinet.ae",
    developmentStage: "Leading", completedAt: "2026-03-19T10:00:00Z",
    compositeScore: 78.9, tier: "Advanced",
    scores: { compute: 85, capital: 88, regulatory: 75, data: 72, di: 70 },
    upgradeStatus: "requested", requestedTier: "Tier 3",
    adminNotes: "Priority account. Met Asim at WEF Davos.", leadStage: "Won",
  },
  {
    id: "sub_006", country: "Republic of Rwanda",
    respondentName: "Paula Ingabire", title: "Minister of ICT and Innovation",
    ministry: "Ministry of ICT and Innovation", email: "minister@minict.gov.rw",
    developmentStage: "Developing", completedAt: "2026-03-20T13:45:00Z",
    compositeScore: 46.3, tier: "Developing",
    scores: { compute: 40, capital: 42, regulatory: 55, data: 38, di: 50 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_007", country: "Republic of India",
    respondentName: "Sh. S. Krishnan", title: "Secretary, Ministry of Electronics and Information Technology",
    ministry: "MeitY", email: "secretary@meity.gov.in",
    developmentStage: "Advanced", completedAt: "2026-03-21T07:30:00Z",
    compositeScore: 62.7, tier: "Advanced",
    scores: { compute: 65, capital: 70, regulatory: 68, data: 52, di: 58 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "Referred via UK FCDO digital programme.", leadStage: "Contacted",
  },
  {
    id: "sub_008", country: "Republic of Ghana",
    respondentName: "Ursula Owusu-Ekuful", title: "Minister for Communications and Digitalisation",
    ministry: "Ministry of Communications and Digitalisation", email: "minister@moc.gov.gh",
    developmentStage: "Emerging", completedAt: "2026-03-22T15:10:00Z",
    compositeScore: 33.4, tier: "Nascent",
    scores: { compute: 28, capital: 30, regulatory: 40, data: 28, di: 36 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
];

// ============================================================
// HELPERS
// ============================================================
const tierColor = (tier) => ({
  "Sovereign AI Leader": "#28A868",
  "Advanced": "#4A7AE0",
  "Developing": "#D4A830",
  "Nascent": "#C9963A",
  "Pre-conditions Unmet": "#C03058",
}[tier] || "#9880B0");

const scoreColor = (s) => s >= 70 ? "#4A7AE0" : s >= 55 ? "#D4A830" : s >= 40 ? "#C9963A" : "#C03058";

// ============================================================
// FLAG COMPONENTS
// ============================================================
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

const UnitedKingdomFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.2"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#FFFFFF" strokeWidth="3"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="1.8"/>
  </svg>
);

const AzerbaijanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="5.33" fill="#0092C6"/>
    <rect y="5.33" width="24" height="5.33" fill="#DA2D2D"/>
    <rect y="10.67" width="24" height="5.33" fill="#00C6A0"/>
    <circle cx="12" cy="8" r="2.5" fill="#FFFFFF"/>
    <path d="M12 8 L14 7.5 L13.5 8.5 Z" fill="#FFFFFF"/>
  </svg>
);

const KazakhstanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="16" fill="#00AFCA"/>
    <circle cx="6" cy="8" r="2.5" fill="#FEC50C"/>
    <path d="M9 6 L10 8 L9 10" stroke="#FEC50C" strokeWidth="0.8" fill="none"/>
  </svg>
);

const QatarFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" style={{ borderRadius: 2, flexShrink: 0 }}>
    <rect width="24" height="16" fill="#8B1C3D"/>
    <rect width="6" height="16" fill="#FFFFFF"/>
    <path d="M6 0 L10 2 L6 4 L10 6 L6 8 L10 10 L6 12 L10 14 L6 16" fill="#FFFFFF"/>
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
  'United Kingdom': UnitedKingdomFlag,
  'Republic of Azerbaijan': AzerbaijanFlag,
  'Republic of Kazakhstan': KazakhstanFlag,
  'State of Qatar': QatarFlag,
};

const fmtDate = (iso) => {
  // Display exactly as received from API without conversion
  if (typeof iso === 'string' && iso.includes('/')) {
    // Format: DD/MM/YYYY HH:MM:SS -> DD MMM YYYY HH:MM AM/PM
    const [datePart, timePart] = iso.split(' ');
    const [day, month, year] = datePart.split('/');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month, 10) - 1];
    const [hours24, minutes] = timePart.split(':');
    const hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${day} ${monthName} ${year} ${hours12}:${minutes} ${ampm}`;
  }
  
  // Fallback for ISO format
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${day} ${month} ${year} ${hours12}:${minutes} ${ampm}`;
};

const truncMin = (str, n) =>
  str && str.length > n ? str.slice(0, n) + "…" : (str || "");

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('sapi_token') || sessionStorage.getItem('sapi_token');

// Transform API assessment to component format
const transformAssessment = (assessment) => ({
  id: assessment.id,
  country: assessment.country,
  respondentName: assessment.respondentName,
  title: assessment.title,
  ministry: assessment.ministry,
  developmentStage: assessment.developmentStage,
  completedAt: assessment.date,
  compositeScore: assessment.score,
  tier: assessment.tier,
  scores: {
    compute: assessment.dimensionScores?.computeCapacity || 0,
    capital: assessment.dimensionScores?.capitalFormation || 0,
    regulatory: assessment.dimensionScores?.regulatoryReadiness || 0,
    data: assessment.dimensionScores?.dataSovereignty || 0,
    di: assessment.dimensionScores?.directedIntelligence || 0
  },
  upgradeStatus: assessment.upgradeStatus || 'none',
  requestedTier: assessment.requestedTier || null,
  adminNotes: assessment.adminNotes || '',
  leadStage: assessment.leadStage || 'New'
});

// ============================================================
// TOAST
// ============================================================
function Toast({ visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: "#1A1540", border: "0.5px solid #2A204A",
      color: "#FBF5E6", padding: "11px 18px", borderRadius: 7,
      fontSize: 13, display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
      pointerEvents: "none",
    }}>
      <div style={{ width: 7, height: 7, background: "#28A868", borderRadius: "50%", flexShrink: 0 }} />
      Export ready{" "}
      <span style={{ color: "#9880B0", fontSize: 11, marginLeft: 4 }}>(prototype mode)</span>
    </div>
  );
}

// ============================================================
// PILL BADGE
// ============================================================
function Pill({ label, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 9px", borderRadius: 3,
      fontSize: 11, fontWeight: 500, letterSpacing: "0.02em", whiteSpace: "nowrap",
      background: `${color}18`, color, border: `0.5px solid ${color}40`,
    }}>
      {label}
    </span>
  );
}

// ============================================================
// FILTER SELECT
// ============================================================
function FilterSelect({ value, onChange, options, placeholder }) {
  const isActive = value !== options[0];
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none", WebkitAppearance: "none",
          background: "#FFFFFF",
          border: `0.5px solid ${isActive ? "#C9963A" : "#E0D8CC"}`,
          borderRadius: 6, padding: "7px 28px 7px 11px",
          fontSize: 12.5, color: "#1A1A2E",
          fontFamily: "system-ui, sans-serif",
          cursor: "pointer", outline: "none",
          minWidth: 130,
          transition: "border-color 0.15s",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
        fontSize: 10, color: "#9880B0", pointerEvents: "none",
      }}>▾</span>
    </div>
  );
}

// ============================================================
// COLUMN HEADER
// ============================================================
function ColHeader({ col, sortKey, sortDir, onSort }) {
  const active = sortKey === col.key;
  return (
    <th
      onClick={col.sortable ? () => onSort(col.key) : undefined}
      style={{
        padding: "0 14px", height: 36,
        background: "#F0EBE3",
        color: active ? "#C9963A" : "#6B6577",
        fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.07em",
        cursor: col.sortable ? "pointer" : "default",
        userSelect: "none", whiteSpace: "nowrap",
        textAlign: "left", borderBottom: "0.5px solid #E0D8CC",
        width: col.width,
        transition: "color 0.12s",
      }}
    >
      {col.label}
      {col.sortable && (
        <span style={{ fontSize: 9, marginLeft: 4, color: active ? "#C9963A" : "#C8C0B8" }}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      )}
    </th>
  );
}

// ============================================================
// B1 — SUBMISSIONS LIST
// ============================================================
export default function SubmissionsList({ setAdminPage, setSelectedSubmission, setSelectedLead }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [filterUpgrade, setFilterUpgrade] = useState("All");
  const [filterLead, setFilterLead] = useState("All");
  const [sortKey, setSortKey] = useState("completedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      try {
        setLoading(true);
        const response = await getDashboardAssessments(token, { page: 1, limit: 100 });
        if (response?.success) {
          const transformedData = response.data.data.map(transformAssessment);
          setSubmissions(transformedData);
        } else {
          setSubmissions([]);
        }
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load assessments');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const hasActiveFilters =
    search || filterStage !== "All" ||
    filterUpgrade !== "All" || filterLead !== "All";

  const clearFilters = () => {
    setSearch(""); setFilterStage("All");
    setFilterUpgrade("All"); setFilterLead("All");
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleExport = async () => {
    const token = getAuthToken();
    try {
      const blob = await exportDashboardCSV(token, {
        search: search,
        developmentStage: filterStage !== "All" ? filterStage : undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assessments-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export CSV');
    }
  };

  const rows = useMemo(() => {
    let r = [...submissions];
    const s = search.toLowerCase().trim();
    if (s) r = r.filter((x) =>
      x.country?.toLowerCase().includes(s) ||
      x.respondentName?.toLowerCase().includes(s) ||
      x.ministry?.toLowerCase().includes(s)
    );
    if (filterStage !== "All") r = r.filter((x) => x.developmentStage === filterStage);
    if (filterUpgrade === "Requested") r = r.filter((x) => x.upgradeStatus === "requested");
    if (filterUpgrade === "Not requested") r = r.filter((x) => x.upgradeStatus !== "requested");
    if (filterLead !== "All") r = r.filter((x) => x.leadStage === filterLead);

    r.sort((a, b) => {
      const d = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === "string") return av.localeCompare(bv) * d;
      return (av - bv) * d;
    });
    return r;
  }, [search, filterStage, filterUpgrade, filterLead, sortKey, sortDir, submissions]);

  const COLUMNS = [
    { key: "country",          label: "Country",    sortable: true,  width: "160px" },
    { key: "respondentName",   label: "Respondent", sortable: true,  width: "176px" },
    { key: "ministry",         label: "Ministry",   sortable: false, width: "180px" },
    { key: "developmentStage", label: "Dev Stage",  sortable: true,  width: "100px" },
    { key: "compositeScore",   label: "Score",      sortable: true,  width: "72px"  },
    { key: "tier",             label: "Tier",       sortable: true,  width: "150px" },
    { key: "completedAt",      label: "Date",       sortable: true,  width: "100px" },
    { key: "actions",          label: "Actions",    sortable: false, width: "152px" },
  ];

  const rowHoverStyles = `
    .sapi-row { transition: background 0.1s; }
    .sapi-row:hover { background: #FBF5E6 !important; }
    .btn-view { transition: background 0.13s, color 0.13s; }
    .btn-view:hover { background: #C9963A !important; color: #06030E !important; }
    .btn-lead { transition: background 0.13s, color 0.13s; }
    .btn-lead:hover { background: #4A7AE0 !important; color: #FFFFFF !important; }
    .tbl-th-sortable:hover { color: #1A1A2E !important; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D4CBB8; border-radius: 3px; }
  `;

  const totalCount = submissions.length;
  const upgradeCount = submissions.filter((s) => s.upgradeStatus === "requested").length;

  if (loading) {
    return (
      <div style={{ padding: "1.75rem 2rem 2.5rem", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#6B6577" }}>Loading assessments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1.75rem 2rem 2.5rem", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#C03058", marginBottom: 8 }}>{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: "8px 16px", background: "#1A1A2E", color: "#FFFFFF", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.75rem 2rem 2.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{rowHoverStyles}</style>
      <Toast visible={toastVisible} />

      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1A1A2E", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
            Assessments
          </h1>
          <div style={{ fontSize: 13, color: "#6B6577" }}>
            {totalCount} assessments completed ·{" "}
          </div>
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div style={{
        background: "#FFFFFF", border: "0.5px solid #E0D8CC",
        borderRadius: 8, padding: "12px 16px", marginBottom: "1.25rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

          {/* Search */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="7" cy="7" r="4.5" stroke="#B0A8A0" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="#B0A8A0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              placeholder="Search country, respondent, ministry..."
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#FFFFFF", border: `0.5px solid ${search ? "#C9963A" : "#E0D8CC"}`,
                borderRadius: 6, padding: "9px 12px 9px 36px",
                fontSize: 13, color: "#1A1A2E", fontFamily: "system-ui, sans-serif",
                width: 260, outline: "none", transition: "border-color 0.15s",
              }}
            />
          </div>

          <FilterSelect
            value={filterStage}
            onChange={setFilterStage}
            placeholder="All dev stages"
            options={[
              { value: "All", label: "All dev stages" },
              { value: "Early", label: "Early" },
              { value: "Emerging", label: "Emerging" },
              { value: "Developing", label: "Developing" },
              { value: "Advanced", label: "Advanced" },
              { value: "Leading", label: "Leading" },
            ]}
          />

          <div style={{ flex: 1 }} />

          <button
            onClick={handleExport}
            style={{
              padding: "8px 16px", fontSize: 13, borderRadius: 6,
              background: "#C9963A", border: "none", color: "#FFFFFF",
              cursor: "pointer", fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
              letterSpacing: "0.02em", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #F0EBE3" }}>
            {filterStage !== "All" && (
              <span style={{
                background: "#F8F9FA", border: "0.5px solid #E0D8CC", borderRadius: 4,
                padding: "4px 10px", fontSize: 12, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6,
              }}>
                Dev Stage: {filterStage}
                <button onClick={() => setFilterStage("All")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6B6577", fontSize: 14 }}>×</button>
              </span>
            )}
            {filterLead !== "All" && (
              <span style={{
                background: "#F8F9FA", border: "0.5px solid #E0D8CC", borderRadius: 4,
                padding: "4px 10px", fontSize: 12, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6,
              }}>
                Lead: {filterLead}
                <button onClick={() => setFilterLead("All")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6B6577", fontSize: 14 }}>×</button>
              </span>
            )}
            <span style={{ fontSize: 12, color: "#9880B0", marginLeft: "auto" }}>
              Showing {rows.length} of {totalCount}
            </span>
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #E0D8CC", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <ColHeader key={col.key} col={col} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.2 }}>≡</div>
                      <div style={{ fontSize: 14, color: "#6B6577", marginBottom: 8 }}>
                        No assessments match your filters
                      </div>
                      <button
                        onClick={clearFilters}
                        style={{
                          background: "none", border: "none", color: "#C9963A",
                          fontSize: 13, cursor: "pointer", padding: 0,
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : rows.map((row) => {
                const isSelected = selectedRow === row.id;
                const tc = tierColor(row.tier);

                return (
                  <tr
                    key={row.id}
                    className="sapi-row"
                    onClick={() => setSelectedRow(row.id)}
                    style={{
                      borderBottom: "0.5px solid #E8E2DA",
                      background: isSelected ? "#FFFDF8" : "#FFFFFF",
                      borderLeft: isSelected ? "3px solid #C9963A" : "3px solid transparent",
                      cursor: "default",
                    }}
                  >
                    {/* Country */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {(() => {
                          const FlagComponent = countryFlagComponents[row.country];
                          return FlagComponent ? <FlagComponent /> : <span style={{ fontSize: 16 }}>🏳️</span>;
                        })()}
                        <span style={{ fontSize: 13, color: "#1A1A2E", fontWeight: 500 }}>{row.country}</span>
                      </div>
                    </td>

                    {/* Respondent */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, color: "#1A1A2E" }}>{row.respondentName}</div>
                      <div style={{ fontSize: 11, color: "#9880B0", marginTop: 1 }}>{truncMin(row.title, 36)}</div>
                    </td>

                    {/* Ministry */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{ fontSize: 12.5, color: "#6B6577" }}>{truncMin(row.ministry, 30)}</span>
                    </td>

                    {/* Dev Stage */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{
                        fontSize: 12, color: "#6B6577", background: "#F0EBE3",
                        padding: "2px 8px", borderRadius: 3,
                      }}>
                        {row.developmentStage}
                      </span>
                    </td>

                    {/* Score */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{
                        fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 400,
                        color: scoreColor(row.compositeScore),
                      }}>
                        {row.compositeScore}
                      </span>
                    </td>

                    {/* Tier */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <Pill label={row.tier} color={tc} />
                    </td>

                    {/* Date */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 12.5, color: "#6B6577" }}>{fmtDate(row.completedAt)}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          className="btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Store assessment_id in localStorage for detail page
                            localStorage.setItem('sapi_assessment_id', row.id);
                            setSelectedSubmission(row);
                            setAdminPage("submissionDetail");
                            setSelectedRow(row.id);
                          }}
                          style={{
                            padding: "4px 10px", fontSize: 12, borderRadius: 4,
                            background: "transparent", border: "0.5px solid #C9963A", color: "#C9963A",
                            cursor: "pointer", fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {rows.length > 0 && (
          <div style={{
            padding: "12px 16px", borderTop: "0.5px solid #E8E2DA",
            background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: "#6B6577" }}>
              Showing {rows.length} assessments
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>‹</button>
              <button style={{
                padding: "6px 12px", background: "#1A1A2E", border: "none",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#FFFFFF",
              }}>1</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>2</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>3</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
