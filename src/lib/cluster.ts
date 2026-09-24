import type { Article } from "./types";

// Groups articles that are plausibly "the same story" covered by different
// outlets, so rank.ts can use real cross-source coverage as a breaking
// signal instead of only keyword-matching the title. See ARCHITECTURE.md
// "Explicitly deferred to v1.5: cross-source story clustering" — this is
// that feature.
const CLUSTER_WINDOW_HOURS = 48;
const SIMILARITY_THRESHOLD = 0.5;

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "in", "on", "at", "to", "for",
  "with", "by", "from", "as", "is", "are", "was", "were", "be", "been",
  "it", "its", "this", "that", "after", "over", "amid", "new", "says",
  "say", "said", "will", "has", "have", "had", "not", "into", "out",
]);

function tokenize(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return intersection / union;
}

export type Cluster = {
  articles: Article[];
  sourceCount: number;
};

export function clusterArticles(articles: Article[], now: number = Date.now()): Cluster[] {
  const windowMs = CLUSTER_WINDOW_HOURS * 60 * 60 * 1000;
  const recent = articles.filter((article) => {
    if (!article.pubDate) return false;
    const publishedAt = new Date(article.pubDate).getTime();
    return !Number.isNaN(publishedAt) && now - publishedAt <= windowMs;
  });

  const tokensById = new Map(recent.map((article) => [article.id, tokenize(article.title)]));
  const assigned = new Set<string>();
  const clusters: Cluster[] = [];

  for (const article of recent) {
    if (assigned.has(article.id)) continue;
    assigned.add(article.id);
    const group = [article];
    const tokens = tokensById.get(article.id)!;

    for (const candidate of recent) {
      if (assigned.has(candidate.id)) continue;
      const candidateTokens = tokensById.get(candidate.id)!;
      if (jaccardSimilarity(tokens, candidateTokens) >= SIMILARITY_THRESHOLD) {
        group.push(candidate);
        assigned.add(candidate.id);
      }
    }

    clusters.push({ articles: group, sourceCount: new Set(group.map((a) => a.sourceId)).size });
  }

  return clusters;
}

// Convenience lookup: article id -> how many distinct sources are covering
// the same story (1 for an article with no matches in the recent window).
export function clusterSourceCountById(articles: Article[], now: number = Date.now()): Map<string, number> {
  const map = new Map<string, number>();
  for (const cluster of clusterArticles(articles, now)) {
    for (const article of cluster.articles) {
      map.set(article.id, cluster.sourceCount);
    }
  }
  return map;
}
