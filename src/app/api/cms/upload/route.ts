import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Clean up filename (remove spaces and special chars)
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanFilename}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, `cms-uploads/${uniqueFilename}`);
    
    const metadata = {
      contentType: file.type || 'application/octet-stream',
    };

    await uploadBytes(storageRef, uint8Array, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    // Success! Return the public URL
    return NextResponse.json({ url: downloadURL, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
