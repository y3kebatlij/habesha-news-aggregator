import { strings } from "@/lib/strings";

export function SearchForm() {
  return (
    <form action="/search" className="flex items-center">
      <input
        type="search"
        name="q"
        placeholder={strings.search.placeholder}
        aria-label={strings.search.submitLabel}
        className="w-32 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-foreground placeholder:text-muted focus:w-48 focus:outline-none focus:ring-2 focus:ring-brand-green/50 sm:w-40 sm:focus:w-56"
      />
    </form>
  );
}
