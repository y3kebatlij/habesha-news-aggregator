import Link from "next/link";
import { strings } from "@/lib/strings";
import { CATEGORIES, type CategorySlug } from "@/lib/types";

// "General" is a catch-all, not a real interest — dropped from nav, but the
// category itself still exists (articles still land there, still reachable
// at /category/general). See ARCHITECTURE.md "UI decisions".
const NAV_CATEGORIES = CATEGORIES.filter((category) => category.slug !== "general");

export function CategoryNav({ active }: { active?: CategorySlug | "all" | "east-africa" }) {
  return (
    <nav className="-mx-4 -my-1 flex gap-2 overflow-x-auto px-4 py-1 sm:-mx-1 sm:flex-wrap sm:px-1">
      <NavPill href="/" label={strings.nav.all} isActive={active === "all"} />
      {NAV_CATEGORIES.map((category) => (
        <NavPill
          key={category.slug}
          href={`/category/${category.slug}`}
          label={category.label}
          isActive={active === category.slug}
        />
      ))}
      <NavPill
        href="/region/east-africa"
        label={strings.nav.eastAfrica}
        isActive={active === "east-africa"}
      />
    </nav>
  );
}

function NavPill({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-brand-green bg-brand-green text-white"
          : "border-border bg-surface text-foreground hover:border-brand-green/60"
      }`}
    >
      {label}
    </Link>
  );
}
