'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DesignSandbox() {
  const [activeTab, setActiveTab] = useState(0);

  // Apple Design Spring (Critically damped - no overshoot)
  const springDefault = {
    type: 'spring',
    damping: 20, 
    stiffness: 100, 
  };

  // Apple Design Spring (Momentum/flick - bouncy)
  const springBouncy = {
    type: 'spring',
    damping: 12,
    stiffness: 100,
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      {/* 12. Materials & Depth - Translucent Chrome */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-black/5 saturate-[180%]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight">Apple Design Principles</h1>
          <nav className="flex gap-4">
            <button className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Preview</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-24 overflow-x-hidden">
        {/* 1. Response - kill latency, feedback on press */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">1. Instant Response & Feedback</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl">
              Buttons respond instantly on touch-down (press), not just on touch-up. We use Framer Motion's `whileTap` with a critically damped spring so the feedback is immediate and fluid.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileTap={{ scale: 0.96 }}
              transition={springDefault}
              className="px-6 py-3 bg-black text-white rounded-2xl font-medium shadow-sm hover:shadow-md transition-shadow"
            >
              Primary Action
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96, opacity: 0.7 }}
              transition={springDefault}
              className="px-6 py-3 bg-black/5 text-black rounded-2xl font-medium shadow-sm backdrop-blur-md"
            >
              Secondary Action
            </motion.button>
          </div>
        </section>

        {/* 2 & 3. Direct Manipulation & Interruptibility */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">2. Direct Manipulation & Springs</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl">
              Grab the card and throw it. Notice the <strong>1:1 tracking</strong> while dragging, the <strong>rubber-banding</strong> at the edges, and the <strong>momentum projection</strong> when you let go.
            </p>
          </div>
          <div className="h-[400px] bg-gray-100 rounded-[2rem] p-6 relative overflow-hidden border border-gray-200">
            <motion.div
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              dragElastic={0.4} 
              transition={springBouncy}
              whileDrag={{ scale: 1.05, cursor: "grabbing" }}
              className="w-48 h-48 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center cursor-grab absolute left-1/2 top-1/2 -ml-24 -mt-24"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full mb-4 shadow-inner" />
              <p className="font-medium text-gray-800">Throw me</p>
            </motion.div>
          </div>
        </section>

        {/* 12. Translucency & Hierarchy */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">3. Materials & Depth (Translucency)</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl">
              Translucent materials create a floating functional layer that brings structure without stealing focus, maintaining context of what's behind it.
            </p>
          </div>
          <div className="h-96 relative rounded-[2rem] overflow-hidden bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-end p-6">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...springDefault, delay: 0.1 }}
              className="w-full bg-white/30 backdrop-blur-2xl border border-white/30 saturate-[200%] rounded-3xl p-6 shadow-2xl"
            >
              <div className="w-12 h-1 bg-white/50 rounded-full mx-auto mb-4" />
              <h3 className="text-white font-medium text-xl mb-2 text-shadow-sm">Translucent Bottom Sheet</h3>
              <p className="text-white/90 text-sm leading-relaxed max-w-md">
                This sheet uses backdrop-filter to let the image bleed through. The content scrolling underneath feels continuous and connected.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 15. Typography */}
        <section className="space-y-6 pb-24">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">4. Optical Typography</h2>
            <p className="text-gray-500 leading-relaxed max-w-xl">
              Typography dynamically scales. Large text gets tighter tracking and leading; smaller text is spaced out for legibility.
            </p>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-200 shadow-sm space-y-12">
            <div>
              <p className="text-xs text-gray-400 font-bold tracking-[0.1em] uppercase mb-4">Display (Tight tracking & leading)</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]">
                Design that feels alive.
              </h1>
            </div>
            <div className="max-w-2xl">
              <p className="text-xs text-gray-400 font-bold tracking-[0.1em] uppercase mb-4">Body (Comfortable tracking & leading)</p>
              <p className="text-lg md:text-xl leading-relaxed text-gray-600 font-medium tracking-tight">
                When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
