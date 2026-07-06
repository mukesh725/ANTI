import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer className="border-t border-[#1C1C1E]/10 py-16 px-8 md:px-16 bg-[#1C1C1E] text-[#FFFFFF] rounded-t-[3rem] w-full mt-auto">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">

        {/* Brand Column */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="font-serif text-3xl tracking-[0.2em] uppercase mb-6 text-[#FFFFFF]">
            AIRO<span className="opacity-50">.</span>
          </h2>
          <p className="text-xs text-[#FFFFFF]/60 leading-relaxed mb-8 max-w-xs pr-4">
            A paradigm shift in modern longevity. Elevating daily essentials and wellness with uncompromising quality and clean ingredients.
          </p>
          <div className="flex gap-4 text-[#FFFFFF]/50">
            <span className="cursor-pointer hover:text-[#FFFFFF] transition-colors text-xs tracking-widest uppercase">Instagram</span>
            <span className="cursor-pointer hover:text-[#FFFFFF] transition-colors text-xs tracking-widest uppercase">Twitter</span>
          </div>
        </div>

        {/* Ecosystem Portals */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-[#FFFFFF]/40 tracking-widest uppercase">
            Ecosystem Portals
          </h3>
          <ul className="space-y-4 text-xs text-[#FFFFFF]/80 font-medium">
            <li><Link href="/grocery" className="hover:text-[#FFFFFF] transition-colors">Essentials</Link></li>
            <li><Link href="/pharmacy" className="hover:text-[#FFFFFF] transition-colors">Pharmacy Portal</Link></li>
            <li><Link href="/minute-clinic" className="hover:text-[#FFFFFF] transition-colors">Minute Clinic</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-[#FFFFFF]/40 tracking-widest uppercase">
            Support
          </h3>
          <ul className="space-y-4 text-xs text-[#FFFFFF]/80 font-medium">
            <li><a href="mailto:concierge@airo.com" className="hover:text-[#FFFFFF] transition-colors">concierge@airo.com</a></li>
            <li><a href="mailto:grievance@airo.com" className="hover:text-[#FFFFFF] transition-colors">grievance@airo.com</a></li>
            <li className="pt-2 text-[#FFFFFF]/50 text-[10px]">Lic. No. 10026047000000</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-sans text-[10px] font-bold mb-6 text-[#FFFFFF]/40 tracking-widest uppercase">
            Legal
          </h3>
          <ul className="space-y-4 text-xs text-[#FFFFFF]/80 font-medium">
            <li><Link href="/privacy-policy" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</Link></li>
            <li><Link href="/refund-policy" className="hover:text-[#FFFFFF] transition-colors">Refund Policy</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-[#FFFFFF] transition-colors">Shipping Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#FFFFFF]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#FFFFFF]/30 text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} AIRO Health. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
