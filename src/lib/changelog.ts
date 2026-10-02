// Release notes shown to readers in the "What's new" popup (WhatsNew.tsx).
// Add an entry, newest first, with every user-visible update. A visitor sees
// each entry once: dismissing the popup remembers the newest id they've seen.
export type ChangelogEntry = {
  // Unique and sortable: the release date, plus a suffix for a second release
  // on the same day (e.g. "2026-10-02b").
  id: string;
  title: string;
  items: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "2026-10-02",
    title: "More sources, and Addis Ababa time & weather",
    items: [
      "Ethiopia coverage from The New York Times, Financial Times, Euronews, CNBC Africa, PBS News Hour, Responsible Statecraft and Africa Today News.",
      "The homepage now shows the current time and temperature in Addis Ababa.",
    ],
  },
  {
    id: "2026-10-01",
    title: "Amharic stories sorted into sections",
    items: [
      "Amharic headlines now land in Politics, Business, Sports and the other sections instead of General.",
      "If a source is briefly unreachable, its latest stories stay on the site.",
    ],
  },
];
