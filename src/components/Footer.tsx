import { SOURCES } from "@/lib/sources";
import { strings } from "@/lib/strings";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6">
        <p className="text-foreground/80">{strings.footer.about}</p>
        <p className="mt-3">{strings.footer.disclaimer}</p>
        <p className="mt-3">
          {strings.footer.sourcesLabel}{" "}
          {SOURCES.map((source, index) => (
            <span key={source.id}>
              <a
                href={source.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-border underline-offset-2 hover:text-brand-green"
              >
                {source.name}
              </a>
              {index < SOURCES.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
