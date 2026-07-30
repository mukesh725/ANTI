"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ImagePlus, RefreshCw, Save } from "lucide-react";
import Image from "next/image";

export function CardTemplateManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});
  
  const [templates, setTemplates] = useState({
    Select: "",
    Preferred: "",
    Signature: ""
  });

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "global_settings", "card_templates");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTemplates({
          Select: data.Select || "",
          Preferred: data.Preferred || "",
          Signature: data.Signature || "",
        });
      }
    } catch (e) {
      console.error("Failed to fetch templates:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tier: keyof typeof templates) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingState(prev => ({ ...prev, [tier]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setTemplates(prev => ({ ...prev, [tier]: data.url }));
        alert(`Successfully uploaded image for ${tier}! Don't forget to Save.`);
      } else {
        alert("Failed to upload image: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploadingState(prev => ({ ...prev, [tier]: false }));
    }
  };

  const handleSaveAndRegenerate = async () => {
    setSaving(true);
    try {
      // 1. Save to Firestore
      const docRef = doc(db, "global_settings", "card_templates");
      await setDoc(docRef, templates, { merge: true });

      // 2. Trigger regeneration API
      const res = await fetch("/api/membership/regenerate-cards", {
        method: "GET",
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert(`Successfully saved templates and regenerated ${data.updatedCount} cards!`);
      } else {
        alert("Saved templates, but regeneration had issues: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error("Failed to save and regenerate:", e);
      alert("Error saving templates.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Digital Card Templates</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload custom background designs for each membership tier. Changes apply instantly to all members.
          </p>
        </div>
        <button
          onClick={handleSaveAndRegenerate}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#006537] text-white rounded-xl text-sm font-semibold hover:bg-[#004e2a] transition-colors disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save & Regenerate All Cards
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(templates) as Array<keyof typeof templates>).map(tier => (
          <div key={tier} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            <h3 className="font-bold text-gray-800 mb-3">{tier} Plan</h3>
            
            <div className="aspect-[860/880] w-full bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 mb-4 overflow-hidden relative flex flex-col items-center justify-center">
              {templates[tier as keyof typeof templates] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={templates[tier as keyof typeof templates]} 
                  alt={`${tier} Template`} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium uppercase tracking-wider">No Template</span>
                </div>
              )}
            </div>

            <label className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              {uploadingState[tier] ? (
                <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
              ) : (
                <><ImagePlus className="w-3.5 h-3.5" /> Upload Image</>
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, tier as keyof typeof templates)}
                disabled={uploadingState[tier]}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
