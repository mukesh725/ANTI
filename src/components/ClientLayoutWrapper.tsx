"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Preloader } from "./Preloader";
import { GlobalHeader } from "./GlobalHeader";
import { AiraChatbot } from "./AiraChatbot";

interface LocationData {
  city: string;
  country: string;
  region: string;
  ip: string;
}

interface HistoryEntry {
  path: string;
  timestamp: string;
}

interface AnalyticsData {
  pageViews: Record<string, number>;
  history: HistoryEntry[];
  visitorLocation: LocationData | null;
}

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Prevent scrolling while loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loading]);

  // Track page views and browsing history
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Log page view
    const existingAnalyticsStr = localStorage.getItem("airo_analytics");
    let analytics: AnalyticsData = {
      pageViews: {},
      history: [],
      visitorLocation: null
    };

    try {
      if (existingAnalyticsStr) {
        analytics = JSON.parse(existingAnalyticsStr);
      }
    } catch {
      // ignore
    }

    if (!analytics.pageViews) analytics.pageViews = {};
    if (!analytics.history) analytics.history = [];

    // Increment count for current path
    analytics.pageViews[pathname] = (analytics.pageViews[pathname] || 0) + 1;

    // Add to history (limit to last 20 paths to prevent local storage bloat)
    analytics.history.push({
      path: pathname,
      timestamp: new Date().toISOString()
    });
    if (analytics.history.length > 20) {
      analytics.history.shift();
    }

    localStorage.setItem("airo_analytics", JSON.stringify(analytics));
  }, [pathname]);

  // Fetch real geolocation on first load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchLocation = async () => {
      try {
        const existingAnalyticsStr = localStorage.getItem("airo_analytics");
        let analytics: Partial<AnalyticsData> = {};
        try {
          analytics = existingAnalyticsStr ? JSON.parse(existingAnalyticsStr) : {};
        } catch {
          analytics = {};
        }
        
        // Only fetch if location is not already set
        if (!analytics.visitorLocation) {
          const res = await fetch("https://ipapi.co/json/");
          if (res.ok) {
            const data = await res.json();
            analytics.visitorLocation = {
              city: data.city || "Unknown City",
              country: data.country_name || "Unknown Country",
              region: data.region || "",
              ip: data.ip || ""
            };
            localStorage.setItem("airo_analytics", JSON.stringify(analytics));
          }
        }
      } catch (err) {
        console.warn("Could not geolocate IP address", err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {/* Hide content until loading is done to prevent flash */}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <GlobalHeader />
        <main className={`flex-grow ${pathname === "/" ? "pt-0" : "pt-28"}`}>
          {children}
        </main>
        <AiraChatbot />
      </div>
    </>
  );
}

