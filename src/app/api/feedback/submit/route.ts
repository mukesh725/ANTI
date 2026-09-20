import { NextResponse } from "next/server";
import { submitStoreFeedback, RatingLevel, SentimentType } from "@/lib/feedback";
import { sanitizeObject, escapeHtml, sanitizePhone } from "@/lib/security";

const feedbackRateLimits = new Map<string, { count: number; resetTime: number }>();

function checkFeedbackRateLimit(ip: string, limit = 10, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = feedbackRateLimits.get(ip);
  if (!record || now > record.resetTime) {
    feedbackRateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    if (!checkFeedbackRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many feedback submissions. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);
    const { name, phone, email, rating, sentiment, feedbackType, storeLocation, comment, aspects, photos, recommendScore, source } = body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const cleanName = (typeof name === "string" && name.trim()) ? escapeHtml(name.trim().slice(0, 100)) : "Guest Customer";
    const cleanPhone = (typeof phone === "string" && phone.trim()) ? sanitizePhone(phone.trim()) : "";
    const cleanComment = (typeof comment === "string" && comment.trim()) ? escapeHtml(comment.trim().slice(0, 1000)) : "";

    const feedbackId = await submitStoreFeedback({
      name: cleanName,
      phone: cleanPhone,
      email: typeof email === "string" ? email.trim().toLowerCase().slice(0, 100) : "",
      rating: numRating as RatingLevel,
      sentiment: (sentiment as SentimentType) || (numRating >= 4 ? "excellent" : numRating === 3 ? "good" : numRating === 2 ? "average" : "poor"),
      feedbackType: escapeHtml(String(feedbackType || "Suggestion").slice(0, 50)),
      storeLocation: escapeHtml(String(storeLocation || "AIRO Flagship Experience Center").slice(0, 100)),
      comment: cleanComment,
      aspects: typeof aspects === "object" && aspects !== null ? aspects : {},
      photos: Array.isArray(photos) ? photos.slice(0, 5) : [],
      recommendScore: typeof recommendScore === "number" ? Math.min(10, Math.max(0, recommendScore)) : undefined,
      source: escapeHtml(String(source || "in_store_kiosk").slice(0, 50)),
    });

    return NextResponse.json({
      success: true,
      id: feedbackId,
      message: "Feedback recorded successfully in Firebase",
    });
  } catch (error: any) {
    console.error("API Feedback Submit Error:", error);
    return NextResponse.json(
      { error: "Failed to process feedback submission" },
      { status: 500 }
    );
  }
}
