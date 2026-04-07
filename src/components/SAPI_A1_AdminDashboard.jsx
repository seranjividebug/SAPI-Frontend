import { useState, useEffect } from "react";
import SubmissionsList from './SAPI_B1_SubmissionsList';
import SubmissionDetail from './SAPI_B2_SubmissionDetail';
import QuestionEditor from './SAPI_E1_QuestionEditor';
import Sidebar from './SAPI_Sidebar';
import { 
  getDashboardAssessments, 
  getDashboardFilters,
  exportDashboardCSV,
  updateAssessmentStatus,
  getDashboardStats
} from '../services/dashboardService';

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
  
  // Fallback for ISO format - show as-is
  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};





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

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('sapi_token') || sessionStorage.getItem('sapi_token');

// Transform API assessment to component format
const transformAssessment = (assessment) => ({
  id: assessment.id,
  country: assessment.country,
  respondentName: assessment.respondentName,
  title: assessment.title,
  ministry: assessment.ministry,
  email: assessment.email || '',
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
  answers: assessment.answers || {},
  upgradeStatus: assessment.upgradeStatus || 'none',
  requestedTier: assessment.requestedTier || null,
  adminNotes: assessment.adminNotes || '',
  leadStage: assessment.leadStage || 'New'
});

function Dashboard({ setAdminPage, setSelectedSubmission }) {
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [filters, setFilters] = useState({ countries: [], tiers: [], developmentStages: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Dashboard stats state
  const [stats, setStats] = useState({
    totalAssessments: { value: 0, change: 0 },
    avgSapiScore: { value: 0, change: 0 },
    completionRate: { value: 0, change: 0 },
    upgradeRequests: { value: 0, weeklyNew: 0 }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // Filter loading state
  const [filterLoading, setFilterLoading] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedScoreRange, setSelectedScoreRange] = useState('');
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getAuthToken();
      
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [assessmentsRes, filtersRes, statsRes] = await Promise.all([
          getDashboardAssessments(token, { page: currentPage, limit: itemsPerPage }).catch(() => null),
          getDashboardFilters(token).catch(() => null),
          getDashboardStats(token).catch(() => null)
        ]);
        
        if (assessmentsRes?.success) {
          const transformedSubmissions = assessmentsRes.data.data.map(transformAssessment);
          setSubmissions(transformedSubmissions);
          setAllSubmissions(transformedSubmissions);
          setTotalPages(assessmentsRes.data.totalPages || 1);
        } else {
          setSubmissions([]);
          setAllSubmissions([]);
          setTotalPages(1);
        }
        
        if (filtersRes?.success) {
          setFilters(filtersRes.data);
        }
        
        if (statsRes?.success) {
          setStats(statsRes.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
        setSubmissions([]);
        setAllSubmissions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentPage]);
  
  // Apply filters when they change
  useEffect(() => {
    const fetchFilteredAssessments = async () => {
      const token = getAuthToken();
      
      try {
        setFilterLoading(true);
        const filterParams = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          country: selectedCountry
        };
        
        // Parse score range
        if (selectedScoreRange) {
          const ranges = {
            '90-100 (Excellent)': { min: 90, max: 100 },
            '70-89 (Good)': { min: 70, max: 89 },
            '50-69 (Average)': { min: 50, max: 69 },
            'Below 50 (Needs Improvement)': { min: 0, max: 49 }
          };
          const range = ranges[selectedScoreRange];
          if (range) {
            filterParams.scoreMin = range.min;
            filterParams.scoreMax = range.max;
          }
        }
        
        const response = await getDashboardAssessments(token, filterParams);
        
        if (response?.success) {
          const transformedSubmissions = response.data.data.map(transformAssessment);
          setSubmissions(transformedSubmissions);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (err) {
        console.error('Filter fetch error:', err);
      } finally {
        setFilterLoading(false);
      }
    };
    
    // Debounce search
    const timeoutId = setTimeout(fetchFilteredAssessments, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCountry, selectedScoreRange, currentPage]);
  
  // Calculate derived values from ALL submissions (not filtered)
  const total = allSubmissions.length;
  const upgradeReqs = allSubmissions.filter(s => s.upgradeStatus === 'requested').length;
  const avgScore = total > 0 ? (allSubmissions.reduce((s, r) => s + r.compositeScore, 0) / total).toFixed(1) : '0.0';
  const completed = allSubmissions.filter(s => s.upgradeStatus !== 'none' || s.leadStage !== 'New').length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Get unique countries from all submissions for filter dropdown
  const uniqueCountries = [...new Set(allSubmissions.map(s => s.country))].sort();

  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  
  if (loading) {
    return (
      <div style={{ padding: '1.5rem 2rem', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: '#6B6577' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ padding: '1.5rem 2rem', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, color: '#C03058', marginBottom: 8 }}>{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '8px 16px', background: '#1A1A2E', color: '#FFFFFF', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Top scoring countries from ALL submissions
  const topCountries = [...allSubmissions]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 5);
  
  // Handle CSV export
  const handleExportCSV = async () => {
    const token = getAuthToken();
    try {
      const blob = await exportDashboardCSV(token, {
        search: searchQuery,
        country: selectedCountry
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export CSV');
    }
  };

  // Handle status update
  const handleUpdateStatus = async (submissionId, newStatus) => {
    const token = getAuthToken();
    try {
      const response = await updateAssessmentStatus(token, submissionId, { leadStage: newStatus });
      
      if (response?.success) {
        // Update local state
        setSubmissions(prev => prev.map(sub => 
          sub.id === submissionId ? { ...sub, leadStage: newStatus } : sub
        ));
        setAllSubmissions(prev => prev.map(sub => 
          sub.id === submissionId ? { ...sub, leadStage: newStatus } : sub
        ));
      }
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    }
  };

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
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9963A" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
          value={stats.totalAssessments.value} 
          label="Total Assessments" 
          color="#C9963A"
        />
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A7AE0" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>}
          value={stats.avgSapiScore.value} 
          label="Avg SAPI Score" 
          color="#4A7AE0"
        />
        <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#28A868" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
          value={`${stats.completionRate.value}%`} 
          label="Completion Rate" 
          trendLabel="assessments completed" 
          color="#28A868"
        />
        {/* <KpiCard 
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A830" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>}
          value={upgradeReqs} 
          label="Upgrade Requests" 
          trend="22 new" 
          trendLabel="upgrades this week" 
          color="#D4A830"
        /> */}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search country, name or ministry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '9px 12px 9px 32px', fontSize: 13,
              border: '0.5px solid #D0C8BC', borderRadius: 6,
              background: '#FFFFFF', color: '#1A1A2E',
              width: 280, outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9880B0', fontSize: 14 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#9880B0" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="#9880B0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
        </div>
        <select 
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{
            padding: '6px 9px', fontSize: 13,
            border: '0.5px solid #D0C8BC', borderRadius: 6,
            background: '#FFFFFF', color: '#1A1A2E',
            position: 'relative', zIndex: 20,
            flex: 1, minWidth: 140,
          }}
        >
          <option value="">All countries</option>
          {uniqueCountries.map(country => (
            <option key={country} value={country}>{shortCountry(country)}</option>
          ))}
        </select>
        <select 
          value={selectedScoreRange}
          onChange={(e) => setSelectedScoreRange(e.target.value)}
          style={{
            padding: '6px 9px', fontSize: 13,
            border: '0.5px solid #D0C8BC', borderRadius: 6,
            background: '#FFFFFF', color: '#1A1A2E',
            position: 'relative', zIndex: 20,
            flex: 1, minWidth: 140,
          }}
        >
          <option value="">All score ranges</option>
          <option>90-100 (Excellent)</option>
          <option>70-89 (Good)</option>
          <option>50-69 (Average)</option>
          <option>Below 50 (Needs Improvement)</option>
        </select>
        <select style={{
          padding: '7px 10px', fontSize: 13,
          border: '0.5px solid #D0C8BC', borderRadius: 6,
          background: '#FFFFFF', color: '#1A1A2E',
          position: 'relative', zIndex: 20,
          flex: 1, minWidth: 140,
        }}>
          <option>All dates</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
        </div>
        <button 
          onClick={handleExportCSV}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', background: '#C9963A', border: 'none',
            borderRadius: 6, fontSize: 13, color: '#FFFFFF', cursor: 'pointer',
            flexShrink: 0,
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

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        {/* Table */}
        <div style={{
          background: '#FFFFFF', border: '0.5px solid #E0D8CC',
          borderRadius: 8, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto', position: 'relative' }}>
            {filterLoading && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 5,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: 40, height: 40, border: '3px solid #E0D8CC', 
                    borderTop: '3px solid #C9963A', borderRadius: '50%',
                    animation: 'spin 1s linear infinite', margin: '0 auto 8px'
                  }} />
                  <div style={{ fontSize: 13, color: '#6B6577' }}>Loading...</div>
                </div>
              </div>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#F2ECCF', borderBottom: '0.5px solid #E0D8CC' }}>
                {['COUNTRY', 'RESPONDENT', 'MINISTRY', 'SCORE', 'TIER', 'DATE', 'ACTIONS'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left',
                    fontSize: 10, fontWeight: 600, color: '#1A1A2E',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    fontFamily: 'system-ui, sans-serif',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 && !filterLoading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 14, color: '#6B6577' }}>No records found</div>
                  </td>
                </tr>
              ) : (
                submissions.map((sub, i) => (
                <tr 
                  key={sub.id}
                  onClick={() => { setSelectedSubmission(sub); setAdminPage('submissionDetail'); }}
                  style={{
                    background: i % 2 === 0 ? '#FFFFFF' : '#FAFBFC',
                    borderBottom: '0.5px solid #F0EBE3',
                    cursor: 'pointer',
                  }}
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
                      <span style={{ color: '#C9963A', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: 18, fontWeight: 600 }}>
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
                    <button 
                      style={{
                        padding: '6px 16px', 
                        background: 'transparent', 
                        border: '1px solid #C9963A',
                        borderRadius: 4, 
                        fontSize: 12, 
                        color: '#C9963A', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#C9963A';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#C9963A';
                      }}
                    >View</button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
          </div>
          
          {/* Pagination */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderTop: '0.5px solid #E0D8CC', background: '#FAFBFC'
          }}>
            <div style={{ fontSize: 12, color: '#6B6577' }}>
              Showing {total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, total)} of {total} results
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
            <TierDistributionChart submissions={allSubmissions} />
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
                background: `conic-gradient(#28A868 ${stats.completionRate.value * 3.6}deg, #F0EBE3 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A2E' }}>{stats.completionRate.value}%</span>
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

         
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KpiCard({ icon, value, label, trend, trendLabel, color }) {
  const isPositive = trend?.includes('+') || trend?.includes('No change') || false;
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
        fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: 1, marginBottom: 4,
      }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#6B6577', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
        {label}
      </div>
      {trend && trendLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11, color: isPositive ? '#28A868' : '#C03058',
            fontWeight: 500,
          }}>{trend}</span>
          <span style={{ fontSize: 11, color: '#9880B0' }}>{trendLabel}</span>
        </div>
      )}
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
    // Clear auth data from storage
    localStorage.removeItem('sapi_token');
    localStorage.removeItem('sapi_current_user');
    sessionStorage.removeItem('sapi_token');
    
    // Redirect to login page
    window.location.href = '/login';
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
