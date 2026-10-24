const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

// Read Firebase config from src/lib/firebase.ts
const content = fs.readFileSync('src/lib/firebase.ts', 'utf8');
const match = content.match(/firebaseConfig\s*=\s*({[\s\S]*?});/);
if (!match) {
  console.error("Could not find firebaseConfig in src/lib/firebase.ts");
  process.exit(1);
}

const cfg = eval('(' + match[1] + ')');
const app = initializeApp(cfg);
const db = getFirestore(app);

const SEED_BLOGS = [
  // 1. HEALTH: Online Doctor Consultation
  {
    slug: "online-doctor-video-consultation-guide",
    targetSite: "health",
    title: "Online Doctor Video Consultation: A Complete Guide to Instant Telemedicine Care",
    seoTitle: "Online Doctor Video Consultation & Prescription Online | AIRO Health Hub",
    seoDescription: "Consult licensed physicians instantly via encrypted video call. Learn when to use telemedicine, how digital prescriptions work, and instant care benefits.",
    author: "Dr. MUKESH Doctor, Clinical Lead",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "published",
    content: `
      <h2>The Shift to Modern Telemedicine: Why Virtual Consultations Are Transforming Healthcare</h2>
      <p>Healthcare accessibility has evolved dramatically. Rather than sitting in crowded clinic waiting rooms exposed to secondary infections, patients can now consult board-certified physicians from the comfort of their home or office via <strong>end-to-end encrypted HD video consultations</strong>.</p>
      
      <p>At <strong>AIRO Health Hub</strong>, our virtual consultation network connects you with experienced clinical specialists within minutes for comprehensive clinical triage, diagnosis, and legitimate digital e-prescriptions accepted by all pharmacies.</p>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#1e40af;font-size:18px;">Need to See a Doctor Right Now?</h3>
        <p style="margin-bottom:14px;color:#1e3a8a;font-size:14px;">Skip the clinic queue. Connect with licensed physicians for cold, flu, skin issues, chronic care follow-ups, and urgent medical advice.</p>
        <a href="/minute-clinic/booking?mode=virtual" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Book Virtual Consultation (₹499) &rarr;</a>
      </div>

      <h2>Common Conditions Effectively Treated via Telemedicine</h2>
      <p>Evidence-based clinical guidelines show that over 70% of routine outpatient encounters can be resolved safely and accurately over virtual video examinations:</p>
      <ul>
        <li><strong>Upper Respiratory Illnesses</strong>: Common cold, acute sinusitis, bronchitis, seasonal allergies, and throat infections.</li>
        <li><strong>Dermatology & Skin Conditions</strong>: Rashes, eczema flare-ups, insect bites, acne, and mild allergic reactions.</li>
        <li><strong>Gastrointestinal Distress</strong>: Acid reflux, acute indigestion, gastroenteritis management, and dietary counseling.</li>
        <li><strong>Chronic Disease Monitoring</strong>: Hypertension medication adjustments, type-2 diabetes reviews, and cholesterol management.</li>
        <li><strong>Lab Report Consultations</strong>: Reviewing blood panels, lipid profiles, thyroid function tests, and vital scans.</li>
      </ul>

      <h2>How Digital e-Prescriptions Work</h2>
      <p>Following your virtual examination, your attending physician signs a digitally verified prescription (with medical council registration number) containing detailed dosage instructions, precautions, and dietary recommendations. At AIRO Health Hub, your prescription is sent instantly to your email and accessible in your profile dashboard for instant fulfillment.</p>

      <h2>When to Seek Emergency Care Instead of Telemedicine</h2>
      <p>While telemedicine is ideal for non-emergency medical conditions, always visit the nearest emergency trauma room for symptoms like severe crushing chest pain, difficulty breathing, sudden stroke-like weakness, or severe physical trauma.</p>
    `
  },

  // 2. HEALTH: Praana 3D Health Scan
  {
    slug: "airo-praana-3d-full-body-health-scan-longevity",
    targetSite: "health",
    title: "AIRO Praana 3D Health Scan: Non-Invasive Full-Body Screening & Longevity Diagnostics",
    seoTitle: "AIRO Praana 3D Health Scan & Preventive Screening | AIRO Health Hub",
    seoDescription: "Discover how AIRO Praana Health Chair measures 50+ bio-markers in 15 minutes. Non-invasive cardiovascular, metabolic, and autonomic nervous system screening.",
    author: "AIRO Longevity Science Board",
    coverImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "published",
    content: `
      <h2>The Future of Longevity: Measuring What Truly Matters Before Symptoms Arise</h2>
      <p>Most traditional healthcare is reactive: we only visit a doctor after feeling pain or developing advanced symptoms. By that point, metabolic dysregulation or arterial stiffness may have been developing quietly for years. <strong>AIRO Praana</strong> flips the script by making comprehensive physiological screening fast, non-invasive, and actionable.</p>

      <p>Built with aerospace-grade optical sensors, bio-impedance arrays, and heart rate variability (HRV) telemetry, the AIRO Praana Health Chair delivers an in-depth 360-degree assessment of your body’s vital systems in under 15 minutes.</p>

      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#166534;font-size:18px;">Experience AIRO Praana in Hyderabad</h3>
        <p style="margin-bottom:14px;color:#14532d;font-size:14px;">Book a comprehensive 15-minute 3D health screening at our Kondapur or Kompally Health Hubs. Receive your personalized 12-page longevity report immediately.</p>
        <a href="/health-chair" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Book Praana Health Scan &rarr;</a>
      </div>

      <h2>Key Biomarkers Analyzed During an AIRO Praana Session</h2>
      <ul>
        <li><strong>Cardiovascular Hemodynamics</strong>: Pulse wave velocity (PWV), arterial elasticity, and peripheral vascular resistance.</li>
        <li><strong>Autonomic Nervous System (ANS) Balance</strong>: Sympathetic vs. parasympathetic tone, physiological stress recovery index, and HRV spectrum.</li>
        <li><strong>Metabolic Health & Body Composition</strong>: Visceral fat estimation, cellular hydration ratio, and phase angle cellular integrity.</li>
        <li><strong>Microcirculation & Tissue Oxygenation</strong>: Capillary perfusion indices and peripheral SpO2 dynamics.</li>
      </ul>

      <h2>Why Early Cardiovascular Screening Saves Lives</h2>
      <p>Arterial stiffness is one of the strongest independent predictors of adverse cardiovascular events. Long before hypertension causes noticeable symptoms, microvascular changes can be identified. Armed with this data, our clinical team designs custom nutrition and lifestyle interventions to reverse early arterial strain.</p>
    `
  },

  // 3. HEALTH: Proactive Longevity Medicine
  {
    slug: "proactive-medicine-vs-reactive-healthcare-longevity",
    targetSite: "health",
    title: "Proactive Medicine vs. Reactive Healthcare: The Scientific Path to Extending Healthspan",
    seoTitle: "Proactive Healthcare vs Reactive Medicine | AIRO Health Hub",
    seoDescription: "Understand why proactive medicine is replacing reactive hospital visits. Learn the clinical protocols that optimize cellular longevity and extend disease-free years.",
    author: "Dr. Gutta Sahan, Preventive Medicine",
    coverImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: "published",
    content: `
      <h2>Lifespan vs. Healthspan: Why Surviving Longer Isn’t Enough</h2>
      <p>Modern medicine has excelled at prolonging chronological lifespan, but healthspan—the period of life spent free from chronic, debilitating disease—has not kept pace. Millions spend their last two decades managing multiple chronic conditions like cardiovascular disease, type-2 diabetes, and osteoarthritis.</p>

      <p><strong>Proactive medicine</strong> represents a paradigm shift: targeting the root biological mechanisms of aging, metabolic dysfunction, and chronic inflammation decades before clinical illness presents.</p>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#1e40af;font-size:18px;">Start Your Proactive Health Plan</h3>
        <p style="margin-bottom:14px;color:#1e3a8a;font-size:14px;">Book an in-person executive physical and vital checkup with our medical specialists at the AIRO Minute Clinic.</p>
        <a href="/minute-clinic/booking?mode=in-person" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Schedule In-Person Clinic Visit &rarr;</a>
      </div>

      <h2>The Four Pillars of Longevity Medicine at AIRO</h2>
      <ol>
        <li><strong>Precision Metabolic Optimization</strong>: Regulating fasting insulin, ApoB, and hs-CRP to prevent insulin resistance and subclinical atherosclerosis.</li>
        <li><strong>Continuous Physiological Feedback</strong>: Tracking heart rate variability, arterial stiffness, and sleep architecture using AIRO Praana diagnostics.</li>
        <li><strong>Functional Nutrition & Gut Microbiome Integrity</strong>: Consuming 100% organic, nutrient-dense whole foods devoid of endocrine-disrupting pesticides.</li>
        <li><strong>Targeted Lifestyle Architecture</strong>: Zone 2 cardiovascular training, resistance training for bone density, and circadian light optimization.</li>
      </ol>
    `
  },

  // 4. HEALTH: Managing Flu and Respiratory Illnesses
  {
    slug: "managing-flu-cold-cough-clinical-treatment-guide",
    targetSite: "health",
    title: "Cold, Flu, and Upper Respiratory Infections: Doctor-Approved Recovery & Treatment Protocols",
    seoTitle: "Cold, Cough & Flu Treatment Protocol | AIRO Minute Clinic",
    seoDescription: "Learn clinical doctor guidelines for fast recovery from viral flu, seasonal cough, and bronchitis. Understand antibiotics stewardship and when to see a physician.",
    author: "Dr. MUKESH Doctor, Clinical Lead",
    coverImage: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "published",
    content: `
      <h2>Differentiating the Common Cold, Seasonal Flu, and Allergic Rhinitis</h2>
      <p>Seasonal weather transitions often trigger a surge in upper respiratory tract infections. While symptoms like nasal congestion, sore throat, and fatigue are shared, differentiating viral viral strains from allergic reactions determines the correct medical management.</p>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#1e40af;font-size:18px;">Struggling with a Persistent Cough or Fever?</h3>
        <p style="margin-bottom:14px;color:#1e3a8a;font-size:14px;">Connect with an AIRO physician in minutes. Receive a customized clinical treatment plan and instant prescription.</p>
        <a href="/minute-clinic/booking?mode=virtual" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Consult a Doctor Online Now &rarr;</a>
      </div>

      <h2>Evidence-Based Recovery Protocol</h2>
      <ul>
        <li><strong>Hypertonic Saline Nasal Lavage</strong>: Clears viral particles from nasal passages and reduces mucosal swelling naturally.</li>
        <li><strong>Targeted Hydration & Electrolytes</strong>: Maintaining fluid balance thins mucosal secretions and speeds up immune leukocyte transit.</li>
        <li><strong>Fever Management</strong>: Using paracetamol judiciously without suppressing beneficial core immune temperatures prematurely.</li>
        <li><strong>Why Antibiotics Do Not Work on Viral Infections</strong>: Antibiotic overuse damages the gut microbiome without killing viruses. Only use antibiotics when confirmed bacterial secondary infections are diagnosed by a physician.</li>
      </ul>
    `
  },

  // 5. HEALTH: Same Day Pharmacy Delivery
  {
    slug: "same-day-prescription-medicine-delivery-hyderabad",
    targetSite: "health",
    title: "Same-Day Prescription Medicine Delivery: Safe, Verified Healthcare at Your Doorstep",
    seoTitle: "Same-Day Medicine Delivery in Hyderabad | AIRO Pharmacy",
    seoDescription: "Order verified, temperature-controlled prescription medicines online with same-day home delivery across Hyderabad from AIRO Pharmacy Hub.",
    author: "AIRO Clinical Pharmacy Team",
    coverImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    status: "published",
    content: `
      <h2>The Critical Importance of Temperature-Controlled, Authentic Medicine Delivery</h2>
      <p>When you are unwell, traveling to multiple physical pharmacies in search of prescribed medications is the last thing you should have to do. Furthermore, temperature-sensitive medications like insulins, probiotics, and biologics require strict cold-chain logistics to maintain pharmaceutical potency.</p>

      <p>At <strong>AIRO Pharmacy</strong>, we provide seamless digital prescription fulfillment directly coordinated with our Minute Clinic doctors. Upload your prescription or book an instant consultation, and receive authentic, batch-verified medications delivered to your home.</p>

      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#166534;font-size:18px;">Need Medicines Delivered Today?</h3>
        <p style="margin-bottom:14px;color:#14532d;font-size:14px;">Upload your prescription or explore our certified wellness pharmacy catalog online.</p>
        <a href="/pharmacy" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Visit AIRO Pharmacy Hub &rarr;</a>
      </div>
    `
  },

  // 6. ESSENTIALS: Cold-Pressed Wood Churned Oils
  {
    slug: "cold-pressed-wood-churned-oils-vs-refined-oils",
    targetSite: "essentials",
    title: "Cold-Pressed Wood Churned Oils vs. Industrial Refined Oils: The Science of Smoke Points and Cellular Health",
    seoTitle: "Cold Pressed Wood Churned Oils vs Refined Oils | AIRO Essentials",
    seoDescription: "Discover why wood pressed (kachi ghani) oils protect cellular membranes and retain antioxidants, while industrial hexane-refined oils generate harmful trans fats.",
    author: "AIRO Nutrition Science Board",
    coverImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "published",
    content: `
      <h2>The Modern Cooking Oil Crisis: How Industrial Refining Destroys Nutrition</h2>
      <p>Most supermarket cooking oils undergo harsh chemical refining: high-temperature heating up to 260°C, bleaching with acid-activated clays, and solvent extraction using chemical <strong>hexane</strong>. This industrial process strips natural vitamins, alters fatty acid bonds, and creates harmful oxidation byproducts that trigger systemic inflammation.</p>

      <p>In stark contrast, <strong>AIRO Essentials Wood-Pressed Oils</strong> are extracted using traditional slow wooden churns (Vaagai marachekku) at temperatures strictly below 45°C. No chemicals, no bleaching, and no micro-nutrient damage.</p>

      <div style="background:#fefce8;border-left:4px solid #ca8a04;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#854d0e;font-size:18px;">Taste the Purest Cold-Pressed Oils</h3>
        <p style="margin-bottom:14px;color:#713f12;font-size:14px;">Explore our raw, single-origin Wood-Pressed Groundnut, Mustard, Sesame, and Coconut Oils.</p>
        <a href="/essentials" style="display:inline-block;background:#ca8a04;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Shop Wood-Pressed Oils &rarr;</a>
      </div>

      <h2>Why Cold-Pressed Oils Protect Your Heart and Blood Vessels</h2>
      <ul>
        <li><strong>Preserved Natural Polyphenols</strong>: Raw wood-pressed oils retain vitamin E (tocopherols) and plant sterols that neutralize free radicals.</li>
        <li><strong>Zero Hexane Residues</strong>: Unlike mass-market refined sunflower or palmolein oils, cold-pressed oils are 100% mechanical extractions with zero petroleum solvents.</li>
        <li><strong>Balanced Omega-3 and Omega-6 Ratios</strong>: Supports healthy endothelial cell function and maintains clean blood vessels.</li>
      </ul>
    `
  },

  // 7. ESSENTIALS: Organic Vegetables and Pesticide Free Living
  {
    slug: "hidden-pesticides-commercial-produce-organic-benefits",
    targetSite: "essentials",
    title: "Hidden Pesticides in Commercial Produce: Why Certified Organic Groceries Protect Cellular Health",
    seoTitle: "Pesticide Residues in Food & Organic Benefits | AIRO Essentials",
    seoDescription: "Examine the toxicology of systemic pesticides like organophosphates in supermarket vegetables and how switching to certified organic groceries shields your gut microbiome.",
    author: "AIRO Agricultural Quality Lab",
    coverImage: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "published",
    content: `
      <h2>The Unseen Toxins on Everyday Dinner Plates</h2>
      <p>Modern intensive farming relies on synthetic organophosphate and neonicotinoid pesticides. These chemicals are <em>systemic</em>, meaning they are absorbed by the plant’s roots and vascular tissue—rendering surface washing with water or baking soda largely ineffective.</p>

      <p>Long-term dietary exposure to low-dose agricultural chemical residues has been linked in peer-reviewed toxicological studies to endocrine disruption, gut microbiome dysbiosis, and chronic neuro-inflammation.</p>

      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#166534;font-size:18px;">Switch to 100% Certified Organic Groceries</h3>
        <p style="margin-bottom:14px;color:#14532d;font-size:14px;">Direct from regenerative certified organic farms to your kitchen. Zero synthetic chemicals, non-GMO, and third-party laboratory tested.</p>
        <a href="/grocery" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Explore Organic Groceries &rarr;</a>
      </div>

      <h2>The Nutrient Advantage of Organic Produce</h2>
      <p>Plants grown organically must generate their own defense compounds against pests. Consequently, certified organic fruits and vegetables contain up to 40% higher concentrations of antioxidant phenolic compounds, quercetin, and anthocyanins compared to chemically grown counterparts.</p>
    `
  },

  // 8. ESSENTIALS: A2 Desi Cow Milk
  {
    slug: "a2-desi-cow-milk-vs-a1-dairy-gut-health",
    targetSite: "essentials",
    title: "A2 Desi Cow Milk vs. Conventional A1 Dairy: Gut Microbiome, Casein Science, and Easy Digestion",
    seoTitle: "A2 Desi Cow Milk Benefits & Digestion | AIRO Essentials",
    seoDescription: "Understand the biochemical differences between A1 and A2 beta-casein proteins. Discover why native Indian Desi cow milk prevents bloating and supports gut wellness.",
    author: "AIRO Dairy & Nutritional Science",
    coverImage: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    status: "published",
    content: `
      <h2>The Beta-Casein Mutation: Why So Many People Struggle with Milk</h2>
      <p>Millions of people who believe they are lactose intolerant actually suffer from <strong>BCM-7 sensitivity</strong> caused by A1 beta-casein protein found in Western European hybrid cattle (Holstein-Friesian and Jersey breeds).</p>

      <p>During digestion, the A1 protein releases beta-casomorphin-7 (BCM-7), an opioid peptide that binds to gastrointestinal receptors, triggering inflammation, delayed bowel transit, and painful bloating. Native Indian humped cows (Bos Indicus—like Gir, Sahiwal, and Ongole) produce pure <strong>A2 beta-casein milk</strong>, which does not break down into BCM-7 and digests smoothly.</p>

      <div style="background:#fefce8;border-left:4px solid #ca8a04;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#854d0e;font-size:18px;">Pure Grass-Fed A2 Desi Cow Dairy</h3>
        <p style="margin-bottom:14px;color:#713f12;font-size:14px;">Experience farm-fresh A2 Gir Cow Ghee and native dairy delivered straight from ethical pasture-raised farms.</p>
        <a href="/grocery" style="display:inline-block;background:#ca8a04;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Shop Pure A2 Ghee & Dairy &rarr;</a>
      </div>
    `
  },

  // 9. ESSENTIALS: Anti-Inflammatory Kitchen Swaps
  {
    slug: "anti-inflammatory-kitchen-pantry-swaps-guide",
    targetSite: "essentials",
    title: "Anti-Inflammatory Kitchen Swaps: Clean Pantry Staples for Cardiovascular and Metabolic Wellness",
    seoTitle: "Anti-Inflammatory Diet & Kitchen Swaps | AIRO Essentials",
    seoDescription: "Step-by-step guide to replacing pro-inflammatory refined sugars, refined flours, and seed oils with therapeutic spices, cold-pressed oils, and ancient grains.",
    author: "AIRO Wellness Advisory",
    coverImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "published",
    content: `
      <h2>Chronic Inflammation: The Silent Driver of Lifestyle Illness</h2>
      <p>Low-grade systemic inflammation is the common denominator behind cardiovascular disease, insulin resistance, autoimmune conditions, and accelerated aging. The modern diet—dominated by ultra-processed seed oils, refined white flours, and chemical preservatives—keeps the immune system in a state of continuous overactivation.</p>

      <p>Transforming your health doesn’t require extreme crash dieting. It starts with upgrading the everyday foundational pantry staples you use in your kitchen every day.</p>

      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#166534;font-size:18px;">Upgrade Your Kitchen to 100% Clean Food</h3>
        <p style="margin-bottom:14px;color:#14532d;font-size:14px;">Stock your pantry with certified organic millets, cold-pressed oils, raw wild honey, and natural rock salts.</p>
        <a href="/grocery" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Browse Clean Pantry Staples &rarr;</a>
      </div>

      <h2>5 High-Impact Kitchen Swaps for Immediate Vitality</h2>
      <ol>
        <li><strong>Swap Refined Seed Oils &rarr; Wood-Pressed Mustard & Groundnut Oil</strong>: Eliminates chemically extracted solvent residues and restores healthy fatty acid balance.</li>
        <li><strong>Swap Refined White Sugar &rarr; Organic Desi Khand & Raw Forest Honey</strong>: Retains naturally occurring trace minerals and prevents rapid glycemic spikes.</li>
        <li><strong>Swap Bleached Maida Flour &rarr; Ancient Khapli Emmer Wheat & Heritage Millets</strong>: Rich in soluble dietary fiber that feeds beneficial short-chain fatty acid producing gut bacteria.</li>
        <li><strong>Swap Table Salt &rarr; Unrefined Himalayan Pink Rock Salt</strong>: Provides balanced mineral electrolytes without microplastic bleaching agents.</li>
        <li><strong>Swap Commercial Spice Powders &rarr; Sun-Dried Stone-Ground Single-Estate Spices</strong>: Packed with potent curcumin, piperine, and therapeutic essential oils.</li>
      </ol>
    `
  },

  // 10. DUAL / LONGEVITY: The Longevity Blueprint
  {
    slug: "longevity-blueprint-combining-diagnostics-clean-nutrition",
    targetSite: "both",
    title: "The Longevity Blueprint: Combining Advanced Diagnostics with Zero-Toxin Whole Food Nutrition",
    seoTitle: "The Longevity Blueprint: Diagnostics & Clean Food | AIRO",
    seoDescription: "Learn how the synergy between proactive health screening and chemical-free whole food nutrition unlocks maximum cellular healthspan and daily energy.",
    author: "AIRO Medical & Nutrition Science Board",
    coverImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: "published",
    content: `
      <h2>The Two Halves of True Human Wellness</h2>
      <p>True longevity requires two harmonized pillars working together:</p>
      <ul>
        <li><strong>Objective Diagnostic Truth</strong>: Knowing your internal vital metrics, arterial elasticity, autonomic nervous system stress, and metabolic markers before disease manifests.</li>
        <li><strong>Pure Biological Fuel</strong>: Feeding your trillions of cells with 100% toxin-free, organic, nutrient-dense whole foods that nurture mitochondrial energy production.</li>
      </ul>

      <p>This is why AIRO was founded as a unified ecosystem: <strong>AIRO Health Hub</strong> provides clinical precision and proactive screening, while <strong>AIRO Essentials</strong> provides the chemical-free nutrition needed to sustain lifelong health.</p>

      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:20px;border-radius:12px;margin:28px 0;">
        <h3 style="margin-top:0;color:#1e40af;font-size:18px;">Unlock the Full AIRO Health Experience</h3>
        <p style="margin-bottom:14px;color:#1e3a8a;font-size:14px;">Join the AIRO Membership for unlimited doctor video visits, discounted organic grocery boxes, and quarterly Praana 3D Health Scans.</p>
        <a href="/membership" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 20px;border-radius:8px;font-size:14px;">Explore AIRO Membership Plans &rarr;</a>
      </div>
    `
  }
];

async function runSeed() {
  console.log(`Starting to seed ${SEED_BLOGS.length} high-ranking SEO blog articles...`);
  for (const blog of SEED_BLOGS) {
    const docRef = doc(db, 'blogs', blog.slug);
    await setDoc(docRef, { ...blog, id: blog.slug });
    console.log(`✓ Seeded blog: [${blog.targetSite.toUpperCase()}] ${blog.title}`);
  }
  console.log("All 10 high-ranking SEO blog posts successfully written to Firestore!");
  process.exit(0);
}

runSeed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
