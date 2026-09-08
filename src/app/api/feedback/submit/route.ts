import { NextResponse } from "next/server";
import { submitStoreFeedback, RatingLevel, SentimentType } from "@/lib/feedback";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, rating, sentiment, feedbackType, storeLocation, comment, aspects, recommendScore, source } = body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const cleanName = (typeof name === "string" && name.trim()) ? name.trim() : "Guest Customer";
    const cleanPhone = (typeof phone === "string" && phone.trim()) ? phone.trim() : "";

    const feedbackId = await submitStoreFeedback({
      name: cleanName,
      phone: cleanPhone,
      email: email?.trim() || "",
      rating: numRating as RatingLevel,
      sentiment: (sentiment as SentimentType) || (numRating >= 4 ? "excellent" : numRating === 3 ? "good" : numRating === 2 ? "average" : "poor"),
      feedbackType: feedbackType || "Suggestion",
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
