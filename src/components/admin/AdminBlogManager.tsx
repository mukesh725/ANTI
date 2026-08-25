"use client";

import { useState, useEffect } from "react";
import { BlogPost, getAllAdminBlogs, saveBlogPost, deleteBlogPost } from "@/lib/blog";
import { Plus, Edit2, Trash2, Save, X, Eye, FileText } from "lucide-react";

export function AdminBlogManager() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
      status: "draft",
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
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-bold text-white bg-theme rounded-lg hover:bg-theme/90 flex items-center gap-2"
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
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                  placeholder="future-of-longevity"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Site</label>
                <select
                  value={editingBlog.targetSite}
                  onChange={(e) => setEditingBlog({ ...editingBlog, targetSite: e.target.value as any })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                >
                  <option value="both">Both Sites</option>
                  <option value="essentials">AIRO Essentials Only</option>
                  <option value="health">AIRO Health Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={editingBlog.status}
                  onChange={(e) => setEditingBlog({ ...editingBlog, status: e.target.value as any })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Author</label>
                <input
                  type="text"
                  value={editingBlog.author}
                  onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Cover Image URL</label>
                <input
                  type="text"
                  value={editingBlog.coverImage}
                  onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                  placeholder="/uploads/my-image.jpg"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-ink border-b pb-2 mb-4">SEO Settings</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Title</label>
                <input
                  type="text"
                  value={editingBlog.seoTitle}
                  onChange={(e) => setEditingBlog({ ...editingBlog, seoTitle: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SEO Description</label>
                <textarea
                  value={editingBlog.seoDescription}
                  onChange={(e) => setEditingBlog({ ...editingBlog, seoDescription: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-theme text-sm h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Blog Manager</h1>
          <p className="text-sm text-gray-500">Manage blog posts across all AIRO domains.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-theme hover:bg-theme/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Post</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Target Site</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">Loading blogs...</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-gray-400">No blog posts found.</td></tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{blog.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">/{blog.slug} &bull; {new Date(blog.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                      {blog.targetSite}
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
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingBlog(blog)}
                        className="p-2 text-gray-400 hover:text-theme hover:bg-theme/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog.slug)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
