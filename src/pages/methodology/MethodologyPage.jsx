import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Methodology page, ported from the "SAPI Obsidian" reference build (methodology.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const MethodologyBody = memo(function MethodologyBody() {
  return (
    <main id="main">
    <section className="hero">
      <div className="shell">
        <p className="eyebrow eyebrow--plain segmented-meta"><span className="segment">Methodology</span><span className="segment"> · SAPI v1.0 (Cycle 2 locked template)</span></p>
        <h1>How a SAPI score is produced</h1>
        <p className="lede">Five dimensions, thirty indicators, one composite. This page covers the scoring
          architecture, how evidence is graded and how practitioner judgement is reviewed. Proprietary mechanics are noted where they apply.</p>
      </div>
    </section>
    
    <section className="section on-paper">
      <div className="shell shell--narrow">
        <p className="eyebrow">What the framework tests</p>
        <div className="article-body">
          <p>SAPI answers one question: who can turn AI ambition into durable strategic capacity. The
            framework deliberately looks past technical capability to whether capital, infrastructure,
            policy and execution work together as a system, because a nation that cannot finance,
            govern, protect and deploy intelligence infrastructure does not hold sovereign AI capability
            regardless of what it owns. The same test is a national security test: capability that depends on another nation's compute, capital or models is exposure as well as capacity.</p>
          <p>Each of the five dimensions isolates a separate source of sovereign strength. Each is scored
            0–100 from thirty underlying indicators, and the five are combined into a single composite.</p>
        </div>
      </div>
    </section>
    
    <section className="section">
      <div className="shell">
        <p className="eyebrow">The five dimensions</p>
        <div className="dims-with-figure">
        <div className="dims">
          <div className="dim">
            <span className="dim__no">01</span><span className="dim__name">Compute Capacity</span><span className="dim__weight">15–20%</span>
            <p className="dim__body">Access to hyperscale compute, power resilience, grid capacity, and the
              physical infrastructure required to host strategic AI workloads.</p>
          </div>
          <div className="dim">
            <span className="dim__no">02</span><span className="dim__name">Capital Formation</span><span className="dim__weight">20–25%</span>
            <p className="dim__body">The depth and strategic orientation of capital: sovereign wealth
              deployment, venture ecosystems, and the mechanisms directing capital toward sovereign
              priorities. Measures direction, not quantity held.</p>
          </div>
          <div className="dim">
            <span className="dim__no">03</span><span className="dim__name">Regulatory Readiness</span><span className="dim__weight">15–20%</span>
            <p className="dim__body">Legal clarity, procurement maturity, licensing pathways, and the coherence
              of national AI policy in supporting deployment.</p>
          </div>
          <div className="dim">
            <span className="dim__no">04</span><span className="dim__name">Data Sovereignty</span><span className="dim__weight">10–15%</span>
            <p className="dim__body">National control over data localisation, trusted cloud environments,
              security frameworks and jurisdictional certainty.</p>
          </div>
          <div className="dim">
            <span className="dim__no" data-di="">05</span><span className="dim__name" data-di="">Directed Intelligence</span><span className="dim__weight">25–30%</span>
            <p className="dim__body"><span data-di="">Directed Intelligence</span> is <span data-di="">proprietary to SAPI</span>. Operational maturity in
              transforming AI capability into state and corporate execution, scored on a <span data-di="">five-stage scale:
              Experimental, Emergent, Structured, Directed, Intelligence Fabric</span>.</p>
          </div>
        </div>
    
          {/* The field-mean pentagon: field.dimensionMeans from data/cycle2.json (29.4 / 28.5 / 48.6 /
               53.8 / 43.4). Static: a plate beside the definitions, not an animation. */}
          <figure className="method-figure" id="mean-figure">
    <svg className="pg pg--mean" viewBox="-80 0 580 420" role="img" aria-label="The field mean on each of the five dimensions, fifty countries: Compute Capacity 29.4, Capital Formation 28.5, Regulatory Readiness 48.6, Data Sovereignty 53.8, Directed Intelligence 43.4. Capital Formation is the thinnest arm and Data Sovereignty the widest.">
    <polygon className="pg-axis" points="210.0,187.4 237.2,207.2 226.8,239.1 193.2,239.1 182.8,207.2" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,158.9 264.3,198.3 243.6,262.2 176.4,262.2 155.7,198.3" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,130.3 291.5,189.5 260.4,285.3 159.6,285.3 128.5,189.5" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,101.8 318.6,180.7 277.1,308.4 142.9,308.4 101.4,180.7" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,73.2 345.8,171.9 293.9,331.5 126.1,331.5 74.2,171.9" fill="none" opacity="0.8" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="210.0" y2="73.2" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="345.8" y2="171.9" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="293.9" y2="331.5" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="126.1" y2="331.5" />
    <line className="pg-axis" data-di="" x1="210.0" y1="216.0" x2="74.2" y2="171.9" />
    <polygon className="pg-shape pg-draw" points="210.0,174.0 248.7,203.4 250.8,272.1 164.8,278.2 151.1,196.8" />
    <circle className="pg-dot" cx="210.0" cy="174.0" r="3.5" />
    <text className="pg-val" x="210.0" y="45.5" textAnchor="middle">CC 29.4</text>
    <text className="pg-note" x="210.0" y="58.5" textAnchor="middle">Compute Capacity</text>
    <circle className="pg-dot" cx="248.7" cy="203.4" r="3.5" />
    <text className="pg-val" x="370.3" y="163.9" textAnchor="start">CF 28.5</text>
    <text className="pg-note" x="370.3" y="176.9" textAnchor="start">Capital Formation</text>
    <circle className="pg-dot" cx="250.8" cy="272.1" r="3.5" />
    <text className="pg-val" x="309.0" y="356.3" textAnchor="start">RR 48.6</text>
    <text className="pg-note" x="309.0" y="369.3" textAnchor="start">Regulatory Readiness</text>
    <circle className="pg-dot" cx="164.8" cy="278.2" r="3.5" />
    <text className="pg-val" x="111.0" y="356.3" textAnchor="end">DS 53.8</text>
    <text className="pg-note" x="111.0" y="369.3" textAnchor="end">Data Sovereignty</text>
    <circle className="pg-dot" data-di="" cx="151.1" cy="196.8" r="3.5" />
    <text className="pg-val" data-di="n" x="49.7" y="163.9" textAnchor="end">DI 43.4</text>
    <text className="pg-note" data-di="" x="49.7" y="176.9" textAnchor="end">Directed Intelligence</text>
    <text className="pg-note" x="210.0" y="398" textAnchor="middle">field mean per dimension, n = 50 · rings at 20, 40, 60, 80, 100</text>
    <text className="pg-note pg-note--gold" x="210.0" y="412" textAnchor="middle">thinnest arm: Capital Formation 28.5 · widest: Data Sovereignty 53.8</text>
    </svg>
            <figcaption>Figure · The field mean on each dimension, fifty countries, Quarter 2 Rankings 2026: Compute Capacity 29.4, Capital Formation 28.5, Regulatory Readiness 48.6, Data Sovereignty 53.8, <span data-di="">Directed Intelligence</span> <span data-di="n">43.4</span>. The world's bottleneck is capital; its collective strength is data.</figcaption>
          </figure>
        </div>
      </div>
    </section>
    
    <section className="section on-ink" id="worked">
      <div className="shell">
        <p className="eyebrow">Worked example</p>
        <h2 style={{ fontSize: "clamp(1.8rem,3.2vw,2.4rem)" }}>Why the United States ranks fourth</h2>
        <p className="lede" style={{ marginBottom: "2rem" }}>The clearest demonstration of what the composite does.
          Every figure below is public and comes from the current edition.</p>
    
        <div className="table-wrap">
          <table className="data">
            <caption><span className="segmented-meta"><span className="segment">United States</span><span className="segment"> · Quarter 2 Rankings 2026</span><span className="segment"> · published 2 July 2026</span></span></caption>
            <thead><tr><th scope="col">Dimension</th><th scope="col" className="num">Score</th><th scope="col" className="num">Weight applied</th><th scope="col">Position in field</th></tr></thead>
            <tbody>
              <tr><th scope="row">Compute Capacity</th><td className="num">91.0</td><td className="num">17.5%</td><td>1st of 50  -  highest dimension score in the index</td></tr>
              <tr><th scope="row">Capital Formation</th><td className="num">35.7</td><td className="num">22.5%</td><td>Below the field mid-point</td></tr>
              <tr><th scope="row">Regulatory Readiness</th><td className="num">66.9</td><td className="num">17.5%</td><td>Upper quartile</td></tr>
              <tr><th scope="row">Data Sovereignty</th><td className="num">69.2</td><td className="num">12.5%</td><td>Upper quartile</td></tr>
              <tr><th scope="row" data-di="">Directed Intelligence</th><td className="num" data-di="n">52.8</td><td className="num">27.5%</td><td>Behind Estonia, Oman and Singapore</td></tr>
            </tbody>
          </table>
        </div>
    
        {/* Companion figure to the worked example: the same United States pentagon and two rings
             the homepage uses. Vertices = ranking[country="United States"].dimensions (91.0 / 35.7 /
             66.9 / 69.2 / 52.8). Dashed ring = the simple (weighted arithmetic) average, 60.3, as stated
             in the paragraph beside it; solid ring = the published composite 57.5. The dashed ring
             contracts to the solid one once on entry (0.9s) and is static thereafter. Nothing here is
             recomputed; both rings are the published constants. */}
        <figure className="method-figure" id="worked-figure">
    <svg className="pg pg--us" viewBox="-80 0 580 420" role="img" aria-label="The United States on five dimensions: Compute Capacity 91.0, Capital Formation 35.7, Regulatory Readiness 66.9, Data Sovereignty 69.2, Directed Intelligence 52.8. A dashed ring marks the simple average of those scores, 60.3; a solid ring marks SAPI's score, 57.5. The gap between them is the weak-link cost of one weak pillar.">
    <polygon className="pg-axis" points="210.0,187.4 237.2,207.2 226.8,239.1 193.2,239.1 182.8,207.2" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,158.9 264.3,198.3 243.6,262.2 176.4,262.2 155.7,198.3" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,130.3 291.5,189.5 260.4,285.3 159.6,285.3 128.5,189.5" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,101.8 318.6,180.7 277.1,308.4 142.9,308.4 101.4,180.7" fill="none" opacity="0.35" />
    <polygon className="pg-axis" points="210.0,73.2 345.8,171.9 293.9,331.5 126.1,331.5 74.2,171.9" fill="none" opacity="0.8" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="210.0" y2="73.2" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="345.8" y2="171.9" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="293.9" y2="331.5" />
    <line className="pg-axis" x1="210.0" y1="216.0" x2="126.1" y2="331.5" />
    <line className="pg-axis" data-di="" x1="210.0" y1="216.0" x2="74.2" y2="171.9" />
    <circle className="pg-ring pg-ring--dash" cx="210.0" cy="216.0" r="85.7" />
    <circle className="pg-ring pg-ring--solid" cx="210.0" cy="216.0" r="82.1" />
    <polygon className="pg-shape pg-draw" points="210.0,86.1 258.5,200.2 266.2,293.3 151.9,295.9 138.3,192.7" />
    <circle className="pg-dot" cx="210.0" cy="86.1" r="3.5" />
    <text className="pg-val" x="210.0" y="45.5" textAnchor="middle">CC 91.0</text>
    <text className="pg-note" x="210.0" y="58.5" textAnchor="middle">Compute Capacity</text>
    <circle className="pg-dot" cx="258.5" cy="200.2" r="3.5" />
    <text className="pg-val" x="370.3" y="163.9" textAnchor="start">CF 35.7</text>
    <text className="pg-note" x="370.3" y="176.9" textAnchor="start">Capital Formation</text>
    <circle className="pg-dot" cx="266.2" cy="293.3" r="3.5" />
    <text className="pg-val" x="309.0" y="356.3" textAnchor="start">RR 66.9</text>
    <text className="pg-note" x="309.0" y="369.3" textAnchor="start">Regulatory Readiness</text>
    <circle className="pg-dot" cx="151.9" cy="295.9" r="3.5" />
    <text className="pg-val" x="111.0" y="356.3" textAnchor="end">DS 69.2</text>
    <text className="pg-note" x="111.0" y="369.3" textAnchor="end">Data Sovereignty</text>
    <circle className="pg-dot" data-di="" cx="138.3" cy="192.7" r="3.5" />
    <text className="pg-val" data-di="n" x="49.7" y="163.9" textAnchor="end">DI 52.8</text>
    <text className="pg-note" data-di="" x="49.7" y="176.9" textAnchor="end">Directed Intelligence</text>
    <text className="pg-note" x="210.0" y="398" textAnchor="middle">dashed: simple average, 60.3 · would reach Advanced</text>
    <text className="pg-note pg-note--gold" x="210.0" y="412" textAnchor="middle">solid: SAPI's score, 57.5 · Developing, fourth</text>
    </svg>
          <figcaption>Figure · The United States on five arms: 91.0 / 35.7 / 66.9 / 69.2 / <span data-di="n">52.8</span>. The dashed ring is the simple (weighted arithmetic) average, 60.3; the solid ring is SAPI's score, the weighted geometric mean, 57.5. The gap between them is the imbalance penalty: the weak-link cost of one weak pillar.</figcaption>
        </figure>
    
        <div className="grid grid--2" style={{ marginTop: "2rem", alignItems: "start" }}>
          <div>
            <h3 style={{ fontSize: "1.25rem" }}>The arithmetic</h3>
            <p style={{ color: "var(--on-ink-muted)" }}>A weighted <em>arithmetic</em> mean of those five scores
              returns 60.3, a simple average that would place the United States in the Advanced tier, second only to Estonia. SAPI uses a weighted <em>geometric</em> mean, which returns <strong>57.5</strong>,
              fourth place, Developing tier.</p>
            <p style={{ color: "var(--on-ink-muted)" }}>The difference between the two, almost 3 points, is the imbalance penalty: the weak-link cost of one weak pillar. It comes from a 55-point spread between the United States' strongest and weakest dimensions, the widest in the index. The field average penalty is 1.89 points.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.25rem" }}>Why it is built that way</h3>
            <p style={{ color: "var(--on-ink-muted)" }}>Sovereign AI capability is a chain. A state that cannot
              finance or direct its compute does not hold the capability that compute implies  -  it holds
              stranded capacity. An arithmetic mean lets one very high pillar conceal a hollow one; a
              geometric mean does not.</p>
            <p style={{ color: "var(--on-ink-muted)" }}>The practical consequence for any country reading its own
              score: the weakest dimension has more leverage on the composite than the strongest.</p>
          </div>
        </div>
        <p style={{ marginTop: "1.5rem" }}><span className="meta">The exact weight set applied to each country, and
          the indicator-level detail behind each dimension score, are released under NDA to institutional
          counterparts.</span></p>
      </div>
    </section>
    
    <section className="section on-paper" id="editions">
      <div className="shell shell--narrow">
        <p className="eyebrow">Editions</p>
        <div className="article-body">
          <h2 style={{ border: "0", padding: "0", marginTop: "0" }}>Every finding belongs to an edition</h2>
          <p>A SAPI score belongs to the edition that published it. Each edition carries its publication date.</p>
          <div className="table-wrap" style={{ margin: "1.5rem 0" }}>
            <table className="data" style={{ minWidth: "0" }}>
              <caption>Editions to date</caption>
              <thead><tr><th scope="col">Edition</th><th scope="col">Published</th><th scope="col" className="num">Countries</th></tr></thead>
              <tbody>
                <tr><th scope="row">Quarter 2 Rankings 2026 (Cycle 2)</th><td>2 July 2026</td><td className="num">50</td></tr>
                <tr><th scope="row">Cycle 1</th><td>15 April 2026</td><td className="num">38</td></tr>
              </tbody>
            </table>
          </div>
          <p>When citing SAPI, name the edition and its publication date.</p>
    
          <h2 id="missing">How missing and conflicting evidence is handled</h2>
          <p>Each of the thirty indicators is scored from a raw value carrying a dated source and a
            confidence grade. Three cases arise.</p>
          <ul>
            <li><strong>Sourced.</strong> The value traces to a dated public document  -  a government AI
              strategy, budget filing, grid capacity report, regulatory instrument  -  or to a verified
              in-country response. Scored at full confidence.</li>
            <li><strong>Conflicting.</strong> Where two credible sources disagree, the more recent and more
              proximate to the issuing authority takes precedence, the conflict is recorded against the
              indicator, and the score is set at the more conservative of the two values.</li>
            <li><strong>Unsourced.</strong> Where no dated source or verified response exists, the
              indicator is scored on practitioner judgement and flagged. A country with three or more such
              indicators carries a <strong>red data-quality grade</strong>, published alongside its score.</li>
          </ul>
          <p>In the current edition, 21 of 50 countries are graded green  -  all thirty indicators sourced  - 
            and 29 carry a red flag. The flag is not a footnote: it travels with the score wherever the
            score is published, and it is the first thing to check before citing a country.</p>
    
          <h2>How practitioner judgement is reviewed</h2>
          <p>Judgement enters at two points: the <span data-di="">Directed Intelligence stage assessment</span>, which is
            inherently qualitative, and any indicator scored without a source. Both are subject to the same
            controls.</p>
          <ul>
            <li>Every judgement-scored indicator names the assessor and carries a written rationale in the
              country workbook.</li>
            <li>No assessor reviews their own country. A second practitioner reviews the scored workbook
              before the edition is locked.</li>
            <li>Structured interviews with in-country AI and corporate leads are used to test judgement
              scores against people operating inside the system being assessed.</li>
            <li>No single data source determines a score, and no dimension is scored from a single
              indicator.</li>
          </ul>
    
          <h2 id="weighting">Contextual weighting</h2>
          <p>Weights are published as ranges rather than fixed values because SAPI applies a contextual
            adjustment based on a nation's stage of institutional development. A country early on the{" "}
            <span data-di="">Directed Intelligence maturity scale</span> may have its Regulatory Readiness weight raised, because
            policy frameworks carry more of the load at that stage than they do for a country already
            running AI in production.</p>
    
          <h2 id="changes">What changes between editions</h2>
          <p>The template was locked at v1.0 for Cycle 2. Changes between editions fall into three classes,
            and each is recorded differently.</p>
          <ul>
            <li><strong>Coverage changes.</strong> Countries added or removed. Cycle 2 extended coverage
              from 38 countries to 50. New entrants have no prior score and no movement is reported for them.</li>
            <li><strong>Methodological changes.</strong> Indicator definitions tightened, sources upgraded,
              scoring rules clarified. Where a country's movement between editions is driven by
              methodology rather than events, it is marked as such and is <strong>not</strong> reported as
              progress or decline. In Cycle 2 the majority of movements fall into this class.</li>
            <li><strong>Real change.</strong> Movement attributable to something that happened in the
              country. Six are identified in the current edition and each carries a stated driver.</li>
          </ul>
        </div>
      </div>
    </section>
    
    <section className="section on-ink">
      <div className="shell shell--narrow center">
        <h2 style={{ fontSize: "clamp(1.7rem,3vw,2.2rem)" }}>The full methodology paper</h2>
        <p className="lede" style={{ marginInline: "auto" }}>The complete weighting methodology, indicator
          definitions and scoring rules are released under NDA to institutional counterparts.</p>
        <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.5rem" }}>
          <a className="btn btn--primary" href="/contact">Request the methodology paper</a>
        </div>
      </div>
    </section>
    
    </main>  );
});

export default function MethodologyPage() {
  return (
    <ObsidianLayout page="methodology">
      <MethodologyBody />
    </ObsidianLayout>
  );
}
