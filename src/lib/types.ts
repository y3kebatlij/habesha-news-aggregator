export type CategorySlug =
  | "politics"
  | "business"
  | "sports"
  | "fashion"
  | "technology"
  | "diaspora"
  | "general";

// Which section an article belongs to — "ethiopia" powers the homepage and
// category pages, "east-africa" powers the standalone /region/east-africa
// page. Deliberately not folded into CategorySlug: an East Africa story
// isn't a "category" of Ethiopian news, it's a different section entirely.
export type Region = "ethiopia" | "east-africa";

export type Article = {
  id: string;
  title: string;
  link: string;
  snippet: string;
  image: string | null;
  pubDate: string | null;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  language: "en" | "am";
  category: CategorySlug;
  region: Region;
};

export type Category = {
  slug: CategorySlug;
  label: string;
};

export const CATEGORIES: Category[] = [
  { slug: "politics", label: "Politics" },
  { slug: "business", label: "Business & Economy" },
  { slug: "sports", label: "Sports" },
  { slug: "fashion", label: "Fashion & Lifestyle" },
  { slug: "technology", label: "Technology" },
  { slug: "diaspora", label: "Diaspora & World" },
  { slug: "general", label: "General" },
];
