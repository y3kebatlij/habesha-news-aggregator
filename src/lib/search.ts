import type { Article } from "./types";

// Searches only whatever's in the current in-memory fetch cache (~15 min of
// recent articles), not a historical archive — see ARCHITECTURE.md's v2
// roadmap for a real persisted/indexed search. Good enough for "what's being
// said about X right now."
export function searchArticles(articles: Article[], query: string): Article[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const terms = trimmed.split(/\s+/).filter(Boolean);

  return articles
    .map((article) => {
      const title = article.title.toLowerCase();
      const snippet = article.snippet.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 2;
        if (snippet.includes(term)) score += 1;
      }

      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);
}
