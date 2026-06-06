"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const inHouseBrands = [
  { name: "AIRO Select", label: "Premium Staples", color: "from-[#2A2B2A] to-[#1A1A1A]", img: "https://images.unsplash.com/photo-1615486171448-4fd13f1ddbc4?q=80&w=600" },
  { name: "AIRO Choice", label: "Value Staples", color: "from-[#3A352F] to-[#201D1A]", img: "https://images.unsplash.com/photo-1587049352847-4d4b12736173?q=80&w=600" },
  { name: "AIRO Pure", label: "Cleaning Essentials", color: "from-[#2C3539] to-[#151A1C]", img: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=600" },
  { name: "AIRO Treat", label: "Fun Foods", color: "from-[#3D2C2E] to-[#1F1617]", img: "https://images.unsplash.com/photo-1559703248-dcaaec9fac92?q=80&w=600" },
  { name: "AIRO Spirit", label: "Prayer Essentials", color: "from-[#3D342B] to-[#1F1A15]", img: "https://images.unsplash.com/photo-1601625463684-2fa643a60f9e?q=80&w=600" },
  { name: "AIRO Quick", label: "Ready To Eat", color: "from-[#2F362F] to-[#171C17]", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600" },
  { name: "AIRO Basics", label: "Daily Needs", color: "from-[#2B3238] to-[#15191C]", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-alabaster text-charcoal overflow-hidden">

      {/* =========================================================================
          SECTION 1: HERO IMAGE AND MAIN BUTTON
          =========================================================================
          Description: The very top of the homepage. Contains the large background 
          image, the "The New Standard" text, and the "Explore Essentials" button.
          To change the image: Replace the 'src' link inside the <motion.img> tag.
          ========================================================================= */}
      <section className="relative h-[85vh] w-full flex items-center justify-center p-4 md:p-8">
        <div className="relative w-full h-full overflow-hidden rounded-xl shadow-2xl">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1556910110-a5a63dfd393c?q=80&w=2000&auto=format&fit=crop"
            alt="AIRO Essentials Hero"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/20" />
        </div>
        <div className="absolute z-10 text-center flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-alabaster/80 mb-6" />
          <h1 className="font-serif text-6xl md:text-8xl text-alabaster mb-8 tracking-tight drop-shadow-md">
            The New <span className="italic">Standard.</span>
          </h1>
          <Link
            href="/grocery"
            className="bg-alabaster/90 backdrop-blur-md text-charcoal px-10 py-5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-alabaster hover:scale-105 silent-luxury-transition rounded-full shadow-xl inline-flex items-center gap-3"
          >
            Explore Essentials <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: SCROLLING MARQUEE
          =========================================================================
          Description: The thin black bar that constantly scrolls text from right 
          to left right beneath the hero section.
          To change text: Edit the words "Regenerative Agriculture", etc. below.
          ========================================================================= */}
      <div className="w-full bg-charcoal text-alabaster py-4 overflow-hidden flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="text-[10px] tracking-widest uppercase font-medium">Regenerative Agriculture</span>
              <span className="text-alabaster/30">•</span>
              <span className="text-[10px] tracking-widest uppercase font-medium">Clinical Precision</span>
              <span className="text-alabaster/30">•</span>
              <span className="text-[10px] tracking-widest uppercase font-medium">Absolute Purity</span>
              <span className="text-alabaster/30">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* =========================================================================
          SECTION 3: CURATED PRODUCT GRID
          =========================================================================
          Description: The 4 products shown with the staggered layout.
          To change products: Look for "Product 1", "Product 2", etc. You can 
          change the image 'src', the product name, and the price text.
          ========================================================================= */}
      <section className="py-32 px-8 md:px-16 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-charcoal/10 pb-8">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Curated by <span className="italic text-charcoal/70">AIRO</span></h2>
          <Link
            href="/grocery"
            className="text-[11px] font-medium tracking-[0.15em] uppercase hover:text-charcoal/60 silent-luxury-transition flex items-center gap-2"
          >
            View Entire Collection <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* --- Product 1 --- */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-[#F5F5F7] mb-6 overflow-hidden flex items-center justify-center rounded-2xl">
              <div className="absolute top-4 left-4 z-10 bg-charcoal text-alabaster text-[10px] px-4 py-1.5 font-medium tracking-widest uppercase rounded-full">
                Reserved
              </div>
              <img
                src="https://images.unsplash.com/photo-1615486171448-4fd13f1ddbc4?q=80&w=600&auto=format&fit=crop"
                alt="Product"
                className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="font-sans text-sm text-center">
              <p className="font-serif text-xl mb-1">Lakadong Turmeric</p>
              <p className="text-charcoal/50 tracking-widest text-[10px] uppercase">Waitlist Only</p>
            </div>
          </div>

          {/* --- Product 2 --- */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-[#F5F5F7] mb-6 overflow-hidden flex items-center justify-center rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1587049352847-4d4b12736173?q=80&w=600&auto=format&fit=crop"
                alt="Product"
                className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="font-sans text-sm text-center">
              <p className="font-serif text-xl mb-1">Wild Forest Honey</p>
              <p className="text-charcoal/50 tracking-widest text-[10px] uppercase">$45.00</p>
            </div>
          </div>

          {/* --- Product 3 --- */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-[#F5F5F7] mb-6 overflow-hidden flex items-center justify-center rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1601625463684-2fa643a60f9e?q=80&w=600&auto=format&fit=crop"
                alt="Product"
                className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="font-sans text-sm text-center">
              <p className="font-serif text-xl mb-1">Himalayan Pink Salt</p>
              <p className="text-charcoal/50 tracking-widest text-[10px] uppercase">$22.00</p>
            </div>
          </div>

          {/* --- Product 4 --- */}
          <div className="group cursor-pointer">
            <div className="relative aspect-[4/5] bg-[#F5F5F7] mb-6 overflow-hidden flex items-center justify-center rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop"
                alt="Product"
                className="w-3/4 h-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
            </div>
            <div className="font-sans text-sm text-center">
              <p className="font-serif text-xl mb-1">Ceremonial Matcha</p>
              <p className="text-charcoal/50 tracking-widest text-[10px] uppercase">$65.00</p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3.5: CINEMATIC VIDEO FEATURE
          =========================================================================
          Description: Full-width autoplay video to break up the sections.
          To change video: Replace the 'src' link in the <source> tag below.
          ========================================================================= */}
      <section className="w-full pb-32">
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden group">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s] ease-out"
            poster="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-charcoal/20 transition-colors duration-1000 group-hover:bg-charcoal/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 pointer-events-none">
            <h2 className="font-serif text-4xl md:text-6xl text-alabaster tracking-tight mb-4 drop-shadow-lg">
              Sourced from the <span className="italic">Source.</span>
            </h2>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-alabaster/90 drop-shadow-md">
              Radical Transparency
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE COLLECTIONS (BENTO GRID)
          =========================================================================
          Description: Asymmetrical bento-box grid matching the requested layout.
          ========================================================================= */}
      <section className="px-4 md:px-8 w-full pb-32">
        <h2 className="font-sans text-2xl md:text-3xl font-bold tracking-tight mb-8">THE COLLECTIONS</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* 1. Market Produce (Wide) */}
          <Link href="/grocery" className="group relative h-[300px] md:h-[450px] md:col-span-3 overflow-hidden block rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1200&auto=format&fit=crop"
              alt="Market Produce"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            {/* Subtle dark gradient just at the bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-sans text-3xl md:text-4xl tracking-tight mb-1">MARKET PRODUCE</h3>
              <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">ORGANIC & REGENERATIVE</span>
            </div>
          </Link>

          {/* 2. Pantry (Narrow) */}
          <Link href="/grocery" className="group relative h-[300px] md:h-[450px] md:col-span-2 overflow-hidden block rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
              alt="Pantry"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-sans text-3xl md:text-4xl tracking-tight mb-1">PANTRY</h3>
              <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">GLOBAL CURATIONS</span>
            </div>
          </Link>

          {/* 3. Cold Press (Narrow) */}
          <Link href="/grocery" className="group relative h-[300px] md:h-[450px] md:col-span-2 overflow-hidden block rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1600267253578-8d488de136e0?q=80&w=800&auto=format&fit=crop"
              alt="Cold Press"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-sans text-3xl md:text-4xl tracking-tight mb-1">COLD PRESS</h3>
              <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">RAW VITALITY</span>
            </div>
          </Link>

          {/* 4. Wellness (Wide) */}
          <Link href="/minute-clinic" className="group relative h-[300px] md:h-[450px] md:col-span-3 overflow-hidden block rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1564639912727-4660eb9d612e?q=80&w=1200&auto=format&fit=crop"
              alt="Wellness"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end">
              <h3 className="text-white font-sans text-3xl md:text-4xl tracking-tight mb-1">WELLNESS</h3>
              <span className="text-white/80 text-[10px] tracking-[0.2em] uppercase font-medium">HOLISTIC HEALTH</span>
            </div>
          </Link>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: IN-HOUSE BRANDS (COMPACT GRID)
          =========================================================================
          Description: Compact grid representing sub-brands or collections.
          ========================================================================= */}
      <section className="px-4 md:px-8 w-full pb-32">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Crafted with <span className="italic text-charcoal/70">Intention</span></h2>
          <p className="font-sans text-[11px] md:text-xs text-charcoal/60 tracking-widest uppercase font-medium">
            discover our deep commitment to you - experience our in-house collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1400px] mx-auto">
          {inHouseBrands.map((brand, idx) => (
            <Link key={idx} href="/grocery" className="group relative flex items-center justify-between py-5 px-6 rounded-2xl border border-charcoal/10 bg-alabaster hover:bg-charcoal hover:border-charcoal overflow-hidden silent-luxury-transition">

              {/* Subtle background image that fades in on hover */}
              <img
                src={brand.img}
                alt={brand.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 mix-blend-overlay transition-opacity duration-700 ease-out z-0"
              />

              {/* Left: Brand Name & Thumbnail */}
              <div className="relative z-10 flex items-center gap-4">
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm border border-charcoal/10"
                />
                <span className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-alabaster font-bold tracking-wider transition-colors duration-500">
                  {brand.name.split(' ')[0]}<span className="italic font-light ml-1">{brand.name.split(' ')[1]}</span>
                </span>
              </div>

              {/* Right: Label & Arrow */}
              <div className="relative z-10 flex items-center gap-4">
                <span className="text-charcoal/60 group-hover:text-alabaster/80 text-[10px] md:text-[11px] tracking-widest uppercase font-medium transition-colors duration-500 whitespace-nowrap">
                  {brand.label}
                </span>
                <div className="w-8 h-8 rounded-full border border-charcoal/10 text-charcoal flex items-center justify-center group-hover:border-alabaster/30 group-hover:text-alabaster transition-colors shrink-0">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LIFESTYLE IMAGE
          =========================================================================
          Description: The wide image right before the manifesto text at the bottom.
          ========================================================================= */}
      <section className="relative h-[70vh] w-full overflow-hidden group">
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop"
          alt="Lifestyle"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-alabaster via-transparent to-transparent opacity-80" />
      </section>

      {/* =========================================================================
          SECTION 7: THE MANIFESTO (TEXT BLOCK)
          =========================================================================
          Description: The frosted glass text block that overlaps the lifestyle image.
          To change text: Edit the paragraph below. The big "A" is the drop cap.
          ========================================================================= */}
      <section className="py-32 px-8 mx-8 md:mx-16 flex flex-col justify-center relative -mt-32 z-10 bg-alabaster/80 backdrop-blur-xl p-16 rounded-3xl shadow-2xl">
        <h3 className="text-[10px] font-medium tracking-[0.3em] uppercase text-charcoal/50 mb-8 text-center">
          The Manifesto
        </h3>
        <p className="font-serif text-2xl md:text-4xl leading-[1.6] text-charcoal mb-12">
          {/* This is the large drop cap letter */}
          <span className="float-left text-7xl md:text-9xl leading-none pr-4 font-normal text-charcoal/30">A</span>
          paradigm shift in wellness. We source globally and engineer clinically to build a community rooted in absolute purity, connection, and purpose. Welcome to the new standard of living.
        </p>
        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-charcoal border-b border-charcoal pb-1 hover:text-charcoal/50 hover:border-charcoal/50 silent-luxury-transition"
          >
            Read Our Architecture <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FOOTER
          =========================================================================
          Description: The bottom dark section containing the Newsletter and links.
          ========================================================================= */}
      <footer className="border-t border-charcoal/10 py-24 px-8 md:px-16 bg-charcoal text-alabaster rounded-t-[3rem] mt-12 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-16">

          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-4xl tracking-[0.2em] uppercase mb-12">AIRO<span className="opacity-50">.</span></h2>
            <h3 className="font-sans text-xl font-medium mb-4">The Journal</h3>
            <p className="text-sm text-alabaster/60 mb-8 max-w-sm leading-relaxed">
              Subscribe for clinical insights, seasonal harvest drops, and exclusive access to The Collective.
            </p>
            <form className="space-y-6 max-w-sm">
              <input
                type="text"
                placeholder="Name"
                className="w-full border-b border-alabaster/30 pb-3 text-sm focus:outline-none focus:border-alabaster bg-transparent placeholder-alabaster/30 text-alabaster"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border-b border-alabaster/30 pb-3 text-sm focus:outline-none focus:border-alabaster bg-transparent placeholder-alabaster/30 text-alabaster"
              />
              <button
                type="submit"
                className="w-full bg-alabaster text-charcoal text-[10px] font-bold tracking-widest uppercase py-4 rounded-full hover:bg-alabaster/80 hover:scale-[1.02] silent-luxury-transition"
              >
                Join The Waitlist
              </button>
            </form>
          </div>

          <div>
            <h3 className="font-sans text-lg font-medium mb-8 text-alabaster/50 tracking-widest uppercase text-[10px]">Directory</h3>
            <ul className="space-y-4 text-sm text-alabaster/90">
              <li><Link href="/grocery" className="hover:text-alabaster/60 silent-luxury-transition">The Grocer</Link></li>
              <li><Link href="/pharmacy" className="hover:text-alabaster/60 silent-luxury-transition">Pharmacy Portal</Link></li>
              <li><Link href="/minute-clinic" className="hover:text-alabaster/60 silent-luxury-transition">MinuteClinic</Link></li>
              <li><Link href="/about" className="hover:text-alabaster/60 silent-luxury-transition">Philosophy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-lg font-medium mb-8 text-alabaster/50 tracking-widest uppercase text-[10px]">Connect</h3>
            <ul className="space-y-4 text-sm text-alabaster/90">
              <li><a href="mailto:concierge@airo.com" className="hover:text-alabaster/60 silent-luxury-transition">concierge@airo.com</a></li>
              <li><a href="mailto:clinical@airo.com" className="hover:text-alabaster/60 silent-luxury-transition">clinical@airo.com</a></li>
              <li className="pt-8 text-alabaster/30 text-[10px] tracking-widest uppercase">© 2026 AIRO Essentials</li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
