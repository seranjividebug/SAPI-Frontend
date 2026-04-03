import { useState } from "react";

// ============================================================
// SEED DATA
// ============================================================
const DEMO_SUBMISSIONS_INIT = [
  { id:"sub_001", country:"Kingdom of Saudi Arabia", respondentName:"H.E. Faisal Al-Ibrahim", title:"Minister of Economy and Planning", ministry:"Ministry of Economy and Planning", email:"f.alibrahim@mep.gov.sa", developmentStage:"Advanced", completedAt:"2026-03-14T09:22:00Z", compositeScore:71.4, tier:"Advanced", scores:{compute:78,capital:82,regulatory:65,data:60,di:68}, answers:{q1:95,q2:70,q3:90,q4:75,q5:75,q6:95,q7:90,q8:65,q9:90,q10:95,q11:60,q12:90,q13:60,q14:65,q15:60,q16:25,q17:65,q18:60,q19:65,q20:70,q21:65,q22:65,q23:65,q24:35,q25:90,q26:60,q27:55,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"High-value lead. Minister attended SAPI launch event.", leadStage:"Proposal Sent" },
  { id:"sub_002", country:"Republic of Singapore", respondentName:"Dr. Janice Tan", title:"Deputy Secretary, Smart Nation", ministry:"Smart Nation and Digital Government Office", email:"janice_tan@smartnation.gov.sg", developmentStage:"Leading", completedAt:"2026-03-15T14:05:00Z", compositeScore:83.2, tier:"Sovereign AI Leader", scores:{compute:85,capital:88,regulatory:90,data:80,di:78}, answers:{q1:95,q2:95,q3:90,q4:75,q5:95,q6:95,q7:90,q8:95,q9:90,q10:95,q11:95,q12:90,q13:90,q14:90,q15:90,q16:90,q17:90,q18:90,q19:90,q20:95,q21:90,q22:90,q23:65,q24:65,q25:90,q26:90,q27:90,q28:55,q29:55,q30:60}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_003", country:"Federal Republic of Nigeria", respondentName:"Hon. Bosun Tijani", title:"Minister of Communications, Innovation and Digital Economy", ministry:"Federal Ministry of Communications", email:"minister@fmcide.gov.ng", developmentStage:"Developing", completedAt:"2026-03-17T11:30:00Z", compositeScore:38.6, tier:"Nascent", scores:{compute:28,capital:35,regulatory:42,data:30,di:45}, answers:{q1:25,q2:15,q3:35,q4:30,q5:25,q6:45,q7:25,q8:35,q9:30,q10:40,q11:35,q12:60,q13:30,q14:40,q15:30,q16:25,q17:35,q18:30,q19:35,q20:40,q21:40,q22:30,q23:35,q24:10,q25:65,q26:30,q27:30,q28:25,q29:25,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Introduced via GIZ partnership.", leadStage:"Contacted" },
  { id:"sub_004", country:"Republic of Kenya", respondentName:"Eliud Owalo", title:"Cabinet Secretary, Information & Digital Economy", ministry:"Ministry of Information, Communications and Digital Economy", email:"cs@ict.go.ke", developmentStage:"Emerging", completedAt:"2026-03-18T08:14:00Z", compositeScore:29.1, tier:"Nascent", scores:{compute:22,capital:28,regulatory:35,data:25,di:32}, answers:{q1:25,q2:15,q3:10,q4:30,q5:25,q6:20,q7:25,q8:10,q9:30,q10:40,q11:10,q12:30,q13:30,q14:40,q15:30,q16:25,q17:35,q18:30,q19:10,q20:15,q21:40,q22:30,q23:35,q24:10,q25:35,q26:30,q27:30,q28:25,q29:25,q30:30}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_005", country:"United Arab Emirates", respondentName:"H.E. Omar Al Olama", title:"Minister of State for Artificial Intelligence", ministry:"Ministry of AI, Digital Economy and Remote Work Applications", email:"minister.ai@uaecabinet.ae", developmentStage:"Leading", completedAt:"2026-03-19T10:00:00Z", compositeScore:78.9, tier:"Advanced", scores:{compute:85,capital:88,regulatory:75,data:72,di:70}, answers:{q1:95,q2:95,q3:90,q4:75,q5:95,q6:95,q7:90,q8:65,q9:60,q10:95,q11:95,q12:90,q13:60,q14:65,q15:60,q16:60,q17:65,q18:60,q19:65,q20:70,q21:65,q22:65,q23:65,q24:65,q25:65,q26:60,q27:90,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 3", adminNotes:"Priority account. Met Asim at WEF Davos.", leadStage:"Won" },
  { id:"sub_007", country:"Republic of India", respondentName:"Sh. S. Krishnan", title:"Secretary, Ministry of Electronics and Information Technology", ministry:"MeitY", email:"secretary@meity.gov.in", developmentStage:"Advanced", completedAt:"2026-03-21T07:30:00Z", compositeScore:62.7, tier:"Advanced", scores:{compute:65,capital:70,regulatory:68,data:52,di:58}, answers:{q1:75,q2:70,q3:65,q4:50,q5:50,q6:70,q7:55,q8:65,q9:60,q10:70,q11:60,q12:90,q13:60,q14:65,q15:60,q16:60,q17:65,q18:60,q19:65,q20:40,q21:65,q22:65,q23:65,q24:35,q25:65,q26:60,q27:55,q28:55,q29:55,q30:60}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Referred via UK FCDO digital programme.", leadStage:"Contacted" },
];

const QUESTION_BANK = [
  {id:"q1",dim:"d1",text:"What best describes your nation's sovereign AI compute infrastructure?",options:[{score:95,label:"Sovereign-scale compute operational — nationally owned GPU clusters and AI-optimised data centres in production"},{score:75,label:"Substantial capacity — significant AI compute assets with majority sovereign ownership"},{score:50,label:"Developing capacity — mixed public/private compute primarily reliant on commercial cloud"},{score:25,label:"Pre-conditions unmet — no dedicated sovereign AI compute infrastructure in place"}]},
  {id:"q2",dim:"d1",text:"What is the status of your nation's sovereign data centre infrastructure?",options:[{score:95,label:"Multiple sovereign data centres operational with AI-grade connectivity, redundancy, and power capacity"},{score:70,label:"At least one sovereign data centre operational; expansion programme approved and underway"},{score:40,label:"Government workloads hosted in third-party or co-located facilities; sovereignty limited"},{score:15,label:"No sovereign data centre infrastructure exists or is under active development"}]},
  {id:"q3",dim:"d1",text:"How does your nation manage semiconductor access and strategic AI chip supply?",options:[{score:90,label:"Formal bilateral supply agreements and strategic reserves in place; active domestic semiconductor programme"},{score:65,label:"Preferential procurement arrangements with major chip suppliers; partial supply chain resilience"},{score:35,label:"Ad hoc procurement with no formal supply chain strategy or resilience planning"},{score:10,label:"No strategy — fully exposed to global semiconductor supply constraints and export controls"}]},
  {id:"q4",dim:"d1",text:"How is national AI infrastructure investment funded?",options:[{score:75,label:"Dedicated sovereign AI infrastructure fund with multi-year capital commitment and governance framework"},{score:50,label:"Ring-fenced line-item budget allocations within existing ministry frameworks"},{score:30,label:"Project-by-project approval; no standing AI infrastructure budget"},{score:10,label:"No public investment — infrastructure reliant entirely on private sector provision"}]},
  {id:"q5",dim:"d1",text:"What is the maturity of your national AI cloud and hybrid infrastructure strategy?",options:[{score:95,label:"National sovereign cloud operational with dedicated AI workload layer and hybrid multi-cloud capability"},{score:75,label:"National cloud programme underway with approved AI infrastructure roadmap"},{score:50,label:"Government cloud strategy exists but lacks AI-specific infrastructure planning"},{score:25,label:"No national cloud strategy — ministries procure infrastructure independently"}]},
  {id:"q6",dim:"d1",text:"How does your nation address power and cooling infrastructure requirements for AI compute?",options:[{score:95,label:"Dedicated AI compute power zones with renewable energy commitments and purpose-built cooling infrastructure"},{score:70,label:"Power infrastructure planning for AI underway; partial renewable integration in progress"},{score:45,label:"General data centre power planning exists; no AI-specific energy or cooling strategy"},{score:20,label:"Power infrastructure constraints are an active barrier to AI compute deployment"}]},
  {id:"q7",dim:"d2",text:"What is the scale of dedicated public AI investment as a share of GDP?",options:[{score:90,label:"Significant public AI investment (>0.3% GDP) with multi-year budget commitment and performance targets"},{score:55,label:"Moderate investment (0.1–0.3% GDP) through targeted sector programmes"},{score:25,label:"Limited AI budget (<0.1% GDP) primarily through existing ministry allocations"},{score:10,label:"No identifiable AI-specific public investment line"}]},
  {id:"q8",dim:"d2",text:"How active is private sector AI investment in your national economy?",options:[{score:95,label:"Vibrant private AI ecosystem — active VC market, scaled domestic AI companies, and corporate R&D programmes"},{score:65,label:"Growing private sector AI investment with active startup activity and emerging corporate programmes"},{score:35,label:"Nascent private investment — limited VC activity, few scaled domestic AI companies"},{score:10,label:"Private AI investment is negligible or primarily controlled by foreign-owned entities"}]},
  {id:"q9",dim:"d2",text:"Does your nation operate a dedicated sovereign AI investment or development fund?",options:[{score:90,label:"Sovereign AI fund operational with active deployment mandate, governance, and measurable portfolio"},{score:60,label:"Sovereign technology fund exists with AI as a significant but not primary mandate"},{score:30,label:"Fund proposal or feasibility study underway; no operational vehicle"},{score:10,label:"No sovereign AI investment fund or equivalent mechanism in place"}]},
  {id:"q10",dim:"d2",text:"What is the maturity of your domestic AI startup and venture ecosystem?",options:[{score:95,label:"Thriving ecosystem — multiple unicorns or near-unicorns, active Series A/B market, government co-investment programmes"},{score:70,label:"Growing ecosystem — early-stage activity with some scaled companies and emerging VC market"},{score:40,label:"Early-stage — handful of AI startups, limited VC, mostly bootstrapped or grant-funded"},{score:15,label:"Negligible domestic AI startup activity; market dominated by foreign technology companies"}]},
  {id:"q11",dim:"d2",text:"How does your nation attract and retain foreign AI investment?",options:[{score:95,label:"Dedicated foreign AI investment incentive regime — tax breaks, licensing fast-track, sovereign partnership structures"},{score:60,label:"General FDI incentives apply to AI; no dedicated AI-specific investment attraction framework"},{score:35,label:"Ad hoc engagement with foreign AI companies; no systematic investment attraction programme"},{score:10,label:"No active effort to attract foreign AI investment"}]},
  {id:"q12",dim:"d2",text:"What is the maturity of AI financial infrastructure — stock exchange, deep tech IPO pathways, debt instruments?",options:[{score:90,label:"Mature AI financial markets — listed AI companies, active deep tech IPO pipeline, AI-specific debt instruments"},{score:60,label:"General financial markets accessible to AI companies; no AI-specific instruments or pathways"},{score:30,label:"Limited financial infrastructure for AI — most companies exit offshore or remain private"},{score:10,label:"No meaningful domestic capital market access for AI companies"}]},
  {id:"q13",dim:"d3",text:"Does your nation have a dedicated national AI governance or regulatory framework?",options:[{score:90,label:"Comprehensive national AI law or regulatory framework enacted with enforcement mechanisms"},{score:60,label:"Sector-specific AI regulations in place; national framework under development"},{score:30,label:"Policy consultation or white paper published; no enacted regulatory framework"},{score:10,label:"No dedicated AI governance framework — existing laws applied on ad hoc basis"}]},
  {id:"q14",dim:"d3",text:"How does your nation engage with international AI governance bodies and standard-setting?",options:[{score:90,label:"Active leadership role in international AI governance — co-chairs or leads working groups at OECD, UN, or equivalent"},{score:65,label:"Active participation in international AI governance bodies with defined national positions"},{score:40,label:"Observer status or ad hoc engagement with international AI governance processes"},{score:10,label:"No systematic engagement with international AI governance or standard-setting"}]},
  {id:"q15",dim:"d3",text:"What is the maturity of your national data protection and privacy regulatory framework?",options:[{score:90,label:"Comprehensive data protection law enacted with independent regulator, enforcement record, and cross-border provisions"},{score:60,label:"Data protection legislation in place; regulator operational but enforcement capacity limited"},{score:30,label:"Data protection framework under development; existing laws do not adequately address AI-generated data"},{score:10,label:"No data protection or privacy framework relevant to AI exists"}]},
  {id:"q16",dim:"d3",text:"How does your government approach algorithmic accountability and AI transparency requirements?",options:[{score:90,label:"Mandatory algorithmic impact assessments, audit requirements, and transparency obligations for high-risk AI"},{score:65,label:"Voluntary guidelines or codes of practice for AI transparency; regulatory guidance published"},{score:25,label:"Ad hoc requirements in specific sectors; no comprehensive accountability framework"},{score:10,label:"No algorithmic accountability or AI transparency requirements in place"}]},
  {id:"q17",dim:"d3",text:"How does your nation handle AI liability, insurance, and legal accountability frameworks?",options:[{score:90,label:"AI-specific liability framework enacted — clear allocation of responsibility, mandatory insurance, legal precedents established"},{score:65,label:"Existing product liability and tort law applied to AI; sector-specific guidance published"},{score:35,label:"Legal uncertainty around AI liability; consultation ongoing with no enacted framework"},{score:10,label:"No consideration of AI-specific liability frameworks in legislative or policy agenda"}]},
  {id:"q18",dim:"d4",text:"How does your nation manage the cross-border flow of sensitive government and citizen data?",options:[{score:90,label:"Comprehensive data localisation or sovereignty framework — mandatory data residency for sensitive categories, enforced"},{score:60,label:"Sector-specific data localisation requirements; general framework under development"},{score:30,label:"Limited data sovereignty provisions — reliant on contractual protections with foreign cloud providers"},{score:10,label:"No data sovereignty framework — government data held with foreign providers without enforceable protections"}]},
  {id:"q19",dim:"d4",text:"What is the maturity of your national data infrastructure — data lakes, government data platforms, interoperability?",options:[{score:90,label:"National data infrastructure operational — sovereign data lakes, interoperability standards, government data APIs in production"},{score:65,label:"Government data platform under development; partial interoperability between ministries achieved"},{score:35,label:"Fragmented data infrastructure — siloed ministry systems with limited interoperability"},{score:10,label:"No national data infrastructure strategy; ministries operate entirely independently"}]},
  {id:"q20",dim:"d4",text:"How does your nation approach open data, data sharing, and data as a strategic national asset?",options:[{score:95,label:"National open data policy operational — tiered access, data marketplaces, government data monetisation frameworks"},{score:70,label:"Open data portal exists with active publication programme; data sharing policy in development"},{score:40,label:"Ad hoc data publication; no strategic framework for government data as a national asset"},{score:15,label:"No open data policy; government data is inaccessible or only available through FOIA-equivalent requests"}]},
  {id:"q21",dim:"d4",text:"What is the status of your national digital identity and data sovereignty infrastructure?",options:[{score:90,label:"National digital identity system operational with AI integration, biometric capability, and sovereignty protections"},{score:65,label:"National digital identity system operational; AI integration and sovereignty framework in development"},{score:40,label:"Digital identity system in development or partially deployed; no AI integration"},{score:10,label:"No national digital identity infrastructure; reliant on physical documentation"}]},
  {id:"q22",dim:"d5",text:"How advanced is AI deployment in core government service delivery?",options:[{score:90,label:"AI operational across multiple core government services — healthcare, tax, benefits, justice — with measurable impact"},{score:65,label:"AI pilots or limited deployments in government services; scaling programme approved"},{score:35,label:"AI experimentation in government underway; no operational deployments at scale"},{score:10,label:"AI not yet deployed in government service delivery"}]},
  {id:"q23",dim:"d5",text:"What is the maturity of your government's AI procurement and implementation capability?",options:[{score:90,label:"Dedicated government AI procurement framework — accredited suppliers, standard contracts, implementation playbooks"},{score:65,label:"General procurement rules applied to AI; government AI implementation guidance published"},{score:35,label:"Ad hoc AI procurement; no standard framework or supplier accreditation"},{score:10,label:"No government AI procurement capability or framework"}]},
  {id:"q24",dim:"d5",text:"How does your nation integrate AI into national security, border control, and public safety?",options:[{score:90,label:"AI integrated into national security operations — border management, threat detection, public safety — with governance framework"},{score:65,label:"AI pilots in national security domains; operational integration programme underway"},{score:35,label:"AI awareness in national security; no operational programmes"},{score:10,label:"AI not considered in national security planning"}]},
  {id:"q25",dim:"d5",text:"What is the maturity of your national AI ethics and responsible AI framework?",options:[{score:90,label:"National AI ethics framework enacted — independent ethics board, mandatory assessments, public accountability mechanisms"},{score:65,label:"National AI principles published; voluntary ethics framework with government endorsement"},{score:35,label:"AI ethics working group or consultation underway; no enacted framework"},{score:10,label:"No national AI ethics framework or principles published"}]},
  {id:"q26",dim:"d5",text:"What is the maturity of your national AI strategy and implementation roadmap?",options:[{score:90,label:"National AI strategy published with measurable targets, dedicated budget lines, and annual progress reporting"},{score:60,label:"AI strategy in place but implementation roadmap lacks measurable milestones or ring-fenced budget"},{score:30,label:"AI strategy under development; no published roadmap or implementation plan"},{score:10,label:"No national AI strategy exists"}]},
  {id:"q27",dim:"d5",text:"How advanced is AI integration in your national defence, security, and intelligence apparatus?",options:[{score:90,label:"AI integrated into operational defence and intelligence functions with dedicated AI command or unit"},{score:55,label:"AI programmes active in defence/security with proof-of-concept deployments and dedicated budget"},{score:30,label:"AI awareness and early pilots in defence/security; no operational integration"},{score:10,label:"AI in defence and security not yet on the institutional agenda"}]},
  {id:"q28",dim:"d5",text:"What is the maturity of your AI talent pipeline and national workforce development programme?",options:[{score:90,label:"National AI talent strategy operational — university programmes, reskilling at scale, and diaspora return initiatives"},{score:55,label:"AI curriculum integrated in higher education with selected government training; national strategy in development"},{score:25,label:"Ad hoc AI training programmes; no coordinated national talent pipeline"},{score:10,label:"Critical AI talent shortage with no systematic pipeline development in place"}]},
  {id:"q29",dim:"d5",text:"How does your nation leverage AI for economic diversification and industrial strategy?",options:[{score:90,label:"AI central to national economic diversification — sector-specific AI programmes with GDP impact targets"},{score:55,label:"AI economic strategy in development with funded pilot programmes in priority industrial sectors"},{score:25,label:"AI mentioned in economic strategy documents but no operational industrial AI programme"},{score:10,label:"AI not integrated into national economic or industrial planning"}]},
  {id:"q30",dim:"d5",text:"What is the maturity of your national AI research, innovation, and commercialisation ecosystem?",options:[{score:90,label:"National AI research institutes, technology transfer frameworks, and commercialisation pathways operational"},{score:60,label:"University AI research centres active with industry linkage; commercialisation pathways developing"},{score:30,label:"Research concentrated in universities with limited industry collaboration or spin-out activity"},{score:10,label:"Negligible domestic AI research capacity; reliant entirely on imported knowledge"}]},
];

const DIMS = [
  {key:"compute",    label:"Compute Capacity",         qKey:"d1"},
  {key:"capital",   label:"Capital Formation",         qKey:"d2"},
  {key:"regulatory",label:"Regulatory Readiness",      qKey:"d3"},
  {key:"data",      label:"Data Sovereignty",          qKey:"d4"},
  {key:"di",        label:"Directed Intelligence",     qKey:"d5"},
];

const STAGES = ["New","Contacted","Proposal Sent","Won","Lost"];

// ============================================================
// HELPERS
// ============================================================
const tierColor  = t => ({"Sovereign AI Leader":"#28A868",Advanced:"#4A7AE0",Developing:"#F0C050",Nascent:"#C9963A","Pre-conditions Unmet":"#C03058"}[t]||"#9880B0");
const stageColor = s => ({New:"#9880B0",Contacted:"#4A7AE0","Proposal Sent":"#F0C050",Won:"#28A868",Lost:"#C03058"}[s]||"#9880B0");
const bandLabel  = s => s>=65?"Strong":s>=40?"Moderate":"Weak";
const bandColor  = s => s>=65?"#28A868":s>=40?"#F0C050":"#C03058";
const qScoreColor= s => s>=75?"#28A868":s>=50?"#F0C050":"#C03058";

const fmtDate = iso => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = iso => new Date(iso).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
const fmtDateTime = iso => `${fmtDate(iso)}, ${fmtTime(iso)}`;
const nowISO = () => new Date().toISOString();

const lowestDim = scores => {
  const [key] = Object.entries(scores).reduce((a,b)=>b[1]<a[1]?b:a);
  return DIMS.find(d=>d.key===key)?.label||key;
};

const getAnswerLabel = (qId, score) => {
  const q = QUESTION_BANK.find(q=>q.id===qId);
  if (!q) return `Score: ${score}`;
  const opt = q.options.find(o=>o.score===score);
  return opt ? opt.label : `Score: ${score}`;
};

const seedActivityLog = lead => {
  const entries = [{id:"evt_complete",ts:lead.completedAt,text:`Tier 1 assessment completed — composite score ${lead.compositeScore}`}];
  if (lead.upgradeStatus==="requested") {
    const upgradeTs = new Date(new Date(lead.completedAt).getTime()+3*60*60*1000).toISOString();
    entries.push({id:"evt_upgrade",ts:upgradeTs,text:`Upgrade request submitted — ${lead.requestedTier}`});
  }
  if (lead.adminNotes) {
    const noteTs = new Date(new Date(lead.completedAt).getTime()+6*60*60*1000).toISOString();
    entries.push({id:"evt_note_seed",ts:noteTs,text:`Note added: "${lead.adminNotes.slice(0,48)}${lead.adminNotes.length>48?"…":""}"`});
  }
  return entries.sort((a,b)=>new Date(b.ts)-new Date(a.ts));
};

// ============================================================
// SHARED COMPONENTS
// ============================================================
function Pill({label,color,size="sm"}){
  const pad=size==="lg"?"4px 11px":"3px 9px",fs=size==="lg"?12:11;
  return <span style={{display:"inline-flex",alignItems:"center",padding:pad,borderRadius:3,fontSize:fs,fontWeight:500,letterSpacing:"0.02em",whiteSpace:"nowrap",background:`${color}18`,color,border:`0.5px solid ${color}40`}}>{label}</span>;
}

function StageBadge({stage}){
  const c=stageColor(stage);
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:4,fontSize:11.5,fontWeight:500,background:`${c}18`,color:c,border:`1px solid ${c}40`,whiteSpace:"nowrap"}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>{stage}
  </span>;
}

function CopyIcon(){return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;}

function MetaRowC2({label,value}){
  return <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"6px 0",borderBottom:"0.5px solid #F0EBE3"}}>
    <span style={{fontSize:11.5,color:"#9880B0",width:140,flexShrink:0,paddingTop:1}}>{label}</span>
    <span style={{fontSize:12.5,color:"#1A1A2E"}}>{value}</span>
  </div>;
}

function Toast({visible,msg}){
  return <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:"#1A1540",border:"0.5px solid #2A204A",color:"#FBF5E6",padding:"11px 18px",borderRadius:7,fontSize:13,display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 28px rgba(0,0,0,0.28)",transform:visible?"translateY(0)":"translateY(80px)",opacity:visible?1:0,transition:"transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",pointerEvents:"none"}}>
    <div style={{width:7,height:7,background:"#28A868",borderRadius:"50%",flexShrink:0}}/><span>{msg}</span>
  </div>;
}

// ============================================================
// C2: LEAD DETAIL COMPONENTS
// ============================================================
function EmailModal({lead,onClose}){
  const lowest=lowestDim(lead.scores);
  const tierNum=lead.requestedTier?lead.requestedTier.replace("Tier ",""):"2";
  const benefits={"2":"a structured practitioner diagnostic, gap analysis, and a prioritised reform roadmap delivered by our senior advisory team","3":"an embedded advisory engagement with dedicated SAPI practitioners working alongside your ministry teams","4":"a comprehensive sovereign AI transformation programme with full implementation support"};
  const [subject,setSubject]=useState(`SAPI ${lead.requestedTier||"Tier 2"} Engagement — ${lead.country} Next Steps`);
  const [body,setBody]=useState(`Dear ${lead.respondentName},\n\nThank you for completing your Tier 1 SAPI assessment. Your composite score of ${lead.compositeScore} places ${lead.country} in the ${lead.tier} tier of our global sovereign AI readiness index.\n\nOur analysis identified ${lowest} as your primary strategic constraint — an area where targeted practitioner intervention consistently delivers measurable improvement in readiness positioning.\n\nA ${lead.requestedTier||"Tier 2"} engagement with SAPI would provide ${benefits[tierNum]||benefits["2"]}.\n\nI would welcome the opportunity to discuss how we can support ${lead.country}'s sovereign AI ambitions. Please let me know your availability for a 30-minute introductory call.\n\nWarm regards,\nAsim Razvi\nSovereign AI Power Index`);
  const [copied,setCopied]=useState(false);
  const handleCopy=()=>{try{navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);}catch(e){}setCopied(true);setTimeout(()=>setCopied(false),2000);};
  return <div style={{border:"1px solid #E0D8CC",borderRadius:10,background:"#FFFFFF",marginTop:12,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,0.07)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9Z" stroke="#6B6577" strokeWidth="1.4"/><path d="m2 6 8 5.5L18 6" stroke="#6B6577" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <span style={{fontSize:12.5,fontWeight:500,color:"#1A1A2E"}}>Draft introduction email</span>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#9880B0",fontSize:18,lineHeight:1,padding:"2px 4px"}}>×</button>
    </div>
    <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
      <div><label style={{fontSize:11,color:"#9880B0",display:"block",marginBottom:4}}>SUBJECT</label>
        <input value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12.5,color:"#1A1A2E",background:"#FDFBF8",outline:"none"}}/>
      </div>
      <div><label style={{fontSize:11,color:"#9880B0",display:"block",marginBottom:4}}>BODY</label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={12} style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12,color:"#1A1A2E",background:"#FDFBF8",lineHeight:1.65,resize:"vertical",outline:"none"}}/>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:5,border:"0.5px solid #E0D8CC",background:"transparent",color:"#6B6577",fontSize:12,cursor:"pointer"}}>Close</button>
        <button onClick={handleCopy} style={{padding:"7px 16px",borderRadius:5,border:"none",background:copied?"#28A868":"#C9963A",color:"#FFF",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"background 0.2s"}}>
          {copied?<><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>:<><CopyIcon/>Copy email</>}
        </button>
      </div>
    </div>
  </div>;
}

function ScoreSummarySidebar({lead,onViewAssessment}){
  return <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden"}}>
    <div style={{padding:"18px 18px 14px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC",textAlign:"center"}}>
      <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Composite Score</div>
      <div style={{fontSize:46,fontFamily:"Georgia,serif",color:"#C9963A",fontWeight:400,lineHeight:1,marginBottom:8}}>{lead.compositeScore}</div>
      <Pill label={lead.tier} color={tierColor(lead.tier)} size="lg"/>
    </div>
    <div style={{padding:"12px 16px 6px"}}>
      <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Dimension Scores</div>
      {DIMS.map(dim=>{
        const score=lead.scores[dim.key]??0,bc=bandColor(score);
        return <div key={dim.key} style={{marginBottom:11}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:11.5,color:"#1A1A2E"}}>{dim.label}</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:9.5,padding:"1px 5px",borderRadius:3,background:`${bc}15`,color:bc,border:`1px solid ${bc}35`}}>{bandLabel(score)}</span>
              <span style={{fontSize:12,fontWeight:500,color:"#1A1A2E",minWidth:22,textAlign:"right"}}>{score}</span>
            </div>
          </div>
          <div style={{height:4,background:"#F0EBE3",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${score}%`,background:bc,borderRadius:3}}/>
          </div>
        </div>;
      })}
    </div>
    <div style={{padding:"8px 16px 14px"}}>
      <button onClick={onViewAssessment} style={{width:"100%",padding:"8px",borderRadius:5,border:"0.5px solid #C9963A",background:"transparent",color:"#C9963A",fontSize:11.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
        View full assessment <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </div>;
}

function ActivityLog({entries}){
  if(!entries.length) return <div style={{fontSize:12,color:"#B8B0A8",fontStyle:"italic",padding:"8px 0"}}>No activity recorded.</div>;
  return <div style={{display:"flex",flexDirection:"column"}}>
    {entries.map((entry,idx)=>(
      <div key={entry.id||idx} style={{display:"flex",gap:12,paddingBottom:14}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:entry.isNew?"#C9963A":"#C8BFDA",border:entry.isNew?"2px solid #EDD98A":"2px solid #E0D8CC",flexShrink:0,marginTop:2}}/>
          {idx<entries.length-1&&<div style={{width:1,flex:1,background:"#E8E2D8",marginTop:4,minHeight:18}}/>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"#B8B0A8",marginBottom:2}}>{fmtDateTime(entry.ts)}</div>
          <div style={{fontSize:12.5,color:entry.isNew?"#1A1A2E":"#4A4060",fontWeight:entry.isNew?500:400,lineHeight:1.45}}>{entry.text}</div>
        </div>
      </div>
    ))}
  </div>;
}

function LeadDetail({lead:initialLead,onBack,onViewAssessment}){
  const [lead,setLead]=useState(initialLead);
  const [activityLog,setActivityLog]=useState(()=>seedActivityLog(initialLead));
  const [showEmailModal,setShowEmailModal]=useState(false);
  const [notesDraft,setNotesDraft]=useState(initialLead.adminNotes||"");
  const [noteSaved,setNoteSaved]=useState(false);
  const [copiedEmail,setCopiedEmail]=useState(false);

  const handleStageChange=newStage=>{
    const prev=lead.leadStage;
    if(newStage===prev) return;
    setLead(l=>({...l,leadStage:newStage}));
    setActivityLog(p=>[{id:`evt_stage_${Date.now()}`,ts:nowISO(),text:`Stage changed from ${prev} to ${newStage}`,isNew:true},...p]);
  };
  const handleSaveNotes=()=>{
    setLead(l=>({...l,adminNotes:notesDraft}));
    setActivityLog(p=>[{id:`evt_note_${Date.now()}`,ts:nowISO(),text:`Note saved: "${notesDraft.slice(0,60)}${notesDraft.length>60?"…":""}"`,isNew:true},...p]);
    setNoteSaved(true);setTimeout(()=>setNoteSaved(false),2000);
  };
  const handleCopyEmail=()=>{try{navigator.clipboard.writeText(lead.email);}catch(e){}setCopiedEmail(true);setTimeout(()=>setCopiedEmail(false),1800);};
  const sc=stageColor(lead.leadStage);

  return <div style={{padding:"1.75rem 2rem 3rem",fontFamily:"system-ui,sans-serif",minHeight:"100%",boxSizing:"border-box"}}>
    {/* Header */}
    <div style={{marginBottom:"1.5rem"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#9880B0",cursor:"pointer",fontSize:12.5,padding:"0 0 10px",display:"flex",alignItems:"center",gap:5}}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>Back to Pipeline
      </button>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:4}}>
            <h1 style={{fontSize:22,fontWeight:400,color:"#1A1A2E",margin:0,fontFamily:"Georgia,serif"}}>{lead.country}</h1>
            {lead.requestedTier&&<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,border:"1px solid #C9963A",color:"#C9963A",background:"transparent",fontWeight:500}}>{lead.requestedTier} requested</span>}
          </div>
          <p style={{margin:0,fontSize:13,color:"#6B6577"}}>{lead.respondentName} · {lead.title}</p>
          <p style={{margin:"2px 0 0",fontSize:12,color:"#9880B0"}}>{lead.ministry}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:7,flexShrink:0}}>
          <div style={{fontSize:10.5,color:"#9880B0",letterSpacing:"0.04em",textTransform:"uppercase"}}>Lead Stage</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <StageBadge stage={lead.leadStage}/>
            <select value={lead.leadStage} onChange={e=>handleStageChange(e.target.value)} style={{padding:"5px 28px 5px 10px",borderRadius:5,border:`1px solid ${sc}50`,background:"#FFFFFF",color:"#1A1A2E",fontSize:12,cursor:"pointer",outline:"none",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6577' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center"}}>
              {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>

    <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
      {/* Left column */}
      <div style={{flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",gap:16}}>
        {/* Contact card */}
        <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
          <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Contact Details</div>
          <div style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0",borderBottom:"0.5px solid #F0EBE3",marginBottom:2}}>
            <span style={{fontSize:11.5,color:"#9880B0",width:140,flexShrink:0}}>Email</span>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <a href={`mailto:${lead.email}`} style={{fontSize:12.5,color:"#4A7AE0",textDecoration:"none"}}>{lead.email}</a>
              <button onClick={handleCopyEmail} style={{background:"none",border:"none",cursor:"pointer",color:copiedEmail?"#28A868":"#9880B0",padding:"2px",display:"flex",alignItems:"center",transition:"color 0.2s"}}>
                {copiedEmail?<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>:<CopyIcon/>}
              </button>
            </div>
          </div>
          <MetaRowC2 label="Ministry" value={lead.ministry}/>
          <MetaRowC2 label="Development Stage" value={lead.developmentStage}/>
          <MetaRowC2 label="Assessment Completed" value={fmtDateTime(lead.completedAt)}/>
          <MetaRowC2 label="Upgrade Requested" value={lead.requestedTier||"—"}/>
          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
            <button onClick={()=>setShowEmailModal(v=>!v)} style={{padding:"8px 14px",borderRadius:5,border:"none",background:showEmailModal?"#9880B0":"#C9963A",color:"#FFF",fontSize:12,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"background 0.15s"}}>
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9Z" stroke="white" strokeWidth="1.4"/><path d="m2 6 8 5.5L18 6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
              {showEmailModal?"Hide email draft":"Draft introduction email"}
            </button>
            <button onClick={()=>onViewAssessment(lead)} style={{padding:"8px 14px",borderRadius:5,border:"0.5px solid #E0D8CC",background:"transparent",color:"#1A1A2E",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              View full assessment <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
        {showEmailModal&&<EmailModal lead={lead} onClose={()=>setShowEmailModal(false)}/>}

        {/* Admin notes */}
        <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
          <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Admin Notes</div>
          <textarea value={notesDraft} onChange={e=>setNotesDraft(e.target.value)} placeholder="Add internal notes…" rows={4} style={{width:"100%",boxSizing:"border-box",padding:"9px 11px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12.5,color:"#1A1A2E",background:"#FDFBF8",lineHeight:1.6,resize:"vertical",outline:"none"}}/>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
            <button onClick={handleSaveNotes} disabled={notesDraft===lead.adminNotes} style={{padding:"7px 16px",borderRadius:5,border:"none",background:noteSaved?"#28A868":notesDraft!==lead.adminNotes?"#C9963A":"#E0D8CC",color:notesDraft!==lead.adminNotes||noteSaved?"#FFF":"#9880B0",fontSize:12,fontWeight:500,cursor:notesDraft!==lead.adminNotes?"pointer":"default",transition:"background 0.2s",display:"flex",alignItems:"center",gap:5}}>
              {noteSaved?<><svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved</>:"Save note"}
            </button>
          </div>
        </div>

        {/* Activity log */}
        <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em"}}>Activity Log</div>
            <span style={{fontSize:10.5,color:"#B8B0A8",background:"#F7F4EF",border:"0.5px solid #E0D8CC",borderRadius:10,padding:"2px 8px"}}>{activityLog.length} event{activityLog.length!==1?"s":""}</span>
          </div>
          <ActivityLog entries={activityLog}/>
        </div>
      </div>

      {/* Right sidebar */}
      <div style={{width:256,flexShrink:0}}>
        <ScoreSummarySidebar lead={lead} onViewAssessment={()=>onViewAssessment(lead)}/>
      </div>
    </div>
  </div>;
}

// ============================================================
// B2: SUBMISSION DETAIL COMPONENTS
// ============================================================
function RadarChart({scores}){
  const cx=185,cy=165,r=118;
  const dimOrder=["compute","capital","regulatory","data","di"];
  const dimLabels=["Compute","Capital","Regulatory","Data","DI Maturity"];
  const angle=i=>-Math.PI/2+(i*2*Math.PI)/5;
  const pt=(val,i,radius)=>{const a=angle(i),scale=Math.max(0,Math.min(100,val))/100;return[cx+scale*radius*Math.cos(a),cy+scale*radius*Math.sin(a)];};
  const gridPoly=pct=>dimOrder.map((_,i)=>pt(pct*100,i,r).join(",")).join(" ");
  const scorePoly=dimOrder.map((d,i)=>pt(scores[d]||0,i,r).join(",")).join(" ");
  const labelAnchor=i=>{const a=angle(i)*(180/Math.PI);if(a>-100&&a<-80)return"middle";if(a>=-80&&a<=30)return"start";if(a>30&&a<150)return"middle";return"end";};
  const labelDy=i=>{const a=angle(i)*(180/Math.PI);if(a>-100&&a<-80)return-6;if(a>30&&a<150)return 14;return 4;};
  return <svg width="370" height="310" viewBox="0 0 370 310" style={{display:"block"}}>
    {[0.25,0.5,0.75,1].map(pct=><polygon key={pct} points={gridPoly(pct)} fill="none" stroke={pct===1?"#D4CCBE":"#E8E2DA"} strokeWidth={pct===1?"0.75":"0.5"}/>)}
    {dimOrder.map((_,i)=>{const[x,y]=pt(100,i,r);return<line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E0D8CC" strokeWidth="0.5"/>;} )}
    <polygon points={scorePoly} fill="#C9963A" fillOpacity="0.18" stroke="#C9963A" strokeWidth="1.75" strokeLinejoin="round"/>
    {dimOrder.map((d,i)=>{const[x,y]=pt(scores[d]||0,i,r);return<circle key={i} cx={x} cy={y} r={3.5} fill="#C9963A" stroke="#FFFFFF" strokeWidth="1.5"/>;} )}
    {[25,50,75].map(v=>{const[x,y]=pt(v,0,r);return<text key={v} x={x+5} y={y} fontSize="9" fill="#B8B0A8" dominantBaseline="middle">{v}</text>;})}
    {dimOrder.map((d,i)=>{const lRadius=r+26,a=angle(i),lx=cx+lRadius*Math.cos(a),ly=cy+lRadius*Math.sin(a),sc=scores[d]||0;return<g key={i}><text x={lx} y={ly+labelDy(i)} textAnchor={labelAnchor(i)} dominantBaseline="middle" fontSize="11" fontFamily="system-ui,sans-serif" fill="#1A1A2E" fontWeight="500">{dimLabels[i]}</text><text x={lx} y={ly+labelDy(i)+13} textAnchor={labelAnchor(i)} dominantBaseline="middle" fontSize="10" fontFamily="Georgia,serif" fill={bandColor(sc)}>{sc}</text></g>;})}
  </svg>;
}

function OrgProfileCard({sub}){
  const rows=[
    {label:"Country",value:sub.country},{label:"Respondent",value:sub.respondentName},
    {label:"Title",value:sub.title},{label:"Ministry",value:sub.ministry},
    {label:"Email",value:<a href={`mailto:${sub.email}`} style={{color:"#4A7AE0",textDecoration:"none"}}>{sub.email}</a>},
    {label:"Development Stage",value:sub.developmentStage},
    {label:"Completed",value:`${fmtDate(sub.completedAt)} at ${fmtTime(sub.completedAt)} UTC`},
  ];
  return <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden",marginBottom:14}}>
    <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
      <span style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em"}}>Organisation Profile</span>
    </div>
    <div style={{padding:"6px 0"}}>
      {rows.map((row,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",padding:"8px 16px",borderBottom:i<rows.length-1?"0.5px solid #F0EBE3":"none"}}>
        <div style={{width:148,flexShrink:0,fontSize:12,color:"#6B6577",paddingTop:1}}>{row.label}</div>
        <div style={{fontSize:13,color:"#1A1A2E",flex:1}}>{row.value}</div>
      </div>)}
    </div>
  </div>;
}

function DimensionScoresPanel({scores}){
  return <div style={{marginBottom:14}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:14}}>
      {DIMS.map(dim=>{const s=scores[dim.key]||0,bc=bandColor(s);return<div key={dim.key} style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"14px 14px 12px",textAlign:"center"}}>
        <div style={{fontSize:11,color:"#6B6577",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8,lineHeight:1.3}}>{dim.label.replace("Directed Intelligence","Dir. Intelligence")}</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:28,color:bc,lineHeight:1,marginBottom:9}}>{s}</div>
        <Pill label={bandLabel(s)} color={bc}/>
      </div>;})}
    </div>
    <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"16px 20px 10px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em",alignSelf:"flex-start",marginBottom:2}}>Dimension Radar</div>
      <RadarChart scores={scores}/>
    </div>
  </div>;
}

function QAAccordion({answers}){
  const [open,setOpen]=useState({});
  const toggle=key=>setOpen(prev=>({...prev,[key]:!prev[key]}));
  return <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden",marginBottom:14}}>
    <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
      <span style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em"}}>Assessment Responses</span>
    </div>
    {DIMS.map((dim,di)=>{
      const questions=QUESTION_BANK.filter(q=>q.dim===dim.qKey);
      const dimScore=Math.round(questions.reduce((acc,q)=>acc+(answers[q.id]||0),0)/questions.length);
      const isOpen=!!open[dim.key];
      return <div key={dim.key} style={{borderBottom:di<DIMS.length-1?"0.5px solid #E8E2DA":"none"}}>
        <button onClick={()=>toggle(dim.key)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:isOpen?"#FAFAF8":"transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"background 0.12s"}}>
          <span style={{fontSize:13,color:isOpen?"#C9963A":"#5A4A7A",fontWeight:500,width:16,flexShrink:0,transition:"transform 0.18s",display:"inline-block",transform:isOpen?"rotate(90deg)":"rotate(0deg)"}}>›</span>
          <span style={{fontSize:13,fontWeight:500,color:"#1A1A2E",flex:1}}>{dim.label}</span>
          <span style={{fontSize:11,color:"#9880B0",marginRight:8}}>{questions.length} questions</span>
          <Pill label={bandLabel(dimScore)} color={bandColor(dimScore)}/>
        </button>
        {isOpen&&<div style={{borderTop:"0.5px solid #F0EBE3"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#F0EBE3"}}>
              <th style={{padding:"7px 16px",fontSize:10.5,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.07em",textAlign:"left",width:40}}>#</th>
              <th style={{padding:"7px 12px",fontSize:10.5,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.07em",textAlign:"left",width:"28%"}}>Question</th>
              <th style={{padding:"7px 12px",fontSize:10.5,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.07em",textAlign:"left"}}>Response</th>
              <th style={{padding:"7px 16px",fontSize:10.5,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.07em",textAlign:"center",width:60}}>Score</th>
            </tr></thead>
            <tbody>{questions.map((q,qi)=>{
              const score=answers[q.id]||0,sc=qScoreColor(score),answer=getAnswerLabel(q.id,score),qNum=parseInt(q.id.replace("q",""),10);
              return <tr key={q.id} style={{borderBottom:"0.5px solid #F0EBE3",background:qi%2===0?"#FFFFFF":"#FDFCFB"}}>
                <td style={{padding:"9px 16px",fontSize:11,color:"#9880B0",fontWeight:500,verticalAlign:"top"}}>Q{qNum}</td>
                <td style={{padding:"9px 12px",verticalAlign:"top"}}><span title={q.text} style={{fontSize:12,color:"#1A1A2E",lineHeight:1.45,display:"block"}}>{q.text.length>62?q.text.slice(0,62)+"…":q.text}</span></td>
                <td style={{padding:"9px 12px",verticalAlign:"top"}}><span style={{fontSize:12,color:"#4A3F6B",lineHeight:1.45}}>{answer}</span></td>
                <td style={{padding:"9px 16px",textAlign:"center",verticalAlign:"top"}}><span style={{fontFamily:"Georgia,serif",fontSize:14,color:sc}}>{score}</span></td>
              </tr>;
            })}</tbody>
          </table>
        </div>}
      </div>;
    })}
  </div>;
}

function AdminToolsPanel({submission,onUpdateSub,onViewLead,showToast}){
  const [noteText,setNoteText]=useState(submission.adminNotes||"");
  const [noteSaved,setNoteSaved]=useState(false);
  const handleSaveNote=()=>{onUpdateSub({adminNotes:noteText});setNoteSaved(true);showToast("Note saved");setTimeout(()=>setNoteSaved(false),2500);};
  const handleConvertLead=()=>{onUpdateSub({upgradeStatus:"requested",leadStage:"New"});showToast("Converted to lead");};
  const handleStageChange=e=>{onUpdateSub({leadStage:e.target.value});showToast("Lead stage updated");};
  return <div style={{position:"sticky",top:20}}>
    {/* Notes */}
    <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden",marginBottom:12}}>
      <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
        <span style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em"}}>Admin Notes</span>
      </div>
      <div style={{padding:"14px 16px"}}>
        <textarea value={noteText} onChange={e=>{setNoteText(e.target.value);setNoteSaved(false);}} placeholder="Add notes about this respondent…" rows={5} style={{width:"100%",padding:"9px 10px",background:"#FAFAF8",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12.5,color:"#1A1A2E",lineHeight:1.55,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
        <button onClick={handleSaveNote} style={{marginTop:8,padding:"7px 14px",background:noteSaved?"#28A86815":"#C9963A",border:noteSaved?"0.5px solid #28A868":"none",borderRadius:5,color:noteSaved?"#28A868":"#06030E",fontSize:12.5,fontWeight:500,cursor:"pointer",transition:"all 0.18s"}}>
          {noteSaved?"✓ Saved":"Save note"}
        </button>
      </div>
    </div>
    {/* Lead management */}
    <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden",marginBottom:12}}>
      <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
        <span style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em"}}>Lead Management</span>
      </div>
      <div style={{padding:"14px 16px"}}>
        {submission.upgradeStatus==="none"?<div>
          <p style={{fontSize:12,color:"#6B6577",margin:"0 0 12px",lineHeight:1.5}}>No upgrade requested. Convert to begin engagement.</p>
          <button onClick={handleConvertLead} style={{padding:"8px 14px",background:"transparent",border:"0.5px solid #C9963A",borderRadius:5,color:"#C9963A",fontSize:12.5,fontWeight:500,cursor:"pointer"}}>Convert to lead →</button>
        </div>:<div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#28A868",flexShrink:0}}/>
            <span style={{fontSize:12,color:"#28A868"}}>Active lead</span>
            {submission.requestedTier&&<span style={{fontSize:11,color:"#9880B0"}}>— Requested {submission.requestedTier}</span>}
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:11,color:"#6B6577",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Lead Stage</label>
            <select value={submission.leadStage} onChange={handleStageChange} style={{appearance:"none",WebkitAppearance:"none",width:"100%",padding:"8px 28px 8px 10px",background:"#FFFFFF",border:`0.5px solid ${stageColor(submission.leadStage)}60`,borderRadius:5,fontSize:12.5,color:"#1A1A2E",cursor:"pointer",outline:"none"}}>
              {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={onViewLead} style={{padding:"7px 14px",background:"transparent",border:"0.5px solid #4A7AE0",borderRadius:5,color:"#4A7AE0",fontSize:12.5,fontWeight:500,cursor:"pointer"}}>← Back to lead record</button>
        </div>}
      </div>
    </div>
    {/* Quick reference */}
    <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden"}}>
      <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
        <span style={{fontSize:11,fontWeight:500,color:"#6B6577",textTransform:"uppercase",letterSpacing:"0.08em"}}>Quick Reference</span>
      </div>
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {DIMS.map(dim=>{const s=submission.scores[dim.key]||0;return<div key={dim.key}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{fontSize:11,color:"#6B6577"}}>{dim.label}</span>
            <span style={{fontSize:11,fontFamily:"Georgia,serif",color:bandColor(s)}}>{s}</span>
          </div>
          <div style={{height:4,background:"#F0EBE3",borderRadius:2}}>
            <div style={{height:"100%",width:`${s}%`,background:bandColor(s),borderRadius:2,transition:"width 0.3s ease"}}/>
          </div>
        </div>;})}
      </div>
    </div>
  </div>;
}

function SubmissionDetail({submission,onUpdateSub,onBack,onViewLead,showToast}){
  const tc=tierColor(submission.tier);
  return <div style={{minHeight:"100vh",background:"#F7F4EF",fontFamily:"system-ui,sans-serif"}}>
    {/* Page header */}
    <div style={{background:"#FFFFFF",borderBottom:"0.5px solid #E0D8CC",padding:"14px 24px 0"}}>
      <button onClick={onBack} style={{display:"inline-flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:"#9880B0",fontSize:12,padding:0,marginBottom:12}}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back to Lead Record
      </button>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",paddingBottom:16}}>
        <div style={{flex:1,marginRight:24}}>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:400,color:"#1A1A2E",margin:"0 0 4px"}}>{submission.country}</h1>
          <div style={{fontSize:13,color:"#1A1A2E",marginBottom:2}}>{submission.respondentName}</div>
          <div style={{fontSize:12,color:"#6B6577"}}>{submission.title} · {submission.ministry}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:36,lineHeight:1,color:"#C9963A"}}>{submission.compositeScore}</div>
              <div style={{fontSize:10,color:"#9880B0",marginTop:2}}>Composite Score</div>
            </div>
            <Pill label={submission.tier} color={tc} size="lg"/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:11,color:"#9880B0"}}>{fmtDate(submission.completedAt)}</span>
            <button onClick={()=>showToast("Export PDF queued")} style={{padding:"5px 12px",background:"transparent",border:"0.5px solid #C8C0B0",borderRadius:5,color:"#6B6577",fontSize:12,cursor:"pointer"}}>Export PDF ↗</button>
          </div>
        </div>
      </div>
    </div>

    {/* Upgrade banner */}
    {submission.upgradeStatus==="requested"&&<div style={{background:"#FFFBF2",border:"0.5px solid #C9963A",borderLeft:"3px solid #C9963A",margin:"16px 24px 0",borderRadius:6,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:"#C9963A",flexShrink:0}}/>
        <span style={{fontSize:12.5,color:"#7A5A1A"}}>This respondent has requested a <strong>{submission.requestedTier}</strong> upgrade</span>
      </div>
      <button onClick={onViewLead} style={{background:"none",border:"none",cursor:"pointer",color:"#C9963A",fontSize:12.5,fontWeight:500,padding:0,flexShrink:0}}>View lead record →</button>
    </div>}

    {/* Body */}
    <div style={{display:"flex",gap:16,padding:"16px 24px 32px",alignItems:"flex-start"}}>
      <div style={{flex:1,minWidth:0}}>
        <OrgProfileCard sub={submission}/>
        <DimensionScoresPanel scores={submission.scores}/>
        <QAAccordion answers={submission.answers}/>
      </div>
      <div style={{width:280,flexShrink:0}}>
        <AdminToolsPanel submission={submission} onUpdateSub={onUpdateSub} onViewLead={onViewLead} showToast={showToast}/>
      </div>
    </div>
  </div>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function LeadDetailCombined(){
  const [submissions,setSubmissions]=useState(DEMO_SUBMISSIONS_INIT);
  const [selectedId,setSelectedId]=useState("sub_001");
  const [page,setPage]=useState("leadDetail");
  const [toast,setToast]=useState({visible:false,msg:""});

  const showToast=msg=>{setToast({visible:true,msg});setTimeout(()=>setToast({visible:false,msg:""}),2800);};
  const updateSub=patch=>setSubmissions(prev=>prev.map(s=>s.id===selectedId?{...s,...patch}:s));
  const submission=submissions.find(s=>s.id===selectedId)||submissions[0];

  const shortName=c=>c.replace("Republic of ","").replace("Federal Republic of ","").replace("Kingdom of ","").replace("United Arab Emirates","UAE");

  return <div style={{display:"flex",minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",background:"#F7F4EF"}}>
    {/* Content area */}
    <div style={{flex:1,minWidth:0,overflowY:"auto",minHeight:"100vh"}}>
      {/* Lead switcher strip */}
      <div style={{background:"#FFFFFF",borderBottom:"0.5px solid #E0D8CC",padding:"8px 2rem",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",position:"sticky",top:0,zIndex:100}}>
        <span style={{fontSize:11,color:"#9880B0",marginRight:4,whiteSpace:"nowrap",flexShrink:0}}>Preview lead:</span>
        {DEMO_SUBMISSIONS_INIT.map((s,i)=>{
          const isActive = s.id === selectedId;
          return (
            <button key={s.id} onClick={()=>{setSelectedId(s.id);setPage("leadDetail");}} style={{padding:"4px 11px",borderRadius:20,fontSize:11.5,cursor:"pointer",border:"0.5px solid",borderColor:isActive?"#C9963A":"#E0D8CC",background:isActive?"#C9963A":"transparent",color:isActive?"#FFF":"#6B6577",transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"system-ui,sans-serif"}}>
              {shortName(s.country)}
            </button>
          );
        })}
        <span style={{marginLeft:"auto",fontSize:11,color:"#C8C0B0",background:"#F7F4EF",padding:"3px 10px",borderRadius:4,whiteSpace:"nowrap"}}>
          {page==="leadDetail"?"C2: Lead Detail":"B2: Full Assessment"}
        </span>
      </div>

      {page==="leadDetail"
        ? <LeadDetail
            lead={submission}
            onBack={()=>window.location.href='/leadspipeline'}
            onViewAssessment={()=>setPage("submissionDetail")}
          />
        : <SubmissionDetail
            submission={submission}
            onUpdateSub={updateSub}
            onBack={()=>setPage("leadDetail")}
            onViewLead={()=>setPage("leadDetail")}
            showToast={showToast}
          />
      }

      <Toast visible={toast.visible} msg={toast.msg}/>
    </div>
  </div>;
}

export default LeadDetailCombined;
