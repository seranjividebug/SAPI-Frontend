import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (insights/conversion-not-compute.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const ConversionNotComputeBody = memo(function ConversionNotComputeBody() {
  return (
    <main id="main">
    <article className="section">
      <div className="shell shell--narrow">
        <header className="article-head">
          <p className="eyebrow">Thematic analysis</p>
          <h1><span data-di="">Directed Intelligence</span>, not compute, decides sovereign AI power</h1>
          <div className="article-meta">
            <span className="meta">Published 2 July 2026</span>
            <span className="meta">Quarter 2 Rankings 2026</span>
            <span className="meta segmented-meta"><span className="segment">Dimensions: <span data-di="">Directed Intelligence</span></span><span className="segment"> · Compute Capacity</span></span>
          </div>
        </header>
    
        <ol className="spine">
          <li><a href="#finding">1 Finding</a></li>
          <li><a href="#evidence">2 Evidence</a></li>
          <li><a href="#interpretation">3 Interpretation</a></li>
          <li><a href="#implication">4 Decision implication</a></li>
          <li><a href="#enquiry">5 Enquiry</a></li>
        </ol>
    
        <div className="article-body">
          <h2 id="finding">Finding</h2>
          <p>A nation's stock of compute tells you surprisingly little about its sovereign AI standing.
            Across the fifty countries in the Quarter 2 2026 edition, Compute Capacity is the <em>weakest</em>
            {" "}of the five dimensions as a predictor of overall rank. <span data-di="">Directed Intelligence</span>  -  whether a state actually runs AI in production across its institutions  -  is close to the strongest.</p>
    
          <h2 id="evidence">Supporting evidence</h2>
          <p>Three measurements, all from the current edition, point the same way.</p>
    
          <h3>1. Compute correlates least with the composite</h3>
          <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="data" style={{ minWidth: "0" }}>
              <caption>Correlation of each dimension with the composite score, n = 50</caption>
              <thead><tr><th scope="col">Dimension</th><th scope="col" className="num">r</th></tr></thead>
              <tbody>
                <tr><th scope="row">Capital Formation</th><td className="num">0.89</td></tr>
                <tr><th scope="row" data-di="">Directed Intelligence</th><td className="num" data-di="n">0.88</td></tr>
                <tr><th scope="row">Compute Capacity</th><td className="num">0.78</td></tr>
              </tbody>
            </table>
          </div>
    
          <h3>2. The compute leader is not the index leader</h3>
          <p>The United States records 91.0 on Compute Capacity  -  the highest score any country achieves on
            any dimension in the edition, and roughly forty points clear of the next country. It ranks
            fourth overall, on a composite of 57.5. Its Capital Formation score of 35.7 and <span data-di="">Directed
            Intelligence</span> score of <span data-di="n">52.8</span> hold it there. It is also the most lopsided nation in the index, with
            a 55-point spread between its strongest and weakest dimension.</p>
    
          <h3>3. The <span data-di="">Directed Intelligence</span> leaders are small states with little compute</h3>
          <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="data">
              <caption><span data-di="">Directed Intelligence</span> leaders, and what they hold in compute</caption>
              <thead><tr><th scope="col">Country</th><th scope="col" className="num" data-di="">Directed Intelligence</th><th scope="col" className="num">Compute Capacity</th><th scope="col" className="num">Composite</th><th scope="col" className="num">Rank</th></tr></thead>
              <tbody>
                <tr><th scope="row">Estonia</th><td className="num" data-di="n">83.3</td><td className="num">32.9</td><td className="num">56.6</td><td className="num">5</td></tr>
                <tr><th scope="row">Oman</th><td className="num" data-di="n">77.3</td><td className="num">32.4</td><td className="num">52.7</td><td className="num">8</td></tr>
                <tr><th scope="row">Singapore</th><td className="num" data-di="n">63.7</td><td className="num">44.7</td><td className="num">58.2</td><td className="num">3</td></tr>
                <tr><th scope="row">United States</th><td className="num" data-di="n">52.8</td><td className="num">91.0</td><td className="num">57.5</td><td className="num">4</td></tr>
              </tbody>
            </table>
          </div>
          <p>Estonia, a state of 1.3 million people, outranks every G7 member except the United States  - 
            Japan, Germany, the United Kingdom, France, Italy and Canada. It does so on a compute score in
            the bottom half of the field.</p>
    
          <h2 id="interpretation">Interpretation</h2>
          <p>Two mechanisms explain the pattern.</p>
          <p>The first is structural, and belongs to the composite. SAPI aggregates the five dimensions with
            a weighted geometric mean rather than a weighted average. A geometric mean rewards breadth and
            penalises a hollow pillar, so accumulating one dimension past the point where the others can
            support it produces diminishing returns. Compute bought without the governance, capital and
            institutional capacity to direct it is, in the language of the index, stranded capacity.</p>
          <p>The second is behavioural. Compact, coordinated governments move faster on <span data-di="">Directed Intelligence</span>. Deploying AI inside
            a state is an exercise in interdepartmental coordination  -  shared identity, shared data, shared
            procurement, a mandate that survives a change of minister. Small states with unified digital
            government clear that bar more easily than large federal ones, regardless of budget. The
            clustering bears this out: Estonia and Oman fall into the same archetype, <em>Lean Digital
            Converters</em>, on a signature of thin compute and capital with the highest <span data-di="">Directed Intelligence scores</span> in the field.</p>
          <p>This also means <span data-di="">Directed Intelligence</span> is where the fastest movement is available. Canada's
            +8.5 composite gain this edition  -  the largest genuine improvement in the field  -  came primarily
            through <span data-di="">Directed Intelligence</span> (<span data-di="n">+15</span>) and Data Sovereignty (+14) after it appointed a dedicated
            Minister of AI. No new data centre was required to produce it.</p>
    
          <h2 id="implication">Decision implication</h2>
          <p><strong>For governments.</strong> If your national AI strategy is sequenced compute-first,
            the index suggests you will spend heavily for a rank that moves slowly. The cheaper move is usually <span data-di="">Directed Intelligence</span>: a departmental mandate, a procurement route, a named owner
            with budget authority. Check your own weakest dimension before your strongest.</p>
          <p><strong>For investors.</strong> A country with high compute and <span data-di="">low Directed Intelligence</span> is carrying
            utilisation risk on capacity that is already built. A country with <span data-di="">high Directed Intelligence</span> and low compute is carrying demand that has nowhere to run  -  the more attractive shape for a build-out,
            and the reason the Lean Digital Converter archetype is worth screening separately.</p>
    
          <h2 id="enquiry">Relevant enquiry</h2>
          <p>An investor briefing covers the <span data-di="">Directed Intelligence</span> versus compute screen across all fifty countries,
            including the dimension scores held back from the public table. A country assessment produces
            the same analysis for a single nation at indicator level, with the gap ranking that comes with it.</p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            <a className="btn btn--primary" href="/contact">Request a briefing</a>
            <a className="btn btn--ghost" href="/sapi-index">See the current edition</a>
          </div>
    
          <div className="sources" style={{ marginTop: "3rem", borderTop: "1px solid var(--ivory-line)", paddingTop: "1.5rem" }}>
            <h2 style={{ border: "0", padding: "0", marginTop: "0", fontSize: "1.1rem" }}>Sources and definitions</h2>
            <ol>
              <li>All scores: SAPI Quarter 2 Rankings 2026, published 2 July 2026. n = 50.</li>
              <li>Correlations and cluster assignments computed on standardised dimension scores across the full field.</li>
              <li>Dimension definitions and weight ranges: <a href="/methodology">Methodology</a>.</li>
            </ol>
          </div>
        </div>
      </div>
    </article>
    
    </main>  );
});

export default function ConversionNotCompute() {
  return (
    <ObsidianLayout page="note" progress>
      <ConversionNotComputeBody />
    </ObsidianLayout>
  );
}
