"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Product } from "@/hooks/useProducts";
import { ProductForm } from "./ProductForm";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // List State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStore, setFilterStore] = useState<"all" | "grocery" | "pharmacy">("all");
  
  // View State
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(fetched);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleCreateNew = () => {
    setEditingProduct(null);
    setCurrentView("form");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setCurrentView("form");
  };

  const handleCancelForm = () => {
    setCurrentView("list");
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData: Omit<Product, "id">) => {
    try {
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }
      setCurrentView("list");
      setEditingProduct(null);
      fetchAllProducts(); // Refresh list
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchAllProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStore = filterStore === "all" || p.storeType === filterStore;
    return matchesSearch && matchesStore;
  });

  if (currentView === "form") {
    return (
      <ProductForm 
        initialData={editingProduct} 
        onSave={handleSaveProduct} 
        onCancel={handleCancelForm} 
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-sans font-semibold text-gray-900 mb-1">Products</h2>
          <p className="text-sm text-gray-500 font-sans tracking-wide">Manage your e-commerce catalog</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F7F6] rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "grocery", "pharmacy"] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterStore(type)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                filterStore === type 
                  ? "bg-gray-200 text-gray-900" 
                  : "bg-[#F4F7F6] text-gray-500 hover:bg-gray-200/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-4 text-xs font-semibold text-gray-500">Product</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500">Store</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500">Category</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500">Price</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-500">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-500">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold ${
                      product.storeType === 'grocery' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.storeType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{product.category}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{Number(product.price).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
