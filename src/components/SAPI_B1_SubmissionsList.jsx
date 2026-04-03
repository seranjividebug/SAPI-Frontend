import { useState, useMemo } from "react";

// ============================================================
// SEED DATA  (shared — define once in the top-level admin file)
// ============================================================
const DEMO_SUBMISSIONS = [
  {
    id: "sub_001", country: "Kingdom of Saudi Arabia",
    respondentName: "H.E. Faisal Al-Ibrahim", title: "Minister of Economy and Planning",
    ministry: "Ministry of Economy and Planning", email: "f.alibrahim@mep.gov.sa",
    developmentStage: "Advanced", completedAt: "2026-03-14T09:22:00Z",
    compositeScore: 71.4, tier: "Advanced",
    scores: { compute: 78, capital: 82, regulatory: 65, data: 60, di: 68 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "High-value lead. Minister attended SAPI launch event.", leadStage: "Proposal Sent",
  },
  {
    id: "sub_002", country: "Republic of Singapore",
    respondentName: "Dr. Janice Tan", title: "Deputy Secretary, Smart Nation",
    ministry: "Smart Nation and Digital Government Office", email: "janice_tan@smartnation.gov.sg",
    developmentStage: "Leading", completedAt: "2026-03-15T14:05:00Z",
    compositeScore: 83.2, tier: "Sovereign AI Leader",
    scores: { compute: 85, capital: 88, regulatory: 90, data: 80, di: 78 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_003", country: "Federal Republic of Nigeria",
    respondentName: "Hon. Bosun Tijani", title: "Minister of Communications, Innovation and Digital Economy",
    ministry: "Federal Ministry of Communications", email: "minister@fmcide.gov.ng",
    developmentStage: "Developing", completedAt: "2026-03-17T11:30:00Z",
    compositeScore: 38.6, tier: "Nascent",
    scores: { compute: 28, capital: 35, regulatory: 42, data: 30, di: 45 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "Introduced via GIZ partnership.", leadStage: "Contacted",
  },
  {
    id: "sub_004", country: "Republic of Kenya",
    respondentName: "Eliud Owalo", title: "Cabinet Secretary, Information & Digital Economy",
    ministry: "Ministry of Information, Communications and Digital Economy", email: "cs@ict.go.ke",
    developmentStage: "Emerging", completedAt: "2026-03-18T08:14:00Z",
    compositeScore: 29.1, tier: "Nascent",
    scores: { compute: 22, capital: 28, regulatory: 35, data: 25, di: 32 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_005", country: "United Arab Emirates",
    respondentName: "H.E. Omar Al Olama", title: "Minister of State for Artificial Intelligence",
    ministry: "Ministry of AI, Digital Economy and Remote Work Applications", email: "minister.ai@uaecabinet.ae",
    developmentStage: "Leading", completedAt: "2026-03-19T10:00:00Z",
    compositeScore: 78.9, tier: "Advanced",
    scores: { compute: 85, capital: 88, regulatory: 75, data: 72, di: 70 },
    upgradeStatus: "requested", requestedTier: "Tier 3",
    adminNotes: "Priority account. Met Asim at WEF Davos.", leadStage: "Won",
  },
  {
    id: "sub_006", country: "Republic of Rwanda",
    respondentName: "Paula Ingabire", title: "Minister of ICT and Innovation",
    ministry: "Ministry of ICT and Innovation", email: "minister@minict.gov.rw",
    developmentStage: "Developing", completedAt: "2026-03-20T13:45:00Z",
    compositeScore: 46.3, tier: "Developing",
    scores: { compute: 40, capital: 42, regulatory: 55, data: 38, di: 50 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
  {
    id: "sub_007", country: "Republic of India",
    respondentName: "Sh. S. Krishnan", title: "Secretary, Ministry of Electronics and Information Technology",
    ministry: "MeitY", email: "secretary@meity.gov.in",
    developmentStage: "Advanced", completedAt: "2026-03-21T07:30:00Z",
    compositeScore: 62.7, tier: "Advanced",
    scores: { compute: 65, capital: 70, regulatory: 68, data: 52, di: 58 },
    upgradeStatus: "requested", requestedTier: "Tier 2",
    adminNotes: "Referred via UK FCDO digital programme.", leadStage: "Contacted",
  },
  {
    id: "sub_008", country: "Republic of Ghana",
    respondentName: "Ursula Owusu-Ekuful", title: "Minister for Communications and Digitalisation",
    ministry: "Ministry of Communications and Digitalisation", email: "minister@moc.gov.gh",
    developmentStage: "Emerging", completedAt: "2026-03-22T15:10:00Z",
    compositeScore: 33.4, tier: "Nascent",
    scores: { compute: 28, capital: 30, regulatory: 40, data: 28, di: 36 },
    upgradeStatus: "none", requestedTier: null, adminNotes: "", leadStage: "New",
  },
];

// ============================================================
// HELPERS
// ============================================================
const tierColor = (tier) => ({
  "Sovereign AI Leader": "#28A868",
  "Advanced": "#4A7AE0",
  "Developing": "#D4A830",
  "Nascent": "#C9963A",
  "Pre-conditions Unmet": "#C03058",
}[tier] || "#9880B0");

const stageColor = (stage) => ({
  "New": "#9880B0",
  "Contacted": "#4A7AE0",
  "Proposal Sent": "#D4A830",
  "Won": "#28A868",
  "Lost": "#C03058",
}[stage] || "#9880B0");

const scoreColor = (s) => s >= 70 ? "#4A7AE0" : s >= 55 ? "#D4A830" : s >= 40 ? "#C9963A" : "#C03058";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const truncMin = (str, n) =>
  str && str.length > n ? str.slice(0, n) + "…" : (str || "");

// ============================================================
// TOAST
// ============================================================
function Toast({ visible }) {
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: "#1A1540", border: "0.5px solid #2A204A",
      color: "#FBF5E6", padding: "11px 18px", borderRadius: 7,
      fontSize: 13, display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
      transform: visible ? "translateY(0)" : "translateY(80px)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.22s ease",
      pointerEvents: "none",
    }}>
      <div style={{ width: 7, height: 7, background: "#28A868", borderRadius: "50%", flexShrink: 0 }} />
      Export ready{" "}
      <span style={{ color: "#9880B0", fontSize: 11, marginLeft: 4 }}>(prototype mode)</span>
    </div>
  );
}

// ============================================================
// PILL BADGE
// ============================================================
function Pill({ label, color }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 9px", borderRadius: 3,
      fontSize: 11, fontWeight: 500, letterSpacing: "0.02em", whiteSpace: "nowrap",
      background: `${color}18`, color, border: `0.5px solid ${color}40`,
    }}>
      {label}
    </span>
  );
}

// ============================================================
// FILTER SELECT
// ============================================================
function FilterSelect({ value, onChange, options, placeholder }) {
  const isActive = value !== options[0];
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none", WebkitAppearance: "none",
          background: "#FFFFFF",
          border: `0.5px solid ${isActive ? "#C9963A" : "#E0D8CC"}`,
          borderRadius: 6, padding: "7px 28px 7px 11px",
          fontSize: 12.5, color: "#1A1A2E",
          fontFamily: "system-ui, sans-serif",
          cursor: "pointer", outline: "none",
          minWidth: 130,
          transition: "border-color 0.15s",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
        fontSize: 10, color: "#9880B0", pointerEvents: "none",
      }}>▾</span>
    </div>
  );
}

// ============================================================
// COLUMN HEADER
// ============================================================
function ColHeader({ col, sortKey, sortDir, onSort }) {
  const active = sortKey === col.key;
  return (
    <th
      onClick={col.sortable ? () => onSort(col.key) : undefined}
      style={{
        padding: "0 14px", height: 36,
        background: "#F0EBE3",
        color: active ? "#C9963A" : "#6B6577",
        fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: "0.07em",
        cursor: col.sortable ? "pointer" : "default",
        userSelect: "none", whiteSpace: "nowrap",
        textAlign: "left", borderBottom: "0.5px solid #E0D8CC",
        width: col.width,
        transition: "color 0.12s",
      }}
    >
      {col.label}
      {col.sortable && (
        <span style={{ fontSize: 9, marginLeft: 4, color: active ? "#C9963A" : "#C8C0B8" }}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      )}
    </th>
  );
}

// ============================================================
// B1 — SUBMISSIONS LIST
// ============================================================
export default function SubmissionsList({ setAdminPage, setSelectedSubmission, setSelectedLead }) {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [filterUpgrade, setFilterUpgrade] = useState("All");
  const [filterLead, setFilterLead] = useState("All");
  const [sortKey, setSortKey] = useState("completedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);

  const totalCount = DEMO_SUBMISSIONS.length;
  const upgradeCount = DEMO_SUBMISSIONS.filter((s) => s.upgradeStatus === "requested").length;

  const hasActiveFilters =
    search || filterTier !== "All" || filterStage !== "All" ||
    filterUpgrade !== "All" || filterLead !== "All";

  const clearFilters = () => {
    setSearch(""); setFilterTier("All"); setFilterStage("All");
    setFilterUpgrade("All"); setFilterLead("All");
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleExport = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const rows = useMemo(() => {
    let r = [...DEMO_SUBMISSIONS];
    const s = search.toLowerCase().trim();
    if (s) r = r.filter((x) =>
      x.country.toLowerCase().includes(s) ||
      x.respondentName.toLowerCase().includes(s) ||
      x.ministry.toLowerCase().includes(s)
    );
    if (filterTier !== "All") r = r.filter((x) => x.tier === filterTier);
    if (filterStage !== "All") r = r.filter((x) => x.developmentStage === filterStage);
    if (filterUpgrade === "Requested") r = r.filter((x) => x.upgradeStatus === "requested");
    if (filterUpgrade === "Not requested") r = r.filter((x) => x.upgradeStatus !== "requested");
    if (filterLead !== "All") r = r.filter((x) => x.leadStage === filterLead);

    r.sort((a, b) => {
      const d = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") return av.localeCompare(bv) * d;
      return (av - bv) * d;
    });
    return r;
  }, [search, filterTier, filterStage, filterUpgrade, filterLead, sortKey, sortDir]);

  const COLUMNS = [
    { key: "country",          label: "Country",    sortable: true,  width: "160px" },
    { key: "respondentName",   label: "Respondent", sortable: true,  width: "176px" },
    { key: "ministry",         label: "Ministry",   sortable: false, width: "180px" },
    { key: "developmentStage", label: "Dev Stage",  sortable: true,  width: "100px" },
    { key: "compositeScore",   label: "Score",      sortable: true,  width: "72px"  },
    { key: "tier",             label: "Tier",       sortable: true,  width: "150px" },
    { key: "completedAt",      label: "Date",       sortable: true,  width: "100px" },
    { key: "actions",          label: "Actions",    sortable: false, width: "152px" },
  ];

  const rowHoverStyles = `
    .sapi-row { transition: background 0.1s; }
    .sapi-row:hover { background: #FBF5E6 !important; }
    .btn-view { transition: background 0.13s, color 0.13s; }
    .btn-view:hover { background: #C9963A !important; color: #06030E !important; }
    .btn-lead { transition: background 0.13s, color 0.13s; }
    .btn-lead:hover { background: #4A7AE0 !important; color: #FFFFFF !important; }
    .tbl-th-sortable:hover { color: #1A1A2E !important; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D4CBB8; border-radius: 3px; }
  `;

  return (
    <div style={{ padding: "1.75rem 2rem 2.5rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{rowHoverStyles}</style>
      <Toast visible={toastVisible} />

      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: "#1A1A2E", margin: "0 0 6px", fontFamily: "Georgia, serif" }}>
            Submissions
          </h1>
          <div style={{ fontSize: 13, color: "#6B6577" }}>
            {totalCount} assessments completed ·{" "}
            <span style={{ color: "#C9963A", fontWeight: 500 }}>{upgradeCount} upgrade requests</span>
          </div>
        </div>
        <button
          onClick={handleExport}
          style={{
            padding: "8px 16px", fontSize: 13, borderRadius: 6,
            background: "#C9963A", border: "none", color: "#FFFFFF",
            cursor: "pointer", fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
            letterSpacing: "0.02em", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div style={{
        background: "#FFFFFF", border: "0.5px solid #E0D8CC",
        borderRadius: 8, padding: "12px 16px", marginBottom: "1.25rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>

          {/* Search */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="7" cy="7" r="4.5" stroke="#B0A8A0" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="#B0A8A0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              placeholder="Search country, respondent, ministry..."
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "#FFFFFF", border: `0.5px solid ${search ? "#C9963A" : "#E0D8CC"}`,
                borderRadius: 6, padding: "9px 12px 9px 36px",
                fontSize: 13, color: "#1A1A2E", fontFamily: "system-ui, sans-serif",
                width: 260, outline: "none", transition: "border-color 0.15s",
              }}
            />
          </div>

          <FilterSelect
            value={filterTier}
            onChange={setFilterTier}
            placeholder="All tiers"
            options={[
              { value: "All", label: "All tiers" },
              { value: "Sovereign AI Leader", label: "Sovereign AI Leader" },
              { value: "Advanced", label: "Advanced" },
              { value: "Developing", label: "Developing" },
              { value: "Nascent", label: "Nascent" },
              { value: "Pre-conditions Unmet", label: "Pre-conditions Unmet" },
            ]}
          />

          <FilterSelect
            value={filterStage}
            onChange={setFilterStage}
            placeholder="All dev stages"
            options={[
              { value: "All", label: "All dev stages" },
              { value: "Early", label: "Early" },
              { value: "Emerging", label: "Emerging" },
              { value: "Developing", label: "Developing" },
              { value: "Advanced", label: "Advanced" },
              { value: "Leading", label: "Leading" },
            ]}
          />

          <FilterSelect
            value={filterUpgrade}
            onChange={setFilterUpgrade}
            placeholder="All upgrade status"
            options={[
              { value: "All", label: "All upgrade status" },
              { value: "Requested", label: "Requested" },
              { value: "Not requested", label: "Not requested" },
            ]}
          />

          <div style={{ flex: 1 }} />

          <button
            onClick={clearFilters}
            style={{
              background: "none", border: "none", color: "#6B6577",
              fontSize: 13, cursor: "pointer", padding: 0,
              fontFamily: "system-ui, sans-serif",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Reset Filters
          </button>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "0.5px solid #F0EBE3" }}>
            {filterTier !== "All" && (
              <span style={{
                background: "#F8F9FA", border: "0.5px solid #E0D8CC", borderRadius: 4,
                padding: "4px 10px", fontSize: 12, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6,
              }}>
                Tier: {filterTier}
                <button onClick={() => setFilterTier("All")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6B6577", fontSize: 14 }}>×</button>
              </span>
            )}
            {filterStage !== "All" && (
              <span style={{
                background: "#F8F9FA", border: "0.5px solid #E0D8CC", borderRadius: 4,
                padding: "4px 10px", fontSize: 12, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6,
              }}>
                Dev Stage: {filterStage}
                <button onClick={() => setFilterStage("All")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6B6577", fontSize: 14 }}>×</button>
              </span>
            )}
            {filterLead !== "All" && (
              <span style={{
                background: "#F8F9FA", border: "0.5px solid #E0D8CC", borderRadius: 4,
                padding: "4px 10px", fontSize: 12, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6,
              }}>
                Lead: {filterLead}
                <button onClick={() => setFilterLead("All")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#6B6577", fontSize: 14 }}>×</button>
              </span>
            )}
            <span style={{ fontSize: 12, color: "#9880B0", marginLeft: "auto" }}>
              Showing {rows.length} of {totalCount}
            </span>
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div style={{ background: "#FFFFFF", border: "0.5px solid #E0D8CC", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 960 }}>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <ColHeader key={col.key} col={col} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div style={{ textAlign: "center", padding: "60px 20px" }}>
                      <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.2 }}>≡</div>
                      <div style={{ fontSize: 14, color: "#6B6577", marginBottom: 8 }}>
                        No submissions match your filters
                      </div>
                      <button
                        onClick={clearFilters}
                        style={{
                          background: "none", border: "none", color: "#C9963A",
                          fontSize: 13, cursor: "pointer", padding: 0,
                          fontFamily: "system-ui, sans-serif",
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : rows.map((row) => {
                const isSelected = selectedRow === row.id;
                const tc = tierColor(row.tier);

                return (
                  <tr
                    key={row.id}
                    className="sapi-row"
                    onClick={() => setSelectedRow(row.id)}
                    style={{
                      borderBottom: "0.5px solid #E8E2DA",
                      background: isSelected ? "#FFFDF8" : "#FFFFFF",
                      borderLeft: isSelected ? "3px solid #C9963A" : "3px solid transparent",
                      cursor: "default",
                    }}
                  >
                    {/* Country */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{ fontSize: 13, color: "#1A1A2E", fontWeight: 500 }}>{row.country}</span>
                    </td>

                    {/* Respondent */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <div style={{ fontSize: 13, color: "#1A1A2E" }}>{row.respondentName}</div>
                      <div style={{ fontSize: 11, color: "#9880B0", marginTop: 1 }}>{truncMin(row.title, 36)}</div>
                    </td>

                    {/* Ministry */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{ fontSize: 12.5, color: "#6B6577" }}>{truncMin(row.ministry, 30)}</span>
                    </td>

                    {/* Dev Stage */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{
                        fontSize: 12, color: "#6B6577", background: "#F0EBE3",
                        padding: "2px 8px", borderRadius: 3,
                      }}>
                        {row.developmentStage}
                      </span>
                    </td>

                    {/* Score */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{
                        fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 400,
                        color: scoreColor(row.compositeScore),
                      }}>
                        {row.compositeScore}
                      </span>
                    </td>

                    {/* Tier */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <Pill label={row.tier} color={tc} />
                    </td>

                    {/* Date */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <span style={{ fontSize: 12.5, color: "#6B6577" }}>{fmtDate(row.completedAt)}</span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "0 14px", height: 52, verticalAlign: "middle" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button
                          className="btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmission(row);
                            setAdminPage("submissionDetail");
                            setSelectedRow(row.id);
                          }}
                          style={{
                            padding: "4px 10px", fontSize: 12, borderRadius: 4,
                            background: "transparent", border: "0.5px solid #C9963A", color: "#C9963A",
                            cursor: "pointer", fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap",
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {rows.length > 0 && (
          <div style={{
            padding: "12px 16px", borderTop: "0.5px solid #E8E2DA",
            background: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 12, color: "#6B6577" }}>
              Showing {rows.length} submissions
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>‹</button>
              <button style={{
                padding: "6px 12px", background: "#1A1A2E", border: "none",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#FFFFFF",
              }}>1</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>2</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>3</button>
              <button style={{
                padding: "6px 12px", background: "#FFFFFF", border: "0.5px solid #E0D8CC",
                borderRadius: 4, fontSize: 12, cursor: "pointer", color: "#6B6577",
              }}>Next</button>
            </div>
            <span style={{ fontSize: 12, color: "#9880B0" }}>
              Prototype data
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
