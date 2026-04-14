import { useState, useMemo, useEffect } from "react";
import { getDashboardAssessments, exportDashboardCSV } from "../../services/dashboardService";
import {
  tierColor,
  scoreColor,
  fmtDate,
  getAuthToken,
  transformAssessment,
  countryFlagComponents,
  getCountryFlag,
  getCountryCode,
  truncMin,
} from "./components/AdminHelpers";

// Toast Component
function Toast({ visible }) {
  return (
    <div
      className={`fixed bottom-7 right-7 z-[9999] bg-[#1A1540] border border-[#2A204A] text-[#FBF5E6] px-4 py-3 rounded-lg text-sm flex items-center gap-2.5 shadow-lg transition-all duration-300 pointer-events-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className="w-1.5 h-1.5 bg-[#28A868] rounded-full flex-shrink-0" />
      Export ready{" "}
      <span className="text-[#9880B0] text-[11px] ml-1">(prototype mode)</span>
    </div>
  );
}

// Pill Badge Component
function Pill({ label, color }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide whitespace-nowrap border-[0.5px]"
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

// Filter Select Component
function FilterSelect({ value, onChange, options, placeholder }) {
  const isActive = value !== options[0]?.value;
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-white border rounded-md py-1.5 pr-7 pl-2.5 text-xs text-[#1A1A2E] cursor-pointer outline-none transition-colors min-w-[130px] ${
          isActive ? "border-[#C9963A]" : "border-[#E0D8CC]"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#9880B0] pointer-events-none">
        ▾
      </span>
    </div>
  );
}

// Column Header Component
function ColHeader({ col, sortKey, sortDir, onSort }) {
  const active = sortKey === col.key;
  return (
    <th
      onClick={col.sortable ? () => onSort(col.key) : undefined}
      className={`px-3.5 h-9 bg-[#F0EBE3] text-[11px] font-medium uppercase tracking-wider whitespace-nowrap text-left border-b border-[#E0D8CC] transition-colors ${
        col.sortable ? "cursor-pointer hover:text-[#1A1A2E]" : "cursor-default"
      } ${active ? "text-[#C9963A]" : "text-[#6B6577]"}`}
      style={{ width: col.width }}
    >
      {col.label}
      {col.sortable && (
        <span className={`text-[9px] ml-1 ${active ? "text-[#C9963A]" : "text-[#C8C0B8]"}`}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      )}
    </th>
  );
}

export default function SubmissionsList({ setAdminPage, setSelectedSubmission }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [filterUpgrade, setFilterUpgrade] = useState("All");
  const [filterLead, setFilterLead] = useState("All");
  const [sortKey, setSortKey] = useState("completedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      try {
        setLoading(true);
        const response = await getDashboardAssessments(token, { page: 1, limit: 100 });
        if (response?.success) {
          const transformedData = response.data.data.map(transformAssessment);
          setSubmissions(transformedData);
        } else {
          setSubmissions([]);
        }
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load assessments");
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasActiveFilters =
    search || filterStage !== "All" || filterUpgrade !== "All" || filterLead !== "All";

  const clearFilters = () => {
    setSearch("");
    setFilterStage("All");
    setFilterUpgrade("All");
    setFilterLead("All");
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleExport = async () => {
    const token = getAuthToken();
    try {
      const blob = await exportDashboardCSV(token, {
        search: search,
        developmentStage: filterStage !== "All" ? filterStage : undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assessments-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export CSV");
    }
  };

  const rows = useMemo(() => {
    let r = [...submissions];
    const s = search.toLowerCase().trim();
    if (s)
      r = r.filter(
        (x) =>
          x.country?.toLowerCase().includes(s) ||
          x.respondentName?.toLowerCase().includes(s) ||
          x.ministry?.toLowerCase().includes(s)
      );
    if (filterStage !== "All")
      r = r.filter((x) => x.developmentStage === filterStage);
    if (filterUpgrade === "Requested")
      r = r.filter((x) => x.upgradeStatus === "requested");
    if (filterUpgrade === "Not requested")
      r = r.filter((x) => x.upgradeStatus !== "requested");
    if (filterLead !== "All") r = r.filter((x) => x.leadStage === filterLead);

    r.sort((a, b) => {
      const d = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (typeof av === "string") return av.localeCompare(bv) * d;
      return (av - bv) * d;
    });

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRows = r.slice(startIndex, startIndex + itemsPerPage);

    return paginatedRows;
  }, [search, filterStage, filterUpgrade, filterLead, sortKey, sortDir, submissions, currentPage, itemsPerPage]);

  const filteredCount = useMemo(() => {
    let r = [...submissions];
    const s = search.toLowerCase().trim();
    if (s)
      r = r.filter(
        (x) =>
          x.country?.toLowerCase().includes(s) ||
          x.respondentName?.toLowerCase().includes(s) ||
          x.ministry?.toLowerCase().includes(s)
      );
    if (filterStage !== "All")
      r = r.filter((x) => x.developmentStage === filterStage);
    if (filterUpgrade === "Requested")
      r = r.filter((x) => x.upgradeStatus === "requested");
    if (filterUpgrade === "Not requested")
      r = r.filter((x) => x.upgradeStatus !== "requested");
    if (filterLead !== "All") r = r.filter((x) => x.leadStage === filterLead);
    return r.length;
  }, [search, filterStage, filterUpgrade, filterLead, submissions]);

  const totalPages = Math.ceil(filteredCount / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStage, filterUpgrade, filterLead]);

  const COLUMNS = [
    { key: "country", label: "Country", sortable: true, width: "160px" },
    { key: "respondentName", label: "Respondent", sortable: true, width: "176px" },
    { key: "ministry", label: "Ministry", sortable: false, width: "180px" },
    { key: "developmentStage", label: "Dev Stage", sortable: true, width: "100px" },
    { key: "completedAt", label: "Date", sortable: true, width: "100px" },
    { key: "compositeScore", label: "Score", sortable: true, width: "72px" },
    { key: "tier", label: "Tier", sortable: true, width: "150px" },
    { key: "actions", label: "Actions", sortable: false, width: "100px" },
  ];

  const totalCount = submissions.length;

  if (loading) {
    return (
      <div className="px-7 py-7 pb-10 font-sans flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-sm text-[#6B6577]">Loading assessments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-7 py-7 pb-10 font-sans flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-sm text-[#C03058] mb-2">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1A1A2E] text-white rounded-md cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-7 py-7 pb-10 font-sans">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1A1A2E] mb-1.5 font-serif">
            Assessments
          </h1>
          <div className="text-sm text-[#6B6577]">
            {totalCount} assessments completed
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E0D8CC] rounded-lg px-4 py-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <circle cx="7" cy="7" r="4.5" stroke="#B0A8A0" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="#B0A8A0" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              placeholder="Search country, respondent, ministry..."
              onChange={(e) => setSearch(e.target.value)}
              className={`bg-white border rounded-md py-2 pr-3 pl-9 text-xs text-[#1A1A2E] w-65 outline-none transition-colors ${
                search ? "border-[#C9963A]" : "border-[#E0D8CC]"
              }`}
            />
          </div>

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

          <div className="flex-1" />

          <button
            onClick={handleExport}
            className="px-4 py-2 text-xs rounded-md bg-[#C9963A] border-none text-white cursor-pointer whitespace-nowrap tracking-wide font-medium flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0EBE3]">
            {filterStage !== "All" && (
              <span className="bg-[#F8F9FA] border border-[#E0D8CC] rounded px-2.5 py-1 text-xs text-[#1A1A2E] flex items-center gap-1.5">
                Dev Stage: {filterStage}
                <button
                  onClick={() => setFilterStage("All")}
                  className="bg-none border-none p-0 cursor-pointer text-[#6B6577] text-sm"
                >
                  ×
                </button>
              </span>
            )}
            {filterLead !== "All" && (
              <span className="bg-[#F8F9FA] border border-[#E0D8CC] rounded px-2.5 py-1 text-xs text-[#1A1A2E] flex items-center gap-1.5">
                Lead: {filterLead}
                <button
                  onClick={() => setFilterLead("All")}
                  className="bg-none border-none p-0 cursor-pointer text-[#6B6577] text-sm"
                >
                  ×
                </button>
              </span>
            )}
            <span className="text-xs text-[#6B6577] ml-auto">
              Showing {rows.length} of {filteredCount}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
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
                  <td colSpan={8}>
                    <div className="text-center py-15">
                      <div className="text-[28px] mb-3 opacity-20">≡</div>
                      <div className="text-sm text-[#6B6577] mb-2">
                        No assessments match your filters
                      </div>
                      <button
                        onClick={clearFilters}
                        className="bg-none border-none text-[#C9963A] text-sm cursor-pointer p-0"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const isSelected = selectedRow === row.id;
                  const tc = tierColor(row.tier);

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRow(row.id)}
                      className={`border-b border-[#E8E2DA] transition-colors cursor-default hover:bg-[#FBF5E6] ${
                        isSelected ? "bg-[#FFFDF8] border-l-[3px] border-l-[#C9963A]" : "bg-white border-l-[3px] border-l-transparent"
                      }`}
                    >
                      {/* Country */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const countryCode = getCountryCode(row.country);
                            return countryCode ? (
                              <span 
                                className={`fi fi-${countryCode} rounded-sm`}
                                style={{ fontSize: '24px', lineHeight: 1, width: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              ></span>
                            ) : (
                              <span className="text-2xl">🏳️</span>
                            );
                          })()}
                          <span className="text-sm text-[#1A1A2E] font-medium">{row.country}</span>
                        </div>
                      </td>

                      {/* Respondent */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <div className="text-sm text-[#1A1A2E]">{row.respondentName}</div>
                        <div className="text-[11px] text-[#6B6577] mt-0.5">{truncMin(row.title, 36)}</div>
                      </td>

                      {/* Ministry */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <span className="text-xs text-[#6B6577]">{truncMin(row.ministry, 30)}</span>
                      </td>

                      {/* Dev Stage */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <span className="text-xs text-[#6B6577] bg-[#F0EBE3] px-2 py-0.5 rounded">
                          {row.developmentStage}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-3.5 h-[52px] align-middle whitespace-nowrap">
                        <span className="text-xs text-[#6B6577]">{fmtDate(row.completedAt)}</span>
                      </td>

                      {/* Score */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <div className="flex gap-1.5 items-center">
                          <span className="font-sans text-sm font-normal text-[#1A1A2E]">
                            {row.compositeScore}
                          </span>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <Pill label={row.tier} color={tc} />
                      </td>

                      {/* Actions */}
                      <td className="px-3.5 h-[52px] align-middle">
                        <div className="flex gap-1.5 items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem("sapi_assessment_id", row.id);
                              setSelectedSubmission(row);
                              setAdminPage("submissionDetail");
                              setSelectedRow(row.id);
                            }}
                            className="px-2.5 py-1 text-xs rounded bg-transparent border border-[#C9963A] text-[#C9963A] cursor-pointer whitespace-nowrap transition-colors hover:bg-[#C9963A] hover:text-[#06030E]"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-[#E8E2DA] bg-[#FAFAF8] flex items-center justify-between">
            <span className="text-xs text-[#6B6577]">
              Showing {filteredCount > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredCount)} of {filteredCount} assessments
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border rounded text-xs cursor-pointer ${
                  currentPage === 1
                    ? "bg-white border-[#E0D8CC] text-[#C8C0B8] cursor-not-allowed"
                    : "bg-white border-[#E0D8CC] text-[#6B6577] hover:border-[#C9963A]"
                }`}
              >
                ←
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 border rounded text-xs cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#1A1A2E] border-none text-white"
                        : "bg-white border-[#E0D8CC] text-[#6B6577] hover:border-[#C9963A]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 border rounded text-xs cursor-pointer ${
                  currentPage === totalPages
                    ? "bg-white border-[#E0D8CC] text-[#C8C0B8] cursor-not-allowed"
                    : "bg-white border-[#E0D8CC] text-[#6B6577] hover:border-[#C9963A]"
                }`}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
