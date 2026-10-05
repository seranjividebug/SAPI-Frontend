import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (convenings/index.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const ConveningsPageBody = memo(function ConveningsPageBody() {
  return (
    <main id="main">
    <section className="hero">
      <div className="shell">
        <p className="eyebrow eyebrow--plain">Convenings</p>
        <h1>Where the assessment gets tested</h1>
        <p className="lede">SAPI convenes national delegations, infrastructure operators and sovereign capital
          around a shared assessment. Each convening has a dated record here.</p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell">
        <p className="eyebrow">Most recent</p>
        <div className="grid grid--2" style={{ alignItems: "center" }}>
          <figure>
            <img className="event-photo" src="/assets/img/events/2026-07-02/group.jpg" alt="Five attendees stand in front of Sovereign AI Power Index banners, behind committee chairs bearing the Parliamentary portcullis." width="1200" height="675" loading="lazy" decoding="async" />
          </figure>
          <div>
            <p className="meta segmented-meta"><span className="segment">2 July 2026</span><span className="segment"> · House of Lords, Westminster</span></p>
            <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.3rem)", marginTop: ".75rem" }}>Quarter 2 Rankings 2026 launch</h2>
            <p>SAPI released the Quarter 2 Rankings 2026 at the House of Lords. Fifty nations were scored, and fifteen nations took part.</p>
            <p><a className="link-more" href="/convenings/2026-07-02-house-of-lords">Read the event record</a></p>
          </div>
        </div>
      </div>
    </section>
    
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Record</p>
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>All convenings</h2>
        <div className="table-wrap" style={{ marginTop: "1.5rem" }}>
          <table className="data">
            <caption><span className="segmented-meta"><span className="segment">SAPI convenings</span><span className="segment"> · newest first</span></span></caption>
            <thead><tr><th scope="col">Date</th><th scope="col">Convening</th><th scope="col">Venue</th><th scope="col">Record</th></tr></thead>
            <tbody>
              <tr>
                <th scope="row"><time datetime="2026-07-02">2 July 2026</time></th>
                <td>Quarter 2 Rankings 2026 launch</td>
                <td>House of Lords, Westminster</td>
                <td><a href="/convenings/2026-07-02-house-of-lords">Event record</a></td>
              </tr>
              <tr>
                <th scope="row"><time datetime="2026-04-15">15 April 2026</time></th>
                <td>The Sovereign AI Power Index launch</td>
                <td>House of Lords, Westminster</td>
                <td><a href="/convenings/2026-04-15-house-of-lords">Event record</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    
    <section className="section on-ink">
      <div className="shell">
        <p className="eyebrow">Elsewhere on the record</p>
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Referenced in Parliament</h2>
        <ul className="facts" style={{ marginTop: "1.5rem" }}>
          <li>
            <span className="k">Date</span>
            <span><time datetime="2026-07-23">23 July 2026</time></span>
          </li>
          <li>
            <span className="k">Where</span>
            <span>House of Lords debate, Digital and Technology Policy: National Sovereignty</span>
          </li>
          <li>
            <span className="k">What happened</span>
            <span>The Sovereign AI Power Index was referred to during the debate.</span>
          </li>
          <li>
            <span className="k">Source</span>
            <span><a href="https://hansard.parliament.uk/lords/2026-07-23/debates/0AD8A0A1-BA91-4F7A-BF32-58A2C4022746/DigitalAndTechnologyPolicyNationalSovereignty" rel="noopener">Hansard, 23 July 2026</a></span>
          </li>
        </ul>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell shell--narrow center">
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Participating in a convening</h2>
        <p className="lede" style={{ marginInline: "auto" }}>Seats are reviewed against institutional mandate and
          timing. National delegations may request a speaking slot. Sessions run under the Chatham House Rule.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <a className="btn btn--primary" href="/contact">Apply to attend</a>
        </div>
      </div>
    </section>
    
    </main>  );
});

export default function ConveningsPage() {
  return (
    <ObsidianLayout page="convenings" progress>
      <ConveningsPageBody />
    </ObsidianLayout>
  );
}
