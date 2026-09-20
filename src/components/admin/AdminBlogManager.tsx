"use client";

import { useState, useEffect } from "react";
import { BlogPost, getAllAdminBlogs, saveBlogPost, deleteBlogPost } from "@/lib/blog";
import { Plus, Edit2, Trash2, Save, X, Eye, FileText, Sparkles, RefreshCw, CheckCircle2, Globe, ExternalLink, Search, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

const QUICK_TOPIC_PRESETS = [
  { keyword: "Online Doctor Video Consultation & Digital Prescriptions", site: "health" },
  { keyword: "AIRO Praana 3D Health Chair Longevity Diagnostics", site: "health" },
  { keyword: "Managing Flu, Cough & Viral Infections at Home", site: "health" },
  { keyword: "Cold-Pressed Wood Churned Cooking Oils Benefits", site: "essentials" },
  { keyword: "Pesticide-Free Certified Organic Vegetables", site: "essentials" },
  { keyword: "A2 Desi Cow Milk and Ghee for Gut Microbiome", site: "essentials" },
  { keyword: "Preventive Longevity Medicine & Whole Food Nutrition", site: "both" },
];

export function AdminBlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState<"all" | "health" | "essentials" | "both">("all");

  // Auto-generator modal state
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [autoKeyword, setAutoKeyword] = useState("");
  const [autoTargetSite, setAutoTargetSite] = useState<"health" | "essentials" | "both">("both");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccessMessage, setGenerateSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    const data = await getAllAdminBlogs();
    setBlogs(data);
    setLoading(false);
  };

  const handleCreateNew = () => {
    setEditingBlog({
      id: "",
      targetSite: "both",
      title: "",
      slug: "",
      coverImage: "",
      content: "",
      author: "AIRO Editorial",
      publishedAt: new Date().toISOString(),
      seoTitle: "",
      seoDescription: "",
      status: "published",
    });
  };

  const handleSave = async () => {
    if (!editingBlog || !editingBlog.title || !editingBlog.slug) {
      alert("Title and Slug are required.");
      return;
    }
    setIsSaving(true);
    try {
      await saveBlogPost(editingBlog);
      await loadBlogs();
      setEditingBlog(null);
    } catch (e) {
      alert("Failed to save blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteBlogPost(slug);
      await loadBlogs();
    }
  };

  const handleAutoGenerate = async () => {
    if (!autoKeyword.trim()) {
      alert("Please enter a target keyword or topic.");
      return;
    }

    setIsGenerating(true);
    setGenerateSuccessMessage(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('airo_admin_token') || '' : '';
      const res = await fetch("/api/cron/generate-blog", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          keyword: autoKeyword.trim(),
          targetSite: autoTargetSite,
          autoPublish: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGenerateSuccessMessage(`Published "${data.blog.title}"!`);
        await loadBlogs();
        setTimeout(() => {
          setIsAutoModalOpen(false);
          setGenerateSuccessMessage(null);
          setAutoKeyword("");
        }, 1500);
      } else {
        alert(data.error || "Failed to generate blog.");
      }
    } catch (err: any) {
      console.error("Auto generate error:", err);
      alert("Error while generating blog: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (editingBlog) {
    return (
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-serif text-ink">
            {editingBlog.id ? "Edit Blog Post" : "New Blog Post"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setEditingBlog(null)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-bold text-white bg-theme rounded-lg hover:bg-theme/90 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-lg font-serif text-ink"
                  placeholder="The Future of Longevity..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Content (Markdown / HTML)</label>
                <textarea
                  value={editingBlog.content}
                  onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-lg h-96 font-mono text-sm focus:outline-none focus:border-theme text-ink"
                  placeholder="Write your article here..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink border-b pb-2 mb-4">Post Settings</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={editingBlog.slug}
                  onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-mono text-ink"
                  placeholder="slug-url-here"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Site</label>
                <select
                  value={editingBlog.targetSite}
                  onChange={(e) => setEditingBlog({ ...editingBlog, targetSite: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white text-ink"
                >
                  <option value="both">Both Sites (Universal)</option>
                  <option value="health">AIRO Health Hub</option>
                  <option value="essentials">AIRO Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={editingBlog.status}
                  onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm bg-white text-ink font-bold"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author</label>
                <input
                  type="text"
                  value={editingBlog.author}
                  onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={editingBlog.coverImage}
                  onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-ink"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Meta Description</label>
                <textarea
                  value={editingBlog.seoDescription}
                  onChange={(e) => setEditingBlog({ ...editingBlog, seoDescription: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm text-ink h-24"
                  placeholder="150 character summary for Google..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = !searchQuery || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.seoDescription && blog.seoDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSite = siteFilter === "all" || blog.targetSite === siteFilter || blog.targetSite === "both";
    return matchesSearch && matchesSite;
  });

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif text-slate-900 font-medium">SEO & Content Marketing Engine</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {blogs.length} Articles Published
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">High-ranking, conversion-optimized articles across AIRO Essentials & AIRO Health Hub with verified Google Schema.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Auto-Generate SEO Blog</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Post</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {[
            { id: "all", label: `All Articles (${blogs.length})` },
            { id: "health", label: "Health Hub" },
            { id: "essentials", label: "Essentials Store" },
            { id: "both", label: "Universal" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSiteFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                siteFilter === tab.id
                  ? "bg-slate-900 text-white font-semibold"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, keyword, slug..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Article Title & Slug</th>
              <th className="py-4 px-6">Target Domain</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center text-xs text-slate-400">Loading articles...</td></tr>
            ) : filteredBlogs.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-xs text-slate-400">No blog posts found matching your filter.</td></tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                        <FileText className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{blog.title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5 font-mono">
                          <span>/{blog.slug}</span>
                          <span>&bull;</span>
                          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      blog.targetSite === 'health' 
                        ? 'bg-blue-100 text-blue-700' 
                        : blog.targetSite === 'essentials' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {blog.targetSite === 'both' ? 'Both Sites' : blog.targetSite}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      blog.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Live Article"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => setEditingBlog(blog)}
                        className="p-2 text-gray-400 hover:text-theme hover:bg-theme/5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Article"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.slug)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Article"
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

      {/* AUTO-GENERATE SEO BLOG MODAL */}
      {isAutoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Auto-Generate High-Converting SEO Blog</h3>
                  <p className="text-xs text-gray-500">Creates a 1,000+ word article optimized for Google keywords and conversions.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAutoModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generateSuccessMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{generateSuccessMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Search Keyword or Topic
                </label>
                <input
                  type="text"
                  value={autoKeyword}
                  onChange={(e) => setAutoKeyword(e.target.value)}
                  placeholder="e.g. Online Doctor Consultation for Cold & Flu, Wood Pressed Mustard Oil..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Quick Topic Chips */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TOPIC_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAutoKeyword(p.keyword);
                        setAutoTargetSite(p.site as any);
                      }}
                      className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 px-3 py-1.5 rounded-lg text-gray-700 transition-colors cursor-pointer text-left"
                    >
                      {p.keyword}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Target Domain
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "both", label: "Both Domains" },
                    { id: "health", label: "AIRO Health Hub" },
                    { id: "essentials", label: "AIRO Essentials" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setAutoTargetSite(d.id as any)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        autoTargetSite === d.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAutoModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={isGenerating || !autoKeyword.trim()}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Article & SEO Schema...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate & Publish to Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
