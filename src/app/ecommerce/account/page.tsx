"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LogOut, ShieldCheck, Star, ShoppingBag, Calendar,
  Download, Share2, Wallet, ExternalLink, ArrowRight, X,
  FileText, HeartPulse, Medal, MapPin, Heart, User, Bell, Headset, Gift
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { MemberRecord, PatientRecord } from "@/types/membership";
import MemberSwitcher from "@/components/membership/MemberSwitcher";
import AddMemberModal from "@/components/membership/AddMemberModal";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: unknown[];
}

export default function AccountPage() {
  const { user, profile, logout, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [healthBookings, setHealthBookings] = useState<any[]>([]);

  // Membership State
  const [membership, setMembership] = useState<MemberRecord | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);

  // Multi-Member State
  const [dependents, setDependents] = useState<(PatientRecord & { clinicalAccessAllowed?: boolean })[]>([]);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const activeEmail = profile?.email || user?.email;

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "", lastName: "", mobile: "", dob: "", gender: "", 
    address: "", city: "", stateText: "", zip: ""
  });

  const openEditProfile = () => {
    setEditForm({
      firstName: profile?.firstName || membership?.firstName || "",
      lastName: profile?.lastName || membership?.lastName || "",
      mobile: profile?.mobile || membership?.mobile || "",
      dob: profile?.dob || membership?.dob || "",
      gender: profile?.gender || membership?.gender || "",
      address: profile?.address || membership?.address || "",
      city: profile?.city || "",
      stateText: profile?.stateText || "",
      zip: profile?.zip || "",
    });
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      if (profile?.uid) {
        const userRef = doc(db, "users", profile.uid);
        await updateDoc(userRef, {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          name: `${editForm.firstName} ${editForm.lastName}`.trim(),
          mobile: editForm.mobile,
          dob: editForm.dob,
          gender: editForm.gender,
          address: editForm.address,
          city: editForm.city,
          stateText: editForm.stateText,
          zip: editForm.zip,
        });
      }
      if (membership?.id) {
        const memberRef = doc(db, "Members", membership.id);
        await updateDoc(memberRef, {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          mobile: editForm.mobile,
          dob: editForm.dob,
          gender: editForm.gender,
          address: editForm.address,
        });
      }
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  useEffect(() => {
    if (!loading && !user && !profile) {
      router.push("/ecommerce/login");
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (!activeEmail) return;

      // 1. Fetch Orders
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", profile?.uid || user?.uid || '')
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Order[];
        
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setOrdersLoading(false);
      }

      // 2. Fetch Membership by Email or Mobile
      try {
        const cleanEmail = activeEmail.trim().toLowerCase();
        const qMem = query(
          collection(db, "Members"),
          where("email", "==", cleanEmail)
        );
        let memSnapshot = await getDocs(qMem);

        if (memSnapshot.empty && profile?.mobile) {
          const qMobile = query(
            collection(db, "Members"),
            where("mobile", "==", profile.mobile.trim())
          );
          memSnapshot = await getDocs(qMobile);
        }

        let finalMember: any = null;
        if (memSnapshot.empty) {
          // Scan fallback for case variations or spaces
          const allMemSnap = await getDocs(collection(db, "Members"));
          const matchedDoc = allMemSnap.docs.find((d) => {
            const data = d.data();
            const mEmail = (data.email || '').toString().trim().toLowerCase();
            const mMobile = (data.mobile || '').toString().trim();
            return mEmail === cleanEmail || (profile?.mobile && mMobile === profile.mobile.trim());
          });

          if (matchedDoc) {
            finalMember = { id: matchedDoc.id, ...matchedDoc.data() };
          }
        } else {
          const docSnap = memSnapshot.docs[0];
          finalMember = { id: docSnap.id, ...docSnap.data() };
        }

        if (finalMember) {
          setMembership(finalMember as MemberRecord);
          // Fetch dependents using the primary's mobile as the accountId
          if (finalMember.mobile) {
             try {
                const depsRes = await fetch(`/api/membership/dependents/list?accountId=${encodeURIComponent(finalMember.mobile)}`);
                const depsData = await depsRes.json();
                if (depsData.success && depsData.patients) {
                   setDependents(depsData.patients);
                   if (depsData.patients.length > 0) setActivePatientId(depsData.patients[0].id);
                }
             } catch(e) {
                console.error("Failed fetching dependents", e);
             }
          }
        }
      } catch (err) {
        console.error("Failed to fetch membership:", err);
      } finally {
        setMembershipLoading(false);
      }

      // 3. Fetch Health Bookings (Minute Clinic)
      try {
        const cleanEmail = activeEmail.trim().toLowerCase();
        const qBookings = query(
          collection(db, "minute_clinic_bookings"),
          where("email", "==", cleanEmail)
        );
        const bookingSnap = await getDocs(qBookings);
        const fetchedBookings = bookingSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        // Sort by timestamp desc
        fetchedBookings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setHealthBookings(fetchedBookings);
      } catch (err) {
        console.error("Failed to fetch health bookings:", err);
      }
    }

    fetchUserData();
  }, [activeEmail, user, profile]);

  if (loading) return <div className="min-h-screen bg-[#F9FAFB] pt-32 text-center text-sm font-medium">Loading Account...</div>;
  if (!user && !profile) return null;

  const displayName = profile?.name || profile?.firstName || activeEmail?.split("@")[0] || "Customer";

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pt-24 pb-16 px-4 md:px-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Top Header & Metrics */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <p className="text-gray-500 font-medium mb-1">Welcome back,</p>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">{displayName}</h1>
            <p className="text-sm text-gray-500 mb-4">Here's what's happening with your account today.</p>

            {dependents.length > 0 && (
              <MemberSwitcher 
                dependents={dependents}
                activePatientId={activePatientId}
                onSelect={setActivePatientId}
                onAddClick={() => setIsAddMemberOpen(true)}
                maxMembers={
                  membership?.membershipPlan?.includes('Signature') ? 5 :
                  membership?.membershipPlan?.includes('Preferred') ? 3 : 1
                }
              />
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
            {/* Membership Status */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Membership Status</p>
                <p className="font-bold text-gray-900 mb-1">{membership?.membershipStatus || 'Inactive'}</p>
                <p className="text-[10px] text-gray-400">Valid until {membership?.expiryDate ? new Date(membership.expiryDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : '-'}</p>
              </div>
            </div>

            {/* Reward Points */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Reward Points</p>
                <p className="font-bold text-gray-900 mb-1">{membership?.rewardPoints || 0}</p>
                <p className="text-[10px] text-gray-400">Available Points</p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Total Orders</p>
                <p className="font-bold text-gray-900 mb-1">{orders.length}</p>
                <p className="text-[10px] text-gray-400">Orders Placed</p>
              </div>
            </div>

            {/* Health Appointments */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-1">Health Appointments</p>
                <p className="font-bold text-gray-900 mb-1">{membership?.upcomingAppointments || 0}</p>
                <p className="text-[10px] text-gray-400">Upcoming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Card & Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Membership Card Column */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">Your Membership Card</h2>
              {membership?.memberId && (
                <a href={`/member/${membership.memberId}`} target="_blank" className="text-green-600 text-sm font-medium flex items-center gap-1 hover:underline">
                  View Full Card <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            
            {membershipLoading ? (
              <div className="h-64 bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center">Loading...</div>
            ) : membership?.digitalCardUrl ? (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white mx-auto max-w-full">
                <img src={membership.digitalCardUrl} alt="Digital Membership Card" className="w-full h-auto object-contain" />
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 mb-6 border border-gray-100">
                <p className="font-medium mb-2">No Active Card</p>
                <p className="text-xs max-w-xs text-center">Your card is being generated or your membership is pending activation.</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => {
                  if (!membership?.digitalCardUrl) return;
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL('image/png');
                    const a = document.createElement('a');
                    a.href = pngUrl;
                    a.download = `AIRO_Membership_${membership.memberId || 'Card'}.png`;
                    a.click();
                  };
                  img.src = membership.digitalCardUrl;
                }}
                className="flex items-center justify-center gap-2 bg-[#006537] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#004e2a] transition-colors"
              >
                <Download className="w-4 h-4" /> Download Card
              </button>
              <button 
                onClick={async () => {
                  if (!membership?.memberId) return;
                  const shareUrl = `https://airoessentials.com/member/${membership.memberId}`;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: 'My AIRO ONE Membership',
                        text: 'Check out my verified AIRO ONE Premium Membership!',
                        url: shareUrl
                      });
                    } catch (err) {}
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert("Membership link copied to clipboard!");
                  }
                }}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share Card
              </button>
              <button 
                onClick={() => alert("Apple Wallet & Google Pay integration requires a registered Developer Certificate to issue .pkpass files. For now, please use the 'Download Card' option to save the card image directly to your phone.")}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                <Wallet className="w-4 h-4" /> Add to Wallet
              </button>
            </div>
          </div>

          {/* Recent Orders Column */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900">Recent Orders</h2>
              <button className="text-green-600 text-sm font-medium flex items-center gap-1 hover:underline">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {ordersLoading ? (
                <div className="text-sm text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No Recent Orders</p>
                  <p className="text-xs text-gray-500">You haven't placed any orders yet.</p>
                </div>
              ) : (
                orders.slice(0, 4).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                        <ShoppingBag className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">Order #{order.id.slice(0,8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.createdAt.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-6">
                      <p className="font-semibold text-sm">₹{order.total?.toFixed(2)}</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${getStatusColor(order.status || 'delivered')}`}>
                        {order.status || 'Delivered'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Health Bookings & Reports Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg text-gray-900">Health Bookings & Reports</h2>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {healthBookings.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-xl">
                <Calendar className="w-8 h-8 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">No Health Bookings</p>
                <p className="text-xs text-gray-500">You haven't booked any Minute Clinic sessions yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthBookings.map(booking => (
                  <div key={booking.id} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{booking.service}</h3>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{booking.careOption} • {booking.date} at {booking.time}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {booking.status || 'Pending'}
                      </span>
                    </div>

                    {/* Reports Section inside booking */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Attached Reports & Prescriptions</p>
                      {booking.reports && booking.reports.length > 0 ? (
                        <div className="space-y-2">
                          {booking.reports.map((report: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2">
                                {report.type === 'prescription' ? <FileText className="w-4 h-4 text-blue-500"/> : <Activity className="w-4 h-4 text-emerald-500"/>}
                                <span className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{report.name}</span>
                              </div>
                              <a 
                                href={report.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" /> View
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic">No reports available yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 8 Grid Menu Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Prescriptions */}
          <div onClick={() => alert("Prescriptions module coming soon!")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Prescriptions</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">View your uploaded prescriptions and their status.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View All <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Health Services */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between" onClick={() => window.location.href='https://airohealthhub.com'}>
            <div>
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                <HeartPulse className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Health Services</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Book appointments, view reports and manage your health.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View All <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Rewards */}
          <div onClick={() => alert("Rewards module coming soon!")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                <Medal className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Rewards</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Earn points on every purchase and redeem exciting rewards.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View Rewards <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Addresses */}
          <div onClick={openEditProfile} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Addresses</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Manage your saved addresses for easy checkout.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Manage <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Wishlist */}
          <div onClick={() => alert("Wishlist module coming soon!")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                <Heart className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Wishlist</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">View and manage your saved products.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View Wishlist <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Profile */}
          <div onClick={openEditProfile} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Profile</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Manage your personal details and account settings.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Edit Profile <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Notifications */}
          <div onClick={() => alert("Notifications module coming soon!")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Notifications</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Stay updated with orders, offers and reminders.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">View All <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

          {/* Support */}
          <div onClick={() => router.push("/contact")} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                <Headset className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Support</h3>
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">Get help with orders, products and account issues.</p>
            </div>
            <span className="text-green-600 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">Get Support <ChevronRight className="w-3.5 h-3.5"/></span>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-[#006537] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Gift className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">Enjoy Exclusive Benefits</h3>
              <p className="text-green-100 text-sm">Get special discounts, priority support and more as a valued member.</p>
            </div>
          </div>
          <button className="bg-white text-[#006537] px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2 z-10">
            Explore Benefits <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal information. These details will be used across your AIRO account.</p>
              </div>
              <button onClick={() => setIsEditProfileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">First Name</label>
                  <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Last Name</label>
                  <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Mobile Number</label>
                  <input type="tel" value={editForm.mobile} onChange={e => setEditForm({...editForm, mobile: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Date of Birth</label>
                  <input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Legal Sex</label>
                  <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors">
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to answer">Prefer not to answer</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Street Address</label>
                    <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">City</label>
                      <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">State</label>
                      <input type="text" value={editForm.stateText} onChange={e => setEditForm({...editForm, stateText: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">ZIP Code</label>
                      <input type="text" value={editForm.zip} onChange={e => setEditForm({...editForm, zip: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setIsEditProfileOpen(false)} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProfile} className="bg-[#006537] text-white px-8 py-3 rounded-xl font-bold shadow-sm hover:bg-[#004e2a] transition-colors disabled:opacity-50">
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        accountId={membership?.mobile || ''}
        onSuccess={() => {
          if (typeof window !== 'undefined') window.location.reload();
        }}
      />

    </div>
  );
}

// Sub-component for icons
function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
