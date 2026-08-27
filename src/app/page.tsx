import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsGrid } from "@/components/NewsGrid";
import { getArticles } from "@/lib/fetchNews";
import { rankArticles } from "@/lib/rank";
import { relativeTime } from "@/lib/time";

export const revalidate = 0;

export default async function HomePage() {
  const { articles, fetchedAt, stale } = await getArticles();
  const ranked = rankArticles(articles);

  return (
    <>
      <Header active="all" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">Latest headlines</h1>
          <p className="text-xs text-muted">
            Updated {relativeTime(new Date(fetchedAt).toISOString())}
            {stale && " · showing cached results, a source may be unreachable"}
          </p>
        </div>
        <NewsGrid articles={ranked} />
      </main>
      <Footer />
    </>
  );
}
