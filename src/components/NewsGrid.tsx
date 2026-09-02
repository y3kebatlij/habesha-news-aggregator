import type { Article } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { strings } from "@/lib/strings";

export function NewsGrid({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted">
        {strings.grid.empty}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
