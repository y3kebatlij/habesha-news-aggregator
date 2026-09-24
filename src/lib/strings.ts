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
  footer: {
    about:
      "Habesha News pulls headlines from Ethiopian and diaspora publishers into one place, ranked by what's happening now rather than a raw feed of everything.",
    disclaimer:
      "Headlines are pulled from each publisher's public RSS feed and link back to the original article. Habesha News does not host or modify the underlying reporting.",
    transparencyDisclaimer:
      "Source labels (\"State-affiliated\" / \"Independent\" / \"Unrated\") describe publicly documented ownership or leadership ties, not political leaning — they're our editorial classification, not a certification.",
    sourcesLabel: "Sources:",
  },
} as const;
