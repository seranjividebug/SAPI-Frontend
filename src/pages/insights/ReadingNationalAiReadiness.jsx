import { memo } from "react";
import ObsidianLayout from "../common/ObsidianLayout";

// Ported from the "SAPI Obsidian" reference build (insights/reading-national-ai-readiness.html).
// motion.js adds the reveals over this markup after mount, so it is memoised and never re-renders.
const ReadingNationalAiReadinessBody = memo(function ReadingNationalAiReadinessBody() {
  return (
    <main id="main">
    <article className="section">
      <div className="shell shell--narrow">
        <header className="article-head">
          <p className="eyebrow">Practical guide for decision-makers</p>
          <h1>How to read a national AI readiness score</h1>
          <div className="article-meta">
            <span className="meta">Published 2 July 2026</span>
            <span className="meta">Quarter 2 Rankings 2026</span>
            <span className="meta">Applies to: all editions</span>
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
          <p>Four mistakes account for most of the misreadings we see when a national readiness score
            reaches a board paper or a ministerial brief. Each one is avoidable, and each one changes the
            conclusion a reader draws.</p>
    
          <h2 id="evidence">Supporting evidence</h2>
    
          <h3>Mistake 1  -  Treating a rank movement as a change on the ground</h3>
          <p>Twenty-seven countries recorded a composite movement between Cycle 1 and Cycle 2. Only a
            minority of those movements reflect anything that happened in the country. The rest reflect the
            methodology firming up: indicators tightened, sources upgraded, coverage extended from 38
            countries to 50. Egypt's apparent +34.2 and Estonia's +18.6 belong to that second category.
            Canada's +8.5, Japan's +4.6 and Sweden's −5.2 belong to the first.</p>
          <p>The <a href="/sapi-index">edition page</a> marks which is which. A movement that
            is not marked as real change should not be cited as one.</p>
    
          <h3>Mistake 2  -  Reading the composite without the shape underneath it</h3>
          <p>Two countries can post near-identical composites on entirely different strategies. In this
            edition the United States (57.5) and South Korea (59.2) sit two places apart and share almost
            nothing structurally: the United States records 91.0 on Compute Capacity and 35.7 on Capital
            Formation, a 55-point internal spread; South Korea's five dimensions sit inside a much narrower
            band. The composite is a summary, and it hides the thing you usually need.</p>
          <p>The practical version: read a country's <em>weakest</em> dimension first. It is the binding
            constraint, and because the composite is a weighted geometric mean it is also the number with
            the most leverage on the total.</p>
    
          <h3>Mistake 3  -  Ignoring the data-quality flag</h3>
          <p>Twenty-nine of the fifty countries in this edition carry a red data-quality flag, meaning at
            least three of their thirty indicators could not be traced to a dated public document or a
            verified in-country response. Turkmenistan carries eleven such indicators, Paraguay and
            Tajikistan eight each. Those scores are indicative. Twenty-one countries  -  including the United
            States, the United Kingdom, France, Singapore, South Korea, the UAE, Saudi Arabia and Qatar  - 
            are fully sourced.</p>
    
          <h3>Mistake 4  -  Comparing scores as though the weights were identical</h3>
          <p>SAPI applies contextual weighting within published ranges, so two countries at different
            stages of institutional maturity are not scored under an identical weight set. Re-running the
            index across the full range of permitted weights moves a typical country's composite by 16.4
            points from the bottom to the top of its band. For some countries the band is much wider  - 
            Ethiopia 18.8 points, Australia 18.6, Indonesia 18.5.</p>
          <p>A four-point difference between two countries in the middle of the table is not a reliable
            ordering. A twenty-point difference is.</p>
    
          <h2 id="interpretation">Interpretation</h2>
          <p>All four mistakes share a root: an index score reads like a measurement and behaves like an
            estimate. The number is the output of a defined procedure applied to evidence of varying
            quality, at a fixed point in time, under a weight set chosen for a purpose. It supports
            comparison at the scale of tiers and archetypes far better than it supports comparison at the
            scale of single ranks.</p>
          <p>Used at the right resolution, it does work that no single-country brief can do: it tells you
            which constraint binds, whether that constraint is common to a country's peer group, and what
            the countries that cleared it did first.</p>
    
          <h2 id="implication">Decision implication</h2>
          <p>Before a SAPI figure goes into a decision document, four checks:</p>
          <ol>
            <li><strong>Which edition?</strong> Cite it with its publication date. This edition was published 2 July 2026.</li>
            <li><strong>Is the movement marked as real change?</strong> If not, do not describe it as
              progress or decline.</li>
            <li><strong>What is the data-quality grade?</strong> A red flag means part of the score rests
              on practitioner judgement.</li>
            <li><strong>Is the gap you are relying on larger than the sensitivity band?</strong> If the
              two countries are within a few points, treat them as level.</li>
          </ol>
    
          <h2 id="enquiry">Relevant enquiry</h2>
          <p>If you are preparing a paper that cites the index and want the figures checked, or the
            underlying sources for a specific country, ask. We would rather answer the question than see
            the number used at the wrong resolution.</p>
          <div className="btn-row" style={{ marginTop: "1.5rem" }}>
            <a className="btn btn--primary" href="/contact">Request a briefing</a>
            <a className="btn btn--ghost" href="/methodology">Read the methodology</a>
          </div>
    
          <div className="sources" style={{ marginTop: "3rem", borderTop: "1px solid var(--ivory-line)", paddingTop: "1.5rem" }}>
            <h2 style={{ border: "0", padding: "0", marginTop: "0", fontSize: "1.1rem" }}>Sources and definitions</h2>
            <ol>
              <li>All figures: SAPI Quarter 2 Rankings 2026, published 2 July 2026. n = 50.</li>
              <li>Sensitivity bands computed by re-scoring every country at the bounds of the published weight ranges.</li>
              <li>Data-quality grading and the treatment of missing evidence: <a href="/methodology#missing">Methodology</a>.</li>
            </ol>
          </div>
        </div>
      </div>
    </article>
    
    </main>  );
});

export default function ReadingNationalAiReadiness() {
  return (
    <ObsidianLayout page="note" progress>
      <ReadingNationalAiReadinessBody />
    </ObsidianLayout>
  );
}
