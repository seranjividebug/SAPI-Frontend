import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SapiA1AdminDashboard from "./SAPI_A1_AdminDashboard";

/* eslint-disable no-unused-vars */
const DEMO_SUBMISSIONS = [
  { id:"sub_001", country:"Kingdom of Saudi Arabia", respondentName:"H.E. Faisal Al-Ibrahim", title:"Minister of Economy and Planning", ministry:"Ministry of Economy and Planning", email:"f.alibrahim@mep.gov.sa", developmentStage:"Advanced", completedAt:"2026-03-14T09:22:00Z", compositeScore:71.4, tier:"Advanced", scores:{compute:78,capital:82,regulatory:65,data:60,di:68}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"High-value lead. Minister attended SAPI launch event.", leadStage:"Proposal Sent" },
  { id:"sub_002", country:"Republic of Singapore", respondentName:"Dr. Janice Tan", title:"Deputy Secretary, Smart Nation", ministry:"Smart Nation and Digital Government Office", email:"janice_tan@smartnation.gov.sg", developmentStage:"Leading", completedAt:"2026-03-15T14:05:00Z", compositeScore:83.2, tier:"Sovereign AI Leader", scores:{compute:85,capital:88,regulatory:90,data:80,di:78}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_003", country:"Federal Republic of Nigeria", respondentName:"Hon. Bosun Tijani", title:"Minister of Communications, Innovation and Digital Economy", ministry:"Federal Ministry of Communications", email:"minister@fmcide.gov.ng", developmentStage:"Developing", completedAt:"2026-03-17T11:30:00Z", compositeScore:38.6, tier:"Nascent", scores:{compute:28,capital:35,regulatory:42,data:30,di:45}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Introduced via GIZ partnership.", leadStage:"Contacted" },
  { id:"sub_004", country:"Republic of Kenya", respondentName:"Eliud Owalo", title:"Cabinet Secretary, Information & Digital Economy", ministry:"Ministry of Information, Communications and Digital Economy", email:"cs@ict.go.ke", developmentStage:"Emerging", completedAt:"2026-03-18T08:14:00Z", compositeScore:29.1, tier:"Nascent", scores:{compute:22,capital:28,regulatory:35,data:25,di:32}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_005", country:"United Arab Emirates", respondentName:"H.E. Omar Al Olama", title:"Minister of State for Artificial Intelligence", ministry:"Ministry of AI, Digital Economy and Remote Work Applications", email:"minister.ai@uaecabinet.ae", developmentStage:"Leading", completedAt:"2026-03-19T10:00:00Z", compositeScore:78.9, tier:"Advanced", scores:{compute:85,capital:88,regulatory:75,data:72,di:70}, upgradeStatus:"requested", requestedTier:"Tier 3", adminNotes:"Priority account. Met Asim at WEF Davos.", leadStage:"Won" },
  { id:"sub_006", country:"Republic of Rwanda", respondentName:"Paula Ingabire", title:"Minister of ICT and Innovation", ministry:"Ministry of ICT and Innovation", email:"minister@minict.gov.rw", developmentStage:"Developing", completedAt:"2026-03-20T13:45:00Z", compositeScore:46.3, tier:"Developing", scores:{compute:40,capital:42,regulatory:55,data:38,di:50}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_007", country:"Republic of India", respondentName:"Sh. S. Krishnan", title:"Secretary, Ministry of Electronics and Information Technology", ministry:"MeitY", email:"secretary@meity.gov.in", developmentStage:"Advanced", completedAt:"2026-03-21T07:30:00Z", compositeScore:62.7, tier:"Advanced", scores:{compute:65,capital:70,regulatory:68,data:52,di:58}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Referred via UK FCDO digital programme.", leadStage:"Contacted" },
  { id:"sub_008", country:"Republic of Ghana", respondentName:"Ursula Owusu-Ekuful", title:"Minister for Communications and Digitalisation", ministry:"Ministry of Communications and Digitalisation", email:"minister@moc.gov.gh", developmentStage:"Emerging", completedAt:"2026-03-22T15:10:00Z", compositeScore:33.4, tier:"Nascent", scores:{compute:28,capital:30,regulatory:40,data:28,di:36}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
];

const DEMO_USERS = [
  { id:"u1", name:"Asim Razvi", email:"asim@sovereignaipowerindex.com", role:"Super Admin", lastLogin:"2026-03-22" },
  { id:"u2", name:"Sarah Mitchell", email:"sarah@sovereignaipowerindex.com", role:"Analyst", lastLogin:"2026-03-21" },
  { id:"u3", name:"James Okafor", email:"james@sovereignaipowerindex.com", role:"Viewer", lastLogin:"2026-03-18" },
];

const AUDIT_LOG = [
  { id:1, text:"Login", actor:"asim@sovereignaipowerindex.com", date:"22 Mar 2026 10:14" },
  { id:2, text:"Lead stage updated: UAE → Won", actor:"asim@sovereignaipowerindex.com", date:"21 Mar 2026 16:32" },
  { id:3, text:"Admin note added: sub_001", actor:"sarah@sovereignaipowerindex.com", date:"20 Mar 2026 09:45" },
  { id:4, text:"Login", actor:"sarah@sovereignaipowerindex.com", date:"20 Mar 2026 09:40" },
  { id:5, text:"Login", actor:"james@sovereignaipowerindex.com", date:"18 Mar 2026 14:22" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const tierColor = (tier) => ({
  'Sovereign AI Leader': '#28A868',
  'Advanced': '#4A7AE0',
  'Developing': '#F0C050',
  'Nascent': '#C9963A',
  'Pre-conditions Unmet': '#C03058',
}[tier] || '#9880B0');

const stageColor = (stage) => ({
  'New': '#9880B0',
  'Contacted': '#4A7AE0',
  'Proposal Sent': '#F0C050',
  'Won': '#28A868',
  'Lost': '#C03058',
}[stage] || '#9880B0');

// ─── Inline styles ────────────────────────────────────────────────────────────
const S = {
  // Layout
  appWrap:  { display:'flex', height:'100vh', fontFamily:"'system-ui',sans-serif", overflow:'hidden' },
  // Sidebar
  sidebar: { width:220, minWidth:220, background:'#0F0830', display:'flex', flexDirection:'column', borderRight:'1px solid rgba(201,150,58,0.15)', zIndex:10 },
  sidebarTop: { padding:'24px 20px 20px', borderBottom:'1px solid rgba(201,150,58,0.1)' },
  sidebarLogo: { display:'flex', alignItems:'center', gap:10, marginBottom:4 },
  sidebarWordmark: { color:'#EDD98A', fontFamily:"Georgia, serif", fontSize:13, letterSpacing:'0.08em', fontWeight:400 },
  sidebarSubmark: { color:'#9880B0', fontSize:10, letterSpacing:'0.05em', marginTop:2 },
  navList: { listStyle:'none', margin:'12px 0 0', padding:0 },
  navItem: (active) => ({
    display:'flex', alignItems:'center', gap:10,
    padding:'10px 20px', cursor:'pointer', position:'relative',
    color: active ? '#EDD98A' : '#FBF5E6',
    background: active ? '#1A1540' : 'transparent',
    fontSize:13, letterSpacing:'0.02em',
    borderLeft: active ? '3px solid #C9963A' : '3px solid transparent',
    transition:'all 0.15s',
  }),
  sidebarBottom: { marginTop:'auto', padding:'16px 20px', borderTop:'1px solid rgba(201,150,58,0.1)' },
  sidebarEmail: { color:'#9880B0', fontSize:11, marginBottom:8, wordBreak:'break-all' },
  signOutBtn: { background:'none', border:'1px solid rgba(201,150,58,0.3)', color:'#EDD98A', padding:'6px 14px', borderRadius:4, cursor:'pointer', fontSize:12, width:'100%', letterSpacing:'0.05em' },
  // Main content
  main: { flex:1, background:'#F7F4EF', overflowY:'auto', display:'flex', flexDirection:'column' },
  topbar: { background:'#fff', borderBottom:'1px solid #E0D8CC', padding:'0 28px', display:'flex', alignItems:'center', height:52, justifyContent:'space-between', flexShrink:0 },
  topbarTitle: { color:'#1A1A2E', fontSize:14, fontWeight:500, letterSpacing:'0.03em' },
  topbarBadge: { background:'rgba(201,150,58,0.1)', color:'#C9963A', fontSize:11, padding:'3px 10px', borderRadius:10, border:'1px solid rgba(201,150,58,0.2)', letterSpacing:'0.04em' },
  content: { padding:'28px', flex:1 },
  pageHeader: { marginBottom:24 },
  pageTitle: { color:'#1A1A2E', fontSize:20, fontWeight:600, margin:0, letterSpacing:'-0.01em' },
  pageSubtitle: { color:'#6B6577', fontSize:13, marginTop:4 },
  // Cards
  card: { background:'#fff', border:'0.5px solid #E0D8CC', borderRadius:8, padding:'20px 24px', marginBottom:20 },
  cardTitle: { color:'#1A1A2E', fontSize:14, fontWeight:600, marginBottom:14, letterSpacing:'0.01em' },
  // Tables
  table: { width:'100%', borderCollapse:'collapse', fontSize:13 },
  thead: { background:'#F0EBE3' },
  th: { padding:'10px 14px', color:'#1A1A2E', fontWeight:600, textAlign:'left', fontSize:12, letterSpacing:'0.04em', textTransform:'uppercase' },
  td: { padding:'11px 14px', color:'#1A1A2E', borderBottom:'1px solid #F0EBE3', verticalAlign:'middle' },
  // Badges / pills
  pill: (color) => ({ display:'inline-block', background:color+'22', color:color, border:`1px solid ${color}44`, borderRadius:20, padding:'2px 10px', fontSize:11, fontWeight:600, letterSpacing:'0.04em', whiteSpace:'nowrap' }),
  // Buttons
  btnGold: { background:'#C9963A', color:'#06030E', border:'none', borderRadius:4, padding:'9px 18px', fontSize:12, fontWeight:600, letterSpacing:'0.06em', cursor:'pointer', textTransform:'uppercase' },
  btnOutlineGold: { background:'transparent', color:'#C9963A', border:'1px solid #C9963A', borderRadius:4, padding:'8px 16px', fontSize:12, fontWeight:600, letterSpacing:'0.06em', cursor:'pointer', textTransform:'uppercase' },
  btnIcon: { background:'none', border:'none', cursor:'pointer', padding:'4px 8px', borderRadius:4, color:'#6B6577', fontSize:14, transition:'color 0.15s' },
  // Toast
  toast: { position:'fixed', bottom:28, right:28, background:'#1A1A2E', color:'#EDD98A', padding:'12px 22px', borderRadius:6, fontSize:13, letterSpacing:'0.03em', boxShadow:'0 4px 20px rgba(0,0,0,0.3)', zIndex:1000, border:'1px solid rgba(201,150,58,0.3)', animation:'fadeIn 0.2s' },
  // Audit log
  auditRow: { display:'flex', gap:12, padding:'9px 0', borderBottom:'1px solid #F0EBE3', alignItems:'flex-start', fontSize:12 },
  auditDot: { width:6, height:6, borderRadius:'50%', background:'#C9963A', marginTop:5, flexShrink:0 },
};

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const GlobeIcon = ({ size=28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke="#C9963A" strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="8" ry="18" stroke="#C9963A" strokeWidth="1.5"/>
    <line x1="6" y1="24" x2="42" y2="24" stroke="#C9963A" strokeWidth="1.5"/>
    <path d="M10 16 Q24 20 38 16" stroke="#C9963A" strokeWidth="1" fill="none"/>
    <path d="M10 32 Q24 28 38 32" stroke="#C9963A" strokeWidth="1" fill="none"/>
    <circle cx="24" cy="24" r="2.5" fill="#EDD98A"/>
    <circle cx="24" cy="8" r="1.5" fill="#C9963A" opacity="0.6"/>
    <circle cx="24" cy="40" r="1.5" fill="#C9963A" opacity="0.6"/>
    <circle cx="6" cy="24" r="1.5" fill="#C9963A" opacity="0.6"/>
    <circle cx="42" cy="24" r="1.5" fill="#C9963A" opacity="0.6"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9963A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError('');
    if (!email || !password) { setError('Please enter your credentials.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@sapi.ai' && password === 'SAPI2026admin') {
        onLogin();
      } else {
        setError('Invalid credentials. Access denied.');
      }
    }, 700);
  };

  const inputStyle = (focused) => ({
    width:'100%', background:'#1A1540', border:`1px solid ${focused ? '#C9963A' : 'rgba(201,150,58,0.2)'}`,
    borderRadius:4, padding:'11px 14px', color:'#FBF5E6', fontSize:13,
    outline:'none', boxSizing:'border-box', letterSpacing:'0.02em',
    transition:'border-color 0.2s', fontFamily:'system-ui, sans-serif',
  });

  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#06030E', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
      {/* Subtle radial glow */}
      <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, background:'radial-gradient(ellipse, rgba(201,150,58,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
      {/* Grid lines decoration */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(201,150,58,0.03) 1px, transparent 1px),linear-gradient(90deg,rgba(201,150,58,0.03) 1px,transparent 1px)', backgroundSize:'48px 48px', pointerEvents:'none' }}/>

      <div style={{ width:'100%', maxWidth:420, padding:'0 16px', position:'relative', zIndex:1 }}>
        {/* Card */}
        <div style={{ background:'#0F0830', border:'1px solid rgba(201,150,58,0.2)', borderRadius:8, padding:'40px 36px 32px', boxShadow:'0 24px 60px rgba(0,0,0,0.5)' }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <GlobeIcon size={48}/>
            <div style={{ marginTop:16, color:'#FBF5E6', fontFamily:'Georgia,serif', fontSize:18, letterSpacing:'0.15em', textTransform:'uppercase' }}>Admin Portal</div>
            <div style={{ color:'#9880B0', fontSize:11, marginTop:6, letterSpacing:'0.06em' }}>SOVEREIGN AI POWER INDEX — RESTRICTED ACCESS</div>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(201,150,58,0.3),transparent)', marginBottom:28 }}/>

          {/* Form */}
          <div style={{ marginBottom:16 }}>
            <div style={{ color:'#9880B0', fontSize:11, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:6 }}>Email Address</div>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              onFocus={()=>setEmailFocus(true)} onBlur={()=>setEmailFocus(false)}
              onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
              style={inputStyle(emailFocus)}/>
          </div>
          <div style={{ marginBottom:24 }}>
            <div style={{ color:'#9880B0', fontSize:11, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:6 }}>Password</div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              onFocus={()=>setPwFocus(true)} onBlur={()=>setPwFocus(false)}
              onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
              style={inputStyle(pwFocus)}/>
          </div>

          {error && (
            <div style={{ color:'#C03058', fontSize:12, marginBottom:16, padding:'9px 14px', background:'rgba(192,48,88,0.08)', border:'1px solid rgba(192,48,88,0.2)', borderRadius:4, letterSpacing:'0.02em' }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ ...S.btnGold, width:'100%', padding:'12px', fontSize:12, opacity:loading?0.7:1, position:'relative' }}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>

          <div style={{ marginTop:20, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <ShieldIcon/>
            <span style={{ color:'#6B6577', fontSize:11, letterSpacing:'0.04em' }}>Secured access — authorised personnel only</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', color:'#6B6577', fontSize:10, marginTop:20, letterSpacing:'0.05em' }}>
          © 2026 THE SOVEREIGN AI POWER INDEX. AUTHORISED ACCESS ONLY.
        </div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function SAPIAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => { setIsAuthenticated(true); navigate('/admindashboard'); }} />;
  }

  return <SapiA1AdminDashboard />;
}
