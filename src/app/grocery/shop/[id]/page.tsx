"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product } from "@/hooks/useProducts";
import { GlobalHeader } from "@/components/GlobalHeader";
import { ArrowLeft, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("ingredients");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
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
      <main className="min-h-screen bg-[#FAF8F5]">
        <GlobalHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#0B2114]/20 border-t-[#0B2114] rounded-full animate-spin"></div>
        </div>

      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <GlobalHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-serif text-[#0B2114] mb-4">Product Not Found</h1>
          <button onClick={() => router.back()} className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </button>
        </div>

      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      storeType: product.storeType
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const ingredientsList = product.ingredients ? product.ingredients.split('\n').filter(Boolean) : [];
  const benefitsList = product.benefits ? product.benefits.split('\n').filter(Boolean) : [];
  
  // Create a very subtle background from the theme color if it exists, otherwise fallback to standard #F0EAE1
  const themeBg = product.themeColor ? `${product.themeColor}15` : '#F0EAE1';

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <GlobalHeader />
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-24">
        
        <button 
          onClick={() => router.back()} 
          className="text-sm font-medium text-[#0B2114]/60 hover:text-[#0B2114] transition-colors flex items-center gap-2 mb-8 md:mb-16"
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
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-[#0B2114] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full z-10">
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
              <span className="text-xs font-bold uppercase tracking-widest text-[#0B2114]/50">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#0B2114] mb-4 leading-tight">
              {product.name}
            </h1>
            
            {product.tagline && (
              <p className="text-lg text-[#0B2114]/70 mb-8 font-medium">
                {product.tagline}
              </p>
            )}

            <div className="text-2xl font-serif text-[#0B2114] mb-8">
              ${Number(product.price).toFixed(2)}
              {product.weight && (
                <span className="text-sm font-sans text-[#0B2114]/50 ml-2">/ {product.weight}g</span>
              )}
            </div>

            <p className="text-base text-[#0B2114]/70 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* ADD TO CART CONTROLS */}
            {!product.isComingSoon ? (
              <div className="flex items-center gap-4 mb-16">
                <div className="flex items-center border border-[#0B2114]/10 rounded-full bg-white h-14 w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex-1 flex items-center justify-center text-[#0B2114] hover:bg-[#0B2114]/5 rounded-l-full h-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex-1 flex items-center justify-center text-[#0B2114] hover:bg-[#0B2114]/5 rounded-r-full h-full transition-colors"
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
                      : 'bg-[#0B2114] text-[#FAF8F5] hover:bg-[#D4AF37] hover:text-[#0B2114]'
                  }`}
                >
                  {added ? <><Check className="w-4 h-4" /> Added to Cart</> : 'Add to Cart'}
                </button>
              </div>
            ) : (
              <div className="mb-16">
                <button 
                  disabled
                  className="w-full h-14 rounded-full bg-[#0B2114]/5 text-[#0B2114]/40 text-sm font-bold uppercase tracking-widest cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            )}

            {/* ACCORDIONS */}
            <div className="border-t border-[#0B2114]/10">
              
              {ingredientsList.length > 0 && (
                <div className="border-b border-[#0B2114]/10">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'ingredients' ? null : 'ingredients')}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-serif text-[#0B2114]">Ingredients</span>
                    <span className="text-[#0B2114]/40 group-hover:text-[#0B2114] transition-colors">
                      {openAccordion === 'ingredients' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'ingredients' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className="space-y-3">
                      {ingredientsList.map((ing, i) => (
                        <li key={i} className="text-sm text-[#0B2114]/70 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {benefitsList.length > 0 && (
                <div className="border-b border-[#0B2114]/10">
                  <button 
                    onClick={() => setOpenAccordion(openAccordion === 'benefits' ? null : 'benefits')}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-serif text-[#0B2114]">Benefits</span>
                    <span className="text-[#0B2114]/40 group-hover:text-[#0B2114] transition-colors">
                      {openAccordion === 'benefits' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === 'benefits' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className="space-y-3">
                      {benefitsList.map((ben, i) => (
                        <li key={i} className="text-sm text-[#0B2114]/70 flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
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
    </main>
  );
}
