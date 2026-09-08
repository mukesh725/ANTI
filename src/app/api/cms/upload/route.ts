import { NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".svg",
  ".gif",
  ".pdf",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // VAPT Item 22: File size verification
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the maximum allowed size of 10MB" },
        { status: 400 }
      );
    }

    // VAPT Item 22: MIME Type Verification
    const mimeType = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only JPEG, PNG, WebP, SVG, GIF, and PDF are allowed." },
        { status: 400 }
      );
    }

    // VAPT Item 12: Path Traversal & Extension Verification
    const originalName = file.name || "upload.png";
    const extIndex = originalName.lastIndexOf(".");
    const ext = extIndex !== -1 ? originalName.substring(extIndex).toLowerCase() : "";

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Invalid file extension" },
        { status: 400 }
      );
    }

    // Clean up filename (remove directory traversal chars like .. and /)
    const baseName = originalName.substring(0, extIndex).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}-${baseName}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Firebase Storage
    const storageRef = ref(storage, `cms-uploads/${uniqueFilename}`);
    const metadata = { contentType: mimeType };

    await uploadBytes(storageRef, uint8Array, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({ url: downloadURL, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
