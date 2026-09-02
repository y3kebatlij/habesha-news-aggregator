import type { Region } from "./types";

export type Source = {
  id: string;
  name: string;
  feedUrl: string;
  siteUrl: string;
  language: "en" | "am";
  region: Region;
};

export const SOURCES: Source[] = [
  {
    id: "fana",
    name: "Fana Media Corporation",
    feedUrl: "https://www.fanamc.com/english/feed/",
    siteUrl: "https://www.fanamc.com/english/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "capital",
    name: "Capital Ethiopia",
    feedUrl: "https://capitalethiopia.com/feed/",
    siteUrl: "https://capitalethiopia.com/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "addisfortune",
    name: "Addis Fortune",
    feedUrl: "https://addisfortune.news/feed/",
    siteUrl: "https://addisfortune.news/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "ethiopianmonitor",
    name: "Ethiopian Monitor",
    feedUrl: "https://ethiopianmonitor.com/feed/",
    siteUrl: "https://ethiopianmonitor.com/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "bbc-amharic",
    name: "BBC Amharic",
    feedUrl: "https://feeds.bbci.co.uk/amharic/rss.xml",
    siteUrl: "https://www.bbc.com/amharic",
    language: "am",
    region: "ethiopia",
  },
  {
    id: "shega",
    name: "Shega",
    feedUrl: "https://shega.co/rss",
    siteUrl: "https://shega.co/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "allafrica-ethiopia",
    name: "AllAfrica: Ethiopia",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/ethiopia/headlines.rdf",
    siteUrl: "https://allafrica.com/ethiopia/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "newbusinessethiopia",
    name: "New Business Ethiopia",
    feedUrl: "https://newbusinessethiopia.com/feed/",
    siteUrl: "https://newbusinessethiopia.com/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "ethiopia-insight",
    name: "Ethiopia Insight",
    feedUrl: "https://www.ethiopia-insight.com/feed/",
    siteUrl: "https://www.ethiopia-insight.com/",
    language: "en",
    region: "ethiopia",
  },
  {
    id: "allafrica-kenya",
    name: "AllAfrica: Kenya",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/kenya/headlines.rdf",
    siteUrl: "https://allafrica.com/kenya/",
    language: "en",
    region: "east-africa",
  },
  {
    id: "allafrica-somalia",
    name: "AllAfrica: Somalia",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/somalia/headlines.rdf",
    siteUrl: "https://allafrica.com/somalia/",
    language: "en",
    region: "east-africa",
  },
  {
    id: "allafrica-sudan",
    name: "AllAfrica: Sudan",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/sudan/headlines.rdf",
    siteUrl: "https://allafrica.com/sudan/",
    language: "en",
    region: "east-africa",
  },
  {
    id: "allafrica-eritrea",
    name: "AllAfrica: Eritrea",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/eritrea/headlines.rdf",
    siteUrl: "https://allafrica.com/eritrea/",
    language: "en",
    region: "east-africa",
  },
  {
    id: "allafrica-eastafrica",
    name: "AllAfrica: East Africa",
    feedUrl: "https://allafrica.com/tools/headlines/rdf/eastafrica/headlines.rdf",
    siteUrl: "https://allafrica.com/eastafrica/",
    language: "en",
    region: "east-africa",
  },
];
