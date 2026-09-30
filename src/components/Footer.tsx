import { SOURCES } from "@/lib/sources";
import { strings } from "@/lib/strings";
import { isWorldNewsEnabled } from "@/lib/worldNews";

export function Footer() {
  const links = SOURCES.map((source) => ({ id: source.id, name: source.name, url: source.siteUrl }));
  // The World News API free plan requires this backlink.
  if (isWorldNewsEnabled()) {
    links.push({ id: "worldnewsapi", name: "World News API", url: "https://worldnewsapi.com/" });
  }

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1440px] px-4 py-8 text-sm text-muted sm:px-6 lg:px-8">
        <p className="text-foreground/80">{strings.footer.about}</p>
        <p className="mt-3">{strings.footer.disclaimer}</p>
        <p className="mt-3">{strings.footer.transparencyDisclaimer}</p>
        <p className="mt-3">
          {strings.footer.sourcesLabel}{" "}
          {links.map((link, index) => (
            <span key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-border underline-offset-2 hover:text-brand-green"
              >
                {link.name}
              </a>
              {index < links.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
