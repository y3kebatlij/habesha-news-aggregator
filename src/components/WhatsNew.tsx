"use client";

import { useSyncExternalStore } from "react";
import { CHANGELOG } from "@/lib/changelog";
import { strings } from "@/lib/strings";

// The newest changelog id this browser has dismissed lives in localStorage —
// external state, read through useSyncExternalStore like ThemeToggle does.
const STORAGE_KEY = "whatsNewSeen";
// A first-time visitor or one who's been away a while sees at most this many.
const MAX_ENTRIES = 2;

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    // Storage blocked: don't show a popup that could never be dismissed.
    return null;
  }
}

// Nothing renders on the server, so the popup never flashes for a visitor
// who has already dismissed it.
function getServerSnapshot(): string | null {
  return null;
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, CHANGELOG[0].id);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function WhatsNew() {
  const seenId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (seenId === null) return null;

  const unseen = CHANGELOG.filter((entry) => entry.id > seenId).slice(0, MAX_ENTRIES);
  if (unseen.length === 0) return null;

  return (
    <section
      role="status"
      aria-labelledby="whats-new-heading"
      className="fixed inset-x-4 bottom-4 z-50 max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-surface p-4 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="whats-new-heading" className="text-sm font-semibold text-brand-green">
          {strings.whatsNew.heading}
        </h2>
        <button
          type="button"
          onClick={dismiss}
          aria-label={strings.whatsNew.close}
          className="-mt-1 -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      {unseen.map((entry) => (
        <div key={entry.id} className="mt-3">
          <p className="text-sm font-medium text-foreground">{entry.title}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
            {entry.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
      <button
        type="button"
        onClick={dismiss}
        className="mt-4 w-full rounded-md bg-brand-green px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
      >
        {strings.whatsNew.dismiss}
      </button>
    </section>
  );
}
