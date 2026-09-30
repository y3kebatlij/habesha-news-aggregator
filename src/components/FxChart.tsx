"use client";

import { useEffect, useRef, useState } from "react";
import type { DailyPoint } from "@/lib/fx";
import { strings } from "@/lib/strings";

const HEIGHT = 240;
const MARGIN = { top: 12, right: 64, bottom: 28, left: 44 };

const SERIES = [
  { key: "official", label: strings.fx.officialLabel, color: "var(--series-official)" },
  { key: "parallel", label: strings.fx.parallelLabel, color: "var(--series-parallel)" },
] as const;

function formatRate(value: number | null): string {
  return value === null ? strings.fx.unavailable : value.toFixed(2);
}

function formatDate(date: string, withYear = false): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

function niceTicks(min: number, max: number, count: number): number[] {
  const rawStep = (max - min) / count;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= rawStep) ?? rawStep;
  const ticks: number[] = [];
  for (let tick = Math.ceil(min / step) * step; tick <= max; tick += step) ticks.push(tick);
  return ticks;
}

function linePath(points: [number, number | null][]): string {
  let path = "";
  let penDown = false;
  for (const [x, y] of points) {
    if (y === null) {
      penDown = false;
      continue;
    }
    path += `${penDown ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    penDown = true;
  }
  return path;
}

export function FxChart({ history }: { history: DailyPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (history.length < 2) return null;

  const values = history.flatMap((point) =>
    [point.official, point.parallel].filter((value): value is number => value !== null)
  );
  const yTicks = niceTicks(Math.min(...values) * 0.97, Math.max(...values) * 1.02, 4);
  const yMin = Math.min(yTicks[0], Math.min(...values));
  const yMax = Math.max(yTicks.at(-1)!, Math.max(...values));

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 10);
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const x = (index: number) => MARGIN.left + (index / (history.length - 1)) * plotWidth;
  const y = (value: number) => MARGIN.top + (1 - (value - yMin) / (yMax - yMin)) * plotHeight;

  const xTickCount = width < 480 ? 3 : 5;
  const xTicks = Array.from({ length: xTickCount }, (_, i) =>
    Math.round((i / (xTickCount - 1)) * (history.length - 1))
  );

  const lastIndexWith = (key: "official" | "parallel") =>
    history.findLastIndex((point) => point[key] !== null);

  // End labels sit at each line's last value; push them apart if they'd collide.
  const endLabels = SERIES.map((series) => {
    const index = lastIndexWith(series.key);
    const value = index === -1 ? null : history[index][series.key];
    return { ...series, index, value, labelY: value === null ? 0 : y(value) };
  }).filter((label) => label.value !== null);
  if (endLabels.length === 2 && Math.abs(endLabels[0].labelY - endLabels[1].labelY) < 14) {
    const [upper, lower] = endLabels[0].labelY < endLabels[1].labelY ? endLabels : [endLabels[1], endLabels[0]];
    upper.labelY -= 7;
    lower.labelY += 7;
  }

  function indexFromClientX(clientX: number, svg: SVGSVGElement): number {
    const box = svg.getBoundingClientRect();
    const ratio = (clientX - box.left - MARGIN.left) / plotWidth;
    return Math.min(history.length - 1, Math.max(0, Math.round(ratio * (history.length - 1))));
  }

  const active = activeIndex === null ? null : history[activeIndex];
  const tooltipLeft = activeIndex === null ? 0 : x(activeIndex);
  const tooltipOnLeft = tooltipLeft > width / 2;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        {SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-4 rounded-full" style={{ background: series.color }} />
            {series.label}
          </span>
        ))}
      </div>

      <div ref={containerRef} className="relative w-full min-w-0">
        {/* Sized by CSS (not the width attribute) so the SVG can never prop its
            container open; the viewBox tracks the measured width. */}
        <svg
          viewBox={`0 0 ${width} ${HEIGHT}`}
          style={{ width: "100%", height: HEIGHT }}
          role="img"
          aria-label={strings.fx.chartLabel}
          tabIndex={0}
          className="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
          onPointerMove={(event) => setActiveIndex(indexFromClientX(event.clientX, event.currentTarget))}
          onPointerLeave={() => setActiveIndex(null)}
          onFocus={() => setActiveIndex((current) => current ?? history.length - 1)}
          onBlur={() => setActiveIndex(null)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const step = event.key === "ArrowLeft" ? -1 : 1;
            setActiveIndex((current) =>
              Math.min(history.length - 1, Math.max(0, (current ?? history.length - 1) + step))
            );
          }}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={MARGIN.left}
                x2={MARGIN.left + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px]">
                {tick}
              </text>
            </g>
          ))}
          {xTicks.map((index) => (
            <text
              key={index}
              x={x(index)}
              y={HEIGHT - 8}
              textAnchor={index === 0 ? "start" : index === history.length - 1 ? "end" : "middle"}
              className="fill-muted text-[11px]"
            >
              {formatDate(history[index].date)}
            </text>
          ))}

          {SERIES.map((series) => (
            <path
              key={series.key}
              d={linePath(history.map((point, index) => [x(index), point[series.key] === null ? null : y(point[series.key]!)]))}
              fill="none"
              stroke={series.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}

          {endLabels.map((label) => (
            <text
              key={label.key}
              x={x(label.index) + 8}
              y={label.labelY}
              dy="0.32em"
              className="fill-foreground text-[12px] font-semibold tabular-nums"
            >
              {formatRate(label.value)}
            </text>
          ))}

          {active && activeIndex !== null && (
            <g>
              <line
                x1={x(activeIndex)}
                x2={x(activeIndex)}
                y1={MARGIN.top}
                y2={MARGIN.top + plotHeight}
                stroke="var(--muted)"
                strokeWidth={1}
              />
              {SERIES.map((series) =>
                active[series.key] === null ? null : (
                  <circle
                    key={series.key}
                    cx={x(activeIndex)}
                    cy={y(active[series.key]!)}
                    r={4}
                    fill={series.color}
                    stroke="var(--surface)"
                    strokeWidth={2}
                  />
                )
              )}
            </g>
          )}
        </svg>

        {active && (
          <div
            role="status"
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-md"
            style={
              tooltipOnLeft
                ? { right: width - tooltipLeft + 12 }
                : { left: tooltipLeft + 12 }
            }
          >
            <p className="mb-1 text-muted">{formatDate(active.date, true)}</p>
            {SERIES.map((series) => (
              <p key={series.key} className="flex items-center gap-2">
                <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: series.color }} />
                <strong className="tabular-nums text-foreground">{formatRate(active[series.key])}</strong>
                <span className="text-muted">{series.label}</span>
              </p>
            ))}
            {active.official !== null && active.parallel !== null && (
              <p className="mt-1 text-muted">
                {strings.fx.gap}{" "}
                <strong className="tabular-nums text-foreground">
                  {`${((active.parallel / active.official - 1) * 100).toFixed(1)}%`}
                </strong>
              </p>
            )}
          </div>
        )}
      </div>

      <details className="mt-3 text-xs">
        <summary className="cursor-pointer text-muted hover:text-foreground">{strings.fx.showTable}</summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-surface text-muted">
              <tr>
                <th className="px-3 py-1.5 font-medium">{strings.fx.date}</th>
                <th className="px-3 py-1.5 text-right font-medium">{strings.fx.officialLabel}</th>
                <th className="px-3 py-1.5 text-right font-medium">{strings.fx.parallelLabel}</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((point) => (
                <tr key={point.date} className="border-t border-border">
                  <td className="px-3 py-1">{formatDate(point.date, true)}</td>
                  <td className="px-3 py-1 text-right">{formatRate(point.official)}</td>
                  <td className="px-3 py-1 text-right">{formatRate(point.parallel)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
