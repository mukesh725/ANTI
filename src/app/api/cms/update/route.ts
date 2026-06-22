import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. Save directly to Firestore
    const docRef = doc(db, "cms", "content");
    await setDoc(docRef, data);

    // 2. Revalidate Next.js cache so the live site gets the new data instantly
    revalidateTag("cms");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update CMS data:", error);
    return NextResponse.json({ success: false, error: "Failed to update CMS" }, { status: 500 });
  }
}
