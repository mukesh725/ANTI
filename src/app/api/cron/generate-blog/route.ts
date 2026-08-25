import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { doc, setDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// Initialize OpenAI conditionally
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Fallback trending topics if News API is not set
const FALLBACK_TOPICS = [
  "The Impact of Organic Nutrition on Cellular Longevity",
  "Why Proactive Medicine is Replacing Reactive Healthcare",
  "The Hidden Toxins in Commercial Vegetables and How to Avoid Them",
  "How Functional Medicine Addresses the Root Cause of Chronic Illness",
  "The Future of Wellness: Combining Advanced Diagnostics with Clean Eating"
];

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET(req: Request) {
  try {
    // 1. Verify Authorization
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!openai) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 });
    }

    // 2. Trend Research (Simulated or via News API)
    // If you have a NewsAPI key, you can fetch real-time articles here. 
    // For this example, we'll pick a random trending topic from our curated list.
    let trendingTopic = FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    
    if (process.env.NEWS_API_KEY) {
      try {
        const newsResponse = await fetch(`https://newsapi.org/v2/everything?q="longevity" OR "organic food" OR "functional medicine"&sortBy=popularity&apiKey=${process.env.NEWS_API_KEY}`);
        const newsData = await newsResponse.json();
        if (newsData.articles && newsData.articles.length > 0) {
          trendingTopic = newsData.articles[0].title;
        }
      } catch (e) {
        console.error("News API failed, using fallback.", e);
      }
    }

    // 3. AI Generation
    const prompt = `
      You are the lead medical copywriter for AIRO. AIRO is a modern longevity and wellness brand with two branches:
      1. AIRO Essentials: Sells organic, clean, toxin-free grocery and nutrition products.
      2. AIRO Health Hub: Offers a Minute Clinic, Pharmacy, and Health Chair (AIRO Praana) for proactive medicine.
      
      A trending topic in the news today is: "${trendingTopic}".

      Write a highly engaging, SEO-optimized, 800-1000 word blog post about this topic. 
      The tone should be sophisticated, premium, scientific but accessible.
      In the article, seamlessly explain how AIRO's products or services offer a superior solution or align perfectly with this trend.
      
      Return ONLY a JSON object with the following exact keys (no markdown formatting around the json):
      - title: A catchy, SEO-friendly title
      - content: The main article content formatted in valid HTML (using h2, h3, p, strong, ul, li).
      - seoDescription: A 150-character meta description
      - targetSite: Either "essentials", "health", or "both" based on what the article focuses on more.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) throw new Error("Failed to generate content");

    const parsedData = JSON.parse(aiResponse);
    const slug = generateSlug(parsedData.title);

    // 4. Save to Firestore as a Draft
    const blogData = {
      id: slug,
      slug: slug,
      title: parsedData.title,
      content: parsedData.content,
      seoTitle: parsedData.title,
      seoDescription: parsedData.seoDescription,
      targetSite: parsedData.targetSite || "both",
      author: "AIRO Editorial AI",
      coverImage: "", // You could use DALL-E here to auto-generate
      status: "draft", // Saving as draft for semi-automated review
      publishedAt: new Date().toISOString(),
    };

    const docRef = doc(db, "blogs", slug);
    await setDoc(docRef, blogData);

    return NextResponse.json({ 
      success: true, 
      message: `Generated and saved draft: ${parsedData.title}`,
      blog: blogData 
    });

  } catch (error: any) {
    console.error("Cron Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
