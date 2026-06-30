"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertTriangle, FileText, ImageIcon, Settings2 } from "lucide-react";
import { useCms } from "@/context/CmsContext";
import { CmsDataType } from "@/context/CmsContext";

export function CmsEditor() {
  const initialData = useCms();
  const [formData, setFormData] = useState<CmsDataType>(initialData);
  const [activeCategory, setActiveCategory] = useState<keyof CmsDataType["pages"]>("home");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadingState, setUploadingState] = useState<Record<string, boolean>>({});

  // Keep state in sync if initialData changes globally
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch("/api/cms/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData as Record<string, unknown>),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (path: string[], value: string) => {
    setFormData(prev => {
      const next = { ...prev };
      let current: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleImageUpload = async (path: string[], file: File) => {
    const pathKey = path.join(".");
    setUploadingState(prev => ({ ...prev, [pathKey]: true }));
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/cms/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        updateField(path, data.url);
      } else {
        alert("Failed to upload image: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingState(prev => ({ ...prev, [pathKey]: false }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderFields = (obj: any, currentPath: string[] = []): any => {
    return Object.entries(obj).map(([key, value]) => {
      const fullPath = [...currentPath, key];
      const isImage = key.toLowerCase().includes("image") || key.toLowerCase().includes("src");

      if (typeof value === "string") {
        return (
          <div key={fullPath.join(".")} className="mb-6">
            <label className="flex items-center gap-2 text-[10px] text-emerald-600 uppercase tracking-widest font-bold mb-2">
              {isImage ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
              {key}
            </label>
            {value.length > 80 && !isImage ? (
              <textarea
                value={value}
                onChange={(e) => updateField(fullPath, e.target.value)}
                className="w-full bg-[#F4F7F6] border border-emerald-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E6AFA3]/50 focus:ring-1 focus:ring-emerald-200 transition-all resize-y min-h-[100px]"
              />
            ) : isImage ? (
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateField(fullPath, e.target.value)}
                  className="flex-1 bg-[#F4F7F6] border border-emerald-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E6AFA3]/50 focus:ring-1 focus:ring-emerald-200 transition-all"
                />
                <label className="relative cursor-pointer bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0">
                  {uploadingState[fullPath.join(".")] ? "Uploading..." : "Upload"}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={uploadingState[fullPath.join(".")]}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(fullPath, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => updateField(fullPath, e.target.value)}
                className="w-full bg-[#F4F7F6] border border-emerald-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#E6AFA3]/50 focus:ring-1 focus:ring-emerald-200 transition-all"
              />
            )}
          </div>
        );
      } else if (typeof value === "object" && value !== null) {
        return (
          <div key={fullPath.join(".")} className="mb-8 p-6 bg-white/5 border border-white/5 rounded-2xl">
            <h4 className="text-sm font-sans font-medium text-gray-900 mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Settings2 className="w-4 h-4 text-emerald-600" />
              {key.toUpperCase()}
            </h4>
            <div className="pl-2">
              {renderFields(value, fullPath)}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  const categories = Object.keys(formData.pages) as Array<keyof CmsDataType["pages"]>;

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-md overflow-hidden">
      {/* CMS Header */}
      <div className="p-6 border-b border-emerald-100 bg-gradient-to-b from-white/5 to-transparent flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
        <div>
          <h2 className="font-sans font-medium text-2xl tracking-wide flex items-center gap-3">
            <Settings2 className="w-6 h-6 text-emerald-600" />
            Live Content Editor
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Global CMS Override Protocol</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-lg ${
            saveStatus === "success" 
              ? "bg-emerald-500 text-gray-800" 
              : "bg-[#E6AFA3] hover:bg-[#B8962E] text-gray-800"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-gray-200/30 border-t-[#597467] rounded-full animate-spin" />
          ) : saveStatus === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Deploying..." : saveStatus === "success" ? "Live!" : "Deploy Changes"}</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 border-r border-emerald-100 p-4 overflow-y-auto bg-[#F4F7F6]/50 custom-scrollbar">
          <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-3 px-3">AIRO Essentials</div>
          <ul className="space-y-1 mb-8">
            {categories.filter(c => ["home", "grocery", "pharmacy"].includes(c as string)).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs tracking-wider uppercase transition-all ${
                    activeCategory === cat
                      ? "bg-[#E6AFA3]/10 text-emerald-600 border border-[#E6AFA3]/20 font-bold"
                      : "text-gray-500 hover:bg-white/5 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  {cat === "home" ? "Essentials Home" : cat}
                </button>
              </li>
            ))}
          </ul>

          <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-3 px-3">AIRO Health Hub</div>
          <ul className="space-y-1">
            {categories.filter(c => !["home", "grocery", "pharmacy"].includes(c as string)).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs tracking-wider uppercase transition-all ${
                    activeCategory === cat
                      ? "bg-[#E6AFA3]/10 text-emerald-600 border border-[#E6AFA3]/20 font-bold"
                      : "text-gray-500 hover:bg-white/5 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  {cat === "health" ? "Health Home" : cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-br from-transparent to-[#07120F]/50">
          {saveStatus === "error" && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
              <AlertTriangle className="w-5 h-5" />
              Failed to deploy changes. Please check permissions and connection.
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 pb-4 border-b border-emerald-100">
              <h3 className="font-sans font-medium text-3xl text-gray-900 capitalize">{activeCategory} Page</h3>
              <p className="text-gray-500 text-sm mt-2">Edit the text and media content for the {activeCategory} section. Changes will reflect instantly across all global edges upon deployment.</p>
            </div>
            {renderFields(formData.pages[activeCategory], ["pages", activeCategory as string])}
          </div>
        </div>
      </div>
    </div>
  );
}
