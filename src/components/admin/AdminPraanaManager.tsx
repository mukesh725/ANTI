"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, Heart, Thermometer, Wind, Gauge, Scale, 
  Search, Plus, RefreshCw, CheckCircle2, AlertTriangle, 
  Trash2, Download, User, ShieldCheck, Sparkles, Clock, 
  FileJson, Eye, ChevronDown, Check, Zap, Info
} from "lucide-react";
import { PraanaVitalRecord, PatientSearchResult } from "@/types/praana";

export function AdminPraanaManager() {
  // Search & Patient State
  const [searchQuery, setSearchQuery] = useState("");
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);

  // Vitals Form State
  const [formData, setFormData] = useState({
    heartRate: 74,
    pulseRate: 74,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    spo2: 98,
    respiratoryRate: 16,
    temperatureF: 98.6,
    weightLbs: 152.4,
    ecgStatus: "Normal Sinus Rhythm",
    chairSignalQuality: 0.99,
    stressScore: 22,
    notes: "",
    recordedBy: "Praana Clinic Terminal #01",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // History State
  const [vitalsHistory, setVitalsHistory] = useState<PraanaVitalRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyFilter, setHistoryFilter] = useState("");
  const [viewingRecord, setViewingRecord] = useState<PraanaVitalRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search Patients
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/praana/patients/search?q=${encodeURIComponent(searchQuery.trim())}`);
          const data = await res.json();
          if (data.success) {
            setPatientResults(data.patients || []);
          }
        } catch (err) {
          console.error("Error searching patients:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setPatientResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Vitals History
  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/praana/vitals?limit=100');
      const data = await res.json();
      if (data.success) {
        setVitalsHistory(data.vitals || []);
      }
    } catch (err) {
      console.error("Error fetching vitals history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Quick Preset Simulator
  const handleSimulateChair = () => {
    const randomHR = Math.floor(Math.random() * (85 - 68 + 1)) + 68;
    const randomSys = Math.floor(Math.random() * (124 - 114 + 1)) + 114;
    const randomDia = Math.floor(Math.random() * (82 - 72 + 1)) + 72;
    const randomSpo2 = Math.floor(Math.random() * (100 - 97 + 1)) + 97;
    const randomRR = Math.floor(Math.random() * (19 - 14 + 1)) + 14;
    const randomTemp = (98.2 + Math.random() * 0.7).toFixed(1);

    setFormData(prev => ({
      ...prev,
      heartRate: randomHR,
      pulseRate: randomHR,
      bloodPressureSystolic: randomSys,
      bloodPressureDiastolic: randomDia,
      spo2: randomSpo2,
      respiratoryRate: randomRR,
      temperatureF: parseFloat(randomTemp),
      ecgStatus: "Normal Sinus Rhythm",
      chairSignalQuality: 0.99,
      stressScore: Math.floor(Math.random() * 20) + 15,
      notes: "Chair Session Telemetry Tele-Scan Calibrated via Optical PPG & Load-cell.",
    }));
  };

  // Submit Vitals
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Please search and select a patient first.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const payload = {
        patientId: selectedPatient.id,
        accountId: selectedPatient.accountId,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.phone,
        patientEmail: selectedPatient.email,
        ...formData,
      };

      const res = await fetch('/api/praana/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Telemetry recorded for ${selectedPatient.name}!`);
        fetchHistory();
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        alert(data.error || "Failed to record vitals");
      }
    } catch (err) {
      console.error("Error submitting vitals:", err);
      alert("An error occurred while saving vitals.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Record
  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this telemetry record?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/praana/vitals?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setVitalsHistory(prev => prev.filter(r => r.id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (vitalsHistory.length === 0) return;
    const headers = [
      "Session ID", "Patient ID", "Account Phone", "Patient Name", 
      "Heart Rate (BPM)", "Blood Pressure", "SpO2 (%)", "Resp Rate", 
      "Temp (°F)", "Weight (lbs)", "ECG", "Timestamp", "Recorded By"
    ];

    const rows = vitalsHistory.map(r => [
      r.sessionId,
      r.patientId,
      r.accountId,
      `"${r.patientName}"`,
      r.heartRate,
      `"${r.bloodPressureSystolic}/${r.bloodPressureDiastolic}"`,
      r.spo2,
      r.respiratoryRate,
      r.temperatureF,
      r.weightLbs,
      `"${r.ecgStatus}"`,
      r.timestamp,
      `"${r.recordedBy}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `praana_vitals_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter History Table
  const filteredHistory = vitalsHistory.filter(r => {
    if (!historyFilter) return true;
    const q = historyFilter.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.patientId.toLowerCase().includes(q) ||
      r.accountId.toLowerCase().includes(q) ||
      r.sessionId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0A1128] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Clinical Telemetry Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-white">
            Praana Smart Chair Vitals Module
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mt-1">
            Capture, calibrate, and sync clinical vital signs across Web, Mobile Apps, and Cloud EHR for registered members and family dependents.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={fetchHistory}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? "animate-spin" : ""}`} /> Refresh Data
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Telemetry CSV
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Grid: 1. Input Station & 2. Telemetry Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Patient Lookup (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-emerald-600" /> Record Vitals Terminal
              </h2>
              <p className="text-xs text-gray-500">Select patient and input smart chair measurements</p>
            </div>
            <button 
              type="button"
              onClick={handleSimulateChair}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200/60 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Auto-Simulate Scan
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Patient Search & Select */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                1. Patient Lookup (Patient ID, Phone, Email, or Name)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input 
                  type="text"
                  placeholder="Type to search (e.g. mukesh, 9440119902, AIRO-1000007)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3 w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {patientResults.length > 0 && (
                <div className="absolute z-30 left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {patientResults.map(p => (
                    <div 
                      key={`${p.role}-${p.id}`}
                      onClick={() => {
                        setSelectedPatient(p);
                        setSearchQuery("");
                        setPatientResults([]);
                      }}
                      className="p-3.5 hover:bg-emerald-50/70 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                          {p.name}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            p.role === 'primary' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {p.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-3 font-mono">
                          <span>ID: {p.id}</span>
                          <span>Phone: {p.phone || p.accountId}</span>
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Patient Badge */}
              {selectedPatient && (
                <div className="mt-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        {selectedPatient.name}
                        <Check className="w-4 h-4 text-emerald-600" />
                      </h4>
                      <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
                        <span><strong>Patient ID:</strong> {selectedPatient.id}</span>
                        <span><strong>Parent Account:</strong> {selectedPatient.accountId}</span>
                        {selectedPatient.email && <span><strong>Email:</strong> {selectedPatient.email}</span>}
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="text-xs text-gray-500 hover:text-red-600 font-bold underline"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Clinical Vitals Inputs */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                2. Enter Clinical Vitals & Telemetry
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Heart Rate */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> Heart Rate</span>
                    <span className="text-[10px] text-gray-400 font-normal">60-100 BPM</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={formData.heartRate}
                      onChange={e => setFormData({ ...formData, heartRate: Number(e.target.value), pulseRate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">BPM</span>
                  </div>
                </div>

                {/* Blood Pressure Systolic */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-blue-500" /> BP Systolic</span>
                    <span className="text-[10px] text-gray-400 font-normal">90-120 mmHg</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={e => setFormData({ ...formData, bloodPressureSystolic: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">mmHg</span>
                  </div>
                </div>

                {/* Blood Pressure Diastolic */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-blue-400" /> BP Diastolic</span>
                    <span className="text-[10px] text-gray-400 font-normal">60-80 mmHg</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={e => setFormData({ ...formData, bloodPressureDiastolic: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">mmHg</span>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-cyan-500" /> Blood Oxygen</span>
                    <span className="text-[10px] text-gray-400 font-normal">95-100%</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={formData.spo2}
                      onChange={e => setFormData({ ...formData, spo2: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">%</span>
                  </div>
                </div>

                {/* Respiration Rate */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Wind className="w-3.5 h-3.5 text-teal-500" /> Respiration</span>
                    <span className="text-[10px] text-gray-400 font-normal">12-24 rpm</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={formData.respiratoryRate}
                      onChange={e => setFormData({ ...formData, respiratoryRate: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">rpm</span>
                  </div>
                </div>

                {/* Body Temperature */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-amber-500" /> Body Temp</span>
                    <span className="text-[10px] text-gray-400 font-normal">97.8-99.1°F</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      value={formData.temperatureF}
                      onChange={e => setFormData({ ...formData, temperatureF: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">°F</span>
                  </div>
                </div>

                {/* Weight */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Scale className="w-3.5 h-3.5 text-indigo-500" /> Body Load</span>
                    <span className="text-[10px] text-gray-400 font-normal">Load-cell</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      step="0.1"
                      value={formData.weightLbs}
                      onChange={e => setFormData({ ...formData, weightLbs: Number(e.target.value) })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-base font-bold text-gray-900 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500 font-medium">lbs</span>
                  </div>
                </div>

                {/* ECG Status */}
                <div className="p-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-purple-500" /> Lead I/II ECG</span>
                    <span className="text-[10px] text-gray-400 font-normal">Dry-Contact Electrodes</span>
                  </label>
                  <select 
                    value={formData.ecgStatus}
                    onChange={e => setFormData({ ...formData, ecgStatus: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Normal Sinus Rhythm">Normal Sinus Rhythm</option>
                    <option value="Sinus Bradycardia">Sinus Bradycardia (&lt; 60 bpm)</option>
                    <option value="Sinus Tachycardia">Sinus Tachycardia (&gt; 100 bpm)</option>
                    <option value="Sinus Arrhythmia">Sinus Arrhythmia</option>
                    <option value="Inconclusive / Motion Artifact">Inconclusive / Motion Artifact</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Clinical Notes & Observations</label>
                <textarea 
                  rows={2}
                  placeholder="Optional clinic notes or telemetry calibration remarks..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting || !selectedPatient}
              className="w-full py-3.5 bg-[#006537] hover:bg-[#004e2a] disabled:bg-gray-300 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Syncing with Cloud Telemetry...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Save & Sync Praana Vitals
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Telemetry Preview Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Live Telemetry Preview
            </h3>
            <p className="text-xs text-gray-500">Calculated clinical edge summary based on active inputs</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* HR Card */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Heart Rate</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-rose-950">{formData.heartRate}</span>
                  <span className="text-xs text-rose-700 font-bold ml-1">BPM</span>
                </div>
                <span className="text-[10px] text-rose-600 font-medium">
                  {formData.heartRate >= 60 && formData.heartRate <= 100 ? "Normal Range" : "Elevated / Low"}
                </span>
              </div>

              {/* BP Card */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Blood Pressure</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-blue-950">
                    {formData.bloodPressureSystolic}/{formData.bloodPressureDiastolic}
                  </span>
                  <span className="text-xs text-blue-700 font-bold ml-1">mmHg</span>
                </div>
                <span className="text-[10px] text-blue-600 font-medium">Optimal Hemodynamics</span>
              </div>

              {/* SpO2 Card */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">Blood Oxygen</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-cyan-950">{formData.spo2}</span>
                  <span className="text-xs text-cyan-700 font-bold ml-1">%</span>
                </div>
                <span className="text-[10px] text-cyan-600 font-medium">Arterial Saturation</span>
              </div>

              {/* Temp Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Core Temp</span>
                <div className="my-2">
                  <span className="text-2xl font-black text-amber-950">{formData.temperatureF}</span>
                  <span className="text-xs text-amber-700 font-bold ml-1">°F</span>
                </div>
                <span className="text-[10px] text-amber-600 font-medium">Basal Thermal Rhythm</span>
              </div>
            </div>

            {/* Chair Signal Badge */}
            <div className="p-4 rounded-2xl bg-[#0A1128] text-white flex items-center justify-between mt-4">
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Praana-OS v2.4 Certified
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                  Optical PPG: 99% • Load-Cell: Calibrated
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-500/30">
                Live Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Historical Telemetry Log Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Recent Praana Telemetry Sessions
            </h3>
            <p className="text-xs text-gray-500">Historical records saved across all registered members & patients</p>
          </div>

          <div className="w-full sm:w-72">
            <input 
              type="text"
              placeholder="Filter by patient, ID, or phone..."
              value={historyFilter}
              onChange={e => setHistoryFilter(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-100/70 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4">Patient Details</th>
                <th className="p-4">Heart Rate</th>
                <th className="p-4">Blood Pressure</th>
                <th className="p-4">SpO2</th>
                <th className="p-4">Respiration</th>
                <th className="p-4">Temp</th>
                <th className="p-4">ECG Status</th>
                <th className="p-4">Recorded</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {historyLoading ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading Praana records...
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400">
                    No Praana telemetry sessions recorded yet. Use the terminal above to log a session.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Patient */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{rec.patientName}</div>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        ID: {rec.patientId} • Tel: {rec.patientPhone || rec.accountId}
                      </div>
                    </td>

                    {/* HR */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{rec.heartRate}</span>
                      <span className="text-xs text-gray-500 ml-1">bpm</span>
                    </td>

                    {/* BP */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{rec.bloodPressureSystolic}/{rec.bloodPressureDiastolic}</span>
                      <span className="text-xs text-gray-500 ml-1">mmHg</span>
                    </td>

                    {/* SpO2 */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{rec.spo2}%</span>
                    </td>

                    {/* Respiration */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{rec.respiratoryRate}</span>
                      <span className="text-xs text-gray-500 ml-1">rpm</span>
                    </td>

                    {/* Temp */}
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{rec.temperatureF}°F</span>
                    </td>

                    {/* ECG */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {rec.ecgStatus || "Normal Sinus"}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(rec.timestamp).toLocaleDateString()} {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => setViewingRecord(rec)}
                        className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                        title="View Full JSON / Telemetry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRecord(rec.id)}
                        disabled={deletingId === rec.id}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A1128] text-white p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-white/10 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h4 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                <FileJson className="w-5 h-5" /> Telemetry Payload ({viewingRecord.sessionId})
              </h4>
              <button 
                onClick={() => setViewingRecord(null)}
                className="text-gray-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <pre className="bg-black/60 p-4 rounded-2xl text-xs font-mono text-emerald-300 max-h-96 overflow-y-auto custom-scrollbar border border-white/5">
              {JSON.stringify(viewingRecord, null, 2)}
            </pre>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
