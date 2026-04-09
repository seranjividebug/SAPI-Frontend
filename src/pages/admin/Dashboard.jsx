import { useState, useEffect, useRef } from "react";
import {
  getDashboardAssessments,
  getDashboardFilters,
  exportDashboardCSV,
  getDashboardStats,
} from "../../services/dashboardService";
import { getAssessmentDetails } from "../../services/assessmentService";
import {
  tierColor,
  shortCountry,
  fmtDate,
  getAuthToken,
  transformAssessment,
  countryFlagComponents,
} from "./components/AdminHelpers";

// KPI Card Component
function KpiCard({ icon, value, label, trend, trendLabel, color }) {
  const isPositive =
    trend?.includes("+") || trend?.includes("No change") || false;
  return (
    <div className="bg-white border border-[#E0D8CC] rounded-lg p-4">
      <div className="flex justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[${color}15]`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-semibold text-[#1A1A2E] leading-none mb-1 font-sans">
        {value}
      </div>
      <div className="text-xs font-medium text-[#6B6577] uppercase tracking-wider mb-2">
        {label}
      </div>
      {trend && trendLabel && (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium ${isPositive ? "text-[#28A868]" : "text-[#C03058]"}`}>
            {trend}
          </span>
          <span className="text-xs text-[#9880B0]">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}

// Tier Distribution Chart
function TierDistributionChart({ submissions }) {
  const tiers = [
    "Sovereign AI Leader",
    "Advanced",
    "Developing",
    "Nascent",
    "Pre-conditions Unmet",
  ];
  const counts = tiers.reduce((acc, t) => {
    acc[t] = submissions.filter((s) => s.tier === t).length;
    return acc;
  }, {});
  const total = submissions.length;

  const shortNames = {
    "Sovereign AI Leader": "Leader",
    Advanced: "Advanced",
    Developing: "Developing",
    Nascent: "Nascent",
    "Pre-conditions Unmet": "Unmet",
  };

  return (
    <div className="flex flex-col gap-2">
      {tiers
        .filter((t) => counts[t] > 0)
        .map((tier) => {
          const pct = Math.round((counts[tier] / total) * 100);
          return (
            <div key={tier} className="flex items-center gap-2.5">
              <span className="text-xs text-[#6B6577] w-16">
                {shortNames[tier]}
              </span>
              <div className="flex-1 h-2 bg-[#F0EBE3] rounded overflow-hidden">
                <div
                  className={`h-full rounded bg-[${tierColors[tier]}]`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-[#1A1A2E] font-medium w-8 text-right">
                {pct}%
              </span>
            </div>
          );
        })}
    </div>
  );
}

const tierColors = {
  "Sovereign AI Leader": "#28A868",
  Advanced: "#4A7AE0",
  Developing: "#8B4513",
  Nascent: "#C9963A",
  "Pre-conditions Unmet": "#C03058",
};

export default function Dashboard({ setAdminPage, setSelectedSubmission }) {
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    totalAssessments: { value: 0, change: 0 },
    avgSapiScore: { value: 0, change: 0 },
    completionRate: { value: 0, change: 0 },
    upgradeRequests: { value: 0, weeklyNew: 0 },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [filterLoading, setFilterLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);
  const [selectedScoreRange, setSelectedScoreRange] = useState("");
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState(false);
  const scoreDropdownRef = useRef(null);
  const [selectedDateRange, setSelectedDateRange] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target)
      ) {
        setCountryDropdownOpen(false);
      }
      if (
        scoreDropdownRef.current &&
        !scoreDropdownRef.current.contains(e.target)
      ) {
        setScoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = getAuthToken();

      try {
        setLoading(true);

        const [assessmentsRes, filtersRes, statsRes] = await Promise.all([
          getDashboardAssessments(token, {
            page: currentPage,
            limit: itemsPerPage,
          }).catch(() => null),
          getDashboardFilters(token).catch(() => null),
          getDashboardStats(token).catch(() => null),
        ]);

        if (assessmentsRes?.success) {
          const transformedSubmissions = assessmentsRes.data.data.map(
            transformAssessment
          );
          setSubmissions(transformedSubmissions);
          setAllSubmissions(transformedSubmissions);
          setTotalPages(assessmentsRes.data.totalPages || 1);
        } else {
          setSubmissions([]);
          setAllSubmissions([]);
          setTotalPages(1);
        }

        if (statsRes?.success) {
          setStats(statsRes.data);
        }

        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
        setSubmissions([]);
        setAllSubmissions([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentPage]);

  useEffect(() => {
    const fetchFilteredAssessments = async () => {
      const token = getAuthToken();

      try {
        setFilterLoading(true);
        const filterParams = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          country: selectedCountry,
        };

        if (selectedScoreRange) {
          const ranges = {
            "90-100": { min: 90, max: 100 },
            "70-89": { min: 70, max: 89 },
            "50-69": { min: 50, max: 69 },
            "Below 50": { min: 0, max: 49 },
          };
          const range = ranges[selectedScoreRange];
          if (range) {
            filterParams.scoreMin = range.min;
            filterParams.scoreMax = range.max;
          }
        }

        const response = await getDashboardAssessments(token, filterParams);

        if (response?.success) {
          const transformedSubmissions = response.data.data.map(
            transformAssessment
          );
          setSubmissions(transformedSubmissions);
          setTotalPages(response.data.totalPages || 1);
        }
      } catch (err) {
        console.error("Filter fetch error:", err);
      } finally {
        setFilterLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchFilteredAssessments, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCountry, selectedScoreRange, currentPage]);

  useEffect(() => {
    let filtered = [...allSubmissions];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((s) => {
        const searchTerms = searchQuery.toLowerCase().split(" ");
        return searchTerms.every((term) => {
          return (
            s.country.toLowerCase().includes(term) ||
            s.name.toLowerCase().includes(term) ||
            s.ministry.toLowerCase().includes(term)
          );
        });
      });
    }

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((s) => s.country === selectedCountry);
    }

    // Filter by score range
    if (selectedScoreRange) {
      if (selectedScoreRange === "Below 50") {
        filtered = filtered.filter((s) => (s.compositeScore || 0) < 50);
      } else {
        const [min, max] = selectedScoreRange.split("-").map((s) => parseInt(s.trim()));
        filtered = filtered.filter((s) => {
          const score = s.compositeScore || 0;
          return score >= min && score <= max;
        });
      }
    }

    // Filter by date range
    if (selectedDateRange) {
      const days = parseInt(selectedDateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter((s) => {
        const submissionDate = s.createdAt ? new Date(s.createdAt) : null;
        return submissionDate && submissionDate >= cutoffDate;
      });
    }

    setSubmissions(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchQuery, selectedCountry, selectedScoreRange, selectedDateRange, allSubmissions]);

  const total = allSubmissions.length;
  const uniqueCountries = [...new Set(allSubmissions.map((s) => s.country))].sort();

  const todayStr = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const topCountries = [...allSubmissions]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .slice(0, 5);

  const handleExportCSV = async () => {
    const token = getAuthToken();
    try {
      const blob = await exportDashboardCSV(token, {
        search: searchQuery,
        country: selectedCountry,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export CSV");
    }
  };

  const handleViewAssessment = async (submissionId) => {
    try {
      const response = await getAssessmentDetails(submissionId);

      if (response?.success) {
        setSelectedSubmission({
          id: submissionId,
          details: response.data,
        });
        setAdminPage("submissionDetail");
      } else {
        alert("Failed to load assessment details");
      }
    } catch (err) {
      console.error("View assessment error:", err);
      alert("Failed to load assessment details");
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-6 bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-base text-[#6B6577]">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-6 bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-base text-[#C03058] mb-2">{error}</div>
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
    <div className="px-8 py-6 bg-[#F8F9FA] min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A2E] mb-1 font-serif">
            Welcome Back
          </h1>
          <div className="text-xs text-[#6B6577]">{todayStr}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9963A"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          value={stats.totalAssessments.value}
          label="Total Assessments"
          color="#C9963A"
        />
        <KpiCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4A7AE0"
              strokeWidth="2"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
          value={stats.avgSapiScore.value}
          label="Avg SAPI Score"
          color="#4A7AE0"
        />
        <KpiCard
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#28A868"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          value={`${stats.completionRate.value}%`}
          label="Completion Rate"
          trendLabel="assessments completed"
          color="#28A868"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2.5 mb-4 items-center justify-between relative z-10">
        <div className="flex gap-2.5 items-center flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Country, Name or Ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-[280px] outline-none"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9880B0]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#9880B0" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="#9880B0" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* Country Searchable Dropdown */}
          <div ref={countryDropdownRef} className="relative flex-1 min-w-[140px]">
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="px-2 py-1.5 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-full text-left cursor-pointer flex justify-between items-center"
            >
              <span>
                {selectedCountry ? shortCountry(selectedCountry) : "All Countries"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-[#9880B0] transition-transform duration-200 ${countryDropdownOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {countryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#D0C8BC] rounded-md mt-1 z-[100] shadow-lg max-h-[250px] flex flex-col">
                <div className="p-2 border-b border-[#E5E5E5]">
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search Country..."
                    className="px-2 py-1.5 text-xs border border-[#D0C8BC] rounded w-full box-border outline-none"
                    autoComplete="off"
                  />
                </div>
                <div className="overflow-y-auto max-h-[200px]">
                  <div
                    onClick={() => {
                      setSelectedCountry("");
                      setCountryDropdownOpen(false);
                      setCountrySearch("");
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer text-[#1A1A2E] ${
                      selectedCountry === "" ? "bg-[#F5F3EE]" : "bg-transparent"
                    }`}
                  >
                    All Countries
                  </div>
                  {uniqueCountries
                    .filter((c) =>
                      c.toLowerCase().includes(countrySearch.toLowerCase())
                    )
                    .map((country) => (
                      <div
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setCountryDropdownOpen(false);
                          setCountrySearch("");
                        }}
                        className={`px-3 py-2 text-xs cursor-pointer text-[#1A1A2E] ${
                          selectedCountry === country
                            ? "bg-[#F5F3EE]"
                            : "bg-transparent"
                        }`}
                      >
                        {shortCountry(country)}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Score Range Custom Dropdown */}
          <div ref={scoreDropdownRef} className="relative flex-1 min-w-[140px]">
            <button
              onClick={() => setScoreDropdownOpen(!scoreDropdownOpen)}
              className="px-2 py-1.5 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-full text-left cursor-pointer flex justify-between items-center"
            >
              <span>
                {selectedScoreRange || "All Score Ranges"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-[#9880B0] transition-transform duration-200 ${scoreDropdownOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {scoreDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#D0C8BC] rounded-md mt-1 z-[100] shadow-lg max-h-[250px] overflow-y-auto">
                {[
                  { label: "All Score Ranges", value: "" },
                  { label: "90-100 (Excellent)", value: "90-100" },
                  { label: "70-89 (Good)", value: "70-89" },
                  { label: "50-69 (Average)", value: "50-69" },
                  { label: "Below 50 (Needs Improvement)", value: "Below 50" },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedScoreRange(option.value);
                      setScoreDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-xs cursor-pointer text-[#1A1A2E] ${
                      selectedScoreRange === option.value ? "bg-[#F5F3EE]" : "bg-transparent"
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#C9963A] border-none rounded-md text-xs text-white cursor-pointer flex-shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-[1fr_320px] gap-5">
        {/* Table */}
        <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden">
          <div className="overflow-x-auto relative">
            {filterLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[5]">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-[#E0D8CC] border-t-[#C9963A] rounded-full animate-spin mx-auto mb-2" />
                </div>
              </div>
            )}
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-[#E0D8CC]">
                  {[
                    "Country",
                    "Respondent",
                    "Ministry",
                    "Score",
                    "Tier",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3.5 py-2.5 text-left text-[11px] font-semibold text-[#6B6577] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 && !filterLoading ? (
                  <tr>
                    <td colSpan={7} className="px-3.5 py-10 text-center">
                      <div className="text-sm text-[#6B6577]">No records found</div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub, i) => {
                    const FlagComponent = countryFlagComponents[sub.country];
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => handleViewAssessment(sub.id)}
                        className={`border-b border-[#F0EBE3] cursor-pointer ${
                          i % 2 === 0 ? "bg-white" : "bg-[#FAFBFC]"
                        }`}
                      >
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2">
                            {FlagComponent ? <FlagComponent /> : <span>🏳️</span>}
                            <span className="text-[#1A1A2E] font-medium">
                              {shortCountry(sub.country)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="text-[#1A1A2E] font-medium">
                            {sub.respondentName}
                          </div>
                          <div className="text-[#1A1A2E] text-[11px]">
                            {sub.title}
                          </div>
                        </td>
                        <td className="px-3.5 py-3 text-[#6B6577] text-xs">
                          {sub.ministry.length > 30
                            ? sub.ministry.slice(0, 30) + "…"
                            : sub.ministry}
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[#1A1A2E] text-base font-semibold font-sans">
                              {sub.compositeScore}
                            </span>
                            <span className="text-[#1A1A2E] text-[11px]">/100</span>
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: tierColors[sub.tier] || '#9880B0' }}
                          >
                            {sub.tier}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-[#6B6577] text-xs whitespace-nowrap">
                          {fmtDate(sub.completedAt)}
                        </td>
                        <td className="px-3.5 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAssessment(sub.id);
                            }}
                            className="px-4 py-1.5 bg-transparent border border-[#C9963A] rounded text-xs text-[#C9963A] cursor-pointer transition-all hover:bg-[#C9963A] hover:text-white"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-[#E0D8CC] bg-[#FAFBFC]">
            <div className="text-xs text-[#6B6577]">
              Showing{" "}
              {total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, total)} of {total} results
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-[#E0D8CC] rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border border-[#E0D8CC] rounded text-xs cursor-pointer ${
                      currentPage === page
                        ? "bg-[#1A1A2E] text-white"
                        : "bg-white text-[#1A1A2E]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-[#E0D8CC] rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Top Scoring Countries */}
          <div className="bg-white border border-[#E0D8CC] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3.5">
              Top 5 Scoring Countries
            </h3>
            <div className="flex flex-col gap-3">
              {topCountries.map((country, idx) => {
                const FlagComponent = countryFlagComponents[country.country];
                return (
                  <div key={country.id} className="flex items-center gap-2.5">
                    {FlagComponent ? <FlagComponent /> : <span>🏳️</span>}
                    <div className="flex-1">
                      <div className="text-xs text-[#1A1A2E] font-medium">
                        {shortCountry(country.country)}
                      </div>
                    </div>
                    <div className="w-24 h-1.5 bg-[#F0EBE3] rounded overflow-hidden">
                      <div
                        className={`h-full rounded ${
                          idx === 0 ? "bg-[#28A868]" : idx === 1 ? "bg-[#4A7AE0]" : idx === 2 ? "bg-[#C9963A]" : "bg-[#D0C8BC]"
                        }`}
                        style={{ width: `${country.compositeScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#1A1A2E] font-medium w-10 text-right">
                      {country.compositeScore}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="bg-white border border-[#E0D8CC] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3.5">
              Tier Distribution
            </h3>
            <TierDistributionChart submissions={allSubmissions} />
          </div>

          {/* Completion Rate Chart */}
          <div className="bg-white border border-[#E0D8CC] rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3.5">
              Completion Rate
            </h3>
            <div className="flex items-center justify-center h-20">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: `conic-gradient(#28A868 ${stats.completionRate.value * 3.6}deg, #F0EBE3 0deg)`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                  <span className="text-base font-semibold text-[#1A1A2E]">
                    {stats.completionRate.value}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#28A868]" />
                <span className="text-xs text-[#6B6577]">Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F0EBE3]" />
                <span className="text-xs text-[#6B6577]">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
