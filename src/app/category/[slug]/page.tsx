import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadMoreGrid } from "@/components/LoadMoreGrid";
import { getArticles } from "@/lib/fetchNews";
import { CATEGORIES, type CategorySlug } from "@/lib/types";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";

export const revalidate = 0;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORIES.some((category) => category.slug === slug);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const label = CATEGORIES.find((category) => category.slug === slug)!.label;
  const { articles, fetchedAt, stale } = await getArticles();
  const filtered = articles.filter((article) => article.category === slug);

  return (
    <>
      <Header active={slug} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">{label}</h1>
          <p className="text-xs text-muted">
            {strings.home.updatedPrefix} {relativeTime(new Date(fetchedAt).toISOString())}
            {stale && ` · ${strings.home.staleNote}`}
          </p>
        </div>
        <LoadMoreGrid articles={filtered} />
      </main>
      <Footer />
    </>
  );
}
