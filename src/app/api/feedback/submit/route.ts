import { NextResponse } from "next/server";
import { submitStoreFeedback, RatingLevel, SentimentType } from "@/lib/feedback";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, rating, sentiment, storeLocation, comment, aspects, recommendScore, source } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Customer name is required" }, { status: 400 });
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      return NextResponse.json({ error: "A valid contact number is required" }, { status: 400 });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const feedbackId = await submitStoreFeedback({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      rating: numRating as RatingLevel,
      sentiment: (sentiment as SentimentType) || (numRating >= 4 ? "excellent" : numRating === 3 ? "good" : numRating === 2 ? "average" : "poor"),
      storeLocation: storeLocation?.trim() || "AIRO Flagship Experience Center",
      comment: comment?.trim() || "",
      aspects: aspects || {},
      recommendScore: typeof recommendScore === "number" ? recommendScore : undefined,
      source: source || "in_store_kiosk",
    });

    return NextResponse.json({
      success: true,
      id: feedbackId,
      message: "Feedback recorded successfully in Firebase",
    });
  } catch (error: any) {
    console.error("API Feedback Submit Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
