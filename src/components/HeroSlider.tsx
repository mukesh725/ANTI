"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSlider({ 
  images, 
  interval = 1000,
  onSlideChange
}: { 
  images: string[], 
  interval?: number,
  onSlideChange?: (index: number) => void 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % images.length;
        if (onSlideChange) onSlideChange(nextIndex);
        return nextIndex;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval, onSlideChange]);

  if (!images || images.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          alt="AIRO Hero"
        />
      </AnimatePresence>
    </div>
  );
}
