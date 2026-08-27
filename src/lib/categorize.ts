import type { CategorySlug } from "./types";

const KEYWORDS: Record<Exclude<CategorySlug, "general">, string[]> = {
  politics: [
    "prime minister",
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
    "ethio telecom",
    "fintech",
    "software",
    "cybersecurity",
    "innovation",
  ],
  diaspora: [
    "diaspora",
    "embassy",
    "visa",
    "immigration",
    "abroad",
    "community abroad",
    "expatriate",
  ],
};

const ORDER: Exclude<CategorySlug, "general">[] = [
  "sports",
  "fashion",
  "technology",
  "diaspora",
  "business",
  "politics",
];

export function categorize(title: string, snippet: string): CategorySlug {
  const text = ` ${title.toLowerCase()} ${snippet.toLowerCase()} `;

  for (const category of ORDER) {
    const keywords = KEYWORDS[category];
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  return "general";
}
