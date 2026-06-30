"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product, useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { GlobalHeader } from "@/components/GlobalHeader";
import { ArrowLeft, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { products: allProducts } = useProducts("grocery");
  
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("ingredients");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        if (id === "mock-essentials-1") {
          setProduct({
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
            sortPosition: 1
          } as Product);
          return;
        }

        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFFFF]">
        <GlobalHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#1C1C1E]/20 border-t-[#1C1C1E] rounded-full animate-spin"></div>
        </div>

      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FFFFFF]">
        <GlobalHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-serif text-[#1C1C1E] mb-4">Product Not Found</h1>
          <button onClick={() => router.back()} className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>
        </div>

      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.image, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const ingredientsList = product.ingredients ? product.ingredients.split('\n').filter(Boolean) : [];
  const benefitsList = product.benefits ? product.benefits.split('\n').filter(Boolean) : [];
  
  // Create a very subtle background from the theme color if it exists, otherwise fallback to standard #F0EAE1
  const themeBg = product.themeColor ? `${product.themeColor}15` : '#F0EAE1';

  const recommendedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <GlobalHeader />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-24">
        
        <button 
          onClick={() => router.back()} 
          className="text-sm font-medium text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-colors flex items-center gap-2 mb-8 md:mb-16"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LEFT: IMAGE */}
          <div 
            className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden flex items-center justify-center p-12 relative"
            style={{ backgroundColor: themeBg }}
          >
            {product.badge && (
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#1C1C1E] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full z-10">
                {product.badge}
              </div>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col max-w-[500px]">
            
            <div className="mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1C1C1E]/50">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#1C1C1E] mb-4 leading-tight">
              {product.name}
            </h1>
            
            {product.tagline && (
              <p className="text-lg text-[#1C1C1E]/70 mb-8 font-medium">
                {product.tagline}
              </p>
            )}

            <div className="text-2xl font-serif text-[#1C1C1E] mb-8">
              ${Number(product.price).toFixed(2)}
              {product.weight && (
                <span className="text-sm font-sans text-[#1C1C1E]/50 ml-2">/ {product.weight}g</span>
              )}
            </div>

            <p className="text-base text-[#1C1C1E]/70 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* ADD TO CART CONTROLS */}
            {!product.isComingSoon ? (
              <div className="flex items-center gap-4 mb-16">
                <div className="flex items-center border border-[#1C1C1E]/10 rounded-full bg-white h-14 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex items-center justify-center text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-l-full h-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 flex items-center justify-center text-[#1C1C1E] hover:bg-[#1C1C1E]/5 rounded-r-full h-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 h-14 rounded-full text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    added 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#1C1C1E] text-[#FFFFFF] hover:bg-[#0A84FF] hover:text-[#1C1C1E]'
                  }`}
                >
                  {added ? <><Check className="w-4 h-4" /> Added to Cart</> : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <div className="mb-16">
                <button 
                  disabled
                  className="w-full h-14 rounded-full bg-[#1C1C1E]/5 text-[#1C1C1E]/40 text-sm font-bold uppercase tracking-widest cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            )}

            {/* ACCORDIONS */}
            <div className="border-t border-[#1C1C1E]/10">
              
              {ingredientsList.length > 0 && (
                <div className="border-b border-[#1C1C1E]/10">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-serif text-[#1C1C1E]">Ingredients</span>
                    <span className="text-[#1C1C1E]/40 group-hover:text-[#1C1C1E] transition-colors">
                      {openAccordion === 'ingredients' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'ingredients' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className="space-y-3">
                      {ingredientsList.map((ing, i) => (
                        <li key={i} className="text-sm text-[#1C1C1E]/70 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] mt-1.5 flex-shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {benefitsList.length > 0 && (
                <div className="border-b border-[#1C1C1E]/10">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'benefits' ? null : 'benefits')}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-serif text-[#1C1C1E]">Benefits</span>
                    <span className="text-[#1C1C1E]/40 group-hover:text-[#1C1C1E] transition-colors">
                      {openAccordion === 'benefits' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'benefits' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className="space-y-3">
                      {benefitsList.map((ben, i) => (
                        <li key={i} className="text-sm text-[#1C1C1E]/70 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] mt-1.5 flex-shrink-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>

      {/* A+ CONTENT SECTIONS */}
      {product.aPlusContent && product.aPlusContent.length > 0 && (
        <div className="w-full">
          {product.aPlusContent.map((block, idx) => (
            <div key={idx} className={`w-full py-24 md:py-32 ${idx % 2 === 0 ? 'bg-[#F9F9FB]' : 'bg-white'}`}>
              <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                <div className={`aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ${idx % 2 !== 0 ? 'md:order-last' : ''}`}>
                  <img src={block.imageUrl} alt={block.title || "Product feature"} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  {block.title && <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-[#1C1C1E] mb-6">{block.title}</h2>}
                  {block.description && <p className="font-sans text-[#1C1C1E]/70 leading-relaxed text-lg font-light">{block.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECOMMENDED PRODUCTS */}
      {recommendedProducts.length > 0 && (
        <div className="w-full bg-[#1C1C1E]/[0.02] py-24 border-t border-[#1C1C1E]/10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl font-serif text-[#1C1C1E] mb-12 text-center tracking-tight">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {recommendedProducts.map(rec => (
                <ProductCard key={rec.id} product={{ ...rec, imageUrl: rec.image }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
