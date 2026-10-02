// Current weather in Addis Ababa for the homepage, from Open-Meteo (free, no
// key; CC BY 4.0, credited in Footer). Responses go through Next's shared
// data cache, so the API is hit at most once per REVALIDATE_SECONDS however
// many visitors there are — Open-Meteo itself only updates every 15 minutes.
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=9.03&longitude=38.74&current=temperature_2m,weather_code,is_day&timezone=Africa%2FAddis_Ababa";
const REVALIDATE_SECONDS = 15 * 60;
const FETCH_TIMEOUT_MS = 5_000;

export type WeatherCondition = "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

export type Weather = {
  temperatureC: number;
  condition: WeatherCondition;
  isDay: boolean;
};

// WMO weather interpretation codes, as documented by Open-Meteo.
function conditionFromCode(code: number): WeatherCondition {
  if (code <= 1) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 57) return "drizzle";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 86) return "snow";
  return "storm";
}

// Null when Open-Meteo is unreachable; the homepage then shows the time only.
export async function getAddisWeather(): Promise<Weather | null> {
  try {
    const response = await fetch(API_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} from Open-Meteo`);
    const { current } = (await response.json()) as {
      current?: { temperature_2m?: number; weather_code?: number; is_day?: number };
    };
    if (typeof current?.temperature_2m !== "number" || typeof current.weather_code !== "number") {
      throw new Error("Open-Meteo returned no current weather");
    }
    return {
      temperatureC: Math.round(current.temperature_2m),
      condition: conditionFromCode(current.weather_code),
      isDay: current.is_day === 1,
    };
  } catch (error) {
    console.error("Failed to fetch Addis Ababa weather:", error);
    return null;
  }
}
