import { db } from "./firebase";
import { collection, doc, getDoc, getDocs, query, where, setDoc, deleteDoc } from "firebase/firestore";
import { unstable_cache } from "next/cache";

export interface BlogPost {
  id: string; // The slug
  targetSite: "essentials" | "health" | "both";
  title: string;
  slug: string;
  coverImage: string;
  content: string; // Markdown or rich text
  author: string;
  publishedAt: string; // ISO date string
  seoTitle: string;
  seoDescription: string;
  status: "published" | "draft";
}

// Fetch all published blogs for a specific site
export const getBlogsForSite = unstable_cache(
  async (site: "essentials" | "health") => {
    try {
      const blogsRef = collection(db, "blogs");
      const q = query(
        blogsRef,
        where("status", "==", "published"),
        where("targetSite", "in", [site, "both"])
        // orderBy("publishedAt", "desc") // Requires a composite index in Firestore, skip for now to avoid manual index creation errors
      );
      
      const snapshot = await getDocs(q);
      const blogs = snapshot.docs.map(doc => doc.data() as BlogPost);
      
      // Sort manually since we skipped orderBy to avoid composite index requirement
      return blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } catch (error) {
      console.error(`Failed to fetch blogs for site: ${site}`, error);
      return [];
    }
  },
  ['blogs-list'],
  {
    revalidate: 3600,
    tags: ['blogs']
  }
);

// Fetch a single blog post by slug
export const getBlogBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      const docRef = doc(db, "blogs", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as BlogPost;
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch blog with slug: ${slug}`, error);
      return null;
    }
  },
  ['blog-single'],
  {
    revalidate: 3600,
    tags: ['blogs']
  }
);

// Admin: Fetch ALL blogs (including drafts)
export const getAllAdminBlogs = async (): Promise<BlogPost[]> => {
  try {
    const blogsRef = collection(db, "blogs");
    const snapshot = await getDocs(blogsRef);
    const blogs = snapshot.docs.map(doc => doc.data() as BlogPost);
    return blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error("Failed to fetch admin blogs", error);
    return [];
  }
};

// Admin: Save a blog post
export const saveBlogPost = async (blog: BlogPost) => {
  try {
    const docRef = doc(db, "blogs", blog.slug);
    await setDoc(docRef, { ...blog, id: blog.slug }); // Ensure id matches slug
    return true;
  } catch (error) {
    console.error("Failed to save blog post", error);
    throw error;
  }
};

// Admin: Delete a blog post
export const deleteBlogPost = async (slug: string) => {
  try {
    const docRef = doc(db, "blogs", slug);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete blog post: ${slug}`, error);
    throw error;
  }
};
