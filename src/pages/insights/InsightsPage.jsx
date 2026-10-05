import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (insights/index.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const InsightsPageBody = memo(function InsightsPageBody() {
  return (
    <main id="main">
    <section className="hero">
      <div className="shell">
        <p className="eyebrow eyebrow--plain">Insights</p>
        <h1>Research notes</h1>
        <p className="lede">Findings from the index, written to be circulated internally. Every note carries a
          publication date, the edition it belongs to and the dimensions it draws on.</p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell">
        <p className="eyebrow segmented-meta"><span className="segment">Published</span><span className="segment"> · Quarter 2 Rankings 2026</span></p>
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)", marginBottom: "2rem" }}>From the current edition</h2>
        <div className="grid grid--3">
          <article className="card">
            <p className="card__kicker"><span className="card__tag">Thematic analysis</span><span>2 July 2026</span></p>
            <p className="claim">Compute is the least predictive pillar of sovereign AI power. <span data-di="">Directed Intelligence</span> is among the most.</p>
            <h3><a href="/insights/conversion-not-compute"><span data-di="">Directed Intelligence</span>, not compute, decides sovereign AI power</a></h3>
            <p>Compute correlates with the composite at 0.78; capital at 0.89 and <span data-di="">Directed Intelligence</span> at <span data-di="n">0.88</span>.
              Estonia outranks every G7 member except the United States on a below-average compute score.</p>
            <p className="card__foot"><a className="link-more" href="/insights/conversion-not-compute">Read the note</a></p>
          </article>
    
          <article className="card">
            <p className="card__kicker"><span className="card__tag">Strategic risk briefing</span><span>2 July 2026</span></p>
            <p className="claim">Capital Formation is the world's weakest pillar and its strongest predictor of rank.</p>
            <h3><a href="/insights/capital-formation-bottleneck">The financing gap</a></h3>
            <p>Field mean 28.5 against 53.8 for Data Sovereignty. Governments have written the policy of
              sovereign AI well ahead of financing the machine.</p>
            <p className="card__foot"><a className="link-more" href="/insights/capital-formation-bottleneck">Read the note</a></p>
          </article>
    
          <article className="card">
            <p className="card__kicker"><span className="card__tag">Guide for decision-makers</span><span>2 July 2026</span></p>
            <p className="claim">Four repeatable mistakes account for most misreadings of a readiness score.</p>
            <h3><a href="/insights/reading-national-ai-readiness">How to read a national AI readiness score</a></h3>
            <p>What a rank movement between editions does and does not tell you, why the weakest dimension
              is usually the more useful number, and when a gap is too small to rely on.</p>
            <p className="card__foot"><a className="link-more" href="/insights/reading-national-ai-readiness">Read the note</a></p>
          </article>
        </div>
      </div>
    </section>
    
    <section className="section">
      <div className="shell">
        <p className="eyebrow">In preparation</p>
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Next in the programme</h2>
        <p className="lede" style={{ marginBottom: "2rem" }}>Each of these exists as a published position on
          LinkedIn and needs the edition, sources and definitions attached before it appears here
          as a note. They are listed so the programme is visible, not to imply they are available.</p>
    
        <div className="table-wrap">
          <table className="data">
            <caption><span className="segmented-meta"><span className="segment">Editorial pipeline</span><span className="segment"> · status as at handoff</span></span></caption>
            <thead><tr><th scope="col">Working title</th><th scope="col">Type</th><th scope="col">Dimensions</th><th scope="col">Status</th></tr></thead>
            <tbody>
              <tr><th scope="row">Oman: execution capacity without scale</th><td>Country research note</td><td><span className="segmented-meta"><span className="segment" data-di="">Directed Intelligence</span><span className="segment"> · Data Sovereignty</span></span></td><td>Drafted, sources pending</td></tr>
              <tr><th scope="row">France: energy availability as an AI constraint</th><td>Infrastructure analysis</td><td>Compute Capacity</td><td>Drafted, sources pending</td></tr>
              <tr><th scope="row">Qatar: the energy and compute mix</th><td>Country research note</td><td><span className="segmented-meta"><span className="segment">Compute Capacity</span><span className="segment"> · Capital Formation</span></span></td><td>Drafted, sources pending</td></tr>
              <tr><th scope="row">Semiconductor dependence</th><td>National security briefing</td><td>Compute Capacity</td><td>Outline</td></tr>
              <tr><th scope="row">Talent: participation and deployment</th><td>Thematic analysis</td><td data-di="">Directed Intelligence</td><td>Outline</td></tr>
            </tbody>
          </table>
        </div>
    
        <div className="editorial-note" role="note">
          <strong>For the tech team</strong>  -  this table is hand-maintained in{" "}
          <code>insights/index.html</code> for now. When the research-note template moves into the CMS,
          generate both this table and the published grid above from the same collection, filtered on{" "}
          <code>status</code>. See <code>templates/research-note.html</code>.
        </div>
      </div>
    </section>
    
    <section className="section on-ink">
      <div className="shell shell--narrow center">
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>Ask about a finding</h2>
        <p className="lede" style={{ marginInline: "auto" }}>If a note raises a question about your country, your
          portfolio or a paper you are writing, put it to the person who did the work.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <a className="btn btn--primary" href="/contact">Request a briefing</a>
        </div>
      </div>
    </section>
    
    </main>  );
});

export default function InsightsPage() {
  return (
    <ObsidianLayout page="insights" progress>
      <InsightsPageBody />
    </ObsidianLayout>
  );
}
