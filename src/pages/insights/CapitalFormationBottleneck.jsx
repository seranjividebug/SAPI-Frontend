import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (insights/capital-formation-bottleneck.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const CapitalFormationBottleneckBody = memo(function CapitalFormationBottleneckBody() {
  return (
    <main id="main">
    <article className="section">
      <div className="shell shell--narrow">
        <header className="article-head">
          <p className="eyebrow">Strategic risk briefing</p>
          <h1>The financing gap: capital is the world's binding constraint on sovereign AI</h1>
          <div className="article-meta">
            <span className="meta">Published 2 July 2026</span>
            <span className="meta">Quarter 2 Rankings 2026</span>
            <span className="meta">Dimension: Capital Formation</span>
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
          <p>Capital Formation is simultaneously the weakest dimension in the field and the single
            strongest predictor of where a country ranks. The world has written the policy of sovereign AI
            well ahead of financing the machine.</p>
    
          <h2 id="evidence">Supporting evidence</h2>
          <h3>1. The two institutional pillars sit high; the two resource pillars form the floor</h3>
          <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="data" style={{ minWidth: "0" }}>
              <caption>Field mean by dimension, n = 50, scale 0–100</caption>
              <thead><tr><th scope="col">Dimension</th><th scope="col" className="num">Field mean</th><th scope="col">Type</th></tr></thead>
              <tbody>
                <tr><th scope="row">Data Sovereignty</th><td className="num">53.8</td><td>Institutional</td></tr>
                <tr><th scope="row">Regulatory Readiness</th><td className="num">48.6</td><td>Institutional</td></tr>
                <tr><th scope="row" data-di="">Directed Intelligence</th><td className="num" data-di="n">43.4</td><td>Execution</td></tr>
                <tr><th scope="row">Compute Capacity</th><td className="num">29.4</td><td>Resource</td></tr>
                <tr><th scope="row">Capital Formation</th><td className="num">28.5</td><td>Resource</td></tr>
              </tbody>
            </table>
          </div>
          <p>The dimensions the world scores highest on are the low-capital ones: data-residency regimes,
            governance frameworks, public-sector cloud. The two it scores lowest on are the expensive ones.</p>
    
          <h3>2. Capital is the strongest predictor of overall rank</h3>
          <p>Capital Formation correlates with the composite at 0.89, ahead of <span data-di="">Directed Intelligence</span> (<span data-di="n">0.88</span>)
            and well ahead of Compute Capacity (0.78). It is also the dimension with the third-largest gap
            between Developing and Nascent countries (standardised effect size 1.48).</p>
    
          <h3>3. The capital leaders are state-capital systems, not the largest economies</h3>
          <div className="table-wrap" style={{ marginBottom: "1.5rem" }}>
            <table className="data">
              <caption>Capital Formation, highest and lowest scores</caption>
              <thead><tr><th scope="col">Highest</th><th scope="col" className="num">Score</th><th scope="col">Lowest</th><th scope="col" className="num">Score</th></tr></thead>
              <tbody>
                <tr><th scope="row">United Arab Emirates</th><td className="num">64.4</td><td>Paraguay</td><td className="num">6.9</td></tr>
                <tr><th scope="row">Saudi Arabia</th><td className="num">62.2</td><td>Turkmenistan</td><td className="num">7.6</td></tr>
                <tr><th scope="row">South Korea</th><td className="num">50.5</td><td>Ethiopia</td><td className="num">9.0</td></tr>
              </tbody>
            </table>
          </div>
          <p>Several G7 members score below the field mid-point on Capital Formation. The United States,
            with the deepest capital markets in the world, records 35.7  -  under the score of a Gulf state a
            fraction of its size. The Nordics moved in the wrong direction this edition: Sweden's Capital
            Formation fell 12 points and Norway's fell 16, driving both countries' composites down.</p>
    
          <h2 id="interpretation">Interpretation</h2>
          <p>Capital Formation does not measure how much money a country has. It measures how much of it is
            directed at sovereign AI, and through what mechanism. That distinction is the whole finding.</p>
          <p>Deep private capital markets do not automatically produce sovereign AI capital, because private
            capital allocates on returns rather than on national capability, and the two only coincide
            sometimes. State-capital systems  -  sovereign wealth funds with an explicit mandate, national
            champions, directed industrial policy  -  convert reserves into sovereign AI capacity far more
            reliably. This is why the UAE and Saudi Arabia lead the dimension while larger, richer economies
            do not, and it is the mechanism behind the UAE's second place overall despite a compute score of
            40.9.</p>
          <p>The sequencing insight follows. Regulation is cheap and has largely been done: most countries
            now have respectable AI governance, which is why the dimension no longer separates them at the
            top of the table. What separates the leading pack is that they have managed to attach capital
            and compute to that regulation. For most of the field, the binding constraint is no longer legal.</p>
    
          <h2 id="implication">Decision implication</h2>
          <p><strong>For governments.</strong> If your Capital Formation score trails your Regulatory
            Readiness score by twenty points or more  -  the modal shape in this edition  -  further regulatory
            work will not move your position. The question to put to your finance ministry is not how much
            is available but through what standing mechanism it reaches sovereign AI, and who decides.</p>
          <p><strong>For investors.</strong> The gap between institutional readiness and capital readiness
            is where the opportunity sits. A country scoring well on Regulatory Readiness and Data
            Sovereignty and poorly on Capital Formation has cleared the conditions for deployment without
            the money to deploy  -  that is a market with the permitting risk already retired. Nineteen
            countries in the <em>Institutional Mid-field</em> archetype fit this description, at a mean
            Capital Formation of 32.5 against a mean Regulatory Readiness of 58.4.</p>
    
          <h2 id="enquiry">Relevant enquiry</h2>
          <p>The investor briefing screens the full field on the institutional-versus-capital gap and
            separates funded demand from demand that needs capital first.</p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            <a className="btn btn--primary" href="/contact">Request a briefing</a>
            <a className="btn btn--ghost" href="/sapi-index">See the current edition</a>
          </div>
    
          <div className="sources" style={{ marginTop: "3rem", borderTop: "1px solid var(--ivory-line)", paddingTop: "1.5rem" }}>
            <h2 style={{ border: "0", padding: "0", marginTop: "0", fontSize: "1.1rem" }}>Sources and definitions</h2>
            <ol>
              <li>All scores: SAPI Quarter 2 Rankings 2026, published 2 July 2026. n = 50.</li>
              <li><strong>Capital Formation</strong>  -  the depth and strategic orientation of capital for AI
                development: sovereign wealth deployment, venture ecosystems, and the mechanisms directing
                capital toward sovereign priorities. Weight range 20–25%.</li>
              <li>Tier-discrimination effect sizes are standardised mean differences between the Developing and Nascent groups.</li>
              <li>Prior-edition comparisons are against Cycle 1 (38 countries). See <a href="/insights/reading-national-ai-readiness">how to read a movement between editions</a>.</li>
            </ol>
          </div>
        </div>
      </div>
    </article>
    
    </main>  );
});

export default function CapitalFormationBottleneck() {
  return (
    <ObsidianLayout page="note" progress>
      <CapitalFormationBottleneckBody />
    </ObsidianLayout>
  );
}
