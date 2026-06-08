"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("airo_admin_auth") === "true";
      if (isAuth) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  return (
    <div className="w-full min-h-screen bg-[#07120F] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}
