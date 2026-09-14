"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  mobile?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  stateText?: string;
  zip?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<UserProfile>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  loginWithEmail: async () => ({ uid: '', email: '', name: '' }),
  signUpWithEmail: async () => ({ uid: '', email: '', name: '' }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check local customer session storage first
    let hasStoredSession = false;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("airo_customer_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
          hasStoredSession = true;
        } catch (e) {}
      }
    }

    // 2. Firebase Auth state change listener
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        if (currentUser) {
          try {
            const docRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              setProfile(data);
              localStorage.setItem("airo_customer_user", JSON.stringify(data));
            } else {
              const newProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email,
                name: currentUser.displayName || currentUser.email?.split("@")[0] || "Customer",
              };
              await setDoc(docRef, newProfile);
              setProfile(newProfile);
              localStorage.setItem("airo_customer_user", JSON.stringify(newProfile));
            }
          } catch (e) {
            console.log("Firestore profile fetch handled:", e);
          }
        }
        setLoading(false);
      });
    } catch (err) {
      console.log("Firebase auth listener fallback:", err);
      setLoading(false);
    }

    if (hasStoredSession) {
      setLoading(false);
    }
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<UserProfile> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Secure server-side authentication (Rate-limited, Salted Scrypt Hash, Zero-Leakage)
    try {
      const res = await fetch("/api/auth/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass, mode: "login" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid email or password.");
      }
      if (data.user) {
        setProfile(data.user);
        localStorage.setItem("airo_customer_user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("airo_auth_token", data.token);
        }
        return data.user;
      }
    } catch (apiErr: any) {
      if (apiErr.message && !apiErr.message.includes("Failed to fetch")) {
        throw apiErr;
      }
      console.warn("Server auth unavailable, trying client fallback:", apiErr?.message);
    }

    // 2. Client-side Firebase Auth fallback if server route is unreachable
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const uProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          name: cred.user.displayName || cleanEmail.split("@")[0],
        };
        setProfile(uProfile);
        localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
        return uProfile;
      }
    } catch (fbErr: any) {
      console.warn("Client auth fallback failed:", fbErr?.message);
    }

    throw new Error("Invalid email or password.");
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<UserProfile> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Secure server-side registration
    try {
      const res = await fetch("/api/auth/customer-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: pass, name, mode: "signup" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please check your details.");
      }
      if (data.user) {
        setProfile(data.user);
        localStorage.setItem("airo_customer_user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("airo_auth_token", data.token);
        }
        return data.user;
      }
    } catch (apiErr: any) {
      if (apiErr.message && !apiErr.message.includes("Failed to fetch")) {
        throw apiErr;
      }
      console.warn("Server signup unavailable, trying client fallback:", apiErr?.message);
    }

    // 2. Client-side Firebase Auth fallback
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const uProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          name: name || cleanEmail.split("@")[0],
        };
        setProfile(uProfile);
        localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
        return uProfile;
      }
    } catch (fbErr: any) {
      throw new Error(fbErr?.message || "Sign up failed. Please try again.");
    }

    throw new Error("Registration failed. Please try again.");
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    localStorage.removeItem("airo_customer_user");
    localStorage.removeItem("airo_auth_token");
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
