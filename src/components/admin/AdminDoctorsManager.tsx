"use client";

import { useState, useEffect } from "react";
import { 
  Stethoscope, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Upload, FileText, ArrowLeft, ShieldCheck, UserCheck, 
  ExternalLink, Eye, Key, Phone, Mail, Award, Calendar, RefreshCw
} from "lucide-react";
import Image from "next/image";

interface Doctor {
  id: string;
  doctorId?: string;
  name: string;
  degree: string;
  registrationNumber: string;
  registrationExpiryDate?: string | null;
  experienceYears: number;
  email: string;
  phone: string;
  password?: string;
  specialty: string;
  clinicName?: string;
  city?: string;
  bio?: string;
  profilePhotoUrl?: string | null;
  digitalSignatureUrl?: string | null;
  status: "active" | "inactive";
  isFeatured: boolean;
  consultationFee: number;
  categories?: string[];
  supportingDocuments?: Array<{ name: string; url: string; uploadedAt: string }>;
  createdAt?: string;
}

export function AdminDoctorsManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form States matching the user's Add Doctor screenshot
  const [fullName, setFullName] = useState("");
  const [degree, setDegree] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regExpiry, setRegExpiry] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(5);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portalPassword, setPortalPassword] = useState("password123");

  const [specialty, setSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [consultationFee, setConsultationFee] = useState<number>(499);

  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [accountStatus, setAccountStatus] = useState<"active" | "inactive">("active");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [supportingDocs, setSupportingDocs] = useState<Array<{ name: string; url: string; type?: string }>>([]);
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocUrl, setUploadDocUrl] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getAdminHeaders = (includeContentType = true) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('airo_admin_token') || '' : '';
    const headers: Record<string, string> = {};
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/doctors", {
        headers: getAdminHeaders(false),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
      }
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingDoctor(null);
    setFullName("");
    setDegree("");
    setRegNumber("");
    setRegExpiry("");
    setExperienceYears(5);
    setEmail("");
    setPhone("");
    setPassword("");
    setSpecialty("General Physician");
    setClinicName("AIRO Health Hub");
    setCity("Hyderabad");
    setBio("");
    setConsultationFee(499);
    setProfilePhotoUrl("");
    setDigitalSignatureUrl("");
    setIsFeatured(false);
    setCategoriesInput("General Physician");
    setSupportingDocs([]);
    setUploadDocName("");
    setUploadDocUrl("");
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (doc: Doctor) => {
    setEditingDoctor(doc);
    setFullName(doc.name);
    setDegree(doc.degree);
    setRegNumber(doc.registrationNumber);
    setRegExpiry(doc.registrationExpiryDate || "");
    setExperienceYears(doc.experienceYears);
    setEmail(doc.email);
    setPhone(doc.phone);
    setPassword(doc.password || "");
    setSpecialty(doc.specialty);
    setClinicName(doc.clinicName || "");
    setCity(doc.city || "");
    setBio(doc.bio || "");
    setConsultationFee(doc.consultationFee || 499);
    setProfilePhotoUrl(doc.profilePhotoUrl || "");
    setDigitalSignatureUrl(doc.digitalSignatureUrl || "");
    setIsFeatured(doc.isFeatured);
    setCategoriesInput(doc.categories ? doc.categories.join(", ") : doc.specialty);
    setSupportingDocs(doc.supportingDocuments || []);
    setUploadDocName("");
    setUploadDocUrl("");
    setErrorMsg("");
    setSuccessMsg("");
    setIsFormOpen(true);
  };

  const handleAddSupportingDoc = () => {
    if (!uploadDocName.trim() || !uploadDocUrl.trim()) {
      alert("Please provide both document title and URL/link.");
      return;
    }
    setSupportingDocs(prev => [
      ...prev,
      { name: uploadDocName.trim(), url: uploadDocUrl.trim(), type: "Document" }
    ]);
    setUploadDocName("");
    setUploadDocUrl("");
  };

  const handleRemoveSupportingDoc = (idx: number) => {
    setSupportingDocs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName || !degree || !regNumber || !email || !phone || !specialty) {
      setErrorMsg("Please fill in all mandatory fields marked with an asterisk (*).");
      setIsSaving(false);
      return;
    }

    const categoriesArray = categoriesInput
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);

    const payload = {
      name: fullName,
      degree,
      registrationNumber: regNumber,
      registrationExpiryDate: regExpiry || null,
      experienceYears: Number(experienceYears) || 0,
      email,
      phone,
      password: portalPassword,
      specialty,
      clinicName,
      city,
      bio,
      profilePhotoUrl: profilePhotoUrl.trim() || null,
      digitalSignatureUrl: digitalSignatureUrl.trim() || null,
      isFeatured,
      status: accountStatus,
      consultationFee: Number(consultationFee) || 499,
      categories: categoriesArray.length > 0 ? categoriesArray : [specialty],
    };

    try {
      let res;
      if (editingDoctor) {
        res = await fetch("/api/admin/doctors", {
          method: "PATCH",
          headers: getAdminHeaders(true),
          body: JSON.stringify({ id: editingDoctor.id, ...payload }),
        });
      } else {
        res = await fetch("/api/admin/doctors", {
          method: "POST",
          headers: getAdminHeaders(true),
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save doctor.");
      }

      setSuccessMsg(editingDoctor ? "Doctor updated successfully." : "New doctor onboarded successfully with portal access!");
      setTimeout(() => setSuccessMsg(""), 4000);
      setIsFormOpen(false);
      fetchDoctors();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while saving doctor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the medical registry?`)) return;

    try {
      const res = await fetch(`/api/admin/doctors?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: getAdminHeaders(false),
      });
      if (res.ok) {
        fetchDoctors();
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  const handleToggleStatus = async (doc: Doctor) => {
    const newStatus = doc.status === "active" ? "inactive" : "active";
    try {
      await fetch("/api/admin/doctors", {
        method: "PATCH",
        headers: getAdminHeaders(true),
        body: JSON.stringify({ id: doc.id, status: newStatus }),
      });
      fetchDoctors();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredDoctors = doctors.filter(d => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.registrationNumber?.toLowerCase().includes(q) ||
      d.email.toLowerCase().includes(q) ||
      d.phone.includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg("")} className="text-emerald-600 hover:text-emerald-800">✕</button>
        </div>
      )}

      {/* View Switch: Add/Edit Form vs Doctors Table */}
      {isFormOpen ? (
        /* ADD / EDIT DOCTOR FORM (EXACT MATCH OF SCREENSHOT) */
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1.5 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Doctors Directory
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {editingDoctor ? "Edit Doctor Profile" : "Add doctor"}
              </h1>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 text-sm">
            {/* 1. Identity Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Identity</h3>
                <p className="text-xs text-gray-500">Legal name and medical registration details</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Mukesh Kumar"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Degree / qualification *</label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. MD general medicine"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Registration number *</label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. 465862 / TSMC 20642"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Registration expiry date</label>
                  <input
                    type="date"
                    value={regExpiry}
                    onChange={(e) => setRegExpiry(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Years of experience *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Contact Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Contact</h3>
                <p className="text-xs text-gray-500">Login email and phone for portal access</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@akronpharma.com"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(341) 336-4431 / 9110794027"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Portal Password / PIN</label>
                  <input
                    type="text"
                    value={portalPassword}
                    onChange={(e) => setPortalPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Practice Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Practice</h3>
                <p className="text-xs text-gray-500">Specialty, clinic details, and public bio</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Specialty *</label>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="e.g. general medicine"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Clinic name</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. AIRO Health Care Center"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Dedicated physician with clinical expertise in internal medicine..."
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                />
              </div>

              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5 focus:border-blue-600"
                />
              </div>
            </div>

            {/* 4. Profile & Signature */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Profile & signature</h3>
                <p className="text-xs text-gray-500">Shown on the doctor profile and prescriptions</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Profile Photo */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-3">
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Profile photo</h4>
                    <p className="text-[11px] text-gray-500">
                      Background-removed portrait used where the doctor sits on artwork, like the homepage strip
                    </p>
                  </div>

                  <input
                    type="url"
                    value={profilePhotoUrl}
                    onChange={(e) => setProfilePhotoUrl(e.target.value)}
                    placeholder="Paste photo URL (https://...)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />

                  {profilePhotoUrl && (
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                      <img
                        src={profilePhotoUrl}
                        alt="Doctor Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                      />
                      <span className="text-xs text-emerald-600 font-medium">Photo linked & verified</span>
                    </div>
                  )}
                </div>

                {/* Digital Signature */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-3">
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Digital signature</h4>
                    <p className="text-[11px] text-gray-500">
                      Optional — used on prescriptions. PNG with transparent background works best.
                    </p>
                  </div>

                  <input
                    type="url"
                    value={digitalSignatureUrl}
                    onChange={(e) => setDigitalSignatureUrl(e.target.value)}
                    placeholder="Paste signature URL (https://...)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-600"
                  />

                  {digitalSignatureUrl && (
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200">
                      <img
                        src={digitalSignatureUrl}
                        alt="Signature Preview"
                        className="h-10 object-contain bg-slate-50 p-1 rounded"
                      />
                      <span className="text-xs text-emerald-600 font-medium">Signature loaded</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5. Listing & Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Listing & status</h3>
                <p className="text-xs text-gray-500">Featured placement and account visibility</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50/60 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="featuredDoc"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="featuredDoc" className="text-xs text-gray-700 cursor-pointer">
                  <strong>Featured doctor</strong> &mdash; Highlight this doctor in category listings. Lower sort order appears first.
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Account status</label>
                <div className="inline-flex p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAccountStatus("active")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      accountStatus === "active" ? "bg-amber-900 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountStatus("inactive")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      accountStatus === "inactive" ? "bg-amber-900 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Categories */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-gray-900">Categories</h3>
              <p className="text-xs text-gray-500">
                Comma-separated clinical categories (e.g. General Medicine, Primary Care, Respiratory, Dermatology)
              </p>
              <input
                type="text"
                value={categoriesInput}
                onChange={(e) => setCategoriesInput(e.target.value)}
                placeholder="e.g. General Medicine, Internal Medicine, Respiratory"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-7 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving Doctor..." : editingDoctor ? "Update Doctor" : "Add doctor"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MAIN DOCTORS DIRECTORY TABLE */
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl text-gray-900 font-bold tracking-tight">Physician Directory & Registry</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage registered doctors, portal access, and clinical assignments ({doctors.length} onboarded).
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doctors by name, specialty, reg #..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5"
                />
              </div>

              <button
                onClick={handleOpenAddForm}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Doctor
              </button>

              <a
                href="/doctor/portal"
                target="_blank"
                className="px-4 py-2 bg-[#0A1128] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                Open Doctor Portal
              </a>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 flex justify-center items-center">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-sm text-gray-500">Loading verified doctors...</span>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center text-gray-500 text-sm">
                No doctors found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Specialty & Degree</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Registration</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact & Portal</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/70 transition-colors">
                        {/* Doctor Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            {doc.profilePhotoUrl ? (
                              <img
                                src={doc.profilePhotoUrl}
                                alt={doc.name}
                                className="w-11 h-11 rounded-xl object-cover border border-gray-200 shrink-0"
                              />
                            ) : (
                              <div className="w-11 h-11 rounded-xl bg-slate-900 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                                {doc.name.replace(/Dr\.?\s*/i, "").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-gray-900">{doc.name}</span>
                                {doc.isFeatured && (
                                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">{doc.experienceYears} yrs experience</span>
                            </div>
                          </div>
                        </td>

                        {/* Specialty & Degree */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">{doc.specialty}</div>
                          <div className="text-xs text-gray-500">{doc.degree}</div>
                        </td>

                        {/* Registration */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            {doc.registrationNumber || "Unverified"}
                          </span>
                          {doc.registrationExpiryDate && (
                            <p className="text-[11px] text-gray-400 mt-0.5">Exp: {doc.registrationExpiryDate}</p>
                          )}
                        </td>

                        {/* Contact & Portal */}
                        <td className="py-4 px-6">
                          <div className="text-xs font-medium text-gray-800">{doc.email}</div>
                          <div className="text-xs text-gray-500">{doc.phone}</div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggleStatus(doc)}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                              doc.status === "active"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${doc.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                            {doc.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditForm(doc)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Doctor"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
