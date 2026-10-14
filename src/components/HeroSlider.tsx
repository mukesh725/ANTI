"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface SlideItem {
  id: string;
  image: string;
  alt: string;
  link: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  hasCustomOverlay?: boolean;
  theme?: "light" | "dark";
  objectPosition?: string;
}

interface HeroSliderProps {
  slides?: SlideItem[];
  images?: string[];
  interval?: number;
  onSlideChange?: (index: number) => void;
}

export default function HeroSlider({ 
  slides,
  images, 
  interval = 3000,
  onSlideChange
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize slides: either use slides array or wrap images
  const normalizedSlides: SlideItem[] = slides && slides.length > 0 
    ? slides 
    : (images || []).map((img, i) => ({
        id: `slide-${i}`,
        image: img,
        alt: `AIRO Slide ${i + 1}`,
        link: "/emed"
      }));

  const total = normalizedSlides.length;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev + 1) % total;
      if (onSlideChange) onSlideChange(next);
      return next;
    });
  }, [total, onSlideChange]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => {
      const next = (prev - 1 + total) % total;
      if (onSlideChange) onSlideChange(next);
      return next;
    });
  }, [total, onSlideChange]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, interval);
    return () => clearInterval(timer);
  }, [total, interval, nextSlide]);

  if (total === 0) return null;

  const current = normalizedSlides[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden group select-none">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current.id || current.image}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          {current.link?.startsWith("http") ? (
            <a 
              href={current.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full h-full block cursor-pointer"
              aria-label={current.title || current.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.alt}
                className={`w-full h-full object-cover ${current.objectPosition || "object-center"}`}
              />
            </a>
          ) : (
            <Link 
              href={current.link || "/emed"} 
              className="relative w-full h-full block cursor-pointer"
              aria-label={current.title || current.alt}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.alt}
                className={`w-full h-full object-cover ${current.objectPosition || "object-center"}`}
              />
            </Link>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Visible on hover) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#16213E] backdrop-blur-md border border-[#16213E]/10 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#16213E] backdrop-blur-md border border-[#16213E]/10 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Indicators / Dots */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20">
          {normalizedSlides.map((slide, idx) => (
            <button
              key={slide.id || idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(idx);
                if (onSlideChange) onSlideChange(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-7 h-2 bg-[#16213E] border border-white/80 shadow"
                  : "w-2 h-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
