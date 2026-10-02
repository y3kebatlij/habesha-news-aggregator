import Parser from "rss-parser";
import { SOURCES } from "./sources";
import { categorize } from "./categorize";
import { hashId, truncate } from "./text";
import { classifyBroadArticle } from "./ethiopiaFilter";
import { fetchWorldNewsArticles } from "./worldNews";
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
// Plain, honest bot UA. Some WAFs (e.g. Borkena's) block the
// "Mozilla/5.0 (compatible; ...)" crawler pattern but allow this.
const USER_AGENT = "HabeshaNewsAggregator/1.0 (+https://habesha-news-aggregator.vercel.app)";

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

// Each source's articles from its last successful fetch. When one source fails
// (a timeout, a 5xx, a WAF hiccup), its previous articles are served instead,
// so it doesn't vanish from the site until its next good fetch. In-memory like
// `cache`, so it only helps a server instance that has fetched before.
const lastGoodBySource = new Map<string, Article[]>();

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
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

// The fields every feed format is reduced to before becoming an Article.
type RawItem = {
  title: string;
  link: string;
  snippet: string;
  image: string | null;
  pubDate: string | null;
};

// WordPress REST API post, trimmed to the `_fields` requested in sources.ts.
type WordPressPost = {
  link?: string;
  date_gmt?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  yoast_head_json?: { og_image?: { url?: string }[] };
};

function parseWordPress(body: string): RawItem[] {
  const posts = JSON.parse(body) as WordPressPost[];
  return posts
    .filter((post) => post.title?.rendered && post.link)
    .map((post) => ({
      title: stripHtml(post.title!.rendered!),
      link: post.link!,
      snippet: stripHtml(post.excerpt?.rendered ?? ""),
      image: post.yoast_head_json?.og_image?.[0]?.url ?? null,
      // date_gmt carries no zone suffix; without "Z" it would parse as local time.
      pubDate: post.date_gmt ? `${post.date_gmt}Z` : null,
    }));
}

async function parseRss(body: string): Promise<RawItem[]> {
  const feed = await parser.parseString(body);
  return (feed.items ?? [])
    .filter((item) => item.title && item.link)
    .map((item) => ({
      title: decodeEntities(item.title!.trim()),
      link: item.link!,
      snippet: stripHtml(
        item.contentSnippet ?? stripHtml(item["content:encoded"] ?? item.content ?? "")
      ),
      image: extractImage(item),
      pubDate: item.isoDate ?? item.pubDate ?? null,
    }));
}

async function fetchSourceArticles(source: (typeof SOURCES)[number]): Promise<Article[]> {
  const response = await fetch(source.feedUrl, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(source.timeoutMs ?? FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${source.feedUrl}`);
  const body = await response.text();
  const items = source.format === "wordpress" ? parseWordPress(body) : await parseRss(body);

  const articles = items.map((item) => {
    const snippet = truncate(item.snippet, 220);
    return {
      id: hashId(item.link),
      title: item.title,
      link: item.link,
      snippet,
      image: item.image,
      pubDate: item.pubDate,
      sourceId: source.id,
      sourceName: source.name,
      sourceUrl: source.siteUrl,
      language: source.language,
      category: source.category ?? categorize(item.title, snippet),
      region: source.region,
    } satisfies Article;
  });

  if (source.scope === "africa-broad") {
    return articles.flatMap((article) => {
      const region = classifyBroadArticle(article.title, article.snippet);
      return region ? [{ ...article, region }] : [];
    });
  }

  return articles;
}

async function fetchAllArticles(): Promise<Article[]> {
  const [results, apiArticles] = await Promise.all([
    Promise.allSettled(SOURCES.map(fetchSourceArticles)),
    fetchWorldNewsArticles(),
  ]);

  const cutoff = Date.now() - MAX_ARTICLE_AGE_MS;
  const seenIds = new Set<string>();
  const articles = results
    .flatMap((result, index) => {
      const source = SOURCES[index];
      if (result.status === "fulfilled") {
        lastGoodBySource.set(source.id, result.value);
        return result.value;
      }
      const fallback = lastGoodBySource.get(source.id) ?? [];
      console.error(
        `Failed to fetch feed for ${source.name}, serving ${fallback.length} previous articles:`,
        result.reason
      );
      return fallback;
    })
    .concat(apiArticles)
    .filter((article) => {
      // Two API queries (or a feed and the API) can return the same link.
      if (seenIds.has(article.id)) return false;
      seenIds.add(article.id);
      return true;
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
