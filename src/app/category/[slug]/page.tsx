import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";
import { getArticles } from "@/lib/fetchNews";
import { CATEGORIES, type CategorySlug } from "@/lib/types";
import { relativeTime } from "@/lib/time";

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
            Updated {relativeTime(new Date(fetchedAt).toISOString())}
            {stale && " · showing cached results, a source may be unreachable"}
          </p>
        </div>
        <NewsGrid articles={filtered} />
      </main>
      <Footer />
    </>
  );
}
