import React from "react";
import { GlobalHeader } from "@/components/GlobalHeader";
import { PraanaPatientJourney } from "@/components/praana/PraanaPatientJourney";

export const metadata = {
  title: "Praana Health Scan — Full Patient Journey | AIRO",
  description: "End-to-end patient journey: Online booking, walk-in check-in, Pharm.D health questionnaire, Praana Chair vitals scan, physician clinical review, and personalized care plan."
};

export default function PraanaJourneyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white pb-20">
      <GlobalHeader />
      <main className="pt-28 sm:pt-32">
        <PraanaPatientJourney />
      </main>
    </div>
  );
}
