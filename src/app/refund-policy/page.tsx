import { RefreshCcw, AlertOctagon, CheckCircle2, CreditCard } from "lucide-react";
import { GlobalHeader } from "@/components/GlobalHeader";

export const metadata = {
  title: "Refund & Cancellation Policy | AIRO",
  description: "Guidelines for returns, cancellations, and refunds for AIRO Health and Essentials.",
};

export default function RefundPolicyPage() {
  return (
    <div className="w-full bg-[#FAF8F5] text-[#0B2114] min-h-screen overflow-x-hidden selection:bg-[#0B2114] selection:text-[#FAF8F5]">
      <GlobalHeader />
      
      {/* Header */}
      <section className="relative px-6 md:px-12 pt-40 pb-12 max-w-7xl mx-auto flex flex-col items-center text-center border-b border-[#E6DFD5]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#0B2114]/60 mb-4 font-semibold block">
          Customer Support
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-[#0B2114] max-w-3xl tracking-tight leading-tight mb-4">
          Refund & Cancellation Policy
        </h1>
        <p className="text-[#0B2114]/70 text-sm max-w-xl">
          In accordance with the Consumer Protection (E-Commerce) Rules 2020, we maintain a transparent process for cancellations, returns, and refunds.
        </p>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 py-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl md:col-span-2">
          <AlertOctagon className="w-6 h-6 text-red-700 mb-4" />
          <h3 className="font-serif text-xl mb-2 text-red-900">Non-Returnable Items</h3>
          <p className="text-sm text-[#0B2114]/80 leading-relaxed mb-4">
            Due to strict health, hygiene, and FSSAI/FDA safety regulations, the following categories are strictly non-returnable once dispatched:
          </p>
          <ul className="text-sm text-[#0B2114]/70 space-y-2 list-disc pl-4">
            <li><strong>Prescription Medicines:</strong> Specially compounded pharmacy formulations.</li>
            <li><strong>Perishable Groceries:</strong> Fresh produce, dairy, bakery items, or temperature-sensitive organic foods from AIRO Essentials.</li>
            <li><strong>Personal Care:</strong> Opened hygiene, wellness, or skincare products.</li>
          </ul>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <RefreshCcw className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Returns & Replacements</h3>
          <p className="text-sm text-[#0B2114]/80 leading-relaxed">
            For eligible non-perishable items, returns or replacement requests must be raised within <strong>48 hours of delivery</strong>. Returns are only accepted if the item is physically damaged during transit, expired at the time of delivery, or significantly different from the description.
          </p>
        </div>

        <div className="bg-white border border-[#E6DFD5] p-8 rounded-2xl">
          <CheckCircle2 className="w-6 h-6 text-emerald-700 mb-4" />
          <h3 className="font-serif text-xl mb-2">Order Cancellations</h3>
          <p className="text-sm text-[#0B2114]/80 leading-relaxed">
            You may cancel your order at no cost anytime <strong>before it is dispatched</strong> from our fulfillment center. Once an order is marked as &quot;Shipped&quot; or &quot;Out for Delivery,&quot; cancellation requests will not be entertained for perishable goods.
          </p>
        </div>

        <div className="bg-[#0B2114] text-[#FAF8F5] border border-[#1A3324] p-8 rounded-2xl md:col-span-2 flex flex-col md:flex-row items-center gap-8">
          <div className="bg-[#1A3324] p-4 rounded-full shrink-0">
            <CreditCard className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-serif text-xl mb-2 text-[#D4AF37]">Refund Processing (5-7 Business Days)</h3>
            <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
              Approved refunds will be initiated within 24 hours of confirmation or receipt of the returned item. As per standard RBI guidelines and payment gateway SLAs, the refunded amount will reflect in your original source of payment (Bank Account, UPI, or Credit Card) within <strong>5 to 7 business days</strong>.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
