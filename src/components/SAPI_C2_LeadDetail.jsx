import { useState } from "react";

// ============================================================
// SEED DATA
// ============================================================
const DEMO_SUBMISSIONS = [
  { id:"sub_001", country:"Kingdom of Saudi Arabia", respondentName:"H.E. Faisal Al-Ibrahim", title:"Minister of Economy and Planning", ministry:"Ministry of Economy and Planning", email:"f.alibrahim@mep.gov.sa", developmentStage:"Advanced", completedAt:"2026-03-14T09:22:00Z", compositeScore:71.4, tier:"Advanced", scores:{compute:78,capital:82,regulatory:65,data:60,di:68}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"High-value lead. Minister attended SAPI launch event.", leadStage:"Proposal Sent" },
  { id:"sub_002", country:"Republic of Singapore", respondentName:"Dr. Janice Tan", title:"Deputy Secretary, Smart Nation", ministry:"Smart Nation and Digital Government Office", email:"janice_tan@smartnation.gov.sg", developmentStage:"Leading", completedAt:"2026-03-15T14:05:00Z", compositeScore:83.2, tier:"Sovereign AI Leader", scores:{compute:85,capital:88,regulatory:90,data:80,di:78}, upgradeStatus:"none", requestedTier:null, adminNotes:"", leadStage:"New" },
  { id:"sub_003", country:"Federal Republic of Nigeria", respondentName:"Hon. Bosun Tijani", title:"Minister of Communications, Innovation and Digital Economy", ministry:"Federal Ministry of Communications", email:"minister@fmcide.gov.ng", developmentStage:"Developing", completedAt:"2026-03-17T11:30:00Z", compositeScore:38.6, tier:"Nascent", scores:{compute:28,capital:35,regulatory:42,data:30,di:45}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Introduced via GIZ partnership.", leadStage:"Contacted" },
  { id:"sub_005", country:"United Arab Emirates", respondentName:"H.E. Omar Al Olama", title:"Minister of State for Artificial Intelligence", ministry:"Ministry of AI, Digital Economy and Remote Work Applications", email:"minister.ai@uaecabinet.ae", developmentStage:"Leading", completedAt:"2026-03-19T10:00:00Z", compositeScore:78.9, tier:"Advanced", scores:{compute:85,capital:88,regulatory:75,data:72,di:70}, upgradeStatus:"requested", requestedTier:"Tier 3", adminNotes:"Priority account. Met Asim at WEF Davos.", leadStage:"Won" },
  { id:"sub_007", country:"Republic of India", respondentName:"Sh. S. Krishnan", title:"Secretary, Ministry of Electronics and Information Technology", ministry:"MeitY", email:"secretary@meity.gov.in", developmentStage:"Advanced", completedAt:"2026-03-21T07:30:00Z", compositeScore:62.7, tier:"Advanced", scores:{compute:65,capital:70,regulatory:68,data:52,di:58}, upgradeStatus:"requested", requestedTier:"Tier 2", adminNotes:"Referred via UK FCDO digital programme.", leadStage:"Contacted" },
];

const STAGES = ["New","Contacted","Proposal Sent","Won","Lost"];
const DIMS = [
  {key:"compute",    label:"Compute Capacity"},
  {key:"capital",   label:"Capital Formation"},
  {key:"regulatory",label:"Regulatory Readiness"},
  {key:"data",      label:"Data Sovereignty"},
  {key:"di",        label:"Directed Intelligence"},
];

const tierColor = (t) => ({"Sovereign AI Leader":"#28A868",Advanced:"#4A7AE0",Developing:"#F0C050",Nascent:"#C9963A","Pre-conditions Unmet":"#C03058"}[t]||"#9880B0");
const stageColor = (s) => ({New:"#9880B0",Contacted:"#4A7AE0","Proposal Sent":"#F0C050",Won:"#28A868",Lost:"#C03058"}[s]||"#9880B0");
const bandLabel = (s) => s>=65?"Strong":s>=40?"Moderate":"Weak";
const bandColor = (s) => s>=65?"#28A868":s>=40?"#F0C050":"#C03058";
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
const fmtDateTime = (iso) => `${fmtDate(iso)}, ${fmtTime(iso)}`;
const lowestDim = (scores) => {
  const [key] = Object.entries(scores).reduce((a,b)=>b[1]<a[1]?b:a);
  return DIMS.find(d=>d.key===key)?.label||key;
};
const nowISO = () => new Date().toISOString();

const seedActivityLog = (lead) => {
  const entries = [];
  entries.push({id:"evt_complete",ts:lead.completedAt,text:`Tier 1 assessment completed — composite score ${lead.compositeScore}`});
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
// HELPERS
// ============================================================
function StageBadge({stage}){
  const c=stageColor(stage);
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:4,fontSize:11.5,fontWeight:500,background:`${c}18`,color:c,border:`1px solid ${c}40`,whiteSpace:"nowrap"}}>
    <span style={{width:6,height:6,borderRadius:"50%",background:c,flexShrink:0}}/>
    {stage}
  </span>;
}

function TierBadge({tier}){
  const c=tierColor(tier);
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:500,background:`${c}16`,color:c,border:`1px solid ${c}38`,whiteSpace:"nowrap"}}>{tier}</span>;
}

function CopyIcon(){
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;
}

function MetaRow({label,value}){
  return <div style={{display:"flex",gap:10,alignItems:"flex-start",padding:"6px 0",borderBottom:"0.5px solid #F0EBE3"}}>
    <span style={{fontSize:11.5,color:"#9880B0",width:140,flexShrink:0,paddingTop:1}}>{label}</span>
    <span style={{fontSize:12.5,color:"#1A1A2E"}}>{value}</span>
  </div>;
}

function EmailModal({lead,onClose}){
  const lowest=lowestDim(lead.scores);
  const tierNum=lead.requestedTier?lead.requestedTier.replace("Tier ",""):"2";
  const tierBenefits={"2":"a structured practitioner diagnostic, gap analysis, and a prioritised reform roadmap delivered by our senior advisory team","3":"an embedded advisory engagement with dedicated SAPI practitioners working alongside your ministry teams","4":"a comprehensive sovereign AI transformation programme with full implementation support"};

  const defaultSubject=`SAPI ${lead.requestedTier||"Tier 2"} Engagement — ${lead.country} Next Steps`;
  const defaultBody=`Dear ${lead.respondentName},\n\nThank you for completing your Tier 1 SAPI assessment. Your composite score of ${lead.compositeScore} places ${lead.country} in the ${lead.tier} tier of our global sovereign AI readiness index.\n\nOur analysis identified ${lowest} as your primary strategic constraint — an area where targeted practitioner intervention consistently delivers measurable improvement in readiness positioning.\n\nA ${lead.requestedTier||"Tier 2"} engagement with SAPI would provide ${tierBenefits[tierNum]||tierBenefits["2"]}.\n\nI would welcome the opportunity to discuss how we can support ${lead.country}'s sovereign AI ambitions. Please let me know your availability for a 30-minute introductory call at your earliest convenience.\n\nWarm regards,\nAsim Razvi\nSovereign AI Power Index`;

  const [subject,setSubject]=useState(defaultSubject);
  const [body,setBody]=useState(defaultBody);
  const [copied,setCopied]=useState(false);

  const handleCopy=()=>{
    const full=`Subject: ${subject}\n\n${body}`;
    try{navigator.clipboard.writeText(full);}catch(e){}
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  };

  return <div style={{border:"1px solid #E0D8CC",borderRadius:10,background:"#FFFFFF",marginTop:12,overflow:"hidden",boxShadow:"0 4px 18px rgba(0,0,0,0.07)"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9Z" stroke="#6B6577" strokeWidth="1.4"/><path d="m2 6 8 5.5L18 6" stroke="#6B6577" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <span style={{fontSize:12.5,fontWeight:500,color:"#1A1A2E"}}>Draft introduction email</span>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:"#9880B0",fontSize:18,lineHeight:1,padding:"2px 4px"}}>×</button>
    </div>
    <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
      <div>
        <label style={{fontSize:11,color:"#9880B0",display:"block",marginBottom:4}}>SUBJECT</label>
        <input value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12.5,color:"#1A1A2E",background:"#FDFBF8",outline:"none",fontFamily:"system-ui,sans-serif"}}/>
      </div>
      <div>
        <label style={{fontSize:11,color:"#9880B0",display:"block",marginBottom:4}}>BODY</label>
        <textarea value={body} onChange={e=>setBody(e.target.value)} rows={13} style={{width:"100%",boxSizing:"border-box",padding:"9px 10px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12,color:"#1A1A2E",background:"#FDFBF8",lineHeight:1.65,resize:"vertical",outline:"none",fontFamily:"system-ui,sans-serif"}}/>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:2}}>
        <button onClick={onClose} style={{padding:"7px 14px",borderRadius:5,border:"0.5px solid #E0D8CC",background:"transparent",color:"#6B6577",fontSize:12,cursor:"pointer",fontFamily:"system-ui,sans-serif"}}>Close</button>
        <button onClick={handleCopy} style={{padding:"7px 16px",borderRadius:5,border:"none",background:copied?"#28A868":"#C9963A",color:"#FFF",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"system-ui,sans-serif",transition:"background 0.2s ease",display:"flex",alignItems:"center",gap:6}}>
          {copied?<><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>:<><CopyIcon/>Copy email</>}
        </button>
      </div>
    </div>
  </div>;
}

function ScoreSummary({lead,onViewAssessment}){
  return <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,overflow:"hidden"}}>
    <div style={{padding:"18px 18px 14px",background:"#F7F4EF",borderBottom:"0.5px solid #E0D8CC",textAlign:"center"}}>
      <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Composite Score</div>
      <div style={{fontSize:46,fontFamily:"Georgia,serif",color:"#C9963A",fontWeight:400,lineHeight:1,marginBottom:8}}>{lead.compositeScore}</div>
      <TierBadge tier={lead.tier}/>
    </div>
    <div style={{padding:"12px 16px 6px"}}>
      <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Dimension Scores</div>
      {DIMS.map(dim=>{
        const score=lead.scores[dim.key]??0;
        const bc=bandColor(score);
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
      <button onClick={onViewAssessment} style={{width:"100%",padding:"8px",borderRadius:5,border:"0.5px solid #C9963A",background:"transparent",color:"#C9963A",fontSize:11.5,cursor:"pointer",fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
        View full assessment
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </div>;
}

function ActivityLog({entries}){
  if(entries.length===0) return <div style={{fontSize:12,color:"#B8B0A8",fontStyle:"italic",padding:"8px 0"}}>No activity recorded.</div>;
  return <div style={{display:"flex",flexDirection:"column"}}>
    {entries.map((entry,idx)=>(
      <div key={entry.id||idx} style={{display:"flex",gap:12,paddingBottom:14,position:"relative"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:entry.isNew?"#C9963A":"#C8BFDA",border:entry.isNew?"2px solid #EDD98A":"2px solid #E0D8CC",flexShrink:0,marginTop:2}}/>
          {idx<entries.length-1&&<div style={{width:1,flex:1,background:"#E8E2D8",marginTop:4,minHeight:18}}/>}
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:"#B8B0A8",marginBottom:2,letterSpacing:"0.02em"}}>{fmtDateTime(entry.ts)}</div>
          <div style={{fontSize:12.5,color:entry.isNew?"#1A1A2E":"#4A4060",fontWeight:entry.isNew?500:400,lineHeight:1.45}}>{entry.text}</div>
        </div>
      </div>
    ))}
  </div>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function LeadDetail({selectedLead:initialLead,onBack}){
  const [lead,setLead]=useState(initialLead||DEMO_SUBMISSIONS[0]);
  const [activityLog,setActivityLog]=useState(()=>seedActivityLog(initialLead||DEMO_SUBMISSIONS[0]));
  const [showEmailModal,setShowEmailModal]=useState(false);
  const [notesDraft,setNotesDraft]=useState((initialLead||DEMO_SUBMISSIONS[0]).adminNotes||"");
  const [noteSaved,setNoteSaved]=useState(false);
  const [copiedEmail,setCopiedEmail]=useState(false);
  const [selectedIdx,setSelectedIdx]=useState(0);

  const handleStageChange=(newStage)=>{
    const prev=lead.leadStage;
    if(newStage===prev) return;
    setLead(l=>({...l,leadStage:newStage}));
    const entry={id:`evt_stage_${Date.now()}`,ts:nowISO(),text:`Stage changed from ${prev} to ${newStage}`,isNew:true};
    setActivityLog(prev=>[entry,...prev]);
  };

  const handleSaveNotes=()=>{
    setLead(l=>({...l,adminNotes:notesDraft}));
    const entry={id:`evt_note_${Date.now()}`,ts:nowISO(),text:`Note saved: "${notesDraft.slice(0,60)}${notesDraft.length>60?"…":""}"`,isNew:true};
    setActivityLog(prev=>[entry,...prev]);
    setNoteSaved(true);
    setTimeout(()=>setNoteSaved(false),2000);
  };

  const handleCopyEmail=()=>{
    try{navigator.clipboard.writeText(lead.email);}catch(e){}
    setCopiedEmail(true);
    setTimeout(()=>setCopiedEmail(false),1800);
  };

  const handleViewAssessment=()=>{
    window.location.href = '/submissiondetail';
  };

  const handleLeadSwitch=(idx)=>{
    setSelectedIdx(idx);
    const newLead = DEMO_SUBMISSIONS[idx];
    setLead(newLead);
    setNotesDraft(newLead.adminNotes||"");
    setActivityLog(seedActivityLog(newLead));
    setShowEmailModal(false);
    setNoteSaved(false);
  };

  const sc=stageColor(lead.leadStage);

  return <div style={{display:"flex",minHeight:"100vh",fontFamily:"system-ui,-apple-system,sans-serif",background:"#F7F4EF"}}>
    {/* Content area */}
    <div style={{flex:1,minWidth:0,overflowY:"auto",minHeight:"100vh"}}>
      {/* Lead switcher */}
      <div style={{background:"#FFFFFF",borderBottom:"0.5px solid #E0D8CC",padding:"8px 2rem",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        <span style={{fontSize:11,color:"#9880B0",marginRight:4,whiteSpace:"nowrap"}}>Preview lead:</span>
        {DEMO_SUBMISSIONS.map((sub,i)=>{
          const shortName = sub.country.replace("Republic of ","").replace("Federal Republic of ","").replace("Kingdom of ","").replace("United Arab Emirates","UAE");
          return (
            <button key={sub.id} onClick={()=>handleLeadSwitch(i)} style={{padding:"4px 11px",borderRadius:20,fontSize:11.5,cursor:"pointer",border:"0.5px solid",borderColor:selectedIdx===i?"#C9963A":"#E0D8CC",background:selectedIdx===i?"#C9963A":"transparent",color:selectedIdx===i?"#FFF":"#6B6577",transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"system-ui,sans-serif"}}>
              {shortName}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div style={{padding:"1.75rem 2rem 3rem",minHeight:"100%",boxSizing:"border-box"}}>
        {/* Page header */}
        <div style={{marginBottom:"1.5rem"}}>
          <button onClick={onBack||(()=>window.location.href='/leadspipeline')} style={{background:"none",border:"none",color:"#9880B0",cursor:"pointer",fontSize:12.5,padding:"0 0 10px",display:"flex",alignItems:"center",gap:5,fontFamily:"system-ui,sans-serif"}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Pipeline
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
                <select value={lead.leadStage} onChange={e=>handleStageChange(e.target.value)} style={{padding:"5px 28px 5px 10px",borderRadius:5,border:`1px solid ${sc}50`,background:"#FFFFFF",color:"#1A1A2E",fontSize:12,cursor:"pointer",outline:"none",fontFamily:"system-ui,sans-serif",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6577' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center"}}>
                  {STAGES.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
          {/* Left */}
          <div style={{flex:"1 1 0",minWidth:0,display:"flex",flexDirection:"column",gap:16}}>
            {/* Contact Card */}
            <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
              <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Contact Details</div>
              <div style={{display:"flex",gap:10,alignItems:"center",padding:"6px 0",borderBottom:"0.5px solid #F0EBE3",marginBottom:2}}>
                <span style={{fontSize:11.5,color:"#9880B0",width:140,flexShrink:0}}>Email</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <a href={`mailto:${lead.email}`} style={{fontSize:12.5,color:"#4A7AE0",textDecoration:"none"}}>{lead.email}</a>
                  <button onClick={handleCopyEmail} title="Copy email" style={{background:"none",border:"none",cursor:"pointer",color:copiedEmail?"#28A868":"#9880B0",padding:"2px",display:"flex",alignItems:"center",transition:"color 0.2s"}}>
                    {copiedEmail?<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>:<CopyIcon/>}
                  </button>
                </div>
              </div>
              <MetaRow label="Ministry" value={lead.ministry}/>
              <MetaRow label="Development Stage" value={lead.developmentStage}/>
              <MetaRow label="Assessment Completed" value={fmtDateTime(lead.completedAt)}/>
              <MetaRow label="Upgrade Requested" value={lead.requestedTier||"—"}/>

              <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
                <button onClick={()=>setShowEmailModal(v=>!v)} style={{padding:"8px 14px",borderRadius:5,border:"none",background:showEmailModal?"#9880B0":"#C9963A",color:"#FFF",fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",gap:6,transition:"background 0.15s"}}>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h13A1.5 1.5 0 0 1 18 5.5v9A1.5 1.5 0 0 1 16.5 16h-13A1.5 1.5 0 0 1 2 14.5v-9Z" stroke="white" strokeWidth="1.4"/><path d="m2 6 8 5.5L18 6" stroke="white" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  {showEmailModal?"Hide email draft":"Draft introduction email"}
                </button>
                <button onClick={handleViewAssessment} style={{padding:"8px 14px",borderRadius:5,border:"0.5px solid #E0D8CC",background:"transparent",color:"#1A1A2E",fontSize:12,cursor:"pointer",fontFamily:"system-ui,sans-serif",display:"flex",alignItems:"center",gap:6}}>
                  View full assessment
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>

            {/* Email modal */}
            {showEmailModal&&<EmailModal lead={lead} onClose={()=>setShowEmailModal(false)}/>}

            {/* Admin Notes */}
            <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
              <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Admin Notes</div>
              <textarea value={notesDraft} onChange={e=>setNotesDraft(e.target.value)} placeholder="Add internal notes about this lead…" rows={4} style={{width:"100%",boxSizing:"border-box",padding:"9px 11px",border:"0.5px solid #E0D8CC",borderRadius:5,fontSize:12.5,color:"#1A1A2E",background:"#FDFBF8",lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:"system-ui,sans-serif"}}/>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                <button onClick={handleSaveNotes} disabled={notesDraft===lead.adminNotes} style={{padding:"7px 16px",borderRadius:5,border:"none",background:noteSaved?"#28A868":notesDraft!==lead.adminNotes?"#C9963A":"#E0D8CC",color:notesDraft!==lead.adminNotes||noteSaved?"#FFF":"#9880B0",fontSize:12,fontWeight:500,cursor:notesDraft!==lead.adminNotes?"pointer":"default",fontFamily:"system-ui,sans-serif",transition:"background 0.2s",display:"flex",alignItems:"center",gap:5}}>
                  {noteSaved?<><svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved</>:"Save note"}
                </button>
              </div>
            </div>

            {/* Activity Log */}
            <div style={{background:"#FFFFFF",border:"0.5px solid #E0D8CC",borderRadius:8,padding:"18px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontSize:10.5,color:"#9880B0",textTransform:"uppercase",letterSpacing:"0.06em"}}>Activity Log</div>
                <span style={{fontSize:10.5,color:"#B8B0A8",background:"#F7F4EF",border:"0.5px solid #E0D8CC",borderRadius:10,padding:"2px 8px"}}>{activityLog.length} event{activityLog.length!==1?"s":""}</span>
              </div>
              <ActivityLog entries={activityLog}/>
            </div>
          </div>

          {/* Right — Score Summary */}
          <div style={{width:256,flexShrink:0}}>
            <ScoreSummary lead={lead} onViewAssessment={handleViewAssessment}/>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default LeadDetail;
