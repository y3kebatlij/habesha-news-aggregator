export type Source = {
  id: string;
  name: string;
  feedUrl: string;
  siteUrl: string;
  language: "en" | "am";
};

export const SOURCES: Source[] = [
  {
    id: "fana",
    name: "Fana Media Corporation",
    feedUrl: "https://www.fanamc.com/english/feed/",
    siteUrl: "https://www.fanamc.com/english/",
    language: "en",
  },
  {
    id: "capital",
    name: "Capital Ethiopia",
    feedUrl: "https://capitalethiopia.com/feed/",
    siteUrl: "https://capitalethiopia.com/",
    language: "en",
  },
  {
    id: "addisfortune",
    name: "Addis Fortune",
    feedUrl: "https://addisfortune.news/feed/",
    siteUrl: "https://addisfortune.news/",
    language: "en",
  },
  {
    id: "ethiopianmonitor",
    name: "Ethiopian Monitor",
    feedUrl: "https://ethiopianmonitor.com/feed/",
    siteUrl: "https://ethiopianmonitor.com/",
    language: "en",
  },
  {
    id: "bbc-amharic",
    name: "BBC Amharic",
    feedUrl: "https://feeds.bbci.co.uk/amharic/rss.xml",
    siteUrl: "https://www.bbc.com/amharic",
    language: "am",
  },
  {
    id: "shega",
    name: "Shega",
    feedUrl: "https://shega.co/rss",
    siteUrl: "https://shega.co/",
    language: "en",
  },
  {
    id: "allafrica-ethiopia",
    name: "AllAfrica: Ethiopia",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/ethiopia/headlines.rdf",
    siteUrl: "https://allafrica.com/ethiopia/",
    language: "en",
  },
  {
    id: "newbusinessethiopia",
    name: "New Business Ethiopia",
    feedUrl: "https://newbusinessethiopia.com/feed/",
    siteUrl: "https://newbusinessethiopia.com/",
    language: "en",
  },
  {
    id: "ethiopia-insight",
    name: "Ethiopia Insight",
    feedUrl: "https://www.ethiopia-insight.com/feed/",
    siteUrl: "https://www.ethiopia-insight.com/",
    language: "en",
  },
];
