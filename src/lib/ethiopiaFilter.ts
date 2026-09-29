import type { Region } from "./types";

// Used to filter broad pan-African/international feeds (BBC Africa, Al
// Jazeera, Africanews, France24 Africa, etc. — see `Source.scope` in
// sources.ts) down to just the articles that are actually about Ethiopia,
// since those feeds cover the whole continent (or the whole world) rather
// than publishing an Ethiopia-only feed.
const ETHIOPIA_KEYWORDS = [
  "ethiopia",
  "ethiopian",
  "addis ababa",
  "abiy ahmed",
  "tigray",
  "oromia",
  "oromo",
  "amhara",
  "afar region",
  "somali region",
  "benishangul",
  "sidama",
  "harar",
  "dire dawa",
  "gambela",
  "ogaden",
  "birr",
  "prosperity party",
  "grand ethiopian renaissance dam",
  "gerd",
];

// Neighbouring countries covered by the East Africa section. Only checked
// against the headline: a story whose headline leads with one of these is
// about that country, even if the snippet goes on to mention Ethiopia (e.g.
// France 24's nightly "Eye on Africa" roundups, which list several unrelated
// stories in one description).
const EAST_AFRICA_KEYWORDS = [
  "kenya",
  "nairobi",
  "uganda",
  "kampala",
  "somalia",
  "somaliland",
  "mogadishu",
  "al-shabaab",
  "sudan",
  "khartoum",
  "darfur",
  "eritrea",
  "asmara",
  "djibouti",
  "tanzania",
  "rwanda",
  "burundi",
];

// Other African countries: a headline leading with one of these is about that
// country, so an Ethiopia mention in its snippet (e.g. Africanews's daily
// "[Africanews Today]" bulletins) isn't enough to count it as Ethiopian news.
// Matched as whole words, since short names like "mali" and "niger" otherwise
// hit inside unrelated words.
const OTHER_AFRICA_PATTERN =
  /\b(drc|congo|congolese|nigeria|nigerian|ghana|ghanaian|south africa|south african|egypt|egyptian|libya|libyan|tunisia|tunisian|algeria|algerian|morocco|moroccan|senegal|senegalese|mali|malian|niger|burkina faso|cameroon|cameroonian|chad|chadian|zimbabwe|zimbabwean|zambia|zambian|mozambique|angola|angolan|malawi|namibia|botswana|madagascar|ivory coast|côte d'ivoire|guinea|sierra leone|liberia|gabon|togo|benin|mauritania|lesotho|eswatini)\b/;

function containsAny(text: string, keywords: string[]): boolean {
  const haystack = ` ${text.toLowerCase()} `;
  return keywords.some((keyword) => haystack.includes(keyword));
}

export function mentionsEthiopia(text: string): boolean {
  return containsAny(text, ETHIOPIA_KEYWORDS);
}

// Decides which section (if any) an article from a broad feed belongs in.
// The headline is what readers see, so it outranks the snippet.
export function classifyBroadArticle(title: string, snippet: string): Region | null {
  if (mentionsEthiopia(title)) return "ethiopia";
  if (containsAny(title, EAST_AFRICA_KEYWORDS)) return "east-africa";
  if (OTHER_AFRICA_PATTERN.test(title.toLowerCase())) return null;
  if (mentionsEthiopia(snippet)) return "ethiopia";
  return null;
}
