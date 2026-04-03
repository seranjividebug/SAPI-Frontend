import { useState } from "react";

// =============================================================
// SEED DATA
// =============================================================
const DEMO_SUBMISSIONS_INIT = [
  { id:"sub_001", country:"Kingdom of Saudi Arabia", respondentName:"H.E. Faisal Al-Ibrahim", title:"Minister of Economy and Planning", ministry:"Ministry of Economy and Planning", email:"f.alibrahim@mep.gov.sa", developmentStage:"Advanced", completedAt:"2026-03-14T09:22:00Z", compositeScore:71.4, tier:"Advanced", scores:{compute:78,capital:82,regulatory:65,data:60,di:68}, answers:{q1:95,q2:70,q3:90,q4:75,q5:75,q6:95,q7:90,q8:65,q9:90,q10:95,q11:60,q12:90,q13:60,q14:65,q15:60,q16:25,q17:65,q18:60,q19:65,q20:70,q21:65,q22:65,q23:65,q24:35,q25:90,q26:60,q27:55,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"High-value lead. Minister attended SAPI launch event.", leadStage:"Proposal Sent" },
  { id:"sub_002", country:"Republic of Singapore", respondentName:"Dr. Janice Tan", title:"Deputy Secretary, Smart Nation", ministry:"Smart Nation and Digital Government Office", email:"janice_tan@smartnation.gov.sg", developmentStage:"Leading", completedAt:"2026-03-15T14:05:00Z", compositeScore:83.2, tier:"Sovereign AI Leader", scores:{compute:85,capital:88,regulatory:90,data:80,di:78}, answers:{q1:95,q2:95,q3:90,q4:75,q5:95,q6:95,q7:90,q8:95,q9:90,q10:95,q11:95,q12:90,q13:90,q14:90,q15:90,q16:90,q17:90,q18:90,q19:90,q20:95,q21:90,q22:90,q23:65,q24:65,q25:90,q26:90,q27:90,q28:55,q29:55,q30:60}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_003", country:"Federal Republic of Nigeria", respondentName:"Hon. Bosun Tijani", title:"Minister of Communications, Innovation and Digital Economy", ministry:"Federal Ministry of Communications", email:"minister@fmcide.gov.ng", developmentStage:"Developing", completedAt:"2026-03-17T11:30:00Z", compositeScore:38.6, tier:"Nascent", scores:{compute:28,capital:35,regulatory:42,data:30,di:45}, answers:{q1:25,q2:15,q3:35,q4:30,q5:25,q6:45,q7:25,q8:35,q9:30,q10:40,q11:35,q12:60,q13:30,q14:40,q15:30,q16:25,q17:35,q18:30,q19:35,q20:40,q21:40,q22:30,q23:35,q24:10,q25:65,q26:30,q27:30,q28:25,q29:25,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Introduced via GIZ partnership.", leadStage:"Contacted" },
  { id:"sub_004", country:"Republic of Kenya", respondentName:"Eliud Owalo", title:"Cabinet Secretary, Information & Digital Economy", ministry:"Ministry of Information, Communications and Digital Economy", email:"cs@ict.go.ke", developmentStage:"Emerging", completedAt:"2026-03-18T08:14:00Z", compositeScore:29.1, tier:"Nascent", scores:{compute:22,capital:28,regulatory:35,data:25,di:32}, answers:{q1:25,q2:15,q3:10,q4:30,q5:25,q6:20,q7:25,q8:10,q9:30,q10:40,q11:10,q12:30,q13:30,q14:40,q15:30,q16:25,q17:35,q18:30,q19:10,q20:15,q21:40,q22:30,q23:35,q24:10,q25:35,q26:30,q27:30,q28:25,q29:25,q30:30}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_005", country:"United Arab Emirates", respondentName:"H.E. Omar Al Olama", title:"Minister of State for Artificial Intelligence", ministry:"Ministry of AI, Digital Economy and Remote Work Applications", email:"minister.ai@uaecabinet.ae", developmentStage:"Leading", completedAt:"2026-03-19T10:00:00Z", compositeScore:78.9, tier:"Advanced", scores:{compute:85,capital:88,regulatory:75,data:72,di:70}, answers:{q1:95,q2:95,q3:90,q4:75,q5:95,q6:95,q7:90,q8:65,q9:60,q10:95,q11:95,q12:90,q13:60,q14:65,q15:60,q16:60,q17:65,q18:60,q19:65,q20:70,q21:65,q22:65,q23:65,q24:65,q25:65,q26:60,q27:90,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 3", adminNotes:"Priority account. Met Asim at WEF Davos.", leadStage:"Won" },
  { id:"sub_006", country:"Republic of Rwanda", respondentName:"Paula Ingabire", title:"Minister of ICT and Innovation", ministry:"Ministry of ICT and Innovation", email:"minister@minict.gov.rw", developmentStage:"Developing", completedAt:"2026-03-20T13:45:00Z", compositeScore:46.3, tier:"Developing", scores:{compute:40,capital:42,regulatory:55,data:38,di:50}, answers:{q1:50,q2:40,q3:35,q4:30,q5:50,q6:45,q7:25,q8:35,q9:60,q10:40,q11:35,q12:60,q13:60,q14:40,q15:60,q16:25,q17:65,q18:30,q19:35,q20:40,q21:40,q22:30,q23:35,q24:35,q25:65,q26:30,q27:55,q28:55,q29:25,q30:60}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_007", country:"Republic of India", respondentName:"Sh. S. Krishnan", title:"Secretary, Ministry of Electronics and Information Technology", ministry:"MeitY", email:"secretary@meity.gov.in", developmentStage:"Advanced", completedAt:"2026-03-21T07:30:00Z", compositeScore:62.7, tier:"Advanced", scores:{compute:65,capital:70,regulatory:68,data:52,di:58}, answers:{q1:75,q2:70,q3:65,q4:50,q5:50,q6:70,q7:55,q8:65,q9:60,q10:70,q11:60,q12:90,q13:60,q14:65,q15:60,q16:60,q17:65,q18:60,q19:65,q20:40,q21:65,q22:65,q23:65,q24:35,q25:65,q26:60,q27:55,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Referred via UK FCDO digital programme.", leadStage:"Contacted" },
  { id:"sub_008", country:"Republic of Ghana", respondentName:"Ursula Owusu-Ekuful", title:"Minister for Communications and Digitalisation", ministry:"Ministry of Communications and Digitalisation", email:"minister@moc.gov.gh", developmentStage:"Emerging", completedAt:"2026-03-22T15:10:00Z", compositeScore:33.4, tier:"Nascent", scores:{compute:28,capital:30,regulatory:40,data:28,di:36}, answers:{q1:25,q2:15,q3:35,q4:30,q5:25,q6:20,q7:25,q8:35,q9:30,q10:40,q11:10,q12:30,q13:30,q14:40,q15:30,q16:25,q17:35,q18:30,q19:35,q20:15,q21:40,q22:30,q23:35,q24:10,q25:35,q26:30,q27:30,q28:25,q29:25,q30:30}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
];

// =============================================================
// QUESTION BANK — all 30 questions with reverse-mappable options
// =============================================================
const QUESTION_BANK = [
  // ── D1: Compute Capacity (Q1–Q6) ─────────────────────────
  { id:"q1", dim:"d1", text:"What best describes your nation's sovereign AI compute infrastructure?",
    options:[{score:95,label:"Sovereign-scale compute operational — nationally owned GPU clusters and AI-optimised data centres in production"},{score:75,label:"Substantial capacity — significant AI compute assets with majority sovereign ownership"},{score:50,label:"Developing capacity — mixed public/private compute primarily reliant on commercial cloud"},{score:25,label:"Pre-conditions unmet — no dedicated sovereign AI compute infrastructure in place"}]},
  { id:"q2", dim:"d1", text:"What is the status of your nation's sovereign data centre infrastructure?",
    options:[{score:95,label:"Multiple sovereign data centres operational with AI-grade connectivity, redundancy, and power capacity"},{score:70,label:"At least one sovereign data centre operational; expansion programme approved and underway"},{score:40,label:"Government workloads hosted in third-party or co-located facilities; sovereignty limited"},{score:15,label:"No sovereign data centre infrastructure exists or is under active development"}]},
  { id:"q3", dim:"d1", text:"How does your nation manage semiconductor access and strategic AI chip supply?",
    options:[{score:90,label:"Formal bilateral supply agreements and strategic reserves in place; active domestic semiconductor programme"},{score:65,label:"Preferential procurement arrangements with major chip suppliers; partial supply chain resilience"},{score:35,label:"Ad hoc procurement with no formal supply chain strategy or resilience planning"},{score:10,label:"No strategy — fully exposed to global semiconductor supply constraints and export controls"}]},
  { id:"q4", dim:"d1", text:"How is national AI infrastructure investment funded?",
    options:[{score:75,label:"Dedicated sovereign AI infrastructure fund with multi-year capital commitment and governance framework"},{score:50,label:"Ring-fenced line-item budget allocations within existing ministry frameworks"},{score:30,label:"Project-by-project approval; no standing AI infrastructure budget"},{score:10,label:"No public investment — infrastructure reliant entirely on private sector provision"}]},
  { id:"q5", dim:"d1", text:"What is the maturity of your national AI cloud and hybrid infrastructure strategy?",
    options:[{score:95,label:"National sovereign cloud operational with dedicated AI workload layer and hybrid multi-cloud capability"},{score:75,label:"National cloud programme underway with approved AI infrastructure roadmap"},{score:50,label:"Government cloud strategy exists but lacks AI-specific infrastructure planning"},{score:25,label:"No national cloud strategy — ministries procure infrastructure independently"}]},
  { id:"q6", dim:"d1", text:"How does your nation address power and cooling infrastructure requirements for AI compute?",
    options:[{score:95,label:"Dedicated AI compute power zones with renewable energy commitments and purpose-built cooling infrastructure"},{score:70,label:"Power infrastructure planning for AI underway; partial renewable integration in progress"},{score:45,label:"General data centre power planning exists; no AI-specific energy or cooling strategy"},{score:20,label:"Power infrastructure constraints are an active barrier to AI compute deployment"}]},

  // ── D2: Capital Formation (Q7–Q12) ───────────────────────
  { id:"q7", dim:"d2", text:"What is the scale of dedicated public AI investment as a share of GDP?",
    options:[{score:90,label:"Significant public AI investment (>0.3% GDP) with multi-year budget commitment and performance targets"},{score:55,label:"Moderate investment (0.1–0.3% GDP) through targeted sector programmes"},{score:25,label:"Limited AI budget (<0.1% GDP) primarily through existing ministry allocations"},{score:10,label:"No identifiable AI-specific public investment line"}]},
  { id:"q8", dim:"d2", text:"How active is private sector AI investment in your national economy?",
    options:[{score:95,label:"Vibrant private AI ecosystem — active VC market, scaled domestic AI companies, and corporate R&D programmes"},{score:65,label:"Growing private sector AI investment with active startup activity and emerging corporate programmes"},{score:35,label:"Nascent private investment — limited VC activity, few scaled domestic AI companies"},{score:10,label:"Private AI investment is negligible or primarily controlled by foreign-owned entities"}]},
  { id:"q9", dim:"d2", text:"Does your nation operate a dedicated sovereign AI investment or development fund?",
    options:[{score:90,label:"Sovereign AI fund operational with active deployment mandate, governance, and measurable portfolio"},{score:60,label:"Sovereign technology fund exists with AI as a significant but not primary mandate"},{score:30,label:"Fund proposal or feasibility study underway; no operational vehicle"},{score:10,label:"No sovereign AI investment fund or equivalent mechanism in place"}]},
  { id:"q10", dim:"d2", text:"What is the maturity of your domestic AI startup and venture ecosystem?",
    options:[{score:95,label:"Established ecosystem with scaled AI companies, active Series B+ funding, international exits, and accelerator networks"},{score:70,label:"Developing ecosystem with active early-stage funding and growing accelerator and incubator programmes"},{score:40,label:"Early-stage — few AI startups, limited local VC, no notable scaled domestic companies"},{score:15,label:"Ecosystem pre-conditions absent — no meaningful domestic AI startup activity"}]},
  { id:"q11", dim:"d2", text:"How does your nation attract and retain foreign AI investment?",
    options:[{score:95,label:"Competitive AI investment incentive regime — free zone structures, tax frameworks, and anchor investor programmes"},{score:60,label:"General FDI incentives apply to AI; sector-specific benefits under active development"},{score:35,label:"No AI-specific investment attraction strategy; reliant on general economy positioning"},{score:10,label:"Structural barriers to foreign AI investment — regulatory, currency, or legal constraints exist"}]},
  { id:"q12", dim:"d2", text:"What is the status of public-private partnership frameworks for national AI development?",
    options:[{score:90,label:"Formal AI PPP framework operational with active joint ventures, co-investment structures, and shared IP arrangements"},{score:60,label:"PPP framework exists; some AI-focused partnerships at ministry or agency level"},{score:30,label:"Ad hoc collaboration only — no formal AI PPP framework or structured pipeline"},{score:10,label:"No meaningful public-private collaboration on AI infrastructure or capability development"}]},

  // ── D3: Regulatory Readiness (Q13–Q18) ───────────────────
  { id:"q13", dim:"d3", text:"What is the status of AI-specific legislation or regulatory frameworks in your nation?",
    options:[{score:90,label:"Comprehensive AI law enacted and in force with sector-specific implementing regulations"},{score:60,label:"AI regulation in draft or parliamentary process; interim guidance issued to industry"},{score:30,label:"AI addressed within broader digital or data laws; no standalone AI regulation"},{score:10,label:"No AI regulatory framework exists or is planned"}]},
  { id:"q14", dim:"d3", text:"What is the maturity of your national data protection and privacy framework?",
    options:[{score:90,label:"Comprehensive data protection law enacted with independent supervisory authority and enforcement record"},{score:65,label:"Data protection legislation in place with a designated authority; enforcement capability developing"},{score:40,label:"Partial framework — privacy provisions within broader legislation; no dedicated supervisory authority"},{score:15,label:"No data protection framework; personal data governance absent or unenforceable"}]},
  { id:"q15", dim:"d3", text:"How does your nation approach AI safety, ethics, and risk governance?",
    options:[{score:90,label:"National AI ethics framework adopted with mandatory impact assessments for high-risk AI systems"},{score:60,label:"AI ethics guidelines published; voluntary adoption with sector pilot programmes underway"},{score:30,label:"Principles-level commitments only; no operational AI safety or risk governance mechanisms"},{score:10,label:"No AI safety, ethics, or risk governance framework exists"}]},
  { id:"q16", dim:"d3", text:"Is there a designated national AI regulatory or oversight authority?",
    options:[{score:90,label:"Dedicated AI regulatory authority established with statutory powers, enforcement mandate, and budget"},{score:60,label:"AI oversight function sits within an existing ministry or agency with dedicated remit and staffing"},{score:25,label:"AI policy coordination exists informally across ministries; no designated authority"},{score:10,label:"No AI regulatory or oversight function exists"}]},
  { id:"q17", dim:"d3", text:"What is the status of your national digital identity and authentication infrastructure?",
    options:[{score:90,label:"National digital identity system operational at population scale with high adoption and AI integration"},{score:65,label:"Digital identity infrastructure deployed with significant adoption; interoperability across services developing"},{score:35,label:"Digital identity programme underway; limited to government services with low citizen penetration"},{score:10,label:"No national digital identity infrastructure; paper-based systems predominate"}]},
  { id:"q18", dim:"d3", text:"How does your nation engage in international AI governance and standards-setting?",
    options:[{score:90,label:"Active leadership role in multilateral AI governance (GPAI, G7/G20 AI, ISO/IEC); actively shaping global norms"},{score:60,label:"Regular participation in international AI governance forums; adopts international standards"},{score:30,label:"Observer-level engagement only; limited active contribution to international AI governance bodies"},{score:10,label:"No meaningful engagement in international AI governance or standards processes"}]},

  // ── D4: Data Sovereignty (Q19–Q24) ───────────────────────
  { id:"q19", dim:"d4", text:"Does your nation mandate data localisation for government AI workloads?",
    options:[{score:90,label:"Mandatory data localisation enforced for all government AI workloads with active compliance regime"},{score:65,label:"Localisation required for sensitive and classified data; general workloads subject to ministerial review"},{score:35,label:"Voluntary guidance on data localisation; no legal mandate"},{score:10,label:"No data localisation requirements; government data routinely processed offshore"}]},
  { id:"q20", dim:"d4", text:"What is the maturity of your national data exchange and interoperability framework?",
    options:[{score:95,label:"National data exchange platform operational across all major government agencies using open standards"},{score:70,label:"Government data interoperability framework in place; cross-agency sharing operational in key domains"},{score:40,label:"Pilot interoperability programmes underway; siloed data remains the norm across most ministries"},{score:15,label:"No data interoperability framework; each ministry operates independently"}]},
  { id:"q21", dim:"d4", text:"How does your nation govern cross-border data flows for AI purposes?",
    options:[{score:90,label:"Comprehensive cross-border data flow regime with adequacy assessments and bilateral data-sharing treaties"},{score:65,label:"Framework under development; sector-specific rules govern sensitive data flows"},{score:40,label:"Ad hoc approach — cross-border flows evaluated case-by-case with no formal framework"},{score:10,label:"No governance of cross-border data flows; unrestricted by default"}]},
  { id:"q22", dim:"d4", text:"What is the maturity of your national data catalogue and strategic AI asset registry?",
    options:[{score:90,label:"Comprehensive national data catalogue operational with AI-ready datasets, quality certifications, and API access"},{score:65,label:"Data catalogue in development across major ministries; priority AI-grade datasets identified"},{score:30,label:"Inventory of data assets exists in name only; no operational catalogue or enforced quality standard"},{score:10,label:"No national data catalogue; data asset inventory does not exist"}]},
  { id:"q23", dim:"d4", text:"How does your nation protect strategic AI data assets from foreign access or exploitation?",
    options:[{score:90,label:"Formal strategic data protection regime — classified AI datasets, access controls, audit trails, and penalties"},{score:65,label:"Sectoral protections for sensitive data (health, finance, defence); cross-sector framework is emerging"},{score:35,label:"Limited ad hoc protections; no systematic approach to strategic AI data asset security"},{score:10,label:"No protection framework for strategic AI data assets"}]},
  { id:"q24", dim:"d4", text:"What is the status of data quality standards and AI-readiness of public sector data?",
    options:[{score:65,label:"Formal data quality standards enforced across government; AI training datasets curated and maintained"},{score:35,label:"Data quality initiatives underway in select ministries; no national standard enforced"},{score:10,label:"Public sector data quality is poor or unstructured; significant remediation required for AI readiness"},{score:5,label:"Data quality assessment has not been conducted; status unknown"}]},

  // ── D5: Directed Intelligence Maturity (Q25–Q30) ─────────
  { id:"q25", dim:"d5", text:"Has your nation deployed AI in public service delivery at meaningful scale?",
    options:[{score:90,label:"AI deployed across multiple high-volume public services with measurable citizen impact and adoption metrics"},{score:65,label:"AI pilots operational in several priority services; scale-up plans formally approved and funded"},{score:35,label:"Isolated AI pilots in one or two agencies; no coordinated national deployment programme"},{score:10,label:"No AI deployment in public services; feasibility studies or concept notes only"}]},
  { id:"q26", dim:"d5", text:"What is the maturity of your national AI strategy and implementation roadmap?",
    options:[{score:90,label:"National AI strategy published with measurable targets, dedicated budget lines, and annual progress reporting"},{score:60,label:"AI strategy in place but implementation roadmap lacks measurable milestones or ring-fenced budget"},{score:30,label:"AI strategy under development; no published roadmap or implementation plan"},{score:10,label:"No national AI strategy exists"}]},
  { id:"q27", dim:"d5", text:"How advanced is AI integration in your national defence, security, and intelligence apparatus?",
    options:[{score:90,label:"AI integrated into operational defence and intelligence functions with dedicated AI command or unit"},{score:55,label:"AI programmes active in defence/security with proof-of-concept deployments and dedicated budget"},{score:30,label:"AI awareness and early pilots in defence/security; no operational integration"},{score:10,label:"AI in defence and security not yet on the institutional agenda"}]},
  { id:"q28", dim:"d5", text:"What is the maturity of your AI talent pipeline and national workforce development programme?",
    options:[{score:90,label:"National AI talent strategy operational — university programmes, reskilling at scale, and diaspora return initiatives"},{score:55,label:"AI curriculum integrated in higher education with selected government training; national strategy in development"},{score:25,label:"Ad hoc AI training programmes; no coordinated national talent pipeline"},{score:10,label:"Critical AI talent shortage with no systematic pipeline development in place"}]},
  { id:"q29", dim:"d5", text:"How does your nation leverage AI for economic diversification and industrial strategy?",
    options:[{score:90,label:"AI central to national economic diversification — sector-specific AI programmes with GDP impact targets"},{score:55,label:"AI economic strategy in development with funded pilot programmes in priority industrial sectors"},{score:25,label:"AI mentioned in economic strategy documents but no operational industrial AI programme"},{score:10,label:"AI not integrated into national economic or industrial planning"}]},
  { id:"q30", dim:"d5", text:"What is the maturity of your national AI research, innovation, and commercialisation ecosystem?",
    options:[{score:90,label:"National AI research institutes, technology transfer frameworks, and commercialisation pathways operational"},{score:60,label:"University AI research centres active with industry linkage; commercialisation pathways developing"},{score:30,label:"Research concentrated in universities with limited industry collaboration or spin-out activity"},{score:10,label:"Negligible domestic AI research capacity; reliant entirely on imported knowledge"}]},
];

// =============================================================
// DIMENSION METADATA
// =============================================================
const DIMS = [
  { key:"compute",    label:"Compute Capacity",             qKey:"d1" },
  { key:"capital",    label:"Capital Formation",            qKey:"d2" },
  { key:"regulatory", label:"Regulatory Readiness",         qKey:"d3" },
  { key:"data",       label:"Data Sovereignty",             qKey:"d4" },
  { key:"di",         label:"Directed Intelligence",        qKey:"d5" },
];

const LEAD_STAGES = ["New","Contacted","Proposal Sent","Won","Lost"];

// =============================================================
// HELPERS
// =============================================================
const tierColor = (tier) => ({"Sovereign AI Leader":"#28A868","Advanced":"#4A7AE0","Developing":"#D4A830","Nascent":"#C9963A","Pre-conditions Unmet":"#C03058"}[tier] || "#9880B0");
const stageColor = (stage) => ({"New":"#9880B0","Contacted":"#4A7AE0","Proposal Sent":"#D4A830","Won":"#28A868","Lost":"#C03058"}[stage] || "#9880B0");
const bandLabel = (s) => s >= 65 ? "High" : s >= 40 ? "Medium" : "Low";
const bandColor = (s) => s >= 65 ? "#28A868" : s >= 40 ? "#D4A830" : "#C03058";
const qScoreColor = (s) => s >= 75 ? "#28A868" : s >= 50 ? "#D4A830" : "#C03058";

const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});

const getAnswerLabel = (qId, score) => {
  const q = QUESTION_BANK.find(q => q.id === qId);
  if (!q) return `Score: ${score}`;
  const opt = q.options.find(o => o.score === score);
  return opt ? opt.label : `Response recorded (score: ${score})`;
};

// =============================================================
// PILL
// =============================================================
function Pill({ label, color, size = "sm" }) {
  const pad = size === "lg" ? "4px 11px" : "3px 9px";
  const fs = size === "lg" ? 12 : 11;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:pad, borderRadius:3, fontSize:fs, fontWeight:500, letterSpacing:"0.02em", whiteSpace:"nowrap", background:`${color}18`, color, border:`0.5px solid ${color}40` }}>
      {label}
    </span>
  );
}

// =============================================================
// TOAST
// =============================================================
function Toast({ visible, msg }) {
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:9999, background:"#1A1540", border:"0.5px solid #2A204A", color:"#FBF5E6", padding:"11px 18px", borderRadius:7, fontSize:13, display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 28px rgba(0,0,0,0.28)", transform:visible ? "translateY(0)" : "translateY(80px)", opacity:visible ? 1 : 0, transition:"transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease", pointerEvents:"none" }}>
      <div style={{ width:7, height:7, background:"#28A868", borderRadius:"50%", flexShrink:0 }} />
      <span>{msg}</span>
      <span style={{ color:"#9880B0", fontSize:11, marginLeft:4 }}>(prototype)</span>
    </div>
  );
}

// =============================================================
// RADAR CHART — light panel palette
// =============================================================
function RadarChart({ scores }) {
  const cx = 185, cy = 165, r = 118;
  const dimOrder = ["compute","capital","regulatory","data","di"];
  const dimLabels = ["Compute","Capital","Regulatory","Data","DI Maturity"];

  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5;

  const pt = (val, i, radius) => {
    const a = angle(i);
    const scale = Math.max(0, Math.min(100, val)) / 100;
    return [cx + scale * radius * Math.cos(a), cy + scale * radius * Math.sin(a)];
  };

  const gridPoly = (pct) =>
    dimOrder.map((_, i) => pt(pct * 100, i, r).join(",")).join(" ");

  const scorePoly = dimOrder.map((d, i) => pt(scores[d] || 0, i, r).join(",")).join(" ");

  // Label anchor logic
  const labelAnchor = (i) => {
    const a = angle(i) * (180 / Math.PI);
    if (a > -100 && a < -80) return "middle"; // top
    if (a >= -80 && a <= 30) return "start";  // right
    if (a > 30 && a < 150)  return "middle";  // bottom
    return "end";                              // left
  };

  const labelDy = (i) => {
    const a = angle(i) * (180 / Math.PI);
    if (a > -100 && a < -80) return -6;       // top
    if (a > 30 && a < 150)  return 14;        // bottom
    return 4;                                  // sides
  };

  return (
    <svg width="370" height="310" viewBox="0 0 370 310" style={{ display:"block" }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(pct => (
        <polygon key={pct} points={gridPoly(pct)} fill="none" stroke={pct === 1 ? "#D4CCBE" : "#E8E2DA"} strokeWidth={pct === 1 ? "0.75" : "0.5"} />
      ))}
      {/* Axis spokes */}
      {dimOrder.map((_, i) => {
        const [x, y] = pt(100, i, r);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E0D8CC" strokeWidth="0.5" />;
      })}
      {/* Score polygon fill */}
      <polygon points={scorePoly} fill="#C9963A" fillOpacity="0.18" stroke="#C9963A" strokeWidth="1.75" strokeLinejoin="round" />
      {/* Score dots */}
      {dimOrder.map((d, i) => {
        const [x, y] = pt(scores[d] || 0, i, r);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#C9963A" stroke="#FFFFFF" strokeWidth="1.5" />;
      })}
      {/* Scale ticks on top axis */}
      {[25, 50, 75].map(v => {
        const [x, y] = pt(v, 0, r);
        return <text key={v} x={x + 5} y={y} fontSize="9" fill="#B8B0A8" dominantBaseline="middle">{v}</text>;
      })}
      {/* Dimension labels */}
      {dimOrder.map((d, i) => {
        const lRadius = r + 26;
        const a = angle(i);
        const lx = cx + lRadius * Math.cos(a);
        const ly = cy + lRadius * Math.sin(a);
        const sc = scores[d] || 0;
        return (
          <g key={i}>
            <text x={lx} y={ly + labelDy(i)} textAnchor={labelAnchor(i)} dominantBaseline="middle" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fill="#1A1A2E" fontWeight="500">{dimLabels[i]}</text>
            <text x={lx} y={ly + labelDy(i) + 13} textAnchor={labelAnchor(i)} dominantBaseline="middle" fontSize="10" fontFamily="Georgia, serif" fill={bandColor(sc)}>{sc}</text>
          </g>
        );
      })}
    </svg>
  );
}

// =============================================================
// ORG PROFILE CARD
// =============================================================
function OrgProfileCard({ sub }) {
  const rows = [
    { label:"Country",           value:sub.country },
    { label:"Respondent",        value:sub.respondentName },
    { label:"Title",             value:sub.title },
    { label:"Ministry",          value:sub.ministry },
    { label:"Email",             value:<a href={`mailto:${sub.email}`} style={{ color:"#4A7AE0", textDecoration:"none" }}>{sub.email}</a> },
    { label:"Development Stage", value:sub.developmentStage },
    { label:"Completed",         value:`${fmtDate(sub.completedAt)} at ${fmtTime(sub.completedAt)} UTC` },
  ];
  return (
    <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, overflow:"hidden", marginBottom:14 }}>
      <div style={{ padding:"11px 16px", background:"#F7F4EF", borderBottom:"0.5px solid #E0D8CC" }}>
        <span style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em" }}>Organisation Profile</span>
      </div>
      <div style={{ padding:"6px 0" }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", padding:"8px 16px", borderBottom: i < rows.length-1 ? "0.5px solid #F0EBE3" : "none" }}>
            <div style={{ width:148, flexShrink:0, fontSize:12, color:"#6B6577", paddingTop:1 }}>{row.label}</div>
            <div style={{ fontSize:13, color:"#1A1A2E", flex:1 }}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================
// DIMENSION SCORES PANEL
// =============================================================
function DimensionScoresPanel({ scores }) {
  return (
    <div style={{ marginBottom:14 }}>
      {/* Score cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:10, marginBottom:14 }}>
        {DIMS.map(dim => {
          const s = scores[dim.key] || 0;
          const bc = bandColor(s);
          return (
            <div key={dim.key} style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, padding:"14px 14px 12px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:"#6B6577", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, lineHeight:1.3 }}>{dim.label.replace("Directed Intelligence","Dir. Intelligence")}</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:28, color:bc, lineHeight:1, marginBottom:9 }}>{s}</div>
              <Pill label={bandLabel(s)} color={bc} />
            </div>
          );
        })}
      </div>
      {/* Radar chart */}
      <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, padding:"16px 20px 10px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em", alignSelf:"flex-start", marginBottom:2 }}>Dimension Radar</div>
        <RadarChart scores={scores} />
      </div>
    </div>
  );
}

// =============================================================
// Q&A ACCORDION
// =============================================================
function QAAccordion({ answers }) {
  const [open, setOpen] = useState({});

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, overflow:"hidden", marginBottom:14 }}>
      <div style={{ padding:"11px 16px", background:"#F7F4EF", borderBottom:"0.5px solid #E0D8CC" }}>
        <span style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em" }}>Assessment Responses</span>
      </div>
      {DIMS.map((dim, di) => {
        const questions = QUESTION_BANK.filter(q => q.dim === dim.qKey);
        const dimScore = Math.round(questions.reduce((acc, q) => acc + (answers[q.id] || 0), 0) / questions.length);
        const isOpen = !!open[dim.key];

        return (
          <div key={dim.key} style={{ borderBottom: di < DIMS.length - 1 ? "0.5px solid #E8E2DA" : "none" }}>
            {/* Accordion header */}
            <button
              onClick={() => toggle(dim.key)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:isOpen ? "#FAFAF8" : "transparent", border:"none", cursor:"pointer", fontFamily:"system-ui, sans-serif", textAlign:"left", transition:"background 0.12s" }}
            >
              <span style={{ fontSize:13, color: isOpen ? "#C9963A" : "#5A4A7A", fontWeight:500, width:16, flexShrink:0, transition:"transform 0.18s", display:"inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</span>
              <span style={{ fontSize:13, fontWeight:500, color:"#1A1A2E", flex:1 }}>{dim.label}</span>
              <span style={{ fontSize:11, color:"#9880B0", marginRight:8 }}>{questions.length} questions</span>
              <Pill label={bandLabel(dimScore)} color={bandColor(dimScore)} />
            </button>

            {/* Expanded table */}
            {isOpen && (
              <div style={{ borderTop:"0.5px solid #F0EBE3" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#F0EBE3" }}>
                      <th style={{ padding:"7px 16px", fontSize:10.5, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"left", width:40 }}>#</th>
                      <th style={{ padding:"7px 12px", fontSize:10.5, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"left", width:"28%" }}>Question</th>
                      <th style={{ padding:"7px 12px", fontSize:10.5, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"left" }}>Response</th>
                      <th style={{ padding:"7px 16px", fontSize:10.5, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.07em", textAlign:"center", width:60 }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, qi) => {
                      const score = answers[q.id] || 0;
                      const sc = qScoreColor(score);
                      const answer = getAnswerLabel(q.id, score);
                      const qNum = parseInt(q.id.replace("q",""), 10);
                      return (
                        <tr key={q.id} style={{ borderBottom:"0.5px solid #F0EBE3", background: qi % 2 === 0 ? "#FFFFFF" : "#FDFCFB" }}>
                          <td style={{ padding:"9px 16px", fontSize:11, color:"#9880B0", fontWeight:500, verticalAlign:"top" }}>Q{qNum}</td>
                          <td style={{ padding:"9px 12px", verticalAlign:"top" }}>
                            <span title={q.text} style={{ fontSize:12, color:"#1A1A2E", lineHeight:1.45, display:"block" }}>
                              {q.text.length > 62 ? q.text.slice(0, 62) + "…" : q.text}
                            </span>
                          </td>
                          <td style={{ padding:"9px 12px", verticalAlign:"top" }}>
                            <span style={{ fontSize:12, color:"#4A3F6B", lineHeight:1.45 }}>{answer}</span>
                          </td>
                          <td style={{ padding:"9px 16px", textAlign:"center", verticalAlign:"top" }}>
                            <span style={{ fontFamily:"Georgia, serif", fontSize:14, color:sc, fontWeight:400 }}>{score}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================
// ADMIN TOOLS PANEL
// =============================================================
function AdminToolsPanel({ submission, onUpdateSub, onViewLead, showToast }) {
  const [noteText, setNoteText] = useState(submission.adminNotes || "");
  const [noteSaved, setNoteSaved] = useState(false);

  const handleSaveNote = () => {
    onUpdateSub({ adminNotes: noteText });
    setNoteSaved(true);
    showToast("Note saved");
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleConvertLead = () => {
    onUpdateSub({ upgradeStatus:"requested", leadStage:"New" });
    showToast("Converted to lead — stage set to New");
  };

  const handleStageChange = (e) => {
    onUpdateSub({ leadStage: e.target.value });
    showToast("Lead stage updated");
  };

  return (
    <div style={{ position:"sticky", top:20 }}>
      {/* Notes */}
      <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, overflow:"hidden", marginBottom:12 }}>
        <div style={{ padding:"11px 16px", background:"#F7F4EF", borderBottom:"0.5px solid #E0D8CC" }}>
          <span style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em" }}>Admin Notes</span>
        </div>
        <div style={{ padding:"14px 16px" }}>
          <textarea
            value={noteText}
            onChange={e => { setNoteText(e.target.value); setNoteSaved(false); }}
            placeholder="Add notes about this respondent, meeting context, follow-up actions…"
            rows={6}
            style={{ width:"100%", padding:"9px 10px", background:"#FAFAF8", border:"0.5px solid #E0D8CC", borderRadius:5, fontSize:12.5, color:"#1A1A2E", fontFamily:"system-ui, sans-serif", lineHeight:1.55, resize:"vertical", outline:"none", boxSizing:"border-box" }}
          />
          {submission.adminNotes && (
            <p style={{ fontSize:11, color:"#9880B0", fontStyle:"italic", margin:"6px 0 10px" }}>
              Last saved: {submission.adminNotes.slice(0, 60)}{submission.adminNotes.length > 60 ? "…" : ""}
            </p>
          )}
          <button
            onClick={handleSaveNote}
            style={{ padding:"7px 14px", background: noteSaved ? "#28A86815" : "#C9963A", border: noteSaved ? "0.5px solid #28A868" : "none", borderRadius:5, color: noteSaved ? "#28A868" : "#06030E", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"system-ui, sans-serif", transition:"all 0.18s" }}
          >
            {noteSaved ? "✓ Saved" : "Save note"}
          </button>
        </div>
      </div>

      {/* Lead management */}
      <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, overflow:"hidden", marginBottom:12 }}>
        <div style={{ padding:"11px 16px", background:"#F7F4EF", borderBottom:"0.5px solid #E0D8CC" }}>
          <span style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em" }}>Lead Management</span>
        </div>
        <div style={{ padding:"14px 16px" }}>
          {submission.upgradeStatus === "none" ? (
            <div>
              <p style={{ fontSize:12, color:"#6B6577", margin:"0 0 12px", lineHeight:1.5 }}>This respondent has not requested an upgrade. Convert to a lead to begin engagement.</p>
              <button
                onClick={handleConvertLead}
                style={{ padding:"8px 14px", background:"transparent", border:"0.5px solid #C9963A", borderRadius:5, color:"#C9963A", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"system-ui, sans-serif" }}
              >
                Convert to lead →
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#28A868", flexShrink:0 }} />
                <span style={{ fontSize:12, color:"#28A868" }}>Active lead</span>
                {submission.requestedTier && (
                  <span style={{ fontSize:11, color:"#9880B0" }}>— Requested {submission.requestedTier}</span>
                )}
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ display:"block", fontSize:11, color:"#6B6577", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>Lead Stage</label>
                <div style={{ position:"relative" }}>
                  <select
                    value={submission.leadStage}
                    onChange={handleStageChange}
                    style={{ appearance:"none", WebkitAppearance:"none", width:"100%", padding:"8px 28px 8px 10px", background:"#FFFFFF", border:`0.5px solid ${stageColor(submission.leadStage)}60`, borderRadius:5, fontSize:12.5, color:"#1A1A2E", fontFamily:"system-ui, sans-serif", cursor:"pointer", outline:"none" }}
                  >
                    {LEAD_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:10, color:"#9880B0", pointerEvents:"none" }}>▾</span>
                </div>
              </div>

              <button
                onClick={onViewLead}
                style={{ padding:"7px 14px", background:"transparent", border:"0.5px solid #4A7AE0", borderRadius:5, color:"#4A7AE0", fontSize:12.5, fontWeight:500, cursor:"pointer", fontFamily:"system-ui, sans-serif" }}
              >
                View lead record →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ background:"#FFFFFF", border:"0.5px solid #E0D8CC", borderRadius:8, overflow:"hidden" }}>
        <div style={{ padding:"11px 16px", background:"#F7F4EF", borderBottom:"0.5px solid #E0D8CC" }}>
          <span style={{ fontSize:11, fontWeight:500, color:"#6B6577", textTransform:"uppercase", letterSpacing:"0.08em" }}>Quick Reference</span>
        </div>
        <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
          {DIMS.map(dim => {
            const s = submission.scores[dim.key] || 0;
            return (
              <div key={dim.key}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:11, color:"#6B6577" }}>{dim.label}</span>
                  <span style={{ fontSize:11, fontFamily:"Georgia, serif", color:bandColor(s) }}>{s}</span>
                </div>
                <div style={{ height:4, background:"#F0EBE3", borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${s}%`, background:bandColor(s), borderRadius:2, transition:"width 0.3s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// SUBMISSION DETAIL — main B2 page component
// =============================================================
function SubmissionDetail({ submission, submissions, setSubmissions, setAdminPage, setSelectedLead }) {
  const [toast, setToast] = useState({ visible:false, msg:"" });

  const showToast = (msg) => {
    setToast({ visible:true, msg });
    setTimeout(() => setToast({ visible:false, msg:"" }), 2800);
  };

  const updateSub = (patch) => {
    setSubmissions(prev => prev.map(s => s.id === submission.id ? { ...s, ...patch } : s));
  };

  const handleExportPDF = () => showToast("Export PDF queued");

  const tc = tierColor(submission.tier);
  const sc = stageColor(submission.leadStage);

  return (
    <div style={{ minHeight:"100vh", background:"#F7F4EF", fontFamily:"system-ui, -apple-system, sans-serif" }}>

      {/* ── Page header ───────────────────────────────────── */}
      <div style={{ background:"#FFFFFF", borderBottom:"0.5px solid #E0D8CC", padding:"14px 24px 0" }}>
        {/* Breadcrumb */}
        <button onClick={() => setAdminPage("submissions")} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"none", border:"none", cursor:"pointer", color:"#9880B0", fontSize:12, padding:0, fontFamily:"system-ui, sans-serif", marginBottom:12 }}>
          <span style={{ fontSize:14, lineHeight:1 }}>←</span> Back to Submissions
        </button>

        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", paddingBottom:16 }}>
          {/* Left: title block */}
          <div style={{ flex:1, marginRight:24 }}>
            <h1 style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:400, color:"#1A1A2E", margin:"0 0 4px" }}>{submission.country}</h1>
            <div style={{ fontSize:13, color:"#1A1A2E", marginBottom:2 }}>{submission.respondentName}</div>
            <div style={{ fontSize:12, color:"#6B6577" }}>{submission.title} · {submission.ministry}</div>
          </div>

          {/* Right: score badge + actions */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* Composite score */}
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"Georgia, serif", fontSize:36, lineHeight:1, color:"#C9963A" }}>{submission.compositeScore}</div>
                <div style={{ fontSize:10, color:"#9880B0", marginTop:2 }}>Composite Score</div>
              </div>
              {/* Tier pill */}
              <Pill label={submission.tier} color={tc} size="lg" />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:11, color:"#9880B0" }}>{fmtDate(submission.completedAt)}</span>
              <button onClick={handleExportPDF} style={{ padding:"5px 12px", background:"transparent", border:"0.5px solid #C8C0B0", borderRadius:5, color:"#6B6577", fontSize:12, cursor:"pointer", fontFamily:"system-ui, sans-serif" }}>
                Export PDF ↗
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Upgrade alert banner ──────────────────────────── */}
      {submission.upgradeStatus === "requested" && (
        <div style={{ background:"#FFFBF2", border:"0.5px solid #C9963A", borderLeft:"3px solid #C9963A", margin:"16px 24px 0", borderRadius:6, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#C9963A", flexShrink:0 }} />
            <span style={{ fontSize:12.5, color:"#7A5A1A" }}>
              This respondent has requested a <strong>{submission.requestedTier}</strong> upgrade
            </span>
          </div>
          <button onClick={() => { setSelectedLead && setSelectedLead(submission); setAdminPage("leadDetail"); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#C9963A", fontSize:12.5, fontWeight:500, fontFamily:"system-ui, sans-serif", padding:0, flexShrink:0 }}>
            View lead record →
          </button>
        </div>
      )}

      {/* ── Body content ──────────────────────────────────── */}
      <div style={{ display:"flex", gap:16, padding:"16px 24px 32px", alignItems:"flex-start" }}>

        {/* Main content column */}
        <div style={{ flex:1, minWidth:0 }}>
          <OrgProfileCard sub={submission} />
          <DimensionScoresPanel scores={submission.scores} />
          <QAAccordion answers={submission.answers} />
        </div>

        {/* Admin tools sidebar */}
        <div style={{ width:280, flexShrink:0 }}>
          <AdminToolsPanel
            key={submission.id}
            submission={submission}
            onUpdateSub={updateSub}
            onViewLead={() => { setSelectedLead && setSelectedLead(submission); setAdminPage("leadDetail"); }}
            showToast={showToast}
          />
        </div>
      </div>

      <Toast visible={toast.visible} msg={toast.msg} />
    </div>
  );
}

// =============================================================
// STANDALONE PREVIEW WRAPPER
// =============================================================
export default function B2_PreviewApp() {
  const [submissions, setSubmissions] = useState(DEMO_SUBMISSIONS_INIT);
  const [selectedId, setSelectedId] = useState("sub_001");
  const [adminPage, setAdminPage] = useState("submissionDetail");
  const [selectedLead, setSelectedLead] = useState(null);

  const submission = submissions.find(s => s.id === selectedId) || submissions[0];

  const shortCountry = (c) => c.replace("Kingdom of ","").replace("Republic of ","").replace("Federal Republic of ","").replace("United Arab Emirates","UAE");

  return (
    <div style={{ fontFamily:"system-ui, -apple-system, sans-serif" }}>
      {/* Demo picker strip */}
      <div style={{ background:"#0F0830", borderBottom:"0.5px solid #1E1650", padding:"8px 20px", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <span style={{ color:"#9880B0", fontSize:11, letterSpacing:"0.06em", textTransform:"uppercase", flexShrink:0 }}>Preview submission</span>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {submissions.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              style={{ padding:"4px 10px", borderRadius:4, fontSize:11.5, cursor:"pointer", fontFamily:"system-ui, sans-serif", border:`0.5px solid ${s.id === selectedId ? "#C9963A" : "#2A204A"}`, background: s.id === selectedId ? "#C9963A18" : "transparent", color: s.id === selectedId ? "#EDD98A" : "#9880B0", transition:"all 0.12s" }}
            >
              {shortCountry(s.country)}
            </button>
          ))}
        </div>
        <span style={{ marginLeft:"auto", fontSize:10.5, color:"#2A204A" }}>Admin Panel · B2 Submission Detail</span>
      </div>

      <SubmissionDetail
        key={submission.id}
        submission={submission}
        submissions={submissions}
        setSubmissions={setSubmissions}
        setAdminPage={setAdminPage}
        setSelectedLead={setSelectedLead}
      />
    </div>
  );
}
