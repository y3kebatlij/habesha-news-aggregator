import type { Article } from "./types";

const HALF_LIFE_HOURS = 8;
const BREAKING_BONUS = 25;
const HERO_WINDOW = 6;

const BREAKING_KEYWORDS = ["breaking", "urgent", "developing", "just in", "alert"];

function recencyScore(pubDate: string | null, now: number): number {
  if (!pubDate) return 0;

  const published = new Date(pubDate).getTime();
  if (Number.isNaN(published)) return 0;

  const ageHours = Math.max(0, (now - published) / (60 * 60 * 1000));
  return 100 * Math.pow(0.5, ageHours / HALF_LIFE_HOURS);
}

export function isBreakingTitle(title: string): boolean {
  const lower = title.toLowerCase();
  return BREAKING_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function keywordScore(title: string): number {
  return isBreakingTitle(title) ? BREAKING_BONUS : 0;
}

export function scoreArticle(article: Article, now: number = Date.now()): number {
  return recencyScore(article.pubDate, now) + keywordScore(article.title);
}

// Hero window enforces one-article-per-source so a single prolific outlet can't
// camp every top slot even if it scores highest; the rest stays in score order.
export function rankArticles(
  articles: Article[],
  { now = Date.now(), heroWindow = HERO_WINDOW }: { now?: number; heroWindow?: number } = {},
): Article[] {
  const byScoreDesc = [...articles].sort((a, b) => scoreArticle(b, now) - scoreArticle(a, now));

  if (byScoreDesc.length <= heroWindow) return byScoreDesc;

  const hero: Article[] = [];
  const deferred: Article[] = [];
  const usedSources = new Set<string>();

  for (const article of byScoreDesc) {
    if (hero.length < heroWindow && !usedSources.has(article.sourceId)) {
      hero.push(article);
      usedSources.add(article.sourceId);
    } else {
      deferred.push(article);
    }
  }

  // Too few distinct sources to fill the hero window without repeats —
  // backfill from the highest-scoring leftovers rather than leave it short.
  while (hero.length < heroWindow && deferred.length > 0) {
    hero.push(deferred.shift()!);
  }

  return [...hero, ...deferred];
}
