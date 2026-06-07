"use client";

import { useState, useEffect } from "react";
import { Preloader } from "./Preloader";
import { GlobalHeader } from "./GlobalHeader";
import { AiraChatbot } from "./AiraChatbot";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  // Prevent scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {/* Hide content until loading is done to prevent flash */}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <GlobalHeader />
        <main className="flex-grow pt-28">
          {children}
        </main>
        <AiraChatbot />
      </div>
    </>
  );
}

