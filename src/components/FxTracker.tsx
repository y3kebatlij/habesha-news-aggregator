import { getFxSnapshot, officialMid, parallelPremiumPct, type CurrencyRow } from "@/lib/fx";
import { relativeTime } from "@/lib/time";
import { strings } from "@/lib/strings";

function rate(value: number | null): string {
  return value === null ? strings.fx.unavailable : value.toFixed(2);
}

function percent(value: number | null, signed = true): string {
  if (value === null) return strings.fx.unavailable;
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(value !== 0 && Math.abs(value) < 1 ? 2 : 1)}%`;
}

function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function StatTile({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{detail}</p>
    </div>
  );
}

export async function FxTracker() {
  const snapshot = await getFxSnapshot();
  const usd = snapshot.rows.find((row) => row.code === "USD") as CurrencyRow;
  const credit = snapshot.baselineProvider ? strings.fx.baselineCredit[snapshot.baselineProvider] : null;

  return (
    <section
      aria-labelledby="fx-heading"
      className="mb-8 rounded-xl border border-border bg-surface p-4 sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 id="fx-heading" className="text-base font-semibold">
            {strings.fx.heading}
          </h2>
          <p className="text-xs text-muted">{strings.fx.subheading}</p>
        </div>
        <p className="text-xs text-muted">
          {strings.home.updatedPrefix} {relativeTime(new Date(snapshot.fetchedAt).toISOString())}
        </p>
      </div>

      {snapshot.failed.length > 0 && (
        <ul className="mb-4 space-y-0.5 text-xs text-muted">
          {snapshot.failed.map((part) => (
            <li key={part}>{strings.fx.failed[part]}</li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          label={`${strings.fx.officialLabel} · USD`}
          value={rate(officialMid(usd))}
          detail={`${strings.fx.buy} ${rate(usd.officialBuying)} · ${strings.fx.sell} ${rate(usd.officialSelling)}${
            snapshot.officialDate ? ` · ${formatDay(snapshot.officialDate)}` : ""
          }`}
        />
        <StatTile
          label={`${strings.fx.parallelLabel} · USD`}
          value={rate(usd.parallel)}
          detail={`${percent(snapshot.parallelChangePct)} ${strings.fx.today}`}
        />
        <StatTile
          label={strings.fx.premiumLabel}
          value={percent(parallelPremiumPct(usd))}
          detail={strings.fx.premiumNote}
        />
        <StatTile
          label={`${strings.fx.baselineLabel} · USD`}
          value={rate(usd.baseline)}
          detail={credit?.name ?? strings.fx.unavailable}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm tabular-nums">
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th className="py-2 pr-3 font-medium">{strings.fx.currency}</th>
              <th className="px-3 py-2 text-right font-medium">
                {strings.fx.officialLabel} {strings.fx.buy.toLowerCase()} / {strings.fx.sell.toLowerCase()}
              </th>
              <th className="px-3 py-2 text-right font-medium">{strings.fx.parallelLabel}</th>
              <th className="px-3 py-2 text-right font-medium">{strings.fx.gap}</th>
              <th className="py-2 pl-3 text-right font-medium">{strings.fx.baselineLabel}</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.rows.map((row) => (
              <tr key={row.code} className="border-b border-border last:border-0">
                <th scope="row" className="py-2 pr-3 font-medium">
                  {row.code}
                </th>
                <td className="px-3 py-2 text-right">
                  {rate(row.officialBuying)} / {rate(row.officialSelling)}
                </td>
                <td className="px-3 py-2 text-right">{rate(row.parallel)}</td>
                <td className="px-3 py-2 text-right">{percent(parallelPremiumPct(row))}</td>
                <td className="py-2 pl-3 text-right">{rate(row.baseline)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">
        {strings.fx.sourcesNote}
        {credit && (
          <>
            {" "}
            {strings.fx.baselineLabel}:{" "}
            <a
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-brand-green"
            >
              {credit.name}
            </a>
            .
          </>
        )}
      </p>
    </section>
  );
}
