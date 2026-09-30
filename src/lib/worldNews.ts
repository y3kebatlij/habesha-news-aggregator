import { SOURCES } from "./sources";
import { categorize } from "./categorize";
import { hashId, truncate } from "./text";
import type { Article, CategorySlug } from "./types";

// World News API (worldnewsapi.com) fills gaps the RSS sources can't: Ethiopian
// publishers without a usable feed, and diaspora coverage scattered across
// outlets we don't follow. Disabled unless WORLD_NEWS_API_KEY is set.
//
// The free plan allows 50 points/day (1 point per request plus a fraction per
// article returned) and requires a visible link back to worldnewsapi.com —
// see Footer. Responses go through Next's shared data cache for
// REVALIDATE_SECONDS, so the call count stays fixed however many visitors or
// server instances there are: 2 queries × 12 refreshes/day ≈ 29 points.
const API_URL = "https://api.worldnewsapi.com/search-news";
const REVALIDATE_SECONDS = 2 * 60 * 60;
const ARTICLES_PER_QUERY = 20;
const FETCH_TIMEOUT_MS = 10_000;

export const WORLD_NEWS_SOURCE_ID = "worldnewsapi";

type Query = {
  params: Record<string, string>;
  // Pinned for single-topic queries, like a source's `category`.
  category?: CategorySlug;
};

const QUERIES: Query[] = [
  // Everything published in Ethiopia, in English.
  { params: { "source-country": "et", language: "en" } },
  { params: { text: '"Ethiopian diaspora"', language: "en" }, category: "diaspora" },
];

type WorldNewsItem = {
  title?: string;
  url?: string;
  summary?: string;
  text?: string;
  image?: string | null;
  publish_date?: string;
  language?: string;
};

// Publishers we already read directly — their stories would otherwise appear
// twice, once from the feed and once from the API.
const COVERED_HOSTS = new Set(SOURCES.map((source) => hostname(source.siteUrl)));

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}



async function runQuery(apiKey: string, query: Query): Promise<Article[]> {
  const params = new URLSearchParams({
    ...query.params,
    sort: "publish-time",
    "sort-direction": "DESC",
    number: String(ARTICLES_PER_QUERY),
  });
  const response = await fetch(`${API_URL}?${params}`, {
    headers: { "x-api-key": apiKey },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from World News API`);
  const { news = [] } = (await response.json()) as { news?: WorldNewsItem[] };

  return news
    .filter((item) => item.title && item.url && !COVERED_HOSTS.has(hostname(item.url)))
    .map((item) => {
      const title = item.title!.trim();
      const snippet = truncate((item.summary || item.text || "").replace(/\s+/g, " ").trim(), 220);
      const host = hostname(item.url!);
      return {
        id: hashId(item.url!),
        title,
        link: item.url!,
        snippet,
        image: item.image || null,
        // "2026-09-29 12:00:00" is UTC but has no zone marker.
        pubDate: item.publish_date ? `${item.publish_date.replace(" ", "T")}Z` : null,
        sourceId: WORLD_NEWS_SOURCE_ID,
        sourceName: host,
        sourceUrl: `https://${host}/`,
        language: "en",
        category: query.category ?? categorize(title, snippet),
        region: "ethiopia",
      } satisfies Article;
    });
}

export function isWorldNewsEnabled(): boolean {
  return Boolean(process.env.WORLD_NEWS_API_KEY);
}

export async function fetchWorldNewsArticles(): Promise<Article[]> {
  const apiKey = process.env.WORLD_NEWS_API_KEY;
  if (!apiKey) return [];

  const results = await Promise.allSettled(QUERIES.map((query) => runQuery(apiKey, query)));
  return results.flatMap((result) => {
    if (result.status === "fulfilled") return result.value;
    console.error("Failed to fetch World News API query:", result.reason);
    return [];
  });
}
