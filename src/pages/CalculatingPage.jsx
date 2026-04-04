import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { submitAssessment } from "../services/assessmentService";
import { PageLayout } from "./common";

// ── Dimension metadata ────────────────────────────────────────────────────────
const DIMENSIONS = [
  { name: "Compute Capacity",               shortCode: "D1", weight: 0.175, ids: ["Q1","Q2","Q3","Q4","Q5"] },
  { name: "Capital Formation",              shortCode: "D2", weight: 0.225, ids: ["Q6","Q7","Q8","Q9","Q10","Q11"] },
  { name: "Regulatory Readiness",           shortCode: "D3", weight: 0.175, ids: ["Q12","Q13","Q14","Q15","Q16","Q17","Q18"] },
  { name: "Data Sovereignty",               shortCode: "D4", weight: 0.125, ids: ["Q19","Q20","Q21","Q22","Q23","Q24"] },
  { name: "Directed Intelligence Maturity", shortCode: "D5", weight: 0.275, ids: ["Q25","Q26","Q27","Q28","Q29","Q30"] },
];

// ── Scoring engine ───────────────────────────────────────────────────────────
function computeAllScores(answers = {}) {
  const dimScores = DIMENSIONS.map(dim => {
    const vals = dim.ids.map(id => answers[id] || 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  });
  const [d1, d2, d3, d4, d5] = dimScores;
  const safe = v => Math.max(v, 0.001);
  const composite =
    Math.pow(safe(d1), 0.175) *
    Math.pow(safe(d2), 0.225) *
    Math.pow(safe(d3), 0.175) *
    Math.pow(safe(d4), 0.125) *
    Math.pow(safe(d5), 0.275);
  return { dimScores, composite: Math.min(composite, 100) };
}

function getTier(score) {
  if (score >= 80) return { label: "Sovereign AI Leader",   color: "#28A868" };
  if (score >= 60) return { label: "Advanced",              color: "#4A7AE0" };
  if (score >= 40) return { label: "Developing",            color: "#F0C050" };
  if (score >= 20) return { label: "Nascent",               color: "#C9963A" };
  return               { label: "Pre-conditions Unmet",     color: "#C03058" };
}

// ── Animated Logo Component ───────────────────────────────────────────────────
function SAPIGlobeAnimated({ size = 96 }) {
  return (
    <img
      src="/logo.png"
      alt="SAPI Logo"
      className="animate-[globeBreathe_2.8s_ease-in-out_infinite]"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        background: 'transparent',
        borderRadius: '50%',
        padding: '8px',
        boxSizing: 'border-box',
        WebkitMaskImage: 'radial-gradient(circle, white 100%, transparent 100%)',
        maskImage: 'radial-gradient(circle, white 100%, transparent 100%)'
      }}
    />
  );
}

// ── Dimension score bar ──────────────────────────────────────────────────────
function DimBar({ dim, score, active, staggerIndex }) {
  const delay = 0.25 + staggerIndex * 0.12;
  const duration = 1.6 + staggerIndex * 0.1;

  return (
    <div className={`transition-opacity duration-[400ms] ${active ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${delay}s` }}>
      {/* Label row */}
      <div className="flex justify-between items-baseline mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] tracking-extra-wide uppercase text-sapi-gold opacity-90">
            {dim.shortCode}
          </span>
          <span className="font-sans text-[11px] tracking-wide text-sapi-muted opacity-75">
            {dim.name}
          </span>
        </div>
        <span className="font-serif text-[13px] text-sapi-paleGold tracking-wide transition-opacity duration-300" style={{ transitionDelay: `${delay + 0.4}s`, opacity: active ? 1 : 0 }}>
          {score > 0 ? score.toFixed(1) : "—"}
        </span>
      </div>

      {/* Bar track */}
      <div className="h-[3px] bg-sapi-bronze rounded-sm overflow-hidden border border-sapi-bronze/45">
        <div
          className="h-full rounded-sm shadow-[0_0_8px_rgba(201,150,58,0.4)]"
          style={{
            width: active ? `${Math.min(score, 100)}%` : "0%",
            background: 'linear-gradient(90deg, #C9963A 0%, #EDD98A 85%, #FFF8E0 100%)',
            transition: `width ${duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s`,
          }}
        />
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function CalculatingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [barsActive, setBarsActive] = useState(false);
  const [completeActive, setCompleteActive] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);

  const answers = useMemo(() => location.state?.answers || {}, [location.state]);

  useEffect(() => {
    const submitAndCalculate = async () => {
      try {
        const answerArray = Object.entries(answers).map(([questionId, data]) => ({
          question_id: parseInt(questionId.replace('Q', '')),
          selected_option: data.selectedOption || 'a'
        }));

        if (answerArray.length === 0) {
          return;
        }

        const userProfile = JSON.parse(localStorage.getItem('sapi_user_profile') || '{}');
        const profileId = userProfile.profile_id || userProfile.id;
        const response = await submitAssessment(profileId, answerArray);
        if (response.success) {
          setAssessmentResults(response.data);
          if (response.data.assessment_id) {
            localStorage.setItem('sapi_assessment_id', response.data.assessment_id);
          }
        }
      } catch (err) {
        console.error("Assessment submission error:", err);
      }
    };

    submitAndCalculate();
  }, [answers]);

  const { dimScores, composite } = useMemo(() => {
    if (assessmentResults) {
      return {
        dimScores: [
          assessmentResults.compute_capacity,
          assessmentResults.capital_formation,
          assessmentResults.regulatory_readiness,
          assessmentResults.data_sovereignty,
          assessmentResults.directed_intelligence
        ],
        composite: assessmentResults.sapi_score
      };
    }
    return computeAllScores(
      Object.fromEntries(
        Object.entries(answers).map(([k, v]) => [k, v.score || 0])
      )
    );
  }, [assessmentResults, answers]);

  const tier = useMemo(() => getTier(composite), [composite]);

  useEffect(() => {
    const t1 = setTimeout(() => setBarsActive(true), 350);
    const t2 = setTimeout(() => setCompleteActive(true), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!assessmentResults) return;
    const t3 = setTimeout(() => {
      const assessmentId = assessmentResults.assessment_id;
      navigate('/results', {
        state: {
          results: assessmentResults,
          assessmentId: assessmentId,
          answers: answers,
          dimScores: dimScores,
          composite: composite,
          tier: tier
        }
      });
    }, 3600);
    return () => { clearTimeout(t3); };
  }, [assessmentResults, answers, composite, dimScores, navigate, tier]);

  return (
    <PageLayout>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes globeBreathe {
          0%, 100% { transform: scale(1); opacity: 0.92; }
          50% { transform: scale(1.04); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.12; }
          90% { opacity: 0.12; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .sapi-line-1 { animation: fadeSlideUp 0.55s ease forwards 0.35s; opacity: 0; }
        .sapi-line-2 { animation: fadeSlideUp 0.55s ease forwards 0.9s; opacity: 0; }
        .sapi-line-3 { animation: fadeSlideUp 0.55s ease forwards 1.45s; opacity: 0; }
      `}</style>

      {/* Ambient scan line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-sapi-gold to-transparent opacity-0 pointer-events-none animate-[scanLine_3.6s_ease-in-out_0.2s_1_forwards]" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
        {/* Radial glow behind globe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[68%] w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(201,150,58,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* SAPI Globe */}
        <div className="mb-9">
          <SAPIGlobeAnimated size={96} />
        </div>

        {/* SAPI wordmark */}
        <div className="mb-10 text-center">
          <div className="font-serif text-[11px] tracking-[0.32em] uppercase text-sapi-muted opacity-55">
            The Sovereign AI Power Index
          </div>
        </div>

        {/* Status text sequence */}
        <div className="flex flex-col items-center gap-3 mb-12 text-center">
          <span className="sapi-line-1 font-sans text-[13px] tracking-[0.15em] uppercase text-sapi-muted">
            Analysing sovereign AI readiness...
          </span>
          <span className="sapi-line-2 font-sans text-[13px] tracking-[0.15em] uppercase text-sapi-muted">
            Computing dimension scores...
          </span>
          <span className="sapi-line-3 font-sans text-[13px] tracking-[0.15em] uppercase text-sapi-muted">
            Generating composite SAPI index...
          </span>
        </div>

        {/* Five dimension bars */}
        <div className="w-full max-w-[500px] flex flex-col gap-3.5 p-6 bg-sapi-navy rounded-lg border border-sapi-bronze/45 mb-10">
          {/* Panel header */}
          <div className="flex justify-between items-center pb-3 border-b border-sapi-bronze mb-1">
            <span className="font-sans text-[10px] tracking-extra-wide uppercase text-sapi-muted opacity-60">
              Dimension Analysis
            </span>
            <span className="font-sans text-[10px] tracking-wide text-sapi-gold opacity-70">
              Tier 1 · 30 Indicators
            </span>
          </div>

          {DIMENSIONS.map((dim, i) => (
            <DimBar
              key={dim.shortCode}
              dim={dim}
              score={dimScores[i]}
              active={barsActive}
              staggerIndex={i}
            />
          ))}
        </div>

        {/* Assessment complete */}
        <div className={`text-center transition-all duration-800 ${completeActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'}`}>
          <div className="flex items-center gap-2.5 justify-center mb-2">
            <div className="w-7 h-px bg-gradient-to-r from-transparent to-sapi-gold" />
            <span className="font-serif text-[15px] text-sapi-parchment tracking-wide">
              Assessment complete.
            </span>
            <div className="w-7 h-px bg-gradient-to-r from-sapi-gold to-transparent" />
          </div>
          <div className="font-sans text-[11px] tracking-wide uppercase text-sapi-muted opacity-60">
            Preparing your SAPI report...
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
