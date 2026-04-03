import { useState, useCallback, useRef, useEffect } from "react";

// ============================================================
// SEED: FULL QUESTION BANK (all 30 questions)
// ============================================================
const INITIAL_QUESTIONS = [
  // ── D1: Compute Capacity (Q1–Q5) ─────────────────────────
  {
    id:"Q1", dimIndex:0, number:1,
    text:"What is your nation's current sovereign GPU/TPU compute capacity dedicated to AI workloads?",
    options:[
      {letter:"A", text:"No dedicated sovereign AI compute infrastructure exists", score:10},
      {letter:"B", text:"Early-stage capacity below 100 petaFLOPs, primarily leased", score:25},
      {letter:"C", text:"Moderate capacity of 100–2,000 petaFLOPs, mixed ownership", score:50},
      {letter:"D", text:"Substantial capacity of 2,000–10,000 petaFLOPs, majority sovereign", score:75},
      {letter:"E", text:"World-class capacity exceeding 10,000 petaFLOPs, fully sovereign", score:95},
    ],
  },
  {
    id:"Q2", dimIndex:0, number:2,
    text:"How is your nation's AI compute infrastructure primarily owned and operated?",
    options:[
      {letter:"A", text:"No domestic AI infrastructure; entirely reliant on foreign cloud providers", score:10},
      {letter:"B", text:"Foreign-owned infrastructure hosted domestically under commercial agreements", score:25},
      {letter:"C", text:"Mixed model: majority foreign-owned with nascent domestic investment", score:50},
      {letter:"D", text:"Majority nationally owned or operated under public-private frameworks", score:75},
      {letter:"E", text:"Fully sovereign, state-controlled compute with no critical foreign dependencies", score:95},
    ],
  },
  {
    id:"Q3", dimIndex:0, number:3,
    text:"What is the current status of your national AI compute infrastructure roadmap?",
    options:[
      {letter:"A", text:"No roadmap exists; AI infrastructure planning has not commenced", score:10},
      {letter:"B", text:"A roadmap is under development but not yet published", score:35},
      {letter:"C", text:"Roadmap published but without committed government funding", score:50},
      {letter:"D", text:"Roadmap published, partially funded, and in early implementation", score:70},
      {letter:"E", text:"Roadmap fully funded, actively deployed, with progress metrics published", score:95},
    ],
  },
  {
    id:"Q4", dimIndex:0, number:4,
    text:"How does your nation's compute capacity compare to demand from current and planned government AI programmes?",
    options:[
      {letter:"A", text:"No sovereign capacity and no government AI programmes in operation", score:10},
      {letter:"B", text:"Severe shortage; government AI programmes rely entirely on foreign cloud", score:25},
      {letter:"C", text:"Moderate shortage; partial domestic coverage with strategic gaps", score:50},
      {letter:"D", text:"Near-sufficient; minor gaps in specialised or high-performance workloads", score:75},
      {letter:"E", text:"Surplus capacity enabling regional AI hosting and international partnerships", score:95},
    ],
  },
  {
    id:"Q5", dimIndex:0, number:5,
    text:"What is your nation's energy infrastructure readiness to support large-scale AI compute facilities?",
    options:[
      {letter:"A", text:"Critical energy infrastructure gaps; no AI data centre strategy in place", score:10},
      {letter:"B", text:"Early planning underway; no dedicated AI energy capacity", score:25},
      {letter:"C", text:"Existing data centre infrastructure being retrofitted for AI workloads", score:50},
      {letter:"D", text:"Purpose-built AI-ready data centre capacity operational in key locations", score:75},
      {letter:"E", text:"World-class, renewable-powered AI compute estates with redundancy guarantees", score:95},
    ],
  },

  // ── D2: Capital Formation (Q6–Q11) ───────────────────────
  {
    id:"Q6", dimIndex:1, number:6,
    text:"What is the scale of your nation's annual public investment in AI research, development, and infrastructure?",
    options:[
      {letter:"A", text:"Negligible or no dedicated public AI investment budget", score:10},
      {letter:"B", text:"Under USD 50 million per year; ad hoc project funding only", score:25},
      {letter:"C", text:"USD 50–500 million per year with a defined investment programme", score:50},
      {letter:"D", text:"USD 500 million – 2 billion per year with multi-year commitments", score:75},
      {letter:"E", text:"Over USD 2 billion per year; AI is a national economic priority", score:95},
    ],
  },
  {
    id:"Q7", dimIndex:1, number:7,
    text:"Does your nation have a dedicated sovereign AI investment vehicle or national AI fund?",
    options:[
      {letter:"A", text:"No sovereign investment vehicle exists for AI", score:10},
      {letter:"B", text:"AI investments made on an ad hoc basis through existing structures", score:25},
      {letter:"C", text:"A dedicated AI fund is under development or at pilot stage", score:50},
      {letter:"D", text:"A national AI fund exists with committed capital and active deployment", score:75},
      {letter:"E", text:"Multiple AI investment vehicles operate with mandated returns and strategic targets", score:95},
    ],
  },
  {
    id:"Q8", dimIndex:1, number:8,
    text:"What is the state of private venture capital and institutional investment in domestic AI companies?",
    options:[
      {letter:"A", text:"No meaningful private investment ecosystem for domestic AI", score:10},
      {letter:"B", text:"Very limited; fewer than 5 AI-focused VCs or funds operating domestically", score:25},
      {letter:"C", text:"Growing ecosystem; 5–20 active investors with AI mandates", score:50},
      {letter:"D", text:"Mature ecosystem; significant institutional capital with AI sector specialisation", score:75},
      {letter:"E", text:"Global-tier ecosystem; your nation is a recognised AI investment destination", score:95},
    ],
  },
  {
    id:"Q9", dimIndex:1, number:9,
    text:"Does your nation operate a national AI procurement policy for government agencies?",
    options:[
      {letter:"A", text:"No AI procurement framework; agencies procure ad hoc without guidance", score:10},
      {letter:"B", text:"General IT procurement rules applied informally to AI; no AI-specific policy", score:25},
      {letter:"C", text:"AI procurement guidelines under development or in draft", score:50},
      {letter:"D", text:"Enacted AI procurement policy with preference for sovereign or vetted suppliers", score:75},
      {letter:"E", text:"Comprehensive AI procurement framework with compliance monitoring and reporting", score:95},
    ],
  },
  {
    id:"Q10", dimIndex:1, number:10,
    text:"What proportion of your nation's AI spending is captured by domestically owned companies?",
    options:[
      {letter:"A", text:"Less than 10%; almost entirely foreign suppliers", score:10},
      {letter:"B", text:"10–25%; small domestic share with limited local capacity", score:25},
      {letter:"C", text:"25–50%; growing domestic sector, still minority of total spend", score:50},
      {letter:"D", text:"50–75%; domestic companies are the primary AI suppliers to government", score:75},
      {letter:"E", text:"Over 75%; domestic AI industry dominant with active export capability", score:95},
    ],
  },
  {
    id:"Q11", dimIndex:1, number:11,
    text:"What is the maturity of your nation's AI startup and scale-up ecosystem?",
    options:[
      {letter:"A", text:"No recognisable AI startup ecosystem; isolated or no AI companies", score:10},
      {letter:"B", text:"Nascent; fewer than 20 AI companies, mostly pre-revenue", score:25},
      {letter:"C", text:"Developing; 20–100 AI companies, some at scale with government contracts", score:50},
      {letter:"D", text:"Advanced; 100+ AI companies including national champions and exporters", score:75},
      {letter:"E", text:"Leading; globally recognised AI companies headquartered in your nation", score:95},
    ],
  },

  // ── D3: Regulatory Readiness (Q12–Q18) ───────────────────
  {
    id:"Q12", dimIndex:2, number:12,
    text:"Does your nation have an enacted National AI Strategy with measurable implementation targets?",
    options:[
      {letter:"A", text:"No national AI strategy exists", score:10},
      {letter:"B", text:"Strategy under development; not yet publicly released", score:25},
      {letter:"C", text:"Strategy published but without binding implementation targets or budget", score:50},
      {letter:"D", text:"Strategy enacted with defined targets and partial government funding", score:70},
      {letter:"E", text:"Strategy fully operationalised with annual reporting and budget appropriation", score:95},
    ],
  },
  {
    id:"Q13", dimIndex:2, number:13,
    text:"What is the status of AI-specific legislation or regulatory frameworks in your jurisdiction?",
    options:[
      {letter:"A", text:"No AI-specific legislation; existing laws applied without guidance", score:10},
      {letter:"B", text:"Policy discussion underway; no draft legislation published", score:25},
      {letter:"C", text:"Draft AI legislation or regulatory code published for consultation", score:50},
      {letter:"D", text:"AI regulatory framework enacted with compliance obligations for developers", score:75},
      {letter:"E", text:"Comprehensive AI law enacted with enforcement authority and international alignment", score:95},
    ],
  },
  {
    id:"Q14", dimIndex:2, number:14,
    text:"Does your nation have a dedicated AI regulatory authority or designated oversight body?",
    options:[
      {letter:"A", text:"No designated AI oversight body; no plans to establish one", score:10},
      {letter:"B", text:"AI oversight delegated informally to an existing regulator without mandate", score:25},
      {letter:"C", text:"An AI advisory body exists with limited authority", score:50},
      {letter:"D", text:"A dedicated AI regulatory office exists with defined powers", score:75},
      {letter:"E", text:"An independent AI authority operates with enforcement powers and international standing", score:95},
    ],
  },
  {
    id:"Q15", dimIndex:2, number:15,
    text:"How does your government approach AI ethics, safety, and responsible AI governance?",
    options:[
      {letter:"A", text:"No formal position or policy on AI ethics", score:10},
      {letter:"B", text:"Ethics principles referenced in strategy documents but not operationalised", score:25},
      {letter:"C", text:"AI ethics guidelines published; voluntary adoption by government agencies", score:50},
      {letter:"D", text:"Mandatory AI ethics assessments required for public sector AI deployments", score:75},
      {letter:"E", text:"Comprehensive responsible AI framework with independent audit and public accountability", score:95},
    ],
  },
  {
    id:"Q16", dimIndex:2, number:16,
    text:"What is the state of data protection legislation in your jurisdiction as it applies to AI systems?",
    options:[
      {letter:"A", text:"No data protection law; no AI-specific data use provisions", score:10},
      {letter:"B", text:"Basic data protection law exists but does not address AI-specific risks", score:25},
      {letter:"C", text:"Data protection law under modernisation to address AI and automated decisions", score:50},
      {letter:"D", text:"Modern data protection law with provisions for AI, profiling, and automated decisions", score:75},
      {letter:"E", text:"Leading data protection regime with AI-specific rules, adequacy recognition, and enforcement", score:95},
    ],
  },
  {
    id:"Q17", dimIndex:2, number:17,
    text:"Does your nation actively participate in international AI governance forums and standard-setting bodies?",
    options:[
      {letter:"A", text:"No participation in international AI governance processes", score:10},
      {letter:"B", text:"Observer status only; no active contributions to AI governance debates", score:25},
      {letter:"C", text:"Member of key forums; limited active contribution to standard-setting", score:50},
      {letter:"D", text:"Active participant with submitted positions and working group representation", score:75},
      {letter:"E", text:"Leadership role in international AI governance; host of major AI forums or standards bodies", score:95},
    ],
  },
  {
    id:"Q18", dimIndex:2, number:18,
    text:"How does your nation's legal framework address AI liability, intellectual property, and copyright for AI outputs?",
    options:[
      {letter:"A", text:"No legal framework addresses AI liability or IP; ambiguity is unresolved", score:10},
      {letter:"B", text:"Existing IP and liability law applied informally; no AI-specific guidance", score:25},
      {letter:"C", text:"Government guidance published but not yet enacted into law", score:50},
      {letter:"D", text:"Legislation amended or enacted to address AI-generated IP and liability", score:75},
      {letter:"E", text:"Comprehensive AI IP and liability regime with case law and international alignment", score:95},
    ],
  },

  // ── D4: Data Sovereignty (Q19–Q24) ───────────────────────
  {
    id:"Q19", dimIndex:3, number:19,
    text:"Does your nation have an enacted data localisation policy governing sensitive government and citizen data?",
    options:[
      {letter:"A", text:"No data localisation policy; sensitive data stored with foreign providers", score:10},
      {letter:"B", text:"Informal guidance exists but is not mandatory or enforced", score:25},
      {letter:"C", text:"Data localisation requirements apply to specific sectors (e.g. health, finance)", score:50},
      {letter:"D", text:"Comprehensive data localisation policy covers all sensitive government data", score:75},
      {letter:"E", text:"Sovereign data policy with active enforcement, audits, and penalty regime", score:95},
    ],
  },
  {
    id:"Q20", dimIndex:3, number:20,
    text:"What is the state of your national data infrastructure for AI — including data lakes, APIs, and interoperability?",
    options:[
      {letter:"A", text:"No national data infrastructure; data siloed across agencies with no sharing", score:10},
      {letter:"B", text:"Early-stage; limited datasets accessible; no interoperability standards", score:25},
      {letter:"C", text:"Developing; some national datasets accessible via APIs; partial standards adoption", score:50},
      {letter:"D", text:"Advanced; national data platform operational with cross-agency data sharing", score:75},
      {letter:"E", text:"World-class; unified national data infrastructure with open APIs and AI-ready datasets", score:95},
    ],
  },
  {
    id:"Q21", dimIndex:3, number:21,
    text:"Does your nation operate sovereign cloud infrastructure for storing and processing government data?",
    options:[
      {letter:"A", text:"No sovereign cloud; all government data processed on foreign commercial cloud", score:10},
      {letter:"B", text:"Hybrid arrangements; critical data on-premise, non-critical on foreign cloud", score:25},
      {letter:"C", text:"A government cloud programme is in development or early deployment", score:50},
      {letter:"D", text:"Operational sovereign cloud covering the majority of government workloads", score:75},
      {letter:"E", text:"Full sovereign cloud estate with security certification and regional offering", score:95},
    ],
  },
  {
    id:"Q22", dimIndex:3, number:22,
    text:"How does your nation manage cross-border data flows for the purposes of AI training and model development?",
    options:[
      {letter:"A", text:"No policy on cross-border AI data flows; no restrictions or frameworks", score:10},
      {letter:"B", text:"General data export rules applied; no AI-specific cross-border data policy", score:25},
      {letter:"C", text:"AI data flow policy under development; sector-specific restrictions in place", score:50},
      {letter:"D", text:"AI data flow framework with approved jurisdiction whitelist and transfer mechanisms", score:75},
      {letter:"E", text:"Comprehensive bilateral and multilateral data sharing agreements for AI; reciprocity enforced", score:95},
    ],
  },
  {
    id:"Q23", dimIndex:3, number:23,
    text:"What is the maturity of your national data standards, taxonomy, and metadata frameworks for AI readiness?",
    options:[
      {letter:"A", text:"No national data standards; agencies use incompatible schemas and formats", score:10},
      {letter:"B", text:"Limited standards adopted in one or two sectors; no cross-government framework", score:25},
      {letter:"C", text:"Draft national data standards published; adoption voluntary", score:50},
      {letter:"D", text:"National data standards enacted with mandatory adoption for public sector", score:75},
      {letter:"E", text:"AI-optimised national data standards with machine-readable schemas and global alignment", score:95},
    ],
  },
  {
    id:"Q24", dimIndex:3, number:24,
    text:"How are citizen data rights protected in the context of government AI applications?",
    options:[
      {letter:"A", text:"No citizen rights framework exists for AI-driven decisions", score:10},
      {letter:"B", text:"General human rights and privacy law apply; no AI-specific citizen rights", score:25},
      {letter:"C", text:"AI citizen rights guidance published; right to explanation informally recognised", score:50},
      {letter:"D", text:"Enacted rights to explanation, opt-out, and redress for AI-driven government decisions", score:75},
      {letter:"E", text:"Comprehensive AI citizen rights regime with independent oversight and enforcement", score:95},
    ],
  },

  // ── D5: Directed Intelligence Maturity (Q25–Q30) ─────────
  {
    id:"Q25", dimIndex:4, number:25,
    text:"How many active, production-grade AI deployments does your government currently operate across ministries?",
    options:[
      {letter:"A", text:"None; no production AI systems in government operation", score:10},
      {letter:"B", text:"1–5 pilot deployments; limited to one or two agencies", score:25},
      {letter:"C", text:"6–25 operational AI systems across multiple ministries", score:50},
      {letter:"D", text:"26–100 production AI systems with enterprise-grade governance", score:75},
      {letter:"E", text:"100+ AI systems; AI is embedded across the government operating model", score:95},
    ],
  },
  {
    id:"Q26", dimIndex:4, number:26,
    text:"Does your nation have dedicated AI capability within its national security, defence, and intelligence apparatus?",
    options:[
      {letter:"A", text:"No AI capability in national security; reliance on foreign intelligence tools", score:10},
      {letter:"B", text:"Early exploration; no operational AI in security or defence contexts", score:25},
      {letter:"C", text:"AI pilot programmes underway in defence or intelligence; limited operational use", score:50},
      {letter:"D", text:"Operational AI in national security with a dedicated programme and oversight", score:75},
      {letter:"E", text:"Advanced sovereign AI capability in defence and intelligence with export controls", score:95},
    ],
  },
  {
    id:"Q27", dimIndex:4, number:27,
    text:"What is the state of AI adoption in critical national services — health, education, taxation, and social protection?",
    options:[
      {letter:"A", text:"No AI in critical national services", score:10},
      {letter:"B", text:"Isolated pilots in one sector; not scaled or embedded in service delivery", score:25},
      {letter:"C", text:"AI operational in 2–3 sectors with measurable service improvement outcomes", score:50},
      {letter:"D", text:"AI embedded in 4+ critical sectors; central coordination with performance tracking", score:75},
      {letter:"E", text:"AI is foundational to national service delivery; AI-first government operating model", score:95},
    ],
  },
  {
    id:"Q28", dimIndex:4, number:28,
    text:"Does your nation have a national AI talent, skills, and workforce transformation programme?",
    options:[
      {letter:"A", text:"No national AI skills programme or workforce initiative", score:10},
      {letter:"B", text:"Ad hoc training; no coordinated national AI skills strategy", score:25},
      {letter:"C", text:"National AI skills programme launched; early enrolment and curriculum development", score:50},
      {letter:"D", text:"Operational programme with targets, funding, and employer partnerships", score:75},
      {letter:"E", text:"Leading national AI skills system; internationally recognised AI talent pipeline", score:95},
    ],
  },
  {
    id:"Q29", dimIndex:4, number:29,
    text:"What is the capability and global standing of your national AI research and academic ecosystem?",
    options:[
      {letter:"A", text:"No AI research capability; no universities with AI specialisation", score:10},
      {letter:"B", text:"Limited AI research; one or two universities with AI programmes, limited output", score:25},
      {letter:"C", text:"Growing AI research ecosystem; national AI research institute established", score:50},
      {letter:"D", text:"Advanced ecosystem; multiple AI institutes, published global research, government co-funding", score:75},
      {letter:"E", text:"World-leading AI research; institutions in global top-50, major publications and patents", score:95},
    ],
  },
  {
    id:"Q30", dimIndex:4, number:30,
    text:"How does your government measure, evaluate, and publicly report AI programme outcomes and societal impact?",
    options:[
      {letter:"A", text:"No measurement framework; AI programme outcomes are not tracked", score:10},
      {letter:"B", text:"Outputs tracked internally; no standardised metrics or public reporting", score:25},
      {letter:"C", text:"Measurement framework in development; limited external reporting", score:50},
      {letter:"D", text:"National AI dashboard or annual report with KPIs published to the public", score:75},
      {letter:"E", text:"World-class AI programme evaluation with independent audit and international benchmarking", score:95},
    ],
  },
];

// ============================================================
// SEED: INTERVENTION LIBRARY
// ============================================================
const INITIAL_INTERVENTIONS = {
  0: {
    low:[
      "Commission a national AI compute needs assessment with 3-year demand projections and identify anchor facility sites.",
      "Establish a bilateral compute partnership with a sovereign partner nation or multilateral AI compute consortium.",
      "Launch a national GPU procurement programme through a government-owned entity to seed domestic compute capacity.",
    ],
    medium:[
      "Develop a National Compute Roadmap with phased investment targets and annual milestone reporting.",
      "Create a government-to-industry compute access scheme to give domestic AI companies subsidised access to sovereign infrastructure.",
      "Launch an AI Data Centre Accelerator to attract private co-investment in nationally regulated compute facilities.",
    ],
    high:[
      "Publish a compute excess-capacity export strategy to position your nation as a regional AI infrastructure hub.",
      "Establish an AI Infrastructure Sovereign Fund to finance next-generation compute acquisition and energy infrastructure.",
      "Create a National AI Compute Reserve Policy ensuring strategic capacity is maintained for critical government workloads.",
    ],
  },
  1: {
    low:[
      "Establish a National AI Investment Office to coordinate public funding and attract private co-investment.",
      "Develop a 5-year public AI expenditure commitment to signal market confidence and attract foreign AI company investment.",
      "Launch a sovereign AI venture fund with government anchor capital to catalyse private sector participation.",
    ],
    medium:[
      "Introduce AI procurement preference policies that mandate evaluation of domestic AI suppliers in all government tenders.",
      "Create an AI Startup Accelerator with grant funding, access to government data, and fast-track procurement pathways.",
      "Establish an AI Export Credit Agency to support domestic AI companies entering international markets.",
    ],
    high:[
      "Develop a National AI Capital Formation Strategy targeting $1B+ in coordinated public-private AI investment over 5 years.",
      "Create an AI Special Economic Zone with tax incentives, streamlined regulation, and sovereign compute access.",
      "Launch a Sovereign AI Investment Fund with a mandate to acquire stakes in critical AI infrastructure and technology companies.",
    ],
  },
  2: {
    low:[
      "Establish an AI Policy Taskforce within the Cabinet Office to develop the National AI Strategy within 12 months.",
      "Publish interim AI governance guidelines for public sector agencies pending full legislation.",
      "Commission an international benchmarking study to identify best-practice AI regulatory models for adaptation.",
    ],
    medium:[
      "Enact AI-specific legislation with proportionate obligations for developers, deployers, and public sector users.",
      "Establish an independent AI Regulatory Authority with defined powers, budget, and international equivalence.",
      "Align national AI regulatory framework with international standards (ISO/IEC 42001, EU AI Act equivalence).",
    ],
    high:[
      "Bid to host an international AI governance secretariat or contribute a national AI governance model for global adoption.",
      "Establish a mandatory national AI impact assessment regime with public registry of deployed government AI systems.",
      "Create a National AI Safety Institute to conduct pre-deployment evaluations of high-risk AI systems.",
    ],
  },
  3: {
    low:[
      "Enact a Data Localisation Act requiring sensitive government and citizen data to be stored within national borders.",
      "Commission a national data audit to identify and classify all government datasets by sensitivity and AI readiness.",
      "Establish a National Data Office to coordinate data governance, standards, and access policy across ministries.",
    ],
    medium:[
      "Develop a Sovereign Government Cloud with domestic data centres and ISO 27001-certified security.",
      "Publish national data interoperability standards and mandate adoption across all public sector agencies within 24 months.",
      "Establish a National AI Training Dataset Programme to create high-quality, rights-cleared datasets for sovereign AI development.",
    ],
    high:[
      "Create a National Data Trust Framework enabling secure cross-sector data sharing for AI development under citizen consent.",
      "Negotiate bilateral AI Data Governance Agreements with strategic partner nations to enable reciprocal data flows.",
      "Launch a Citizen AI Data Rights Portal giving individuals full visibility and control over government AI use of their data.",
    ],
  },
  4: {
    low:[
      "Establish a Government AI Centre of Excellence to lead, coordinate, and accelerate AI deployment across ministries.",
      "Launch a National AI Workforce Reskilling Programme targeting 10,000 civil servants in the first phase.",
      "Mandate AI readiness assessments for all major government IT programmes as a procurement gateway.",
    ],
    medium:[
      "Deploy AI in 3 high-impact public services (health, tax, social protection) with measured service improvement targets.",
      "Create a National AI Evaluation Framework with mandatory annual reporting by departments on AI programme outcomes.",
      "Establish a Government AI Procurement Fast-Track to reduce time-to-deployment from 24 months to under 6 months.",
    ],
    high:[
      "Develop a National AI Operating Model where AI is embedded as standard in all government service design from inception.",
      "Establish a Sovereign AI Research Alliance with leading universities and publish a 10-year national AI research agenda.",
      "Create an AI Diplomacy Programme positioning your nation's AI governance model as a preferred framework for partner countries.",
    ],
  },
};

const DIMS = [
  {label:"D1 Compute",     full:"Compute Capacity"},
  {label:"D2 Capital",     full:"Capital Formation"},
  {label:"D3 Regulatory",  full:"Regulatory Readiness"},
  {label:"D4 Data Sov.",   full:"Data Sovereignty"},
  {label:"D5 DI Maturity", full:"Directed Intelligence Maturity"},
  {label:"📚 Interventions", full:"Intervention Library"},
];

// ============================================================
// TOAST COMPONENT
// ============================================================
function Toast({msg, type, onClose}) {
  useEffect(()=>{const t=setTimeout(onClose,3200);return()=>clearTimeout(t);},[onClose]);
  const bg   = type==="error"?"#C03058":type==="warn"?"#8A6A10":"#1A4A2E";
  const bdr  = type==="error"?"#E04070":type==="warn"?"#F0C050":"#28A868";
  return (
    <div style={{position:"fixed",bottom:28,right:28,zIndex:9999,background:bg,border:`1px solid ${bdr}`,borderRadius:8,padding:"12px 18px",color:"#FBF5E6",fontSize:13,boxShadow:"0 4px 20px rgba(0,0,0,0.4)",display:"flex",alignItems:"center",gap:10,maxWidth:380,animation:"fadeInUp 0.2s ease"}}>
      <span>{type==="error"?"✕":type==="warn"?"⚠":"✓"}</span>
      <span>{msg}</span>
      <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",color:"#FBF5E6",cursor:"pointer",opacity:0.6,fontSize:16,padding:"0 2px"}}>×</button>
    </div>
  );
}

// ============================================================
// PREVIEW MODAL
// ============================================================
function PreviewModal({question, onClose}) {
  const [selected, setSelected] = useState(null);
  if (!question) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:8000,background:"rgba(6,3,14,0.88)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div style={{background:"#0F0830",border:"0.5px solid #2A204A",borderRadius:14,padding:"32px 36px",maxWidth:640,width:"100%",boxShadow:"0 24px 80px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{color:"#C9963A",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:6,fontWeight:500}}>Respondent Preview — Q{question.number}</div>
            <div style={{color:"#9880B0",fontSize:11}}>This is exactly how the question appears to assessment respondents</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"0.5px solid #2A204A",borderRadius:6,color:"#9880B0",cursor:"pointer",width:28,height:28,fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{height:"0.5px",background:"linear-gradient(90deg,#C9963A,transparent)",marginBottom:22}}/>
        <p style={{color:"#FBF5E6",fontSize:16,lineHeight:1.65,fontFamily:"Georgia,serif",marginBottom:26}}>{question.text}</p>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {question.options.map((opt,i)=>{
            const sel = selected===i;
            return (
              <button key={i} onClick={()=>setSelected(i)} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"12px 15px",borderRadius:8,cursor:"pointer",background:sel?"rgba(201,150,58,0.14)":"rgba(255,255,255,0.03)",border:`1px solid ${sel?"#C9963A":"rgba(255,255,255,0.08)"}`,textAlign:"left"}}>
                <span style={{width:26,height:26,borderRadius:"50%",flexShrink:0,border:`1.5px solid ${sel?"#C9963A":"#2A204A"}`,background:sel?"rgba(201,150,58,0.2)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:sel?"#EDD98A":"#9880B0",fontSize:11,fontWeight:500}}>{opt.letter}</span>
                <span style={{color:sel?"#FBF5E6":"#B8A8D0",fontSize:14,lineHeight:1.55,flex:1}}>{opt.text}</span>
              </button>
            );
          })}
        </div>
        <div style={{marginTop:20,padding:"9px 13px",background:"rgba(201,150,58,0.08)",borderRadius:6,border:"0.5px solid rgba(201,150,58,0.2)"}}>
          <span style={{color:"#C9963A",fontSize:11}}>ADMIN — Score mapping: </span>
          <span style={{color:"#9880B0",fontSize:11}}>{question.options.map(o=>`${o.letter}→${o.score}`).join(", ")}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONFIRM DIALOG
// ============================================================
function ConfirmDialog({msg, onConfirm, onCancel}) {
  return (
    <div style={{position:"fixed",inset:0,zIndex:8500,background:"rgba(6,3,14,0.75)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0F0830",border:"0.5px solid #2A204A",borderRadius:10,padding:"28px 32px",maxWidth:400,width:"90%",boxShadow:"0 16px 60px rgba(0,0,0,0.6)"}}>
        <div style={{fontSize:15,color:"#FBF5E6",marginBottom:10}}>Confirm deletion</div>
        <div style={{fontSize:13,color:"#9880B0",lineHeight:1.6,marginBottom:22}}>{msg}</div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={onCancel} style={{padding:"8px 18px",background:"transparent",border:"0.5px solid #2A204A",borderRadius:6,color:"#9880B0",cursor:"pointer",fontSize:13}}>Cancel</button>
          <button onClick={onConfirm} style={{padding:"8px 18px",background:"#C03058",border:"none",borderRadius:6,color:"#FBF5E6",cursor:"pointer",fontSize:13}}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// QUESTION CARD
// ============================================================
function QuestionCard({q, onUpdate, onDelete, onPreview, onDragHint}) {
  const letters=["A","B","C","D","E","F","G"];
  const addOption=()=>{
    const ltr=letters[q.options.length]||"?";
    onUpdate({...q,options:[...q.options,{letter:ltr,text:"",score:50}]});
  };
  const removeOption=(i)=>{
    if(q.options.length<=2) return;
    onUpdate({...q,options:q.options.filter((_,idx)=>idx!==i)});
  };
  const updateOption=(i,field,val)=>{
    const opts=q.options.map((o,idx)=>idx===i?{...o,[field]:val}:o);
    onUpdate({...q,options:opts});
  };
  const inp={width:"100%",padding:"7px 10px",fontSize:13,background:"#FAFAF8",border:"0.5px solid #E0D8CC",borderRadius:5,color:"#1A1A2E",fontFamily:"system-ui,sans-serif",outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.5};
  return (
    <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,marginBottom:16,overflow:"hidden"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
        <button title="Drag to reorder" onClick={onDragHint} style={{background:"none",border:"none",cursor:"grab",color:"#B0A8C0",fontSize:14,padding:"2px 4px"}}>⣿</button>
        <span style={{fontWeight:500,fontSize:13,color:"#1A1A2E"}}>Q{q.number}</span>
        <div style={{flex:1}}/>
        <button onClick={onPreview} style={{padding:"4px 10px",fontSize:11,cursor:"pointer",background:"transparent",border:"0.5px solid #C9963A",borderRadius:4,color:"#C9963A"}}>Preview</button>
        <button onClick={onDelete} style={{padding:"4px 10px",fontSize:11,cursor:"pointer",background:"transparent",border:"0.5px solid #C03058",borderRadius:4,color:"#C03058"}}>Delete</button>
      </div>
      {/* Question text */}
      <div style={{padding:"14px 14px 0"}}>
        <label style={{display:"block",fontSize:10,color:"#9880B0",marginBottom:5,letterSpacing:"0.09em",textTransform:"uppercase"}}>Question text</label>
        <textarea value={q.text} onChange={e=>onUpdate({...q,text:e.target.value})} rows={2} style={{...inp,minHeight:52}} placeholder="Enter question text…"/>
      </div>
      {/* Options */}
      <div style={{padding:"12px 14px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
          <label style={{fontSize:10,color:"#9880B0",letterSpacing:"0.09em",textTransform:"uppercase"}}>Answer Options</label>
          <span style={{fontSize:10,color:"#B0A8C0"}}>Score 1–100</span>
        </div>
        {q.options.map((opt,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
            <div style={{width:24,height:24,borderRadius:"50%",flexShrink:0,background:"#F0EBE3",border:"0.5px solid #E0D8CC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color:"#6B6577"}}>{opt.letter}</div>
            <input value={opt.text} onChange={e=>updateOption(i,"text",e.target.value)} style={{...inp,flex:1,resize:"none",minHeight:"auto"}} placeholder={`Option ${opt.letter}…`}/>
            <input type="number" min={1} max={100} value={opt.score} onChange={e=>updateOption(i,"score",Math.min(100,Math.max(1,parseInt(e.target.value)||1)))} style={{...inp,width:54,textAlign:"center",resize:"none",minHeight:"auto"}}/>
            <button onClick={()=>removeOption(i)} disabled={q.options.length<=2} style={{width:22,height:22,borderRadius:4,flexShrink:0,background:"transparent",border:"0.5px solid #E0D8CC",color:q.options.length<=2?"#D0C8CC":"#C03058",cursor:q.options.length<=2?"not-allowed":"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        ))}
        <button onClick={addOption} style={{marginTop:4,marginBottom:14,padding:"5px 12px",background:"transparent",border:"0.5px dashed #C9963A",borderRadius:4,color:"#C9963A",cursor:"pointer",fontSize:11}}>+ Add option</button>
      </div>
    </div>
  );
}

// ============================================================
// DIMENSION QUESTIONS PANEL
// ============================================================
function DimQuestionsPanel({dimIndex, questions, onUpdate, showToast, onPreview}) {
  const dimQs = questions.filter(q=>q.dimIndex===dimIndex);
  const [confirm, setConfirm] = useState(null);
  const handleUpdate=(updated)=>onUpdate(questions.map(q=>q.id===updated.id?updated:q));
  const handleDelete=(id)=>setConfirm(id);
  const confirmDelete=()=>{
    const q=questions.find(x=>x.id===confirm);
    onUpdate(questions.filter(x=>x.id!==confirm));
    setConfirm(null);
    showToast(`Q${q?.number||""} deleted.`,"warn");
  };
  const addQuestion=()=>{
    const maxNum=Math.max(0,...questions.map(q=>q.number));
    const newQ={id:`Q${Date.now()}`,dimIndex,number:maxNum+1,text:"",options:[{letter:"A",text:"",score:10},{letter:"B",text:"",score:95}]};
    onUpdate([...questions,newQ]);
    showToast("New question added. Fill all fields before saving.","warn");
  };
  const handleSave=()=>{
    for(const q of dimQs){
      if(!q.text.trim()){showToast(`Q${q.number} has empty question text.`,"error");return;}
      for(const o of q.options){if(!o.text.trim()){showToast(`Q${q.number} has an empty answer option.`,"error");return;}}
    }
    showToast("Changes saved to local state.","success");
  };
  return (
    <>
      {confirm&&<ConfirmDialog msg="Are you sure? This will affect scoring for all future assessments." onConfirm={confirmDelete} onCancel={()=>setConfirm(null)}/>}
      <div style={{flex:1,overflowY:"auto",padding:"16px 24px 100px"}}>
        {dimQs.length===0
          ? <div style={{textAlign:"center",color:"#B0A8C0",fontSize:14,marginTop:60}}>No questions in this dimension yet.</div>
          : dimQs.map(q=><QuestionCard key={q.id} q={q} onUpdate={handleUpdate} onDelete={()=>handleDelete(q.id)} onPreview={()=>onPreview(q)} onDragHint={()=>showToast("Drag to reorder (prototype mode — drag is disabled).","warn")}/>)
        }
        <button onClick={addQuestion} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",background:"transparent",border:"1px dashed #C9963A",borderRadius:8,color:"#C9963A",cursor:"pointer",fontSize:13,marginBottom:24}}>
          <span style={{fontSize:16}}>+</span>Add question to this dimension
        </button>
      </div>
      <div style={{position:"sticky",bottom:0,background:"#F7F4EF",borderTop:"0.5px solid #E0D8CC",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,color:"#9880B0"}}>{dimQs.length} question{dimQs.length!==1?"s":""} · Prototype mode — local state only</span>
        <button onClick={handleSave} style={{padding:"9px 22px",background:"#C9963A",border:"none",borderRadius:6,color:"#06030E",fontSize:13,fontWeight:500,cursor:"pointer"}}>Save changes</button>
      </div>
    </>
  );
}

// ============================================================
// INTERVENTION PANEL
// ============================================================
function InterventionPanel({interventions, onUpdate, showToast}) {
  const dimNames=["D1: Compute Capacity","D2: Capital Formation","D3: Regulatory Readiness","D4: Data Sovereignty","D5: Directed Intelligence Maturity"];
  const bands=["low","medium","high"];
  const bandLabels={low:"Low band (score <40)",medium:"Medium band (40–70)",high:"High band (>70)"};
  const bandColors={low:"#C03058",medium:"#F0C050",high:"#28A868"};

  const update=(di,band,ei,val)=>{
    const u={...interventions};u[di]={...u[di]};u[di][band]=[...u[di][band]];u[di][band][ei]=val;onUpdate(u);
  };
  const add=(di,band)=>{
    const u={...interventions};u[di]={...u[di]};u[di][band]=[...u[di][band],""];onUpdate(u);
    showToast("New intervention added.","warn");
  };
  const remove=(di,band,ei)=>{
    const u={...interventions};u[di]={...u[di]};u[di][band]=u[di][band].filter((_,i)=>i!==ei);onUpdate(u);
  };
  const handleSave=()=>{
    for(let d=0;d<5;d++){for(const b of bands){for(const e of(interventions[d]?.[b]||[])){if(!e.trim()){showToast("Empty intervention entry found. Fill all fields before saving.","error");return;}}}}
    showToast("Intervention library saved to local state.","success");
  };
  const ta={width:"100%",padding:"7px 10px",fontSize:13,background:"#FAFAF8",border:"0.5px solid #E0D8CC",borderRadius:5,color:"#1A1A2E",fontFamily:"system-ui,sans-serif",outline:"none",boxSizing:"border-box",resize:"vertical",lineHeight:1.5,minHeight:50};
  return (
    <>
      <div style={{flex:1,overflowY:"auto",padding:"16px 24px 100px"}}>
        <div style={{background:"rgba(201,150,58,0.08)",border:"0.5px solid rgba(201,150,58,0.3)",borderRadius:7,padding:"10px 14px",marginBottom:20,fontSize:12,color:"#6B6577",lineHeight:1.6}}>
          <strong style={{color:"#C9963A"}}>Auto-selection:</strong> Interventions are matched by score band per dimension. Low &lt;40 / Medium 40–70 / High &gt;70. P10 Roadmap always selects from the bottom three scoring dimensions.
        </div>
        {dimNames.map((name,di)=>{
          const intv = interventions[di] || {low:[],medium:[],high:[]};
          return (
            <div key={di} style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,marginBottom:18,overflow:"hidden"}}>
              <div style={{padding:"11px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC",fontWeight:500,fontSize:13,color:"#1A1A2E"}}>{name}</div>
              <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:18}}>
                {bands.map(band=>{
                  const entries = intv[band] || [];
                  return (
                    <div key={band}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:bandColors[band],flexShrink:0}}/>
                        <span style={{fontSize:11,fontWeight:500,color:bandColors[band],letterSpacing:"0.07em",textTransform:"uppercase"}}>{bandLabels[band]}</span>
                      </div>
                      {entries.map((entry,ei)=>(
                        <div key={ei} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                          <span style={{color:"#9880B0",fontSize:12,paddingTop:9,minWidth:16}}>{ei+1}.</span>
                          <textarea value={entry} onChange={e=>update(di,band,ei,e.target.value)} rows={2} style={ta} placeholder="Intervention description…"/>
                          <button onClick={()=>remove(di,band,ei)} style={{width:22,height:22,flexShrink:0,marginTop:8,background:"transparent",border:"0.5px solid #E0D8CC",borderRadius:4,color:"#C03058",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                        </div>
                      ))}
                      <button onClick={()=>add(di,band)} style={{padding:"4px 10px",background:"transparent",border:"0.5px dashed #B0A8C0",borderRadius:4,color:"#9880B0",cursor:"pointer",fontSize:11,marginTop:2}}>+ Add intervention</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position:"sticky",bottom:0,background:"#F7F4EF",borderTop:"0.5px solid #E0D8CC",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:12,color:"#9880B0"}}>5 dimensions · 3 bands each · Prototype — local state only</span>
        <button onClick={handleSave} style={{padding:"9px 22px",background:"#C9963A",border:"none",borderRadius:6,color:"#06030E",fontSize:13,fontWeight:500,cursor:"pointer"}}>Save changes</button>
      </div>
    </>
  );
}

// ============================================================
// QUESTION EDITOR PAGE
// ============================================================
function QuestionEditorPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [interventions, setInterventions] = useState(INITIAL_INTERVENTIONS);
  const [toast, setToast] = useState(null);
  const [previewQ, setPreviewQ] = useState(null);
  const toastId = useRef(0);
  const showToast = useCallback((msg, type="success")=>{
    const id = ++toastId.current;
    setToast({msg,type,id});
  },[]);

  const dimCounts = [0,1,2,3,4].map(d=>questions.filter(q=>q.dimIndex===d).length);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#F7F4EF"}}>
      {/* Header + tabs */}
      <div style={{padding:"18px 24px 0",borderBottom:"0.5px solid #E0D8CC",background:"#F7F4EF",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16}}>
          <h1 style={{margin:0,fontSize:18,fontWeight:500,color:"#1A1A2E",fontFamily:"system-ui,sans-serif"}}>Question & Content Editor</h1>
          <span style={{fontSize:12,color:"#9880B0",fontFamily:"system-ui,sans-serif"}}>{questions.length} questions · Intervention library · Prototype mode</span>
        </div>
        <div style={{display:"flex",gap:0,overflowX:"auto"}}>
          {DIMS.map((dim,i)=>{
            const active=activeTab===i;
            const count=i<5?dimCounts[i]:null;
            return (
              <button key={i} onClick={()=>setActiveTab(i)} style={{padding:"9px 16px",background:active?"#FFFFFF":"transparent",border:"none",borderLeft:`3px solid ${active?"#C9963A":"transparent"}`,borderBottom:active?"1px solid #FFFFFF":"1px solid transparent",color:active?"#1A1A2E":"#6B6577",fontSize:12,fontWeight:active?500:400,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"system-ui,sans-serif",letterSpacing:"0.02em",display:"flex",alignItems:"center",gap:6,marginBottom:-1}}>
                {dim.label}
                {count!==null&&<span style={{background:active?"#C9963A":"#E0D8CC",color:active?"#06030E":"#6B6577",borderRadius:10,fontSize:10,padding:"1px 6px",fontWeight:500,lineHeight:1.6}}>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dim label */}
      {activeTab<5&&(
        <div style={{padding:"14px 24px 0",flexShrink:0}}>
          <div style={{fontSize:11,color:"#9880B0",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2,fontFamily:"system-ui,sans-serif"}}>Dimension {activeTab+1} of 5</div>
          <div style={{fontSize:15,fontWeight:500,color:"#1A1A2E",marginBottom:12,fontFamily:"system-ui,sans-serif"}}>{DIMS[activeTab].full}</div>
        </div>
      )}

      {/* Panel */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"hidden"}}>
        {activeTab<5
          ? <DimQuestionsPanel dimIndex={activeTab} questions={questions} onUpdate={setQuestions} showToast={showToast} onPreview={setPreviewQ}/>
          : <InterventionPanel interventions={interventions} onUpdate={setInterventions} showToast={showToast}/>
        }
      </div>

      {previewQ&&<PreviewModal question={previewQ} onClose={()=>setPreviewQ(null)}/>}
      {toast&&<Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function QuestionEditor() {
  return <QuestionEditorPage />;
}

export default QuestionEditor;
