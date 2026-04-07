import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/questionService";
import { PageLayout, PageHeader, PageFooter } from "./common";

// ── Complete question data ────────────────────────────────────────────────────
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
      { label: "No AI-specific legislation or guidance", score: 5 },
      { label: "Draft guidance or voluntary principles only", score: 25 },
      { label: "Published regulator guidance but no primary legislation", score: 50 },
      { label: "Comprehensive AI legislation in force with enforcement mechanisms", score: 90 },
    ],
  },
  {
    id: "Q14", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Does your national AI strategy include measurable, time-bound targets for sovereign compute capacity?",
    options: [
      { label: "No targets for sovereign compute capacity", score: 10 },
      { label: "Aspirational targets without time-bound commitments", score: 30 },
      { label: "Time-bound targets in strategy but no disclosed budget", score: 55 },
      { label: "Time-bound targets with disclosed budget and institutional owner", score: 90 },
    ],
  },
  {
    id: "Q15", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Is there a dedicated national AI oversight body or agency?",
    options: [
      { label: "No dedicated AI oversight body", score: 10 },
      { label: "AI oversight handled by existing digital/tech ministry without dedicated unit", score: 35 },
      { label: "Dedicated AI unit within a ministry or regulator", score: 60 },
      { label: "Standalone national AI agency with statutory authority", score: 95 },
    ],
  },
  {
    id: "Q16", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "How mature is your national data protection regime?",
    options: [
      { label: "No comprehensive data protection law", score: 5 },
      { label: "Data protection law exists but limited enforcement capacity", score: 30 },
      { label: "Active data protection authority with enforcement precedent", score: 60 },
      { label: "Comprehensive regime with sector-specific AI data rules", score: 90 },
    ],
  },
  {
    id: "Q17", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Does your government have published AI procurement guidelines for public bodies?",
    options: [
      { label: "No AI procurement guidelines", score: 10 },
      { label: "General technology procurement guidelines that mention AI", score: 35 },
      { label: "Draft AI procurement guidelines in consultation", score: 60 },
      { label: "Mandatory AI procurement standards in force", score: 95 },
    ],
  },
  {
    id: "Q18", dimIndex: 2, dimName: "Regulatory Readiness",
    text: "Is your national AI strategy aligned with international frameworks (OECD, UNESCO, EU AI Act)?",
    options: [
      { label: "No mention of international alignment", score: 10 },
      { label: "General statement of support for international principles", score: 35 },
      { label: "Explicit alignment with specific international frameworks", score: 60 },
      { label: "Active participation in multilateral AI governance initiatives", score: 90 },
    ],
  },

  // DIMENSION 4 — DATA SOVEREIGNTY
  {
    id: "Q19", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Does your jurisdiction have data localisation requirements for sensitive or classified data?",
    options: [
      { label: "No data localisation requirements", score: 10 },
      { label: "Sector-specific localisation (e.g., healthcare, finance)", score: 40 },
      { label: "Government/classified data must be kept in-country", score: 70 },
      { label: "Comprehensive localisation for all sensitive categories", score: 95 },
    ],
  },
  {
    id: "Q20", dimIndex: 3, dimName: "Data Sovereignty",
    text: "What percentage of your government's critical digital infrastructure runs on servers physically located within your national borders?",
    options: [
      { label: "< 25%", score: 10 },
      { label: "25–50%", score: 35 },
      { label: "50–75%", score: 65 },
      { label: "> 75%", score: 90 },
    ],
  },
  {
    id: "Q21", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Does your nation operate a sovereign public cloud or government cloud platform?",
    options: [
      { label: "No sovereign cloud platform", score: 5 },
      { label: "Planning or procurement phase for sovereign cloud", score: 30 },
      { label: "Operational sovereign cloud for non-classified workloads", score: 65 },
      { label: "Mature sovereign cloud handling classified and unclassified workloads", score: 95 },
    ],
  },
  {
    id: "Q22", dimIndex: 3, dimName: "Data Sovereignty",
    text: "How does your jurisdiction regulate cross-border data transfers?",
    options: [
      { label: "No specific restrictions on cross-border transfers", score: 10 },
      { label: "Case-by-case restrictions for specific categories", score: 40 },
      { label: "Broad transfer restrictions with adequacy decisions for trusted jurisdictions", score: 70 },
      { label: "Comprehensive framework with domestic processing preference", score: 90 },
    ],
  },
  {
    id: "Q23", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Are there mandatory national data residency requirements for AI training datasets used in public-sector AI systems?",
    options: [
      { label: "No requirements for AI training data residency", score: 10 },
      { label: "General guidance encouraging domestic storage", score: 30 },
      { label: "Mandatory for specific high-risk applications", score: 60 },
      { label: "Comprehensive residency requirements for all public-sector AI datasets", score: 95 },
    ],
  },
  {
    id: "Q24", dimIndex: 3, dimName: "Data Sovereignty",
    text: "Does your government maintain a strategic data reserve or national data assets inventory?",
    options: [
      { label: "No strategic data reserve or inventory", score: 5 },
      { label: "Ad-hoc inventories in specific ministries", score: 30 },
      { label: "National data inventory with strategic value classification", score: 60 },
      { label: "Comprehensive national data strategy with sovereign control mandates", score: 95 },
    ],
  },

  // DIMENSION 5 — DIRECTED INTELLIGENCE MATURITY
  {
    id: "Q25", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Has your government deployed AI systems in operational public services (not pilots)?",
    options: [
      { label: "No operational AI deployments in government", score: 5 },
      { label: "Limited pilots, no operational deployments", score: 25 },
      { label: "Some operational deployments in specific ministries", score: 55 },
      { label: "Widespread operational AI across government services", score: 90 },
    ],
  },
  {
    id: "Q26", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Does your government have AI literacy and capability building programmes for civil servants?",
    options: [
      { label: "No AI literacy programmes", score: 10 },
      { label: "Ad-hoc training or external courses", score: 35 },
      { label: "Structured AI training in civil service curriculum", score: 65 },
      { label: "Mandatory AI literacy for senior civil servants and policymakers", score: 95 },
    ],
  },
  {
    id: "Q27", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Is there a central coordinating body for AI deployment across government departments?",
    options: [
      { label: "No central AI coordination", score: 10 },
      { label: "Informal coordination through existing digital unit", score: 35 },
      { label: "Central AI office with coordination mandate", score: 65 },
      { label: "Central AI authority with deployment authority and budget", score: 95 },
    ],
  },
  {
    id: "Q28", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Has your national security or defence establishment established an AI capability?",
    options: [
      { label: "No dedicated AI capability in security/defence", score: 5 },
      { label: "Research or analysis cells exploring AI applications", score: 30 },
      { label: "Operational AI cells in intelligence or defence", score: 60 },
      { label: "Comprehensive AI capability across defence and intelligence", score: 95 },
    ],
  },
  {
    id: "Q29", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "How would you assess coherence between your national AI strategy and implementation reality?",
    options: [
      { label: "Significant gap between strategy and implementation", score: 15 },
      { label: "Partial implementation of strategic objectives", score: 40 },
      { label: "Good alignment with documented progress", score: 70 },
      { label: "Strong alignment with continuous monitoring and adaptation", score: 95 },
    ],
  },
  {
    id: "Q30", dimIndex: 4, dimName: "Directed Intelligence Maturity",
    text: "Does your government offer citizen-facing AI services (e.g., AI-powered chatbots, virtual assistants, predictive services)?",
    options: [
      { label: "No citizen-facing AI services", score: 10 },
      { label: "Limited pilots or experimental services", score: 35 },
      { label: "Operational services in specific domains", score: 65 },
      { label: "Comprehensive citizen AI services across major government functions", score: 95 },
    ],
  },
];

// ── Dimension metadata ──────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",               shortCode: "D1", weight: 0.175 },
  { name: "Capital Formation",              shortCode: "D2", weight: 0.225 },
  { name: "Regulatory Readiness",           shortCode: "D3", weight: 0.175 },
  { name: "Data Sovereignty",               shortCode: "D4", weight: 0.125 },
  { name: "Directed Intelligence Maturity", shortCode: "D5", weight: 0.275 },
];

// ── Helper: count questions before a dimension ─────────────────────────────
function getQuestionsBeforeDim(dimIndex, allQ) {
  let count = 0;
  for (let i = 0; i < dimIndex; i++) {
    count += allQ.filter(q => q.dimIndex === i).length;
  }
  return count;
}

// ── Dimension stepper (top) ─────────────────────────────────────────────────
function DimensionStepper({ currentDimIndex }) {
  return (
    <div className="flex gap-2">
      {DIMENSIONS.map((dim, i) => {
        const isActive = i === currentDimIndex;
        const isPast = i < currentDimIndex;
        return (
          <div
            key={dim.shortCode}
            className={`flex-1 h-1.5 rounded-sm transition-all duration-300 ${
              isActive ? 'bg-sapi-gold shadow-[0_0_6px_rgba(201,150,58,0.6)]' : isPast ? 'bg-sapi-gold/60' : 'bg-sapi-bronze/50'
            }`}
          />
        );
      })}
    </div>
  );
}

// ── Dual progress bar (composite + dimension) ───────────────────────────────
function DualProgressBar({ dimIndex, questionIndexInDim, totalInDim, questionsBeforeDim }) {
  const globalIndex = questionsBeforeDim + questionIndexInDim + 1;
  const globalTotal = 30;
  const globalPct = (globalIndex / globalTotal) * 100;
  const dimPct = ((questionIndexInDim + 1) / totalInDim) * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Global composite progress */}
      <div className="relative">
        <div className="flex justify-between text-[10px] tracking-wide text-sapi-muted mb-1.5">
          <span>Overall Progress</span>
          <span>{Math.round(globalPct)}%</span>
        </div>
        <div className="h-1 bg-sapi-bronze/30 rounded-sm overflow-hidden">
          <div
            className="h-full bg-sapi-gold/60 rounded-sm transition-all duration-500"
            style={{ width: `${globalPct}%` }}
          />
        </div>
      </div>
      {/* Dimension progress */}
      <div className="relative">
        <div className="flex justify-between text-[10px] tracking-wide text-sapi-gold mb-1.5">
          <span>This Dimension</span>
          <span>{Math.round(dimPct)}%</span>
        </div>
        <div className="h-1 bg-sapi-bronze/30 rounded-sm overflow-hidden">
          <div
            className="h-full bg-sapi-gold rounded-sm transition-all duration-500 shadow-[0_0_6px_rgba(201,150,58,0.4)]"
            style={{ width: `${dimPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Answer card ─────────────────────────────────────────────────────────────
function AnswerCard({ label, optIndex, isSelected, onSelect }) {
  const [hover, setHover] = useState(false);
  const letters = ["A", "B", "C", "D", "E"];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`w-full text-left border rounded-sm p-4 transition-all duration-150 cursor-pointer flex items-start gap-3 ${
        isSelected
          ? 'bg-sapi-gold/10 border-sapi-gold shadow-[0_0_12px_rgba(201,150,58,0.25)]'
          : hover
          ? 'bg-sapi-navy border-sapi-bronze/60'
          : 'bg-sapi-navy border-sapi-bronze'
      }`}
    >
      <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center font-sans text-xs font-medium transition-colors duration-150 ${
        isSelected
          ? 'bg-sapi-gold text-sapi-void border-sapi-gold'
          : hover
          ? 'bg-sapi-gold/10 text-sapi-gold border-sapi-gold/60'
          : 'bg-transparent text-sapi-muted border-sapi-bronze'
      }`}>
        {letters[optIndex] || optIndex + 1}
      </span>
      <span className={`font-sans text-sm leading-snug pt-0.5 ${
        isSelected ? 'text-sapi-parchment' : 'text-sapi-muted'
      }`}>
        {label}
      </span>
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function QuizPage({ appState, setAppState, setCurrentPage }) {
  const navigate = useNavigate();
  const didFetch = useRef(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [allQuestions, setAllQuestions] = useState(ALL_QUESTIONS);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedOptIndex, setSelectedOptIndex] = useState(null);
  const [nextHover, setNextHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  // ── Route protection ───────────────────────────────────────────────────────
  useEffect(() => {
    const previewCompleted = localStorage.getItem('sapi_preview_completed');
    if (!previewCompleted) {
      navigate('/preview', { replace: true });
    } else {
      setCheckingAccess(false);
    }
  }, [navigate]);

  // ── Fetch questions ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchQuestions().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setAllQuestions(data);
      }
    }).catch(() => {});
  }, []);

  // Calculate derived values
  const { currentDimension = 0, answers = {} } = appState || {};
  const dim = DIMENSIONS[currentDimension] || DIMENSIONS[0];
  const dimQuestions = allQuestions.filter(q => q.dimIndex === currentDimension);
  const currentQuestionIndex = answers[currentDimension]?.currentQuestionIndex || 0;
  const currentQuestion = dimQuestions[currentQuestionIndex] || dimQuestions[0];
  const answeredCount = Object.keys(answers[currentDimension] || {}).filter(k => k !== "currentQuestionIndex").length;

  // ── Load saved answer for current question ────────────────────────────────────
  useEffect(() => {
    if (currentQuestion && answers[currentDimension] && answers[currentDimension][currentQuestion.id]) {
      const saved = answers[currentDimension][currentQuestion.id];
      setSelectedScore(saved.score);
      setSelectedOptIndex(saved.selectedOption);
    } else {
      setSelectedScore(null);
      setSelectedOptIndex(null);
    }
  }, [currentQuestion, answers, currentDimension]);

  // Show loading while checking access
  if (checkingAccess) {
    return (
      <PageLayout>
        <PageHeader showAdmin={false} />
        <div className="max-w-[800px] mx-auto px-8 py-16 text-center">
          <div className="font-serif text-sapi-parchment text-lg">Loading...</div>
        </div>
        <PageFooter />
      </PageLayout>
    );
  }

  const globalQNum = getQuestionsBeforeDim(currentDimension, allQuestions) + currentQuestionIndex + 1;
  const totalInDim = dimQuestions.length;
  const isLastQuestionInDim = currentQuestionIndex >= totalInDim - 1;
  const isLastDimension = currentDimension >= 4;

  let nextLabel = "Next";
  if (isLastQuestionInDim && isLastDimension) nextLabel = "Complete Assessment";
  else if (isLastQuestionInDim) nextLabel = "Continue to Next Dimension";

  function handleSelect(score, optIndex) {
    setSelectedScore(score);
    setSelectedOptIndex(optIndex);
  }

  function saveAnswerAndAdvance() {
    if (selectedScore == null || !currentQuestion) return;

    const dimAnswers = answers[currentDimension] || {};
    dimAnswers[currentQuestion.id] = {
      score: selectedScore,
      selectedOption: selectedOptIndex,
    };

    const nextIndex = currentQuestionIndex + 1;
    let nextDim = currentDimension;

    if (nextIndex >= totalInDim) {
      if (isLastDimension) {
        const scores = {};
        let totalScore = 0;
        let totalWeight = 0;

        for (let d = 0; d < 5; d++) {
          const dimQs = allQuestions.filter(q => q.dimIndex === d);
          const dimAns = answers[d] || {};
          let dimScore = 0;

          if (dimQs.length > 0) {
            let dimSum = 0;
            dimQs.forEach(q => {
              const ans = dimAns[q.id];
              if (ans) dimSum += ans.score;
            });
            dimScore = dimSum / dimQs.length;
          }

          scores[d] = dimScore;
          totalScore += dimScore * (DIMENSIONS[d]?.weight || 0.2);
          totalWeight += DIMENSIONS[d]?.weight || 0.2;
        }

        const compositeScore = totalWeight > 0 ? totalScore / totalWeight : 0;

        let tier = { label: "Pre-conditions Unmet", color: "#C03058" };
        if (compositeScore >= 80) tier = { label: "Sovereign AI Leader", color: "#28A868" };
        else if (compositeScore >= 60) tier = { label: "Advanced", color: "#4A7AE0" };
        else if (compositeScore >= 40) tier = { label: "Developing", color: "#F0C050" };
        else if (compositeScore >= 20) tier = { label: "Nascent", color: "#C9963A" };

        const newState = {
          ...appState,
          answers: { ...answers, [currentDimension]: dimAnswers },
          scores,
          compositeScore,
          tier,
        };

        if (setAppState) setAppState(newState);
        if (setCurrentPage) setCurrentPage("calculating");
        else navigate('/calculating', { state: { answers: newState.answers } });
        return;
      }

      nextDim = currentDimension + 1;
      dimAnswers.currentQuestionIndex = 0;

      if (setCurrentPage) setCurrentPage("dimIntro");
      else navigate('/dimintro');
    } else {
      dimAnswers.currentQuestionIndex = nextIndex;
    }

    if (setAppState) {
      setAppState({
        ...appState,
        currentDimension: nextDim,
        answers: { ...answers, [currentDimension]: dimAnswers },
      });
    }

    setSelectedScore(null);
    setSelectedOptIndex(null);
  }

  function handleBack() {
    if (currentQuestionIndex > 0) {
      const dimAnswers = answers[currentDimension] || {};
      dimAnswers.currentQuestionIndex = currentQuestionIndex - 1;
      // Keep the answer when going back - don't delete it

      if (setAppState) {
        setAppState({
          ...appState,
          answers: { ...answers, [currentDimension]: dimAnswers },
        });
      }
    } else if (currentDimension > 0) {
      const prevDim = currentDimension - 1;
      const prevDimQs = allQuestions.filter(q => q.dimIndex === prevDim);
      const lastQIndex = prevDimQs.length - 1;
      const newAnswers = { ...answers };
      newAnswers[prevDim] = { ...newAnswers[prevDim], currentQuestionIndex: lastQIndex };

      if (setAppState) {
        setAppState({
          ...appState,
          currentDimension: prevDim,
          answers: newAnswers,
        });
      }
    } else {
      if (setCurrentPage) setCurrentPage("briefing");
      else navigate('/briefing');
    }
  }

  function handleNext() {
    saveAnswerAndAdvance();
  }

  if (!currentQuestion) {
    return (
      <PageLayout>
        <PageHeader showAdmin={false} />
        <div className="max-w-[800px] mx-auto px-8 py-16 text-center">
          <div className="font-serif text-sapi-parchment text-lg">Loading assessment...</div>
        </div>
        <PageFooter />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader showAdmin={false} />

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
      <div className="max-w-[800px] mx-auto px-8 py-8 pb-16">
        {/* ── Progress & context bar ── */}
        <div className="bg-sapi-navy border border-sapi-bronze rounded-sm p-4.5 mb-7">
          {/* Dimension label row */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-serif text-[13px] text-sapi-gold tracking-wide">{dim.shortCode}</span>
              <div className="w-px h-3.5 bg-sapi-gold/30" />
              <span className="font-sans text-[11px] tracking-wide uppercase text-sapi-parchment opacity-85">
                {dim.name}
              </span>
            </div>
            <span className="font-sans text-[10px] tracking-wide text-sapi-muted opacity-65">
              Dimension {currentDimension + 1} of 5&nbsp;&nbsp;·&nbsp;&nbsp;Question {currentQuestionIndex + 1} of {dimQuestions.length}
            </span>
          </div>

          {/* Dimension stepper */}
          <div className="mb-4.5">
            <DimensionStepper currentDimIndex={currentDimension} />
          </div>

          {/* Dual progress bar */}
          <DualProgressBar
            dimIndex={currentDimension}
            questionIndexInDim={currentQuestionIndex}
            totalInDim={dimQuestions.length}
            questionsBeforeDim={getQuestionsBeforeDim(currentDimension, allQuestions.length > 0 ? allQuestions : ALL_QUESTIONS)}
          />
        </div>

        {/* ── Question card ── */}
        <div className="bg-sapi-navy border border-sapi-bronze rounded-sm p-7 pb-6 mb-5">
          {/* Question number */}
          <div className="flex items-center gap-2.5 mb-5">
            <span className="font-sans text-[10px] tracking-super-wide uppercase text-sapi-gold opacity-75">
              Question {globalQNum}
            </span>
            <div className="flex-1 h-px bg-sapi-gold/15" />
            <span className="font-sans text-[9px] tracking-wide text-sapi-muted opacity-50">
              {answeredCount} / {dimQuestions.length} answered in this dimension
            </span>
          </div>

          {/* Question text */}
          <p className="font-serif text-[17px] text-sapi-parchment leading-relaxed tracking-wide mb-7 font-normal">
            {currentQuestion.text}
          </p>

          {/* Answer cards */}
          <div className="flex flex-col gap-2">
            {currentQuestion.options.map((opt, i) => (
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
            disabled={selectedScore == null}
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
            className={`w-full px-12 py-3.5 font-sans text-xs tracking-extra-wide uppercase font-normal rounded-sm transition-colors duration-150 ${
              backHover ? 'text-sapi-parchment border border-sapi-bronze/60 bg-transparent' : 'text-sapi-muted border border-sapi-bronze bg-transparent'
            }`}
          >
            ← Back
          </button>
        </div>
      </div>

      <PageFooter />
    </PageLayout>
  );
}
