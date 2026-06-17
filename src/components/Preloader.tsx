"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Leaf, Pill } from "lucide-react";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<"text" | "icons" | "fade">("text");
  const [isHealthDomain, setIsHealthDomain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port;
      setIsHealthDomain(host.includes("airohealth") || host.includes("health.airo") || port === "3001");
    }

    // Stage 1: Text shows for 1.5s
    const textTimer = setTimeout(() => setStage("icons"), 1500);
    // Stage 2: Icons show for 1.5s
    const iconTimer = setTimeout(() => setStage("fade"), 3000);
    // Stage 3: Fade out and complete
    const completeTimer = setTimeout(() => onComplete(), 3800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(iconTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage !== "fade" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-alabaster text-charcoal"
        >
          {/* Logo Stage */}
          {stage === "text" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <img 
                src={isHealthDomain ? "/airo-health-favicon.png" : "/airo-essentials-favicon.png"} 
                alt="AIRO Logo" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
              />
            </motion.div>
          )}

          {/* Icons Stage (Morphing effect) */}
          {stage === "icons" && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="flex items-center gap-8 text-charcoal/80"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf className="w-16 h-16 md:w-24 md:h-24 stroke-[1.5]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              >
                <Pill className="w-16 h-16 md:w-24 md:h-24 stroke-[1.5]" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              >
                <Sparkles className="w-16 h-16 md:w-24 md:h-24 stroke-[1.5]" />
              </motion.div>
            </motion.div>
          )}
          
          {/* Subtle loading text */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-12 font-sans text-xs tracking-[0.3em] uppercase text-charcoal/40"
          >
            {isHealthDomain ? "Health Hub Loading" : "Essentials Loading"}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
