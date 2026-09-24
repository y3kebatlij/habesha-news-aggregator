import { CATEGORIES, type Article } from "@/lib/types";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";
import { SOURCES } from "@/lib/sources";

export function ArticleCard({
  article,
  variant = "grid",
  isBreaking = false,
  sourceCount,
  id,
}: {
  article: Article;
  variant?: "grid" | "hero";
  isBreaking?: boolean;
  sourceCount?: number;
  id?: string;
}) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? "General";
  const isHero = variant === "hero";
  // A hero with no image drops the picture column entirely — half the lead
  // story's width as an empty placeholder looks broken on laptop/desktop.
  const isTextHero = isHero && !article.image;
  const isStateAffiliated =
    SOURCES.find((s) => s.id === article.sourceId)?.transparency === "state-affiliated";

  return (
    <a
      id={id}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-md ${
        isHero && !isTextHero ? "flex-col md:flex-row" : "flex-col"
      }`}
    >
      {isTextHero && (
        <span aria-hidden className="flex h-1.5 w-full shrink-0">
          <span className="flex-1 bg-brand-green" />
          <span className="flex-1 bg-brand-yellow" />
          <span className="flex-1 bg-brand-red" />
        </span>
      )}
      <div
        className={`relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-brand-green/15 via-brand-yellow/15 to-brand-red/15 ${
          isTextHero
            ? "hidden"
            : isHero
              ? "aspect-[16/9] md:aspect-auto md:min-h-72 md:w-1/2"
              : "aspect-[16/9]"
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
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-lg font-semibold tracking-tight text-foreground/50">
            {article.sourceName}
          </div>
        )}
        <span className="absolute left-2 top-2 flex gap-1.5">
          {isBreaking && (
            <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {strings.breaking.pill}
            </span>
          )}
          {sourceCount !== undefined && sourceCount >= 3 && (
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {strings.cluster.coveredBy(sourceCount)}
            </span>
          )}
          <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {categoryLabel}
          </span>
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col gap-2 p-4 ${isHero ? "justify-center md:p-6" : ""} ${
          isTextHero ? "md:px-8 md:py-8" : ""
        }`}
      >
        {isTextHero && (
          <span className="flex flex-wrap gap-1.5">
            {isBreaking && (
              <span className="rounded-full bg-brand-red px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {strings.breaking.pill}
              </span>
            )}
            {sourceCount !== undefined && sourceCount >= 3 && (
              <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground">
                {strings.cluster.coveredBy(sourceCount)}
              </span>
            )}
            <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-xs font-medium text-foreground">
              {categoryLabel}
            </span>
          </span>
        )}
        <h3
          lang={article.language}
          className={`leading-snug text-foreground group-hover:text-brand-green ${
            isHero
              ? `line-clamp-4 text-2xl font-bold md:text-3xl ${isTextHero ? "max-w-4xl xl:text-4xl" : ""}`
              : "line-clamp-3 text-base font-semibold"
          }`}
        >
          {article.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 whitespace-nowrap pt-1 text-xs text-muted">
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
          {isStateAffiliated && (
            <>
              <span aria-hidden>·</span>
              <span
                className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                title={strings.footer.transparencyDisclaimer}
              >
                {strings.transparency["state-affiliated"]}
              </span>
            </>
          )}
        </div>
      </div>
    </a>
  );
}
