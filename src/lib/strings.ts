// Single source of truth for UI copy. English-only for v1, but every piece of
// chrome text is routed through here (rather than hardcoded in components) so
// an Amharic locale later is a translation, not a rewrite. See ARCHITECTURE.md
// "i18n readiness".
export const strings = {
  siteName: "Habesha News",
  tagline: "Ethiopian news, all in one place",
  nav: {
    all: "All",
    eastAfrica: "East Africa",
  },
  eastAfrica: {
    heading: "East Africa",
  },
  home: {
    heading: "Latest headlines",
    updatedPrefix: "Updated",
    staleNote: "showing cached results, a source may be unreachable",
  },
  addisNow: {
    city: "Addis Ababa",
    conditions: {
      clear: "Clear",
      cloudy: "Cloudy",
      fog: "Fog",
      drizzle: "Drizzle",
      rain: "Rain",
      snow: "Snow",
      storm: "Thunderstorm",
    },
  },
  whatsNew: {
    heading: "What's new on Habesha News",
    dismiss: "Got it",
    close: "Close",
  },
  grid: {
    empty: "No articles found right now. Check back soon.",
    loadMore: "Load more",
  },
  breaking: {
    bannerPrefix: "Breaking",
    pill: "Breaking",
  },
  cluster: {
    coveredBy: (sourceCount: number) => `Covered by ${sourceCount} sources`,
  },
  theme: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode",
  },
  languageTag: {
    am: "አማርኛ",
  },
  transparency: {
    "state-affiliated": "State-affiliated",
    independent: "Independent",
    unrated: "Unrated",
  },
  search: {
    placeholder: "Search headlines…",
    submitLabel: "Search",
    heading: "Search",
    prompt: "Enter a search term to find headlines.",
    resultsHeading: (query: string) => `Results for "${query}"`,
  },
  fx: {
    heading: "Birr exchange rates",
    subheading: "Official bank rate vs. the parallel market, birr per unit of foreign currency.",
    officialLabel: "Official (CBE)",
    parallelLabel: "Parallel market",
    premiumLabel: "Parallel premium",
    premiumNote: "above the official mid rate",
    baselineLabel: "International baseline",
    buy: "Buy",
    sell: "Sell",
    today: "today",
    currency: "Currency",
    gap: "Gap",
    unavailable: "—",
    failed: {
      official: "Official CBE rates are unavailable right now.",
      parallel: "Parallel-market rates are unavailable right now.",
      baseline: "The international baseline is unavailable right now.",
    },
    sourcesNote:
      "Official rates: Commercial Bank of Ethiopia daily exchange table. Parallel market: EthioBlackMarket, which tracks Binance P2P USDT/ETB trades — an indicator, not a quote you can trade at. The parallel market operates outside Ethiopia's legal foreign-exchange system.",
    baselineCredit: {
      openexchangerates: { name: "Open Exchange Rates", url: "https://openexchangerates.org/" },
      "exchangerate-api": { name: "Rates By Exchange Rate API", url: "https://www.exchangerate-api.com" },
    },
  },
  footer: {
    about:
      "Habesha News pulls headlines from Ethiopian and diaspora publishers into one place, ranked by what's happening now rather than a raw feed of everything.",
    disclaimer:
      "Headlines are pulled from each publisher's public feed (or a news API) and link back to the original article. Habesha News does not host or modify the underlying reporting.",
    transparencyDisclaimer:
      "Source labels (\"State-affiliated\" / \"Independent\" / \"Unrated\") describe publicly documented ownership or leadership ties, not political leaning — they're our editorial classification, not a certification.",
    sourcesLabel: "Sources:",
    weatherCredit: { prefix: "Weather data by", name: "Open-Meteo.com", url: "https://open-meteo.com/" },
  },
} as const;
