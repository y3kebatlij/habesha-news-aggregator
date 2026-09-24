import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadMoreGrid } from "@/components/LoadMoreGrid";
import { getArticles } from "@/lib/fetchNews";
import { searchArticles } from "@/lib/search";
import { strings } from "@/lib/strings";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const { articles } = await getArticles();
  const results = query ? searchArticles(articles, query) : [];

  return (
    <>
      <Header query={query} />
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">
            {query ? strings.search.resultsHeading(query) : strings.search.heading}
          </h1>
        </div>
        {query ? (
          <LoadMoreGrid key={query} articles={results} />
        ) : (
          <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted">
            {strings.search.prompt}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
