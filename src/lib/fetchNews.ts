import Parser from "rss-parser";
import { SOURCES } from "./sources";
import { categorize } from "./categorize";
import { mentionsEthiopia } from "./ethiopiaFilter";
import type { Article } from "./types";

type FeedItem = {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  "content:encoded"?: string;
  enclosure?: { url?: string };
  "media:content"?: { $?: { url?: string } } | { $?: { url?: string } }[];
  "media:thumbnail"?: { $?: { url?: string } };
};

const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = "Mozilla/5.0 (compatible; HabeshaNewsAggregator/1.0; +https://localhost)";

// Feeds are downloaded with fetch() rather than rss-parser's parseURL():
// some servers (e.g. Capital Ethiopia) gzip the response even when not asked
// to, which parseURL can't decode. fetch() decompresses automatically.
const parser = new Parser<Record<string, unknown>, FeedItem>({
  customFields: {
    item: [
      ["content:encoded", "content:encoded"],
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
    ],
  },
});

const CACHE_TTL_MS = 15 * 60 * 1000;

// Some feeds keep months-old items (BBC Amharic, Athletics Africa's archive),
// which would otherwise appear alongside today's news. Undated items are kept
// since there's no way to tell their age.
const MAX_ARTICLE_AGE_MS = 30 * 24 * 60 * 60 * 1000;

let cache: { articles: Article[]; fetchedAt: number } | null = null;
let inFlight: Promise<Article[]> | null = null;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function extractImage(item: FeedItem): string | null {
  if (item.enclosure?.url) return item.enclosure.url;

  const media = item["media:content"];
  if (media) {
    const first = Array.isArray(media) ? media[0] : media;
    if (first?.$?.url) return first.$.url;
  }

  const thumbnail = item["media:thumbnail"];
  if (thumbnail?.$?.url) return thumbnail.$.url;

  const html = item["content:encoded"] ?? item.content ?? "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function hashId(link: string): string {
  let hash = 0;
  for (let i = 0; i < link.length; i++) {
    hash = (hash * 31 + link.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

async function fetchSourceArticles(source: (typeof SOURCES)[number]): Promise<Article[]> {
  const response = await fetch(source.feedUrl, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${source.feedUrl}`);
  const feed = await parser.parseString(await response.text());

  const articles = (feed.items ?? [])
    .filter((item) => item.title && item.link)
    .map((item) => {
      const rawSnippet =
        item.contentSnippet ?? stripHtml(item["content:encoded"] ?? item.content ?? "");
      const snippet = truncate(stripHtml(rawSnippet), 220);
      const title = item.title!.trim();

      return {
        id: hashId(item.link!),
        title,
        link: item.link!,
        snippet,
        image: extractImage(item),
        pubDate: item.isoDate ?? item.pubDate ?? null,
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.siteUrl,
        language: source.language,
        category: source.category ?? categorize(title, snippet),
        region: source.region,
      } satisfies Article;
    });

  if (source.scope === "africa-broad") {
    return articles.filter((article) => mentionsEthiopia(`${article.title} ${article.snippet}`));
  }

  return articles;
}

async function fetchAllArticles(): Promise<Article[]> {
  const results = await Promise.allSettled(SOURCES.map(fetchSourceArticles));

  const cutoff = Date.now() - MAX_ARTICLE_AGE_MS;
  const articles = results
    .flatMap((result, index) => {
      if (result.status === "fulfilled") return result.value;
      console.error(`Failed to fetch feed for ${SOURCES[index].name}:`, result.reason);
      return [];
    })
    .filter((article) => {
      const published = article.pubDate ? new Date(article.pubDate).getTime() : NaN;
      return Number.isNaN(published) || published >= cutoff;
    });

  articles.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return dateB - dateA;
  });

  return articles;
}

export async function getArticles(): Promise<{ articles: Article[]; fetchedAt: number; stale: boolean }> {
  const now = Date.now();
  const isFresh = cache && now - cache.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return { articles: cache!.articles, fetchedAt: cache!.fetchedAt, stale: false };
  }

  if (!inFlight) {
    inFlight = fetchAllArticles().finally(() => {
      inFlight = null;
    });
  }

  try {
    const articles = await inFlight;
    cache = { articles, fetchedAt: Date.now() };
    return { articles, fetchedAt: cache.fetchedAt, stale: false };
  } catch (error) {
    if (cache) {
      console.error("Refetch failed, serving stale cache:", error);
      return { articles: cache.articles, fetchedAt: cache.fetchedAt, stale: true };
    }
    throw error;
  }
}
