"use client";

import { useState } from "react";
import { Users, ChevronDown, User, ShieldAlert, Lock, UserPlus } from "lucide-react";
import { PatientRecord } from "@/types/membership";

interface MemberSwitcherProps {
  dependents: (PatientRecord & { clinicalAccessAllowed?: boolean })[];
  activePatientId: string | null;
  onSelect: (patientId: string) => void;
  onAddClick: () => void;
  maxMembers: number;
}

export default function MemberSwitcher({
  dependents,
  activePatientId,
  onSelect,
  onAddClick,
  maxMembers,
}: MemberSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activePatient = dependents.find((d) => d.id === activePatientId) || dependents[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:border-[#006537] hover:ring-1 hover:ring-[#006537]/20 transition-all w-full md:w-auto min-w-[240px] justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#006537]">
            {activePatient?.role === "primary" ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Viewing Profile
            </p>
            <p className="text-sm font-bold text-gray-900 leading-none">
              {activePatient?.firstName} {activePatient?.lastName}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-[320px] bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Family Members
            </span>
            <span className="text-[10px] font-semibold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              {dependents.length} / {maxMembers} Used
            </span>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {dependents.map((dep) => (
              <button
                key={dep.id}
                onClick={() => {
                  onSelect(dep.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors ${
                  activePatientId === dep.id ? "bg-green-50/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activePatientId === dep.id ? "bg-[#006537] text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${activePatientId === dep.id ? "text-[#006537]" : "text-gray-900"}`}>
                      {dep.firstName} {dep.lastName}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 capitalize">
                      {dep.role} • {dep.status}
                    </p>
                  </div>
                </div>

                {!dep.clinicalAccessAllowed && dep.role !== 'primary' && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-50 text-red-500 tooltip-trigger" title="Clinical data is private (18+ Self-Onboarded)">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {dependents.length < maxMembers && (
            <div className="p-3 border-t border-gray-50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onAddClick();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#006537]/10 text-[#006537] py-2 rounded-xl text-sm font-semibold hover:bg-[#006537]/20 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Add Family Member
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
