import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to Base64 for GitHub API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Content = buffer.toString("base64");

    // Clean up filename (remove spaces and special chars)
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `${Date.now()}-${cleanFilename}`;
    const filePath = `public/uploads/${uniqueFilename}`;

    const githubToken = process.env.GITHUB_TOKEN;
    const githubOwner = process.env.GITHUB_OWNER || "mukesh725"; // Fallback to current repo owner
    const githubRepo = process.env.GITHUB_REPO || "ANTI"; // Fallback to current repo name

    if (!githubToken) {
      return NextResponse.json(
        { error: "GITHUB_TOKEN is not set in environment variables" },
        { status: 500 }
      );
    }

    // Call GitHub API to upload the file
    const githubResponse = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          "User-Agent": "AIRO-CMS-Uploader",
        },
        body: JSON.stringify({
          message: `chore: upload image ${uniqueFilename} via CMS`,
          content: base64Content,
          branch: "main",
        }),
      }
    );

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json();
      console.error("GitHub API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to upload to GitHub", details: errorData },
        { status: githubResponse.status }
      );
    }

    // Success! Return the public path that Next.js will serve
    const publicUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ url: publicUrl, success: true });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
