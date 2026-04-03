import { useState } from "react";

// ============================================================
// SEED DATA
// ============================================================
const DEMO_SUBMISSIONS = [
  {
    id: "sub_001",
    country: "Kingdom of Saudi Arabia",
    respondentName: "H.E. Faisal Al-Ibrahim",
    title: "Minister of Economy and Planning",
    ministry: "Ministry of Economy and Planning",
    email: "f.alibrahim@mep.gov.sa",
    developmentStage: "Advanced",
    completedAt: "2026-03-14T09:22:00Z",
    compositeScore: 71.4,
    tier: "Advanced",
    scores: { compute: 78, capital: 82, regulatory: 65, data: 60, di: 68 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "High-value lead. Minister attended SAPI launch event.",
    leadStage: "Proposal Sent",
  },
  {
    id: "sub_002",
    country: "Republic of Singapore",
    respondentName: "Dr. Janice Tan",
    title: "Deputy Secretary, Smart Nation",
    ministry: "Smart Nation and Digital Government Office",
    email: "janice_tan@smartnation.gov.sg",
    developmentStage: "Leading",
    completedAt: "2026-03-15T14:05:00Z",
    compositeScore: 83.2,
    tier: "Sovereign AI Leader",
    scores: { compute: 85, capital: 88, regulatory: 90, data: 80, di: 78 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New",
  },
  {
    id: "sub_003",
    country: "Federal Republic of Nigeria",
    respondentName: "Hon. Bosun Tijani",
    title: "Minister of Communications, Innovation and Digital Economy",
    ministry: "Federal Ministry of Communications",
    email: "minister@fmcide.gov.ng",
    developmentStage: "Developing",
    completedAt: "2026-03-17T11:30:00Z",
    compositeScore: 38.6,
    tier: "Nascent",
    scores: { compute: 28, capital: 35, regulatory: 42, data: 30, di: 45 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "Introduced via GIZ partnership.",
    leadStage: "Contacted",
  },
  {
    id: "sub_004",
    country: "Republic of Kenya",
    respondentName: "Eliud Owalo",
    title: "Cabinet Secretary, Information & Digital Economy",
    ministry: "Ministry of Information, Communications and Digital Economy",
    email: "cs@ict.go.ke",
    developmentStage: "Emerging",
    completedAt: "2026-03-18T08:14:00Z",
    compositeScore: 29.1,
    tier: "Nascent",
    scores: { compute: 22, capital: 28, regulatory: 35, data: 25, di: 32 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New",
  },
  {
    id: "sub_005",
    country: "United Arab Emirates",
    respondentName: "H.E. Omar Al Olama",
    title: "Minister of State for Artificial Intelligence",
    ministry: "Ministry of AI, Digital Economy and Remote Work Applications",
    email: "minister.ai@uaecabinet.ae",
    developmentStage: "Leading",
    completedAt: "2026-03-19T10:00:00Z",
    compositeScore: 78.9,
    tier: "Advanced",
    scores: { compute: 85, capital: 88, regulatory: 75, data: 72, di: 70 },
    upgradeStatus: "requested",
    requestedTier: "Tier 3",
    adminNotes: "Priority account. Met Asim at WEF Davos.",
    leadStage: "Won",
  },
  {
    id: "sub_006",
    country: "Republic of Rwanda",
    respondentName: "Paula Ingabire",
    title: "Minister of ICT and Innovation",
    ministry: "Ministry of ICT and Innovation",
    email: "minister@minict.gov.rw",
    developmentStage: "Developing",
    completedAt: "2026-03-20T13:45:00Z",
    compositeScore: 46.3,
    tier: "Developing",
    scores: { compute: 40, capital: 42, regulatory: 55, data: 38, di: 50 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New",
  },
  {
    id: "sub_007",
    country: "Republic of India",
    respondentName: "Sh. S. Krishnan",
    title: "Secretary, Ministry of Electronics and Information Technology",
    ministry: "MeitY",
    email: "secretary@meity.gov.in",
    developmentStage: "Advanced",
    completedAt: "2026-03-21T07:30:00Z",
    compositeScore: 62.7,
    tier: "Advanced",
    scores: { compute: 65, capital: 70, regulatory: 68, data: 52, di: 58 },
    upgradeStatus: "requested",
    requestedTier: "Tier 2",
    adminNotes: "Referred via UK FCDO digital programme.",
    leadStage: "Contacted",
  },
  {
    id: "sub_008",
    country: "Republic of Ghana",
    respondentName: "Ursula Owusu-Ekuful",
    title: "Minister for Communications and Digitalisation",
    ministry: "Ministry of Communications and Digitalisation",
    email: "minister@moc.gov.gh",
    developmentStage: "Emerging",
    completedAt: "2026-03-22T15:10:00Z",
    compositeScore: 33.4,
    tier: "Nascent",
    scores: { compute: 28, capital: 30, regulatory: 40, data: 28, di: 36 },
    upgradeStatus: "none",
    requestedTier: null,
    adminNotes: "",
    leadStage: "New",
  },
];

// ============================================================
// HELPERS
// ============================================================
const tierColor = (tier) =>
  ({
    "Sovereign AI Leader": "#28A868",
    Advanced: "#4A7AE0",
    Developing: "#F0C050",
    Nascent: "#C9963A",
    "Pre-conditions Unmet": "#C03058",
  }[tier] || "#9880B0");

const stageColor = (stage) =>
  ({
    New: "#9880B0",
    Contacted: "#4A7AE0",
    "Proposal Sent": "#F0C050",
    Won: "#28A868",
    Lost: "#C03058",
  }[stage] || "#9880B0");

const STAGES = ["New", "Contacted", "Proposal Sent", "Won", "Lost"];

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const shortCountry = (name) =>
  name
    .replace("Republic of ", "")
    .replace("Federal Republic of ", "")
    .replace("Kingdom of ", "")
    .replace("United Arab Emirates", "UAE");

// ============================================================
// SUMMARY STRIP STAT
// ============================================================
function StatPill({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#FFFFFF",
        border: "0.5px solid #E0D8CC",
        borderRadius: 7,
        padding: "9px 16px",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, color: "#1A1A2E", fontWeight: 500 }}>
        {value}
      </span>
      <span style={{ fontSize: 12, color: "#9880B0" }}>{label}</span>
    </div>
  );
}

// ============================================================
// FUNNEL BAR
// ============================================================
function FunnelBar({ leads }) {
  const total = leads.length;
  if (total === 0) return null;
  const stageCounts = STAGES.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.leadStage === s).length,
  }));

  return (
    <div
      style={{
        display: "flex",
        height: 6,
        borderRadius: 4,
        overflow: "hidden",
        gap: 2,
        width: "100%",
        maxWidth: 260,
      }}
    >
      {stageCounts.map(({ stage, count }) => {
        if (count === 0) return null;
        const pct = (count / total) * 100;
        return (
          <div
            key={stage}
            title={`${stage}: ${count}`}
            style={{
              height: "100%",
              width: `${pct}%`,
              background: stageColor(stage),
              borderRadius: 3,
              transition: "width 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// ============================================================
// TIER BADGE
// ============================================================
function TierBadge({ tier }) {
  const c = tierColor(tier);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 3,
        fontSize: 10.5,
        fontWeight: 500,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        background: `${c}16`,
        color: c,
        border: `0.5px solid ${c}36`,
      }}
    >
      {tier}
    </span>
  );
}

// ============================================================
// REQUESTED TIER BADGE
// ============================================================
function RequestedTierBadge({ tier }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 3,
        fontSize: 10.5,
        fontWeight: 500,
        whiteSpace: "nowrap",
        background: "#4A7AE016",
        color: "#4A7AE0",
        border: "0.5px solid #4A7AE036",
      }}
    >
      {tier}
    </span>
  );
}

// ============================================================
// SCORE BADGE
// ============================================================
function ScoreBadge({ score }) {
  const color =
    score >= 70 ? "#4A7AE0" : score >= 55 ? "#F0C050" : score >= 40 ? "#C9963A" : "#C03058";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 3,
        fontSize: 11,
        fontFamily: "Georgia, serif",
        background: `${color}14`,
        color,
        border: `0.5px solid ${color}32`,
      }}
    >
      {score}
    </span>
  );
}

// ============================================================
// MOVE STAGE DROPDOWN
// ============================================================
function MoveStageDropdown({ current, onMove }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 9px",
          fontSize: 11,
          borderRadius: 4,
          background: "transparent",
          border: "0.5px solid #E0D8CC",
          color: "#6B6577",
          cursor: "pointer",
          fontFamily: "system-ui, sans-serif",
          transition: "border-color 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#C9963A";
          e.currentTarget.style.color = "#C9963A";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "#E0D8CC";
          e.currentTarget.style.color = "#6B6577";
        }}
      >
        Move stage
        <span style={{ fontSize: 9, marginTop: 1 }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 50,
            background: "#FFFFFF",
            border: "0.5px solid #E0D8CC",
            borderRadius: 6,
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            minWidth: 150,
            overflow: "hidden",
          }}
        >
          {STAGES.filter((s) => s !== current).map((stage) => {
            const c = stageColor(stage);
            return (
              <button
                key={stage}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(stage);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 12.5,
                  color: "#1A1A2E",
                  background: "transparent",
                  border: "none",
                  borderBottom: stage !== STAGES[STAGES.length - 1] ? "0.5px solid #F0EBE3" : "none",
                  cursor: "pointer",
                  fontFamily: "system-ui, sans-serif",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAF8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: c,
                    flexShrink: 0,
                  }}
                />
                {stage}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// LEAD CARD
// ============================================================
function LeadCard({ sub, onMoveStage, onViewRecord }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        border: "0.5px solid #E0D8CC",
        borderRadius: 8,
        padding: "12px",
        transition: "box-shadow 0.18s ease, transform 0.15s ease",
        boxShadow: hovered
          ? "0 4px 14px rgba(0,0,0,0.10)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-1px)" : "none",
        cursor: "default",
      }}
    >
      {/* Country */}
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 500,
          color: "#1A1A2E",
          marginBottom: 2,
          lineHeight: 1.3,
        }}
      >
        {shortCountry(sub.country)}
      </div>

      {/* Respondent */}
      <div
        style={{
          fontSize: 11.5,
          color: "#6B6577",
          marginBottom: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {sub.respondentName}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#9880B0",
          marginBottom: 10,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {sub.title}
      </div>

      {/* Badges row */}
      <div
        style={{
          display: "flex",
          gap: 5,
          flexWrap: "wrap",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <ScoreBadge score={sub.compositeScore} />
        {sub.requestedTier && <RequestedTierBadge tier={sub.requestedTier} />}
      </div>

      {/* Tier classification */}
      <div style={{ marginBottom: 10 }}>
        <TierBadge tier={sub.tier} />
      </div>

      {/* Admin notes (if any) */}
      {sub.adminNotes && (
        <div
          style={{
            fontSize: 11,
            color: "#9880B0",
            borderTop: "0.5px solid #F0EBE3",
            paddingTop: 8,
            marginBottom: 10,
            lineHeight: 1.5,
            fontStyle: "italic",
          }}
        >
          {sub.adminNotes}
        </div>
      )}

      {/* Date */}
      <div
        style={{
          fontSize: 10.5,
          color: "#B8B0A8",
          marginBottom: 10,
        }}
      >
        Assessed {fmtDate(sub.completedAt)}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "0.5px solid #F0EBE3",
          paddingTop: 9,
        }}
      >
        <MoveStageDropdown current={sub.leadStage} onMove={onMoveStage} />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewRecord();
          }}
          style={{
            padding: "4px 9px",
            fontSize: 11,
            borderRadius: 4,
            background: "transparent",
            border: "0.5px solid #C9963A",
            color: "#C9963A",
            cursor: "pointer",
            fontFamily: "system-ui, sans-serif",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "#C9963A14")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          View record ↗
        </button>
      </div>
    </div>
  );
}

// ============================================================
// KANBAN COLUMN
// ============================================================
function KanbanColumn({ stage, leads, onMoveStage, onViewRecord }) {
  const color = stageColor(stage);
  const count = leads.length;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 180,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Column header */}
      <div
        style={{
          borderTop: `3px solid ${color}`,
          background: "#FFFFFF",
          border: `0.5px solid #E0D8CC`,
          borderTopColor: color,
          borderTopWidth: 3,
          borderRadius: "8px 8px 0 0",
          padding: "12px 14px 11px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#1A1A2E",
            letterSpacing: "0.01em",
          }}
        >
          {stage}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 20,
            height: 20,
            padding: "0 6px",
            borderRadius: 10,
            background: count > 0 ? `${color}18` : "#F0EBE3",
            color: count > 0 ? color : "#B8B0A8",
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {count}
        </span>
      </div>

      {/* Card list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "8px 0 12px",
          minHeight: 80,
        }}
      >
        {count === 0 ? (
          <div
            style={{
              margin: "4px 0",
              border: "1.5px dashed #E0D8CC",
              borderRadius: 8,
              padding: "28px 14px",
              textAlign: "center",
              color: "#B8B0A8",
              fontSize: 12,
              background: "rgba(240,235,227,0.28)",
            }}
          >
            No leads at this stage
          </div>
        ) : (
          leads.map((sub) => (
            <LeadCard
              key={sub.id}
              sub={sub}
              onMoveStage={(newStage) => onMoveStage(sub.id, newStage)}
              onViewRecord={() => onViewRecord(sub)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: "#1A1540",
        border: "0.5px solid #2A204A",
        color: "#FBF5E6",
        padding: "10px 16px",
        borderRadius: 7,
        fontSize: 12.5,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 28px rgba(0,0,0,0.24)",
        transform: visible ? "translateY(0)" : "translateY(80px)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#28A868",
          flexShrink: 0,
        }}
      />
      {message}
    </div>
  );
}

// ============================================================
// LEADS PIPELINE PAGE
// ============================================================
export default function LeadsPipeline({ setAdminPage, setSelectedLead }) {
  // Local mutable state for lead stages (seeded from DEMO_SUBMISSIONS)
  const [stages, setStages] = useState(() => {
    const map = {};
    DEMO_SUBMISSIONS.forEach((s) => {
      map[s.id] = s.leadStage;
    });
    return map;
  });

  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const handleMoveStage = (id, newStage) => {
    setStages((prev) => ({ ...prev, [id]: newStage }));
    const sub = DEMO_SUBMISSIONS.find((s) => s.id === id);
    showToast(
      `${shortCountry(sub?.country || "")} moved to ${newStage}`
    );
  };

  const handleViewRecord = (sub) => {
    if (setSelectedLead) setSelectedLead({ ...sub, leadStage: stages[sub.id] });
    if (setAdminPage) setAdminPage("leadDetail");
  };

  // Only leads where upgradeStatus === "requested"
  const allLeads = DEMO_SUBMISSIONS.filter(
    (s) => s.upgradeStatus === "requested"
  ).map((s) => ({ ...s, leadStage: stages[s.id] }));

  const totalCount = allLeads.length;
  const wonCount = allLeads.filter((l) => l.leadStage === "Won").length;
  const contactedCount = allLeads.filter(
    (l) => l.leadStage === "Contacted"
  ).length;
  const proposalCount = allLeads.filter(
    (l) => l.leadStage === "Proposal Sent"
  ).length;
  const activeCount = allLeads.filter(
    (l) => l.leadStage !== "Won" && l.leadStage !== "Lost"
  ).length;

  // Group by stage
  const byStage = {};
  STAGES.forEach((s) => {
    byStage[s] = allLeads.filter((l) => l.leadStage === s);
  });

  return (
    <div
      style={{
        padding: "1.75rem 2rem 2.5rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* ── Page header ───────────────────────────────────────── */}
      <div style={{ marginBottom: "1.25rem", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: "#1A1A2E",
                margin: "0 0 4px",
                fontFamily: "Georgia, serif",
              }}
            >
              Leads Pipeline
            </h1>
            <p style={{ fontSize: 13, color: "#9880B0", margin: 0 }}>
              {totalCount} upgrade request{totalCount !== 1 ? "s" : ""} across{" "}
              {activeCount} active lead{activeCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Funnel visualisation */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 5,
              paddingTop: 4,
            }}
          >
            <div style={{ fontSize: 10.5, color: "#B8B0A8", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Pipeline distribution
            </div>
            <FunnelBar leads={allLeads} />
            <div style={{ display: "flex", gap: 10 }}>
              {STAGES.map((s) => {
                const n = byStage[s].length;
                if (n === 0) return null;
                return (
                  <span key={s} style={{ fontSize: 10, color: stageColor(s) }}>
                    {s} ({n})
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary strip */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <StatPill
            label="total pipeline"
            value={totalCount}
            color="#C9963A"
          />
          <StatPill
            label="won"
            value={wonCount}
            color="#28A868"
          />
          <StatPill
            label="proposal sent"
            value={proposalCount}
            color="#F0C050"
          />
          <StatPill
            label="contacted"
            value={contactedCount}
            color="#4A7AE0"
          />

          {/* Win rate */}
          {totalCount > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#F7F4EF",
                border: "0.5px solid #E0D8CC",
                borderRadius: 7,
                padding: "9px 16px",
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 11, color: "#9880B0", fontStyle: "italic" }}>
                Win rate
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "Georgia, serif",
                  color: wonCount > 0 ? "#28A868" : "#9880B0",
                }}
              >
                {Math.round((wonCount / totalCount) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Kanban board ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 10,
          overflowX: "auto",
          overflowY: "visible",
          paddingBottom: 16,
          minHeight: 0,
        }}
      >
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            leads={byStage[stage]}
            onMoveStage={handleMoveStage}
            onViewRecord={handleViewRecord}
          />
        ))}
      </div>

      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} />
    </div>
  );
}
