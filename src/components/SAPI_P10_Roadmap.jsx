import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../services/roadmapService";
import { getAssessmentResults } from "../services/assessmentService";

// ── Logo Component ──────────────────────────────────────────────────────────
function SAPIGlobe({ size = 32 }) {
  return (
    <img
      src="/logo.png"
      alt="SAPI Logo"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: 'transparent',
        borderRadius: '50%',
        padding: '2px',
        boxSizing: 'border-box',
        WebkitMaskImage: 'radial-gradient(circle, white 100%, transparent 100%)',
        maskImage: 'radial-gradient(circle, white 100%, transparent 100%)'
      }}
    />
  );
}

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  void:      "#06030E",
  navy:      "#0F0830",
  midnight:  "#1A1540",
  gold:      "#C9963A",
  paleGold:  "#EDD98A",
  parchment: "#FBF5E6",
  muted:     "#9880B0",
  bronze:    "rgba(107,69,8,0.22)",
  bronzeStr: "rgba(107,69,8,0.45)",
  emerald:   "#28A868",
  amber:     "#F0C050",
  crimson:   "#C03058",
  blue:      "#4A7AE0",
};

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { key: "Compute Capacity",               shortCode: "D1", color: C.blue    },
  { key: "Capital Formation",              shortCode: "D2", color: C.amber   },
  { key: "Regulatory Readiness",           shortCode: "D3", color: C.gold    },
  { key: "Data Sovereignty",               shortCode: "D4", color: C.emerald },
  { key: "Directed Intelligence Maturity", shortCode: "D5", color: C.muted   },
];

// ── Full Intervention Library ─────────────────────────────────────────────────
// Each dimension has LOW / MEDIUM / HIGH, each with 3 interventions.
// Interventions are ordered: [0]=Quick Win (0–3m), [1]=Structural (3–12m), [2]=Strategic (12–18m)
// eslint-disable-next-line no-unused-vars
const LIBRARY = {
  "Compute Capacity": {
    LOW: [
      {
        title: "Commission a national compute audit to map current GPU/TPU assets and energy capacity.",
        desc:  "A structured audit provides the baseline data required for strategic compute investment decisions. This forms the foundation of all subsequent infrastructure planning.",
      },
      {
        title: "Engage sovereign cloud providers for initial workload migration.",
        desc:  "Sovereign cloud partnerships establish data residency controls while reducing dependency on foreign infrastructure operators. Early engagement secures favourable commercial terms for long-term agreements.",
      },
      {
        title: "Begin semiconductor supply chain diversification planning.",
        desc:  "Supply chain concentration risk is the primary vulnerability in national compute strategies. Diversification planning should identify alternative sourcing routes and allied fabrication partners.",
      },
    ],
    MEDIUM: [
      {
        title: "Establish a National Compute Authority to coordinate procurement and benchmarking.",
        desc:  "Centralised coordination eliminates duplicated procurement and ensures national benchmarking standards are applied consistently. The Authority should report directly to a senior minister.",
      },
      {
        title: "Secure dedicated energy supply agreements for AI data centres.",
        desc:  "AI workloads require predictable, low-cost energy at scale — speculative procurement creates both cost and resilience risk. Long-term power purchase agreements lock in favourable rates and guarantee uptime.",
      },
      {
        title: "Launch sovereign cloud migration programme for government workloads.",
        desc:  "A structured migration programme converts ad hoc cloud usage into a coordinated sovereignty strategy. Programme governance should include clear workload classification and migration sequencing criteria.",
      },
    ],
    HIGH: [
      {
        title: "Optimise existing compute for cost-per-inference efficiency.",
        desc:  "At high compute capacity, the marginal gain shifts from raw scale to operational efficiency. Cost-per-inference optimisation directly improves the return on existing infrastructure investment.",
      },
      {
        title: "Expand data centre capacity with renewable energy integration.",
        desc:  "Renewable integration future-proofs data centre economics against carbon pricing mechanisms. Expansion should be tied to credible demand forecasts from government AI deployment pipelines.",
      },
      {
        title: "Establish strategic semiconductor stockpile or fabrication alliance.",
        desc:  "A sovereign semiconductor reserve provides buffer against supply disruptions that could halt AI operations. Fabrication alliances with allied states provide longer-term supply chain resilience.",
      },
    ],
  },

  "Capital Formation": {
    LOW: [
      {
        title: "Establish a dedicated AI budget line within government R&D.",
        desc:  "Ring-fenced AI funding prevents reallocation during budget cycles and signals long-term institutional commitment. A dedicated budget line also enables cross-departmental tracking of AI investment returns.",
      },
      {
        title: "Commission a DFI AI readiness review.",
        desc:  "Development finance institutions are often underutilised as AI capital catalysts due to unclear mandate and risk appetite. A readiness review defines the DFI's role in national AI capitalisation and identifies structural barriers.",
      },
      {
        title: "Engage sovereign wealth fund leadership on AI infrastructure investment thesis.",
        desc:  "Sovereign wealth funds represent the largest pool of patient capital available for long-horizon AI infrastructure. Early engagement establishes an investment thesis before commercial pressure forces reactive decisions.",
      },
    ],
    MEDIUM: [
      {
        title: "Create a multi-year (5+ year) committed AI infrastructure fund.",
        desc:  "Multi-year commitment signals credibility to international co-investors and enables infrastructure projects that require extended development cycles. Fund governance should include clear deployment targets and accountability mechanisms.",
      },
      {
        title: "Establish AI-specific DFI financing vehicles.",
        desc:  "Generic DFI instruments are poorly suited to AI projects, which combine early-stage risk with sovereign strategic value. Purpose-built vehicles — grants, concessional loans, equity — create appropriate risk-return profiles.",
      },
      {
        title: "Launch a domestic AI VC catalytic fund to stimulate private capital.",
        desc:  "Government anchor investment in an AI VC vehicle de-risks early participation from domestic private capital. A catalytic fund should target 3–5× private capital leverage to maximise fiscal impact.",
      },
    ],
    HIGH: [
      {
        title: "Optimise capital deployment velocity (target: <12 months commitment to delivery).",
        desc:  "At high capital formation, the constraint shifts from availability to deployment speed. Streamlined approval processes and pre-qualified vendor panels reduce commitment-to-delivery lag.",
      },
      {
        title: "Expand SWF AI allocation.",
        desc:  "Sovereign wealth funds at this stage should increase their AI portfolio weighting to reflect the asset class's growing strategic and commercial significance. Allocation expansion should be paired with dedicated AI investment expertise.",
      },
      {
        title: "Establish export financing for sovereign AI capabilities to allied nations.",
        desc:  "Export-ready AI capabilities represent a new diplomatic and commercial instrument for high-capital nations. Export financing vehicles accelerate adoption in allied states while generating returns on national AI investment.",
      },
    ],
  },

  "Regulatory Readiness": {
    LOW: [
      {
        title: "Publish a national AI strategy with measurable objectives and institutional ownership.",
        desc:  "A credible national AI strategy provides the mandate for all subsequent regulatory and investment actions. Measurable objectives and named institutional owners are prerequisites for accountability and international benchmarking.",
      },
      {
        title: "Establish an advisory AI ethics body.",
        desc:  "An advisory body creates the institutional legitimacy to engage international standards bodies and builds the expertise pipeline for future statutory regulation. It should include cross-sector representation including civil society.",
      },
      {
        title: "Begin AI-specific legislation consultation.",
        desc:  "Early consultation builds the evidence base for proportionate legislation and prevents regulatory gaps from creating liability uncertainty. A structured consultation process signals regulatory intent to the market.",
      },
    ],
    MEDIUM: [
      {
        title: "Enact AI-specific legislation covering liability and IP.",
        desc:  "Liability and IP frameworks resolve the legal uncertainty that inhibits institutional AI adoption. Legislation should be technology-neutral and reviewed on a two-year cycle to keep pace with capability development.",
      },
      {
        title: "Upgrade AI ethics body to statutory authority.",
        desc:  "Statutory status grants enforcement power, budget certainty, and international treaty-making authority. The transition from advisory to statutory should include a formal mandate review and new board appointments.",
      },
      {
        title: "Deploy AI procurement sandboxes. Join ISO/IEC AI standards working groups.",
        desc:  "Procurement sandboxes allow government agencies to test AI suppliers against sovereign standards before full contract award. Standards working group membership shapes global frameworks in line with national interests.",
      },
    ],
    HIGH: [
      {
        title: "Achieve >60% strategy-to-implementation ratio.",
        desc:  "The critical failure mode at high regulatory readiness is a growing gap between published strategy and operational implementation. A 60% implementation ratio is the minimum threshold for credible international benchmarking.",
      },
      {
        title: "Establish centralised AI governance office.",
        desc:  "Centralised governance eliminates the coordination overhead that fragments policy execution across departments. The office should have cross-departmental authority to enforce AI standards and resolve inter-agency disputes.",
      },
      {
        title: "Lead international standards development. Institute mandatory algorithmic impact assessment.",
        desc:  "Standards leadership converts regulatory maturity into geopolitical influence and first-mover advantage in global AI governance. Mandatory impact assessments build the institutional knowledge base for future regulatory iterations.",
      },
    ],
  },

  "Data Sovereignty": {
    LOW: [
      {
        title: "Conduct a data residency audit for government workloads.",
        desc:  "A residency audit maps where government data currently resides and identifies exposures to foreign jurisdiction. The audit output defines the priority sequencing for localisation and migration.",
      },
      {
        title: "Establish enforceable data localisation requirements for strategic data.",
        desc:  "Enforceable localisation requirements — backed by sanctions for non-compliance — close the gap between policy intent and operational reality. Strategic data classification is the prerequisite step.",
      },
      {
        title: "Begin government data cataloguing programme.",
        desc:  "A systematic cataloguing programme creates the inventory needed for AI training data sourcing and cross-agency data sharing. Cataloguing should capture data quality, sensitivity classification, and update frequency.",
      },
    ],
    MEDIUM: [
      {
        title: "Migrate majority of government workloads to sovereign cloud.",
        desc:  "Majority migration reaches the threshold required for meaningful data sovereignty; partial migration leaves material exposure. Migration sequencing should prioritise highest-sensitivity workloads first.",
      },
      {
        title: "Implement cross-border data flow controls with enforcement.",
        desc:  "Controls without enforcement create a compliance illusion; enforcement mechanisms must be technically implemented, not just legally mandated. Bilateral data-sharing agreements should be reviewed for sovereignty consistency.",
      },
      {
        title: "Launch sovereign AI training data pipeline for priority use cases.",
        desc:  "A sovereign training data pipeline reduces dependency on foreign datasets and ensures AI outputs reflect national context. Pipeline development should align with the highest-value government AI use cases.",
      },
    ],
    HIGH: [
      {
        title: "Achieve full sovereign cloud coverage for sensitive workloads.",
        desc:  "Complete coverage closes the residual exposure that persists from partial migration. Coverage audits should be conducted quarterly and results published in the government AI transparency report.",
      },
      {
        title: "Establish comprehensive data governance with real-time cataloguing.",
        desc:  "Real-time cataloguing enables dynamic AI training data sourcing and supports automated compliance monitoring. Governance frameworks at this level should include data quality SLAs and breach notification requirements.",
      },
      {
        title: "Build domestic AI training data supply chain at scale.",
        desc:  "A domestic supply chain at scale enables self-sufficiency in AI capability development and creates exportable data infrastructure. Scale requires coordinated investment across government, academia, and the private sector.",
      },
    ],
  },

  "Directed Intelligence Maturity": {
    LOW: [
      {
        title: "Map all AI pilots to national strategy priorities.",
        desc:  "Unmapped pilots represent strategic drift — resource consumption without sovereign value creation. A formal mapping exercise identifies misaligned pilots for reorientation or termination.",
      },
      {
        title: "Establish a cross-departmental AI coordination working group.",
        desc:  "A coordination working group prevents duplication and creates the shared situational awareness needed for strategic deployment. It should have a defined mandate, senior sponsorship, and quarterly reporting obligations.",
      },
      {
        title: "Begin systematic outcome measurement for existing deployments.",
        desc:  "Without systematic measurement, AI investment cannot be justified, scaled, or terminated on evidence. Outcome measurement frameworks should capture efficiency gains, decision quality improvements, and sovereign capability metrics.",
      },
    ],
    MEDIUM: [
      {
        title: "Formalise mission alignment: sovereign priorities must drive technology selection.",
        desc:  "Technology-led AI adoption inverts the correct decision sequence and produces deployments without strategic anchor. Formalised mission alignment ensures every technology selection begins with a sovereign priority statement.",
      },
      {
        title: "Define human-agent decision ratios per department.",
        desc:  "Decision ratios establish the governance framework for human oversight and AI autonomy across different risk contexts. Ratios should be published in departmental AI governance statements and reviewed annually.",
      },
      {
        title: "Scale pilots to production (target: >25% conversion rate).",
        desc:  "A 25% pilot-to-production conversion rate is the minimum threshold for a functioning AI deployment pipeline. Conversion blockages — procurement, legal, technical — should be identified and systematically removed.",
      },
    ],
    HIGH: [
      {
        title: "Achieve Intelligence Fabric: real-time AI coordination across government.",
        desc:  "An Intelligence Fabric represents the highest maturity state — AI systems that coordinate autonomously within a sovereign governance framework. Achieving this requires shared data standards, interoperable APIs, and cross-agency trust protocols.",
      },
      {
        title: "Institute systematic outcome attribution for all AI deployments.",
        desc:  "Attribution connects AI outputs to sovereign policy outcomes at the portfolio level, enabling investment optimisation and accountability. Attribution systems should be embedded in departmental AI governance from deployment.",
      },
      {
        title: "Ensure institutional durability across political transitions.",
        desc:  "Political transition is the primary risk to long-horizon AI programmes in government. Durability mechanisms include independent governance structures, multi-party endorsement, and technical continuity protocols.",
      },
    ],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function getBand(score) {
  if (score <= 39) return "LOW";
  if (score <= 64) return "MEDIUM";
  return "HIGH";
}

function bandLabel(band) {
  if (band === "LOW")    return "Low";
  if (band === "MEDIUM") return "Medium";
  return "High";
}

function bandColor(band) {
  if (band === "LOW")    return C.crimson;
  if (band === "MEDIUM") return C.amber;
  return C.emerald;
}

function scoreTarget(score, band) {
  if (band === "LOW")    return "45+";
  if (band === "MEDIUM") return "70+";
  return "85+";
}

// eslint-disable-next-line no-unused-vars
function dimMeta(key) {
  return DIMENSIONS.find(d => d.key === key) || { shortCode: "D?", color: C.muted };
}

// ── Roadmap derivation ────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const deriveRoadmap = null; // Replaced by API integration

// ── Phase column colours ──────────────────────────────────────────────────────
const PHASE_ACCENT = [C.emerald, C.blue, C.gold];
const PHASE_ICON   = ["⚡", "⚙", "◆"];

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════

export default function SAPIRoadmap() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState("overview");
  
  // API data states
  const [roadmapData, setRoadmapData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch assessment results and generate roadmap
  useEffect(() => {
    const fetchData = async () => {
      const assessmentId = localStorage.getItem('sapi_assessment_id');
      if (!assessmentId) {
        setError('No assessment found. Please complete the assessment first.');
        setLoading(false);
        return;
      }
      
      try {
        // First get assessment results for scores
        const assessmentResponse = await getAssessmentResults(assessmentId);
        if (!assessmentResponse.success) {
          setError(assessmentResponse.error || 'Failed to load assessment data');
          setLoading(false);
          return;
        }
        
        const apiData = assessmentResponse.data;
        setAssessmentData(apiData);
        
        // Calculate composite score
        const scores = [
          Number(apiData.compute_capacity) || 0,
          Number(apiData.capital_formation) || 0,
          Number(apiData.regulatory_readiness) || 0,
          Number(apiData.data_sovereignty) || 0,
          Number(apiData.directed_intelligence) || 0,
        ];
        const sapiScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;
        
        // Prepare dimension scores for roadmap API
        const dimensionScores = {
          1: Number(apiData.compute_capacity) || 0,
          2: Number(apiData.capital_formation) || 0,
          3: Number(apiData.regulatory_readiness) || 0,
          4: Number(apiData.data_sovereignty) || 0,
          5: Number(apiData.directed_intelligence) || 0,
        };
        
        // Call roadmap API with both dimensionScores and sapiScore
        const roadmapResponse = await generateRoadmap(dimensionScores, sapiScore);
        if (roadmapResponse.success) {
          setRoadmapData(roadmapResponse.data);
        } else {
          setError(roadmapResponse.error || 'Failed to generate roadmap');
        }
      } catch (err) {
        setError(err.message || 'Failed to load roadmap data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const compositeScore = roadmapData?.dimension_scorecard 
    ? Math.round(roadmapData.dimension_scorecard.reduce((sum, d) => sum + (Number(d.score) || 0), 0) / roadmapData.dimension_scorecard.length)
    : 0;
  const country = assessmentData?.country || assessmentData?.country_name || "-";

  // Transform API roadmap data to component format
  const { bottom3, phases, priorityPanel } = useMemo(() => {
    if (!roadmapData) {
      return { bottom3: [], phases: [], priorityPanel: [] };
    }
    
    // Build bottom3 from priority_interventions
    const bottom3List = (roadmapData.priority_interventions || []).map(pi => {
      const dimNameMap = {
        1: "Compute Capacity",
        2: "Capital Formation",
        3: "Regulatory Readiness", 
        4: "Data Sovereignty",
        5: "Directed Intelligence Maturity"
      };
      return {
        key: dimNameMap[pi.dimension_id] || pi.dimension_name,
        score: Number(pi.current_score) || 0
      };
    });
    
    // Build phases from action_plan
    const actionPlan = roadmapData.action_plan || {};
    const phasesList = [
      { label: "Quick Wins", timeline: "0 – 3 months", cards: [] },
      { label: "Structural Improvements", timeline: "3 – 12 months", cards: [] },
      { label: "Strategic Initiatives", timeline: "12 – 18 months", cards: [] }
    ];
    
    // Map actions to cards
    const dimMetaMap = {
      "Compute Capacity": { shortCode: "D1", color: C.blue },
      "Capital Formation": { shortCode: "D2", color: C.amber },
      "Regulatory Readiness": { shortCode: "D3", color: C.gold },
      "Data Sovereignty": { shortCode: "D4", color: C.emerald },
      "Directed Intelligence Maturity": { shortCode: "D5", color: C.muted }
    };
    
    const quickWins = actionPlan.quick_wins?.actions || [];
    const structural = actionPlan.structural_improvements?.actions || [];
    const strategic = actionPlan.strategic_initiatives?.actions || [];
    
    // Helper to parse action string and create card
    const createCardFromAction = (actionStr, score) => {
      const match = actionStr.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const dimName = match[1].trim();
        const title = match[2].trim();
        const meta = dimMetaMap[dimName] || { shortCode: "D1", color: C.blue };
        const band = getBand(score);
        return {
          dimKey: dimName,
          dimCode: meta.shortCode,
          dimColor: meta.color,
          band,
          score,
          target: scoreTarget(score, band),
          title,
          desc: "" // API doesn't provide descriptions in action_plan
        };
      }
      return null;
    };
    
    // Get scores for dimensions
    const scoreMap = {};
    bottom3List.forEach(d => { scoreMap[d.key] = d.score; });
    
    // Fill phases
    quickWins.forEach(action => {
      const dimName = action.match(/^([^:]+):/)?.[1]?.trim();
      const card = createCardFromAction(action, scoreMap[dimName] || 50);
      if (card) phasesList[0].cards.push(card);
    });
    
    structural.forEach(action => {
      const dimName = action.match(/^([^:]+):/)?.[1]?.trim();
      const card = createCardFromAction(action, scoreMap[dimName] || 50);
      if (card) phasesList[1].cards.push(card);
    });
    
    strategic.forEach(action => {
      const dimName = action.match(/^([^:]+):/)?.[1]?.trim();
      const card = createCardFromAction(action, scoreMap[dimName] || 50);
      if (card) phasesList[2].cards.push(card);
    });
    
    // Priority panel is first card from each dimension in quick wins
    const priorityList = phasesList[0].cards.slice(0, 3);
    
    return { bottom3: bottom3List, phases: phasesList, priorityPanel: priorityList };
  }, [roadmapData]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <SAPIGlobe size={64} />
        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 14, color: C.muted, letterSpacing: "0.1em", marginTop: 24 }}>
          Generating your roadmap…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: C.void, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <SAPIGlobe size={64} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: C.crimson, marginTop: 24, marginBottom: 16 }}>
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{ background: C.gold, color: C.void, border: "none", padding: "12px 24px", fontFamily: "system-ui, sans-serif", fontSize: 12, cursor: "pointer", borderRadius: 3 }}
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  const lowestDim       = bottom3[0]?.key  || "—";
  const secondLowestDim = bottom3[1]?.key  || "—";
  const totalInterventions = phases.reduce((n, p) => n + p.cards.length, 0);

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: C.void,
      color:           C.parchment,
      fontFamily:      "system-ui, -apple-system, sans-serif",
    }}>

      {/* ── App Header ── */}
      <header style={{
        borderBottom:    `1px solid ${C.bronze}`,
        backgroundColor: C.navy,
        position:        "sticky",
        top:             0,
        zIndex:          100,
      }}>
        <div style={{
          maxWidth:       1100,
          margin:         "0 auto",
          padding:        "18px 32px",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <SAPIGlobe size={32} />
            <span style={{
              fontFamily:    "Georgia, serif",
              fontSize:      11,
              letterSpacing: "0.14em",
              color:         C.parchment,
              opacity:       0.9,
              textTransform: "uppercase",
            }}>
              The Sovereign AI Power Index
            </span>
          </div>
          <span style={{
            fontSize:      10,
            letterSpacing: "0.15em",
            color:         C.crimson,
            textTransform: "uppercase",
            border:        `1px solid ${C.crimson}`,
            padding:       "3px 10px",
            opacity:       0.85,
          }}>
            Classification: Restricted
          </span>
        </div>
      </header>

      {/* ── Page body ── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ── Page header row ── */}
        <div style={{
          display:        "flex",
          alignItems:     "flex-start",
          justifyContent: "space-between",
          marginBottom:   40,
          flexWrap:       "wrap",
          gap:            16,
        }}>
          {/* Back + Title */}
          <div>
            <button
              onClick={() => navigate("/results")}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            6,
                background:     "none",
                border:         "none",
                cursor:         "pointer",
                color:          C.muted,
                fontSize:       12,
                letterSpacing:  "0.10em",
                textTransform:  "uppercase",
                padding:        0,
                marginBottom:   16,
              }}
            >
              <span style={{ fontSize: 14 }}>←</span> Back to Results
            </button>
            <h1 style={{
              fontFamily:    "Georgia, serif",
              fontSize:      28,
              fontWeight:    500,
              letterSpacing: "0.08em",
              color:         C.parchment,
              margin:        0,
              textTransform: "uppercase",
            }}>
              Sovereign AI Roadmap
            </h1>
          </div>

          {/* Nation + Score badge */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           16,
            flexWrap:      "wrap",
          }}>
            <span style={{
              fontSize:      14,
              color:         C.muted,
              letterSpacing: "0.06em",
            }}>
              {country}
            </span>
            <div style={{
              backgroundColor: C.midnight,
              border:          `1px solid ${C.bronzeStr}`,
              padding:         "8px 20px",
              display:         "flex",
              alignItems:      "center",
              gap:             10,
            }}>
              <span style={{
                fontFamily: "Georgia, serif",
                fontSize:   22,
                color:      C.paleGold,
                fontWeight: 500,
              }}>
                {Math.round(compositeScore)}
              </span>
              <span style={{
                fontSize:      10,
                letterSpacing: "0.12em",
                color:         C.muted,
                textTransform: "uppercase",
              }}>
                SAPI Score
              </span>
            </div>
          </div>
        </div>

        {/* ── Intro line ── */}
        <p style={{
          fontSize:     12,
          color:        C.muted,
          letterSpacing:"0.04em",
          lineHeight:   1.7,
          marginBottom: 48,
          maxWidth:     640,
          borderLeft:   `2px solid ${C.bronze}`,
          paddingLeft:  16,
        }}>
          Your personalised roadmap is generated from the three lowest-scoring dimensions in your
          assessment. Interventions are ranked by impact on composite SAPI score.
        </p>

        {/* ── Priority Interventions Panel ── */}
        <section style={{ marginBottom: 56 }}>
          <div style={{
            backgroundColor: C.midnight,
            border:          `1px solid ${C.gold}`,
            borderLeft:      `3px solid ${C.gold}`,
            padding:         "28px 32px",
          }}>
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           10,
              marginBottom:  24,
            }}>
              <span style={{
                fontFamily:    "Georgia, serif",
                fontSize:      11,
                letterSpacing: "0.16em",
                color:         C.gold,
                textTransform: "uppercase",
              }}>
                Priority Interventions
              </span>
              <div style={{
                height:          1,
                flex:            1,
                backgroundColor: C.bronzeStr,
              }} />
              <span style={{
                fontSize:      10,
                color:         C.muted,
                letterSpacing: "0.10em",
              }}>
                Immediate action required
              </span>
            </div>

            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap:                 20,
            }}>
              {priorityPanel.map((card, i) => (
                <PriorityCard key={i} card={card} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Three-Column Phase Layout ── */}
        <section>
          <div style={{
            fontFamily:    "Georgia, serif",
            fontSize:      11,
            letterSpacing: "0.16em",
            color:         C.muted,
            textTransform: "uppercase",
            marginBottom:  24,
          }}>
            Full Intervention Programme
          </div>

          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap:                 20,
            alignItems:          "start",
          }}>
            {phases.map((phase, pi) => (
              <PhaseColumn
                key={pi}
                phase={phase}
                accent={PHASE_ACCENT[pi]}
                icon={PHASE_ICON[pi]}
              />
            ))}
          </div>
        </section>

        {/* ── Upgrade Hook ── */}
        <section style={{ marginTop: 64 }}>
          <div style={{
            backgroundColor: C.navy,
            border:          `1px solid ${C.bronzeStr}`,
            borderTop:       `2px solid ${C.gold}`,
            padding:         "32px 40px",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "space-between",
            flexWrap:        "wrap",
            gap:             24,
          }}>
            <div style={{ maxWidth: 560 }}>
              <p style={{
                fontFamily:    "Georgia, serif",
                fontSize:      15,
                color:         C.parchment,
                lineHeight:    1.65,
                margin:        0,
                marginBottom:  8,
                letterSpacing: "0.02em",
              }}>
                Your roadmap identifies{" "}
                <span style={{ color: C.paleGold }}>{totalInterventions} critical interventions</span>.
              </p>
              <p style={{
                fontSize:     12,
                color:        C.muted,
                lineHeight:   1.7,
                margin:       0,
                letterSpacing:"0.02em",
              }}>
                Upgrade to Tier 2 for AI-agent-assisted deep dive into{" "}
                <span style={{ color: C.parchment }}>{lowestDim}</span> and{" "}
                <span style={{ color: C.parchment }}>{secondLowestDim}</span> with
                country-specific implementation guidance.
              </p>
            </div>

            <button
              onClick={() => setCurrentPage("upgrade")}
              style={{
                backgroundColor: C.gold,
                color:           C.void,
                border:          "none",
                padding:         "14px 32px",
                cursor:          "pointer",
                fontFamily:      "system-ui, sans-serif",
                fontSize:        12,
                letterSpacing:   "0.12em",
                textTransform:   "uppercase",
                fontWeight:      500,
                flexShrink:      0,
              }}
            >
              Upgrade to Tier 2 →
            </button>
          </div>
        </section>

        {/* ── Confidentiality notice ── */}
        <div style={{
          marginTop:    40,
          padding:      "14px 20px",
          borderLeft:   `3px solid ${C.gold}`,
          backgroundColor: "rgba(201,150,58,0.05)",
        }}>
          <p style={{
            fontSize:     11,
            color:        C.muted,
            lineHeight:   1.6,
            margin:       0,
            letterSpacing:"0.03em",
          }}>
            This roadmap is generated exclusively from self-reported assessment data and is intended
            for internal policy planning purposes only. SAPI Tier 1 recommendations are indicative.
            Tier 2–4 assessments incorporate primary research, in-country verification, and
            practitioner review.
          </p>
        </div>
      </main>
    </div>
  );
}

// ── Priority Card ─────────────────────────────────────────────────────────────
function PriorityCard({ card, rank }) {
  const band = card.band;
  return (
    <div style={{
      backgroundColor: C.navy,
      border:          `1px solid ${C.bronzeStr}`,
      padding:         "18px 20px",
      position:        "relative",
    }}>
      {/* Rank */}
      <div style={{
        position:        "absolute",
        top:             -1,
        right:           16,
        backgroundColor: C.gold,
        color:           C.void,
        fontSize:        10,
        fontFamily:      "Georgia, serif",
        letterSpacing:   "0.10em",
        padding:         "2px 8px",
      }}>
        #{rank}
      </div>

      {/* Dim badge + band */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <DimBadge code={card.dimCode} color={card.dimColor} />
        <BandPill band={band} />
      </div>

      {/* Title */}
      <p style={{
        fontFamily:    "Georgia, serif",
        fontSize:      13,
        color:         C.parchment,
        lineHeight:    1.55,
        margin:        0,
        marginBottom:  10,
        fontWeight:    500,
      }}>
        {card.title}
      </p>

      {/* Score arrow */}
      <ScoreArrow score={card.score} target={card.target} />
    </div>
  );
}

// ── Phase Column ──────────────────────────────────────────────────────────────
function PhaseColumn({ phase, accent, icon }) {
  return (
    <div style={{
      backgroundColor: C.navy,
      border:          `1px solid ${C.bronzeStr}`,
      borderTop:       `2px solid ${accent}`,
    }}>
      {/* Phase header */}
      <div style={{
        padding:      "18px 20px 16px",
        borderBottom: `1px solid ${C.bronze}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ color: accent, fontSize: 14 }}>{icon}</span>
          <span style={{
            fontFamily:    "Georgia, serif",
            fontSize:      12,
            letterSpacing: "0.12em",
            color:         C.parchment,
            textTransform: "uppercase",
          }}>
            {phase.label}
          </span>
        </div>
        <span style={{
          display:         "inline-block",
          backgroundColor: "rgba(0,0,0,0.3)",
          border:          `1px solid ${C.bronze}`,
          padding:         "2px 10px",
          fontSize:        10,
          letterSpacing:   "0.10em",
          color:           accent,
          textTransform:   "uppercase",
        }}>
          {phase.timeline}
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {phase.cards.map((card, i) => (
          <InterventionCard key={i} card={card} />
        ))}
      </div>
    </div>
  );
}

// ── Intervention Card ─────────────────────────────────────────────────────────
function InterventionCard({ card }) {
  return (
    <div style={{
      backgroundColor: C.midnight,
      border:          `1px solid ${C.bronze}`,
      padding:         "14px 16px",
    }}>
      {/* Dim badge + band */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <DimBadge code={card.dimCode} color={card.dimColor} />
        <BandPill band={card.band} />
      </div>

      {/* Title */}
      <p style={{
        fontFamily:    "Georgia, serif",
        fontSize:      12,
        color:         C.parchment,
        lineHeight:    1.55,
        margin:        0,
        marginBottom:  8,
        fontWeight:    500,
      }}>
        {card.title}
      </p>

      {/* Description */}
      <p style={{
        fontSize:     11,
        color:        C.muted,
        lineHeight:   1.65,
        margin:       0,
        marginBottom: 12,
        letterSpacing:"0.01em",
      }}>
        {card.desc}
      </p>

      {/* Score arrow */}
      <ScoreArrow score={card.score} target={card.target} />
    </div>
  );
}

// ── Dimension Badge ───────────────────────────────────────────────────────────
function DimBadge({ code, color }) {
  return (
    <span style={{
      display:         "inline-flex",
      alignItems:      "center",
      backgroundColor: `${color}22`,
      border:          `1px solid ${color}55`,
      color:           color,
      fontSize:        9,
      letterSpacing:   "0.12em",
      padding:         "2px 7px",
      textTransform:   "uppercase",
      fontFamily:      "system-ui, sans-serif",
    }}>
      {code}
    </span>
  );
}

// ── Band Pill ─────────────────────────────────────────────────────────────────
function BandPill({ band }) {
  const bc = bandColor(band);
  return (
    <span style={{
      display:         "inline-flex",
      alignItems:      "center",
      backgroundColor: `${bc}18`,
      border:          `1px solid ${bc}44`,
      color:           bc,
      fontSize:        9,
      letterSpacing:   "0.10em",
      padding:         "2px 7px",
      textTransform:   "uppercase",
    }}>
      {bandLabel(band)}
    </span>
  );
}

// ── Score Arrow ───────────────────────────────────────────────────────────────
function ScoreArrow({ score, target }) {
  return (
    <div style={{
      display:     "flex",
      alignItems:  "center",
      gap:         6,
      paddingTop:  4,
      borderTop:   `1px solid ${C.bronze}`,
    }}>
      <span style={{
        fontFamily: "Georgia, serif",
        fontSize:   13,
        color:      C.crimson,
      }}>
        {Math.round(score)}
      </span>
      <span style={{ color: C.muted, fontSize: 11 }}>→</span>
      <span style={{
        fontFamily: "Georgia, serif",
        fontSize:   13,
        color:      C.emerald,
      }}>
        {target}
      </span>
      <span style={{
        fontSize:      9,
        color:         C.muted,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginLeft:    2,
      }}>
        target
      </span>
    </div>
  );
}
