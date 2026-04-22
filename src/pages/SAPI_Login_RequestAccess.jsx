import { useState, useEffect, useRef } from "react";

/**
 * SAPI — Login Page with Request Credentials flow
 * ------------------------------------------------
 * Single-file React component. No external CSS imports.
 * Palette and typography follow the established SAPI design system.
 *
 * Includes:
 *   1. Login form (email + password)
 *   2. "Request Credentials" CTA beneath the login form
 *   3. Modal with 7-field lead capture form for government officials
 *      who do not yet have credentials
 *   4. Success state after submission
 *
 * Integration notes for backend wiring:
 *   - handleLoginSubmit()  → POST /api/auth/login
 *   - handleRequestSubmit() → POST /api/leads/request-access
 *   Both are currently stubbed with console.log + simulated latency.
 */

// ── Design tokens (single source of truth) ──────────────────────────────────
const C = {
  bg:        "#06030E", // void black
  card:      "#0F0830", // deep navy
  elevated:  "#1A1540", // midnight
  gold:      "#C9963A", // sovereign gold
  goldPale:  "#EDD98A", // pale gold
  parchment: "#FBF5E6", // primary text
  muted:     "#9880B0", // lavender grey
  border:    "#6B4508", // dark bronze
  crimson:   "#C03058",
  blue:      "#4A7AE0",
};

// ── Inline SVG Logo ─────────────────────────────────────────────────────────
function SAPIGlobe({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="29" stroke={C.parchment} strokeWidth="1.2" />
      <ellipse cx="32" cy="32" rx="29" ry="11" stroke={C.parchment} strokeWidth="1" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke={C.parchment} strokeWidth="1" transform="rotate(-28 32 32)" strokeDasharray="2 1.5" />
      <ellipse cx="32" cy="32" rx="22" ry="29" stroke={C.parchment} strokeWidth="0.8" transform="rotate(28 32 32)" strokeDasharray="2 1.5" />
      {[[32,3],[55,20],[55,44],[32,61],[9,44],[9,20],[46,12],[18,52]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill={C.parchment} />
      ))}
      <line x1="32" y1="3"  x2="55" y2="20" stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="20" x2="55" y2="44" stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
      <line x1="55" y1="44" x2="32" y2="61" stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
      <line x1="32" y1="61" x2="9"  y2="44" stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="44" x2="9"  y2="20" stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
      <line x1="9"  y1="20" x2="32" y2="3"  stroke={C.parchment} strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}

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
export default function SAPILogin() {
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Request Credentials modal state
  const [modalOpen, setModalOpen] = useState(false);

  // ── Login handler (stub) ──────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!email || !password) {
      setLoginError("Please enter both email and password.");
      return;
    }
    setLoggingIn(true);
    try {
      // TODO: replace with real auth call
      // const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      console.log("[stub] login attempt", { email });
      await new Promise((r) => setTimeout(r, 600));
      setLoginError("Invalid credentials. If you do not have an account, request credentials below.");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: C.bg,
        color: C.parchment,
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        fontWeight: 400,
      }}
    >
      {/* Ambient gold glow (very subtle, pure decoration) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            `radial-gradient(ellipse 60% 40% at 50% 10%, ${C.gold}18 0%, transparent 60%),` +
            `radial-gradient(ellipse 50% 30% at 50% 100%, ${C.card}80 0%, transparent 70%)`,
        }}
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Logo + wordmark */}
          <div className="flex flex-col items-center mb-6 sm:mb-10">
            <SAPIGlobe size={40} />
            <div
              className="mt-4 text-center"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "11px",
                letterSpacing: "0.32em",
                color: C.parchment,
                fontWeight: 500,
              }}
            >
              THE SOVEREIGN AI POWER INDEX
            </div>
          </div>

          {/* Login card */}
          <div
            className="rounded-sm p-6 sm:p-8 md:p-10"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}33`,
              boxShadow: `0 30px 80px -20px ${C.bg}`,
            }}
          >
            <div className="text-center mb-2">
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "28px",
                  letterSpacing: "0.18em",
                  color: C.parchment,
                  fontWeight: 500,
                }}
              >
                SIGN IN
              </h1>
            </div>
            <div
              className="text-center mb-8"
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                color: C.muted,
                fontWeight: 500,
              }}
            >
              SAPI ASSESSMENT PORTAL SECURE ACCESS
            </div>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.border}55, transparent)` }}
            />

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <FieldLabel>EMAIL ADDRESS</FieldLabel>
              <StyledInput
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <FieldLabel className="pt-2">PASSWORD</FieldLabel>
              <StyledInput
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {loginError && (
                <div
                  style={{ color: C.crimson, fontSize: "12px", letterSpacing: "0.04em" }}
                  role="alert"
                >
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-4 mt-2 transition-all duration-200 rounded-sm"
                style={{
                  backgroundColor: loggingIn ? `${C.gold}99` : C.gold,
                  color: C.bg,
                  fontSize: "13px",
                  letterSpacing: "0.28em",
                  fontWeight: 500,
                  cursor: loggingIn ? "wait" : "pointer",
                }}
                onMouseEnter={(e) => { if (!loggingIn) e.currentTarget.style.backgroundColor = C.goldPale; }}
                onMouseLeave={(e) => { if (!loggingIn) e.currentTarget.style.backgroundColor = C.gold; }}
              >
                {loggingIn ? "VERIFYING…" : "SIGN IN"}
              </button>
            </form>

            {/* ── Request Credentials divider + CTA ─────────────────────── */}
            <div className="mt-10">
              <div
                className="flex items-center gap-4 mb-5"
                style={{ color: `${C.muted}`, fontSize: "10px", letterSpacing: "0.28em", fontWeight: 500 }}
              >
                <div className="flex-1" style={{ height: "1px", background: `${C.border}40` }} />
                <span>NOT YET CREDENTIALED</span>
                <div className="flex-1" style={{ height: "1px", background: `${C.border}40` }} />
              </div>

              <p
                className="text-center mb-5"
                style={{
                  color: C.muted,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  maxWidth: "36ch",
                  margin: "0 auto 20px",
                }}
              >
                Access to the SAPI portal is issued to verified officials. Request credentials and our team will
                validate your institution and respond within two working days.
              </p>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-3.5 transition-all duration-200 rounded-sm"
                style={{
                  backgroundColor: "transparent",
                  color: C.goldPale,
                  border: `1px solid ${C.gold}`,
                  fontSize: "12px",
                  letterSpacing: "0.28em",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${C.gold}15`;
                  e.currentTarget.style.borderColor = C.goldPale;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = C.gold;
                }}
              >
                REQUEST CREDENTIALS
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative px-6 py-8 text-center"
        style={{ color: C.muted, fontSize: "11px", letterSpacing: "0.18em", fontWeight: 500 }}
      >
        2026 · THE SOVEREIGN AI POWER INDEX · AUTHORISED ACCESS ONLY
      </footer>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {modalOpen && (
        <RequestCredentialsModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// REQUEST CREDENTIALS MODAL
// ────────────────────────────────────────────────────────────────────────────
function RequestCredentialsModal({ onClose }) {
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

  // Close on Escape + body scroll lock + autofocus first field
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

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
      // TODO: replace with real endpoint
      // await fetch("/api/leads/request-access", { method: "POST", body: JSON.stringify(form) });
      console.log("[stub] access request submitted", form);
      await new Promise((r) => setTimeout(r, 900));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: "rgba(6, 3, 14, 0.88)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-sm max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: C.card,
          border: `1px solid ${C.border}55`,
          boxShadow: `0 40px 100px -20px ${C.bg}, 0 0 0 1px ${C.gold}15`,
        }}
      >
        {submitted ? (
          <SubmittedState onClose={onClose} />
        ) : (
          <div className="p-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.32em",
                    color: C.gold,
                    fontWeight: 500,
                    marginBottom: "10px",
                  }}
                >
                  CREDENTIAL REQUEST
                </div>
                <h2
                  id="request-modal-title"
                  style={{
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "26px",
                    color: C.parchment,
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                    lineHeight: 1.25,
                  }}
                >
                  Request access to the SAPI portal
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="transition-colors"
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.muted,
                  cursor: "pointer",
                  padding: "6px",
                  marginTop: "-6px",
                  marginRight: "-6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.parchment)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p
              style={{
                color: C.muted,
                fontSize: "13px",
                lineHeight: 1.65,
                marginBottom: "28px",
                paddingBottom: "22px",
                borderBottom: `1px solid ${C.border}30`,
              }}
            >
              SAPI is issued to verified government officials, ministries, and advisory bodies. Submit the details
              below and our team will validate your institution and respond within two working days.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
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
                  className="w-full rounded-sm transition-all"
                  style={{
                    backgroundColor: C.elevated,
                    color: form.useCase ? C.parchment : C.muted,
                    border: `1px solid ${errors.useCase ? C.crimson : `${C.border}55`}`,
                    padding: "14px 16px",
                    fontSize: "14px",
                    outline: "none",
                    fontWeight: 400,
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1 L6 6 L11 1' stroke='%23${C.gold.slice(1)}' stroke-width='1.2' fill='none' stroke-linecap='round'/></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 16px center",
                    paddingRight: "40px",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.useCase ? C.crimson : `${C.border}55`)}
                >
                  {USE_CASES.map((u) => (
                    <option key={u.value} value={u.value} style={{ backgroundColor: C.elevated, color: C.parchment }}>
                      {u.label}
                    </option>
                  ))}
                </select>
                {errors.useCase && <ErrorText>{errors.useCase}</ErrorText>}
              </div>

              <div>
                <FieldLabel>
                  BRIEF CONTEXT <span style={{ color: C.muted, letterSpacing: "0.1em" }}>(optional)</span>
                </FieldLabel>
                <textarea
                  value={form.context}
                  onChange={update("context")}
                  rows={3}
                  placeholder="Anything that helps us verify your role or expedite access."
                  className="w-full rounded-sm transition-all"
                  style={{
                    backgroundColor: C.elevated,
                    color: C.parchment,
                    border: `1px solid ${C.border}55`,
                    padding: "14px 16px",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "inherit",
                    fontWeight: 400,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = `${C.border}55`)}
                />
              </div>

              {/* Privacy note */}
              <p
                style={{
                  color: C.muted,
                  fontSize: "11px",
                  lineHeight: 1.6,
                  letterSpacing: "0.02em",
                  borderTop: `1px solid ${C.border}30`,
                  paddingTop: "20px",
                  marginTop: "8px",
                }}
              >
                The information you submit is used solely to verify your credentials and provision portal access.
                It is not shared with third parties.
              </p>

              {/* Action row */}
              <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-sm transition-all"
                  style={{
                    backgroundColor: "transparent",
                    color: C.muted,
                    border: `1px solid ${C.border}55`,
                    fontSize: "12px",
                    letterSpacing: "0.24em",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.parchment;
                    e.currentTarget.style.borderColor = `${C.border}90`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.muted;
                    e.currentTarget.style.borderColor = `${C.border}55`;
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-sm transition-all"
                  style={{
                    backgroundColor: submitting ? `${C.gold}99` : C.gold,
                    color: C.bg,
                    border: "none",
                    fontSize: "12px",
                    letterSpacing: "0.24em",
                    fontWeight: 500,
                    cursor: submitting ? "wait" : "pointer",
                  }}
                  onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = C.goldPale; }}
                  onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = C.gold; }}
                >
                  {submitting ? "SUBMITTING…" : "SUBMIT REQUEST"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SUCCESS / SUBMITTED STATE
// ────────────────────────────────────────────────────────────────────────────
function SubmittedState({ onClose }) {
  return (
    <div className="p-10 md:p-12 text-center">
      {/* Gold seal */}
      <div className="flex justify-center mb-6">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "72px",
            height: "72px",
            border: `1px solid ${C.gold}`,
            backgroundColor: `${C.gold}12`,
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path
              d="M7 15.5 L13 21 L23 9"
              stroke={C.gold}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          letterSpacing: "0.32em",
          color: C.gold,
          fontWeight: 500,
          marginBottom: "14px",
        }}
      >
        REQUEST RECEIVED
      </div>

      <h2
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "28px",
          color: C.parchment,
          letterSpacing: "0.04em",
          fontWeight: 500,
          lineHeight: 1.3,
          marginBottom: "16px",
        }}
      >
        Your request is with our review team
      </h2>

      <p
        style={{
          color: C.muted,
          fontSize: "14px",
          lineHeight: 1.7,
          maxWidth: "44ch",
          margin: "0 auto 32px",
        }}
      >
        We will verify your institution and respond within two working days. Credentials, when issued, will be
        sent to the email address you provided.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="py-3.5 px-10 rounded-sm transition-all"
        style={{
          backgroundColor: "transparent",
          color: C.goldPale,
          border: `1px solid ${C.gold}`,
          fontSize: "12px",
          letterSpacing: "0.28em",
          fontWeight: 500,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${C.gold}15`;
          e.currentTarget.style.borderColor = C.goldPale;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.borderColor = C.gold;
        }}
      >
        RETURN TO SIGN IN
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// REUSABLE FIELD PRIMITIVES
// ────────────────────────────────────────────────────────────────────────────
function FieldLabel({ children, className = "" }) {
  return (
    <label
      className={`block mb-2 ${className}`}
      style={{
        color: C.parchment,
        fontSize: "11px",
        letterSpacing: "0.22em",
        fontWeight: 500,
      }}
    >
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
      className="w-full rounded-sm transition-all"
      style={{
        backgroundColor: C.elevated,
        color: C.parchment,
        border: `1px solid ${C.border}55`,
        padding: "14px 16px",
        fontSize: "14px",
        outline: "none",
        fontWeight: 400,
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
      onBlur={(e) => (e.currentTarget.style.borderColor = `${C.border}55`)}
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
        className="w-full rounded-sm transition-all"
        style={{
          backgroundColor: C.elevated,
          color: C.parchment,
          border: `1px solid ${error ? C.crimson : `${C.border}55`}`,
          padding: "14px 16px",
          fontSize: "14px",
          outline: "none",
          fontWeight: 400,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = C.gold)}
        onBlur={(e) => (e.currentTarget.style.borderColor = error ? C.crimson : `${C.border}55`)}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && (
        <div style={{ color: C.muted, fontSize: "11px", marginTop: "6px", letterSpacing: "0.02em" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function ErrorText({ children }) {
  return (
    <div style={{ color: C.crimson, fontSize: "11px", marginTop: "6px", letterSpacing: "0.04em" }}>
      {children}
    </div>
  );
}
