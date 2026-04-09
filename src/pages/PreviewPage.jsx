import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveProfile } from "../services/profileService";
import { PageLayout, PageHeader, PageFooter, SAPIGlobe } from "./common";

// ── Override Chrome Autofill White Background ───────────────────────────────
const autofillStyles = `
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #0a0a12 inset !important;
    -webkit-text-fill-color: #F5F3EE !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

// ── SVG Flag Components ──────────────────────────────────────────────────────
const UKFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#012169"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFF" strokeWidth="2"/>
    <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.2"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#FFF" strokeWidth="3"/>
    <path d="M12 0 V16 M0 8 H24" stroke="#C8102E" strokeWidth="1.8"/>
  </svg>
);

const UAEFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="6" height="16" fill="#FF0000"/>
    <rect x="6" width="18" height="5.33" fill="#00732F"/>
    <rect x="6" y="5.33" width="18" height="5.33" fill="#FFFFFF"/>
    <rect x="6" y="10.67" width="18" height="5.33" fill="#000000"/>
  </svg>
);

const SaudiFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#006C35"/>
    <text x="12" y="9" fontSize="6" fill="#FFFFFF" textAnchor="middle" fontFamily="Arial">لا إله</text>
  </svg>
);

const AzerbaijanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="5.33" fill="#0092C7"/>
    <rect y="5.33" width="24" height="5.33" fill="#E4002B"/>
    <rect y="10.67" width="24" height="5.33" fill="#00B04F"/>
    <circle cx="12" cy="8" r="2.5" fill="#FFF" opacity="0.9"/>
    <path d="M12 5.5 L13 8 L12 8.5 L11 8 Z" fill="#FFF"/>
  </svg>
);

const KazakhstanFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="16" fill="#00AFCA"/>
    <circle cx="6" cy="8" r="3" fill="#FDC82F"/>
    <path d="M6 5 L6.5 7 L8 7 L7 8.5 L7.5 10 L6 9 L4.5 10 L5 8.5 L4 7 L5.5 7 Z" fill="#FDC82F"/>
  </svg>
);

const QatarFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="6" height="16" fill="#FFF"/>
    <rect x="6" width="18" height="16" fill="#8D1B3D"/>
    <path d="M6 2 L10 1 L10 3 L6 2 M6 4 L10 3 L10 5 L6 4 M6 6 L10 5 L10 7 L6 6 M6 8 L10 7 L10 9 L6 8 M6 10 L10 9 L10 11 L6 10 M6 12 L10 11 L10 13 L6 12 M6 14 L10 13 L10 15 L6 14" fill="#FFF"/>
  </svg>
);

const SingaporeFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="8" fill="#ED2939"/>
    <rect y="8" width="24" height="8" fill="#FFFFFF"/>
    <circle cx="6" cy="5" r="2.5" fill="#FFFFFF"/>
    <polygon points="6,3 7,4 6.5,4.5" fill="#FFFFFF"/>
  </svg>
);

const IndiaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="5.33" fill="#FF9932"/>
    <rect y="5.33" width="24" height="5.33" fill="#FFFFFF"/>
    <rect y="10.67" width="24" height="5.33" fill="#138808"/>
    <circle cx="12" cy="8" r="2" fill="#000080" stroke="#000080" strokeWidth="0.3"/>
  </svg>
);

const RwandaFlag = () => (
  <svg width="24" height="16" viewBox="0 0 24 16" className="rounded-sm flex-shrink-0">
    <rect width="24" height="8" fill="#00A1DE"/>
    <rect y="8" width="24" height="8" fill="#FAD201"/>
    <rect y="12" width="24" height="4" fill="#00A1DE"/>
    <circle cx="8" cy="5" r="2" fill="#E5BE01"/>
  </svg>
);

const COUNTRIES = [
  { value:"UK",  label:"United Kingdom",          Flag:UKFlag, sub:"England, Scotland, Wales, Northern Ireland" },
  { value:"UAE", label:"United Arab Emirates",    Flag:UAEFlag, sub:"Federal State · Gulf Region" },
  { value:"KSA", label:"Kingdom of Saudi Arabia", Flag:SaudiFlag, sub:"Riyadh · Gulf Region" },
  { value:"AZ",  label:"Republic of Azerbaijan",  Flag:AzerbaijanFlag, sub:"Baku · South Caucasus" },
  { value:"KZ",  label:"Republic of Kazakhstan",  Flag:KazakhstanFlag, sub:"Astana · Central Asia" },
  { value:"QA",  label:"State of Qatar",          Flag:QatarFlag, sub:"Doha · Gulf Region" },
  { value:"SG",  label:"Republic of Singapore",   Flag:SingaporeFlag, sub:"City-State · South-East Asia" },
  { value:"IN",  label:"Republic of India",       Flag:IndiaFlag, sub:"New Delhi · South Asia" },
  { value:"RW",  label:"Republic of Rwanda",      Flag:RwandaFlag, sub:"Kigali · East Africa" },
];

const STAGES = [
  { value:"Early",      label:"Early",      description:"Minimal sovereign AI capability — no formal strategy, negligible dedicated infrastructure or investment." },
  { value:"Emerging",   label:"Emerging",   description:"Pilots underway, foundations forming — discrete programmes exist but coordination and funding remain fragmented." },
  { value:"Developing", label:"Developing", description:"Structured programmes with institutional backing — building blocks in place, significant gaps remain." },
  { value:"Advanced",   label:"Advanced",   description:"Strong foundations across most dimensions — identifiable constraints, not yet a coherent sovereign system." },
  { value:"Leading",    label:"Leading",    description:"Durable, self-sustaining sovereign AI capacity — AI is a coordinated national system across all five dimensions." },
];

const TEXT_FIELDS = [
  { id:"name",     label:"Respondent Full Name",   type:"text",  placeholder:"e.g. Sir James Harrison" },
  { id:"title",    label:"Title / Role",           type:"text",  placeholder:"e.g. Director of Digital Strategy" },
  { id:"ministry", label:"Ministry or Department", type:"text",  placeholder:"e.g. Department for Science, Innovation and Technology" },
  { id:"email",    label:"Contact Email",          type:"email", placeholder:"e.g. james.harrison@gov.uk" },
];

export default function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ country:"", name:"", title:"", ministry:"", email:"", developmentStage:"" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [btnHover, setBtnHover] = useState(false);
  const [backHover, setBackHover] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [stageOpen, setStageOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const countryRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    // Only load saved profile if coming from BriefingPage (back button)
    // Don't load if coming from /home (fresh start)
    const fromBriefing = location.state?.from === 'briefing';
    if (fromBriefing) {
      const savedProfile = localStorage.getItem('sapi_profile');
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          // Find country value from label (profile stores full name, dropdown needs value code)
          const countryObj = COUNTRIES.find(c => c.label === profile.country);
          setForm({
            country: countryObj?.value || "",
            name: profile.respondent_name || "",
            title: profile.title || "",
            ministry: profile.ministry_or_department || "",
            email: profile.contact_email || "",
            developmentStage: profile.development_stage || ""
          });
        } catch (e) {
          console.error('Failed to parse saved profile:', e);
        }
      }
    }
    
    function h(e) {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
      if (stageRef.current && !stageRef.current.contains(e.target)) setStageOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [location]);

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

  async function handleSubmit() {
    setSubmitted(true);
    setTouched(Object.fromEntries(allIds.map(id => [id, true])));
    const errs = Object.fromEntries(allIds.map(id => [id, validate(id, form[id])]));
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    
    setLoading(true);
    setApiError("");
    
    const userProfile = {
      country: selectedCountry?.label || form.country,
      respondent_name: form.name,
      title: form.title,
      ministry_or_department: form.ministry,
      contact_email: form.email,
      development_stage: form.developmentStage
    };
    
    try {
      await saveProfile(userProfile);
      localStorage.setItem('sapi_preview_completed', 'true');
      setSuccess(true);
      setTimeout(() => navigate('/briefing'), 2000);
    } catch (err) {
      setApiError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCountry = COUNTRIES.find(c => c.value === form.country);
  const selectedStage = STAGES.find(s => s.value === form.developmentStage);
  
  const filteredCountries = COUNTRIES.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.value.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const inputClass = (id) => {
    const hasError = errors[id] && touched[id];
    const isFocused = focusedField === id;
    return `w-full box-border bg-sapi-midnight text-sapi-parchment outline-none px-4 py-3.5 font-sans text-[15px] tracking-wide rounded-sm caret-sapi-gold transition-colors duration-150 border ${
      hasError 
        ? 'border-sapi-crimson border-b-2' 
        : isFocused 
          ? 'border-sapi-gold border-b-2' 
          : 'border-sapi-bronze border-b-2 border-b-[rgba(107,69,8,0.4)]'
    }`;
  };

  const triggerClass = (id, isOpen) => {
    const hasError = errors[id] && touched[id];
    return `w-full box-border bg-sapi-midnight outline-none px-4 py-3.5 font-sans text-[15px] tracking-wide rounded-sm text-left cursor-pointer flex justify-between items-center transition-colors duration-150 border ${
      hasError 
        ? 'border-sapi-crimson border-b-2 text-sapi-parchment' 
        : isOpen 
          ? 'border-sapi-gold border-b-2 text-sapi-parchment' 
          : 'border-sapi-bronze border-b-2 border-b-[rgba(107,69,8,0.4)] text-sapi-muted/45'
    } ${form[id] ? 'text-sapi-parchment' : 'text-sapi-muted/45'}`;
  };

  const Chevron = ({ open }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      className={`flex-shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <path d="M2 5L7 10L12 5" stroke="#9880B0" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );

  const FieldLabel = ({ id, children, required }) => (
    <label className={`block font-sans text-[12px] tracking-extra-wide uppercase mb-2 transition-colors duration-150 ${
      errors[id] && touched[id] ? 'text-sapi-crimson' : 'text-sapi-muted'
    }`}>
      {children}{required && <span className="text-sapi-crimson ml-1">*</span>}
    </label>
  );

  const ErrMsg = ({ id }) => errors[id] && touched[id]
    ? <div className="font-sans text-[13px] text-sapi-crimson mt-2 tracking-wide">{errors[id]}</div>
    : null;

  // ── Success screen ──
  if (success) {
    return (
      <PageLayout className="flex items-center justify-center flex-col gap-4 p-8 text-center">
        <SAPIGlobe size={48} />
        {selectedCountry && <div className="text-4xl leading-none"><selectedCountry.Flag /></div>}
        <div className="w-12 h-px bg-sapi-bronze" />
        <div className="font-serif text-[24px] text-sapi-parchment tracking-wide">
          Profile received, {form.name.split(" ")[0]}.
        </div>
        <div className="font-sans text-[15px] text-sapi-muted max-w-[400px] leading-relaxed">
          {form.title}<br/>{form.ministry}<br/>{selectedCountry ? selectedCountry.label : form.country}
        </div>
        <div className="font-sans text-[13px] text-sapi-gold tracking-extra-wide uppercase">
          Development Stage: {form.developmentStage}
        </div>
        <div className="w-12 h-px bg-sapi-bronze" />
        <div className="font-sans text-[13px] text-sapi-muted">Proceeding to Assessment Briefing…</div>
        <button onClick={() => navigate('/')}
          className="bg-transparent border border-sapi-bronze text-sapi-muted px-7 py-2.5 font-sans text-[13px] tracking-extra-wide uppercase cursor-pointer mt-2 rounded-sm hover:border-sapi-gold hover:text-sapi-gold transition-colors">
          ← Edit Profile
        </button>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <style>{autofillStyles}</style>
      <PageHeader showAdmin={false} />

      {/* Progress nav */}
      <div className="max-w-container mx-auto px-8 pt-5 flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => navigate('/')}
          className={`bg-none border-none cursor-pointer font-sans text-[13px] tracking-wide uppercase flex items-center gap-1.5 p-0 transition-colors duration-150 ${backHover ? 'text-sapi-gold' : 'text-sapi-muted'}`}
          onMouseEnter={() => setBackHover(true)} onMouseLeave={() => setBackHover(false)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2.5L4.5 7L9 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div className="flex items-center gap-1.5">
          {[{n:1,label:"Organisation Profile",active:true},{n:2,label:"Assessment Briefing",active:false},{n:3,label:"Assessment",active:false}].map((step,i) => (
            <div key={step.n} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-5 h-px bg-sapi-bronze mx-0.5" />}
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center font-sans text-[12px] font-medium ${
                  step.active ? 'bg-sapi-gold text-sapi-void border border-sapi-gold' : 'bg-transparent text-sapi-muted border border-sapi-bronze/40'
                }`}>
                  {step.n}
                </div>
                <span className={`font-sans text-[13px] tracking-wide uppercase ${step.active ? 'text-sapi-parchment' : 'text-sapi-muted'}`}>{step.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[620px] mx-auto px-8 pt-14 pb-24">
        <div className="font-sans text-[12px] tracking-extra-wide text-sapi-gold uppercase mb-4">
          Step 1 of 3 &nbsp;·&nbsp; Organisation Profile
        </div>
        <h1 className="font-serif text-[32px] font-normal text-sapi-parchment tracking-wide leading-tight mb-3.5">
          Tell us about your institution.
        </h1>
        <p className="font-sans text-[15px] text-sapi-muted leading-relaxed mb-11 tracking-wide">
          Your profile personalises the assessment output and calibrates the roadmap to your institution's development stage and sovereign context.
        </p>

        {/* Confidentiality box */}
        <div className="border border-sapi-gold/25 border-l-[3px] border-l-sapi-gold bg-sapi-gold/5 px-5 py-4 mb-12">
          <div className="font-sans text-[12px] tracking-extra-wide uppercase text-sapi-gold mb-2">Data Classification</div>
          <p className="font-sans text-[13px] text-sapi-muted leading-relaxed m-0">
            Your responses are used solely to generate your Tier 1 SAPI assessment report. No individual data is shared with third parties without your explicit consent.{" "}
            <em className="text-sapi-parchment">Classification: Restricted.</em>
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Country dropdown */}
          <div ref={countryRef}>
            <FieldLabel id="country" required>Country / Nation</FieldLabel>
            <button type="button" className={triggerClass("country", countryOpen)}
              onClick={() => { setCountryOpen(o => !o); setStageOpen(false); setTouched(p => ({ ...p, country:true })); if (!countryOpen) setCountrySearch(""); }}>
              <span className="flex items-center gap-2.5">
                {selectedCountry
                  ? <><span className="leading-none"><selectedCountry.Flag /></span><span>{selectedCountry.label}</span></>
                  : <span>Select your country</span>}
              </span>
              <Chevron open={countryOpen} />
            </button>

            {countryOpen && (
              <div className="bg-sapi-midnight border border-sapi-gold border-t-0 rounded-b-sm overflow-hidden relative z-[300] max-h-[300px] flex flex-col">
                <div className="p-2 border-b border-sapi-bronze">
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => { setCountrySearch(e.target.value); setVisibleCount(5); }}
                    placeholder="Search country..."
                    className="w-full bg-sapi-midnight border border-sapi-bronze rounded-sm px-3 py-2 text-sapi-parchment text-[15px] placeholder:text-sapi-muted/70 focus:outline-none focus:border-sapi-gold bg-[#0a0a12] font-sans"
                    autoComplete="off"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="overflow-y-auto flex-1" onScroll={(e) => {
                  const { scrollTop, scrollHeight, clientHeight } = e.target;
                  if (scrollTop + clientHeight >= scrollHeight - 10) {
                    setVisibleCount(prev => Math.min(prev + 5, filteredCountries.length));
                  }
                }}>
                  {filteredCountries.slice(0, visibleCount).map((c, i) => (
                  <button key={c.value} type="button"
                    className={`w-full border-none text-left cursor-pointer flex items-stretch transition-colors duration-100 ${
                      form.country === c.value ? 'bg-sapi-gold/10' : 'bg-transparent'
                    } ${i > 0 ? 'border-t border-sapi-bronze' : ''}`}
                    onClick={() => { handleChange("country", c.value); setErrors(p => ({ ...p, country:null })); setCountryOpen(false); setCountrySearch(""); }}>
                    <div className="w-11 flex-shrink-0 flex items-center justify-center border-r border-sapi-bronze py-3">
                      <c.Flag />
                    </div>
                    <div className="py-3 px-4 flex-1">
                      <div className={`font-sans text-[15px] tracking-wide mb-0.5 ${
                        form.country === c.value ? 'text-sapi-paleGold font-medium' : 'text-sapi-parchment font-normal'
                      }`}>
                        {c.label}
                      </div>
                      <div className="font-sans text-[13px] text-sapi-muted tracking-wide">{c.sub}</div>
                    </div>
                    {form.country === c.value && (
                      <div className="flex items-center pr-3.5">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10L11 3" stroke="#C9963A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>
                ))}
                </div>
              </div>
            )}
            <ErrMsg id="country" />
          </div>

          {/* Text / email fields */}
          {TEXT_FIELDS.map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <FieldLabel id={id} required>{label}</FieldLabel>
              <input type={type} value={form[id]} placeholder={placeholder} className={inputClass(id)}
                onFocus={() => setFocusedField(id)}
                onBlur={() => handleBlur(id)}
                onChange={e => handleChange(id, e.target.value)}
                autoComplete="off" spellCheck={false} />
              <ErrMsg id={id} />
            </div>
          ))}

          {/* Development Stage dropdown */}
          <div ref={stageRef}>
            <FieldLabel id="developmentStage" required>Development Stage</FieldLabel>
            <button type="button" className={triggerClass("developmentStage", stageOpen)}
              onClick={() => { setStageOpen(o => !o); setCountryOpen(false); setTouched(p => ({ ...p, developmentStage:true })); }}>
              <span>{form.developmentStage || "Select your development stage"}</span>
              <Chevron open={stageOpen} />
            </button>

            {stageOpen && (
              <div className="bg-sapi-midnight border border-sapi-gold border-t-0 rounded-b-sm overflow-hidden relative z-[200]">
                {STAGES.map((stage, i) => (
                  <button key={stage.value} type="button"
                    className={`w-full border-none text-left cursor-pointer block transition-colors duration-100 px-4 py-3.5 ${
                      form.developmentStage === stage.value ? 'bg-sapi-gold/10' : 'bg-transparent'
                    } ${i > 0 ? 'border-t border-sapi-bronze' : ''}`}
                    onClick={() => { handleChange("developmentStage", stage.value); setErrors(p => ({ ...p, developmentStage:null })); setTouched(p => ({ ...p, developmentStage:true })); setStageOpen(false); }}>
                    <div className={`font-sans text-[15px] tracking-wide mb-1 flex items-center gap-2 ${
                      form.developmentStage === stage.value ? 'text-sapi-paleGold font-medium' : 'text-sapi-parchment font-normal'
                    }`}>
                      {stage.label}
                      {form.developmentStage === stage.value && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#C9963A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                    <div className="font-sans text-[13px] text-sapi-muted leading-relaxed tracking-wide">{stage.description}</div>
                  </button>
                ))}
              </div>
            )}

            {selectedStage && !stageOpen && (
              <div className="font-sans text-[13px] text-sapi-muted mt-2 leading-relaxed tracking-wide px-px">
                {selectedStage.description}
              </div>
            )}
            <ErrMsg id="developmentStage" />
          </div>
        </div>

        {/* Validation banner */}
        {submitted && Object.values(errors).some(Boolean) && (
          <div className="mt-9 border border-sapi-crimson/35 border-l-[3px] border-l-sapi-crimson bg-sapi-crimson/5 px-4 py-3.5">
            <div className="font-sans text-[13px] text-sapi-crimson tracking-wide uppercase">
              All fields are required. Please complete the form before proceeding.
            </div>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="mt-6 border border-sapi-crimson/35 border-l-[3px] border-l-sapi-crimson bg-sapi-crimson/5 px-4 py-3.5">
            <div className="font-sans text-[13px] text-sapi-crimson tracking-wide">
              {apiError}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12">
          <button
            className={`w-full text-sapi-void border-none px-12 py-4 font-sans text-[13px] tracking-extra-wide uppercase font-medium cursor-pointer rounded-sm transition-colors duration-150 flex items-center justify-center gap-2 ${
              btnHover ? 'bg-[#B8862A]' : 'bg-sapi-gold'
            } ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            onMouseEnter={() => setBtnHover(true)} onMouseLeave={() => setBtnHover(false)}
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>

      <PageFooter />
    </PageLayout>
  );
}
