import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// About page, ported from the "SAPI Obsidian" reference build (about.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const AboutBody = memo(function AboutBody() {
  return (
    <main id="main">
    <section className="hero">
      <div className="shell">
        <p className="eyebrow eyebrow--plain">About</p>
        <h1>An independent UK company assessing sovereign AI capability</h1>
        <p className="lede">SAPI makes sovereign AI capability measurable. It publishes a quarterly index,
          produces commissioned assessments for governments and investors, and convenes the parties who
          need to work from the same numbers.</p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell">
        <p className="eyebrow">What SAPI does</p>
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)", marginBottom: "2rem" }}>Three functions, one standard</h2>
        <div className="grid grid--3">
          <div className="service">
            <h3>The Index</h3>
            <p>A quarterly assessment of national AI capability across five dimensions and thirty
              indicators. Fifty countries in the current edition, published 2 July 2026.</p>
            <ul className="service__what">
              <li>Public: composite, tier, strongest and weakest dimension for every country</li>
              <li>Released to clients: dimension scores, indicator detail, sources and confidence grades</li>
            </ul>
            <p className="service__foot"><a href="/sapi-index">Current edition</a></p>
          </div>
          <div className="service">
            <h3>Assessments</h3>
            <p>Commissioned country and corporate assessments that identify capability gaps and produce the
              evidence capital and delivery partners need before committing.</p>
            <ul className="service__what">
              <li>Every indicator traced to a source and a confidence grade</li>
              <li>A gap ranking with intervention pathways</li>
              <li>Defence AI investment reads: <span data-di="">Directed Intelligence</span> applied to defence and national security programmes</li>
            </ul>
            <p className="service__foot"><a href="/contact">Commission an assessment</a></p>
          </div>
          <div className="service">
            <h3>Convenings</h3>
            <p>Sessions bringing national delegations, infrastructure operators and sovereign capital
              around a shared assessment, under the Chatham House Rule.</p>
            <ul className="service__what">
              <li>Dated public record for every convening</li>
              <li>Participation reviewed against mandate and timing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <section className="section" id="people">
      <div className="shell">
        <p className="eyebrow">People</p>
        <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.4rem)" }}>Who is accountable for the work</h2>
    
        <div className="grid grid--2 grid--people" style={{ gap: "2.5rem 3rem", marginTop: "2rem" }}>
    
          <div className="person">
            <img className="person__photo" src="/assets/img/people/tasmina-ahmed-sheikh.jpg" alt="Portrait of Tasmina Ahmed-Sheikh OBE" width="96" height="96" loading="lazy" decoding="async" />
            <div>
              <h3>Tasmina Ahmed-Sheikh OBE</h3>
              <p className="person__role">Founder</p>
              <p>Lawyer and former Member of Parliament for Ochil and South Perthshire, the first woman of
                colour in Scottish history elected to the House of Commons. At Westminster she was her
                party's spokesperson for Trade and Investment and Deputy Shadow Leader of the House of
                Commons, and she is a former member of the Council of Europe. She heads The Scotland Forum
                and the Interparliamentary Alliance for Women's Leadership, sits on an external advisory
                board at the University of California, Berkeley, and was appointed OBE in 2014 for services
                to business and the Asian community.</p>
            </div>
          </div>
    
          <div className="person">
            <img className="person__photo" src="/assets/img/people/asim-razvi.jpg" alt="Portrait of Asim Razvi" width="96" height="96" loading="lazy" decoding="async" />
            <div>
              <h3>Asim Razvi</h3>
              <p className="person__role">Chief Data and AI Officer</p>
              <p>Founder and principal of CoreIntel, and author of <em>The AI Power Curve</em>. He has led data
                and AI functions as head of business intelligence and AI at American Logistics and head of
                data at National Life Group, and was vice president of data strategy and analytics at ONIS
                Solutions, working with AT&amp;T, Frontier Communications and Spectrum. Earlier, as head of
                data at Cognizant, he served clients including Disney, Verizon and Comcast. He owns SAPI's
                scoring engine and data operations.</p>
            </div>
          </div>
    
          <div className="person">
            <img className="person__photo" src="/assets/img/people/steve-maclaren.jpg" alt="Portrait of Steve Maclaren" width="96" height="96" loading="lazy" decoding="async" />
            <div>
              <h3>Steve Maclaren</h3>
              <p className="person__role">Director of Global Research and Academic Partnerships</p>
              <p>Chief Operating Officer of The National Robotarium in Edinburgh, and a board advisor and
                speaker on innovation and technology adoption. He previously led enterprise technology
                strategy and digital transformation programmes in the aerospace sector, from horizon scanning
                and proof-of-concept sponsorship to the digitisation of customer support services. At SAPI
                he leads research and academic partnerships.</p>
            </div>
          </div>
    
        </div>
      </div>
    </section>
    
    <section className="section on-ink">
      <div className="shell shell--narrow">
        <p className="eyebrow">Independence</p>
        <div className="article-body">
          <h2 style={{ border: "0", padding: "0", marginTop: "0", color: "var(--on-ink)" }}>How the work is funded, and what that means for a score</h2>
          <p style={{ color: "var(--on-ink-muted)" }}>SAPI is an independent UK company. It earns revenue from
            commissioned assessments, briefings and convening participation. Commissioning an assessment does not affect scoring.</p>
        </div>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell shell--narrow center">
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Talk to us</h2>
        <p className="lede" style={{ marginInline: "auto" }}>Tell us the decision you are trying to make.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <a className="btn btn--primary" href="/contact">Request a briefing</a>
        </div>
      </div>
    </section>
    
    </main>  );
});

export default function AboutPage() {
  return (
    <ObsidianLayout page="about">
      <AboutBody />
    </ObsidianLayout>
  );
}
