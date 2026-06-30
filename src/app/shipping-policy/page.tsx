import { Truck, MapPin, Clock, PackageCheck } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

export const metadata = {
  title: "Shipping & Delivery Policy | AIRO",
  description: "Shipping and delivery guidelines for AIRO Essentials and AIRO Pharmacy orders in India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#597467] min-h-screen overflow-x-hidden selection:bg-[#597467] selection:text-[#FAF8F5]">
      <GlobalHeader />
      
      {/* Header */}
      <section className="relative px-6 md:px-12 pt-40 pb-12 max-w-7xl mx-auto flex flex-col items-center text-center border-b border-[#E6DFD5]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#597467]/60 mb-4 font-semibold block">
          Logistics & Delivery
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#597467] max-w-3xl tracking-tight leading-tight mb-4">
          Shipping & Delivery Policy
        </h1>
        <p className="text-[#597467]/70 text-sm max-w-xl">
          Information regarding delivery timelines, serviceable pin codes, and fulfillment of grocery and pharmacy orders across India.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <Truck className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Delivery Timelines</h3>
          <p className="text-sm text-[#597467]/80 leading-relaxed mb-4">
            We aim to deliver all orders swiftly to ensure maximum freshness for our organic produce and timely arrival for medications.
          </p>
          <ul className="text-sm text-[#597467]/70 space-y-2 list-disc pl-4">
            <li><strong>Hyderabad (Local):</strong> Same-day or next-day delivery for grocery and pharmacy essentials.</li>
            <li><strong>Metro Cities:</strong> 2-3 business days.</li>
            <li><strong>Rest of India:</strong> 4-7 business days depending on pin code serviceability.</li>
          </ul>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <MapPin className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Serviceable Areas</h3>
          <p className="text-sm text-[#597467]/80 leading-relaxed">
            AIRO Health currently ships across most major pin codes in India. However, highly perishable items (like fresh dairy or select organic produce) and temperature-sensitive compounded medications may be restricted to Hyderabad and select metros to maintain FSSAI and FDA safety standards.
          </p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <PackageCheck className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Shipping Charges</h3>
          <p className="text-sm text-[#597467]/80 leading-relaxed">
            Shipping charges are calculated dynamically at checkout based on the delivery pin code and the volumetric weight of the items. Free shipping is automatically applied to cart values exceeding ₹1,499.
          </p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <Clock className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Order Tracking</h3>
          <p className="text-sm text-[#597467]/80 leading-relaxed">
            Once your order is dispatched, you will receive an SMS and Email with a tracking link and an AWB number. You can also track live status directly through your AIRO account dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
