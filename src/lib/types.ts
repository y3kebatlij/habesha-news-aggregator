export type CategorySlug =
  | "politics"
  | "business"
  | "sports"
  | "fashion"
  | "technology"
  | "diaspora"
  | "general";

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
