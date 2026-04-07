import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/questionService";
import { PageLayout, PageHeader, PageFooter } from "../pages/common";

const ALL_QUESTIONS = [
  // DIMENSION 1 — COMPUTE CAPACITY
  {
    id: "Q1", dimIndex: 0, dimName: "Compute Capacity",
    text: "What is your organisation's primary AI compute infrastructure?",
    options: [
      { label: "We use public cloud (AWS, Azure, GCP) for all AI workloads", score: 25 },
      { label: "We use a mix of public cloud and on-premise GPU/TPU hardware", score: 50 },
      { label: "We operate dedicated on-premise AI compute (GPU clusters, HPC)", score: 75 },
      { label: "We operate sovereign/air-gapped compute for classified or regulated workloads", score: 95 },
      { label: "We have no dedicated AI compute infrastructure", score: 5 },
    ],
  },
  {
    id: "Q2", dimIndex: 0, dimName: "Compute Capacity",
    text: "What percentage of your AI workloads run on infrastructure located within your nation's borders?",
    options: [
      { label: "0–20%", score: 15 },
      { label: "21–50%", score: 40 },
      { label: "51–80%", score: 70 },
      { label: "81–100%", score: 95 },
    ],
  },
  {
    id: "Q3", dimIndex: 0, dimName: "Compute Capacity",
    text: "How resilient is your AI compute to energy disruption?",
    options: [
      { label: "No dedicated energy planning for AI workloads", score: 10 },
      { label: "Standard commercial energy contracts; no AI-specific provision", score: 35 },
      { label: "Dedicated energy supply agreements for data centre / AI operations", score: 65 },
      { label: "National grid allocation or renewable energy contracts dedicated to AI", score: 90 },
    ],
  },
  {
    id: "Q4", dimIndex: 0, dimName: "Compute Capacity",
    text: "How exposed is your AI hardware supply chain to foreign dependency?",
    options: [
      { label: "100% dependent on foreign-fabricated chips (no domestic supply chain visibility)", score: 10 },
      { label: "Foreign-fabricated but with diversified suppliers and strategic stockpiles", score: 30 },
      { label: "Some domestic assembly or packaging; fabrication remains foreign", score: 50 },
      { label: "Partial domestic fabrication capability or strategic alliance with fabricator", score: 75 },
      { label: "Sovereign fabrication or guaranteed allied-nation supply agreement", score: 95 },
    ],
  },
  {
    id: "Q5", dimIndex: 0, dimName: "Compute Capacity",
    text: "What is your total installed data centre capacity dedicated to or available for AI workloads?",
    options: [
      { label: "No dedicated data centre capacity", score: 5 },
      { label: "< 10 MW total capacity", score: 25 },
      { label: "10–50 MW", score: 50 },
      { label: "50–200 MW", score: 75 },
      { label: "> 200 MW", score: 95 },
    ],
  },

  // DIMENSION 2 — CAPITAL FORMATION
  {
    id: "Q6", dimIndex: 1, dimName: "Capital Formation",
    text: "What proportion of your government's total R&D budget is allocated to AI infrastructure and development?",
    options: [
      { label: "No dedicated AI budget line", score: 5 },
      { label: "< 1% of total R&D spend", score: 20 },
      { label: "1–3% of total R&D spend", score: 45 },
      { label: "3–5% of total R&D spend", score: 70 },
      { label: "> 5% of total R&D spend", score: 95 },
    ],
  },
  {
    id: "Q7", dimIndex: 1, dimName: "Capital Formation",
    text: "Does your nation have sovereign wealth fund or state-backed investment vehicles with explicit AI infrastructure mandates?",
    options: [
      { label: "No SWF or state-backed AI fund exists", score: 5 },
      { label: "SWF exists but with no AI-specific allocation", score: 25 },
      { label: "SWF exists with general technology allocation that includes AI", score: 55 },
      { label: "SWF has an explicit, published AI infrastructure allocation", score: 90 },
    ],
  },
  {
    id: "Q8", dimIndex: 1, dimName: "Capital Formation",
    text: "How would you characterise the AI venture capital ecosystem in your country?",
    options: [
      { label: "Minimal AI VC activity", score: 10 },
      { label: "Some AI VC deals but fragmented and below $500M total annually", score: 35 },
      { label: "Active AI VC ecosystem with $500M–$5B annually", score: 65 },
      { label: "Deep AI VC market with > $5B annually and domestic institutional LPs", score: 95 },
    ],
  },
  {
    id: "Q9", dimIndex: 1, dimName: "Capital Formation",
    text: "Do your national development finance institutions (DFIs) have AI infrastructure financing capability?",
    options: [
      { label: "No DFI involvement in AI financing", score: 5 },
      { label: "DFI finances general technology but not AI-specific infrastructure", score: 30 },
      { label: "DFI has financed AI-adjacent infrastructure in the past 3 years", score: 60 },
      { label: "DFI has a published AI infrastructure mandate with active pipeline", score: 90 },
    ],
  },
  {
    id: "Q10", dimIndex: 1, dimName: "Capital Formation",
    text: "What is the typical timeframe from government AI budget commitment to operational infrastructure delivery?",
    options: [
      { label: "> 36 months or unknown", score: 15 },
      { label: "24–36 months", score: 40 },
      { label: "12–24 months", score: 70 },
      { label: "< 12 months", score: 95 },
    ],
  },
  {
    id: "Q11", dimIndex: 1, dimName: "Capital Formation",
    text: "Does your government have committed multi-year (5–10 year) AI infrastructure funding beyond annual budget cycles?",
    options: [
      { label: "No multi-year AI funding commitment exists", score: 10 },
      { label: "Multi-year commitment exists in strategy documents but no legislative backing", score: 35 },
      { label: "Legislative or cabinet-level commitment to 3–5 year AI funding", score: 60 },
      { label: "5–10 year committed AI infrastructure funding with legislative backing", score: 95 },
    ],
  },

  // DIMENSION 3 — REGULATORY READINESS
  {
    id: "Q12", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Does your nation have a formal, published national AI strategy?",
    options: [
      { label: "No formal AI strategy", score: 5 },
      { label: "AI strategy published but with no measurable objectives or timelines", score: 30 },
      { label: "AI strategy published with objectives, timelines, and institutional ownership", score: 60 },
      { label: "AI strategy published, implemented, with public progress reporting", score: 90 },
    ],
  },
  {
    id: "Q13", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How clear is the legal framework for AI deployment in your jurisdiction?",
    options: [
      { label: "No AI-specific legislation or liability frameworks exist", score: 10 },
      { label: "General technology law applies; no AI-specific provisions", score: 30 },
      { label: "AI-specific legislation enacted covering liability and/or IP rules", score: 60 },
      { label: "Comprehensive AI legislation with liability, IP, and enforcement mechanisms", score: 90 },
    ],
  },
  {
    id: "Q14", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Can your national procurement system acquire AI systems efficiently?",
    options: [
      { label: "AI procurement follows standard IT procurement with no AI-specific provisions", score: 20 },
      { label: "Some AI procurement guidelines exist but are not widely adopted", score: 40 },
      { label: "AI-specific procurement frameworks with pre-approved vendor panels", score: 65 },
      { label: "Rapid AI procurement with sandbox, pilot-to-production, and oversight built in", score: 90 },
    ],
  },
  {
    id: "Q15", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Does your government have an AI ethics governance architecture?",
    options: [
      { label: "No AI ethics board or governance structure", score: 5 },
      { label: "Advisory AI ethics body exists but with no statutory authority", score: 30 },
      { label: "AI ethics board with statutory authority and published guidelines", score: 60 },
      { label: "AI ethics governance with mandatory impact assessments and algorithmic audit", score: 90 },
    ],
  },
  {
    id: "Q16", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "To what extent does your nation participate in international AI standards bodies?",
    options: [
      { label: "No formal participation in AI standards bodies", score: 5 },
      { label: "Formal membership but limited active participation", score: 25 },
      { label: "Active working group membership in ISO/IEC JTC 1/SC 42 or equivalent", score: 60 },
      { label: "Standards leadership: chairing working groups, contributing documents", score: 90 },
    ],
  },
  {
    id: "Q17", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How coordinated is AI regulation across your government departments?",
    options: [
      { label: "Fragmented: departments regulate AI independently with no coordination", score: 10 },
      { label: "Some coordination exists (working groups, informal channels)", score: 35 },
      { label: "Formal cross-ministry AI coordination body with published mandate", score: 65 },
      { label: "Centralised AI governance office with cross-departmental authority", score: 90 },
    ],
  },
  {
    id: "Q18", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "What proportion of your published national AI strategy commitments have been implemented?",
    options: [
      { label: "< 10% or no measurable milestones set", score: 10 },
      { label: "10–30% of commitments have measurable implementation", score: 30 },
      { label: "31–60% of commitments implemented with evidence", score: 60 },
      { label: "> 60% of commitments implemented with public reporting", score: 90 },
    ],
  },

  // DIMENSION 4 — DATA SOVEREIGNTY
  {
    id: "Q19", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Does your nation have enforceable data residency requirements for strategic and citizen data?",
    options: [
      { label: "No data localisation requirements", score: 10 },
      { label: "Data localisation laws exist but enforcement is limited", score: 35 },
      { label: "Data localisation with enforcement for strategic/government data", score: 65 },
      { label: "Comprehensive data residency framework with enforcement across public and private sectors", score: 90 },
    ],
  },
  {
    id: "Q20", dimIndex: 3, dimName: "Data Sovereignty",
    text: "What proportion of government cloud workloads run on sovereign or sovereignty-graded infrastructure?",
    options: [
      { label: "Most government cloud workloads on commercial foreign cloud", score: 15 },
      { label: "Some workloads on sovereign-graded cloud but majority on foreign", score: 40 },
      { label: "Majority of government cloud on sovereign/domestic infrastructure", score: 70 },
      { label: "All sensitive government workloads on sovereign cloud with air-gap capability", score: 95 },
    ],
  },
  {
    id: "Q21", dimIndex: 3, dimName: "Data Sovereignty",
    text: "How does your nation govern cross-border data transfers?",
    options: [
      { label: "No specific cross-border data transfer regulations", score: 10 },
      { label: "GDPR adequacy or bilateral agreement framework in place", score: 40 },
      { label: "Active cross-border data flow controls with enforcement for government data", score: 65 },
      { label: "Comprehensive framework: adequacy decisions, contractual clauses, and technical controls", score: 90 },
    ],
  },
  {
    id: "Q22", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Does your nation have classified or air-gapped computing environments for strategic AI workloads?",
    options: [
      { label: "No classified or air-gapped AI environments exist", score: 5 },
      { label: "Classified environments exist but not configured for AI workloads", score: 30 },
      { label: "Classified AI-ready environments with sovereign cloud regions", score: 65 },
      { label: "Full trusted operating environment with jurisdictional guarantees and AI integration", score: 90 },
    ],
  },
  {
    id: "Q23", dimIndex: 3, dimName: "Data Sovereignty",
    text: "How mature is your government's data governance capability?",
    options: [
      { label: "No formal data catalogue or quality management across government", score: 10 },
      { label: "Some departments have data governance; no whole-of-government framework", score: 35 },
      { label: "Whole-of-government data strategy with cataloguing and access controls", score: 65 },
      { label: "Mature data governance: real-time cataloguing, quality management, stewardship roles", score: 90 },
    ],
  },
  {
    id: "Q24", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Are AI models deployed in your country trained on or fine-tuned with domestically controlled data?",
    options: [
      { label: "Models are primarily pre-trained foreign models with no domestic fine-tuning", score: 10 },
      { label: "Some domestic fine-tuning but training data largely foreign-sourced", score: 35 },
      { label: "Significant domestic training data under sovereign control for key use cases", score: 65 },
      { label: "Sovereign AI training pipeline: domestic data collection, curation, and model training", score: 95 },
    ],
  },

  // DIMENSION 5 — DIRECTED INTELLIGENCE MATURITY
  {
    id: "Q25", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "To what extent are national AI deployments tied to explicit sovereign priorities?",
    options: [
      { label: "AI deployments are opportunistic with no link to national strategy", score: 10 },
      { label: "Some AI projects reference national priorities but most are ad hoc", score: 35 },
      { label: "AI deployments are systematically mapped to sovereign priority areas", score: 65 },
      { label: "Mission-first AI: sovereign priorities drive technology selection, not the reverse", score: 90 },
    ],
  },
  {
    id: "Q26", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "What percentage of your national AI initiatives have progressed beyond pilot stage to production deployment?",
    options: [
      { label: "< 5% or unknown", score: 10 },
      { label: "5–15%", score: 30 },
      { label: "16–30%", score: 60 },
      { label: "> 30%", score: 90 },
    ],
  },
  {
    id: "Q27", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "How effective is cross-departmental AI coordination in your government?",
    options: [
      { label: "No cross-departmental AI coordination exists", score: 5 },
      { label: "Informal coordination (working groups, shared Slack channels)", score: 30 },
      { label: "Formal coordination body with published mandate but limited authority", score: 55 },
      { label: "Systematic cross-government AI coordination with shared infrastructure and budgets", score: 90 },
    ],
  },
  {
    id: "Q28", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Can you attribute specific, documented outcomes to your AI deployments?",
    options: [
      { label: "No formal outcome measurement for AI deployments", score: 5 },
      { label: "Anecdotal outcomes reported but not systematically measured", score: 25 },
      { label: "Some AI deployments have documented, measured outcomes", score: 55 },
      { label: "Systematic outcome attribution: all production AI systems have documented, measured impact", score: 90 },
    ],
  },
  {
    id: "Q29", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Does your government have defined human-agent decision ratios and override mechanisms?",
    options: [
      { label: "No human-agent governance framework exists", score: 5 },
      { label: "General AI ethics principles but no operational human-agent rules", score: 25 },
      { label: "Human-agent decision policies defined for some departments", score: 55 },
      { label: "Comprehensive framework: human-agent ratios, override mechanisms, and accountability per department", score: 90 },
    ],
  },
  {
    id: "Q30", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Have your AI programmes survived at least one leadership change, budget cycle, or political transition?",
    options: [
      { label: "AI programmes are too new to have faced a transition", score: 20 },
      { label: "AI programmes exist but have been disrupted by leadership or budget changes", score: 30 },
      { label: "Core AI programmes survived one transition with some continuity", score: 60 },
      { label: "AI programmes have institutional durability: survived multiple transitions with documented continuity", score: 90 },
    ],
  },
];

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",             shortCode: "D1", weight: "17.5%" },
  { name: "Capital Formation",            shortCode: "D2", weight: "22.5%" },
  { name: "Regulatory Readiness",         shortCode: "D3", weight: "17.5%" },
  { name: "Data Sovereignty",             shortCode: "D4", weight: "12.5%" },
  { name: "Directed Intelligence Maturity", shortCode: "D5", weight: "27.5%" },
];

// ── Scoring engine ────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const dimScore = (answers, questionIds) => {
  const scores = questionIds.map(id => answers[id] || 0);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

// eslint-disable-next-line no-unused-vars
const compositeScore = (d1, d2, d3, d4, d5) =>
  Math.pow(d1, 0.175) * Math.pow(d2, 0.225) * Math.pow(d3, 0.175) * Math.pow(d4, 0.125) * Math.pow(d5, 0.275);

// eslint-disable-next-line no-unused-vars
const getTier = (score) => {
  if (score >= 80) return { label: "Sovereign AI Leader",      color: "#28A868" };
  if (score >= 60) return { label: "Advanced",                 color: "#4A7AE0" };
  if (score >= 40) return { label: "Developing",               color: "#F0C050" };
  if (score >= 20) return { label: "Nascent",                  color: "#C9963A" };
  return               { label: "Pre-conditions Unmet",        color: "#C03058" };
};

// ── Helper: transform API questions to component format ──────────────────────
const transformApiQuestions = (apiData) => {
  const transformed = [];
  
  apiData.forEach((dimension) => {
    dimension.questions.forEach((q) => {
      transformed.push({
        id: `Q${q.id}`,
        dimIndex: dimension.dimension_id - 1, // API uses 1-based, component uses 0-based
        dimName: dimension.dimension_name,
        text: q.question_text,
        options: q.options.map((opt) => ({
          label: opt.text,
          score: opt.score,
        })),
      });
    });
  });
  
  return transformed;
};

// ── Helper: get questions for a dimension index ──────────────────────────────
const getDimQuestions = (dimIndex, allQuestions) =>
  allQuestions.filter(q => q.dimIndex === dimIndex);

// ── Overall progress tracking ────────────────────────────────────────────────
const getQuestionsBeforeDim = (dimIndex, allQuestions) =>
  allQuestions.filter(q => q.dimIndex < dimIndex).length;

// ── Dual Progress Bar ────────────────────────────────────────────────────────
function DualProgressBar({ dimIndex, questionIndexInDim, totalInDim, questionsBeforeDim }) {
  const dimPct        = ((questionIndexInDim + 1) / totalInDim) * 100;
  const overallPct    = ((questionsBeforeDim + questionIndexInDim + 1) / 30) * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Dimension progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-sans text-[10px] tracking-wide uppercase text-sapi-muted opacity-70 ml-3">
            Dimension Progress
          </span>
          <span className="font-sans text-[10px] tracking-wide text-sapi-gold">
            {questionIndexInDim + 1} / {totalInDim}
          </span>
        </div>
        <div className="h-0.5 bg-sapi-bronze/20 rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-350"
            style={{
              width: `${dimPct}%`,
              background: 'linear-gradient(90deg, #C9963A 0%, #EDD98A 100%)',
            }}
          />
        </div>
      </div>
      {/* Overall progress */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="font-sans text-[10px] tracking-wide uppercase text-sapi-muted opacity-70 pl-3">
            Overall Assessment
          </span>
          <span className="font-sans text-[10px] tracking-wide text-sapi-muted">
            {questionsBeforeDim + questionIndexInDim + 1} / 30
          </span>
        </div>
        <div className="h-0.5 bg-sapi-bronze/15 rounded-sm overflow-hidden">
          <div
            className="h-full bg-sapi-gold/35 rounded-sm transition-all duration-350"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── 5-segment dimension stepper ───────────────────────────────────────────────
function DimensionStepper({ currentDimIndex }) {
  return (
    <div className="flex gap-1.5 items-center">
      {DIMENSIONS.map((dim, i) => {
        const isComplete = i < currentDimIndex;
        const isCurrent  = i === currentDimIndex;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className={`h-1 w-full rounded-sm transition-all duration-200 ${
              isComplete ? 'bg-sapi-gold' : isCurrent ? 'bg-transparent border border-sapi-gold' : 'bg-sapi-bronze/20'
            }`} />
            <span className={`font-sans text-[9px] tracking-wide uppercase whitespace-nowrap ${
              isComplete ? 'text-sapi-gold opacity-80' : isCurrent ? 'text-sapi-paleGold' : 'text-sapi-muted opacity-40'
            }`}>
              {dim.shortCode}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Answer Option Card ────────────────────────────────────────────────────────
function AnswerCard({ label, optIndex, isSelected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex items-start gap-3.5 py-3.5 px-5 rounded-sm cursor-pointer select-none transition-all duration-150 ${
        isSelected
          ? 'bg-sapi-gold/9 border border-sapi-gold/45 border-l-[3px] border-l-sapi-gold'
          : hovered
          ? 'bg-sapi-gold/4 border border-sapi-bronze/40 border-l-[3px] border-l-sapi-gold/30'
          : 'bg-sapi-midnight border border-sapi-bronze border-l-[3px] border-l-transparent'
      }`}
    >
      {/* Letter indicator */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-sm flex items-center justify-center mt-0.5 transition-all duration-150 ${
        isSelected
          ? 'bg-sapi-gold border border-sapi-gold'
          : 'bg-sapi-bronze/20 border border-sapi-bronze/35'
      }`}>
        <span className={`font-sans text-[10px] font-medium tracking-wide leading-none ${
          isSelected ? 'text-sapi-void' : 'text-sapi-muted'
        }`}>
          {letters[optIndex]}
        </span>
      </div>

      {/* Answer text */}
      <span className={`font-sans text-sm leading-snug pt-0.5 transition-colors duration-150 flex-1 ${
        isSelected ? 'text-sapi-parchment' : hovered ? 'text-sapi-parchment' : 'text-sapi-parchment/80'
      }`}>
        {label}
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <div className="flex-shrink-0 mt-1 ml-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="#C9963A" strokeWidth="1" />
            <path d="M4 7L6.2 9.2L10 5" stroke="#C9963A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────
export default function SAPIQuiz({ appState, setCurrentPage, setAppState }) {
  const navigate = useNavigate();
  
  // ── Route protection state ───────────────────────────────────────────────────
  const [checkingAccess, setCheckingAccess] = useState(true);
  
  // State for questions - start with hardcoded for immediate display, then merge API data
  const [allQuestions, setAllQuestions] = useState(ALL_QUESTIONS.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedScore, setSelectedScore] = useState(null);
  const [nextHover, setNextHover]   = useState(false);
  const [backHover, setBackHover]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Local ref to accumulate all answers across dimensions
  const answersRef = useRef(appState?.answers || {});

  // Get current dimension from props or default to 0 - MUST be before useEffect that uses dimQuestions
  const dimIndex = appState?.currentDimension ?? 0;
  const dimQuestions = getDimQuestions(dimIndex, allQuestions);
  
  // ── Route protection check ───────────────────────────────────────────────────
  useEffect(() => {
    const previewCompleted = localStorage.getItem('sapi_preview_completed');
    if (!previewCompleted) {
      navigate('/preview', { replace: true });
    } else {
      setCheckingAccess(false);
    }
  }, [navigate]);

  // Fetch questions from API in the background
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetchQuestions();
        if (response.success && response.data) {
          // Transform API data to match component structure
          const transformed = transformApiQuestions(response.data);
          
          // Merge with hardcoded questions - API data takes precedence
          const mergedQuestions = ALL_QUESTIONS.map((q, idx) => {
            const apiQ = transformed.find(tq => tq.id === q.id);
            return apiQ || q;
          });
          setAllQuestions(mergedQuestions);
        } else {
          // Keep using hardcoded questions
          setAllQuestions(ALL_QUESTIONS);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(err.message);
        // Fallback to all hardcoded questions
        setAllQuestions(ALL_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };
    
    // Load immediately but in background
    loadQuestions();
  }, []);

  // Load persisted answers from localStorage on mount
  useEffect(() => {
    const storedAnswers = localStorage.getItem('sapi_answers');
    if (storedAnswers) {
      try {
        answersRef.current = JSON.parse(storedAnswers);
      } catch (e) {
        console.error('Failed to parse stored answers:', e);
      }
    }
  }, []);

  // Load previously selected answer when question changes
  useEffect(() => {
    const currentQuestion = dimQuestions[qIndex];
    if (currentQuestion) {
      const savedAnswer = answersRef.current[currentQuestion.id];
      if (savedAnswer) {
        setSelectedScore(savedAnswer.score);
      } else {
        setSelectedScore(null);
      }
    }
  }, [qIndex, dimQuestions]);

  // Save answers to localStorage whenever they change
  const saveAnswer = (newAnswer) => {
    answersRef.current = { ...answersRef.current, ...newAnswer };
    localStorage.setItem('sapi_answers', JSON.stringify(answersRef.current));
    // Also update parent state
    if (setAppState) {
      setAppState({ answers: answersRef.current });
    }
  };

  // Show loading while checking access
  if (checkingAccess) {
    return (
      <PageLayout>
        <PageHeader showAdmin={false} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-sans text-sm text-sapi-muted tracking-wide mt-6">
            Loading...
          </div>
        </div>
        <PageFooter />
      </PageLayout>
    );
  }

  // Derived values (dimIndex and dimQuestions already declared above)
  const currentQuestion = dimQuestions[qIndex];
  const isLastInDim = qIndex === dimQuestions.length - 1;
  const isLastDimension = dimIndex === 4;
  const answeredCount = 0; // Mock data

  function handleSelect(score, optionIndex) {
    setSelectedScore(score);
    // Store answer with question ID, selected option letter, and score
    const currentQ = dimQuestions[qIndex];
    const optionLetter = ['a', 'b', 'c', 'd', 'e'][optionIndex] || 'a';
    const newAnswer = {
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: optionLetter,
        score: score,
        dimIndex: dimIndex
      }
    };
    // Save to localStorage and update state
    saveAnswer(newAnswer);
  }

  function handleBack() {
    if (qIndex > 0) {
      setQIndex(qIndex - 1);
    } else {
      navigate('/dimintro');
    }
  }

  async function handleNext() {
    if (selectedScore == null) return;

    if (!isLastInDim) {
      setQIndex(qIndex + 1);
      setSelectedScore(null); // Reset selection for next question
    } else if (!isLastDimension) {
      // Advance to next dimension intro
      if (setCurrentPage) {
        setCurrentPage('dimIntro');
      } else {
        navigate('/dimintro');
      }
    } else {
      // Last question of last dimension - submit and go to calculating
      if (setCurrentPage) {
        // Show loader while API call is in progress
        setSubmitting(true);
        // Get all answers from local ref (guaranteed to be up-to-date)
        const allAnswers = answersRef.current;
        await setCurrentPage('calculating', allAnswers);
        // Navigation will happen, no need to setSubmitting(false)
      } else {
        navigate('/calculating');
      }
    }
  }

  // Overall progress numbers
  const questionsBeforeDim = getQuestionsBeforeDim(dimIndex, allQuestions.length > 0 ? allQuestions : ALL_QUESTIONS);
  const globalQNum         = questionsBeforeDim + qIndex + 1;
  const dim                = DIMENSIONS[dimIndex];

  // Next button label
  const nextLabel = !isLastInDim
    ? "Next Question"
    : isLastDimension
      ? "Complete Assessment"
      : `Continue to ${DIMENSIONS[dimIndex + 1]?.name}`;

  // Show loading state while fetching questions
  if (loading && allQuestions.length === 0) {
    return (
      <PageLayout>
        <PageHeader showAdmin={false} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-sans text-sm text-sapi-muted tracking-wide mt-6">
            Loading assessment questions…
          </div>
        </div>
        <PageFooter />
      </PageLayout>
    );
  }

  // Show error state if API failed and we have no questions
  if (error && allQuestions.length === 0) {
    return (
      <PageLayout>
        <PageHeader showAdmin={false} />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="font-serif text-lg text-sapi-crimson mt-6 mb-4">
            Unable to load questions
          </div>
          <div className="font-sans text-sm text-sapi-muted mb-6 text-center">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-sapi-gold text-sapi-void border-none px-8 py-3 font-sans text-xs tracking-extra-wide uppercase cursor-pointer rounded-sm"
          >
            Retry
          </button>
        </div>
        <PageFooter />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader showAdmin={false} />

      {/* Submitting loader overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-sapi-void/85 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <div className="font-sans text-sm text-sapi-paleGold tracking-wide mt-6">
            Submitting assessment…
          </div>
        </div>
      )}

      {/* ── Compact header ── */}
      <div className="max-w-container mx-auto px-8 py-5">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-sapi-bronze pb-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-[13px] text-sapi-gold tracking-wide">
              The Sovereign AI Power Index
            </span>
            <span className="font-sans text-[10px] text-sapi-muted tracking-wide opacity-65">
              Tier 1 Assessment · {30 - globalQNum} questions remaining
            </span>
          </div>

          {/* Q counter pill */}
          <div className="flex items-center gap-2 bg-sapi-gold/8 border border-sapi-gold/20 rounded-full px-3 py-1">
            <span className="font-sans text-[11px] text-sapi-muted tracking-wide">Q</span>
            <span className="font-serif text-base text-sapi-paleGold leading-none">{globalQNum}</span>
            <span className="font-sans text-[10px] text-sapi-muted opacity-50">/ 30</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-8 pb-16">

        {/* ── Progress & context bar ── */}
        <div className="bg-sapi-navy border border-sapi-bronze rounded-sm p-4.5 mb-7 mt-2 px-5">
          {/* Dimension label row */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm text-sapi-gold tracking-wide mt-2">{dim.shortCode}</span>
              <div className="w-px h-3 bg-sapi-gold/30" />
              <span className="font-sans text-[11px] tracking-wide uppercase text-sapi-parchment/85 ml-1 mt-2">
                {dim.name}
              </span>
            </div>
            <span className="font-sans text-[10px] tracking-wide text-sapi-muted/65 mt-2">
              Dimension {dimIndex + 1} of 5 · Question {qIndex + 1} of {dimQuestions.length}
            </span>
          </div>

          {/* Dimension stepper */}
          <div className="mb-4">
            <DimensionStepper currentDimIndex={dimIndex} />
          </div>

          {/* Dual progress bar */}
          <DualProgressBar
            dimIndex={dimIndex}
            questionIndexInDim={qIndex}
            totalInDim={dimQuestions.length}
            questionsBeforeDim={getQuestionsBeforeDim(dimIndex, allQuestions.length > 0 ? allQuestions : ALL_QUESTIONS)}
          />
        </div>

        {/* ── Question card ── */}
        <div className="bg-sapi-navy border border-sapi-bronze rounded-sm p-7 pb-6 mb-5">
          {/* Question number */}
          <div className="flex items-center gap-2.5 mb-5">
            <span className="font-sans text-[10px] tracking-super-wide uppercase text-sapi-gold/75">
              Question {globalQNum}
            </span>
            <div className="flex-1 h-px bg-sapi-gold/15" />
            <span className="font-sans text-[9px] tracking-wide text-sapi-muted/50">
              {answeredCount} / {dimQuestions.length} answered in this dimension
            </span>
          </div>

          {/* Question text */}
          <p className="font-serif text-[17px] text-sapi-parchment leading-relaxed tracking-wide mb-7">
            {currentQuestion?.text}
          </p>

          {/* Answer cards */}
          <div className="flex flex-col gap-2">
            {currentQuestion?.options?.map((opt, i) => (
              <AnswerCard
                key={i}
                label={opt.label}
                optIndex={i}
                isSelected={selectedScore === opt.score}
                onSelect={() => handleSelect(opt.score, i)}
              />
            ))}
          </div>
        </div>

        {/* ── Selection required notice ── */}
        {selectedScore == null && (
          <div className="flex items-center gap-2 mb-5 opacity-55">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#9880B0" strokeWidth="1" />
              <path d="M6 3.5V6" stroke="#9880B0" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="6" cy="8.2" r="0.6" fill="#9880B0" />
            </svg>
            <span className="font-sans text-[11px] text-sapi-muted tracking-wide">
              Select an option to proceed
            </span>
          </div>
        )}

        {/* ── Navigation buttons ── */}
        <div className="flex flex-col gap-2.5">
          <button
            disabled={selectedScore == null || submitting}
            onMouseEnter={() => setNextHover(true)}
            onMouseLeave={() => setNextHover(false)}
            onClick={handleNext}
            className={`w-full px-12 py-4 font-sans text-xs tracking-extra-wide uppercase font-medium rounded-sm transition-all duration-150 flex items-center justify-center gap-2.5 ${
              selectedScore == null
                ? 'bg-sapi-gold/15 text-sapi-gold/40 border border-sapi-gold/20 cursor-not-allowed'
                : nextHover
                ? 'bg-[#B8862A] text-sapi-void'
                : 'bg-sapi-gold text-sapi-void'
            }`}
          >
            {nextLabel}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M4.5 2.5L9 6.5L4.5 10.5"
                stroke={selectedScore == null ? "rgba(201,150,58,0.35)" : "#06030E"}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
            onClick={handleBack}
            className={`w-full px-12 py-3.5 font-sans text-xs tracking-extra-wide uppercase font-normal rounded-sm transition-colors duration-150 border ${
              backHover ? 'text-sapi-parchment border-sapi-bronze/60' : 'text-sapi-muted border-sapi-bronze'
            }`}
          >
            ← Back
          </button>
        </div>
      </main>

      <PageFooter />
    </PageLayout>
  );
}

// ── Demo wrapper ──────────────────────────────────────────────────────────────
export function SAPIQuizDemo() {
  const [appState, setAppState] = useState({
    currentDimension: 0,
    answers:          {},
    scores:           {},
    compositeScore:   null,
    tier:             null,
  });
  const [currentPage, setCurrentPage] = useState("quiz");

  function mockSetPage(page) {
    // In demo, if we navigate to dimIntro after last dim, show a complete message
    if (page === "calculating") {
      alert(
        `Assessment complete!\nComposite SAPI Score: ${appState.compositeScore?.toFixed(1)}\nTier: ${appState.tier?.label}`
      );
      return;
    }
    if (page === "dimIntro") {
      // Remount quiz for next dimension by toggling page
      setCurrentPage("dimIntro_stub");
      setTimeout(() => setCurrentPage("quiz"), 50);
    }
  }

  if (currentPage === "dimIntro_stub") {
    return (
      <div className="bg-sapi-void min-h-screen flex items-center justify-center">
        <div className="text-sapi-parchment font-sans">Loading next dimension…</div>
      </div>
    );
  }

  return (
    <SAPIQuiz
      appState={appState}
      setAppState={setAppState}
      setCurrentPage={mockSetPage}
    />
  );
}
