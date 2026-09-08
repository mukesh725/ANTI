import { NextResponse } from "next/server";
import { getPublishedStoreReviews } from "@/lib/feedback";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = Number(searchParams.get("limit")) || 10;
    const reviews = await getPublishedStoreReviews(limitParam);

    return NextResponse.json({
      success: true,
      data: reviews,
      count: reviews.length,
    });
  } catch (error: any) {
    console.error("API Public Feedback Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch published reviews" },
      { status: 500 }
    );
  }
}
