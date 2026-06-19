import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
    const data = await request.json();
    await fs.writeFile(cmsFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save CMS data" }, { status: 500 });
  }
}
