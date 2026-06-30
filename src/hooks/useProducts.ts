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
        const MOCK_GROCERY: Product = {
          id: "mock-essentials-1",
          name: "Organic Matcha Green Tea",
          price: 24.99,
          category: "Wellness",
          storeType: "grocery",
          image: "https://images.unsplash.com/photo-1582793988951-9aed550c6ea2?auto=format&fit=crop&q=80",
          description: "Premium ceremonial grade matcha sourced directly from Uji, Japan. Rich in antioxidants and perfect for daily energy without the jittery crash.",
          tagline: "Your daily calm energy",
          discount: 0,
          stock: 50,
          sku: "MTC-ORG-01",
          weight: 100,
          ingredients: "100% Ceremonial Grade Matcha Green Tea Powder\nL-Theanine\nNaturally Occurring Caffeine",
          benefits: "Boosts Metabolism naturally\nEnhances focus and clarity\nRich in Catechins (EGCG)",
          isActive: true,
          isFeatured: true,
          isComingSoon: false,
          badge: "Best Seller",
          themeColor: "#5b8c5a",
          sortPosition: 1,
          galleryImages: [
            "https://images.unsplash.com/photo-1582793988951-9aed550c6ea2?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80"
          ],
          variants: ["100g", "250g", "500g"],
          aPlusContent: [
            {
              imageUrl: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80",
              title: "Antioxidant Powerhouse",
              description: "Packed with EGCG, our ceremonial grade matcha provides steady, calm energy without the midday crash."
            },
            {
              imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80",
              title: "Sourced from Uji, Japan",
              description: "Shade-grown for 20 days before harvest to maximize chlorophyll and L-theanine levels."
            }
          ]
        };

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

        const mockProduct = storeType === "grocery" ? MOCK_GROCERY : MOCK_PHARMACY;
        
        // Append the mock product if it isn't already in the database
        setProducts([mockProduct, ...fetchedProducts]);
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
