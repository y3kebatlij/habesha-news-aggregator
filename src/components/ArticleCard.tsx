import { CATEGORIES, type Article } from "@/lib/types";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";

export function ArticleCard({
  article,
  variant = "grid",
  isBreaking = false,
  id,
}: {
  article: Article;
  variant?: "grid" | "hero";
  isBreaking?: boolean;
  id?: string;
}) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? "General";
  const isHero = variant === "hero";

  return (
    <a
      id={id}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md ${
        isHero ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-brand-green/15 via-brand-yellow/15 to-brand-red/15 ${
          isHero ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/9]"
        }`}
      >
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
        <span className="absolute left-2 top-2 flex gap-1.5">
          {isBreaking && (
            <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {strings.breaking.pill}
            </span>
          )}
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {categoryLabel}
          </span>
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-2 p-4 ${isHero ? "justify-center md:p-6" : ""}`}>
        <h3
          className={`leading-snug text-foreground group-hover:text-brand-green ${
            isHero ? "line-clamp-4 text-2xl font-bold md:text-3xl" : "line-clamp-3 text-base font-semibold"
          }`}
        >
          {article.title}
        </h3>
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
              <span>{strings.languageTag.am}</span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
