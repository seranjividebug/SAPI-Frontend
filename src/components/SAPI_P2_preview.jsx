import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SAPIGlobe({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" stroke="white" strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="29" ry="11" stroke="white" strokeWidth="1" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="1" transform="rotate(-28 32 32)" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke="white" strokeWidth="0.8" transform="rotate(28 32 32)" strokeDasharray="2 1.5" />
      {[[32,3],[55,20],[55,44],[32,61],[9,44],[9,20],[46,12],[18,52]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="white" />
      ))}
      <line x1="32" y1="3"  x2="55" y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="20" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="44" x2="32" y2="61" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="32" y1="61" x2="9"  y2="44" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="44" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="20" x2="32" y2="3"  stroke="white" strokeWidth="0.6" opacity="0.5" />
      <line x1="46" y1="12" x2="55" y2="44" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="18" y1="52" x2="9"  y2="20" stroke="white" strokeWidth="0.6" opacity="0.4" />
      <line x1="46" y1="12" x2="18" y2="52" stroke="white" strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

const C = {
  void:"#06030E", navy:"#0F0830", midnight:"#1A1540",
  gold:"#C9963A", paleGold:"#EDD98A", parchment:"#FBF5E6",
  muted:"#9880B0", bronze:"rgba(107,69,8,0.22)", bronzeStr:"rgba(107,69,8,0.40)", crimson:"#C03058",
};

const COUNTRIES = [
  { value:"UK",  label:"United Kingdom",          flag:"🇬🇧", sub:"England, Scotland, Wales, Northern Ireland" },
  { value:"UAE", label:"United Arab Emirates",    flag:"🇦🇪", sub:"Federal State · Gulf Region" },
  { value:"KSA", label:"Kingdom of Saudi Arabia", flag:"🇸🇦", sub:"Riyadh · Gulf Region" },
  { value:"AZ",  label:"Republic of Azerbaijan",  flag:"🇦🇿", sub:"Baku · South Caucasus" },
  { value:"KZ",  label:"Republic of Kazakhstan",  flag:"🇰🇿", sub:"Astana · Central Asia" },
  { value:"QA",  label:"State of Qatar",          flag:"🇶🇦", sub:"Doha · Gulf Region" },
  { value:"SG",  label:"Republic of Singapore",   flag:"🇸🇬", sub:"City-State · South-East Asia" },
  { value:"IN",  label:"Republic of India",       flag:"🇮🇳", sub:"New Delhi · South Asia" },
  { value:"RW",  label:"Republic of Rwanda",      flag:"🇷🇼", sub:"Kigali · East Africa" },
];

const STAGES = [
  { value:"Early",      label:"Early",      description:"Minimal sovereign AI capability — no formal strategy, negligible dedicated infrastructure or investment." },
  { value:"Emerging",   label:"Emerging",   description:"Pilots underway, foundations forming — discrete programmes exist but coordination and funding remain fragmented." },
  { value:"Developing", label:"Developing", description:"Structured programmes with institutional backing — building blocks in place, significant gaps remain." },
  { value:"Advanced",   label:"Advanced",   description:"Strong foundations across most dimensions — identifiable constraints, not yet a coherent sovereign system." },
  { value:"Leading",    label:"Leading",    description:"Durable, self-sustaining sovereign AI capacity — AI is a coordinated national system across all five dimensions." },
];

const TEXT_FIELDS = [
  { id:"name",     label:"Respondent Full Name",   type:"text",  placeholder:"e.g. H.E. Mohammed Al-Rashid" },
  { id:"title",    label:"Title / Role",           type:"text",  placeholder:"e.g. Minister of Digital Affairs" },
  { id:"ministry", label:"Ministry or Department", type:"text",  placeholder:"e.g. Ministry of Communications and Information Technology" },
  { id:"email",    label:"Contact Email",          type:"email", placeholder:"e.g. office@ministry.gov.sa" },
];

export default function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ country:"", name:"", title:"", ministry:"", email:"", developmentStage:"" });
  const [errors,       setErrors]       = useState({});
  const [touched,      setTouched]      = useState({});
  const [btnHover,     setBtnHover]     = useState(false);
  const [backHover,    setBackHover]    = useState(false);
  const [countryOpen,  setCountryOpen]  = useState(false);
  const [stageOpen,    setStageOpen]    = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted,    setSubmitted]    = useState(false);
  const [success,      setSuccess]      = useState(false);

  const countryRef = useRef(null);
  const stageRef   = useRef(null);

  useEffect(() => {
    function h(e) {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
      if (stageRef.current   && !stageRef.current.contains(e.target))   setStageOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function validate(id, val) {
    if (!val || !val.trim()) return "Required.";
    if (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Enter a valid email address.";
    return null;
  }

  const allIds = ["country", ...TEXT_FIELDS.map(f => f.id), "developmentStage"];

  function handleChange(id, val) {
    setForm(p => ({ ...p, [id]: val }));
    if (touched[id]) setErrors(p => ({ ...p, [id]: validate(id, val) }));
  }

  function handleBlur(id) {
    setTouched(p => ({ ...p, [id]: true }));
    setErrors(p => ({ ...p, [id]: validate(id, form[id]) }));
    setFocusedField(null);
  }

  function handleSubmit() {
    setSubmitted(true);
    setTouched(Object.fromEntries(allIds.map(id => [id, true])));
    const errs = Object.fromEntries(allIds.map(id => [id, validate(id, form[id])]));
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setSuccess(true);
    // Navigate to briefing after a short delay to show success message
    setTimeout(() => navigate('/briefing'), 2000);
  }

  const selectedCountry = COUNTRIES.find(c => c.value === form.country);
  const selectedStage   = STAGES.find(s => s.value === form.developmentStage);

  const inputBase = (id) => ({
    width:"100%", boxSizing:"border-box", background:C.midnight, color:C.parchment,
    border:       `1px solid ${errors[id] && touched[id] ? C.crimson : focusedField === id ? C.gold : C.bronze}`,
    borderBottom: `2px solid ${errors[id] && touched[id] ? C.crimson : focusedField === id ? C.gold : C.bronzeStr}`,
    outline:"none", padding:"13px 16px", fontFamily:"system-ui,sans-serif",
    fontSize:14, letterSpacing:"0.04em", borderRadius:2, transition:"border 0.15s", caretColor:C.gold,
  });

  const triggerStyle = (id, isOpen) => ({
    width:"100%", boxSizing:"border-box", background:C.midnight,
    color: form[id] ? C.parchment : "rgba(152,128,176,0.45)",
    border:       `1px solid ${errors[id] && touched[id] ? C.crimson : isOpen ? C.gold : C.bronze}`,
    borderBottom: `2px solid ${errors[id] && touched[id] ? C.crimson : isOpen ? C.gold : C.bronzeStr}`,
    outline:"none", padding:"13px 16px", fontFamily:"system-ui,sans-serif",
    fontSize:14, letterSpacing:"0.04em", borderRadius:2, textAlign:"left", cursor:"pointer",
    display:"flex", justifyContent:"space-between", alignItems:"center", transition:"border 0.15s",
  });

  const Chevron = ({ open }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s", flexShrink:0, marginLeft:8 }}>
      <path d="M2 5L7 10L12 5" stroke={C.muted} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );

  const FieldLabel = ({ id, children }) => (
    <label style={{ display:"block", fontFamily:"system-ui,sans-serif", fontSize:10, letterSpacing:"0.2em",
      textTransform:"uppercase", color: errors[id] && touched[id] ? C.crimson : C.muted,
      marginBottom:9, transition:"color 0.15s" }}>
      {children}
    </label>
  );

  const ErrMsg = ({ id }) => errors[id] && touched[id]
    ? <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.crimson, marginTop:7, letterSpacing:"0.06em" }}>{errors[id]}</div>
    : null;

  // ── Success screen ──
  if (success) {
    return (
      <div style={{ background:C.void, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:18, padding:32, textAlign:"center" }}>
        <SAPIGlobe size={48} />
        {selectedCountry && <div style={{ fontSize:36, lineHeight:1 }}>{selectedCountry.flag}</div>}
        <div style={{ width:48, height:1, background:C.bronze }} />
        <div style={{ fontFamily:"'Georgia',serif", fontSize:22, color:C.parchment, letterSpacing:"0.04em" }}>
          Profile received, {form.name.split(" ")[0]}.
        </div>
        <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color:C.muted, maxWidth:400, lineHeight:1.7 }}>
          {form.title}<br/>{form.ministry}<br/>{selectedCountry ? selectedCountry.label : form.country}
        </div>
        <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.gold, letterSpacing:"0.18em", textTransform:"uppercase" }}>
          Development Stage: {form.developmentStage}
        </div>
        <div style={{ width:48, height:1, background:C.bronze }} />
        <div style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:C.muted }}>Proceeding to Assessment Briefing…</div>
        <button onClick={() => navigate('/')}
          style={{ background:"transparent", border:`1px solid ${C.bronze}`, color:C.muted, padding:"10px 28px", fontFamily:"system-ui,sans-serif", fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", cursor:"pointer", marginTop:8, borderRadius:2 }}>
          ← Edit Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ background:C.void, minHeight:"100vh", color:C.parchment, fontFamily:"'Georgia','Times New Roman',serif" }}>

      {/* Header */}
      <header style={{ borderBottom:`1px solid ${C.bronze}`, padding:"20px 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", gap:16 }}>
          <SAPIGlobe size={32} />
          <div style={{ fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:"0.2em", color:C.parchment, textTransform:"uppercase", lineHeight:1.5 }}>
            The Sovereign AI<br/>Power Index
          </div>
          <div style={{ marginLeft:"auto", fontFamily:"system-ui,sans-serif", fontSize:10, letterSpacing:"0.16em", color:C.muted, textTransform:"uppercase", border:`1px solid ${C.bronze}`, padding:"4px 10px" }}>
            Classification: Restricted
          </div>
        </div>
      </header>

      {/* Progress nav */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"20px 32px 0", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <button
          onClick={() => navigate('/')}
          style={{ background:"none", border:"none", cursor:"pointer", color:backHover ? C.gold : C.muted, fontFamily:"system-ui,sans-serif", fontSize:11, letterSpacing:"0.14em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:6, padding:0, transition:"color 0.15s" }}
          onMouseEnter={() => setBackHover(true)} onMouseLeave={() => setBackHover(false)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {[{n:1,label:"Organisation Profile",active:true},{n:2,label:"Assessment Briefing",active:false},{n:3,label:"Assessment",active:false}].map((step,i) => (
            <div key={step.n} style={{ display:"flex", alignItems:"center", gap:6 }}>
              {i > 0 && <div style={{ width:20, height:1, background:C.bronze, margin:"0 2px" }} />}
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, background:step.active ? C.gold : "transparent", border:`1px solid ${step.active ? C.gold : C.bronzeStr}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif", fontSize:10, color:step.active ? C.void : C.muted, fontWeight:500 }}>
                  {step.n}
                </div>
                <span style={{ fontFamily:"system-ui,sans-serif", fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", color:step.active ? C.parchment : C.muted }}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:620, margin:"0 auto", padding:"52px 32px 96px" }}>

        <div style={{ fontFamily:"system-ui,sans-serif", fontSize:10, letterSpacing:"0.22em", color:C.gold, textTransform:"uppercase", marginBottom:18 }}>
          Step 1 of 3 &nbsp;·&nbsp; Organisation Profile
        </div>
        <h1 style={{ fontFamily:"'Georgia',serif", fontSize:30, fontWeight:400, color:C.parchment, letterSpacing:"0.02em", lineHeight:1.28, margin:"0 0 14px" }}>
          Tell us about your institution.
        </h1>
        <p style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color:C.muted, lineHeight:1.7, margin:"0 0 44px", letterSpacing:"0.02em" }}>
          Your profile personalises the assessment output and calibrates the roadmap to your institution's development stage and sovereign context.
        </p>

        {/* Confidentiality box */}
        <div style={{ border:`1px solid rgba(201,150,58,0.25)`, borderLeft:`3px solid ${C.gold}`, background:"rgba(201,150,58,0.04)", padding:"16px 20px", marginBottom:48 }}>
          <div style={{ fontFamily:"system-ui,sans-serif", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, marginBottom:8 }}>Data Classification</div>
          <p style={{ fontFamily:"system-ui,sans-serif", fontSize:12, color:C.muted, lineHeight:1.7, margin:0 }}>
            Your responses are used solely to generate your Tier 1 SAPI assessment report. No individual data is shared with third parties without your explicit consent.{" "}
            <em style={{ color:C.parchment }}>Classification: Restricted.</em>
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

          {/* Country dropdown */}
          <div ref={countryRef}>
            <FieldLabel id="country">Country / Nation</FieldLabel>
            <button type="button" style={triggerStyle("country", countryOpen)}
              onClick={() => { setCountryOpen(o => !o); setStageOpen(false); setTouched(p => ({ ...p, country:true })); }}>
              <span style={{ display:"flex", alignItems:"center", gap:10 }}>
                {selectedCountry
                  ? <><span style={{ fontSize:18, lineHeight:1 }}>{selectedCountry.flag}</span><span>{selectedCountry.label}</span></>
                  : <span>Select your country</span>}
              </span>
              <Chevron open={countryOpen} />
            </button>

            {countryOpen && (
              <div style={{ background:C.midnight, border:`1px solid ${C.gold}`, borderTop:"none", borderRadius:"0 0 2px 2px", overflow:"hidden", position:"relative", zIndex:300 }}>
                {COUNTRIES.map((c, i) => (
                  <button key={c.value} type="button"
                    style={{ width:"100%", background: form.country === c.value ? "rgba(201,150,58,0.09)" : "transparent", border:"none", borderTop: i > 0 ? `1px solid ${C.bronze}` : "none", padding:0, textAlign:"left", cursor:"pointer", display:"flex", alignItems:"stretch", transition:"background 0.1s" }}
                    onClick={() => { handleChange("country", c.value); setErrors(p => ({ ...p, country:null })); setCountryOpen(false); }}>
                    <div style={{ width:44, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", borderRight:`1px solid ${C.bronze}`, fontSize:18, padding:"12px 0" }}>
                      {c.flag}
                    </div>
                    <div style={{ padding:"12px 16px", flex:1 }}>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color: form.country === c.value ? C.paleGold : C.parchment, letterSpacing:"0.04em", marginBottom:2, fontWeight: form.country === c.value ? 500 : 400 }}>
                        {c.label}
                      </div>
                      <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, letterSpacing:"0.02em" }}>{c.sub}</div>
                    </div>
                    {form.country === c.value && (
                      <div style={{ display:"flex", alignItems:"center", paddingRight:14 }}>
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10L11 3" stroke="#C9963A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            <ErrMsg id="country" />
          </div>

          {/* Text / email fields */}
          {TEXT_FIELDS.map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <FieldLabel id={id}>{label}</FieldLabel>
              <input type={type} value={form[id]} placeholder={placeholder} style={inputBase(id)}
                onFocus={() => setFocusedField(id)}
                onBlur={() => handleBlur(id)}
                onChange={e => handleChange(id, e.target.value)}
                autoComplete="off" spellCheck={false} />
              <ErrMsg id={id} />
            </div>
          ))}

          {/* Development Stage dropdown */}
          <div ref={stageRef}>
            <FieldLabel id="developmentStage">Development Stage</FieldLabel>
            <button type="button" style={triggerStyle("developmentStage", stageOpen)}
              onClick={() => { setStageOpen(o => !o); setCountryOpen(false); setTouched(p => ({ ...p, developmentStage:true })); }}>
              <span>{form.developmentStage || "Select your development stage"}</span>
              <Chevron open={stageOpen} />
            </button>

            {stageOpen && (
              <div style={{ background:C.midnight, border:`1px solid ${C.gold}`, borderTop:"none", borderRadius:"0 0 2px 2px", overflow:"hidden", position:"relative", zIndex:200 }}>
                {STAGES.map((stage, i) => (
                  <button key={stage.value} type="button"
                    style={{ width:"100%", background: form.developmentStage === stage.value ? "rgba(201,150,58,0.09)" : "transparent", border:"none", borderTop: i > 0 ? `1px solid ${C.bronze}` : "none", padding:"14px 16px", textAlign:"left", cursor:"pointer", display:"block", transition:"background 0.1s" }}
                    onClick={() => { handleChange("developmentStage", stage.value); setErrors(p => ({ ...p, developmentStage:null })); setTouched(p => ({ ...p, developmentStage:true })); setStageOpen(false); }}>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:13, color: form.developmentStage === stage.value ? C.paleGold : C.parchment, letterSpacing:"0.04em", marginBottom:4, fontWeight: form.developmentStage === stage.value ? 500 : 400, display:"flex", alignItems:"center", gap:8 }}>
                      {stage.label}
                      {form.developmentStage === stage.value && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#C9963A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, lineHeight:1.55, letterSpacing:"0.02em" }}>{stage.description}</div>
                  </button>
                ))}
              </div>
            )}

            {selectedStage && !stageOpen && (
              <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, marginTop:9, lineHeight:1.55, letterSpacing:"0.02em", padding:"0 1px" }}>
                {selectedStage.description}
              </div>
            )}
            <ErrMsg id="developmentStage" />
          </div>

        </div>

        {/* Validation banner */}
        {submitted && Object.values(errors).some(Boolean) && (
          <div style={{ marginTop:36, border:`1px solid rgba(192,48,88,0.35)`, borderLeft:`3px solid ${C.crimson}`, background:"rgba(192,48,88,0.05)", padding:"14px 18px" }}>
            <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.crimson, letterSpacing:"0.12em", textTransform:"uppercase" }}>
              All fields are required. Please complete the form before proceeding.
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop:52 }}>
          <button
            style={{ width:"100%", background:btnHover ? "#B8862A" : C.gold, color:C.void, border:"none", padding:"16px 48px", fontFamily:"system-ui,sans-serif", fontSize:12, letterSpacing:"0.22em", textTransform:"uppercase", fontWeight:500, cursor:"pointer", borderRadius:3, transition:"background 0.15s" }}
            onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
            onClick={handleSubmit}>
            Continue to Assessment Briefing
          </button>
          <div style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, letterSpacing:"0.1em", textAlign:"center", marginTop:14, opacity:0.55, lineHeight:1.6 }}>
            All fields required &nbsp;·&nbsp; Data handled under restricted classification &nbsp;·&nbsp; No account required
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ borderTop:`1px solid ${C.bronze}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"18px 32px", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, letterSpacing:"0.1em", opacity:0.5 }}>© 2026 The Sovereign AI Power Index. All rights reserved.</span>
          <span style={{ fontFamily:"system-ui,sans-serif", fontSize:11, color:C.muted, letterSpacing:"0.1em", opacity:0.5 }}>SAPI · Tier 1 · v1.0</span>
        </div>
      </footer>

    </div>
  );
}
