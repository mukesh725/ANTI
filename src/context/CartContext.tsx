"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from Firestore or LocalStorage
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const docRef = doc(db, "carts", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItems(docSnap.data().items || []);
        } else {
          // If they just logged in and had local items, merge them
          const localCart = localStorage.getItem("airo_cart");
          if (localCart) {
            setItems(JSON.parse(localCart));
          }
        }
        setIsInitialized(true);
      };
      fetchCart();
    } else {
      const localCart = localStorage.getItem("airo_cart");
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
      setIsInitialized(true);
    }
  }, [user]);

  // Save cart to Firestore or LocalStorage
  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      const saveCart = async () => {
        await setDoc(doc(db, "carts", user.uid), {
          items,
          updatedAt: new Date().toISOString(),
          abandoned: items.length > 0 // Flag as abandoned if items exist
        }, { merge: true });
      };
      saveCart();
    } else {
      localStorage.setItem("airo_cart", JSON.stringify(items));
    }
  }, [items, user, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === newItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
