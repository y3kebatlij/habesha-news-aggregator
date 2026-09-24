"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";
import { NewsGrid } from "./NewsGrid";
import { strings } from "@/lib/strings";

// 12 fills complete rows at every column count the grid uses (2, 3 and 4).
const PAGE_SIZE = 12;

export function LoadMoreGrid({ articles }: { articles: Article[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <>
      <NewsGrid articles={articles.slice(0, visibleCount)} />
      {visibleCount < articles.length && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full border border-border bg-surface px-5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand-green/60"
          >
            {strings.grid.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
