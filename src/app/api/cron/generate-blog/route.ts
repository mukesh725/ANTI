import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { revalidateTag } from 'next/cache';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80);
}

// Built-in SEO Blog Synthesis Engine (used when OpenAI key is absent or for instant reliable generation)
function synthesizeSeoBlog(keyword: string, targetSite: "health" | "essentials" | "both") {
  const cleanKeyword = keyword.trim();
  const isHealth = targetSite === "health" || (targetSite === "both" && !cleanKeyword.toLowerCase().includes("oil") && !cleanKeyword.toLowerCase().includes("food") && !cleanKeyword.toLowerCase().includes("grocery"));

  if (isHealth) {
    const title = `${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)}: Clinical Guide, Symptoms, and Expert Care Protocol`;
    const seoDescription = `Comprehensive clinical guide to ${cleanKeyword}. Learn evidence-based medical treatments, preventive longevity screening, and when to consult a physician online.`;
    
    const content = `
      <h2>Understanding ${cleanKeyword}: Clinical Overview and Impact</h2>
      <p>In modern proactive healthcare, addressing <strong>${cleanKeyword}</strong> early is essential for maintaining optimal vitality and preventing long-term metabolic or physiological complications. Whether you are managing acute symptoms or seeking long-term preventive health optimization, understanding the underlying physiological mechanisms allows for more targeted medical interventions.</p>
      
      <p>At <strong>AIRO Health Hub</strong>, our physician network combines clinical diagnostics with convenient telemedicine access, enabling patients to receive specialized care without the friction of conventional waiting rooms.</p>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:20px;border-radius:14px;margin:28px 0;">
        <h3 style="margin-top:0;color:#1e40af;font-size:18px;">Need Expert Medical Guidance for ${cleanKeyword}?</h3>
        <p style="margin-bottom:14px;color:#1e3a8a;font-size:14px;">Connect with experienced board-certified doctors in minutes. Receive a customized clinical treatment plan and instant digital prescription.</p>
        <a href="/minute-clinic/booking?mode=virtual" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:10px;font-size:14px;">Book Virtual Consultation (₹499) &rarr;</a>
      </div>

      <h2>Key Clinical Symptoms and When to Consult a Doctor</h2>
      <p>Recognizing the early indicators associated with <strong>${cleanKeyword}</strong> empowers you to take decisive action before minor health concerns escalate into chronic conditions:</p>
      <ul>
        <li><strong>Persistent Fatigue or Energy Drops</strong>: Often an early sign of cellular metabolic strain or micro-nutrient deficiency.</li>
        <li><strong>Subclinical Inflammation</strong>: Elevated resting heart rate or reduced heart rate variability (HRV) detected during routine screening.</li>
        <li><strong>Acute Discomfort or Recurring Flare-ups</strong>: Requiring professional clinical triage rather than unguided self-medication.</li>
      </ul>

      <h2>The Role of AIRO Praana 3D Health Screening</h2>
      <p>Traditional medicine often waits for symptoms to become acute before ordering expensive diagnostic imaging. In contrast, the <strong>AIRO Praana 3D Health Chair</strong> measures over 50 non-invasive biomarkers in 15 minutes—including arterial stiffness (pulse wave velocity), autonomic nervous system balance, and tissue oxygenation.</p>

      <h2>Evidence-Based Prevention & Recovery Strategies</h2>
      <ol>
        <li><strong>Early Physician Consultation</strong>: Reviewing your symptoms with a licensed doctor ensures appropriate pharmaceutical and lifestyle protocols.</li>
        <li><strong>Anti-Inflammatory Nutritional Support</strong>: Switching to clean, organic, nutrient-dense whole foods eliminates synthetic pesticide residues that disrupt cellular recovery.</li>
        <li><strong>Physiological Monitoring</strong>: Tracking your vitals through regular Minute Clinic checkups prevents preventable health setbacks.</li>
      </ol>
    `;

    return {
      title,
      seoDescription,
      content,
      targetSite: "health" as const,
      author: "Dr. MUKESH Doctor, Clinical Specialist",
      coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    };
  } else {
    // Essentials / Organic Nutrition
    const title = `${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)}: Why Certified Organic Quality Protects Your Cellular Health`;
    const seoDescription = `Discover the science of ${cleanKeyword}. Learn how zero-pesticide, organic whole foods and cold-pressed nutrition reduce inflammation and optimize daily energy.`;
    
    const content = `
      <h2>The Science of Clean Nutrition: The Truth About ${cleanKeyword}</h2>
      <p>Every cell in your body is built from the food you eat every day. Choosing <strong>${cleanKeyword}</strong> is not merely a lifestyle choice—it is a critical investment in reducing systemic toxic load, protecting your gut microbiome, and maximizing daily cognitive energy.</p>
      
      <p>At <strong>AIRO Essentials</strong>, we source 100% certified organic, chemical-free groceries directly from regenerative farms. Every harvest is tested to ensure zero synthetic pesticide residues, zero petroleum solvent extractions, and maximum micro-nutrient density.</p>

      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:20px;border-radius:14px;margin:28px 0;">
        <h3 style="margin-top:0;color:#166534;font-size:18px;">Upgrade Your Kitchen to 100% Certified Organic Food</h3>
        <p style="margin-bottom:14px;color:#14532d;font-size:14px;">Stock your pantry with chemical-free grains, pure wood-pressed cooking oils, A2 native dairy, and certified organic groceries.</p>
        <a href="/grocery" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:10px;font-size:14px;">Shop Clean Organic Groceries &rarr;</a>
      </div>

      <h2>Why Purity Matters: Avoiding Industrial Chemical Residues</h2>
      <p>Mass-market commercial produce and refined products frequently contain trace residues of synthetic fertilizers, chemical insecticides, and artificial bleaching agents. Over time, chronic low-level ingestion of these compounds can compromise gut barrier integrity and elevate systemic inflammatory markers like hs-CRP.</p>

      <h2>Key Health Benefits of 100% Organic Sourcing</h2>
      <ul>
        <li><strong>Superior Antioxidant Concentrations</strong>: Naturally grown plants produce higher levels of protective polyphenols and bioflavonoids.</li>
        <li><strong>Microbiome Protection</strong>: Preserves beneficial gut bacteria by eliminating synthetic glyphosate and antibiotic residues.</li>
        <li><strong>True Nutritional Density</strong>: Grown in mineral-rich organic compost soils that deliver essential trace minerals to your body.</li>
      </ul>
    `;

    return {
      title,
      seoDescription,
      content,
      targetSite: "essentials" as const,
      author: "AIRO Nutrition Science Board",
      coverImage: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
    };
  }
}

async function handleBlogGeneration(params: {
  keyword?: string;
  targetSite?: "health" | "essentials" | "both";
  autoPublish?: boolean;
}) {
  const { keyword, targetSite = "both", autoPublish = true } = params;

  let generatedTitle = "";
  let generatedContent = "";
  let generatedSeoDesc = "";
  let finalTargetSite: "health" | "essentials" | "both" = targetSite;
  let author = "AIRO Editorial Board";
  let coverImage = "";

  const chosenKeyword = keyword?.trim() || "Preventive Longevity Medicine & Whole Food Nutrition";

  // 1. If OpenAI API key is configured, use GPT-4o
  if (openai) {
    try {
      const prompt = `
        You are the chief medical & nutritional copywriter for AIRO (AIRO Health Hub & AIRO Essentials).
        Target Topic / Keyword: "${chosenKeyword}".
        Target Domain Focus: "${targetSite}".

        Write an exceptional, highly engaging, deeply researched, SEO-optimized 1000-word blog post.
        The article must include:
        1. Compelling <h1> title with primary keyword near the beginning.
        2. Clean HTML content using <h2>, <h3>, <p>, <ul>, <li>, and <strong>.
        3. A high-converting call-to-action box leading to AIRO services (/minute-clinic/booking or /grocery).
        4. Clear, accessible medical/nutritional explanations.

        Return ONLY a JSON object with:
        - "title": string
        - "content": string (valid HTML body)
        - "seoDescription": string (under 155 characters)
        - "targetSite": "health" | "essentials" | "both"
        - "author": string
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      generatedTitle = parsed.title;
      generatedContent = parsed.content;
      generatedSeoDesc = parsed.seoDescription;
      finalTargetSite = parsed.targetSite || targetSite;
      author = parsed.author || "AIRO Editorial Board";
      coverImage = finalTargetSite === "health" 
        ? "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
        : "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80";
    } catch (openAiErr) {
      console.warn("[OpenAI Failed, Falling back to synthesis engine]:", openAiErr);
    }
  }

  // 2. Fallback Synthesis Engine
  if (!generatedTitle || !generatedContent) {
    const synth = synthesizeSeoBlog(chosenKeyword, finalTargetSite);
    generatedTitle = synth.title;
    generatedContent = synth.content;
    generatedSeoDesc = synth.seoDescription;
    finalTargetSite = synth.targetSite;
    author = synth.author;
    coverImage = synth.coverImage;
  }

  const slug = generateSlug(generatedTitle) || `airo-article-${Date.now()}`;

  const blogData = {
    id: slug,
    slug: slug,
    title: generatedTitle,
    content: generatedContent,
    seoTitle: `${generatedTitle} | AIRO Journal`,
    seoDescription: generatedSeoDesc,
    targetSite: finalTargetSite,
    author: author,
    coverImage: coverImage,
    status: autoPublish ? "published" : "draft",
    publishedAt: new Date().toISOString(),
  };

  const docRef = doc(db, "blogs", slug);
  await setDoc(docRef, blogData);

  try {
    revalidateTag('blogs');
  } catch (e) {}

  return blogData;
}

function checkCronOrAdminAuth(req: NextRequest): boolean {
  // 1. Check Admin JWT Token
  if (verifyAdminAuth(req)) return true;

  // 2. Check Vercel Cron Secret or Custom Secret header
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    if (authHeader === `Bearer ${cronSecret}` || authHeader === cronSecret) return true;
    const { searchParams } = new URL(req.url);
    if (searchParams.get('secret') === cronSecret || searchParams.get('cron_secret') === cronSecret) return true;
  }

  // 3. Allow in local development if CRON_SECRET is not configured
  if (process.env.NODE_ENV !== 'production' && !cronSecret) {
    return true;
  }

  return false;
}

// GET Handler (Supports Cron and Query Params)
export async function GET(req: NextRequest) {
  try {
    if (!checkCronOrAdminAuth(req)) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials or CRON_SECRET required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword') || undefined;
    const targetSite = (searchParams.get('targetSite') as any) || "both";
    const autoPublish = searchParams.get('autoPublish') !== 'false';

    const blog = await handleBlogGeneration({ keyword, targetSite, autoPublish });

    return NextResponse.json({
      success: true,
      message: `Successfully generated and published: "${blog.title}"`,
      blog,
    });
  } catch (err: any) {
    console.error("[Cron / API Generate Blog Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to generate blog" }, { status: 500 });
  }
}

// POST Handler (Supports Admin 1-Click Generator with Body)
export async function POST(req: NextRequest) {
  try {
    if (!checkCronOrAdminAuth(req)) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials or CRON_SECRET required.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { keyword, targetSite = "both", autoPublish = true } = body;

    const blog = await handleBlogGeneration({ keyword, targetSite, autoPublish });

    return NextResponse.json({
      success: true,
      message: `Successfully generated and published: "${blog.title}"`,
      blog,
    });
  } catch (err: any) {
    console.error("[POST Generate Blog Error]:", err);
    return NextResponse.json({ error: err.message || "Failed to generate blog" }, { status: 500 });
  }
}
