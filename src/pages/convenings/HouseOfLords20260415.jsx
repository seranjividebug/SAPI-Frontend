import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (convenings/2026-04-15-house-of-lords.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const HouseOfLords20260415Body = memo(function HouseOfLords20260415Body() {
  return (
    <main id="main">
    <section className="event-hero">
      <img className="event-photo" src="/assets/img/events/2026-04-15/header.jpg" alt="A Westminster committee room under a coffered ceiling, delegates seated in rows facing a panel at a horseshoe table." width="2000" height="875" fetchpriority="high" decoding="async" />
      <div className="shell event-hero__body">
        <p className="eyebrow eyebrow--plain">Event record</p>
        <h1 style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", maxWidth: "20ch" }}>The Sovereign AI Power Index launch</h1>
        <p className="meta segmented-meta"><span className="segment"><time datetime="2026-04-15">15 April 2026</time></span><span className="segment"> · House of Lords, Westminster</span></p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell shell--narrow">
        <p className="eyebrow">The record</p>
        <ul className="facts">
          <li><span className="k">Date</span><span><time datetime="2026-04-15">15 April 2026</time></span></li>
          <li><span className="k">Venue</span><span>Committee Room, House of Lords, Westminster</span></li>
          <li><span className="k">Purpose</span><span>Launch of The Sovereign AI Power Index</span></li>
          <li><span className="k">In attendance</span><span>Fourteen ambassadors and senior officials, including Madam Deputy Speaker Nusrat Ghani MP</span></li>
          <li><span className="k">Nations represented</span><span>United Arab Emirates, Qatar, Saudi Arabia, Singapore, Türkiye, Switzerland, Japan, Iraq, Ethiopia and South Africa</span></li>
          <li><span className="k">UK institutions</span><span>Lloyds Banking Group and the Arab British Chamber of Commerce</span></li>
          <li><span className="k">Closing remarks</span><span>Tasmina Ahmed-Sheikh OBE, Founder</span></li>
          <li><span className="k">Edition released</span><span className="segmented-meta"><span className="segment">Cycle 1</span><span className="segment"> · 38 countries</span></span></li>
        </ul>
      </div>
    </section>
    
    <section className="section">
      <div className="shell shell--narrow">
        <p className="eyebrow">Summary</p>
        <div className="article-body">
          <p>SAPI launched The Sovereign AI Power Index at the House of Lords: a composite index of sovereign AI
            capability that measures what a country has actually built. It assesses five dimensions: Compute
            Capacity, Capital Formation, Regulatory Readiness, Data Sovereignty and <span data-di="">Directed Intelligence</span>.</p>
    
          <p>Sovereign AI has moved from strategic aspiration to an operational question inside ministries and
            funds. What has been missing is a shared measurement layer: a way for governments to understand their
            own position, and the position of their counterparts. That is what the index is for.</p>
    
          <h2>The room</h2>
          <p>Fourteen ambassadors and senior officials attended, with representation from ten nations alongside UK
            institutions. Madam Deputy Speaker Nusrat Ghani MP addressed the room, and ambassadors put questions to the
            team from the floor.</p>
    
          <blockquote className="pullquote">
            <p>This kind of measurement is what decisions about AI now require.</p>
            <cite>Madam Deputy Speaker Nusrat Ghani MP, at the launch</cite>
          </blockquote>
    
          <p> Tasmina Ahmed-Sheikh OBE, Founder of The Sovereign AI Power Index, closed
            the launch.</p>
    
          <h2>What the first edition covered</h2>
          <p>The edition released at the launch scored thirty-eight countries, built entirely on public evidence:
            every indicator traced to a dated public document or a verified in-country response. A country is
            scored whether or not it takes part, which is what makes the index a common reference rather than a
            submission exercise.</p>
    
          <h2>Measurement before mandate</h2>
          <p>The launch came a day before the UK government announced its Sovereign AI Unit, with £500 million
            behind it. The order matters: the money for sovereign AI is being committed faster than the means of
            judging what it returns. The index exists to close that gap, and <span data-di="">Directed Intelligence</span>, the dimension
            that measures what a country turns its AI capacity into, is where that judgement is made.</p>
    
          <p><a className="link-more" href="/sapi-index">See the current edition</a></p>
        </div>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell">
        <p className="eyebrow">Photographs</p>
        <div className="grid grid--3">
          <figure><img className="event-photo" src="/assets/img/events/2026-04-15/room.jpg" alt="Delegates seated around a horseshoe committee table, with Sovereign AI Power Index banners behind the head of the table." width="800" height="450" loading="lazy" decoding="async" /></figure>
          <figure><img className="event-photo" src="/assets/img/events/2026-04-15/speaker.jpg" alt="A speaker stands at the committee table addressing the room, panellists seated alongside and Sovereign AI Power Index banners behind." width="800" height="450" loading="lazy" decoding="async" /></figure>
          <figure><img className="event-photo" src="/assets/img/events/2026-04-15/delegates.jpg" alt="Attendees seated in rows listening to the launch, with a chart from the index on a screen at the side of the room." width="800" height="450" loading="lazy" decoding="async" /></figure>
        </div>
      </div>
    </section>
    
    <section className="section on-ink">
      <div className="shell shell--narrow center">
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Attend the next convening</h2>
        <p className="lede" style={{ marginInline: "auto" }}>Seats are reviewed against institutional mandate and
          timing. National delegations may request a speaking slot.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <a className="btn btn--primary" href="/contact">Apply to attend</a>
          <a className="btn btn--ghost" href="/convenings">All convenings</a>
        </div>
      </div>
    </section>
    
    </main>  );
});

export default function HouseOfLords20260415() {
  return (
    <ObsidianLayout page="event" progress>
      <HouseOfLords20260415Body />
    </ObsidianLayout>
  );
}
