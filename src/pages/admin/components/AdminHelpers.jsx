// ============================================================
// SHARED HELPERS FOR ADMIN COMPONENTS
// ============================================================

// Common Font Classes - Use these consistently across all admin pages
export const FONT_CLASSES = {
  // Page headings (titles, h1)
  heading: 'font-serif text-[#1A1A2E]',
  // Body text (paragraphs, labels)
  body: 'font-sans text-[#1A1A2E]',
  // Secondary/muted text
  muted: 'font-sans text-[#6B6577]',
  // Labels, badges, pills
  label: 'font-sans text-[#6B6577] uppercase tracking-wider text-xs font-medium',
  // Score numbers
  score: 'font-serif',
  // Table headers
  tableHeader: 'font-sans text-[#6B6577] uppercase tracking-wider text-[11px] font-medium',
  // Buttons
  button: 'font-sans tracking-wide',
  // Page container base
  pageContainer: 'font-sans'
};

// Tier color mapping
export const tierColor = (tier) => ({
  'Sovereign AI Leader': '#28A868',
  'Advanced': '#4A7AE0',
  'Developing': '#F0C050',
  'Nascent': '#C9963A',
  'Pre-conditions Unmet': '#C03058'
}[tier] || '#9880B0');

// Score color mapping
export const scoreColor = (s) => s >= 70 ? '#4A7AE0' : s >= 55 ? '#D4A830' : s >= 40 ? '#C9963A' : '#C03058';

// Stage color mapping
export const stageColor = (stage) => ({
  'New': '#9880B0',
  'Contacted': '#4A7AE0',
  'Proposal Sent': '#D4A830',
  'Won': '#28A868',
  'Lost': '#C03058'
}[stage] || '#9880B0');

// Band label and color helpers
export const bandLabel = (s) => s >= 65 ? 'High' : s >= 40 ? 'Medium' : 'Low';
export const bandColor = (s) => s >= 65 ? '#28A868' : s >= 40 ? '#D4A830' : '#C03058';
export const qScoreColor = (s) => s >= 75 ? '#28A868' : s >= 50 ? '#D4A830' : '#C03058';

// Truncate string helper
export const truncMin = (str, n) => str && str.length > n ? str.slice(0, n) + '...' : (str || '');

// Shorten country names
export const shortCountry = (name) =>
  name
    .replace('Republic of ', '')
    .replace('Federal Republic of ', '')
    .replace('Kingdom of ', '')
    .replace('United Arab Emirates', 'UAE');

// Format date from API
export const fmtDate = (iso) => {
  if (typeof iso === 'string' && iso.includes('/')) {
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

  const date = new Date(iso);
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = date.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' });
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

// Format created_at with AM/PM
export const formatCreatedAt = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-';

  if (typeof dateStr === 'string' && dateStr.includes('/')) {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours24, minutes, seconds] = timePart.split(':');

    const hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    return `${day}/${month}/${year} ${hours12}:${minutes}:${seconds} ${ampm}`;
  }

  return dateStr;
};

// Get auth token
export const getAuthToken = () => localStorage.getItem('sapi_token') || sessionStorage.getItem('sapi_token');

// Transform API assessment to component format
export const transformAssessment = (assessment) => ({
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

// ============================================================
// SVG FLAG COMPONENTS
// ============================================================

export const GhanaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="5.33" fill="#CE1126"/>
    <rect y="5.33" width="24" height="5.33" fill="#FCD116"/>
    <rect y="10.67" width="24" height="5.33" fill="#006B3F"/>
    <polygon points="12,6.5 13.5,9.5 10.5,9.5" fill="#000"/>
  </svg>
);

export const IndiaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="5.33" fill="#FF9932"/>
    <rect y="5.33" width="24" height="5.33" fill="#FFFFFF"/>
    <rect y="10.67" width="24" height="5.33" fill="#138808"/>
    <circle cx="12" cy="8" r="2" fill="#000080" stroke="#000080" strokeWidth="0.3"/>
  </svg>
);

export const RwandaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="8" fill="#00A1DE"/>
    <rect y="8" width="24" height="8" fill="#FAD201"/>
    <rect y="12" width="24" height="4" fill="#00A1DE"/>
    <circle cx="8" cy="5" r="2" fill="#E5BE01"/>
  </svg>
);

export const UAEFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="6" height="16" fill="#FF0000"/>
    <rect x="6" width="18" height="5.33" fill="#00732F"/>
    <rect x="6" y="5.33" width="18" height="5.33" fill="#FFFFFF"/>
    <rect x="6" y="10.67" width="18" height="5.33" fill="#000000"/>
  </svg>
);

export const KenyaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="4" fill="#000000"/>
    <rect y="4" width="24" height="1" fill="#FFFFFF"/>
    <rect y="5" width="24" height="6" fill="#CE1126"/>
    <rect y="11" width="24" height="1" fill="#FFFFFF"/>
    <rect y="12" width="24" height="4" fill="#006600"/>
    <circle cx="12" cy="8" r="2.5" fill="#000"/>
  </svg>
);

export const UnitedKingdomFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="2"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.2"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#FFFFFF" strokeWidth="3"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="1.8"/>
  </svg>
);

export const AzerbaijanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="5.33" fill="#0092C6"/>
    <rect y="5.33" width="24" height="5.33" fill="#DA2D2D"/>
    <rect y="10.67" width="24" height="5.33" fill="#00C6A0"/>
    <circle cx="12" cy="8" r="2.5" fill="#FFFFFF"/>
    <path d="M12 8 L14 7.5 L13.5 8.5 Z" fill="#FFFFFF"/>
  </svg>
);

export const KazakhstanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#00AFCA"/>
    <circle cx="6" cy="8" r="2.5" fill="#FEC50C"/>
    <path d="M9 6 L10 8 L9 10" stroke="#FEC50C" strokeWidth="0.8" fill="none"/>
  </svg>
);

export const QatarFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#8B1C3D"/>
    <rect width="6" height="16" fill="#FFFFFF"/>
    <path d="M6 0 L10 2 L6 4 L10 6 L6 8 L10 10 L6 12 L10 14 L6 16" fill="#FFFFFF"/>
  </svg>
);

export const NigeriaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="8" height="16" fill="#008751"/>
    <rect x="8" width="8" height="16" fill="#FFFFFF"/>
    <rect x="16" width="8" height="16" fill="#008751"/>
  </svg>
);

export const SingaporeFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="8" fill="#ED2939"/>
    <rect y="8" width="24" height="8" fill="#FFFFFF"/>
    <circle cx="6" cy="5" r="2.5" fill="#FFFFFF"/>
    <polygon points="6,3 7,4 6.5,4.5" fill="#FFFFFF"/>
  </svg>
);

export const SaudiArabiaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#006C35"/>
    <text x="12" y="10" fontSize="8" fill="#FFFFFF" textAnchor="middle">لا إله</text>
  </svg>
);

export const countryFlagComponents = {
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
