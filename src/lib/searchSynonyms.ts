export const searchSynonyms: Record<string, string[]> = {
  "fever": ["flu", "covid", "temperature", "feverish", "hot"],
  "cough": ["flu", "covid", "bronchitis", "pneumonia", "cold", "throat", "coughing"],
  "cold": ["flu", "congestion", "throat", "runny nose", "sneezing", "sniffles"],
  "body pain": ["pain", "flu", "muscle", "joint", "ache", "sore", "body pains", "body ache"],
  "knee pain": ["pain", "joint", "sprain", "strain", "knee", "knees", "knee pains"],
  "stomach ache": ["nausea", "vomiting", "diarrhea", "stomach", "belly", "tummy", "abdominal", "food poisoning", "upset stomach"],
  "headache": ["pain", "migraine", "flu", "cold", "sinus", "head", "headaches"],
  "throat": ["strep", "sore", "cold", "flu", "tonsil", "swallowing"],
  "rash": ["allergy", "dermatitis", "bites", "itching", "itchy", "hives", "redness"],
  "cut": ["wound", "first aid", "bleeding", "laceration", "cuts"],
  "burn": ["wound", "first aid", "burns"],
  "std": ["urinary", "sexual", "sti", "chlamydia", "gonorrhea", "herpes", "syphilis", "testing"],
  "sti": ["urinary", "sexual", "std", "chlamydia", "gonorrhea", "herpes", "syphilis", "testing"],
  "uti": ["urinary", "bladder", "painful urination", "peeing", "urinary tract infection"],
  "pregnancy": ["women", "test", "family planning", "birth control", "contraceptive", "pregnant"],
  "birth control": ["women", "pregnancy", "contraceptive", "family planning", "pill"],
  "pink eye": ["eye", "conjunctivitis", "red eye"],
  "ear ache": ["ear", "pain", "hearing", "earache", "swimmer"],
  "allergy": ["allergies", "sneezing", "itchy", "eyes", "runny nose", "hay fever", "seasonal"],
  "shot": ["vaccine", "immunization", "injection", "booster"],
  "checkup": ["physical", "wellness", "exam", "health", "screening", "annual"],
  "blood pressure": ["heart", "hypertension", "screening", "monitoring"],
  "diabetes": ["sugar", "glucose", "a1c", "screening", "monitoring"],
  "cholesterol": ["heart", "lipid", "screening", "monitoring"],
  "sleep": ["insomnia", "apnea", "snoring", "tired", "fatigue"],
  "weight": ["obesity", "loss", "management", "diet", "nutrition"],
  "anxiety": ["mental", "behavioral", "stress", "worry", "panic", "depression"],
  "depression": ["mental", "behavioral", "sad", "hopeless", "mood"],
  "back pain": ["injury", "pain", "back", "muscle", "strain", "spine"],
  "sprain": ["injury", "pain", "joint", "ankle", "wrist", "twisted"],
  "strain": ["injury", "pain", "muscle", "pulled"],
  "bug bite": ["skin", "insect", "tick", "spider", "mosquito", "sting", "bite"],
  "poison ivy": ["skin", "rash", "allergy", "plant", "oak", "sumac"],
  "lice": ["skin", "hair", "head", "bugs", "itching"],
  "wart": ["skin", "growth", "plantar"],
  "acne": ["skin", "pimples", "breakout", "face"],
  "hair loss": ["skin", "hair", "alopecia", "balding"],
  "nail": ["skin", "fungus", "ingrown", "toe", "finger"],
  "travel": ["vaccine", "immunization", "typhoid", "malaria", "yellow fever", "trip"],
  "camp": ["physical", "exam", "kids", "school"],
  "sports": ["physical", "exam", "kids", "school", "athletic"],
  "tb": ["tuberculosis", "test", "ppd", "skin test", "reading"],
  "covid": ["coronavirus", "test", "vaccine", "booster", "pcr", "rapid"],
  "flu": ["influenza", "test", "vaccine", "shot", "illness"],
  "rsv": ["virus", "respiratory", "test", "illness", "kids", "infant"],
  "illness": ["sick", "unwell", "feeling bad", "disease", "infection"],
  "injury": ["hurt", "broken", "sprain", "cut", "wound", "accident"]
};

export function getSearchKeywords(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  // Start with the exact query
  const keywords = new Set<string>();
  keywords.add(normalizedQuery);

  // Split into words and add them
  const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  words.forEach(w => keywords.add(w));

  // If the query matches a key exactly, add its specific synonyms
  // We do EXACT matching for the keys to avoid "f" matching everything
  for (const [key, syns] of Object.entries(searchSynonyms)) {
    if (normalizedQuery === key || words.includes(key)) {
      syns.forEach(s => keywords.add(s));
    }
  }

  // Also do a simple substring match for specific layperson terms if they type it as part of a phrase
  // e.g. "i have a fever" -> includes "fever"
  for (const [key, syns] of Object.entries(searchSynonyms)) {
    if (normalizedQuery.includes(key) && normalizedQuery !== key) {
      syns.forEach(s => keywords.add(s));
    }
  }

  return Array.from(keywords);
}
