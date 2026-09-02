import type { Article } from "@/lib/types";
import { strings } from "@/lib/strings";

export function BreakingBanner({ article }: { article: Article }) {
  return (
    <a
      href="#lead-story"
      className="block bg-brand-red px-4 py-2 text-center text-sm font-medium text-white transition-opacity hover:opacity-90 sm:px-6"
    >
      <span className="font-bold uppercase tracking-wide">{strings.breaking.bannerPrefix}:</span>{" "}
      <span className="line-clamp-1 align-middle">{article.title}</span>
    </a>
  );
}
