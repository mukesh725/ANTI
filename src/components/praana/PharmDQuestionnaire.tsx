"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, ChevronRight, ChevronLeft, User, Heart, 
  Activity, AlertCircle, ShieldAlert, Pill, Coffee, Target, 
  Stethoscope, FileCheck, Info
} from "lucide-react";
import { ChronicDiseaseQuestionnaireData } from "@/types/praana";

interface PharmDQuestionnaireProps {
  initialData?: Partial<ChronicDiseaseQuestionnaireData>;
  patientName?: string;
  patientId?: string;
  onComplete: (data: ChronicDiseaseQuestionnaireData) => void;
  onCancel?: () => void;
}

export function PharmDQuestionnaire({
  initialData,
  patientName = "",
  patientId = "",
  onComplete,
  onCancel
}: PharmDQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 7;

  // Step 1: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    fullName: initialData?.personalInfo?.fullName || patientName || "",
    dob: initialData?.personalInfo?.dob || "",
    age: initialData?.personalInfo?.age || "",
    sex: initialData?.personalInfo?.sex || "Male",
    countryCode: initialData?.personalInfo?.countryCode || "+91",
    mobileNumber: initialData?.personalInfo?.mobileNumber || "",
    email: initialData?.personalInfo?.email || "",
    occupation: initialData?.personalInfo?.occupation || "Employed",
    heightFeet: initialData?.personalInfo?.heightFeet || "5",
    heightInches: initialData?.personalInfo?.heightInches || "9",
    weightLbs: initialData?.personalInfo?.weightLbs || "154",
    comment: initialData?.personalInfo?.comment || ""
  });

  // Step 2: Medical Conditions
  const medicalConditionsList = [
    "Diabetes", "Prediabetes", "High Blood Pressure", "High Cholesterol", "Heart Disease",
    "Heart Attack", "Stroke/TIA", "Kidney Disease", "Fatty Liver Disease", "Thyroid Disease",
    "Asthma", "COPD", "Obesity", "Arthritis", "Cancer", "None"
  ];
  const [medicalConditions, setMedicalConditions] = useState<string[]>(
    initialData?.medicalConditions || []
  );
  const [medicalConditionsComment, setMedicalConditionsComment] = useState(
    initialData?.medicalConditionsComment || ""
  );

  // Step 3: Family History
  const familyHistoryList = [
    "Diabetes", "Hypertension", "Heart Disease", "Stroke", "High Cholesterol",
    "Kidney Disease", "Cancer", "Obesity", "Thyroid Disease", "None"
  ];
  const [familyHistory, setFamilyHistory] = useState<string[]>(
    initialData?.familyHistory || []
  );
  const [familyHistoryComment, setFamilyHistoryComment] = useState(
    initialData?.familyHistoryComment || ""
  );

  // Step 4: Current Symptoms
  const symptomsList = [
    "Chest Pain", "Shortness of Breath", "Fatigue", "Frequent Urination", "Excessive Thirst",
    "Swelling in Legs", "Blurred Vision", "Persistent Cough", "Dizziness", "Headache",
    "Tingling/Numbness", "Unexplained Weight Gain", "Unexplained Weight Loss", "None"
  ];
  const [symptoms, setSymptoms] = useState<string[]>(
    initialData?.symptoms || []
  );
  const [symptomsComment, setSymptomsComment] = useState(
    initialData?.symptomsComment || ""
  );

  // Step 5: Current Medications
  const medicationsList = [
    "Diabetes Medicines", "Blood Pressure Medicines", "Cholesterol Medicines", "Heart Medicines",
    "Thyroid Medicines", "Asthma/COPD Medicines", "Kidney Disease Medicines", "None"
  ];
  const [medications, setMedications] = useState<string[]>(
    initialData?.medications || []
  );
  const [medicationsComment, setMedicationsComment] = useState(
    initialData?.medicationsComment || ""
  );

  // Step 6: Lifestyle & Daily Habits
  const [lifestyle, setLifestyle] = useState({
    tobacco: initialData?.lifestyle?.tobacco || "",
    tobaccoComment: initialData?.lifestyle?.tobaccoComment || "",
    alcohol: initialData?.lifestyle?.alcohol || "",
    alcoholComment: initialData?.lifestyle?.alcoholComment || "",
    physicalActivity: initialData?.lifestyle?.physicalActivity || "",
    physicalActivityComment: initialData?.lifestyle?.physicalActivityComment || "",
    dailyActivity: initialData?.lifestyle?.dailyActivity || "",
    dailyActivityComment: initialData?.lifestyle?.dailyActivityComment || "",
    usualDiet: initialData?.lifestyle?.usualDiet || "",
    usualDietComment: initialData?.lifestyle?.usualDietComment || "",
    sugaryDrinks: initialData?.lifestyle?.sugaryDrinks || "",
    sugaryDrinksComment: initialData?.lifestyle?.sugaryDrinksComment || "",
    waterIntake: initialData?.lifestyle?.waterIntake || "",
    waterIntakeComment: initialData?.lifestyle?.waterIntakeComment || "",
    stressLevel: initialData?.lifestyle?.stressLevel || "",
    stressLevelComment: initialData?.lifestyle?.stressLevelComment || ""
  });

  // Step 7: Health Goals
  const healthGoalsList = [
    "Lose Weight", "Control Blood Sugar", "Control Blood Pressure", "Improve Heart Health",
    "Lower Cholesterol", "Improve Fitness", "Healthy Aging", "Prevent Disease"
  ];
  const [healthGoals, setHealthGoals] = useState<string[]>(
    initialData?.healthGoals || []
  );
  const [healthGoalsComment, setHealthGoalsComment] = useState(
    initialData?.healthGoalsComment || ""
  );

  const [pharmDName, setPharmDName] = useState("Dr. R. Sharma, Pharm.D");
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Toggle multiple options with "None" mutual exclusivity
  const toggleMultiSelect = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    item: string
  ) => {
    setErrorNotice(null);
    if (item === "None") {
      setList(["None"]);
    } else {
      setList(prev => {
        const withoutNone = prev.filter(i => i !== "None");
        if (withoutNone.includes(item)) {
          return withoutNone.filter(i => i !== item);
        }
        return [...withoutNone, item];
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrorNotice(null);
    if (currentStep === 0) {
      const { fullName, dob, age, mobileNumber } = personalInfo;
      if (!fullName || !dob || !age || !mobileNumber) {
        setErrorNotice("Please fill out Patient Full Name, Date of Birth, Age, and Mobile Number.");
        return false;
      }
    } else if (currentStep === 1) {
      if (medicalConditions.length === 0) {
        setErrorNotice("Please select at least one condition (or select 'None').");
        return false;
      }
    } else if (currentStep === 2) {
      if (familyHistory.length === 0) {
        setErrorNotice("Please select at least one family condition (or select 'None').");
        return false;
      }
    } else if (currentStep === 3) {
      if (symptoms.length === 0) {
        setErrorNotice("Please select at least one symptom (or select 'None').");
        return false;
      }
    } else if (currentStep === 4) {
      if (medications.length === 0) {
        setErrorNotice("Please select at least one medication status (or select 'None').");
        return false;
      }
    } else if (currentStep === 5) {
      const { tobacco, alcohol, physicalActivity, stressLevel } = lifestyle;
      if (!tobacco || !alcohol || !physicalActivity || !stressLevel) {
        setErrorNotice("Please answer all primary lifestyle questions before proceeding.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrorNotice(null);
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (healthGoals.length === 0) {
      setErrorNotice("Please select at least one health goal to complete the assessment.");
      return;
    }

    const completedPayload: ChronicDiseaseQuestionnaireData = {
      personalInfo,
      medicalConditions,
      medicalConditionsComment,
      familyHistory,
      familyHistoryComment,
      symptoms,
      symptomsComment,
      medications,
      medicationsComment,
      lifestyle,
      healthGoals,
      healthGoalsComment,
      completedAt: new Date().toISOString(),
      verifiedByPharmD: pharmDName
    };

    onComplete(completedPayload);
  };

  const stepTitles = [
    "Personal Information",
    "Medical Conditions",
    "Family History",
    "Current Symptoms",
    "Current Medications",
    "Lifestyle & Daily Habits",
    "Health Goals & Verification"
  ];

  const stepIcons = [
    User, AlertCircle, Heart, Activity, Pill, Coffee, Target
  ];

  const CurrentStepIcon = stepIcons[currentStep];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Pharm.D Banner Header */}
      <div className="bg-[#0b132b] text-white p-6 sm:p-8 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 border border-sky-400/30 flex items-center justify-center text-white shadow-md">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
                  Step 4: Clinical Intake
                </span>
                <span className="text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Pharm.D Assisted
                </span>
                {patientId && (
                  <span className="text-[11px] font-mono font-bold text-slate-300">
                    ID: {patientId}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white mt-1">
                {stepTitles[currentStep]}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Covers medical history, medications, allergies, lifestyle, and reason for visit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <p className="text-[10px] uppercase text-slate-300 font-bold">Assisting Clinician</p>
              <input
                type="text"
                value={pharmDName}
                onChange={(e) => setPharmDName(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none text-right w-40"
              />
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
            <span className="flex items-center gap-2">
              <CurrentStepIcon className="w-4 h-4 text-emerald-400" />
              <span>Step {currentStep + 1} of {totalSteps}: <strong className="text-white">{stepTitles[currentStep]}</strong></span>
            </span>
            <span className="font-mono text-emerald-400">{Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorNotice && (
        <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorNotice}</div>
        </div>
      )}

      {/* Form Content Steps */}
      <div className="p-6 sm:p-8">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Personal & Biological Demographics</h3>
              <p className="text-xs text-slate-500">Accurate baseline demographics ensure clinical reference ranges match.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, fullName: e.target.value }))}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Birth (DD/MM/YYYY) *
                </label>
                <input
                  type="text"
                  value={personalInfo.dob}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, dob: e.target.value }))}
                  placeholder="15/04/1982"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  value={personalInfo.age}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, age: e.target.value }))}
                  placeholder="44"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Biological Sex *
                </label>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map(sex => (
                    <button
                      key={sex}
                      type="button"
                      onClick={() => setPersonalInfo(p => ({ ...p, sex }))}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                        personalInfo.sex === sex
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {sex}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={personalInfo.countryCode}
                    onChange={(e) => setPersonalInfo(p => ({ ...p, countryCode: e.target.value }))}
                    className="w-16 px-2 py-2.5 rounded-xl border border-slate-200 text-center text-xs font-bold text-slate-700 bg-slate-50"
                  />
                  <input
                    type="tel"
                    value={personalInfo.mobileNumber}
                    onChange={(e) => setPersonalInfo(p => ({ ...p, mobileNumber: e.target.value }))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, email: e.target.value }))}
                  placeholder="ramesh@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Height (Feet & Inches)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={personalInfo.heightFeet}
                    onChange={(e) => setPersonalInfo(p => ({ ...p, heightFeet: e.target.value }))}
                    placeholder="5"
                    className="w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                  />
                  <input
                    type="number"
                    value={personalInfo.heightInches}
                    onChange={(e) => setPersonalInfo(p => ({ ...p, heightInches: e.target.value }))}
                    placeholder="9"
                    className="w-1/2 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Weight (lbs / approx kg)
                </label>
                <input
                  type="text"
                  value={personalInfo.weightLbs}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, weightLbs: e.target.value }))}
                  placeholder="154 lbs (70 kg)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Occupation
                </label>
                <select
                  value={personalInfo.occupation}
                  onChange={(e) => setPersonalInfo(p => ({ ...p, occupation: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900 bg-white"
                >
                  {["Employed", "Self-Employed", "Retired", "Homemaker", "Student", "Not Employed"].map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pharm.D Clinical Intake Notes
              </label>
              <textarea
                value={personalInfo.comment}
                onChange={(e) => setPersonalInfo(p => ({ ...p, comment: e.target.value }))}
                placeholder="Reason for visit, chief complaint, referral source or general observations..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 2: MEDICAL CONDITIONS */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Existing Medical Diagnoses</h3>
              <p className="text-xs text-slate-500">Select all conditions diagnosed by a physician in the patient's medical history.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {medicalConditionsList.map(condition => {
                const isSelected = medicalConditions.includes(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleMultiSelect(medicalConditions, setMedicalConditions, condition)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                      isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{condition}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Details & Duration
              </label>
              <textarea
                value={medicalConditionsComment}
                onChange={(e) => setMedicalConditionsComment(e.target.value)}
                placeholder="Specific diagnosis details, year diagnosed, treatment stability, etc..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 3: FAMILY HISTORY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Family Health History</h3>
              <p className="text-xs text-slate-500">Conditions present in first-degree relatives (parents, siblings, children).</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {familyHistoryList.map(condition => {
                const isSelected = familyHistory.includes(condition);
                return (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleMultiSelect(familyHistory, setFamilyHistory, condition)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-teal-50 border-teal-500 text-teal-950 font-bold shadow-sm"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                      isSelected ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{condition}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Relative Details & Early-Onset Notes
              </label>
              <textarea
                value={familyHistoryComment}
                onChange={(e) => setFamilyHistoryComment(e.target.value)}
                placeholder="e.g. Father had heart attack at age 52; Mother has Type 2 Diabetes..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 4: CURRENT SYMPTOMS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Current Symptoms & Red Flags</h3>
              <p className="text-xs text-slate-500">Identifies any active discomfort, cardiovascular risks, or metabolic signs.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {symptomsList.map(symptom => {
                const isSelected = symptoms.includes(symptom);
                const isRedFlag = ["Chest Pain", "Shortness of Breath", "Dizziness"].includes(symptom);
                return (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleMultiSelect(symptoms, setSymptoms, symptom)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? isRedFlag
                          ? "bg-rose-50 border-rose-500 text-rose-950 font-bold shadow-sm"
                          : "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                      isSelected 
                        ? isRedFlag ? "bg-rose-600 border-rose-600 text-white" : "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">
                      {symptom}
                      {isRedFlag && <span className="ml-1 text-[10px] text-rose-600 font-extrabold">*</span>}
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Symptom Frequency & Severity
              </label>
              <textarea
                value={symptomsComment}
                onChange={(e) => setSymptomsComment(e.target.value)}
                placeholder="Onset duration, aggravating factors, pain scale (1-10), etc..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 5: CURRENT MEDICATIONS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Current Medications & Therapy</h3>
              <p className="text-xs text-slate-500">Active prescription drugs or routine OTC supplements.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {medicationsList.map(med => {
                const isSelected = medications.includes(med);
                return (
                  <button
                    key={med}
                    type="button"
                    onClick={() => toggleMultiSelect(medications, setMedications, med)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-sky-50 border-sky-500 text-sky-950 font-bold shadow-sm"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                      isSelected ? "bg-sky-600 border-sky-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{med}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Exact Drug Names, Dosages & Adherence
              </label>
              <textarea
                value={medicationsComment}
                onChange={(e) => setMedicationsComment(e.target.value)}
                placeholder="e.g. Metformin 500mg BD, Telmisartan 40mg OD in morning..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 6: LIFESTYLE & DAILY HABITS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Lifestyle & Preventative Factors</h3>
              <p className="text-xs text-slate-500">Daily routines that heavily influence cardiovascular and metabolic biomarkers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tobacco Usage *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Never used", "Former user", "Occasional", "Daily"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLifestyle(l => ({ ...l, tobacco: opt }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                        lifestyle.tobacco === opt
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Alcohol Consumption *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["None", "Occasional (1-3/mo)", "Moderate (1-2/wk)", "Frequent"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLifestyle(l => ({ ...l, alcohol: opt }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                        lifestyle.alcohol === opt
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Physical Exercise / Week *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Sedentary (None)", "1–2 days/wk", "3–4 days/wk", "5+ days/wk"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLifestyle(l => ({ ...l, physicalActivity: opt }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                        lifestyle.physicalActivity === opt
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Self-Reported Stress Level *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Low", "Moderate", "High", "Very High"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLifestyle(l => ({ ...l, stressLevel: opt }))}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left ${
                        lifestyle.stressLevel === opt
                          ? opt.includes("High") ? "bg-rose-600 text-white border-rose-600" : "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dietary Habits & Water Intake Notes
              </label>
              <textarea
                value={lifestyle.usualDietComment}
                onChange={(e) => setLifestyle(l => ({ ...l, usualDietComment: e.target.value }))}
                placeholder="e.g. Vegetarian diet, low salt, 2.5L water daily, minimal sugary drinks..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>
        )}

        {/* STEP 7: HEALTH GOALS & VERIFICATION */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Health Goals & Pharm.D Verification</h3>
              <p className="text-xs text-slate-500">What the patient wants to achieve through their Praana Health Care Plan.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {healthGoalsList.map(goal => {
                const isSelected = healthGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleMultiSelect(healthGoals, setHealthGoals, goal)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center ${
                      isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs">{goal}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Specific Patient Goals / Requests
              </label>
              <textarea
                value={healthGoalsComment}
                onChange={(e) => setHealthGoalsComment(e.target.value)}
                placeholder="e.g. Reduce HbA1c below 6.5% within 6 months without adding a second medication..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong>Pharm.D Clinical Verification:</strong> By submitting, I verify that I have assisted the patient in completing this questionnaire, clarified their medical history, and confirmed readiness for the <strong>Praana Chair Vital Scan (Step 5)</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
            ) : <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save to Patient History & Advance to Chair Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
