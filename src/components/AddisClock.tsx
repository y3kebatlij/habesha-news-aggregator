"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Africa/Addis_Ababa",
  weekday: "short",
  hour: "numeric",
  minute: "2-digit",
});

// The current minute, as the external store. Snapshots must be stable between
// renders, so this changes only when the displayed time does.
function getSnapshot() {
  return Math.floor(Date.now() / 60_000);
}

function subscribe(callback: () => void) {
  const timer = setInterval(callback, 5_000);
  return () => clearInterval(timer);
}

// Renders Addis Ababa's time whatever the reader's own timezone is. The server
// passes the minute it rendered at, so hydration matches and the clock then
// ticks on in the browser.
export function AddisClock({ renderedAtMinute }: { renderedAtMinute: number }) {
  const minute = useSyncExternalStore(subscribe, getSnapshot, () => renderedAtMinute);
  return <time>{formatter.format(minute * 60_000)}</time>;
}
