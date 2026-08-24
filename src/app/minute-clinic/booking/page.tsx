"use client";

import { useState, useEffect } from "react";
import { 
  Building2, Smartphone, ArrowLeft, Search, MapPin, 
  Calendar, Clock, Phone, Stethoscope, Thermometer, 
  Bandage, Syringe, ClipboardList, Activity, Droplets,
  ChevronRight, ArrowRight, Pill, ShieldCheck, HeartPulse, Check, X
} from "lucide-react";
import Link from "next/link";
import { collection, addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { minuteClinicServices } from "@/data/minuteClinicServices";
import { getSearchKeywords } from "@/lib/searchSynonyms";
import { DatePicker } from "@/components/minute-clinic/DatePicker";
import { useAuth } from "@/context/AuthContext";

const getISTDateString = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istTime = new Date(utc + (3600000 * 5.5));
  return istTime.toISOString().split('T')[0];
};

const getMinBookingDate = () => {
  const today = getISTDateString();
  const launchDate = "2026-08-22";
  return today > launchDate ? today : launchDate;
};

type Step = "care-option" | "service" | "location" | "details" | "review" | "consent" | "confirmation";

interface BookingState {
  careOption: "in-person" | "virtual" | null;
  service: string | null;
  location: any | null;
  date: string | null;
  time: string | null;
  phone: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  firstName: string;
  lastName: string;
  street: string;
  unit: string;
  city: string;
  stateText: string;
  zip: string;
  legalSex: string;
  email: string;
  consentSms: boolean;
  consentAudio: boolean;
  consentTreatment: boolean;
  consentPrivacy: boolean;
  consentSummary: boolean;
  consentRecords: boolean;
  consentMarketing: boolean;
}

export default function MinuteClinicBookingPage() {
  const [step, setStep] = useState<Step>("care-option");
  const [state, setState] = useState<BookingState>({
    careOption: null,
    service: null,
    location: null,
    date: null,
    time: null,
    phone: "",
    dobMonth: "",
    dobDay: "",
    dobYear: "",
    firstName: "",
    lastName: "",
    street: "",
    unit: "",
    city: "",
    stateText: "",
    zip: "",
    legalSex: "",
    email: "",
    consentSms: false,
    consentAudio: false,
    consentTreatment: false,
    consentPrivacy: false,
    consentSummary: false,
    consentRecords: false,
    consentMarketing: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();
  const [locationsList, setLocationsList] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchServiceQuery, setSearchServiceQuery] = useState("");
  const [activeServiceTab, setActiveServiceTab] = useState<"common" | "search">("common");
  const [clinicSelectedDates, setClinicSelectedDates] = useState<Record<number, string>>({});
  const [policyModal, setPolicyModal] = useState<"treatment" | "privacy" | "communication" | null>(null);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!profile?.email && !profile?.mobile) return;
      
      try {
        const membersRef = collection(db, "Members");
        let q;
        if (profile.email) {
          q = query(membersRef, where("email", "==", profile.email));
        } else if (profile.mobile) {
          q = query(membersRef, where("mobile", "==", profile.mobile));
        }
        
        if (q) {
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const memberData = snapshot.docs[0].data();
            
            let dobMonth = "", dobDay = "", dobYear = "";
            if (memberData.dob) {
              const parts = memberData.dob.split('-');
              if (parts.length === 3) {
                dobYear = parts[0];
                dobMonth = parts[1];
                dobDay = parts[2];
              }
            }
            
            setState(s => ({
              ...s,
              firstName: memberData.firstName || profile.firstName || s.firstName,
              lastName: memberData.lastName || profile.lastName || s.lastName,
              email: memberData.email || profile.email || s.email,
              phone: memberData.mobile || profile.mobile || s.phone,
              legalSex: memberData.gender || s.legalSex,
              street: memberData.address || s.street,
              dobMonth: dobMonth || s.dobMonth,
              dobDay: dobDay || s.dobDay,
              dobYear: dobYear || s.dobYear,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching member details:", err);
      }
    };

    if (profile) {
      // populate basic profile immediately
      let dobMonth = "", dobDay = "", dobYear = "";
      if (profile.dob) {
        const parts = profile.dob.split('-');
        if (parts.length === 3) {
          dobYear = parts[0];
          dobMonth = parts[1];
          dobDay = parts[2];
        }
      }

      setState(s => ({
        ...s,
        firstName: profile.firstName || s.firstName,
        lastName: profile.lastName || s.lastName,
        email: profile.email || s.email,
        phone: profile.mobile || s.phone,
        street: profile.address || s.street,
        city: profile.city || s.city,
        stateText: profile.stateText || s.stateText,
        zip: profile.zip || s.zip,
        legalSex: profile.gender || s.legalSex,
        dobMonth: dobMonth || s.dobMonth,
        dobDay: dobDay || s.dobDay,
        dobYear: dobYear || s.dobYear,
      }));
      fetchMemberData();
    }
  }, [profile]);

  useEffect(() => {
    // Read from window.location instead of useSearchParams to avoid requiring Suspense
    // which breaks static generation if not wrapped properly
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const serviceParam = params.get("service");

    if (serviceParam) {
      setState(s => ({ ...s, service: serviceParam, careOption: type === "virtual" ? "virtual" : "in-person" }));
      setStep("location");
    } else if (type === "in-person" || type === "virtual") {
      setState(s => ({ ...s, careOption: type }));
      setStep("service");
    }

    const fetchLocations = async () => {
      try {
        const docRef = doc(db, "settings", "locations");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().list) {
          setLocationsList(docSnap.data().list);
        } else {
          setLocationsList(["Kondapur", "Kompally"]);
        }
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setIsLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);

  const handleNext = (nextStep: Step) => {
    window.scrollTo(0, 0);
    setStep(nextStep);
  };

  const handleBack = (prevStep: Step) => {
    window.scrollTo(0, 0);
    setStep(prevStep);
  };

  const getNextAvailableTime = (addMinutes = 20) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + addMinutes);
    // Round to nearest 15 minutes
    const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(roundedMinutes);
    return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const renderCareOption = () => (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <button onClick={() => window.history.back()} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div className="flex border-b border-gray-200 gap-6">
          <button className="pb-3 border-b-2 border-[#0A1128] text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Soonest available
          </button>
          <button className="pb-3 text-sm font-medium text-gray-500 flex items-center gap-2 hover:text-gray-900 transition-colors">
            <Search className="w-4 h-4" /> Search
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Convenient care options</h1>
      <p className="text-gray-600 mb-8">Results for AIRO Minute Clinic</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => handleNext("service", "in-person")}
          className="bg-white border border-gray-200 rounded-xl p-8 text-left hover:shadow-lg hover:border-blue-300 transition-all flex flex-col min-h-[280px] group"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Building2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">In-person</h2>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 mt-0.5 text-gray-400" />
              <p>Visits as early as <span className="font-bold">{getNextAvailableTime(20)} today</span></p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 mt-0.5 text-gray-400" />
              <p><span className="font-bold">Same-day walk-ins</span> also available</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
            See care options near you <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => handleNext("service", "virtual")}
          className="bg-white border border-gray-200 rounded-xl p-8 text-left hover:shadow-lg hover:border-blue-300 transition-all flex flex-col min-h-[280px] group"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
              <Smartphone className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Virtual</h2>
          </div>
          
          <div className="mt-auto space-y-3">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 mt-0.5 text-gray-400" />
              <p>Visits as early as <span className="font-bold">{getNextAvailableTime(60)} today</span></p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Activity className="w-4 h-4 mt-0.5 text-gray-400" />
              <p>Or <span className="font-bold">skip the line</span> and see the next available provider</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
            See care options <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer">
        <Calendar className="w-4 h-4" /> Reschedule or cancel an existing visit
      </div>
    </div>
  );

  const filteredServices = minuteClinicServices.filter(s => {
    if (!searchServiceQuery) return true;
    const queryKeywords = getSearchKeywords(searchServiceQuery);
    const serviceText = `${s.title} ${s.mainCategory} ${s.subCategory}`.toLowerCase();
    return queryKeywords.some(kw => serviceText.includes(kw));
  });

  const commonCategories = [
    {
      id: "cold-upper-respiratory-infection-evaluation",
      title: "Illness",
      icon: <Stethoscope className="w-6 h-6" />,
      iconBg: "bg-blue-100 text-blue-600",
      subItems: ["Cold", "Congestion", "Sore throat", "Flu-like symptoms", "More"]
    },
    {
      id: "sprain-strain-treatment",
      title: "Injury",
      icon: <Bandage className="w-6 h-6" />,
      iconBg: "bg-teal-100 text-teal-600",
      subItems: ["Sprains", "Joint Pain", "Headaches", "More"]
    },
    {
      id: "yearly-wellness-physical",
      title: "Primary care",
      icon: <HeartPulse className="w-6 h-6" />,
      iconBg: "bg-rose-100 text-rose-600",
      subItems: ["Annual wellness", "Chronic care", "More"]
    },
    {
      id: "vaccine-consultation",
      title: "Vaccines",
      icon: <Syringe className="w-6 h-6" />,
      iconBg: "bg-sky-100 text-sky-600",
      subItems: []
    },
    {
      id: "tuberculosis-tb-test",
      title: "TB testing",
      icon: <Activity className="w-6 h-6" />,
      iconBg: "bg-emerald-100 text-emerald-600",
      subItems: []
    },
    {
      id: "general-medical-exam",
      title: "Physicals",
      icon: <ClipboardList className="w-6 h-6" />,
      iconBg: "bg-indigo-100 text-indigo-600",
      subItems: ["Sports", "Camp", "DOT", "Wellness visits", "And more"]
    },
    {
      id: "urinary-tract-infection-treatment",
      title: "Urinary tract infection",
      icon: <Droplets className="w-6 h-6" />,
      iconBg: "bg-cyan-100 text-cyan-600",
      subItems: []
    },
    {
      id: "rash-treatment",
      title: "Skin conditions",
      icon: <Thermometer className="w-6 h-6" />,
      iconBg: "bg-orange-100 text-orange-600",
      subItems: ["Rash", "Acne", "Wound Care", "More"]
    }
  ];

  const renderService = () => (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <button onClick={() => handleBack("care-option")} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#111827] mb-6 tracking-tight">Choose a service to get started</h1>

      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`flex items-center pb-3 px-4 font-bold transition-colors ${activeServiceTab === 'common' ? 'border-b-2 border-blue-800 text-blue-900' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveServiceTab('common')}
        >
          <ShieldCheck className="w-4 h-4 mr-2" /> Common services
        </button>
        <button 
          className={`flex items-center pb-3 px-4 font-bold transition-colors ${activeServiceTab === 'search' ? 'border-b-2 border-blue-800 text-blue-900' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveServiceTab('search')}
        >
          <Search className="w-4 h-4 mr-2" /> Search
        </button>
      </div>

      <p className="text-gray-700 mb-8 font-medium">If you're unsure, choose a service closest to the care you need. Your provider can always make an update at your visit.</p>

      {activeServiceTab === 'common' ? (
        <div className="space-y-4 mb-10 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {commonCategories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setState({ ...state, service: cat.id })}
              className={`w-full bg-white border rounded-xl p-5 text-left flex items-start transition-all ${state.service === cat.id ? 'border-blue-600 ring-1 ring-blue-600 shadow-md' : 'border-gray-300 hover:border-gray-400 hover:shadow-sm'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 flex-shrink-0 ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{cat.title}</h3>
                {cat.subItems.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                    {cat.subItems.map((sub, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-700 font-medium">
                        <Check className="w-3 h-3 text-green-600 mr-1" />
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-6">
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search symptoms or services..."
              value={searchServiceQuery}
              onChange={(e) => setSearchServiceQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredServices.map(service => (
              <button 
                key={service.id}
                onClick={() => setState({ ...state, service: service.id })}
                className={`w-full bg-white border rounded-xl p-4 text-left flex items-center transition-all ${state.service === service.id ? 'border-blue-600 ring-1 ring-blue-600 shadow-md bg-blue-50/30' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{service.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {service.mainCategory} &bull; {service.subCategory}
                  </p>
                </div>
              </button>
            ))}
            {filteredServices.length === 0 && (
              <p className="text-center text-gray-500 py-8">No services found.</p>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 pt-6 flex justify-start">
        <button 
          disabled={!state.service}
          onClick={() => handleNext("location")}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${state.service ? 'bg-[#004696] hover:bg-blue-800 text-white shadow-md' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          Find availability
        </button>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <div className="mb-8">
        <button onClick={() => handleBack("service")} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#111827] mb-6 tracking-tight">Find care</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 bg-white border border-gray-300 rounded-full flex items-center px-4 py-3 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <MapPin className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search location name or city" 
            className="w-full bg-transparent border-none focus:outline-none text-gray-900 placeholder-gray-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoadingLocations ? (
          <div className="text-center py-12 text-gray-500 font-medium text-sm">
            Loading real-time availability...
          </div>
        ) : locationsList.filter(loc => loc.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium text-sm">
            No locations found matching your search.
          </div>
        ) : (
          locationsList
            .filter(loc => loc.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((locName, idx) => {
              const clinic = {
                id: idx,
                name: `AIRO Minute Clinic - ${locName}`,
                address: locName,
                distance: "Available",
                status: "Available today"
              };
              return (
                <div key={clinic.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-2"><MapPin className="w-3 h-3"/> {clinic.distance}</p>
                      <h2 className="text-lg font-bold text-gray-900">{clinic.name}</h2>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    {locName === "Kondapur" ? (
                      <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-200 text-sm mt-4 text-center">
                        <p className="font-bold mb-2">Opening Postponed!</p>
                        <p>Our Kondapur clinic's opening date has been postponed. New bookings are temporarily suspended until we announce our grand opening date. Existing bookings remain valid.</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6 w-full">
                          <p className="text-sm font-bold text-gray-900 mb-2">Select Date</p>
                          <DatePicker 
                            selectedDate={clinicSelectedDates[clinic.id] || getMinBookingDate()}
                            onSelect={(date) => setClinicSelectedDates({ ...clinicSelectedDates, [clinic.id]: date })}
                            minDate={getMinBookingDate()}
                          />
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["08:50 AM", "09:10 AM", "10:00 AM", "11:20 AM", "12:10 PM", "01:20 PM", "03:20 PM", "04:40 PM"].map(time => (
                            <button 
                              key={time}
                              onClick={() => {
                                setState({ ...state, location: clinic, time, date: clinicSelectedDates[clinic.id] || "Today" });
                                handleNext("details");
                              }}
                              className="border border-blue-600 text-blue-600 bg-white hover:bg-blue-600 hover:text-white rounded-lg py-2.5 text-sm font-bold transition-colors w-full text-center"
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );



  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        careOption: state.careOption,
        service: state.service,
        location: state.location?.name || "Virtual",
        date: state.date,
        time: state.time,
        phone: state.phone,
        email: state.email,
        dob: `${state.dobMonth}/${state.dobDay}/${state.dobYear}`,
        firstName: state.firstName,
        lastName: state.lastName,
        address: `${state.street}, ${state.unit ? state.unit + ', ' : ''}${state.city}, ${state.stateText} ${state.zip}`,
        legalSex: state.legalSex,
        consents: {
          sms: state.consentSms,
          audio: state.consentAudio,
          treatment: state.consentTreatment,
          privacy: state.consentPrivacy,
          summary: state.consentSummary,
          records: state.consentRecords,
          marketing: state.consentMarketing
        },
        timestamp: new Date().toISOString(),
        status: "confirmed"
      };

      await addDoc(collection(db, "minute_clinic_bookings"), payload);

      if (state.careOption === "virtual") {
        console.log("TRIGGER EMED API FOR VIRTUAL CARE:", payload);
      }

      setStep("confirmation");
    } catch (err) {
      console.error(err);
      alert("There was an error booking your appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDetails = () => (
    <div className="max-w-[600px] mx-auto px-4 py-12">
      <div className="mb-8">
        <button onClick={() => handleBack("location")} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Let's get started</h1>
      <p className="text-gray-600 mb-8 text-sm">All fields required unless marked optional.</p>

      <form onSubmit={(e) => { e.preventDefault(); handleNext("review"); }} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Phone number</label>
          <div className="flex gap-3">
            <select className="w-32 bg-white border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <option>+91 (IND)</option>
              <option>+1 (US)</option>
            </select>
            <input 
              type="tel" 
              required
              value={state.phone}
              onChange={e => setState({...state, phone: e.target.value})}
              placeholder="10-digit mobile number"
              className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Date of birth</label>
          <p className="text-xs text-gray-500 mb-3">Example: MM / DD / YYYY</p>
          <div className="flex items-center gap-3">
            <div className="w-20">
              <label className="block text-xs font-bold text-gray-700 mb-1">Month</label>
              <input 
                type="text" 
                required
                maxLength={2}
                value={state.dobMonth}
                onChange={e => setState({...state, dobMonth: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400 mt-5">/</span>
            <div className="w-20">
              <label className="block text-xs font-bold text-gray-700 mb-1">Day</label>
              <input 
                type="text" 
                required
                maxLength={2}
                value={state.dobDay}
                onChange={e => setState({...state, dobDay: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-gray-400 mt-5">/</span>
            <div className="w-24">
              <label className="block text-xs font-bold text-gray-700 mb-1">Year</label>
              <input 
                type="text" 
                required
                maxLength={4}
                value={state.dobYear}
                onChange={e => setState({...state, dobYear: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Patient details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">First name</label>
              <input 
                type="text" required
                value={state.firstName}
                onChange={e => setState({...state, firstName: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Last name</label>
              <input 
                type="text" required
                value={state.lastName}
                onChange={e => setState({...state, lastName: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Street address</label>
              <input 
                type="text" required
                value={state.street}
                onChange={e => setState({...state, street: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Unit, apt., etc. (optional)</label>
              <input 
                type="text"
                value={state.unit}
                onChange={e => setState({...state, unit: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">City</label>
              <input 
                type="text" required
                value={state.city}
                onChange={e => setState({...state, city: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">State</label>
              <select 
                required
                value={state.stateText}
                onChange={e => setState({...state, stateText: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Select State</option>
                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">ZIP code</label>
              <input 
                type="text" required
                value={state.zip}
                onChange={e => setState({...state, zip: e.target.value})}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="pt-2">
              <label className="block text-sm font-bold text-gray-900 mb-1">Legal sex</label>
              <p className="text-xs text-gray-500 mb-3">We use this for insurance, billing and to confirm the patient's medical record.</p>
              <div className="space-y-3">
                {["Female", "Male", "Prefer not to answer"].map(sex => (
                  <label key={sex} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${state.legalSex === sex ? 'border-blue-600 bg-blue-50/50' : 'border-gray-300 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="legalSex" 
                      value={sex} 
                      checked={state.legalSex === sex}
                      onChange={e => setState({...state, legalSex: e.target.value})}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      required
                    />
                    <span className="ml-3 text-sm font-bold text-gray-900">{sex}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button 
            type="submit"
            className="bg-[#0A1128] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            {profile ? "Confirm details" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-[800px] mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      <div className="flex-1">
        <div className="mb-8">
          <button onClick={() => handleBack("details")} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
        </div>

        <h1 className="text-3xl font-bold text-[#111827] mb-8 tracking-tight">Confirm your visit details</h1>
        
        {!state.email ? (
          <div className="bg-[#FFEFE5] p-6 rounded-xl mb-8 flex gap-4 items-start">
            <div className="text-orange-600 mt-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1 21H23L12 2ZM13 18H11V16H13V18ZM13 14H11V10H13V14Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">We're missing your email</h3>
              <p className="text-sm text-gray-800 mb-4">We'll need your email before you can confirm your visit.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={state.email}
                  onChange={e => setState({...state, email: e.target.value})}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full max-w-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-1">Email added</h3>
            <p className="text-sm text-gray-700">{state.email}</p>
          </div>
        )}

        <h2 className="text-xl font-bold text-gray-900 mb-4">Consents</h2>
        
        <div className="space-y-6 mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={state.consentSms}
              onChange={e => setState({...state, consentSms: e.target.checked})}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-sm text-gray-700">
              I agree to receive text messages, automated calls, and voicemails about my visits, test results, health care, account, insurance and marketing information. Message and data rates apply. Consent is not a condition for service. (Optional)
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={state.consentAudio}
              onChange={e => setState({...state, consentAudio: e.target.checked})}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-sm text-gray-700">
              I acknowledge that my provider will be using audio recording technology to assist in medical record documentation during my visit. This temporary audio will be deleted after 90 days. (Optional)
            </span>
          </label>
        </div>

        <p className="text-xs text-gray-600 mb-8">
          By confirming your visit, you are agreeing to the <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>. You also agree to share these visit details with your AIRO account to inform app updates and notifications.
        </p>

        <button 
          onClick={() => {
            if (!state.email) {
              alert("Please provide an email address.");
              return;
            }
            handleNext("consent");
          }}
          className="bg-[#0A1128] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
        >
          Confirm and continue
        </button>
      </div>

      <div className="w-full md:w-80">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Visit details</h2>
        
        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center font-bold text-teal-800 text-lg shrink-0">
            {state.firstName.charAt(0)}{state.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{state.firstName} {state.lastName.charAt(0)}.</h3>
            <p className="text-sm text-gray-600">{state.email ? state.email : "No email on file"}</p>
            <p className="text-sm text-gray-600">{state.phone}</p>
            {!state.email && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><span className="w-3 h-3 rounded-full border border-red-600 flex items-center justify-center text-[8px]">!</span> Add contact details (required)</p>}
            <button onClick={() => handleBack("details")} className="text-sm font-bold text-blue-600 mt-2 hover:underline">Edit patient details</button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">What</h3>
            <ul className="list-disc pl-4 text-sm text-gray-700">
              <li>{state.service || "Illness"}</li>
            </ul>
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Date and location</h3>
          <div className="flex gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">When</h4>
              <p className="text-sm text-gray-700">{state.date}</p>
              <p className="text-sm text-gray-700">at {state.time}</p>
              <button onClick={() => handleBack("location")} className="text-sm font-bold text-blue-600 mt-2 hover:underline flex items-center gap-1">Change date or time <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Where</h4>
              {state.careOption === "virtual" ? (
                <p className="text-sm text-gray-700">Virtual Telehealth</p>
              ) : (
                <>
                  <p className="text-sm text-gray-700 uppercase">{state.location?.address}</p>
                  <p className="text-sm text-gray-700 uppercase">{state.location?.city}, {state.location?.state} {state.location?.zip}</p>
                </>
              )}
              <div className="mt-3 mb-2 flex items-center gap-1 text-red-600 font-bold">
                <HeartPulse className="w-5 h-5" /> AIRO Health Hub
              </div>
              <button onClick={() => handleBack("location")} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">Change location <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );

  const renderConsent = () => (
    <div className="max-w-[600px] mx-auto px-4 py-12">
      <div className="mb-8">
        <button onClick={() => handleBack("review")} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-[#111827] mb-8 tracking-tight">Before we can see you</h1>
      
      <form onSubmit={submitBooking} className="space-y-6">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" required
            checked={state.consentTreatment}
            onChange={e => setState({...state, consentTreatment: e.target.checked})}
            className="w-5 h-5 mt-0.5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" 
          />
          <div>
            <span className="text-sm text-gray-900 group-hover:text-black">I consent to treatment and telemedicine consultation at AIRO Health Hub as per Indian Telemedicine Practice Guidelines. (required)</span>
            <button type="button" onClick={() => setPolicyModal("treatment")} className="block text-sm font-bold text-blue-700 hover:underline mt-1 flex items-center gap-1">Review AIRO Health Hub Treatment & Telemedicine Consent <ChevronRight className="w-3 h-3" /></button>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" required
            checked={state.consentPrivacy}
            onChange={e => setState({...state, consentPrivacy: e.target.checked})}
            className="w-5 h-5 mt-0.5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" 
          />
          <div>
            <span className="text-sm text-gray-900 group-hover:text-black">I acknowledge that the AIRO Health Hub Privacy Policy (compliant with the Digital Personal Data Protection Act, 2023) has been made available to me.</span>
            <button type="button" onClick={() => setPolicyModal("privacy")} className="block text-sm font-bold text-blue-700 hover:underline mt-1 flex items-center gap-1">Review AIRO Privacy Policy & DPDP Act Notice <ChevronRight className="w-3 h-3" /></button>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={state.consentSummary}
            onChange={e => setState({...state, consentSummary: e.target.checked})}
            className="w-5 h-5 mt-0.5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" 
          />
          <span className="text-sm text-gray-900 group-hover:text-black mt-0.5">Send a visit summary to my primary care provider.</span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={state.consentRecords}
            onChange={e => setState({...state, consentRecords: e.target.checked})}
            className="w-5 h-5 mt-0.5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" 
          />
          <span className="text-sm text-gray-900 group-hover:text-black mt-0.5">Make copies of my health records available electronically to my other care providers or my health plan for care coordination.</span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={state.consentMarketing}
            onChange={e => setState({...state, consentMarketing: e.target.checked})}
            className="w-5 h-5 mt-0.5 rounded border-gray-400 text-blue-600 focus:ring-blue-500" 
          />
          <div>
            <span className="text-sm text-gray-900 group-hover:text-black">I consent to receiving health updates, reminders, and marketing messages via SMS, email, or WhatsApp as per TRAI guidelines.</span>
            <button type="button" onClick={() => setPolicyModal("communication")} className="block text-sm font-bold text-blue-700 hover:underline mt-1 flex items-center gap-1">Review Communication & TRAI Policy <ChevronRight className="w-3 h-3" /></button>
          </div>
        </label>

        <div className="pt-8 flex flex-col sm:flex-row items-center gap-4">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0A1128] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto text-center shadow-lg"
          >
            {isSubmitting ? "Processing..." : "All done"}
          </button>
          
          <button 
            type="button"
            onClick={() => handleBack("review")}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition-colors w-full sm:w-auto text-center flex items-center justify-center gap-2"
          >
            Exit to visit checklist <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </form>
    </div>
  );

  const renderConfirmation = () => (
    <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Activity className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-[#111827] mb-4 tracking-tight">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-8 text-lg">Your appointment is set for {state.time} Today.</p>
      
      {state.careOption === "virtual" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><Smartphone className="w-5 h-5"/> Telemedicine Ready</h3>
          <p className="text-blue-800 text-sm">Your virtual consultation link has been generated via AIRO eMed. We have sent the connection link via SMS to {state.phone}.</p>
        </div>
      )}

      {state.careOption === "in-person" && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-left mb-8">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2"><MapPin className="w-5 h-5"/> See you soon</h3>
          <p className="text-gray-700 text-sm">Please arrive 5 minutes early to {state.location?.name}. We have sent your confirmation code via SMS to {state.phone}.</p>
        </div>
      )}

      <Link 
        href="/minute-clinic"
        className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-8 rounded-full transition-colors inline-block"
      >
        Return to Home
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <main>
        {step === "care-option" && renderCareOption()}
        {step === "service" && renderService()}
        {step === "location" && renderLocation()}
        {step === "details" && renderDetails()}
        {step === "review" && renderReview()}
        {step === "consent" && renderConsent()}
        {step === "confirmation" && renderConfirmation()}
      </main>

      {policyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {policyModal === "treatment" && "Treatment & Telemedicine Consent"}
                {policyModal === "privacy" && "Privacy Policy & DPDP Act Notice"}
                {policyModal === "communication" && "Communication & TRAI Policy"}
              </h2>
              <button onClick={() => setPolicyModal(null)} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto font-sans text-gray-700 text-sm leading-relaxed">
              {policyModal === "treatment" && (
                <div className="space-y-4">
                  <p><strong>1. Consent for Treatment:</strong> I hereby grant consent to AIRO Health Hub, its affiliated physicians, and healthcare providers to perform medical examinations, diagnostic procedures, and treatments as deemed necessary.</p>
                  <p><strong>2. Telemedicine Guidelines (India):</strong> I understand that my consultation may occur virtually via audio/video tools. In accordance with the Telemedicine Practice Guidelines issued by the Ministry of Health and Family Welfare (MoHFW) in India, I acknowledge the limitations of virtual care compared to an in-person physical examination.</p>
                  <p><strong>3. Emergency Exceptions:</strong> I understand that telemedicine is not suitable for medical emergencies. In case of an emergency, I agree to seek immediate in-person medical care or call emergency services.</p>
                </div>
              )}
              {policyModal === "privacy" && (
                <div className="space-y-4">
                  <p><strong>Digital Personal Data Protection Act, 2023 (DPDP Act) Compliance:</strong></p>
                  <p><strong>1. Data Collection:</strong> AIRO Health Hub collects your personal and sensitive personal data (health records, vitals, payment details) solely for providing healthcare services.</p>
                  <p><strong>2. Consent & Usage:</strong> Your data is stored securely and is only accessible by authorized healthcare providers directly involved in your care. We do not sell or share your data with unauthorized third parties without your explicit, verifiable consent.</p>
                  <p><strong>3. Your Rights:</strong> Under the DPDP Act, you have the right to access, correct, or erase your personal data by contacting our Data Protection Officer.</p>
                </div>
              )}
              {policyModal === "communication" && (
                <div className="space-y-4">
                  <p><strong>Telecom Regulatory Authority of India (TRAI) Compliance:</strong></p>
                  <p><strong>1. Opt-in Consent:</strong> By agreeing to this policy, you explicitly opt-in to receive transactional and promotional messages from AIRO Health Hub regarding your appointments, health updates, and exclusive wellness offers.</p>
                  <p><strong>2. Modes of Communication:</strong> Messages may be delivered via SMS, WhatsApp, automated voice calls, and Email.</p>
                  <p><strong>3. Opt-out (DND):</strong> If your number is registered on the National Do Not Call (NDNC) registry, this explicit consent overrides your DND status for AIRO Health Hub communications. You may revoke this consent at any time by replying 'STOP' or updating your account preferences.</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setPolicyModal(null)} className="bg-[#0A1128] text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors">
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
