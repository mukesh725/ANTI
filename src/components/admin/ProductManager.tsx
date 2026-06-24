"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Image as ImageIcon, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Product } from "@/hooks/useProducts";
import { useCms } from "@/context/CmsContext";

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStore, setFilterStore] = useState<"all" | "grocery" | "pharmacy">("all");
  const cmsData = useCms();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    category: "",
    storeType: "grocery",
    image: "",
    description: "",
  });

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

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        storeType: product.storeType,
        image: product.image,
        description: product.description,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: 0,
        category: "",
        storeType: "grocery",
        image: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), formData);
      } else {
        await addDoc(collection(db, "products"), formData);
      }
      setIsModalOpen(false);
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

  // Get dynamic categories based on selected storeType in form
  const formCategories = formData.storeType === "grocery" 
    ? (cmsData?.pages?.grocery?.sections?.categories || []).map((c: { title: string }) => c.title)
    : (cmsData?.pages?.pharmacy?.sections?.categories || []).map((c: { title: string }) => c.title);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-sans font-medium text-gray-800 mb-1">Products</h2>
          <p className="text-sm text-gray-800/60 font-sans tracking-wide">Manage your e-commerce catalog</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-white text-gray-800 px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-800/40" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "grocery", "pharmacy"] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterStore(type)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-bold transition-all ${
                filterStore === type 
                  ? "bg-white text-gray-800" 
                  : "bg-white text-gray-800/60 hover:bg-white/10"
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
            <tr className="border-b border-gray-200/10">
              <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-800/50 font-bold">Product</th>
              <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-800/50 font-bold">Store</th>
              <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-800/50 font-bold">Category</th>
              <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-800/50 font-bold">Price</th>
              <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-gray-800/50 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-800/50">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-gray-800/50">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-gray-200/5 hover:bg-white/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200/5">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gray-800/20" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-800/50 line-clamp-1 max-w-[200px]">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-[9px] uppercase tracking-widest font-bold ${
                      product.storeType === 'grocery' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {product.storeType}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-800/70">{product.category}</td>
                  <td className="py-4 px-4 text-sm font-medium text-emerald-600">${Number(product.price).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-gray-800/40 hover:text-gray-800 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-md relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-800" />
            </button>
            
            <div className="p-8">
              <h3 className="text-2xl font-sans font-medium text-gray-800 mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g. Organic Avocados"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Price ($)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200"
                      placeholder="e.g. 4.99"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Store Type</label>
                    <select 
                      value={formData.storeType}
                      onChange={e => setFormData({...formData, storeType: e.target.value as "grocery" | "pharmacy", category: ""})}
                      className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="grocery">AIRO Essentials (Grocery)</option>
                      <option value="pharmacy">AIRO Health Hub (Pharmacy)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Category</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200"
                    >
                      <option value="" disabled>Select a category</option>
                      {formCategories.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Image URL</label>
                  <input 
                    required
                    type="url" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2 w-24 h-24 rounded-xl border border-gray-200/10 overflow-hidden bg-white">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-gray-800/60 font-bold block">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white text-gray-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-200 resize-none"
                    placeholder="Short description of the product..."
                  />
                </div>

                <div className="pt-6 border-t border-gray-200/5 flex justify-end gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold text-gray-800/60 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-white text-gray-800 px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-colors shadow-lg"
                  >
                    {editingProduct ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
