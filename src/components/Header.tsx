import Link from "next/link";
import { CategoryNav } from "./CategoryNav";
import type { CategorySlug } from "@/lib/types";

export function Header({ active }: { active: CategorySlug | "all" }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-2 overflow-hidden rounded-sm">
            <span className="h-full w-full bg-brand-green" />
            <span className="h-full w-full bg-brand-yellow" />
            <span className="h-full w-full bg-brand-red" />
          </span>
          <span className="text-xl font-bold tracking-tight">Habesha News</span>
          <span className="hidden text-sm text-muted sm:inline">
            Ethiopian news, all in one place
          </span>
        </Link>
        <CategoryNav active={active} />
      </div>
    </header>
  );
}
