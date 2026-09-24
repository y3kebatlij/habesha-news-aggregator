import Link from "next/link";
import { CategoryNav } from "./CategoryNav";
import { ThemeToggle } from "./ThemeToggle";
import { SearchForm } from "./SearchForm";
import { strings } from "@/lib/strings";
import type { CategorySlug } from "@/lib/types";

export function Header({
  active,
  query,
}: {
  // Omitted on pages that aren't a nav section (e.g. search), so no pill is highlighted.
  active?: CategorySlug | "all" | "east-africa";
  query?: string;
}) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl 2xl:max-w-[1440px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-2 overflow-hidden rounded-sm">
              <span className="h-full w-full bg-brand-green" />
              <span className="h-full w-full bg-brand-yellow" />
              <span className="h-full w-full bg-brand-red" />
            </span>
            <span className="text-xl font-bold tracking-tight">{strings.siteName}</span>
            <span className="hidden text-sm text-muted sm:inline">{strings.tagline}</span>
          </Link>
          <div className="flex items-center gap-3">
            <SearchForm defaultValue={query} />
            <ThemeToggle />
          </div>
        </div>
        <CategoryNav active={active} />
      </div>
    </header>
  );
}
