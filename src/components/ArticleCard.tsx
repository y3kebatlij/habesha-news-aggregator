import { CATEGORIES, type Article } from "@/lib/types";
import { relativeTime } from "@/lib/time";

export function ArticleCard({ article }: { article: Article }) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? "General";

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-brand-green/15 via-brand-yellow/15 to-brand-red/15">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted">
            {article.sourceName}
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-3 text-base font-semibold leading-snug text-foreground group-hover:text-brand-green">
          {article.title}
        </h3>
        {article.snippet && (
          <p className="line-clamp-2 text-sm text-muted">{article.snippet}</p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted">
          <span className="font-medium text-foreground/80">{article.sourceName}</span>
          {article.pubDate && (
            <>
              <span aria-hidden>·</span>
              <span>{relativeTime(article.pubDate)}</span>
            </>
          )}
          {article.language === "am" && (
            <>
              <span aria-hidden>·</span>
              <span>አማርኛ</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
