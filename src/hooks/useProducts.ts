import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  storeType: "grocery" | "pharmacy";
  image: string;
  description: string;
}

export function useProducts(storeType: "grocery" | "pharmacy") {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"), where("storeType", "==", storeType));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error(`Failed to fetch ${storeType} products:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [storeType]);

  return { products, loading };
}
