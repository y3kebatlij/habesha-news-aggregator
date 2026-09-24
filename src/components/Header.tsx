import Link from "next/link";
import { CategoryNav } from "./CategoryNav";
import { ThemeToggle } from "./ThemeToggle";
import { strings } from "@/lib/strings";
import type { CategorySlug } from "@/lib/types";

export function Header({ active }: { active: CategorySlug | "all" | "east-africa" }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
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
          <ThemeToggle />
        </div>
        <CategoryNav active={active} />
      </div>
    </header>
  );
}
