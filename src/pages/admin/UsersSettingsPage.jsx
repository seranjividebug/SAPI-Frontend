import { useState, useEffect } from "react";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/authService";
import { formatCreatedAt } from "./components/AdminHelpers";

// ── Constants (defined outside component to prevent re-renders) ───────────────
const roleMapping = {
  Admin: 1,
  Editor: 2,
  Viewer: 3,
};

const reverseRoleMapping = {
  1: "Admin",
  2: "Editor",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "1",
  });

  useEffect(() => {
    const fetchUsers = async () => {
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
        const response = await getUsers(token, { role: 1, page: 1, limit: 10 });

        if (response?.success && response?.data?.users) {
          const mappedUsers = response.data.users.map((user) => ({
            id: user.id,
            name: user.full_name || user.name || "",
            email: user.email,
            role: "Admin", // Always Admin
            status: "Active",
            lastLogin: user.created_at || "-",
          }));
          setUsers(mappedUsers);
          setFilteredUsers(mappedUsers);
        } else if (Array.isArray(response)) {
          // Handle case where API returns array directly
          const mappedUsers = response.map((user) => ({
            id: user.id,
            name: user.full_name || user.name || "",
            email: user.email,
            role: "Admin", // Always Admin
            status: "Active",
            lastLogin: user.created_at || "-",
          }));
          setUsers(mappedUsers);
          setFilteredUsers(mappedUsers);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users");
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query and status
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

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, users]);

  const handleSaveUser = async () => {
    const token =
      localStorage.getItem("sapi_token") ||
      sessionStorage.getItem("sapi_token");

    if (editingUser) {
      try {
        const updateData = {
          full_name: editingUser.name,
          email: editingUser.email,
          role: 1, // Always Admin
        };

        const response = await updateUser(token, editingUser.id, updateData);

        if (response?.success) {
          const apiUser = response.data?.user || {};
          const updatedUsers = users.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  name: apiUser.full_name || editingUser.name,
                  email: apiUser.email || editingUser.email,
                  role: reverseRoleMapping[apiUser.role] || "Admin",
                }
              : u
          );
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setShowAddModal(false);
          setEditingUser(null);
        } else {
          alert(response?.message || "Failed to update user");
        }
      } catch (err) {
        console.error("Failed to update user:", err);
        alert(err.message || "Failed to update user");
      }
    } else {
      try {
        const userData = {
          full_name: formData.full_name,
          email: formData.email,
          role: 1, // Always Admin
        };

        const response = await createUser(token, userData);

        if (response?.success) {
          const apiUser = response.data?.user || {};
          const newUser = {
            id: apiUser.id || Date.now().toString(),
            name: apiUser.full_name || formData.full_name,
            email: apiUser.email || formData.email,
            role: reverseRoleMapping[apiUser.role] || "Admin",
            status: "Active",
            lastLogin: apiUser.created_at || "-",
          };
          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setShowAddModal(false);
          setFormData({ full_name: "", email: "", role: "1" });
        } else {
          alert(response?.message || "Failed to create user");
        }
      } catch (err) {
        console.error("Failed to create user:", err);
        alert(err.message || "Failed to create user");
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
        const updatedUsers = users.filter((u) => u.id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        alert(response?.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert(err.message || "Failed to delete user");
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
          role: "Admin", // Always Admin
        });
      } else {
        setEditingUser({
          ...user,
          role: "Admin", // Always Admin
        });
      }
      setShowAddModal(true);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
      setEditingUser({
        ...user,
        role: "Admin", // Always Admin
      });
      setShowAddModal(true);
    }
  };

  const roleColors = {
    "Super Admin": "#C9963A",
    Admin: "#4A7AE0",
    Editor: "#28A868",
    Viewer: "#6B6577",
  };

  return (
    <div className="px-8 py-4 pb-6 font-sans">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-normal text-[#1A1A2E] mb-1 font-serif">
          Users & Settings
        </h1>
        <div className="text-xs text-[#9880B0]">
          Manage users and system configuration
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E0D8CC] mb-4">
        {[
          { key: "users", label: "Users", count: users.length },
          { key: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 bg-transparent border-none text-xs font-normal cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "border-b-2 border-[#C9963A] text-[#1A1A2E] font-medium"
                : "border-b-2 border-transparent text-[#6B6577]"
            }`}
          >
            {tab.label}
            {tab.count && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
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
          <div className="flex justify-between items-center mb-5">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Search Users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] w-60 outline-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] outline-none"
              >
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#C9963A] text-white border-none rounded-md px-4 py-2 text-xs cursor-pointer flex items-center gap-1.5"
            >
              + Add User
            </button>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="w-10 h-10 border-3 border-[#E0D8CC] border-t-[#C9963A] rounded-full animate-spin mx-auto mb-4" />
              <div className="text-sm text-[#6B6577]">Loading users...</div>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <div className="text-sm text-[#C03058] mb-3">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#1A1A2E] text-white rounded-md cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white border border-[#E0D8CC] rounded-lg overflow-hidden">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F0EBE3]">
                    <th className="px-3.5 py-2.5 text-left text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-3.5 py-2.5 text-left text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3.5 py-2.5 text-left text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3.5 py-2.5 text-left text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-3.5 py-2.5 text-right text-[11px] font-medium text-[#1A1A2E] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3.5 py-10 text-center">
                        <div className="text-sm text-[#6B6577]">
                          No users found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, i) => (
                      <tr
                        key={user.id}
                        className={`border-b border-[#F0EBE3] ${
                          i % 2 === 0 ? "bg-white" : "bg-[#FDFAF6]"
                        }`}
                      >
                        <td className="px-3.5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium bg-[#C9963A20] text-[#C9963A]">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-[#1A1A2E] font-medium">
                                {user.name}
                              </div>
                              <div className="text-[#9880B0] text-[11px]">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <span
                            className="px-2.5 py-0.5 rounded text-[11px] font-medium border-[0.5px]"
                            style={{
                              backgroundColor: `${roleColors[user.role]}20`,
                              color: roleColors[user.role],
                              borderColor: `${roleColors[user.role]}50`,
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`flex items-center gap-1 text-xs ${user.status === "Active" ? "text-[#28A868]" : "text-[#6B6577]"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-[#28A868]" : "bg-[#6B6577]"}`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-[#6B6577] text-xs">
                          {formatCreatedAt(user.lastLogin)}
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="bg-transparent border-none text-[#4A7AE0] text-xs cursor-pointer mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-transparent border-none text-[#C94646] text-xs cursor-pointer"
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
          )}
        </>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="max-w-xl">
          {[
            { label: "Organization Name", value: "SAPI Organization", type: "text" },
            { label: "Support Email", value: "support@sapi.ai", type: "email" },
          ].map((field, idx) => (
            <div key={idx} className="mb-5">
              <label className="block text-xs text-[#6B6577] mb-1.5 uppercase tracking-wider">
                {field.label}
              </label>
              <input
                type={field.type}
                defaultValue={field.value}
                className="w-full px-3 py-2.5 text-xs border border-[#D0C8BC] rounded-md bg-white text-[#1A1A2E] outline-none"
              />
            </div>
          ))}
          <div className="flex gap-2 mt-6">
            <button className="bg-[#C9963A] text-white border-none rounded-md px-5 py-2.5 text-xs cursor-pointer">
              Save Changes
            </button>
            <button className="bg-transparent text-[#6B6577] border border-[#D0C8BC] rounded-md px-5 py-2.5 text-xs cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg w-[400px] p-6">
            <h3 className="mb-5 font-serif text-[#1A1A2E]">
              {editingUser ? "Edit User" : "Add User"}
            </h3>
            <div className="mb-4">
              <label className="block text-xs text-[#6B6577] mb-1.5">
                Full Name
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
                className="w-full px-3 py-2.5 text-xs border border-[#D0C8BC] rounded-md text-[#1A1A2E] bg-white outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-[#6B6577] mb-1.5">
                Email
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
                className="w-full px-3 py-2.5 text-xs border border-[#D0C8BC] rounded-md text-[#1A1A2E] outline-none disabled:bg-[#F5F5F5]"
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-[#6B6577] mb-1.5">Role</label>
              <div
                className="px-3 py-2.5 text-xs border border-[#D0C8BC] rounded-md bg-[#F5F5F5] text-[#6B6577]"
              >
                Admin
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingUser(null);
                  setFormData({ full_name: "", email: "", role: "1" });
                }}
                className="bg-transparent text-[#6B6577] border border-[#D0C8BC] rounded-md px-4 py-2 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="bg-[#C9963A] text-white border-none rounded-md px-4 py-2 text-xs cursor-pointer"
              >
                {editingUser ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
