import { useState, useEffect, useRef } from "react";
import { submitBriefedIndexRequest } from "../services/contactService";

/**
 * SAPI — Power Arc page enhancements
 * ------------------------------------------------
 * Two integrated components intended to sit on the SAPI Index page
 * above and alongside the existing Power Arc chart:
 *
 *   1. <OrientationStrip />    — horizontal thesis + stat tiles, sits
 *                                between the page header and chart controls.
 *   2. <BriefedVersionPanel /> — persistent right-edge drawer that captures
 *                                lead requests for the de-anonymised index.
 *
 * A demo layout (<SAPIIndexPageDemo />) is exported as the default so the
 * file can be previewed standalone; in production you'll import the two
 * named exports into your existing Index page component.
 *
 * Backend wiring:
 *   - Panel submit → POST /api/leads/request-access with requestType:"briefed_version"
 *     (this distinguishes it from the login page's "credentials" lead type)
 */

// ── Design tokens (kept for reference, using Tailwind classes now) ──────────
// const C = {
//   bg:        "#06030E",
//   card:      "#0F0830",
//   elevated:  "#1A1540",
//   gold:      "#C9963A",
//   goldPale:  "#EDD98A",
//   parchment: "#FBF5E6",
//   muted:     "#9880B0",
//   border:    "#6B4508",
//   crimson:   "#C03058",
//   emerald:   "#28A868",
// };

// ────────────────────────────────────────────────────────────────────────────
// 1. ORIENTATION STRIP
// ────────────────────────────────────────────────────────────────────────────
export function OrientationStrip() {
  return (
    <section className="w-full max-w-[1050px] mx-auto bg-sapi-navy border-y border-sapi-bronze/30">
      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:gap-6 items-center">
          {/* Thesis */}
          <div className="max-w-[700px] w-full text-left px-2 sm:px-0">
            <div className="text-[10px] tracking-[0.32em] text-sapi-gold font-medium mb-3 text-center">
              S.A.P.I. INDEX
            </div>
            <p className="font-serif text-[20px] leading-[1.45] text-sapi-parchment font-medium tracking-[0.005em]">
              Thirty-two nations, measured against the{" "}
              <span className="text-sapi-paleGold">Sovereign Power Arc</span> — the trajectory any state must follow to
              convert AI capability into coordinated action.
            </p>
            <p className="mt-[14px] text-sapi-muted text-[13px] leading-[1.6]">
              Identities withheld in this preview. Full attribution, dimension-level commentary, and trajectory
              analysis are available to verified institutional partners on request.
            </p>
          </div>

          {/* Stat tiles */}
          <div className="flex items-stretch border border-sapi-bronze/55 bg-sapi-void max-w-[700px] w-full mx-auto flex-wrap sm:flex-nowrap">
            <StatTile value="32" label="NATIONS ASSESSED" />
            <StatDivider />
            <StatTile value="5" label="SOVEREIGN DIMENSIONS" />
            <StatDivider />
            <StatTile value="30" label="TIER 1 INDICATORS" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatTile({ value, label, accent = false }) {
  return (
    <div className="px-4 sm:px-6 py-4 sm:py-5 flex flex-col items-center justify-center min-w-[100px] sm:min-w-[110px] flex-1">
      <div className={`font-serif text-[24px] sm:text-[30px] ${accent ? 'text-sapi-paleGold' : 'text-sapi-parchment'} font-medium tracking-[0.02em] leading-none mb-2`}>
        {value}
      </div>
      <div className="text-[8px] sm:text-[9px] tracking-[0.24em] text-sapi-muted font-medium whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

function StatDivider() {
  return (
    <div className="hidden sm:block w-px bg-gradient-to-b from-transparent via-sapi-bronze/60 to-transparent" />
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 2. BRIEFED VERSION SIDE PANEL
// ────────────────────────────────────────────────────────────────────────────
const REQUESTOR_TYPES = [
  { value: "",              label: "Select affiliation…" },
  { value: "government",    label: "Government or ministry" },
  { value: "multilateral",  label: "Multilateral or development body" },
  { value: "academic",      label: "Academic or research institution" },
  { value: "media",         label: "Media organisation (embargo-restricted)" },
  { value: "other",         label: "Other" },
];

export function BriefedVersionPanel() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    institution: "",
    requestorType: "",
    context: "",
  });
  const [errors, setErrors] = useState({});
  const firstFieldRef = useRef(null);

  // Escape closes panel; autofocus first field on open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    // slight delay so the slide-in finishes before focus
    const t = setTimeout(() => firstFieldRef.current?.focus(), 250);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())    e.fullName = "Required";
    if (!form.email.trim())       e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.institution.trim()) e.institution = "Required";
    if (!form.requestorType)      e.requestorType = "Please select";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const briefedData = {
        name: form.fullName,
        email: form.email,
        institution: form.institution,
        behalfOf: form.requestorType,
        additionalContext: form.context,
      };
      await submitBriefedIndexRequest(briefedData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit briefed index request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    // reset after close animation
    setTimeout(() => {
      setSubmitted(false);
      setForm({ fullName: "", email: "", institution: "", requestorType: "", context: "" });
      setErrors({});
    }, 350);
  };

  return (
    <>
      {/* ── Collapsed tab (always visible on right edge) ──────────────── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Request briefed version of the index"
          className="fixed z-40 transition-all duration-200 right-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] bg-sapi-gold text-sapi-void py-5 px-3 border-none rounded-tl-sm rounded-bl-sm text-[11px] tracking-[0.28em] font-medium cursor-pointer shadow-[-4px_0_24px_rgba(6,3,14,0.67),0_0_0_1px_rgba(237,217,138,0.2)] hover:bg-sapi-paleGold hover:pr-4"
        >
          REQUEST BRIEFED VERSION
        </button>
      )}

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        onClick={resetAndClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 bg-sapi-void/90 backdrop-blur-sm ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
      />

      {/* ── Drawer ────────────────────────────────────────────────────── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="briefed-panel-title"
        className={`fixed z-50 top-0 right-0 h-full transition-transform duration-300 ease-out overflow-y-auto w-[min(440px,100vw)] bg-sapi-navy border-l border-sapi-bronze/55 shadow-[-40px_0_80px_-20px_rgba(6,3,14,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {submitted ? (
          <PanelSubmittedState onClose={resetAndClose} />
        ) : (
          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-[10px] tracking-[0.32em] text-sapi-gold font-medium mb-[10px]">
                  BRIEFED INDEX · REQUEST
                </div>
                <h2
                  id="briefed-panel-title"
                  className="font-serif text-[24px] text-sapi-parchment tracking-[0.04em] font-medium leading-[1.25]"
                >
                  See the index with nations named
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                aria-label="Close panel"
                className="bg-transparent border-none text-sapi-muted cursor-pointer p-1.5 -mt-1.5 -mr-1.5 hover:text-sapi-parchment"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="text-sapi-muted text-[13px] leading-[1.65] mb-5 pb-5 border-b border-sapi-bronze/30">
              The public preview anonymises all thirty-two nations. The briefed version — with attribution,
              dimension-level commentary, and trajectory analysis for the top and bottom quartiles — is made
              available to verified institutional partners.
            </p>

            {/* Intel summary — 3 things they get */}
            <div className="mb-7 space-y-3">
              <IntelRow icon="identities" text="All 32 nations named and attributed" />
              <IntelRow icon="commentary" text="Editorial commentary on each dimension" />
              <IntelRow icon="trajectory" text="12-month trajectory analysis with methodology" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <PanelField
                label="FULL NAME"
                refEl={firstFieldRef}
                error={errors.fullName}
                value={form.fullName}
                onChange={update("fullName")}
                placeholder="e.g. Dr. Amina Okafor"
              />

              <PanelField
                label="OFFICIAL EMAIL"
                type="email"
                error={errors.email}
                value={form.email}
                onChange={update("email")}
                placeholder="name@institution.org"
              />

              <PanelField
                label="INSTITUTION"
                error={errors.institution}
                value={form.institution}
                onChange={update("institution")}
                placeholder="e.g. Ministry of Digital Economy"
              />

              <div>
                <PanelLabel>I AM REQUESTING ON BEHALF OF</PanelLabel>
                <select
                  value={form.requestorType}
                  onChange={update("requestorType")}
                  className={`w-full rounded-sm bg-sapi-midnight ${form.requestorType ? 'text-sapi-parchment' : 'text-sapi-muted'} border ${errors.requestorType ? 'border-sapi-crimson' : 'border-sapi-bronze/55'} px-3.5 py-3 text-[13px] outline-none font-normal appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1 L6 6 L11 1%22 stroke=%22%23C9963A%22 stroke-width=%221.2%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')] bg-no-repeat bg-[right_14px_center] pr-9 focus:border-sapi-gold focus:outline-none`}
                >
                  {REQUESTOR_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-sapi-midnight text-sapi-parchment">
                      {t.label}
                    </option>
                  ))}
                </select>
                {errors.requestorType && <PanelError>{errors.requestorType}</PanelError>}
              </div>

              <div>
                <PanelLabel>
                  ADDITIONAL CONTEXT <span className="text-sapi-muted tracking-[0.1em]">(optional)</span>
                </PanelLabel>
                <textarea
                  value={form.context}
                  onChange={update("context")}
                  rows={3}
                  placeholder="Specific nations of interest, embargo windows, or anything that helps us prioritise."
                  className="w-full rounded-sm bg-sapi-midnight text-sapi-parchment border border-sapi-bronze/55 px-3.5 py-3 text-[13px] outline-none resize-y font-inherit font-normal focus:border-sapi-gold focus:outline-none"
                />
              </div>

              <p className="text-sapi-muted text-[11px] leading-[1.6] border-t border-sapi-bronze/30 pt-4 mt-1">
                Requests are reviewed within two working days. The briefed index is shared under an attribution
                licence; redistribution terms are set out in the response.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 rounded-sm transition-all border-none text-[12px] tracking-[0.28em] font-medium mt-2 ${submitting ? 'bg-sapi-gold/60 cursor-wait' : 'bg-sapi-gold text-sapi-void cursor-pointer hover:bg-sapi-paleGold'}`}
              >
                {submitting ? "SUBMITTING…" : "REQUEST BRIEFED INDEX"}
              </button>
            </form>
          </div>
        )}
      </aside>
    </>
  );
}

// ── Panel sub-components ────────────────────────────────────────────────────
function PanelSubmittedState({ onClose }) {
  return (
    <div className="p-10 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <div className="flex items-center justify-center rounded-full mb-6 w-16 h-16 border border-sapi-gold bg-sapi-gold/20">
        <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
          <path d="M7 15.5 L13 21 L23 9" stroke="#C9963A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="text-[10px] tracking-[0.32em] text-sapi-gold font-medium mb-[14px]">
        REQUEST RECEIVED
      </div>

      <h2 className="font-serif text-[22px] text-sapi-parchment tracking-[0.04em] font-medium leading-[1.3] mb-[14px]">
        Your request is with our review team
      </h2>

      <p className="text-sapi-muted text-[13px] leading-[1.7] max-w-[36ch] mx-auto mb-7">
        We will verify your institution and respond within two working days. The briefed index, when released, will
        be sent to the email you provided.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="py-3 px-8 rounded-sm transition-all bg-transparent text-sapi-paleGold border border-sapi-gold text-[11px] tracking-[0.28em] font-medium cursor-pointer hover:bg-sapi-gold/20 hover:border-sapi-paleGold"
      >
        CLOSE
      </button>
    </div>
  );
}

function IntelRow({ icon, text }) {
  const icons = {
    identities: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="5" r="2.5" stroke="#C9963A" strokeWidth="1" />
        <path d="M2 12 Q7 8 12 12" stroke="#C9963A" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
    ),
    commentary: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="3" width="10" height="7" rx="1" stroke="#C9963A" strokeWidth="1" />
        <path d="M4 6 H10 M4 8 H8" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    trajectory: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 10 Q6 2 12 4" stroke="#C9963A" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M10 3 L12 4 L11 6" stroke="#C9963A" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  };
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center flex-shrink-0 w-7 h-7 border border-sapi-bronze/55 bg-sapi-midnight">
        {icons[icon]}
      </div>
      <div className="text-sapi-parchment text-[13px] leading-[1.5]">
        {text}
      </div>
    </div>
  );
}

function PanelLabel({ children }) {
  return (
    <label className="block mb-2 text-sapi-parchment text-[10px] tracking-[0.24em] font-medium">
      {children}
    </label>
  );
}

function PanelField({ label, error, refEl, ...inputProps }) {
  return (
    <div>
      <PanelLabel>{label}</PanelLabel>
      <input
        ref={refEl}
        type={inputProps.type || "text"}
        {...inputProps}
        className={`w-full rounded-sm bg-sapi-midnight text-sapi-parchment border ${error ? 'border-sapi-crimson' : 'border-sapi-bronze/55'} px-3.5 py-3 text-[13px] outline-none font-normal focus:border-sapi-gold focus:outline-none`}
      />
      {error && <PanelError>{error}</PanelError>}
    </div>
  );
}

function PanelError({ children }) {
  return (
    <div className="text-sapi-crimson text-[11px] mt-[5px] tracking-[0.04em]">
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// DEMO PAGE (for preview only — not part of production import)
// ────────────────────────────────────────────────────────────────────────────
export default function SAPIIndexPageDemo() {
  return (
    <div className="bg-sapi-void text-sapi-parchment min-h-screen font-sans font-normal">
      {/* Placeholder nav */}
      <div className="px-8 py-5 flex items-center justify-between border-b border-sapi-bronze/30">
        <div className="font-serif text-[15px] tracking-[0.18em] text-sapi-parchment font-medium">
          THE SOVEREIGN AI POWER INDEX
        </div>
        <div className="text-sapi-muted text-[11px] tracking-[0.24em]">
          INDEX · METHODOLOGY · PREVIEW · ABOUT
        </div>
      </div>

      {/* The actual new piece #1 */}
      <OrientationStrip />

      {/* Placeholder for existing Power Arc chart */}
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex items-center justify-center bg-sapi-navy border border-dashed border-sapi-bronze/55 h-[540px] text-sapi-muted text-[13px] tracking-[0.16em]">
          EXISTING POWER ARC CHART RENDERS HERE
        </div>
      </div>

      {/* The actual new piece #2 — floats, always present */}
      <BriefedVersionPanel />
    </div>
  );
}
