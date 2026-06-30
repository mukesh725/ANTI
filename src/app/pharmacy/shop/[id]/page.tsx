"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Product, useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/modules/retail/grocery/components/ProductCard";
import { GlobalHeader } from "@/components/GlobalHeader";
import { ArrowLeft, Check, Heart, Package, Clock, Calendar, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function PharmacyProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { products: allProducts } = useProducts("pharmacy");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const [timeRemaining, setTimeRemaining] = useState("02:50:25");

  // Mock Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        let [hours, minutes, seconds] = prev.split(':').map(Number);
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            hours = Math.max(0, hours - 1);
          }
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        if (id === "mock-health-1") {
          const mockData = {
            id: "mock-health-1",
            name: "Advanced Ashwagandha Extract",
            price: 34.00,
            category: "Supplements",
            storeType: "pharmacy",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
            galleryImages: [
              "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1611078709540-54d6fc922e9e?auto=format&fit=crop&q=80"
            ],
            variants: ["30 Capsules", "60 Capsules", "90 Capsules"],
            description: "Clinically formulated KSM-66 Ashwagandha for deep stress relief, lowered cortisol levels, and improved sleep quality.",
            isActive: true,
            isFeatured: true,
            isComingSoon: false,
          } as Product;
          setProduct(mockData);
          setActiveImage(mockData.image);
          if (mockData.variants?.length) setSelectedVariant(mockData.variants[0]);
          return;
        }

        const docRef = doc(db, "products", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          setActiveImage(data.image);
          if (data.variants?.length) setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <main className="min-h-screen bg-[#FFFFFF]">
        <GlobalHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#1C1C1E]/20 border-t-[#1C1C1E] rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, imageUrl: product.image, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const recommendedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4);
  const images = product.galleryImages?.length ? product.galleryImages : [product.image];

  return (
    <main className="min-h-screen bg-[#FFFFFF]">
      <GlobalHeader />
      
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        
        {/* Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-[#1C1C1E]/60">
            <button onClick={() => router.back()} className="hover:text-[#1C1C1E] flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
            <span>-</span>
            <span className="text-[#1C1C1E] font-medium">Product details</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#1C1C1E]">
            <span className="cursor-pointer hover:opacity-70">About</span>
            <span className="cursor-pointer hover:opacity-70">FAQs</span>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] rounded-[2rem] bg-[#F5F5F7] overflow-hidden flex items-center justify-center p-8">
              <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-opacity duration-300" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl bg-[#F5F5F7] p-2 flex items-center justify-center overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-[#1C1C1E]' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col pt-4">
            
            <div className="inline-block border border-[#1C1C1E]/10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#1C1C1E]/60 w-fit mb-4">
              {product.category}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-sans font-bold text-[#1C1C1E] mb-3">
              {product.name}
            </h1>
            
            <div className="text-xl font-bold text-[#1C1C1E] mb-6">
              ${Number(product.price).toFixed(2)}
            </div>

            {/* Delivery Timer */}
            <div className="flex items-center gap-2 border border-[#1C1C1E]/10 rounded-full py-2 px-4 w-fit mb-8 bg-gray-50 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Order in</span>
              <span className="font-bold text-[#1C1C1E]">{timeRemaining}</span>
              <span className="text-gray-500">to get next day delivery</span>
            </div>

            {/* Variants / Sizes */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-600 mb-3">Select Size</p>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                        selectedVariant === v 
                          ? 'bg-[#1C1C1E] text-white' 
                          : 'bg-[#F5F5F7] text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ADD TO CART */}
            <div className="flex items-center gap-3 mb-10">
              <button 
                onClick={handleAddToCart}
                disabled={added || product.isComingSoon}
                className={`flex-1 h-14 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#1C1C1E] text-white hover:bg-black/80'
                } ${product.isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {added ? <><Check className="w-5 h-5" /> Added to Cart</> : 'Add to Cart'}
              </button>
              <button className="h-14 w-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* ACCORDIONS */}
            <div className="space-y-4">
              
              {/* Description & Fit */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'description' ? null : 'description')}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-sm">Description & Fit</span>
                  {openAccordion === 'description' ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'description' ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </div>

              {/* Shipping */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-sm">Shipping</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === 'shipping' ? 'max-h-[500px] pb-6' : 'max-h-0'}`}>
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full"><Check className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Discount</p>
                        <p className="text-sm font-semibold">Over 80%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full"><Package className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Package</p>
                        <p className="text-sm font-semibold">Regular Package</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full"><Calendar className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Delivery Time</p>
                        <p className="text-sm font-semibold">3-5 Working Days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-full"><Clock className="w-4 h-4" /></div>
                      <div>
                        <p className="text-xs text-gray-400">Estimated Arrival</p>
                        <p className="text-sm font-semibold">10 - 12 October</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="mb-24">
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-8">Rating & Reviews</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Stats */}
            <div className="flex items-start gap-8">
              <div className="flex flex-col items-center">
                <div className="text-7xl font-bold text-[#1C1C1E] tracking-tighter">
                  4,5<span className="text-2xl text-gray-400 font-normal">/5</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">(60 New Reviews)</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-8">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium text-gray-600">{star}</span>
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1C1C1E]" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Review */}
            <div className="border border-gray-200 rounded-3xl p-6 relative">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-sm">Alex Mathio</span>
                <span className="text-xs text-gray-400">13 Oct 2024</span>
              </div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                &quot;AIRO&apos;s dedication to quality and ethical practices resonates strongly with today&apos;s consumers, positioning the brand as a responsible choice in the health world.&quot;
              </p>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80" alt="Reviewer" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RECOMMENDED PRODUCTS */}
        {recommendedProducts.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-bold text-[#1C1C1E] mb-8 text-center">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(rec => (
                <ProductCard key={rec.id} product={{ ...rec, imageUrl: rec.image }} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
