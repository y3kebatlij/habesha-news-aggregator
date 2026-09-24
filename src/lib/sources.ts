// Ownership/affiliation classification, not a political left-right rating —
// that would require case-by-case editorial analysis we can't responsibly
// claim for every source. "state-affiliated" is used only where ownership or
// leadership ties to the Ethiopian government are publicly documented;
// "unrated" is the honest default when we don't have solid sourcing either
// way. See ARCHITECTURE.md-style reasoning in the v2 plan for fact-check/bias
// flags.
export type SourceTransparency = "state-affiliated" | "independent" | "unrated";

// "ethiopia" sources publish an Ethiopia-specific (or Ethiopia-only) feed —
// every article they publish is in scope. "africa-broad" sources publish a
// pan-African or global feed; their articles are kept only when they mention
// Ethiopia (see ethiopiaFilter.ts), since otherwise most of their output has
// nothing to do with this site.
export type SourceScope = "ethiopia" | "africa-broad";

export type Source = {
  id: string;
  name: string;
  feedUrl: string;
  siteUrl: string;
  language: "en" | "am";
  transparency: SourceTransparency;
  transparencyNote?: string;
  scope: SourceScope;
};

export const SOURCES: Source[] = [
  {
    id: "fana",
    name: "Fana Media Corporation",
    feedUrl: "https://www.fanamc.com/english/feed/",
    siteUrl: "https://www.fanamc.com/english/",
    language: "en",
    transparency: "state-affiliated",
    transparencyNote: "Board and leadership are tied to Ethiopia's ruling Prosperity Party.",
    scope: "ethiopia",
  },
  {
    id: "capital",
    name: "Capital Ethiopia",
    feedUrl: "https://capitalethiopia.com/feed/",
    siteUrl: "https://capitalethiopia.com/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned business weekly.",
    scope: "ethiopia",
  },
  {
    id: "addisfortune",
    name: "Addis Fortune",
    feedUrl: "https://addisfortune.news/feed/",
    siteUrl: "https://addisfortune.news/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned business weekly.",
    scope: "ethiopia",
  },
  {
    id: "ethiopianmonitor",
    name: "Ethiopian Monitor",
    feedUrl: "https://ethiopianmonitor.com/feed/",
    siteUrl: "https://ethiopianmonitor.com/",
    language: "en",
    transparency: "unrated",
    scope: "ethiopia",
  },
  {
    id: "bbc-amharic",
    name: "BBC Amharic",
    feedUrl: "https://feeds.bbci.co.uk/amharic/rss.xml",
    siteUrl: "https://www.bbc.com/amharic",
    language: "am",
    transparency: "independent",
    transparencyNote: "Operated by BBC World Service, editorially independent of the Ethiopian government.",
    scope: "ethiopia",
  },
  {
    id: "shega",
    name: "Shega",
    feedUrl: "https://shega.co/rss",
    siteUrl: "https://shega.co/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned tech/business publication.",
    scope: "ethiopia",
  },
  {
    id: "allafrica-ethiopia",
    name: "AllAfrica: Ethiopia",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/ethiopia/headlines.rdf",
    siteUrl: "https://allafrica.com/ethiopia/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Wire aggregator; underlying source mix varies by story.",
    scope: "ethiopia",
  },
  {
    id: "newbusinessethiopia",
    name: "New Business Ethiopia",
    feedUrl: "https://newbusinessethiopia.com/feed/",
    siteUrl: "https://newbusinessethiopia.com/",
    language: "en",
    transparency: "unrated",
    scope: "ethiopia",
  },
  {
    id: "ethiopia-insight",
    name: "Ethiopia Insight",
    feedUrl: "https://www.ethiopia-insight.com/feed/",
    siteUrl: "https://www.ethiopia-insight.com/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Independent, ad-free analysis platform.",
    scope: "ethiopia",
  },
  {
    id: "bbc-africa",
    name: "BBC News Africa",
    feedUrl: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    siteUrl: "https://www.bbc.com/news/world/africa",
    language: "en",
    transparency: "independent",
    transparencyNote: "Operated by BBC World Service, editorially independent of the Ethiopian government.",
    scope: "africa-broad",
  },
  {
    id: "aljazeera",
    name: "Al Jazeera",
    feedUrl: "https://www.aljazeera.com/xml/rss/all.xml",
    siteUrl: "https://www.aljazeera.com/where/ethiopia/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Funded by the Qatari government but editorially independent of Ethiopia's government.",
    scope: "africa-broad",
  },
  {
    id: "africanews",
    name: "Africanews",
    feedUrl: "https://www.africanews.com/feed/rss",
    siteUrl: "https://www.africanews.com/tag/ethiopia/",
    language: "en",
    transparency: "independent",
    scope: "africa-broad",
  },
  {
    id: "france24-africa",
    name: "France 24 Africa",
    feedUrl: "https://www.france24.com/en/africa/rss",
    siteUrl: "https://www.france24.com/en/africa/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Funded by the French government but editorially independent of Ethiopia's government.",
    scope: "africa-broad",
  },
];
