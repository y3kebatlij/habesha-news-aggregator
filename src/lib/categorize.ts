import type { CategorySlug } from "./types";

const KEYWORDS: Record<Exclude<CategorySlug, "general">, string[]> = {
  politics: [
    "parliament",
    "election",
    "government",
    "minister",
    "president",
    "abiy ahmed",
    "tplf",
    "oromia",
    "amhara",
    "tigray",
    "diplomat",
    "sanction",
    "opposition",
    "constitution",
    "federal",
    "cabinet",
    "african union",
    "un security council",
    "peace deal",
    "ceasefire",
    "conflict",
    "war",
    "rebel",
    "military",
    "alliance",
    "coalition",
    "army",
    "armed",
    "troops",
    "fighting",
    "drone",
    "rsf",
  ],
  business: [
    "bank",
    "economy",
    "economic",
    "inflation",
    "trade",
    "investment",
    "budget",
    "currency",
    "birr",
    "stock",
    "market",
    "export",
    "import",
    "ipo",
    "loan",
    "tax",
    "finance",
    "financial",
    "gdp",
    "commerce",
    "business",
    "revenue",
    "customs",
    "insurance",
    "commodity exchange",
    "world bank",
    "imf",
    "ida",
    "investor",
    "remittance",
    "fuel",
    "petroleum",
    "energy",
    "mining",
    "mineral",
    "nbe",
    "national bank",
  ],
  sports: [
    "football",
    "soccer",
    "athletics",
    "marathon",
    "olympic",
    "fifa",
    "premier league",
    "national team",
    "world cup",
    "runner",
    "basketball",
    "sport",
    "tournament",
    "championship",
    "medal",
    "coach",
    "match",
    "league",
  ],
  fashion: [
    "fashion",
    "style",
    "beauty",
    "wedding",
    "habesha kemis",
    "clothing",
    "model",
    "designer",
    "lifestyle",
    "runway",
    "textile",
  ],
  technology: [
    "technology",
    "tech ",
    "startup",
    " app ",
    "digital",
    "internet",
    "telecom",
    "fintech",
    "software",
    "cybersecurity",
    "innovation",
    "edtech",
    "technologies",
  ],
  diaspora: [
    "diaspora",
    "embassy",
    "visa",
    "immigration",
    "abroad",
    "expatriate",
  ],
};

// Amharic attaches prepositions and suffixes to the word itself (በኢትዮጵያ,
// ኤምባሲዋን), so these are stems matched anywhere in the text rather than whole
// words. Stems are chosen to be long enough not to fire inside unrelated
// words — e.g. "አማራ ክልል" rather than "አማራ", which is also the start of
// "አማራጭ" (alternative). Spelling variants are handled by normalize().
// A RegExp entry is used as-is, for a stem that needs an exclusion.
const AMHARIC_KEYWORDS: Record<Exclude<CategorySlug, "general">, (string | RegExp)[]> = {
  politics: [
    "ምርጫ", // election
    "ፓርላማ",
    "ምክር ቤት", // council / house
    "መንግስት", // government
    "ሚኒስ", // minister, ministry
    "ፕሬዝዳንት",
    "ፕሬዚዳንት",
    "ፖለቲ", // politics, politician
    "ተቃዋሚ", // opposition
    "ፌደራል",
    "ፌዴራል",
    "ብልጽግና", // Prosperity Party
    "ህወሃት", // TPLF
    "ትግራይ",
    "ኦሮሚያ",
    "አማራ ክልል",
    "ፋኖ",
    "ጦር", // army, war
    "ግጭት", // conflict
    "ውጊያ", // fighting
    "ታጣቂ", // armed group
    "ወታደር", // soldier
    "ሰራዊት", // army
    "ጥምረት", // coalition
    "ድሮን",
  ],
  business: [
    "ባንክ",
    "ኢኮኖሚ",
    "የዋጋ ግሽበት", // inflation
    "ንግድ", // trade
    "ኢንቨስት",
    "በጀት", // budget
    "ሚሊዮን ብር",
    "ቢሊዮን ብር",
    "ምንዛሪ", // currency exchange
    "ዶላር",
    "ገበያ", // market
    "አክሲዮን", // shares
    "ብድር", // loan
    "ግብር", // tax
    "ታክስ",
    "ፋይናንስ",
    "ኤክስፖርት",
    "ኢንሹራንስ",
    "ነዳጅ", // fuel
    "ማዕድን", // mineral
    "ኩባንያ", // company
    "ኢንዱስትሪ",
  ],
  sports: [
    /(?<!ፓ)ስፖርት/, // sport, but not inside ፓስፖርት (passport)
    "ኳስ", // football ("እግር ኳስ")
    "አትሌ", // athlete, athletics
    "ማራቶን",
    "ኦሎምፒክ",
    "ሩጫ", // race
    "ውድድር", // competition
    "ፕሪሚየር ሊግ",
    "ብሔራዊ ቡድን", // national team
    "ዋንጫ", // cup
    "ሜዳሊያ",
    "አሰልጣ", // coach
    "ፊፋ",
    "ክለብ",
  ],
  fashion: [
    "ፋሽን",
    "ሞዴል",
    "ውበት", // beauty
    "ሰርግ", // wedding
    "ልብስ", // clothing
    "ቀሚስ", // dress, habesha kemis
    "ዲዛይነር",
    "ጌጣጌጥ", // jewellery
  ],
  technology: [
    "ቴክኖሎጂ",
    "ኢንተርኔት",
    "ዲጂታል",
    "ቴሌኮም",
    "ቴሌብር",
    "ሳፋሪኮም",
    "ሶፍትዌር",
    "ስታርትአፕ",
    "መተግበሪያ", // app
    "ሞባይል",
    "ኤአይ", // AI
    "ሰው ሰራሽ አስተውሎት", // artificial intelligence
    "ሳይበር",
  ],
  diaspora: [
    "ዳያስፖራ",
    "ዲያስፖራ",
    "ኤምባሲ",
    "ቪዛ",
    "ስደት", // migration, refugee
    "ውጭ አገር", // abroad
    "ውጭ ሀገር",
  ],
};

// Amharic has letters that sound the same and are used interchangeably
// (ሥ/ስ, ሐ/ኀ/ሀ, ዐ/አ, ፀ/ጸ — "መንግሥት" and "መንግስት" are the same word). Each is
// a block of 8 vowel forms in Unicode, so map every form of a variant onto
// the same form of its common letter.
const ETHIOPIC_VARIANTS: [variant: number, canonical: number][] = [
  [0x1210, 0x1200], // ሐ → ሀ
  [0x1280, 0x1200], // ኀ → ሀ
  [0x1220, 0x1230], // ሠ → ሰ
  [0x12d0, 0x12a0], // ዐ → አ
  [0x1340, 0x1338], // ፀ → ጸ
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[ሀ-፿]/g, (char) => {
    const code = char.codePointAt(0)!;
    for (const [variant, canonical] of ETHIOPIC_VARIANTS) {
      if (code >= variant && code < variant + 8) {
        return String.fromCodePoint(canonical + (code - variant));
      }
    }
    return char;
  });
}

// Tie-break only: when two categories score the same, the more specific one
// (earlier here) wins.
const ORDER: Exclude<CategorySlug, "general">[] = [
  "sports",
  "fashion",
  "technology",
  "diaspora",
  "business",
  "politics",
];

// The headline says what a story is about; the snippet often mentions side
// details (e.g. a loan story whose snippet lists "digital data" among other
// bills), so a headline match counts for more.
const TITLE_WEIGHT = 3;
const SNIPPET_WEIGHT = 1;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// English: whole-word matches (plus simple plural/verb endings), so "match"
// doesn't fire inside "dispatch" or "tech" inside "technical".
// Amharic: stem matches anywhere (see AMHARIC_KEYWORDS).
const PATTERNS = Object.fromEntries(
  ORDER.map((category) => [
    category,
    [
      ...KEYWORDS[category].map(
        (keyword) => new RegExp(`\\b${escapeRegExp(keyword.trim())}(?:s|es|ing|ed)?\\b`)
      ),
      ...AMHARIC_KEYWORDS[category].map((stem) =>
        stem instanceof RegExp ? stem : new RegExp(escapeRegExp(normalize(stem)))
      ),
    ],
  ])
) as Record<Exclude<CategorySlug, "general">, RegExp[]>;

export function categorize(title: string, snippet: string): CategorySlug {
  const titleText = normalize(title);
  const snippetText = normalize(snippet);

  let best: CategorySlug = "general";
  let bestScore = 0;
  for (const category of ORDER) {
    const score = PATTERNS[category].reduce((total, pattern) => {
      if (pattern.test(titleText)) return total + TITLE_WEIGHT;
      if (pattern.test(snippetText)) return total + SNIPPET_WEIGHT;
      return total;
    }, 0);
    // Strictly greater, so ties keep the earlier (more specific) category.
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  return best;
}
