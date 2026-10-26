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
    id: "2026-10-26c",
    title: "Easier section menu on phones",
    items: [
      "Section names are shorter, so more of them fit on screen, and a fade at the edge shows when there are more to swipe to.",
      "The section you're reading is now always visible in the menu.",
    ],
  },
  {
    id: "2026-10-26b",
    title: "More Ethiopian sport",
    items: [
      "The Sports section now includes Soccer Ethiopia, Fana's sport desk, and the sport pages of The Reporter in English and Amharic.",
    ],
  },
  {
    id: "2026-10-26",
    title: "News only: no job ads or promotions",
    items: [
      "Job openings, vacancy and tender notices, press releases and other promotional posts are now left out, so you only see news.",
    ],
  },
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
