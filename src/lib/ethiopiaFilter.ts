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

export function mentionsEthiopia(text: string): boolean {
  const haystack = ` ${text.toLowerCase()} `;
  return ETHIOPIA_KEYWORDS.some((keyword) => haystack.includes(keyword));
}
