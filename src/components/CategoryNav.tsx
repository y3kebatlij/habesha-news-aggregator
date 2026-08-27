import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/lib/types";

export function CategoryNav({ active }: { active: CategorySlug | "all" }) {
  return (
    <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      <NavPill href="/" label="All" isActive={active === "all"} />
      {CATEGORIES.map((category) => (
        <NavPill
          key={category.slug}
          href={`/category/${category.slug}`}
          label={category.label}
          isActive={active === category.slug}
        />
      ))}
    </nav>
  );
}

function NavPill({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
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
