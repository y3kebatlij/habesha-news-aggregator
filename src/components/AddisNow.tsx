import { AddisClock } from "@/components/AddisClock";
import { getAddisWeather } from "@/lib/weather";
import { strings } from "@/lib/strings";

const ICONS = {
  clear: { day: "☀️", night: "🌙" },
  cloudy: { day: "⛅", night: "☁️" },
  fog: { day: "🌫️", night: "🌫️" },
  drizzle: { day: "🌦️", night: "🌧️" },
  rain: { day: "🌧️", night: "🌧️" },
  snow: { day: "🌨️", night: "🌨️" },
  storm: { day: "⛈️", night: "⛈️" },
} as const;

export async function AddisNow() {
  const weather = await getAddisWeather();
  // Read once per request on the server: dynamic data, which this route
  // already is (revalidate = 0).
  // eslint-disable-next-line react-hooks/purity
  const renderedAtMinute = Math.floor(Date.now() / 60_000);

  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
      <span className="font-medium text-foreground">{strings.addisNow.city}</span>
      <span aria-hidden="true">·</span>
      <AddisClock renderedAtMinute={renderedAtMinute} />
      {weather && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            <span aria-hidden="true">{ICONS[weather.condition][weather.isDay ? "day" : "night"]} </span>
            {weather.temperatureC}°C {strings.addisNow.conditions[weather.condition]}
          </span>
        </>
      )}
    </p>
  );
}
