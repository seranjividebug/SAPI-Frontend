  import { useState, useEffect, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import { submitCredentialRequest } from "../services/contactService";

  /**
   * SAPI — Request Access Page
   * ------------------------------------------------
   * Single-file React component. No external CSS imports.
   * Palette and typography follow the established SAPI design system.
   *
   * Includes:
   *   1. 7-field lead capture form for government officials
   *      who do not yet have credentials
   *   2. Success state after submission
   *
   * Integration notes for backend wiring:
   *   - handleSubmit() → POST /api/leads/request-access
   *   Currently stubbed with console.log + simulated latency.
   */


  // ── Use-case options for the request form ──────────────────────────────────
  const USE_CASES = [
    { value: "", label: "Select intended use…" },
    { value: "own_nation",  label: "Self-assessment for my nation" },
    { value: "advisory",    label: "Advisory to another government" },
    { value: "research",    label: "Academic or think-tank research" },
    { value: "multilateral",label: "Multilateral / intergovernmental body" },
    { value: "other",       label: "Other" },
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // MAIN COMPONENT
  // ────────────────────────────────────────────────────────────────────────────
  export default function RequestAccessPage() {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen w-full flex flex-col bg-sapi-void text-sapi-parchment font-sans">
        {/* Ambient gold glow (very subtle, pure decoration) */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              `radial-gradient(ellipse 60% 40% at 50% 10%, #C9963A18 0%, transparent 60%),` +
              `radial-gradient(ellipse 50% 30% at 50% 100%, #0F083080 0%, transparent 70%)`,
          }}
        />

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="relative flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            {/* Wordmark */}
            <div className="flex flex-col items-center mb-10">

            </div>

            {/* Request Access card */}
            <div className="rounded-sm p-8 md:p-10 relative bg-sapi-navy border border-sapi-bronze/55 shadow-[0_40px_100px_-20px_#06030E,0_0_0_1px_#C9963A15]">
              {/* Back to Login - Inside Card Top Left */}
              <button
                onClick={() => navigate('/login')}
                className="absolute top-4 mt-2 left-4 font-sans text-[11px] hover:text-sapi-gold transition-colors duration-150 bg-transparent border-none cursor-pointer tracking-wide uppercase text-[#E0E0E0]"
              >
                ← Back to Login
              </button>

              <RequestAccessForm />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative px-6 py-8 text-center text-[#E0E0E0] text-[11px] tracking-[0.18em] font-medium">
          2026 · THE SOVEREIGN AI POWER INDEX · AUTHORISED ACCESS ONLY
        </footer>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // REQUEST ACCESS FORM
  // ────────────────────────────────────────────────────────────────────────────
  function RequestAccessForm() {
    const [form, setForm] = useState({
      fullName: "",
      title: "",
      entity: "",
      country: "",
      email: "",
      useCase: "",
      context: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const firstFieldRef = useRef(null);

    // Autofocus first field on mount
    useEffect(() => {
      firstFieldRef.current?.focus();
    }, []);

    const update = (k) => (e) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
    };

    const validate = () => {
      const e = {};
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!form.title.trim())    e.title = "Required";
      if (!form.entity.trim())   e.entity = "Required";
      if (!form.country.trim())  e.country = "Required";
      if (!form.email.trim())    e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.useCase)         e.useCase = "Please select";
      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
      ev.preventDefault();
      if (!validate()) return;
      setSubmitting(true);
      try {
        const credentialData = {
          fullName: form.fullName,
          officialTitle: form.title,
          entity: form.entity,
          country: form.country,
          email: form.email,
          intendedUse: form.useCase,
          briefContext: form.context,
        };
        await submitCredentialRequest(credentialData);
        setSubmitted(true);
      } catch (error) {
        console.error("Failed to submit credential request:", error);
        alert("Failed to submit request. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

    if (submitted) {
      return <SubmittedState />;
    }

    return (
      <>
        {/* Header */}
        <div className="mb-6 mt-3">
          <div className="text-[10px] tracking-[0.32em] text-sapi-gold font-medium mb-2.5">
            CREDENTIAL REQUEST
          </div>
          <h2 className="font-serif text-[26px] text-sapi-parchment tracking-[0.06em] font-medium leading-[1.25]">
            Request access to the SAPI portal
          </h2>
        </div>

        <p className="text-[#E0E0E0] text-[13px] leading-[1.65] mb-7 pb-5.5 border-b border-[#6B450830]">
          SAPI is issued to verified government officials, ministries, and advisory bodies. Submit the details
          below and our team will validate your institution and respond within two working days.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="FULL NAME"
              error={errors.fullName}
              refEl={firstFieldRef}
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="e.g. Dr. Amina Okafor"
            />
            <FormField
              label="OFFICIAL TITLE"
              error={errors.title}
              value={form.title}
              onChange={update("title")}
              placeholder="e.g. Minister of Digital Economy"
            />
          </div>

          <FormField
            label="GOVERNMENT ENTITY OR MINISTRY"
            error={errors.entity}
            value={form.entity}
            onChange={update("entity")}
            placeholder="e.g. Federal Ministry of Communications & Digital Economy"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="COUNTRY"
              error={errors.country}
              value={form.country}
              onChange={update("country")}
              placeholder="e.g. Nigeria"
            />
            <FormField
              label="OFFICIAL EMAIL"
              error={errors.email}
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="name@ministry.gov"
              hint="Government-issued emails are processed faster."
            />
          </div>

          <div>
            <FieldLabel>INTENDED USE</FieldLabel>
            <select
              value={form.useCase}
              onChange={update("useCase")}
              className="w-full rounded-sm transition-all bg-sapi-midnight text-sapi-parchment border border-[#6B450855] p-3.5 text-[14px] outline-none font-normal appearance-none pr-10 focus:border-sapi-gold"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1 L6 6 L11 1' stroke='%23C9963A' stroke-width='1.2' fill='none' stroke-linecap='round'/></svg>")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
            >
              {USE_CASES.map((u) => (
                <option key={u.value} value={u.value} className="bg-sapi-midnight text-sapi-parchment">
                  {u.label}
                </option>
              ))}
            </select>
            {errors.useCase && <ErrorText>{errors.useCase}</ErrorText>}
          </div>

          <div>
            <FieldLabel>
              BRIEF CONTEXT <span className="text-[#E0E0E0] tracking-[0.1em]">(optional)</span>
            </FieldLabel>
            <textarea
              value={form.context}
              onChange={update("context")}
              rows={3}
              placeholder="Anything that helps us verify your role or expedite access."
              className="w-full rounded-sm transition-all bg-sapi-midnight text-sapi-parchment border border-[#6B450855] p-3.5 text-[14px] outline-none resize-y font-normal font-inherit focus:border-sapi-gold"
            />
          </div>

          {/* Privacy note */}
          <p className="text-[#E0E0E0] text-[11px] leading-[1.6] tracking-[0.02em] border-t border-[#6B450830] pt-5 mt-2">
            The information you submit is used solely to verify your credentials and provision portal access.
            It is not shared with third parties.
          </p>

          {/* Submit and Cancel buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-sm transition-all bg-sapi-gold text-sapi-void border-none text-[12px] tracking-[0.24em] font-medium hover:bg-[#B8862A] disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "SUBMITTING…" : "SUBMIT REQUEST"}
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/login'}
              className="flex-1 py-3.5 rounded-sm transition-all bg-sapi-navy text-sapi-parchment border border-[#6B450855] text-[12px] tracking-[0.24em] font-medium hover:border-sapi-paleGold"
            >
              CANCEL
            </button>
          </div>
        </form>
      </>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SUCCESS / SUBMITTED STATE
  // ────────────────────────────────────────────────────────────────────────────
  function SubmittedState() {
    return (
      <div className="p-10 md:p-12 text-center">
        {/* Gold seal */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center rounded-full w-[72px] h-[72px] border border-sapi-gold bg-[#C9963A12]">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path
                d="M7 15.5 L13 21 L23 9"
                stroke="#C9963A"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="text-[10px] tracking-[0.32em] text-sapi-gold font-medium mb-3.5">
          REQUEST RECEIVED
        </div>

        <h2 className="font-serif text-[28px] text-sapi-parchment tracking-[0.04em] font-medium leading-[1.3] mb-4">
          Your request is with our review team
        </h2>

        <p className="text-[#E0E0E0] text-[14px] leading-[1.7] max-w-[44ch] mx-auto">
          We will verify your institution and respond within two working days. Credentials, when issued, will be
          sent to the email address you provided.
        </p>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // REUSABLE FIELD PRIMITIVES
  // ────────────────────────────────────────────────────────────────────────────
  function FieldLabel({ children, className = "" }) {
    return (
      <label className={`block mb-2 text-sapi-parchment text-[11px] tracking-[0.22em] font-medium ${className}`}>
        {children}
      </label>
    );
  }

  function StyledInput({ type = "text", value, onChange, placeholder, autoComplete }) {
    return (
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-sm transition-all bg-sapi-midnight text-sapi-parchment border border-[#6B450855] p-3.5 text-[14px] outline-none font-normal focus:border-sapi-gold"
      />
    );
  }

  function FormField({ label, error, hint, refEl, ...inputProps }) {
    return (
      <div>
        <FieldLabel>{label}</FieldLabel>
        <input
          ref={refEl}
          type={inputProps.type || "text"}
          {...inputProps}
          className="w-full rounded-sm transition-all bg-sapi-midnight text-sapi-parchment border border-[#6B450855] p-3.5 text-[14px] outline-none font-normal focus:border-sapi-gold"
          style={error ? { borderColor: "#C03058" } : {}}
          onBlur={(e) => { if (error) e.currentTarget.style.borderColor = "#C03058"; }}
        />
        {error && <ErrorText>{error}</ErrorText>}
        {!error && hint && (
          <div className="text-[#E0E0E0] text-[11px] mt-1.5 tracking-[0.02em]">
            {hint}
          </div>
        )}
      </div>
    );
  }

  function ErrorText({ children }) {
    return (
      <div className="text-sapi-crimson text-[11px] mt-1.5 tracking-[0.04em]">
        {children}
      </div>
    );
  }
