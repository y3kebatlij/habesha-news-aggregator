// Birr exchange-rate tracker data: the official rate (Commercial Bank of
// Ethiopia), the parallel ("black") market rate, and an international
// baseline. Every rate is expressed as birr per one unit of foreign currency.

export const TRACKED_CURRENCIES = ["USD", "EUR", "GBP"] as const;
export type CurrencyCode = (typeof TRACKED_CURRENCIES)[number];

export type CurrencyRow = {
  code: CurrencyCode;
  officialBuying: number | null;
  officialSelling: number | null;
  baseline: number | null;
  parallel: number | null;
};

export type FxSnapshot = {
  rows: CurrencyRow[];
  officialDate: string | null;
  parallelChangePct: number | null;
  baselineProvider: "openexchangerates" | "exchangerate-api" | null;
  fetchedAt: number;
  failed: ("official" | "parallel" | "baseline")[];
};

const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT = "HabeshaNewsAggregator/1.0 (+https://habesha-news-aggregator.vercel.app)";

// CBE publishes once each business morning; the parallel rate moves all day.
const OFFICIAL_TTL_MS = 60 * 60 * 1000;
const PARALLEL_TTL_MS = 15 * 60 * 1000;

// ---------- Official: Commercial Bank of Ethiopia ----------

// CBE's public site is backed by this Strapi endpoint; this asks for just the
// most recent day's table.
const CBE_URL = "https://combanketh.et/cbeapi/daily-exchange-rates/?_limit=1&_sort=Date%3ADESC";

type CbeDay = {
  Date: string;
  ExchangeRate: {
    transactionalBuying: number | null;
    transactionalSelling: number | null;
    currency: { CurrencyCode: string };
  }[];
};

type OfficialRates = {
  date: string;
  rates: Map<string, { buying: number; selling: number }>;
};

async function fetchOfficial(): Promise<OfficialRates> {
  const [day] = (await getJson(CBE_URL)) as CbeDay[];
  if (!day) throw new Error("CBE returned no exchange-rate table");
  return {
    date: day.Date,
    rates: new Map(
      day.ExchangeRate.filter((rate) => rate.transactionalBuying && rate.transactionalSelling).map(
        (rate) => [
          rate.currency.CurrencyCode,
          { buying: rate.transactionalBuying!, selling: rate.transactionalSelling! },
        ]
      )
    ),
  };
}

// ---------- Parallel market: EthioBlackMarket ----------

// ethioblackmarket.com's documented public API (rate limit 5,000 requests per
// 15 minutes per IP; we make ~4 per hour). Its rates track the Binance P2P
// USDT/ETB market, the most liquid public proxy for the parallel market.
const PARALLEL_URL = "https://ethioblackmarket.com/api/latest-prices?period=daily";

type ParallelResponse = {
  dailyPercentage?: number;
  allLastprice?: Record<string, number>;
};

type ParallelRates = {
  latest: Record<string, number>;
  changePct: number | null;
};

async function fetchParallel(): Promise<ParallelRates> {
  const data = (await getJson(PARALLEL_URL)) as ParallelResponse;
  if (!data.allLastprice?.USD) throw new Error("Parallel rate response missing USD");
  return {
    latest: data.allLastprice,
    changePct: data.dailyPercentage ?? null,
  };
}

// ---------- International baseline ----------

// Open Exchange Rates when OPENEXCHANGERATES_APP_ID is set (free plan: 1,000
// requests/month, hourly updates), otherwise ExchangeRate-API's keyless open
// endpoint (daily updates, attribution required). Both quote per USD, so
// birr per X = ETB-per-USD / X-per-USD.
const BASELINE_REVALIDATE_SECONDS = 60 * 60; // ~720 requests/month

type Baseline = { provider: FxSnapshot["baselineProvider"]; perUsd: Record<string, number> };

async function fetchBaseline(): Promise<Baseline> {
  const appId = process.env.OPENEXCHANGERATES_APP_ID;
  const symbols = ["ETB", ...TRACKED_CURRENCIES].join(",");
  const url = appId
    ? `https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=${symbols}`
    : "https://open.er-api.com/v6/latest/USD";
  // Shared data cache, not memory: the Open Exchange Rates quota is
  // per-month, so the call rate must hold across every server instance.
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: BASELINE_REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from baseline rates`);
  const data = (await response.json()) as { rates?: Record<string, number> };
  if (!data.rates?.ETB) throw new Error("Baseline response missing ETB");
  return { provider: appId ? "openexchangerates" : "exchangerate-api", perUsd: data.rates };
}

// ---------- Shared plumbing ----------

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
  return response.json();
}

// A tiny TTL cache that keeps serving the last good value if a refresh fails,
// the same approach fetchNews.ts uses for feeds.
function cached<T>(ttlMs: number, load: () => Promise<T>): () => Promise<T | null> {
  let entry: { value: T; at: number } | null = null;
  let inFlight: Promise<T> | null = null;
  return async () => {
    if (entry && Date.now() - entry.at < ttlMs) return entry.value;
    inFlight ??= load().finally(() => {
      inFlight = null;
    });
    try {
      const value = await inFlight;
      entry = { value, at: Date.now() };
      return value;
    } catch (error) {
      console.error("Exchange-rate refresh failed:", error);
      return entry?.value ?? null;
    }
  };
}

const getOfficial = cached(OFFICIAL_TTL_MS, fetchOfficial);
const getParallel = cached(PARALLEL_TTL_MS, fetchParallel);
const getBaseline = async () => {
  try {
    return await fetchBaseline();
  } catch (error) {
    console.error("Baseline rate fetch failed:", error);
    return null;
  }
};

export async function getFxSnapshot(): Promise<FxSnapshot> {
  const [official, parallel, baseline] = await Promise.all([
    getOfficial(),
    getParallel(),
    getBaseline(),
  ]);

  const rows = TRACKED_CURRENCIES.map((code) => {
    const officialRate = official?.rates.get(code);
    const perUsd = baseline?.perUsd[code];
    return {
      code,
      officialBuying: officialRate?.buying ?? null,
      officialSelling: officialRate?.selling ?? null,
      baseline: baseline && perUsd ? baseline.perUsd.ETB / perUsd : null,
      parallel: parallel?.latest[code] ?? null,
    } satisfies CurrencyRow;
  });

  const failed: FxSnapshot["failed"] = [];
  if (!official) failed.push("official");
  if (!parallel) failed.push("parallel");
  if (!baseline) failed.push("baseline");

  return {
    rows,
    officialDate: official?.date ?? null,
    parallelChangePct: parallel?.changePct ?? null,
    baselineProvider: baseline?.provider ?? null,
    fetchedAt: Date.now(),
    failed,
  };
}

export function officialMid(row: CurrencyRow): number | null {
  return row.officialBuying !== null && row.officialSelling !== null
    ? (row.officialBuying + row.officialSelling) / 2
    : null;
}

// How far the parallel rate sits above the official mid rate, in percent.
export function parallelPremiumPct(row: CurrencyRow): number | null {
  const official = officialMid(row);
  return official && row.parallel ? (row.parallel / official - 1) * 100 : null;
}
