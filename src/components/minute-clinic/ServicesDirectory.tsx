"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { minuteClinicServices, mainCategories } from "@/data/minuteClinicServices";
import { getSearchKeywords } from "@/lib/searchSynonyms";

export function ServicesDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = minuteClinicServices.filter(service => {
    const matchesCategory = selectedCategory === "All" || service.mainCategory === selectedCategory;
    
    if (!searchQuery) return matchesCategory;
    
    const queryKeywords = getSearchKeywords(searchQuery);
    const serviceText = `${service.title} ${service.mainCategory} ${service.subCategory}`.toLowerCase();
    const matchesSearch = queryKeywords.some(kw => serviceText.includes(kw));
    
    return matchesCategory && matchesSearch;
  });

  // Group by subcategory
  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.subCategory]) {
      acc[service.subCategory] = [];
    }
    acc[service.subCategory].push(service);
    return acc;
  }, {} as Record<string, typeof minuteClinicServices>);

  return (
    <section className="py-24 px-6 md:px-16 max-w-[1400px] mx-auto w-full bg-[#FAFAFA] rounded-3xl my-12" id="services">
      <div className="flex flex-col items-start mb-12">
        <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">Choose from {minuteClinicServices.length} services</h2>
        <p className="text-ink/70 max-w-2xl text-sm leading-relaxed mb-8">
          As a comprehensive clinical health provider, we offer services to address everything from strep throat to medical weight management. Select a category below or search for a specific service.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search symptoms or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-theme/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1C1C1E]/30 transition-all"
          />
        </div>

        {/* Categories Pill Navigation */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
              selectedCategory === "All"
                ? "bg-theme text-white border-theme"
                : "bg-white text-ink border-theme/20 hover:border-theme/50"
            }`}
          >
            All Services
          </button>
          {mainCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 border ${
                selectedCategory === category
                  ? "bg-theme text-white border-theme"
                  : "bg-white text-ink border-theme/20 hover:border-theme/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grouped by Subcategory */}
      <div className="flex flex-col gap-12">
        {Object.entries(groupedServices).map(([subCategory, services]) => (
          <div key={subCategory} className="flex flex-col gap-6">
            <h3 className="font-serif text-2xl text-ink border-b border-theme/10 pb-4">
              {subCategory}
            </h3>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {services.map((service) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={service.id}
                  >
                    <Link 
                      href={`/minute-clinic/booking?service=${service.id}`}
                      className="group flex flex-col justify-between p-5 bg-white border border-theme/10 rounded-2xl hover:border-theme/30 hover:shadow-lg transition-all h-full min-h-[100px]"
                    >
                      <div className="flex flex-col gap-1 pr-4 mb-4">
                        <span className="text-[9px] uppercase tracking-widest text-ink/40 font-bold">{service.mainCategory}</span>
                        <span className="text-sm font-semibold text-ink group-hover:text-blue-600 transition-colors">{service.title}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors self-end mt-auto">
                        <ArrowRight className="w-3.5 h-3.5 text-ink/60 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-ink/50 text-sm">No services found matching your criteria.</p>
        </div>
      )}
    </section>
  );
}
