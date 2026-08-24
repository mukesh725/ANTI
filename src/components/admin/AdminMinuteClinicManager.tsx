"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { 
  Search, Calendar, Clock, MapPin, Stethoscope, 
  User, Phone, Mail, FileText, Upload, CheckCircle2,
  Activity, X, Download, FilePlus, Plus, Trash2, Printer
} from "lucide-react";

interface Booking {
  id: string;
  careOption: string;
  service: string;
  location: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  dob: string;
  firstName: string;
  lastName: string;
  address: string;
  legalSex: string;
  timestamp: string;
  status: string;
  reports?: Array<{
    url: string;
    name: string;
    date: string;
    type: "prescription" | "report";
  }>;
}

export function AdminMinuteClinicManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadType, setUploadType] = useState<"prescription" | "report">("report");
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [activeTab, setActiveTab] = useState<"eprescribe" | "upload">("eprescribe");
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedDose, setNewMedDose] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");
  const [newMedDuration, setNewMedDuration] = useState("");
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "minute_clinic_bookings"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(data);
    } catch (err) {
      console.error("Error fetching minute clinic bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedBooking) return;

    setUploadingFile(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, `minute-clinic-reports/${selectedBooking.id}/${fileName}`);
      
      const metadata = {
        contentType: selectedFile.type,
      };

      await uploadBytes(storageRef, selectedFile, metadata);
      const downloadURL = await getDownloadURL(storageRef);

      const newReport = {
        url: downloadURL,
        name: uploadName || selectedFile.name,
        date: new Date().toISOString(),
        type: uploadType
      };

      const bookingRef = doc(db, "minute_clinic_bookings", selectedBooking.id);
      const updatedReports = [...(selectedBooking.reports || []), newReport];
      
      await updateDoc(bookingRef, {
        reports: updatedReports
      });

      setSelectedBooking({ ...selectedBooking, reports: updatedReports });
      
      // Reset form
      setSelectedFile(null);
      setUploadName("");
      
      // Update in the list
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, reports: updatedReports } : b));

    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setPrescriptions([...prescriptions, {
      name: newMedName, dose: newMedDose, freq: newMedFreq, duration: newMedDuration
    }]);
    setNewMedName(""); setNewMedDose(""); setNewMedFreq(""); setNewMedDuration("");
  };

  const removeMedication = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const generateAndSendPrescription = async () => {
    if (!selectedBooking || prescriptions.length === 0) return;
    setGeneratingPDF(true);
    try {
      // Bypass html2canvas and use native jsPDF drawing for instant generation
      const pdf = new jsPDF("p", "pt", "a4");
      
      // Header
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.text("AIRO", 40, 60);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Health Hub", 40, 75);
      
      pdf.setFontSize(10);
      pdf.text("AIRO Minute Clinic", 400, 50);
      pdf.text("Ph: 1-800-AIRO-MED", 400, 65);
      pdf.text("Email: care@airo.dev", 400, 80);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 400, 95);
      
      pdf.setLineWidth(1);
      pdf.line(40, 110, 550, 110);
      
      // Patient Info
      pdf.setFont("helvetica", "bold");
      pdf.text("Patient:", 40, 140);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${selectedBooking.firstName} ${selectedBooking.lastName}`, 90, 140);
      
      pdf.setFont("helvetica", "bold");
      pdf.text("DOB:", 40, 160);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${selectedBooking.dob}`, 90, 160);
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Sex:", 40, 180);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${selectedBooking.legalSex}`, 90, 180);

      pdf.setFont("helvetica", "bold");
      pdf.text("Phone:", 250, 140);
      pdf.setFont("helvetica", "normal");
      pdf.text(`${selectedBooking.phone}`, 295, 140);
      
      pdf.setFont("helvetica", "bold");
      pdf.text("Address:", 250, 160);
      pdf.setFont("helvetica", "normal");
      
      // Handle long address
      const splitAddress = pdf.splitTextToSize(selectedBooking.address || "", 200);
      pdf.text(splitAddress, 305, 160);

      // Rx
      pdf.setFont("times", "italic");
      pdf.setFontSize(28);
      pdf.text("Rx", 40, 230);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);
      let y = 270;
      
      prescriptions.forEach((med, idx) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(`${idx + 1}. ${med.name}`, 40, y);
        y += 20;
        pdf.setFont("helvetica", "normal");
        pdf.text(`Dose: ${med.dose}    Sig: ${med.freq}    Dispense: ${med.duration}`, 60, y);
        y += 40;
      });
      
      // Footer
      pdf.setLineWidth(0.5);
      pdf.line(40, 750, 550, 750);
      pdf.setFontSize(9);
      pdf.text("This is a digitally generated prescription.", 40, 770);
      pdf.text("Valid only when accompanied by electronic verification.", 40, 785);
      
      pdf.line(400, 770, 550, 770);
      pdf.text("Signature of Prescriber", 400, 785);
      pdf.text("AIRO Health Hub Authorized Provider", 400, 800);

      const pdfBlob = pdf.output("blob");

      const fileName = `prescription_${Date.now()}.pdf`;
      const storageRef = ref(storage, `minute-clinic-reports/${selectedBooking.id}/${fileName}`);
      await uploadBytes(storageRef, pdfBlob, { contentType: "application/pdf" });
      const downloadURL = await getDownloadURL(storageRef);

      const newReport = {
        url: downloadURL,
        name: `e-Prescription - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        type: "prescription" as const
      };

      const bookingRef = doc(db, "minute_clinic_bookings", selectedBooking.id);
      const updatedReports = [...(selectedBooking.reports || []), newReport];
      await updateDoc(bookingRef, { reports: updatedReports });

      setSelectedBooking({ ...selectedBooking, reports: updatedReports });
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, reports: updatedReports } : b));
      setPrescriptions([]);
      alert("Prescription generated and sent successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate prescription.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    `${b.firstName} ${b.lastName} ${b.email} ${b.phone} ${b.service}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold tracking-tight">Minute Clinic Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Manage health intakes, virtual consultations, and patient reports.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search patients, email, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1128]/5"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Appointment</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.firstName} {booking.lastName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{booking.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900 font-medium">{booking.service}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        {booking.careOption === "virtual" ? <Stethoscope className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                        {booking.location}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {booking.date}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors"
                      >
                        Manage & Upload
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail & Upload Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manage Booking</h2>
                <p className="text-sm text-gray-500">{selectedBooking.firstName} {selectedBooking.lastName} - {selectedBooking.service}</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7F6] grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Patient Details */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <User className="w-4 h-4 text-blue-600" /> Patient Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-medium">{selectedBooking.firstName} {selectedBooking.lastName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">DOB:</span> <span className="font-medium">{selectedBooking.dob}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Sex:</span> <span className="font-medium">{selectedBooking.legalSex}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium">{selectedBooking.phone}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="font-medium">{selectedBooking.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Address:</span> <span className="font-medium text-right max-w-[200px]">{selectedBooking.address}</span></div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Calendar className="w-4 h-4 text-blue-600" /> Appointment Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Service:</span> <span className="font-medium">{selectedBooking.service}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-medium capitalize">{selectedBooking.careOption}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Location:</span> <span className="font-medium text-right">{selectedBooking.location}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-medium">{selectedBooking.date}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Time:</span> <span className="font-medium">{selectedBooking.time}</span></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Files & Uploads */}
              <div className="space-y-6">
                
                {/* Tabs */}
                <div className="flex bg-white rounded-xl border border-gray-100 p-1">
                  <button 
                    onClick={() => setActiveTab("eprescribe")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "eprescribe" ? "bg-[#0A1128] text-white" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    e-Prescribe
                  </button>
                  <button 
                    onClick={() => setActiveTab("upload")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "upload" ? "bg-[#0A1128] text-white" : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Upload Report
                  </button>
                </div>

                {activeTab === "eprescribe" ? (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Stethoscope className="w-4 h-4 text-blue-600" /> Generate Prescription
                    </h3>
                    
                    <form onSubmit={handleAddMedication} className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Medication Name (Compound, Rx, OTC)</label>
                        <input 
                          type="text"
                          placeholder="e.g. Amoxicillin 500mg or Custom Compound"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Dose/Qty</label>
                          <input 
                            type="text" placeholder="e.g. 1 Tablet" value={newMedDose} onChange={(e) => setNewMedDose(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Frequency</label>
                          <input 
                            type="text" placeholder="e.g. Twice daily" value={newMedFreq} onChange={(e) => setNewMedFreq(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                          <input 
                            type="text" placeholder="e.g. 5 Days" value={newMedDuration} onChange={(e) => setNewMedDuration(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                          />
                        </div>
                      </div>
                      <button type="submit" disabled={!newMedName} className="w-full mt-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-bold py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
                        <Plus className="w-4 h-4" /> Add to Prescription
                      </button>
                    </form>

                    <div className="space-y-2 mb-6">
                      {prescriptions.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-start p-3 border border-gray-100 rounded-lg">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{med.name}</p>
                            <p className="text-xs text-gray-500">{med.dose} • {med.freq} • {med.duration}</p>
                          </div>
                          <button onClick={() => removeMedication(idx)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {prescriptions.length === 0 && (
                        <p className="text-xs text-center text-gray-400 italic">No medications added yet.</p>
                      )}
                    </div>

                    <button 
                      onClick={generateAndSendPrescription}
                      disabled={generatingPDF || prescriptions.length === 0}
                      className="w-full bg-[#0A1128] hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {generatingPDF ? "Generating PDF..." : <><Printer className="w-4 h-4" /> Generate & Send to Patient</>}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Upload className="w-4 h-4 text-emerald-600" /> Upload Diagnostic Report
                    </h3>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <input type="hidden" value="report" />
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Document Name</label>
                        <input 
                          type="text"
                          placeholder="e.g. Complete Blood Count Report"
                          value={uploadName}
                          onChange={(e) => setUploadName(e.target.value)}
                          required
                          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">File (PDF/Image)</label>
                        <input 
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          required
                          accept=".pdf,image/*"
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={uploadingFile || !selectedFile}
                        className="w-full bg-[#0A1128] hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {uploadingFile ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload Report</>}
                      </button>
                    </form>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <FilePlus className="w-4 h-4 text-blue-600" /> Attached Documents
                  </h3>
                  <div className="space-y-3">
                    {selectedBooking.reports && selectedBooking.reports.length > 0 ? (
                      selectedBooking.reports.map((report, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div>
                            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              {report.type === 'prescription' ? <FileText className="w-3.5 h-3.5 text-blue-500"/> : <Activity className="w-3.5 h-3.5 text-emerald-500"/>}
                              {report.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{new Date(report.date).toLocaleDateString()}</p>
                          </div>
                          <a 
                            href={report.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No documents attached yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Template */}
      {selectedBooking && (
        <div id="prescription-template" className="bg-white p-12 text-black w-[800px] hidden" style={{ fontFamily: 'sans-serif' }}>
          <div className="flex justify-between items-start border-b-2 border-[#0A1128] pb-6 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter text-[#0A1128]">AIRO</h1>
              <p className="text-sm text-gray-500 tracking-widest uppercase">Health Hub</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>AIRO Minute Clinic</p>
              <p>Ph: 1-800-AIRO-MED</p>
              <p>Email: care@airo.dev</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mb-8 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <p><span className="font-bold text-gray-700">Patient:</span> {selectedBooking.firstName} {selectedBooking.lastName}</p>
              <p><span className="font-bold text-gray-700">DOB:</span> {selectedBooking.dob}</p>
              <p><span className="font-bold text-gray-700">Sex:</span> {selectedBooking.legalSex}</p>
            </div>
            <div>
              <p><span className="font-bold text-gray-700">Address:</span> {selectedBooking.address}</p>
              <p><span className="font-bold text-gray-700">Contact:</span> {selectedBooking.phone}</p>
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 italic">Rx</h2>
          <div className="space-y-6 min-h-[300px]">
            {prescriptions.map((med, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4">
                <p className="text-lg font-bold text-gray-900">{med.name}</p>
                <div className="flex gap-4 text-sm mt-1 text-gray-700">
                  <p>Dose: <span className="font-medium">{med.dose}</span></p>
                  <p>Sig: <span className="font-medium">{med.freq}</span></p>
                  <p>Dispense: <span className="font-medium">{med.duration}</span></p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-12 border-t border-gray-200 flex justify-between items-end">
            <div className="text-xs text-gray-500">
              <p>This is a digitally generated prescription.</p>
              <p>Valid only when accompanied by electronic verification.</p>
            </div>
            <div className="text-center">
              <div className="w-48 border-b-2 border-black mb-2"></div>
              <p className="font-bold text-sm">Signature of Prescriber</p>
              <p className="text-xs text-gray-600">AIRO Health Hub Authorized Provider</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
