"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, User } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service safely in production
    console.error("Client error boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-black/5 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h2 className="font-serif text-2xl md:text-3xl text-ink font-semibold mb-3">
          Session Restored Safely
        </h2>

        <p className="text-xs md:text-sm text-ink/60 mb-8 leading-relaxed">
          We encountered an unexpected interface state while loading your account or data. 
          Your account and personal information remain completely secure.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-[#006537] hover:bg-[#004e2a] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/ecommerce/login"
            className="w-full bg-black/5 hover:bg-black/10 text-ink py-3.5 px-6 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Go to Account Sign In
          </Link>

          <Link
            href="/"
            className="w-full text-ink/60 hover:text-ink py-2 px-6 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
