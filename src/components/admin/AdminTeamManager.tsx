"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { Loader2, Plus, Star, X } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "disabled";
  lastLogin?: string; // Stored as ISO string
  allowedModules: string[];
}

const PREDEFINED_ROLES = [
  { id: "super_admin", label: "Super admin — full access to everything", roleName: "Super admin", modules: ["all"] },
  { id: "admin", label: "Admin", roleName: "Admin", modules: ["dashboard", "orders", "products", "customers", "leads", "cms", "settings", "admin-team"] },
  { id: "warehouse_manager", label: "Warehouse Manager", roleName: "Warehouse Manager", modules: ["orders", "inventory"] },
];

export function AdminTeamManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "super_admin"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admin_users"));
      const loadedUsers: AdminUser[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedUsers.push({
          id: docSnap.id,
          name: data.name || data.username || "Unknown",
          email: data.email || "",
          role: data.role || "Admin",
          status: data.status || "active",
          lastLogin: data.lastLogin || null,
          allowedModules: data.allowedModules || [],
        });
      });
      setUsers(loadedUsers);
    } catch (err) {
      console.error("Error loading admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", roleId: "super_admin" });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    const roleId = PREDEFINED_ROLES.find(r => r.roleName === user.role)?.id || "super_admin";
    setFormData({ name: user.name, email: user.email, password: "", roleId });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedRole = PREDEFINED_ROLES.find(r => r.id === formData.roleId);
      if (!selectedRole) throw new Error("Invalid role selected");

      const userData: Record<string, unknown> = {
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        role: selectedRole.roleName,
        allowedModules: selectedRole.modules,
      };

      if (formData.password) {
        userData.password = formData.password;
      }

      if (editingUser) {
        // Update existing user
        await updateDoc(doc(db, "admin_users", editingUser.id), userData);
      } else {
        // Add new user
        userData.status = "active";
        userData.createdAt = new Date().toISOString();
        if (!userData.password) throw new Error("Password is required for new users");
        await addDoc(collection(db, "admin_users"), userData);
      }

      closeModal();
      await loadUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user. Make sure all required fields are filled.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    try {
      const newStatus = user.status === "active" ? "disabled" : "active";
      await updateDoc(doc(db, "admin_users", user.id), { status: newStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A84FF]" />
      </div>
    );
  }

  const superAdminCount = users.filter(u => u.role === "Super admin").length;
  const activeCount = users.filter(u => u.status === "active").length;

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-t-2xl shadow-sm border border-gray-100">
        <h1 className="text-[22px] font-semibold text-[#111827]">Admin team</h1>
        <button 
          onClick={openAddModal}
          className="bg-[#0A1128] hover:bg-[#0A1128]/90 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite admin
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Sub Header / Stats */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-[#111827]">Admin team</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            {users.length} members · <span className="text-blue-600 font-medium">{superAdminCount} super admins</span> · <span className="text-emerald-600 font-medium">{activeCount} active</span>
          </p>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[35%]">Member</th>
                <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%]">Role</th>
                <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[15%]">Status</th>
                <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-[25%]">Last Login</th>
                <th className="py-3 px-6 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  {/* Member Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0 ${
                        user.role === 'Super admin' ? 'bg-emerald-500' : 
                        user.role === 'Warehouse Manager' ? 'bg-indigo-500' : 'bg-cyan-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                          {user.email === "admin@airo.dev" && (
                            <span className="text-[10px] font-medium text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded uppercase">You</span>
                          )}
                        </div>
                        <p className="text-[13px] text-gray-500 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="py-4 px-6">
                    {user.role === "Super admin" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                        <Star className="w-3 h-3 fill-blue-600" />
                        Super admin
                      </span>
                    ) : user.role === "Warehouse Manager" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-semibold border border-orange-200">
                        Warehouse Manager
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200">
                        {user.role}
                      </span>
                    )}
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-6">
                    {user.status === "active" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold tracking-wide">
                        active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold tracking-wide">
                        disabled
                      </span>
                    )}
                  </td>

                  {/* Last Login Column */}
                  <td className="py-4 px-6 text-[13px] text-gray-500">
                    {formatLastLogin(user.lastLogin)}
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="px-4 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(user)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                          user.status === "active" 
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200" 
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                        }`}
                      >
                        {user.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#111827]">
                {editingUser ? `Edit · ${editingUser.name}` : "Invite Admin"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveUser} className="p-6">
              <div className="border border-gray-200 rounded-xl p-6 space-y-6">
                
                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Account Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                      placeholder="e.g. john@airo.dev"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    {editingUser ? "New Password" : "Password *"}
                  </label>
                  <input 
                    type="password" 
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder={editingUser ? "Leave blank to keep current password" : "Create a strong password"}
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Role</label>
                  <div className="relative">
                    <select 
                      value={formData.roleId}
                      onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                      className="w-full appearance-none border border-gray-200 bg-[#5A87FF] text-white font-medium rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      style={{
                        backgroundColor: formData.roleId === "super_admin" ? "#5A87FF" : "white",
                        color: formData.roleId === "super_admin" ? "white" : "#111827",
                      }}
                    >
                      {PREDEFINED_ROLES.map(role => (
                        <option key={role.id} value={role.id} className="bg-white text-gray-900">
                          {role.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron to match the style */}
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${formData.roleId === "super_admin" ? "text-white" : "text-gray-500"}`}>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#0A1128] hover:bg-[#0A1128]/90 rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
