import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreakingBanner } from "@/components/BreakingBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { LoadMoreGrid } from "@/components/LoadMoreGrid";
import { getArticles } from "@/lib/fetchNews";
import { rankArticles, isBreakingArticle } from "@/lib/rank";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";

export const revalidate = 0;

export default async function HomePage() {
  const { articles, fetchedAt, stale } = await getArticles();
  const { articles: ranked, clusterSourceCountById } = rankArticles(
    articles.filter((article) => article.region === "ethiopia"),
  );
  const [lead, ...rest] = ranked;
  const leadSourceCount = lead ? clusterSourceCountById.get(lead.id) ?? 1 : 1;
  const leadIsBreaking = lead ? isBreakingArticle(lead, leadSourceCount) : false;

  return (
    <>
      {leadIsBreaking && lead && <BreakingBanner article={lead} />}
      <Header active="all" />
      <main className="mx-auto w-full max-w-7xl 2xl:max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">{strings.home.heading}</h1>
          <p className="text-xs text-muted">
            {strings.home.updatedPrefix} {relativeTime(new Date(fetchedAt).toISOString())}
            {stale && ` · ${strings.home.staleNote}`}
          </p>
        </div>
        {lead && (
          <div className="mb-6">
            <ArticleCard
              article={lead}
              variant="hero"
              isBreaking={leadIsBreaking}
              sourceCount={leadSourceCount}
              id="lead-story"
            />
          </div>
        )}
        <LoadMoreGrid articles={rest} />
      </main>
      <Footer />
    </>
  );
}
