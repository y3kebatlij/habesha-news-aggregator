// Drops items that aren't news: job adverts, tender notices and paid or
// promotional posts (press releases, sponsored content, product launches).
// Several feeds mix these in with their reporting — ITWeb republishes vendor
// press releases from Business Wire, and Ethiopian outlets carry vacancy and
// tender notices — with nothing in the feed to tell them apart, so this works
// from the wording. Phrases are kept specific so real news about jobs, tenders
// or launches ("Project Will Create 4,000 Jobs", "Red Cross Launches Emergency
// Response") still gets through.

// Checked against the headline.
const AD_TITLE_PATTERNS = [
  // Job adverts
  /\bvacanc(y|ies)\b/,
  /\bjob (openings?|vacanc(y|ies)|opportunit(y|ies)|offers?|posting|advert|announcement)\b/,
  /\b(now|we are|we're|is) hiring\b/,
  /\bapply now\b/,
  /\bcall for (applications|proposals|nominations)\b/,
  /\binternships?\b/,
  /\bscholarship opportunit/,
  /\bfully[- ]funded\b/,
  // Tender and procurement notices
  /\binvitation (to|for) bids?\b/,
  /\btender (notice|announcement)\b/,
  /^top [\w ]*tenders\b/,
  /\brequest for (proposals?|quotations?)\b/,
  /\bexpressions? of interest\b/,
  // Paid and promotional posts
  /\bsponsored\b/,
  /\badvertorial\b/,
  /\bpress release\b/,
  /\bpartner content\b/,
  /\bpaid (post|content|partnership)\b/,
  /\bpromo code\b/,
  /\b(buy|shop|order) now\b/,
  /\blimited[- ]time offer\b/,
  /\d+% off\b/,
  /\bbest (software|apps?|tools?|deals?) for\b/,
  /\bsupercharg/,
  /\bgame[- ]chang/,
];

// A product launch written in marketing language ("Canon launches pioneering
// Printer EDR technology to enhance security…"). Both parts must match, since
// a launch on its own is often news.
const LAUNCH_PATTERN = /\b(launch(es|ed)?|unveils?|unveiled|introduc(e|es|ed)|rolls? out|debuts?)\b/;
const MARKETING_PATTERN =
  /\b(pioneering|cutting[- ]edge|innovative|seamless|premium|co-branded|platinum|unlocks?|state[- ]of[- ]the[- ]art|next[- ]gen(eration)?|world[- ]class|exclusive|its solutions)\b/;

// Amharic: "open job position", "job advertisement", "tender notice".
const AMHARIC_AD_PHRASES = ["ክፍት የሥራ ቦታ", "ክፍት የስራ ቦታ", "የሥራ ማስታወቂያ", "የስራ ማስታወቂያ", "የጨረታ ማስታወቂያ"];

// Checked against the snippet: wording only an advert or press release uses.
const AD_SNIPPET_PATTERN =
  /\b(this press release|sponsored content|paid content|advertorial|deadline for applications|interested (candidates|applicants)|qualified (candidates|applicants))\b/;

export function isPromotional(title: string, snippet: string): boolean {
  const headline = title.toLowerCase();
  if (AD_TITLE_PATTERNS.some((pattern) => pattern.test(headline))) return true;
  if (LAUNCH_PATTERN.test(headline) && MARKETING_PATTERN.test(headline)) return true;
  if (AMHARIC_AD_PHRASES.some((phrase) => title.includes(phrase) || snippet.includes(phrase))) {
    return true;
  }
  return AD_SNIPPET_PATTERN.test(snippet.toLowerCase());
}
