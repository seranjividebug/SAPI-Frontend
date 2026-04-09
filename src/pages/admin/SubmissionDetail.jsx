import { useState, useEffect } from "react";
import { getAssessmentDetails } from "../../services/assessmentService";
import {
  tierColor,
  bandLabel,
  bandColor,
  fmtDate,
} from "./components/AdminHelpers";

// =============================================================
// DIMENSION METADATA
// =============================================================
const DIMS = [
  { key: "compute", label: "Compute Capacity", qKey: "d1" },
  { key: "capital", label: "Capital Formation", qKey: "d2" },
  { key: "regulatory", label: "Regulatory Readiness", qKey: "d3" },
  { key: "data", label: "Data Sovereignty", qKey: "d4" },
  { key: "di", label: "Directed Intelligence", qKey: "d5" },
];

// =============================================================
// PILL COMPONENT
// =============================================================
function Pill({ label, color, size = "sm" }) {
  const pad = size === "lg" ? "px-2.5 py-1" : "px-2 py-0.5";
  const fs = size === "lg" ? "text-xs" : "text-[11px]";
  return (
    <span
      className={`inline-flex items-center rounded ${pad} ${fs} font-medium tracking-wide whitespace-nowrap border-[0.5px]`}
      style={{
        backgroundColor: `${color}18`,
        color,
        borderColor: `${color}40`,
      }}
    >
      {label}
    </span>
  );
}

// =============================================================
// RADAR CHART
// =============================================================
function RadarChart({ scores }) {
  const cx = 240, cy = 195, r = 118;
  const dimOrder = ["compute", "capital", "regulatory", "data", "di"];
  const dimLabels = ["Compute Capacity", "Capital Formation", "Regulatory Readiness", "Data Sovereignty", "DI Maturity"];

  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5;

  const pt = (val, i, radius) => {
    const a = angle(i);
    const scale = Math.max(0, Math.min(100, val)) / 100;
    return [cx + scale * radius * Math.cos(a), cy + scale * radius * Math.sin(a)];
  };

  const gridPoly = (pct) => dimOrder.map((_, i) => pt(pct * 100, i, r).join(",")).join(" ");

  const scorePoly = dimOrder.map((d, i) => pt(scores[d] || 0, i, r).join(",")).join(" ");

  const labelAnchor = (i) => {
    const a = angle(i) * (180 / Math.PI);
    if (a > -100 && a < -80) return "middle";
    if (a >= -80 && a <= 30) return "start";
    if (a > 30 && a < 150) return "middle";
    return "end";
  };

  const labelDy = (i) => {
    const a = angle(i) * (180 / Math.PI);
    if (a > -100 && a < -80) return -6;
    if (a > 30 && a < 150) return 14;
    return 4;
  };

  return (
    <svg width="480" height="390" viewBox="0 0 480 390" className="block">
      {[0.25, 0.5, 0.75, 1].map((pct) => (
        <polygon
          key={pct}
          points={gridPoly(pct)}
          fill="none"
          stroke={pct === 1 ? "#D4CCBE" : "#E8E2DA"}
          strokeWidth={pct === 1 ? "0.75" : "0.5"}
        />
      ))}
      {dimOrder.map((_, i) => {
        const [x, y] = pt(100, i, r);
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E0D8CC" strokeWidth="0.5" />
        );
      })}
      <polygon
        points={scorePoly}
        fill="#C9963A"
        fillOpacity="0.18"
        stroke="#C9963A"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      {dimOrder.map((d, i) => {
        const [x, y] = pt(scores[d] || 0, i, r);
        return (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#C9963A" stroke="#FFFFFF" strokeWidth="1.5" />
        );
      })}
      {[25, 50, 75].map((v) => {
        const [x, y] = pt(v, 0, r);
        return (
          <text key={v} x={x + 5} y={y} fontSize="9" fill="#B8B0A8" dominantBaseline="middle">
            {v}
          </text>
        );
      })}
      {dimOrder.map((d, i) => {
        const lRadius = r + 55;
        const a = angle(i);
        const lx = cx + lRadius * Math.cos(a);
        const ly = cy + lRadius * Math.sin(a);
        const sc = scores[d] || 0;
        return (
          <g key={i}>
            <text
              x={lx}
              y={ly + labelDy(i)}
              textAnchor={labelAnchor(i)}
              dominantBaseline="middle"
              fontSize="8"
              className="font-sans"
              fill="#1A1A2E"
              fontWeight="500"
            >
              {dimLabels[i]}
            </text>
            <text
              x={lx}
              y={ly + labelDy(i) + 13}
              textAnchor={labelAnchor(i)}
              dominantBaseline="middle"
              fontSize="9"
              className="font-sans"
              fontWeight="600"
              fill={bandColor(sc)}
            >
              {sc}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// =============================================================
// COMPOSITE SCORE CARD
// =============================================================
function CompositeScoreCard({ score, tier }) {
  const tc = tierColor(tier);
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden mb-3.5 flex-shrink-0">
      <div className="px-6 py-5 bg-[#F7F4EF] flex items-center justify-between">
        <div>
          <div className="text-base font-semibold text-[#1A1A2E] mb-1">Composite Score</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs flex items-center gap-1" style={{ color: tc }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tc} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {tier}
            </span>
          </div>
        </div>
        <div
          className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-white"
          style={{ border: `3px solid ${tc}` }}
        >
          <div className="font-sans text-[28px] font-bold text-[#1A1A2E] leading-none">{score}</div>
          <div className="text-[9px] mt-0.5 truncate max-w-[60px]" style={{ color: tc }} title={tier}>
            {tier}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ORG PROFILE CARD
// =============================================================
function OrgProfileCard({ sub }) {
  const rows = [
    { label: "Country", value: sub.country },
    { label: "Respondent", value: sub.respondentName },
    { label: "Title", value: sub.title },
    { label: "Ministry", value: sub.ministry },
    {
      label: "Email",
      value: (
        <a href={`mailto:${sub.email}`} className="text-[#4A7AE0] no-underline">
          {sub.email}
        </a>
      ),
    },
    { label: "Development Stage", value: sub.developmentStage },
    { label: "Completed", value: `${fmtDate(sub.completedAt)}` },
  ];
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden flex-1 flex flex-col">
      <div className="px-5 py-3.5 bg-[#F7F4EF] border-b border-[#E0D8CC]">
        <span className="text-xs font-medium text-[#6B6577] uppercase tracking-wider">
          Organisation Profile
        </span>
      </div>
      <div className="py-3 flex-1">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center px-5 py-3 ${i < rows.length - 1 ? "border-b border-[#F0EBE3]" : ""}`}
          >
            <div className="w-40 flex-shrink-0 text-sm text-[#6B6577]">{row.label}</div>
            <div className="text-sm text-[#1A1A2E] flex-1">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================
// DIMENSION SCORES PANEL
// =============================================================
function DimensionScoresPanel({ scores, onDimensionClick, selectedDim }) {
  const [hoveredDim, setHoveredDim] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-5 gap-2.5 mb-3.5 flex-shrink-0">
        {DIMS.map((dim) => {
          const s = scores[dim.key] || 0;
          const bc = bandColor(s);
          const isSelected = selectedDim === dim.key;
          const isHovered = hoveredDim === dim.key;
          const isActive = isSelected || isHovered;

          return (
            <div
              key={dim.key}
              onClick={() => onDimensionClick && onDimensionClick(dim.key)}
              onMouseEnter={() => setHoveredDim(dim.key)}
              onMouseLeave={() => setHoveredDim(null)}
              className={`bg-white border rounded-lg py-3.5 px-3.5 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isActive ? "scale-105 shadow-lg" : "scale-100 shadow-none"
              }`}
              style={{
                borderColor: isActive ? bc : "#E0D8CC",
                boxShadow: isActive ? `0 4px 16px ${bc}40` : "none",
              }}
            >
              {isActive && <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: bc }} />}
              <div className="text-[11px] text-[#6B6577] font-medium uppercase tracking-normal mb-2 leading-tight line-clamp-2 text-center">
                {dim.label}
              </div>
              <div className="font-sans text-[28px] font-bold leading-none" style={{ color: bc }}>
                {s}
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white border border-[#E0D8CC] rounded-lg px-5 py-4 flex flex-col items-center flex-1">
        <div className="text-xs font-medium text-[#6B6577] uppercase tracking-wider self-start mb-2">
          Dimension Radar
        </div>
        <div className="flex-1 flex items-center justify-center w-full">
          <RadarChart scores={scores} />
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Q&A ACCORDION
// =============================================================
function QAAccordion({ answers, dimensionBreakdown, openDim, onToggleDim }) {
  const [open, setOpen] = useState({});

  useEffect(() => {
    if (openDim) {
      setOpen((prev) => ({ ...prev, [openDim]: true }));
    }
  }, [openDim]);

  const toggle = (key) => {
    setOpen((prev) => {
      const newOpen = !prev[key];
      const newState = { ...prev, [key]: newOpen };
      if (onToggleDim) onToggleDim(key, newOpen);
      return newState;
    });
  };

  // Map dimension names from API to DIMS keys
  const dimNameToKey = {
    "Compute Capacity": "compute",
    "Capital Formation": "capital",
    "Regulatory Readiness": "regulatory",
    "Data Sovereignty": "data",
    "Directed Intelligence Maturity": "di",
  };

  // Map DIMS labels to API dimension names
  const dimLabelToApiName = {
    "Compute Capacity": "Compute Capacity",
    "Capital Formation": "Capital Formation",
    "Regulatory Readiness": "Regulatory Readiness",
    "Data Sovereignty": "Data Sovereignty",
    "Directed Intelligence": "Directed Intelligence Maturity",
  };

  return (
    <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden mb-3.5">
      <div className="px-4 py-2.5 bg-[#F7F4EF] border-b border-[#E0D8CC]">
        <span className="text-xs font-medium text-[#6B6577] uppercase tracking-wider">
          Assessment Responses
        </span>
      </div>
      {DIMS.map((dim, di) => {
        const apiName = dimLabelToApiName[dim.label] || dim.label;
        const dimensionData = dimensionBreakdown?.find(d => d.dimension_name === apiName);
        const questions = dimensionData?.questions || [];
        const dimScore = answers[`q${questions[0]?.question_id}`] || 0;
        const isOpen = !!open[dim.key];

        return (
          <div key={dim.key} className={`${di < DIMS.length - 1 ? "border-b border-[#E8E2DA]" : ""}`}>
            <button
              onClick={() => toggle(dim.key)}
              className={`w-full flex items-center gap-2.5 px-4 py-3 border-none cursor-pointer text-left transition-colors ${
                isOpen ? "bg-[#FAFAF8]" : "bg-transparent"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? "text-[#C9963A] rotate-90" : "text-[#5A4A7A] rotate-0"
                }`}
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span className="text-sm font-medium text-[#1A1A2E] flex-1">{dim.label}</span>
              <span className="text-xs text-[#9880B0] mr-2">{questions.length} questions</span>
              <Pill label={bandLabel(dimScore)} color={bandColor(dimScore)} />
            </button>
            {isOpen && questions.length > 0 && (
              <div className="px-4 py-3 bg-[#FAFAF8]">
                {questions.map((q) => (
                  <div key={q.question_id} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b border-[#E8E2DA] last:border-0">
                    <div className="text-sm text-[#6B6577] font-bold mb-2 leading-relaxed">{q.question_text}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-[#1A1A2E] font-normal flex-1 mr-4">{q.selected_text}</div>
                      <div className="text-sm text-[#C9963A] font-semibold whitespace-nowrap">Score: {q.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// =============================================================
// MAIN SUBMISSION DETAIL COMPONENT
// =============================================================
export default function SubmissionDetail({ submission: submissionProp, onBack }) {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDim, setSelectedDim] = useState(null);

  const handleDimensionClick = (dimKey) => {
    setSelectedDim(dimKey === selectedDim ? null : dimKey);
  };

  const handleAccordionToggle = (dimKey, isOpen) => {
    if (isOpen) {
      setSelectedDim(dimKey);
    }
  };

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        // First try to use the passed submission prop
        if (submissionProp?.details) {
          const data = submissionProp.details;
          const transformedSubmission = {
            id: data.assessment_id,
            country: data.country,
            respondentName: data.respondent_name,
            title: data.title,
            ministry: data.ministry_or_department,
            email: data.contact_email,
            developmentStage: data.development_stage,
            completedAt: data.created_at,
            compositeScore: data.sapi_score,
            tier: data.tier,
            scores: {
              compute: Math.round(data.dimensions.compute_capacity.score),
              capital: Math.round(data.dimensions.capital_formation.score),
              regulatory: Math.round(data.dimensions.regulatory_readiness.score),
              data: Math.round(data.dimensions.data_sovereignty.score),
              di: Math.round(data.dimensions.directed_intelligence.score),
            },
            answers: {},
            dimensionBreakdown: data.dimension_breakdown || [],
          };

          if (data.dimension_breakdown) {
            data.dimension_breakdown.forEach((dimension) => {
              dimension.questions.forEach((q) => {
                const qKey = `q${q.question_id}`;
                transformedSubmission.answers[qKey] = q.score;
              });
            });
          }

          setSubmission(transformedSubmission);
          setLoading(false);
          return;
        }

        // Fallback: try to use submissionProp.id if it exists
        if (submissionProp?.id) {
          const response = await getAssessmentDetails(submissionProp.id);
          if (response?.success && response.data) {
            const data = response.data;
            const transformedSubmission = {
              id: data.assessment_id,
              country: data.country,
              respondentName: data.respondent_name,
              title: data.title,
              ministry: data.ministry_or_department,
              email: data.contact_email,
              developmentStage: data.development_stage,
              completedAt: data.created_at,
              compositeScore: data.sapi_score,
              tier: data.tier,
              scores: {
                compute: Math.round(data.dimensions.compute_capacity.score),
                capital: Math.round(data.dimensions.capital_formation.score),
                regulatory: Math.round(data.dimensions.regulatory_readiness.score),
                data: Math.round(data.dimensions.data_sovereignty.score),
                di: Math.round(data.dimensions.directed_intelligence.score),
              },
              answers: {},
              dimensionBreakdown: data.dimension_breakdown || [],
            };

            if (data.dimension_breakdown) {
              data.dimension_breakdown.forEach((dimension) => {
                dimension.questions.forEach((q) => {
                  const qKey = `q${q.question_id}`;
                  transformedSubmission.answers[qKey] = q.score;
                });
              });
            }

            setSubmission(transformedSubmission);
            setLoading(false);
            return;
          }
        }

        // Final fallback: localStorage
        const assessmentId = localStorage.getItem("sapi_assessment_id");

        if (!assessmentId) {
          setError("No assessment ID found");
          setLoading(false);
          return;
        }

        const response = await getAssessmentDetails(assessmentId);

        if (!response.success || !response.data) {
          setError("Failed to fetch assessment details");
          setLoading(false);
          return;
        }

        const data = response.data;
        const transformedSubmission = {
          id: data.assessment_id,
          country: data.country,
          respondentName: data.respondent_name,
          title: data.title,
          ministry: data.ministry_or_department,
          email: data.contact_email,
          developmentStage: data.development_stage,
          completedAt: data.created_at,
          compositeScore: data.sapi_score,
          tier: data.tier,
          scores: {
            compute: Math.round(data.dimensions.compute_capacity.score),
            capital: Math.round(data.dimensions.capital_formation.score),
            regulatory: Math.round(data.dimensions.regulatory_readiness.score),
            data: Math.round(data.dimensions.data_sovereignty.score),
            di: Math.round(data.dimensions.directed_intelligence.score),
          },
          answers: {},
          dimensionBreakdown: data.dimension_breakdown || [],
        };

        if (data.dimension_breakdown) {
          data.dimension_breakdown.forEach((dimension) => {
            dimension.questions.forEach((q) => {
              const qKey = `q${q.question_id}`;
              transformedSubmission.answers[qKey] = q.score;
            });
          });
        }

        setSubmission(transformedSubmission);
      } catch (err) {
        setError(err.message || "An error occurred while fetching assessment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentDetails();
  }, [submissionProp]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-base text-[#6B6577]">Loading assessment details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center font-sans">
        <div className="text-center px-10 py-5 bg-white rounded-lg border border-[#E0D8CC]">
          <div className="text-base text-[#C03058] mb-2">Error</div>
          <div className="text-sm text-[#6B6577]">{error}</div>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-base text-[#6B6577]">No assessment data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] font-sans">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-card:nth-child(1) { animation-delay: 0.1s; }
        .animate-card:nth-child(2) { animation-delay: 0.2s; }
        .animate-card:nth-child(3) { animation-delay: 0.3s; }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Page Header */}
      <div className="bg-white border-b border-[#E0D8CC] px-6 py-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-[#F7F4EF] border border-[#E0D8CC] rounded-md cursor-pointer text-[#6B6577] text-xs py-2 px-3.5 transition-all duration-150 mb-4 hover:bg-[#F0EBE3] hover:border-[#D4CBB8]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Assessments
        </button>

        <h1 className="font-serif text-[22px] font-semibold text-[#1A1A2E] m-0">Assessment Details</h1>
        <p className="text-sm text-[#6B6577] mt-2">
          View comprehensive assessment results including dimension scores, organisation profile, and detailed
          question responses.
        </p>
      </div>

      {/* Body Content */}
      <div className="px-6 py-4 pb-8">
        {/* Top row */}
        <div className="flex gap-4 mb-3.5 items-stretch">
          {/* Left column */}
          <div className="flex-[0_0_40%] flex flex-col bg-white rounded-lg p-4 animate-card">
            <div className="hover-lift">
              <CompositeScoreCard score={submission.compositeScore} tier={submission.tier} />
            </div>
            <div className="flex-1 flex flex-col hover-lift">
              <OrgProfileCard sub={submission} />
            </div>
          </div>

          {/* Right column */}
          <div className="flex-1 flex flex-col animate-card">
            <div className="hover-lift h-full">
              <DimensionScoresPanel
                scores={submission.scores}
                selectedDim={selectedDim}
                onDimensionClick={handleDimensionClick}
              />
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="animate-card hover-lift">
          <QAAccordion answers={submission.answers} dimensionBreakdown={submission.dimensionBreakdown} openDim={selectedDim} onToggleDim={handleAccordionToggle} />
        </div>
      </div>

    </div>
  );
}
