import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoadMoreGrid } from "@/components/LoadMoreGrid";
import { getArticles } from "@/lib/fetchNews";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";

export const revalidate = 0;

export default async function EastAfricaPage() {
  const { articles, fetchedAt, stale } = await getArticles();
  const filtered = articles.filter((article) => article.region === "east-africa");

  return (
    <>
      <Header active="east-africa" />
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">{strings.eastAfrica.heading}</h1>
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
