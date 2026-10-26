"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { strings } from "@/lib/strings";
import { CATEGORIES, type CategorySlug } from "@/lib/types";

// "General" is a catch-all, not a real interest — dropped from nav, but the
// category itself still exists (articles still land there, still reachable
// at /category/general). See ARCHITECTURE.md "UI decisions".
const NAV_CATEGORIES = CATEGORIES.filter((category) => category.slug !== "general");

// On phones the pills scroll sideways. A fade on either edge shows there are
// more sections that way, and the current section is scrolled into view so its
// highlighted pill isn't hidden off-screen. From the sm breakpoint up the pills
// wrap instead, there's nothing to scroll, and the fades stay hidden.
export function CategoryNav({ active }: { active?: CategorySlug | "all" | "east-africa" }) {
  const scrollerRef = useRef<HTMLElement>(null);
  const [fades, setFades] = useState({ left: false, right: false });

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const current = scroller.querySelector<HTMLElement>('[aria-current="page"]');
    if (current && current.offsetLeft + current.offsetWidth > scroller.clientWidth) {
      scroller.scrollLeft = current.offsetLeft - (scroller.clientWidth - current.offsetWidth) / 2;
    }

    const updateFades = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      // 1px slack: browsers can report fractional scroll positions.
      setFades({ left: scroller.scrollLeft > 1, right: scroller.scrollLeft < maxScroll - 1 });
    };

    // ResizeObserver also fires once on observe, which sets the initial fades.
    const resizeObserver = new ResizeObserver(updateFades);
    resizeObserver.observe(scroller);
    scroller.addEventListener("scroll", updateFades, { passive: true });
    return () => {
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateFades);
    };
  }, [active]);

  return (
    <div className="relative -mx-4 -my-1 sm:-mx-1">
      <nav
        ref={scrollerRef}
        aria-label={strings.nav.label}
        className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-1 sm:flex-wrap sm:px-1"
      >
        <NavPill href="/" label={strings.nav.all} isActive={active === "all"} />
        {NAV_CATEGORIES.map((category) => (
          <NavPill
            key={category.slug}
            href={`/category/${category.slug}`}
            label={category.navLabel}
            isActive={active === category.slug}
          />
        ))}
        <NavPill
          href="/region/east-africa"
          label={strings.nav.eastAfrica}
          isActive={active === "east-africa"}
        />
      </nav>
      <EdgeFade side="left" visible={fades.left} />
      <EdgeFade side="right" visible={fades.right} />
    </div>
  );
}

function EdgeFade({ side, visible }: { side: "left" | "right"; visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 w-10 from-surface to-transparent transition-opacity duration-200 ${
        side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l"
      } ${visible ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function NavPill({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "border-brand-green bg-brand-green text-white"
          : "border-border bg-surface text-foreground hover:border-brand-green/60"
      }`}
    >
      {label}
    </Link>
  );
}
