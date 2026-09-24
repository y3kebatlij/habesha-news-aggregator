// Ownership/affiliation classification, not a political left-right rating —
// that would require case-by-case editorial analysis we can't responsibly
// claim for every source. "state-affiliated" is used only where ownership or
// leadership ties to the Ethiopian government are publicly documented;
// "unrated" is the honest default when we don't have solid sourcing either
// way. See ARCHITECTURE.md-style reasoning in the v2 plan for fact-check/bias
// flags.
export type SourceTransparency = "state-affiliated" | "independent" | "unrated";

export type Source = {
  id: string;
  name: string;
  feedUrl: string;
  siteUrl: string;
  language: "en" | "am";
  transparency: SourceTransparency;
  transparencyNote?: string;
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
  },
  {
    id: "capital",
    name: "Capital Ethiopia",
    feedUrl: "https://capitalethiopia.com/feed/",
    siteUrl: "https://capitalethiopia.com/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned business weekly.",
  },
  {
    id: "addisfortune",
    name: "Addis Fortune",
    feedUrl: "https://addisfortune.news/feed/",
    siteUrl: "https://addisfortune.news/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned business weekly.",
  },
  {
    id: "ethiopianmonitor",
    name: "Ethiopian Monitor",
    feedUrl: "https://ethiopianmonitor.com/feed/",
    siteUrl: "https://ethiopianmonitor.com/",
    language: "en",
    transparency: "unrated",
  },
  {
    id: "bbc-amharic",
    name: "BBC Amharic",
    feedUrl: "https://feeds.bbci.co.uk/amharic/rss.xml",
    siteUrl: "https://www.bbc.com/amharic",
    language: "am",
    transparency: "independent",
    transparencyNote: "Operated by BBC World Service, editorially independent of the Ethiopian government.",
  },
  {
    id: "shega",
    name: "Shega",
    feedUrl: "https://shega.co/rss",
    siteUrl: "https://shega.co/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Privately owned tech/business publication.",
  },
  {
    id: "allafrica-ethiopia",
    name: "AllAfrica: Ethiopia",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/ethiopia/headlines.rdf",
    siteUrl: "https://allafrica.com/ethiopia/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Wire aggregator; underlying source mix varies by story.",
  },
  {
    id: "newbusinessethiopia",
    name: "New Business Ethiopia",
    feedUrl: "https://newbusinessethiopia.com/feed/",
    siteUrl: "https://newbusinessethiopia.com/",
    language: "en",
    transparency: "unrated",
  },
  {
    id: "ethiopia-insight",
    name: "Ethiopia Insight",
    feedUrl: "https://www.ethiopia-insight.com/feed/",
    siteUrl: "https://www.ethiopia-insight.com/",
    language: "en",
    transparency: "independent",
    transparencyNote: "Independent, ad-free analysis platform.",
  },
];
