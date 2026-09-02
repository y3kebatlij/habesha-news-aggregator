"use client";

import { useSyncExternalStore } from "react";
import { strings } from "@/lib/strings";

// document.documentElement's "dark" class is genuinely external state — it's
// also set by the beforeInteractive bootstrap script in layout.tsx before
// React ever mounts. useSyncExternalStore reads it safely across hydration
// instead of a useEffect+setState render cascade.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function setDark(next: boolean) {
  document.documentElement.classList.toggle("dark", next);
  localStorage.setItem("theme", next ? "dark" : "light");
  listeners.forEach((listener) => listener());
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      onClick={() => setDark(!isDark)}
      aria-label={isDark ? strings.theme.switchToLight : strings.theme.switchToDark}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand-green/60"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4.5 w-4.5">
          <circle cx="12" cy="12" r="4.5" />
          <path
            strokeLinecap="round"
            d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a.75.75 0 0 0-.9-.9A9 9 0 1 0 21.4 15.4a.75.75 0 0 0-.9-.9Z" />
        </svg>
      )}
    </button>
  );
}
