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

    // 1. Try Firebase Auth first
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
      console.warn("Firebase Auth fallback triggering:", fbErr?.message);
    }

    // 2. Fallback to Firestore 'users' collection lookup
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", cleanEmail));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const userDoc = snap.docs[0];
      const data = userDoc.data();
      const uProfile: UserProfile = {
        uid: userDoc.id,
        email: data.email || cleanEmail,
        name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || cleanEmail.split("@")[0],
        mobile: data.mobile,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        city: data.city,
        stateText: data.stateText,
        zip: data.zip,
      };
      setProfile(uProfile);
      localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
      return uProfile;
    }

    // If no existing user found, auto-create customer account
    const newDoc = await addDoc(usersRef, {
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
      role: "CUSTOMER",
      createdAt: new Date().toISOString(),
    });

    const uProfile: UserProfile = {
      uid: newDoc.id,
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
    };

    setProfile(uProfile);
    localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
    return uProfile;
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string): Promise<UserProfile> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Firebase Auth
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        const uProfile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email,
          name: name || cleanEmail.split("@")[0],
        };
        await setDoc(doc(db, "users", cred.user.uid), uProfile);
        setProfile(uProfile);
        localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
        return uProfile;
      }
    } catch (fbErr: any) {
      console.warn("Firebase Auth signup fallback triggering:", fbErr?.message);
    }

    // 2. Fallback to Firestore creation
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", cleanEmail));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const userDoc = snap.docs[0];
      const data = userDoc.data();
      const uProfile: UserProfile = {
        uid: userDoc.id,
        email: data.email || cleanEmail,
        name: name || data.name || cleanEmail.split("@")[0],
        mobile: data.mobile,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
        address: data.address,
        city: data.city,
        stateText: data.stateText,
        zip: data.zip,
      };
      setProfile(uProfile);
      localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
      return uProfile;
    }

    const newDoc = await addDoc(usersRef, {
      email: cleanEmail,
      name: name || cleanEmail.split("@")[0],
      role: "CUSTOMER",
      createdAt: new Date().toISOString(),
    });

    const uProfile: UserProfile = {
      uid: newDoc.id,
      email: cleanEmail,
      name: name || cleanEmail.split("@")[0],
    };

    setProfile(uProfile);
    localStorage.setItem("airo_customer_user", JSON.stringify(uProfile));
    return uProfile;
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    localStorage.removeItem("airo_customer_user");
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
