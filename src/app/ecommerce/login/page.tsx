"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function EcommerceLogin() {
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/ecommerce/account");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0B2114] flex flex-col items-center justify-center pt-24 pb-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-[#0B2114]/5"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="font-sans text-xs text-[#0B2114]/60 tracking-wide">
            {isLogin ? "Sign in to access your orders and saved carts." : "Join AIRO to track your wellness journey."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#0B2114]/10 rounded-lg focus:outline-none focus:border-[#0B2114] text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#0B2114]/10 rounded-lg focus:outline-none focus:border-[#0B2114] text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#0B2114] text-[#FAF8F5] py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-[#0B2114]/90 transition-colors mt-6"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-medium text-[#0B2114]/60 hover:text-[#0B2114] transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
