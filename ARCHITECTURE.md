# Architecture

Decisions from the product interview on 2026-08-16. This is the reference for
what v1 is, what it deliberately isn't yet, and why.

## Audience & product identity

- **Audience:** Diaspora and in-country Ethiopian readers, roughly equally.
  Neither gets a degraded experience by default.
- **Identity:** Not just a raw RSS firehose. Two things differentiate it:
  1. **Algorithmic curation** — the homepage surfaces what matters, not just
     what's newest.
  2. **Multimedia** (fast-follow, not v1) — YouTube news channels alongside
     articles.
- **Visual reference:** BBC News — dense but organized editorial hierarchy
  (lead story + subordinate grid), strong masthead, clear timestamps/source
  attribution, no clutter. Adapted with an Ethiopian-flag-informed accent
  palette rather than BBC red, and a type stack chosen so an Amharic locale
  drops in later without a redesign (e.g. pairing with Noto Sans Ethiopic).

## V1 scope (ship small, iterate fast)

In scope:
- RSS aggregation from current sources (`src/lib/sources.ts`)
- Keyword categorization (existing `src/lib/categorize.ts`)
- **New:** algorithmic ranking (below) driving homepage order
- English-only UI, built on an i18n-ready structure
- Deploy to Vercel

Explicitly out of scope for v1 (don't build, don't design around):
- Amharic UI (translation layer, not a rewrite — see i18n below)
- YouTube/multimedia integration
- Persistence (DB/KV) — in-memory cache stays for now
- Search
- Accounts, comments, any community features

## Ranking algorithm

Each article gets a score computed at fetch time:

```
score = recencyDecay(publishedAt) + keywordWeight(title)
```

- **Recency decay:** exponential half-life of ~8 hours, so a story loses
  roughly half its recency score every 8 hours. Prevents old articles from
  camping the homepage while not making it a pure reverse-chron feed.
- **Keyword weight:** small fixed bonus for breaking-news signal words
  ("breaking", "urgent", "developing", etc.) in the title.
- **Source-diversity constraint on the hero slots:** the top N (hero + first
  row of the grid) may not contain more than one article from the same
  source, even if that source's articles score highest. Prevents one prolific
  outlet from dominating the homepage.

**Explicitly deferred to v1.5:** cross-source story clustering (detecting
that 4 outlets are covering "the same story" and boosting it as genuinely
breaking). That needs fuzzy title/entity matching and is real complexity —
not worth it before the ranking basics are validated.

## Data flow

```
sources.ts → fetchNews.ts (parallel fetch, normalize, in-memory 15min cache)
           → categorize.ts (keyword bucket)
           → rank.ts (NEW: score + source-diversity ordering)
           → page.tsx / category/[slug]/page.tsx (render)
```

`rank.ts` is a new pure module: takes `Article[]`, returns them ordered.
Categorization and ranking stay decoupled — category pages use categorize
only; the homepage uses rank on top of all categories.

## i18n readiness (build now, don't populate yet)

Even though v1 ships English-only, avoid hardcoding UI strings so Amharic
isn't a rewrite later:
- All UI copy (nav labels, category display names, "read more", timestamps
  format, etc.) goes through a single strings dictionary
  (`src/lib/strings.ts` or similar), English-only for now.
- Category *keys* (`politics`, `business`, etc.) stay language-neutral —
  they already are in `categorize.ts`. Display labels are resolved from the
  strings dictionary, not hardcoded in components.
- Don't build a locale-switcher UI yet — just don't block it structurally.

## Design system (BBC-informed)

- **Layout:** masthead header, optional breaking-news strip, hero story +
  subordinate grid on homepage, same card system reused on category pages.
- **Density:** editorial, not minimalist — closer to BBC's information
  density than a typical blog. Clear visual hierarchy between hero /
  secondary / tertiary stories.
- **Palette:** accent drawn from the Ethiopian flag (green `#078930`, yellow
  `#FCDD09`, red `#DA121A`) — used sparingly as accent/category color, not as
  a literal flag treatment. Neutral grays/whites carry the base UI so it
  reads as a serious news product, not a nationalist skin.
- **Type:** a clean sans for the English UI, chosen from a family that also
  ships an Ethiopic variant (Noto Sans / Noto Sans Ethiopic pairing is the
  safe default) so Amharic text doesn't require a font swap later.
- **Cards:** every article card shows source, category, and relative
  timestamp (`src/lib/time.ts` already exists for this) — attribution is
  part of the BBC-like trust signal, not decoration.

## Infra roadmap (beyond v1)

1. **v1** — Vercel, in-memory cache (current model), on-demand fetch per
   request/revalidation window.
2. **v1.5** — Vercel Cron hits a route that calls `getArticles()` on a
   schedule, decoupling fetch latency from page load; cross-source story
   clustering for real "breaking" detection.
3. **v2** — Persistence: Vercel KV or Postgres (Neon/Supabase) so the cache
   survives restarts and search becomes possible (Postgres full-text search
   is the low-effort option before reaching for Algolia/Meilisearch).
4. **v2.x** — YouTube channel integration (multimedia).
5. **v3** — Amharic locale using the strings dictionary + Ethiopic font
   pairing already in place.

## UI decisions (from the mockup/wireframe interview)

Locked in against the homepage mockup (`ARCHITECTURE.md`'s BBC-informed design
system, above). Reference the mockup artifact for the visual, this is the
checklist of what it needs to become in the real components.

In scope for v1:
- **Dark mode toggle** in the masthead (sun/moon icon), not just system
  preference — defaults to system, explicit click overrides.
- **Breaking banner**: thin strip above the masthead, shown whenever the
  top-ranked article scores a breaking-keyword bonus (see `rank.ts`), links
  down to the lead story. In addition to (not instead of) the "Breaking"
  pill already on the lead card itself.
- **Category nav** drops "General" — it's a catch-all, not a real interest.
  The category itself still exists (articles still land there, still shown
  as an eyebrow label on cards, still reachable via `/category/general` and
  the homepage) — just not a nav item.
- **Mobile nav** stays horizontally-scrolling tabs, not a hamburger menu.
- **Load more** button (not infinite scroll, not full pagination) below the
  homepage grid and on category pages.
- **Language tag**: Amharic-language cards (`article.language === "am"`)
  keep an explicit "አማርኛ" chip in the meta row — already existed in the old
  `ArticleCard.tsx`, carried forward.
- **Footer** gets a short "About Habesha News" paragraph above the existing
  sources/disclaimer line.

Explicitly decided against for v1 (don't build):
- No search UI, not even a placeholder — nothing implies a feature that
  doesn't work yet.
- No per-category homepage rails ("Also in Sports," etc.) — one flat grid
  below the hero zone.
- No snippet/dek text on hero-window or grid cards — headline + source +
  time only, stays dense.
- No "data saver" / hide-images toggle — standard browser lazy-loading is
  enough for v1 despite the audience including data-cost-sensitive readers.
- No external-link icon on cards, no source-name filtering/linking — source
  name stays plain text.
- No hero treatment on category pages — they stay plain grids, ranking is a
  homepage-only feature.
- Missing-image fallback stays as source-name-on-tinted-background (already
  the existing `ArticleCard.tsx` behavior) — not a monogram badge.
- Empty/error-state copy stays as-is ("No articles found right now. Check
  back soon.") — not worth a voice pass yet.

## Open items for later (not blocking v1)

- Which specific YouTube channels to include (ESAT, OMN, Fana, etc.) — TBD
  when we get to v1.5.
- Whether ranking needs per-category tuning (e.g. Sports "breaking" keywords
  differ from Politics).
- ~~The repo currently lives inside a git root at the home directory...~~ —
  resolved: the project has its own `.git` at the project root (confirmed
  2026-09-01). It has no remote configured yet; add one before deploying to
  Vercel.
