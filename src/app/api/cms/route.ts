import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifyAdminAuth } from "@/lib/membershipAuth";

const cmsFilePath = path.join(process.cwd(), "src", "data", "cms.json");

export async function GET() {
  try {
    const data = await fs.readFile(cmsFilePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to load CMS data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized administrative access" }, { status: 401 });
    }

    const data = await request.json();
    await fs.writeFile(cmsFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save CMS data" }, { status: 500 });
  }
}
