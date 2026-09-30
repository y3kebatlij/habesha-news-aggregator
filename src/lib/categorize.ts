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

// Whole-word matches (plus simple plural/verb endings), so "match" doesn't
// fire inside "dispatch" or "tech" inside "technical".
const PATTERNS = Object.fromEntries(
  ORDER.map((category) => [
    category,
    KEYWORDS[category].map((keyword) => {
      const escaped = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}(?:s|es|ing|ed)?\\b`);
    }),
  ])
) as Record<Exclude<CategorySlug, "general">, RegExp[]>;

export function categorize(title: string, snippet: string): CategorySlug {
  const titleText = title.toLowerCase();
  const snippetText = snippet.toLowerCase();

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
