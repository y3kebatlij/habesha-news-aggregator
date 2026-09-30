# Habesha News

An Ethiopian news aggregator. It pulls live RSS feeds from Ethiopian (and
Ethiopia-focused) publishers, auto-sorts stories into categories, and links
out to the original source for the full article.

## Running it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional API keys

The site works with no keys. Set these (in `.env.local`, or Vercel →
Project → Settings → Environment Variables) to switch on extra sources:

- `WORLD_NEWS_API_KEY` — [World News API](https://worldnewsapi.com/) free
  plan. Adds articles from Ethiopian publishers (`source-country=et`) and
  "Ethiopian diaspora" coverage. Refreshed every 2 hours to stay inside the
  free plan's 50 points/day; the footer backlink the plan requires appears
  automatically.
- `OPENEXCHANGERATES_APP_ID` — [Open Exchange Rates](https://openexchangerates.org/)
  free plan, used as the international baseline in the Business & Economy
  exchange-rate tracker (hourly updates, ~720 of the 1,000 monthly requests).
  Without it the tracker falls back to ExchangeRate-API's keyless daily rates.

The exchange-rate tracker's official rates (Commercial Bank of Ethiopia) and
parallel-market rates (EthioBlackMarket) need no keys.

## How it works

- `src/lib/sources.ts` — the list of RSS feeds. Add a publisher by adding an
  entry here (needs `feedUrl`, `siteUrl`, and `language`).
- `src/lib/fetchNews.ts` — fetches all feeds in parallel, normalizes items
  into `Article`s, and caches the result in memory for 15 minutes so page
  loads don't re-hit every feed. If a refetch fails, it falls back to the
  last good cache instead of erroring.
- `src/lib/categorize.ts` — keyword-based classifier that buckets each
  article into Politics, Business & Economy, Sports, Fashion & Lifestyle,
  Technology, Diaspora & World, or General.
- `src/app/page.tsx` and `src/app/category/[slug]/page.tsx` — the homepage
  (all articles) and per-category pages.

## Current sources

Fana Media Corporation, Capital Ethiopia, Addis Fortune, Ethiopian Monitor,
BBC Amharic, Shega, AllAfrica (Ethiopia), New Business Ethiopia, Ethiopia
Insight, and Borkena (via its WordPress REST API, as its RSS feed is off). Addis Standard, The Reporter Ethiopia, Ezega News, VOA Amharic, and
Zehabesha all publish feeds too, but block automated fetches (403s, Cloudflare
challenge) — worth retrying later or swapping in a scraper if you want them
included.

## Known limitations / next steps

- Categorization is keyword-based on English text, so Amharic-language
  articles (BBC Amharic) mostly land in "General" — a real fix needs
  Amharic keyword lists or an AI classification pass.
- No persistence: the article cache is in-memory and resets on server
  restart. Fine for local dev; a deployed version would want a small DB or
  KV store instead.
- No search yet.
- Not deployed. When ready, it's a standard Next.js app — Vercel is the
  path of least resistance (`vercel deploy`), with feed refresh handled via
  Vercel Cron hitting a route that calls `getArticles()`.
