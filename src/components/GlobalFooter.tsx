import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer className="bg-[#1C1C1E] text-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block font-serif text-3xl font-bold tracking-tight mb-6">
              AIRO.
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Elevating daily essentials and wellness with uncompromising quality and clean ingredients.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-gray-300">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/grocery" className="hover:text-white transition-colors">Essentials</Link></li>
              <li><Link href="/pharmacy" className="hover:text-white transition-colors">Health Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-gray-300">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-6 text-gray-300">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AIRO. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-white transition-colors">Pinterest</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
