import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { MOCK_GROCERY_LIST } from "@/lib/mockGroceryProducts";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  storeType: "grocery" | "pharmacy";
  image: string;
  description: string;
  // Advanced fields
  tagline?: string;
  discount?: number;
  stock?: number;
  sku?: string;
  weight?: number; // in grams
  ingredients?: string; // stored as line-break separated
  benefits?: string; // stored as line-break separated
  isActive?: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  badge?: string;
  themeColor?: string;
  sortPosition?: number;
  aPlusContent?: { imageUrl: string; title?: string; description?: string }[];
  galleryImages?: string[];
  variants?: string[];
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
        


        const MOCK_PHARMACY: Product = {
          id: "mock-health-1",
          name: "Advanced Ashwagandha Extract",
          price: 34.00,
          category: "Supplements",
          storeType: "pharmacy",
          image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
          description: "Clinically formulated KSM-66 Ashwagandha for deep stress relief, lowered cortisol levels, and improved sleep quality.",
          tagline: "Adaptogenic Stress Support",
          discount: 0,
          stock: 120,
          sku: "ASH-KSM66-01",
          weight: 60,
          ingredients: "KSM-66 Ashwagandha Root Extract (600mg)\nOrganic Black Pepper Extract (5mg for absorption)",
          benefits: "Lowers Cortisol & Stress\nImproves Sleep Quality\nBoosts cognitive function",
          isActive: true,
          isFeatured: true,
          isComingSoon: false,
          badge: "Clinically Proven",
          themeColor: "#8e6e53",
          sortPosition: 1,
          galleryImages: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1611078709540-54d6fc922e9e?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80"
          ],
          variants: ["30 Capsules", "60 Capsules", "90 Capsules"],
          aPlusContent: [
            {
              imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80",
              title: "Clinically Studied KSM-66",
              description: "The most extensively researched ashwagandha extract on the market, proven to significantly lower cortisol levels."
            },
            {
              imageUrl: "https://images.unsplash.com/photo-1611078709540-54d6fc922e9e?auto=format&fit=crop&q=80",
              title: "Deep, Restorative Sleep",
              description: "By regulating your body's stress response, Ashwagandha promotes deeper REM sleep and better morning recovery."
            }
          ]
        };


        
        const mockPharmacy2: Product = { ...MOCK_PHARMACY, id: "mock-health-2", name: "Daily Multivitamin Gummies", price: 22.00, galleryImages: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80"] };
        const mockPharmacy3: Product = { ...MOCK_PHARMACY, id: "mock-health-3", name: "Liquid IV Hydration Multiplier", price: 24.99, galleryImages: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80"] };
        const mockPharmacy4: Product = { ...MOCK_PHARMACY, id: "mock-health-4", name: "Probiotic Complex", price: 28.50, galleryImages: ["https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80"] };

        const mockProducts = storeType === "grocery" 
          ? MOCK_GROCERY_LIST 
          : [MOCK_PHARMACY, mockPharmacy2, mockPharmacy3, mockPharmacy4];
        
        // Append the mock products if it isn't already in the database
        setProducts([...mockProducts, ...fetchedProducts]);
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
