"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Trash2, UserPlus, Shield, Loader2, Check } from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  role: string;
  allowedModules: string[];
}

const AVAILABLE_MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orders", label: "Orders" },
  { id: "payments", label: "Payments" },
  { id: "products", label: "Products" },
  { id: "categories", label: "Categories" },
  { id: "inventory", label: "Inventory" },
  { id: "customers", label: "Customers" },
  { id: "leads", label: "Leads" },
  { id: "cms", label: "CMS" },
  { id: "coupons", label: "Coupons" },
  { id: "settings", label: "Settings" },
  { id: "admin-team", label: "Admin Team" },
];

export function AdminTeamManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admin_users"));
      const loadedUsers: AdminUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedUsers.push({
          id: doc.id,
          username: data.username,
          role: data.role,
          allowedModules: data.allowedModules || [],
        });
      });
      setUsers(loadedUsers);
    } catch (err) {
      console.error("Error loading admin users:", err);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      setSelectedModules(selectedModules.filter(id => id !== moduleId));
    } else {
      setSelectedModules([...selectedModules, moduleId]);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newRole) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
      await addDoc(collection(db, "admin_users"), {
        username: newUsername,
        password: newPassword, // In a real app, this should be securely hashed via Firebase Auth
        role: newRole,
        allowedModules: selectedModules,
        createdAt: new Date().toISOString()
      });

      // Reset form
      setNewUsername("");
      setNewPassword("");
      setNewRole("");
      setSelectedModules([]);
      
      // Reload users
      await loadUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add new team member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await deleteDoc(doc(db, "admin_users", id));
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A84FF]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Admin Team Management</h1>
        <p className="text-sm text-gray-500">Manage team members and their module access permissions.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="w-5 h-5 text-[#0A84FF]" />
              <h2 className="text-lg font-medium text-gray-900">Add Team Member</h2>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Username</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0A84FF]"
                  placeholder="e.g. warehouse_john"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0A84FF]"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role Title</label>
                <input 
                  type="text" 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#0A84FF]"
                  placeholder="e.g. Warehouse Manager"
                  required
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Module Permissions</label>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {AVAILABLE_MODULES.map((module) => (
                    <label key={module.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-colors">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedModules.includes(module.id) ? "bg-[#0A84FF] border-[#0A84FF]" : "border-gray-300 bg-white"
                      }`}>
                        {selectedModules.includes(module.id) && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm text-gray-700">{module.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#0A1128] hover:bg-[#0A1128]/90 text-white font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Team Member"}
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" /> Current Team Members
              </h2>
              <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{users.length} Active</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{user.username}</h3>
                      <p className="text-sm text-[#0A84FF] font-medium">{user.role}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Access Rights</p>
                    <div className="flex flex-wrap gap-2">
                      {user.allowedModules.length > 0 ? (
                        user.allowedModules.map((modId) => {
                          const modLabel = AVAILABLE_MODULES.find(m => m.id === modId)?.label || modId;
                          return (
                            <span key={modId} className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                              {modLabel}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-gray-400 italic">No modules assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <p className="mb-2">No team members found in the database.</p>
                  <p className="text-sm">Use the form to add your first team member.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
