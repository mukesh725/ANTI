"use client";

import React, { useState } from "react";
import { X, LayoutGrid } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCms } from "@/context/CmsContext";

interface ProductFormProps {
  initialData?: Product | null;
  onSave: (product: Omit<Product, "id">) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSave, onCancel }: ProductFormProps) {
  const cmsData = useCms();
  
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    category: initialData?.category || "",
    storeType: initialData?.storeType || "grocery",
    image: initialData?.image || "",
    description: initialData?.description || "",
    tagline: initialData?.tagline || "",
    discount: initialData?.discount || 0,
    stock: initialData?.stock || 0,
    sku: initialData?.sku || "",
    weight: initialData?.weight || 0,
    ingredients: initialData?.ingredients || "",
    benefits: initialData?.benefits || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isComingSoon: initialData?.isComingSoon ?? false,
    badge: initialData?.badge || "",
    themeColor: initialData?.themeColor || "",
    sortPosition: initialData?.sortPosition || 0,
    aPlusContent: initialData?.aPlusContent || [],
    galleryImages: initialData?.galleryImages || [],
    variants: initialData?.variants || [],
  });

  const [saving, setSaving] = useState(false);

  const formCategories = formData.storeType === "grocery" 
    ? (cmsData?.pages?.grocery?.sections?.categories || []).map((c: { title: string }) => c.title)
    : (cmsData?.pages?.pharmacy?.sections?.categories || []).map((c: { title: string }) => c.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  const updateField = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAPlusBlock = () => {
    setFormData(prev => ({
      ...prev,
      aPlusContent: [...(prev.aPlusContent || []), { imageUrl: "", title: "", description: "" }]
    }));
  };

  const removeAPlusBlock = (index: number) => {
    setFormData(prev => {
      const newBlocks = [...(prev.aPlusContent || [])];
      newBlocks.splice(index, 1);
      return { ...prev, aPlusContent: newBlocks };
    });
  };

  const updateAPlusBlock = (index: number, field: "imageUrl" | "title" | "description", value: string) => {
    setFormData(prev => {
      const newBlocks = [...(prev.aPlusContent || [])];
      newBlocks[index] = { ...newBlocks[index], [field]: value };
      return { ...prev, aPlusContent: newBlocks };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), ""]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants.splice(index, 1);
      return { ...prev, variants: newVariants };
    });
  };

  const updateVariant = (index: number, value: string) => {
    setFormData(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = value;
      return { ...prev, variants: newVariants };
    });
  };

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), ""]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...(prev.galleryImages || [])];
      newImages.splice(index, 1);
      return { ...prev, galleryImages: newImages };
    });
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...(prev.galleryImages || [])];
      newImages[index] = value;
      return { ...prev, galleryImages: newImages };
    });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen -m-8 p-8">
      
      {/* HEADER */}
      <div className="max-w-[1200px] mx-auto mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Products</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{initialData ? 'Edit product' : 'New product'}</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">{initialData ? formData.name : 'New product'}</h1>
        </div>
        <div className="flex gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : initialData ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* BASIC INFO */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Basic information</h2>
            <p className="text-sm text-gray-500 mb-6">Name, category, and the copy customers see on the product page.</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Main Image URL *</label>
                  <input 
                    required
                    type="url"
                    value={formData.image}
                    onChange={e => updateField('image', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500">Additional Gallery Images</label>
                    <button type="button" onClick={addGalleryImage} className="text-xs text-blue-600 font-medium hover:text-blue-700">+ Add image</button>
                  </div>
                  <div className="space-y-3">
                    {(formData.galleryImages || []).map((imgUrl, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="url"
                          value={imgUrl}
                          onChange={e => updateGalleryImage(idx, e.target.value)}
                          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://..."
                        />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Store *</label>
                  <select 
                    value={formData.storeType}
                    onChange={e => {
                      updateField('storeType', e.target.value as "grocery" | "pharmacy");
                      updateField('category', '');
                    }}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="grocery">Essentials</option>
                    <option value="pharmacy">Health Hub</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Category *</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={e => updateField('category', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select...</option>
                    {formCategories.map((cat: string) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Tagline</label>
              <input 
                type="text"
                value={formData.tagline}
                onChange={e => updateField('tagline', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Short pitch shown under the name."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Description *</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => updateField('description', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="A focused energy blend with adaptogens..."
              />
            </div>
          </section>

          {/* MEDIA */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Media</h2>
            <p className="text-sm text-gray-500 mb-6">Enter a direct image URL. This acts as the thumbnail and main product image.</p>
            
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Primary Image URL *</label>
            <div className="flex gap-4">
              <input 
                required
                type="url"
                value={formData.image}
                onChange={e => updateField('image', e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {formData.image && (
              <div className="mt-4 w-32 h-32 rounded-xl border border-gray-200 border-dashed flex items-center justify-center p-2">
                <img src={formData.image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              </div>
            )}
          </section>

          {/* PRICING & INVENTORY */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Pricing & inventory</h2>
            <p className="text-sm text-gray-500 mb-6">Simple product — base price and stock are used directly.</p>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Base Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={e => updateField('price', parseFloat(e.target.value))}
                    className="w-full pl-8 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Discount (%)</label>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={e => updateField('discount', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Base Stock</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={e => updateField('stock', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">SKU</label>
                <input 
                  type="text"
                  value={formData.sku}
                  onChange={e => updateField('sku', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="AIR-EN-001"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Base Weight (grams)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.weight}
                  onChange={e => updateField('weight', parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 250"
                />
              </div>
            </div>
          </section>

          {/* VARIANTS */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-base font-semibold text-gray-900">Variants (Sizes / Pills)</h2>
              <button type="button" onClick={addVariant} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-800 transition-colors">
                + Add variant
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Add size, weight, or format options (e.g. S, M, L or 100g, 250g).</p>
            
            <div className="space-y-3">
              {(formData.variants || []).length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <p className="text-xs text-gray-500 mb-2">No variants yet.</p>
                  <button type="button" onClick={addVariant} className="text-xs text-blue-600 font-medium">Add first variant</button>
                </div>
              ) : (
                (formData.variants || []).map((v, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text"
                      value={v}
                      onChange={e => updateVariant(idx, e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 500g"
                    />
                    <button type="button" onClick={() => removeVariant(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* DETAILS */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Details</h2>
            <p className="text-sm text-gray-500 mb-6">One item per line. Surfaced in the product page sidebar.</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Ingredients</label>
                <textarea 
                  rows={5}
                  value={formData.ingredients}
                  onChange={e => updateField('ingredients', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none leading-relaxed"
                  placeholder="Green coffee extract&#10;L-theanine&#10;B-complex"
                />
                <p className="text-[10px] text-gray-400 mt-2">One per line.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Benefits</label>
                <textarea 
                  rows={5}
                  value={formData.benefits}
                  onChange={e => updateField('benefits', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none leading-relaxed"
                  placeholder="Focused energy&#10;Zero sugar&#10;No crash"
                />
                <p className="text-[10px] text-gray-400 mt-2">One per line.</p>
              </div>
            </div>
          </section>

          {/* A+ CONTENT */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-base font-semibold text-gray-900">A+ Content (Rich Media)</h2>
              <button type="button" onClick={addAPlusBlock} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-800 transition-colors">
                + Add A+ Block
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">Create rich marketing sections similar to Amazon A+ content below the main product details.</p>

            <div className="space-y-6">
              {(formData.aPlusContent || []).length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 border border-gray-200">
                    <LayoutGrid className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">No A+ content yet</h3>
                  <p className="text-xs text-gray-500 mb-4">Add rich images and text blocks to help sell your product.</p>
                  <button type="button" onClick={addAPlusBlock} className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    + Add first block
                  </button>
                </div>
              ) : (
                (formData.aPlusContent || []).map((block, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 bg-gray-50 relative">
                    <button 
                      type="button" 
                      onClick={() => removeAPlusBlock(index)}
                      className="absolute top-4 right-4 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Block {index + 1}</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Image URL *</label>
                        <input 
                          required
                          type="url"
                          value={block.imageUrl}
                          onChange={e => updateAPlusBlock(index, 'imageUrl', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                          <input 
                            type="text"
                            value={block.title || ""}
                            onChange={e => updateAPlusBlock(index, 'title', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Sourced from Japan"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                          <textarea 
                            rows={3}
                            value={block.description || ""}
                            onChange={e => updateAPlusBlock(index, 'description', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            placeholder="Add a detailed description here..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* STATUS */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
            <h2 className="text-sm font-semibold text-gray-900">Status</h2>
            
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center h-5">
                <input type="checkbox" checked={formData.isActive} onChange={e => updateField('isActive', e.target.checked)} className="peer sr-only" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Active</span>
                <span className="text-xs text-gray-500">Visible to customers in the storefront.</span>
              </div>
            </label>

            <div className="border-t border-gray-100"></div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center h-5">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => updateField('isFeatured', e.target.checked)} className="peer sr-only" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Featured</span>
                <span className="text-xs text-gray-500">Pinned to the homepage hero strip.</span>
              </div>
            </label>

            <div className="border-t border-gray-100"></div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div className="relative flex items-center h-5">
                <input type="checkbox" checked={formData.isComingSoon} onChange={e => updateField('isComingSoon', e.target.checked)} className="peer sr-only" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gray-900"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Coming soon</span>
                <span className="text-xs text-gray-500">Hides price and disables Add-to-cart everywhere.</span>
              </div>
            </label>
          </section>

          {/* DISPLAY ORDER */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Display order</h2>
            <p className="text-xs text-gray-500 mb-4">Lower numbers appear first in the shop. Leave blank to default to 0.</p>
            
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Sort Position</label>
            <input 
              type="number"
              value={formData.sortPosition}
              onChange={e => updateField('sortPosition', parseInt(e.target.value) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            <p className="text-[10px] text-gray-400 mt-2">e.g. 1 = first, 2 = second, ...</p>
          </section>

          {/* BRANDING */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Branding</h2>
            <p className="text-xs text-gray-500 mb-4">Visual accents shown on the product page.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Badge</label>
                <input 
                  type="text"
                  value={formData.badge}
                  onChange={e => updateField('badge', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
                  placeholder="BEST SELLER"
                />
                <p className="text-[10px] text-gray-400 mt-1">Optional ribbon (e.g. NEW, BEST SELLER).</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Theme Color</label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0" 
                    style={{ backgroundColor: formData.themeColor || '#1E2B68' }}
                  />
                  <input 
                    type="text"
                    value={formData.themeColor}
                    onChange={e => updateField('themeColor', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono"
                    placeholder="#1E2B68"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Hex code for hero gradient.</p>
              </div>
            </div>
          </section>

        </div>
      </form>
    </div>
  );
}
