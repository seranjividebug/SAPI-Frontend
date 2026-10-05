import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (convenings/2026-07-02-house-of-lords.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const HouseOfLords20260702Body = memo(function HouseOfLords20260702Body() {
  return (
    <main id="main">
    <section className="event-hero">
      <img className="event-photo" src="/assets/img/events/2026-07-02/header.jpg" alt="Wide view of the House of Lords committee room during the release of the Quarter 2 Rankings 2026." width="2000" height="875" fetchpriority="high" decoding="async" />
      <div className="shell event-hero__body">
        <p className="eyebrow eyebrow--plain">Event record</p>
        <h1 style={{ fontSize: "clamp(2rem,4.4vw,3.2rem)", maxWidth: "20ch" }}>Quarter 2 Rankings 2026 launch</h1>
        <p className="meta segmented-meta"><span className="segment"><time datetime="2026-07-02">2 July 2026</time></span><span className="segment"> · House of Lords, Westminster</span></p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell shell--narrow">
        <p className="eyebrow">The record</p>
        <ul className="facts">
          <li><span className="k">Date</span><span><time datetime="2026-07-02">2 July 2026</time></span></li>
          <li><span className="k">Venue</span><span>Committee room, House of Lords, Westminster</span></li>
          <li><span className="k">Host</span><span>The Sovereign AI Power Index</span></li>
          <li><span className="k">Purpose</span><span>Release of the Quarter 2 Rankings 2026</span></li>
          <li><span className="k">Nations scored</span><span>50</span></li>
          <li><span className="k">Nations participating</span><span>15</span></li>
          <li><span className="k">Edition released</span><span><a href="/sapi-index">Quarter 2 Rankings 2026</a></span></li>
        </ul>
      </div>
    </section>
    
    <section className="section">
      <div className="shell shell--narrow">
        <p className="eyebrow">Summary</p>
        <div className="article-body">
          <p>SAPI released the second edition of the index, the Quarter 2 Rankings 2026, with fifteen nations
            participating. Fifty nations were scored across five dimensions.</p>
    
          <p>The headline finding: across the fifty countries scored, not one reaches the Advanced tier. The
            field occupies only the lower two of the framework's four bands, twenty-three countries Developing
            and twenty-seven Nascent, and the highest composite, 59.2, falls short of the sixty-point line.</p>
    
          <h2>Compute does not settle the order</h2>
          <p>The United States holds the highest single dimension score in the index, 91.0 on Compute
            Capacity, and ranks fourth overall. Because the composite is a weighted geometric mean, a weak
            pillar cannot be bought off with a strong one.</p>
    
          <h2>The constraint is capital, not law</h2>
          <p>The world's collective strength is Data Sovereignty, at a field mean of 53.8, and its collective
            bottleneck is Capital Formation, at 28.5. Governments have built rules and rights faster than they
            have built resources.</p>
    
          <h2>Small states lead on <span data-di="">Directed Intelligence</span></h2>
          <p>Estonia leads two of the five dimensions, <span data-di="">Directed Intelligence</span> at <span data-di="n">83.3</span> and Data Sovereignty
            at 80.0, and outranks every G7 member except the United States. Oman shows the same shape.</p>
    
          <p><a className="link-more" href="/sapi-index">Read the edition released at this event</a></p>
        </div>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell">
        <p className="eyebrow">Photographs</p>
        <div className="grid grid--3">
          <figure><img className="event-photo" src="/assets/img/events/2026-07-02/presentation.jpg" alt="The head table and Sovereign AI Power Index banners seen from a delegate's seat, with the Quarter 2 Rankings 2026 slide on the screens." width="800" height="450" loading="lazy" decoding="async" /></figure>
          <figure><img className="event-photo" src="/assets/img/events/2026-07-02/discussion.jpg" alt="A presenter addresses the room beside a colleague, in front of Sovereign AI Power Index banners." width="800" height="450" loading="lazy" decoding="async" /></figure>
          <figure><img className="event-photo" src="/assets/img/events/2026-07-02/delegates.jpg" alt="Five attendees in front of Sovereign AI Power Index banners, with Parliamentary portcullis chairs in the foreground." width="800" height="450" loading="lazy" decoding="async" /></figure>
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

export default function HouseOfLords20260702() {
  return (
    <ObsidianLayout page="event" progress>
      <HouseOfLords20260702Body />
    </ObsidianLayout>
  );
}
