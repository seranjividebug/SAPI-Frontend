import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateRoadmap } from "../services/roadmapService";
import { getAssessmentResults } from "../services/assessmentService";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("sapi_current_user") || "{}");
  const email = currentUser.email || "";
  const firstLetter = email.charAt(0).toUpperCase() || "U";

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
  
  // Use sapi_score from API response if available, otherwise calculate from dimension scores
  const compositeScore = assessmentData?.sapi_score 
    ? Number(assessmentData.sapi_score)
    : (assessmentData ? (() => {
        const scores = [
          Number(assessmentData.compute_capacity) || 0,
          Number(assessmentData.capital_formation) || 0,
          Number(assessmentData.regulatory_readiness) || 0,
          Number(assessmentData.data_sovereignty) || 0,
          Number(assessmentData.directed_intelligence) || 0,
        ];
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;
      })() : 0);
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
    
    // Get scores for all dimensions from dimension_scorecard
    const scoreMap = {};
    const dimNameMap = {
      1: "Compute Capacity",
      2: "Capital Formation",
      3: "Regulatory Readiness",
      4: "Data Sovereignty",
      5: "Directed Intelligence Maturity"
    };
    if (roadmapData.dimension_scorecard) {
      roadmapData.dimension_scorecard.forEach(d => {
        const dimName = dimNameMap[d.dimension_id] || d.dimension_name;
        scoreMap[dimName] = Number(d.score) || 0;
      });
    }
    // Also add bottom3 scores as fallback
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
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center">
        <div className="font-sans text-[15px] text-sapi-muted tracking-[0.1em] mt-6">
          Generating your roadmap…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-sapi-void flex flex-col items-center justify-center p-10">
        <div className="font-serif text-[19px] text-sapi-crimson mt-6 mb-4">
          {error}
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-sapi-gold text-sapi-void border-none px-6 py-3 font-sans text-[13px] cursor-pointer rounded hover:opacity-90"
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
    <div className="min-h-screen bg-sapi-void text-sapi-parchment font-sans">

      {/* ── App Header ── */}
      <header className="border-b border-sapi-bronze bg-sapi-navy sticky top-0 z-[100]">
        <div className="max-w-container mx-auto px-8 py-1 pb-1 flex items-center gap-1">
          <img
            src="/SAPI_Logo_B4.svg"
            alt="SAPI Logo"
            className="h-28 w-28 object-contain"
          />
          <div className="font-serif text-[12px] font-normal tracking-extra-wide text-sapi-parchment uppercase leading-normal">
            The Sovereign AI<br />Power Index
          </div>
          <div className="ml-auto flex items-center gap-5">
            <span
              className="text-[10px] tracking-[0.15em] text-sapi-crimson uppercase border border-sapi-crimson px-2.5 py-0.5 opacity-85"
            >
              Classification: Restricted
            </span>
            <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 text-sapi-parchment focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-6 h-6 rounded-full bg-sapi-gold flex items-center justify-center text-sapi-void font-sans text-xs font-medium">
                {firstLetter}
              </div>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#0a0a12] border border-sapi-bronze rounded-md shadow-lg z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-sapi-parchment hover:bg-sapi-navy transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="max-w-[1100px] mx-auto px-8 py-12 pb-20">

        {/* ── Page header row ── */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          {/* Back + Title */}
          <div>
            <button
              onClick={() => navigate("/results")}
              className="flex items-center gap-1.5 bg-none border-none cursor-pointer text-sapi-muted text-[13px] tracking-[0.1em] uppercase p-0 mb-4 hover:text-sapi-gold transition-colors"
            >
              <span className="text-[15px]">←</span> Back to Results
            </button>
            <h1 className="font-serif text-[30px] font-medium tracking-[0.08em] text-sapi-parchment m-0 uppercase">
              Sovereign AI Roadmap
            </h1>
          </div>

          {/* Nation + Score badge */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[15px] text-sapi-muted tracking-[0.06em]">
              {country}
            </span>
            <div
              className="flex items-center gap-2.5 py-2 px-5"
              style={{ backgroundColor: C.midnight, border: `1px solid ${C.bronzeStr}` }}
            >
              <span className="font-sans text-[24px] text-sapi-paleGold font-medium">
                {Math.round(compositeScore)}
              </span>
              <span className="text-[12px] tracking-[0.12em] text-sapi-muted uppercase">
                SAPI Score
              </span>
            </div>
          </div>
        </div>

        {/* ── Intro line ── */}
        <p
          className="text-[15px] text-sapi-muted tracking-[0.04em] leading-[1.7] mb-12 max-w-[640px] border-l-2 border-sapi-bronze pl-4"
        >
          Your personalised roadmap is generated from the three lowest-scoring dimensions in your
          assessment. Interventions are ranked by impact on composite SAPI score.
        </p>

        {/* ── Priority Interventions Panel ── */}
        <section className="mt-16 mb-16">
          <div
            className="py-10 px-8"
            style={{ backgroundColor: C.midnight, border: `1px solid ${C.gold}`, borderLeft: `3px solid ${C.gold}` }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <span className="font-serif text-[13px] tracking-[0.16em] text-sapi-gold uppercase">
                Priority Interventions
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: C.bronzeStr }} />
              <span className="text-[12px] text-sapi-muted tracking-[0.1em]">
                Immediate action required
              </span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 pt-6">
              {priorityPanel.map((card, i) => (
                <PriorityCard key={i} card={card} rank={i + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Three-Column Phase Layout ── */}
        <section className="mt-16">
          <div className="font-serif text-[13px] tracking-[0.16em] text-sapi-muted uppercase mb-6">
            Full Intervention Programme
          </div>

          <div className="grid grid-cols-3 gap-5 items-start">
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
        {/* <section className="mt-16">
          <div
            className="py-8 px-10 flex items-center justify-between flex-wrap gap-6 bg-sapi-navy border border-sapi-bronze border-t-2 border-t-sapi-gold"
          >
            <div className="max-w-[560px]">
              <p className="font-serif text-[17px] text-sapi-parchment leading-[1.65] m-0 mb-2">
                Your roadmap identifies{" "}
                <span className="font-sans font-medium" style={{ color: C.paleGold }}>{totalInterventions} critical interventions</span>.
              </p>
              <p style={{
                fontSize:     14,
                color:        "white",
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
              className="bg-sapi-gold text-sapi-void border-none px-8 py-3.5 cursor-pointer font-sans text-[13px] tracking-[0.12em] uppercase font-medium flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              Upgrade to Tier 2 →
            </button>
          </div>
        </section> */}

        {/* ── Confidentiality notice ── */}
        <div className="mt-10 py-3.5 px-5 border-l-[3px] border-sapi-gold bg-sapi-gold/[0.05]">
          <p className="text-[13px] text-sapi-muted leading-[1.6] m-0 tracking-[0.03em]">
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
    <div
      className="py-5 px-5 relative"
      style={{ backgroundColor: C.navy, border: `1px solid ${C.bronzeStr}` }}
    >
      {/* Rank */}
      <div
        className="absolute top-1 right-4 font-serif text-[12px] tracking-[0.1em] px-3 py-1"
        style={{ backgroundColor: C.gold, color: C.void }}
      >
        #{rank}
      </div>

      {/* Dim badge + band */}
      <div className="flex items-center gap-3 mb-3">
        <DimBadge code={card.dimCode} color={card.dimColor} />
        <BandPill band={band} />
      </div>

      {/* Title */}
      <p className="font-serif text-[15px] text-sapi-parchment leading-[1.55] m-0 mb-2.5 font-medium">
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
    <div
      style={{ backgroundColor: C.navy, border: `1px solid ${C.bronzeStr}`, borderTop: `2px solid ${accent}` }}
    >
      {/* Phase header */}
      <div
        className="py-6 px-5 pb-4"
        style={{ borderBottom: `1px solid ${C.bronze}` }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span style={{ color: accent, fontSize: 16 }}>{icon}</span>
          <span className="font-serif text-[13px] tracking-[0.12em] text-sapi-parchment uppercase">
            {phase.label}
          </span>
        </div>
        <span
          className="inline-block px-2.5 py-0.5 text-[12px] tracking-[0.1em] uppercase"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", border: `1px solid ${C.bronze}`, color: accent }}
        >
          {phase.timeline}
        </span>
      </div>

      {/* Cards */}
      <div className="py-3 px-3 pb-4 flex flex-col gap-2.5">
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
    <div
      className="py-3.5 px-4"
      style={{ backgroundColor: C.midnight, border: `1px solid ${C.bronze}` }}
    >
      {/* Dim badge + band */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <DimBadge code={card.dimCode} color={card.dimColor} />
        <BandPill band={card.band} />
      </div>

      {/* Title */}
      <p className="font-serif text-[13px] text-sapi-parchment leading-[1.55] m-0 mb-2 font-medium">
        {card.title}
      </p>

      {/* Description */}
      <p className="text-[13px] text-sapi-muted leading-[1.65] m-0 mb-3 tracking-[0.01em]">
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
    <span
      className="inline-flex items-center text-[11px] tracking-[0.12em] uppercase px-1.5 py-0.5 font-sans"
      style={{ backgroundColor: `${color}22`, border: `1px solid ${color}55`, color }}
    >
      {code}
    </span>
  );
}

// ── Band Pill ─────────────────────────────────────────────────────────────────
function BandPill({ band }) {
  const bc = bandColor(band);
  return (
    <span
      className="inline-flex items-center text-[11px] tracking-[0.1em] uppercase px-1.5 py-0.5"
      style={{ backgroundColor: `${bc}18`, border: `1px solid ${bc}44`, color: bc }}
    >
      {bandLabel(band)}
    </span>
  );
}

// ── Score Arrow ───────────────────────────────────────────────────────────────
function ScoreArrow({ score, target }) {
  return (
    <div
      className="flex items-center gap-1.5 pt-1"
      style={{ borderTop: `1px solid ${C.bronze}` }}
    >
      <span className="font-sans text-[15px] text-sapi-crimson font-medium">
        {Math.round(score)}
      </span>
      <span className="text-[13px] text-sapi-muted">→</span>
      <span className="font-sans text-[15px] text-sapi-emerald font-medium">
        {target}
      </span>
      <span className="text-[11px] text-sapi-muted tracking-[0.08em] uppercase ml-0.5">
        target
      </span>
    </div>
  );
}
