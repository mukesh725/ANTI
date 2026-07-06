"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface ProductProps {
  id: string;
  storeType?: string;
  name: string;
  price: number;
  origin?: string;
  provenanceStory?: string;
  imageUrl: string;
  soldOut?: boolean;
}

export function ProductCard({
  product,
}: {
  product: ProductProps;
}) {
  return (
    <div className="group relative flex flex-col">
      <Link href={`/${product.storeType || 'grocery'}/shop/${product.id}`} className="block relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F7] mb-4 flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-4/5 h-4/5 object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Sold Out Badge */}
        {product.soldOut && (
          <div className="absolute top-0 left-0 bg-charcoal text-white text-[10px] px-2 py-1">
            Sold Out
          </div>
        )}

        {/* Add to Cart Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            // Add cart logic here
          }}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={18} className="text-charcoal" />
        </button>
      </Link>

      {/* Product Meta */}
      <Link href={`/${product.storeType || 'grocery'}/shop/${product.id}`} className="flex flex-col items-center text-center px-2">
        <h3 className="font-sans text-[11px] md:text-xs text-charcoal mb-1 tracking-wide">
          {product.name}
        </h3>
        <p className="font-sans text-[11px] md:text-xs text-charcoal/60">
          ₹{product.price.toFixed(2)}
        </p>
      </Link>
    </div>
  );
}
