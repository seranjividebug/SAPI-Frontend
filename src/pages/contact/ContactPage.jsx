import { memo, useState } from "react";
import ObsidianLayout from "../common/ObsidianLayout";
import { submitContactForm } from "../../services/contactService";

// "Request a briefing" page, ported from the "SAPI Obsidian" reference build (briefing.html).
// The enquiry form posts to the existing contact API (POST /contact/submit).

const INTERESTS = [
  { value: "briefing", label: "An investor briefing", hint: "A working session against the current edition." },
  { value: "assessment", label: "A country or corporate assessment", hint: "A commissioned assessment of a single nation or company." },
  { value: "convening", label: "Convening participation", hint: "Attending, or speaking at, a SAPI convening." },
  { value: "defence", label: "A defence AI investment read", hint: <><span data-di="">Directed Intelligence</span> applied to defence and national security programmes.</> },
  { value: "report", label: "The edition report or methodology paper", hint: "Released to institutional counterparts under NDA." },
  { value: "press", label: "Press", hint: "Media and press enquiries." },
];

const TIMESCALES = ["Within two weeks", "Within a month", "This quarter", "Exploratory, no deadline"];

const EMPTY_FORM = { interest: "briefing", name: "", email: "", organisation: "", role: "", country: "", timescale: "", message: "" };

const REQUIRED = { name: "Name", email: "Work email", organisation: "Organisation", message: "The decision you are trying to make" };

const ContactIntro = memo(function ContactIntro() {
  return (
    <>
      <section className="hero">
        <div className="shell">
          <p className="eyebrow eyebrow--plain">Enquiries</p>
          <h1>Request a briefing</h1>
          <p className="lede">Tell us the decision you are trying to make and by when.</p>
        </div>
      </section>
      
      <section className="section on-paper">
        <div className="shell">
          <p className="eyebrow">What you can ask for</p>
          <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)", marginBottom: "2rem" }}>What you can ask for</h2>
          <div className="grid grid--3 grid--services">
            <div className="service" id="briefing">
              <h3>Investor briefing</h3>
              <p>A working session against the current edition, for capital allocators evaluating national
                AI infrastructure exposure.</p>
              <ul className="service__what">
                <li>Cross-country comparison on the dimensions relevant to your mandate</li>
                <li>Where funded demand sits, and where capital has to arrive first</li>
                <li>Written follow-up covering the questions raised</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Half day</span><span className="segment"> · fee quoted on enquiry</span></p>
            </div>
            <div className="service" id="assessment">
              <h3>Country or corporate assessment</h3>
              <p>A full SAPI assessment across five dimensions and thirty indicators, commissioned by the
                government, company, or a body acting for it.</p>
              <ul className="service__what">
                <li>Every indicator traced to its source and confidence grade</li>
                <li>A gap analysis ranking the highest-leverage interventions</li>
                <li>The private score alongside the published one</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Commissioned engagement</span><span className="segment"> · scoped on enquiry</span></p>
            </div>
            <div className="service" id="convening">
              <h3>Convening participation</h3>
              <p>A seat, or a speaking slot for a national delegation, at a SAPI convening.</p>
              <ul className="service__what">
                <li>Reviewed against institutional mandate and timing</li>
                <li>Chatham House Rule throughout</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">By application</span><span className="segment"> · <a href="/convenings">see the record</a></span></p>
            </div>
            <div className="service" id="defence">
              <h3>Defence AI investment read</h3>
              <p><span data-di="">Directed Intelligence</span> applied to defence and national security: which AI investments turn into
                mission value, measured on your own programme data.</p>
              <ul className="service__what">
                <li>Data readiness, model performance, mission value, assurance and the wider portfolio</li>
                <li>Insight from SAPI's work across sectors and nations, never another client's data</li>
                <li>Your organisation is never scored or published on the index</li>
              </ul>
              <p className="service__foot segmented-meta"><span className="segment">Commissioned engagement</span><span className="segment"> · scoped on enquiry</span></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

function EnquiryForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = Object.keys(REQUIRED).filter((field) => !form[field].trim());
    if (missing.length) {
      setStatus({ state: "error", message: `Please complete: ${missing.map((f) => REQUIRED[f]).join(", ")}.` });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ state: "error", message: "Please enter a valid work email." });
      return;
    }

    setStatus({ state: "sending", message: "" });
    // The contact API has no columns for country or timescale, so they lead the message.
    const context = [
      form.country.trim() && `Country or region: ${form.country.trim()}`,
      form.timescale && `Needed by: ${form.timescale}`,
    ].filter(Boolean);

    try {
      const response = await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organisation.trim(),
        role: form.role.trim(),
        area_of_interest: INTERESTS.find((i) => i.value === form.interest).label,
        message: [...context, ...(context.length ? [""] : []), form.message.trim()].join("\n"),
      });
      if (!response.success) throw new Error(response.error || "Submission failed");
      setForm(EMPTY_FORM);
      setStatus({ state: "sent", message: "Thank you. Your enquiry has been sent and we will reply directly." });
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setStatus({ state: "error", message: "Your enquiry could not be sent. Please try again shortly." });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>What are you asking about?</legend>
        {INTERESTS.map(({ value, label, hint }) => (
          <div className="choice" key={value} id={value === "press" ? "press" : undefined}>
            <input type="radio" id={`i-${value}`} name="interest" value={value}
              checked={form.interest === value} onChange={update("interest")} />
            <label htmlFor={`i-${value}`}>{label}{" "}
              <span className="hint">{hint}</span></label>
          </div>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor="f-name">Name <span className="req" aria-hidden="true">*</span></label>
        <input type="text" id="f-name" name="name" autoComplete="name" required aria-required="true"
          value={form.name} onChange={update("name")} />
      </div>
      <div className="field">
        <label htmlFor="f-email">Work email <span className="req" aria-hidden="true">*</span></label>
        <input type="email" id="f-email" name="email" autoComplete="email" required aria-required="true"
          value={form.email} onChange={update("email")} />
      </div>
      <div className="field">
        <label htmlFor="f-org">Organisation <span className="req" aria-hidden="true">*</span></label>
        <input type="text" id="f-org" name="organisation" autoComplete="organization" required aria-required="true"
          value={form.organisation} onChange={update("organisation")} />
      </div>
      <div className="field">
        <label htmlFor="f-role">Role</label>
        <input type="text" id="f-role" name="role" autoComplete="organization-title"
          value={form.role} onChange={update("role")} />
      </div>
      <div className="field">
        <label htmlFor="f-country">Country or region in question</label>
        <input type="text" id="f-country" name="country" value={form.country} onChange={update("country")} />
      </div>
      <div className="field">
        <label htmlFor="f-when">When you need it by</label>
        <select id="f-when" name="timescale" value={form.timescale} onChange={update("timescale")}>
          <option value="">Select</option>
          {TIMESCALES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-msg">The decision you are trying to make <span className="req" aria-hidden="true">*</span></label>
        <textarea id="f-msg" name="message" required aria-required="true" aria-describedby="f-msg-hint"
          value={form.message} onChange={update("message")} />
        <span className="hint" id="f-msg-hint">A few sentences is enough. The more specific the
          decision, the more useful the reply.</span>
      </div>

      <p className="meta"><span className="req" aria-hidden="true">*</span> Required. We use what you send
        only to answer your enquiry.</p>

      {(status.state === "sent" || status.state === "error") && (
        <div className="callout" role={status.state === "error" ? "alert" : "status"}>
          <span className="callout__label">{status.state === "error" ? "Not sent" : "Enquiry sent"}</span>
          <p className="mb-0">{status.message}</p>
        </div>
      )}

      <div>
        <button className="btn btn--primary" type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <ObsidianLayout page="briefing">
      <main id="main">
        <ContactIntro />

        <section className="section">
          <div className="shell">
            <div className="grid grid--2" style={{ gap: "3rem", alignItems: "start" }}>
              <div>
                <p className="eyebrow">Enquiry</p>
                <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Send it here</h2>
                <EnquiryForm />
              </div>

              <aside>
                <div className="callout" style={{ marginTop: "2rem" }} id="report">
                  <span id="methodology" className="visually-hidden">Methodology paper</span>
                  <span className="callout__label">Edition report and methodology paper</span>
                  <p className="mb-0">The index-level report and the full weighting methodology are released to
                    institutional counterparts under NDA. Select that option above and say which edition you
                    need.</p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </ObsidianLayout>
  );
}
