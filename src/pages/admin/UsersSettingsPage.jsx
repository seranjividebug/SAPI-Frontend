import { useState, useEffect, useCallback } from "react";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/authService";
import { formatCreatedAt } from "./components/AdminHelpers";

// Toast Component
const Toast = ({ visible, message, type = 'error' }) => {
  return (
    <div
      className={`fixed bottom-4 sm:bottom-7 right-4 sm:right-7 z-[9999] bg-[#1A1540] border border-[#2A204A] text-[#FBF5E6] px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-[11px] sm:text-sm flex items-center gap-2 sm:gap-2.5 shadow-lg transition-all duration-300 pointer-events-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type === 'success' ? 'bg-[#28A868]' : 'bg-[#C03058]'}`} />
      {message}
    </div>
  );
};

// ── Constants (defined outside component to prevent re-renders) ───────────────
const roleMapping = {
  Admin: 1,
  User: 2,
  Editor: 2,
  Viewer: 3,
};

const reverseRoleMapping = {
  1: "Admin",
  2: "User",
  3: "Viewer",
};

export default function UsersSettingsPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'error' });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "2", // Default to User
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(8);

  const fetchUsers = useCallback(async () => {
    const token =
      localStorage.getItem("sapi_token") ||
      sessionStorage.getItem("sapi_token");
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch all users without pagination for client-side filtering
      const response = await getUsers(token, { limit: 1000 });

      if (response?.success && response?.data?.users) {
        const mappedUsers = response.data.users.map((user) => ({
          id: user.id,
          name: user.full_name || user.name || "",
          email: user.email,
          role: reverseRoleMapping[user.role] || "Admin",
          status: "Active",
          lastLogin: user.created_at || "-",
        }));
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
        const totalCount = response.data.pagination?.totalCount || response.data.totalCount || response.data.total || mappedUsers.length;
        setTotalUsers(totalCount);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      } else if (Array.isArray(response)) {
        // Handle case where API returns array directly
        const mappedUsers = response.map((user) => ({
          id: user.id,
          name: user.full_name || user.name || "",
          email: user.email,
          role: reverseRoleMapping[user.role] || "Admin",
          status: "Active",
          lastLogin: user.created_at || "-",
        }));
        setUsers(mappedUsers);
        setFilteredUsers(mappedUsers);
        setTotalUsers(mappedUsers.length);
        setTotalPages(Math.ceil(mappedUsers.length / itemsPerPage));
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setTotalUsers(0);
        setTotalPages(1);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
      setUsers([]);
      setFilteredUsers([]);
      setTotalUsers(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search query, status, and role
  useEffect(() => {
    let filtered = [...users];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (roleFilter) {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  }, [searchQuery, statusFilter, roleFilter, users, itemsPerPage]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, roleFilter]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.status-dropdown')) {
        setStatusDropdownOpen(false);
      }
      if (!e.target.closest('.role-dropdown')) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate current users to display based on pagination
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: '', type: 'error' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const handleSaveUser = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("sapi_token") ||
      sessionStorage.getItem("sapi_token");

    // Validate form data
    const name = editingUser ? editingUser.name : formData.full_name;
    const email = editingUser ? editingUser.email : formData.email;
    const role = editingUser ? editingUser.role : formData.role;

    if (!name || !name.trim()) {
      setToast({ visible: true, message: 'Full Name is required', type: 'error' });
      return;
    }

    if (!email || !email.trim()) {
      setToast({ visible: true, message: 'Email is required', type: 'error' });
      return;
    }

    if (!role || !role.trim()) {
      setToast({ visible: true, message: 'Role is required', type: 'error' });
      return;
    }

    setSaving(true);

    if (editingUser) {
      try {
        const updateData = {
          full_name: editingUser.name,
          email: editingUser.email,
          role: roleMapping[editingUser.role] || 1,
        };

        const response = await updateUser(token, editingUser.id, updateData);

        if (response?.success) {
          fetchUsers();
          setShowAddModal(false);
          setEditingUser(null);
          setToast({ visible: true, message: 'User updated successfully', type: 'success' });
        } else {
          setToast({ visible: true, message: response?.message || "Failed to update user", type: 'error' });
        }
      } catch (err) {
        console.error("Failed to update user:", err);
        setToast({ visible: true, message: err.message || "Failed to update user", type: 'error' });
      } finally {
        setSaving(false);
      }
    } else {
      try {
        const userData = {
          full_name: formData.full_name,
          email: formData.email,
          role: parseInt(formData.role) || 1, // Default to Admin if empty
        };

        const response = await createUser(token, userData);

        if (response?.success) {
          setCurrentPage(1);
          fetchUsers();
          setShowAddModal(false);
          setFormData({ full_name: "", email: "", role: "" });
          setToast({ visible: true, message: 'User created successfully', type: 'success' });
        } else {
          setToast({ visible: true, message: response?.message || "Failed to create user", type: 'error' });
        }
      } catch (err) {
        console.error("Failed to create user:", err);
        setToast({ visible: true, message: err.message || "Failed to create user", type: 'error' });
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const token =
      localStorage.getItem("sapi_token") ||
      sessionStorage.getItem("sapi_token");

    try {
      const response = await deleteUser(token, id);

      if (response?.success) {
        fetchUsers();
        setToast({ visible: true, message: 'User deleted successfully', type: 'success' });
      } else {
        setToast({ visible: true, message: response?.message || "Failed to delete user", type: 'error' });
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setToast({ visible: true, message: err.message || "Failed to delete user", type: 'error' });
    }
  };

  const handleEditClick = async (user) => {
    const token =
      localStorage.getItem("sapi_token") ||
      sessionStorage.getItem("sapi_token");

    try {
      const response = await getUserById(token, user.id);

      if (response?.success && response?.data?.user) {
        const apiUser = response.data.user;
        setEditingUser({
          id: apiUser.id,
          name: apiUser.full_name,
          email: apiUser.email,
          role: reverseRoleMapping[apiUser.role] || "1",
        });
      } else {
        setEditingUser({
          ...user,
          role: reverseRoleMapping[user.role] || "1",
        });
      }
      setShowAddModal(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setEditingUser({
        ...user,
        role: reverseRoleMapping[user.role] || "1",
      });
      setShowAddModal(true);
    }
  };

  const roleColors = {
    "Super Admin": "#C9963A",
    Admin: "#4A7AE0",
    User: "#28A868",
    Editor: "#28A868",
    Viewer: "#6B6577",
  };

  return (
    <div className="px-4 sm:px-8 py-4 sm:py-4 pb-6 sm:pb-6 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-4">
        <h1 className="text-[18px] sm:text-xl font-normal text-[#1A1A2E] mb-1 sm:mb-1 font-serif">
          Users & Settings
        </h1>
        <div className="text-[11px] sm:text-xs text-[#9880B0]">
          Manage users and system configuration
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E0D8CC] mb-4 sm:mb-4">
        {[
          { key: "users", label: "Users", count: totalUsers },
          { key: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 bg-transparent border-none text-[11px] sm:text-xs font-normal cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "border-b-2 border-[#C9963A] text-[#1A1A2E] font-medium"
                : "border-b-2 border-transparent text-[#6B6577]"
            }`}
          >
            {tab.label}
            {tab.count && (
              <span
                className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] ${
                  activeTab === tab.key
                    ? "bg-[#C9963A20] text-[#C9963A]"
                    : "bg-[#F0EBE3] text-[#6B6577]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <>
          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-5">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search Users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-full sm:w-60 outline-none"
              />
              <div className="status-dropdown relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="px-3 py-2 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-full sm:w-32 flex justify-between items-center cursor-pointer outline-none"
                >
                  <span>{statusFilter || "All Status"}</span>
                  <svg
                    width="10" height="10" className={`sm:w-[12px] sm:h-[12px] text-[#9880B0] transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-[#D0C8BC] rounded-md mt-1 z-[100] shadow-lg">
                    {["", "Active", "Inactive"].map((option) => (
                      <div
                        key={option}
                        onClick={() => { setStatusFilter(option); setStatusDropdownOpen(false); }}
                        className={`px-3 py-2 text-[10px] sm:text-xs cursor-pointer text-[#1A1A2E] ${
                          statusFilter === option ? "bg-[#F5F3EE]" : "hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {option || "All Status"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="role-dropdown relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="px-3 py-2 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-full sm:w-32 flex justify-between items-center cursor-pointer outline-none"
                >
                  <span>{roleFilter || "All Roles"}</span>
                  <svg
                    width="10" height="10" className={`sm:w-[12px] sm:h-[12px] text-[#9880B0] transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {roleDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-[#D0C8BC] rounded-md mt-1 z-[100] shadow-lg">
                    {["", "Admin", "User"].map((option) => (
                      <div
                        key={option}
                        onClick={() => { setRoleFilter(option); setRoleDropdownOpen(false); }}
                        className={`px-3 py-2 text-[10px] sm:text-xs cursor-pointer text-[#1A1A2E] ${
                          roleFilter === option ? "bg-[#F5F3EE]" : "hover:bg-[#F5F5F5]"
                        }`}
                      >
                        {option || "All Roles"}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#C9963A] text-white border-none rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs cursor-pointer flex items-center gap-1.5 w-full sm:w-auto justify-center"
            >
              + Add User
            </button>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-[#E0D8CC] border-t-[#C9963A] rounded-full animate-spin mx-auto mb-4" />
              <div className="text-[11px] sm:text-sm text-[#6B6577]">Loading users...</div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <div className="text-[11px] sm:text-sm text-[#C03058] mb-3">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1A1A2E] text-white rounded-md cursor-pointer text-[10px] sm:text-xs"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden">
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full border-collapse text-[10px] sm:text-xs min-w-[380px]">
                    <thead>
                      <tr className="bg-[#F0EBE3]">
                        <th className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 text-left text-[9px] sm:text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider whitespace-nowrap w-[35%]">
                          User
                        </th>
                        <th className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 text-left text-[9px] sm:text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider whitespace-nowrap w-[20%]">
                          Role
                        </th>
                        <th className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 text-left text-[9px] sm:text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider whitespace-nowrap w-[20%]">
                          Status
                        </th>
                        <th className="hidden sm:table-cell px-3.5 py-2.5 text-left text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider whitespace-nowrap">
                          Created At
                        </th>
                        <th className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 text-right text-[9px] sm:text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider whitespace-nowrap w-[25%]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-1.5 sm:px-3.5 py-8 sm:py-10 text-center">
                            <div className="text-[11px] sm:text-sm text-[#6B6577]">
                              No users found
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user, i) => (
                          <tr
                            key={user.id}
                            className={`border-b border-[#F0EBE3] ${
                              i % 2 === 0 ? "bg-white" : "bg-[#FDFAF6]"
                            }`}
                          >
                            <td className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 sm:py-3">
                              <div className="flex items-center gap-1.5 sm:gap-2.5">
                                <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-sm font-medium bg-[#C9963A20] text-[#C9963A] flex-shrink-0">
                                  {user.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[#1A1A2E] font-medium text-[10px] sm:text-xs truncate">
                                    {user.name}
                                  </div>
                                  <div className="text-[#9880B0] text-[9px] sm:text-[11px] truncate">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 sm:py-3">
                              <span
                                className="px-1.5 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-[11px] font-medium border-[0.5px] whitespace-nowrap"
                                style={{
                                  backgroundColor: `${roleColors[user.role]}20`,
                                  color: roleColors[user.role],
                                  borderColor: `${roleColors[user.role]}50`,
                                }}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 sm:py-3">
                              <span className={`flex items-center gap-1 text-[9px] sm:text-xs ${user.status === "Active" ? "text-[#28A868]" : "text-[#6B6577]"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.status === "Active" ? "bg-[#28A868]" : "bg-[#6B6577]"}`} />
                                {user.status}
                              </span>
                            </td>
                            <td className="hidden sm:table-cell px-3.5 py-2.5 sm:py-3 text-[#6B6577] text-xs">
                              {formatCreatedAt(user.lastLogin)}
                            </td>
                            <td className="px-1.5 sm:px-3.5 py-2 sm:py-2.5 sm:py-3 text-right">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="bg-transparent border-none text-[#4A7AE0] text-[9px] sm:text-xs cursor-pointer mr-1 sm:mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-transparent border-none text-[#C94646] text-[9px] sm:text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mt-4 sm:mt-4 px-2 sm:px-2">
                  <div className="text-[10px] sm:text-xs text-[#6B6577]">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded text-[10px] sm:text-xs cursor-pointer ${
                        currentPage === 1
                          ? "bg-white border-[#E0D8CC] text-[#C8C0B8] cursor-not-allowed"
                          : "bg-white border-[#E0D8CC] text-[#6B6577] hover:border-[#C9963A]"
                      }`}
                    >
                      ←
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[#E0D8CC] rounded text-[10px] sm:text-xs cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#1A1A2E] text-white"
                              : "bg-white text-[#1A1A2E] hover:border-[#C9963A]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-2.5 sm:px-3 py-1 sm:py-1.5 border rounded text-[10px] sm:text-xs cursor-pointer ${
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
            </>
          )}
        </>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-xl">
          {[
            { label: "Organisation Name", value: "SAPI Organization", type: "text" },
            { label: "Support Email", value: "support@sapi.ai", type: "email" },
          ].map((field, idx) => (
            <div key={idx} className="mb-4 sm:mb-5">
              <label className="block text-[11px] sm:text-xs text-[#6B6577] mb-1.5 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type={field.type}
                defaultValue={field.value}
                className="w-full px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] outline-none"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-4 sm:mt-6">
            <button className="bg-[#C9963A] text-white border-none rounded-md px-4 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs cursor-pointer">
              Save Changes
            </button>
            <button className="bg-transparent text-[#6B6577] border border-[#D0C8BC] rounded-md px-4 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg w-full max-w-[400px] p-4 sm:p-6">
            <h3 className="mb-4 sm:mb-5 font-serif text-[#1A1A2E] text-sm sm:text-base">
              {editingUser ? "Edit User" : "Add User"}
            </h3>
            <form onSubmit={handleSaveUser}>
              <div className="mb-3 sm:mb-4">
              <label className="block text-[11px] sm:text-xs text-[#6B6577] mb-1.5">
                Full Name <span className="text-[#C03058]">*</span>
              </label>
              <input
                type="text"
                value={editingUser ? editingUser.name : formData.full_name}
                onChange={(e) => {
                  if (editingUser) {
                    setEditingUser({ ...editingUser, name: e.target.value });
                  } else {
                    setFormData({ ...formData, full_name: e.target.value });
                  }
                }}
                className="w-full px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md text-[#1A1A2E] bg-white outline-none"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label className="block text-[11px] sm:text-xs text-[#6B6577] mb-1.5">
                Email <span className="text-[#C03058]">*</span>
              </label>
              <input
                type="email"
                value={editingUser ? editingUser.email : formData.email}
                onChange={(e) => {
                  if (editingUser) {
                    setEditingUser({ ...editingUser, email: e.target.value });
                  } else {
                    setFormData({ ...formData, email: e.target.value });
                  }
                }}
                disabled={!!editingUser}
                className="w-full px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs border border-[#D0C8BC] rounded-md text-[#1A1A2E] outline-none disabled:bg-[#F5F5F5]"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label className="block text-[11px] sm:text-xs text-[#6B6577] mb-1.5">Role <span className="text-[#C03058]">*</span></label>
              <select
                required
                value={editingUser ? (roleMapping[editingUser.role] || editingUser.role) : formData.role}
                onChange={(e) => {
                  const roleValue = e.target.value;
                  if (editingUser) {
                    setEditingUser({ ...editingUser, role: roleValue });
                  } else {
                    setFormData({ ...formData, role: roleValue });
                  }
                }}
                className="w-full px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs border border-[#D0C8CC] rounded-md text-[#1A1A2E] bg-white outline-none"
              >
                <option value="">Select role</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setFormData({ full_name: "", email: "", role: "" });
                }}
                className="bg-transparent text-[#6B6577] border border-[#D0C8BC] rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#C9963A] text-white border-none rounded-md px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingUser ? "Saving..." : "Adding..."}
                  </>
                ) : (
                  editingUser ? "Save" : "Add"
                )}
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />
    </div>
  );
}
