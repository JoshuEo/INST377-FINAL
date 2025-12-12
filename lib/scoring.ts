export type RecommendationStatus = "go" | "delay" | "skip";

export function computeRecommendation(input: {
  aqi: number | null;
  tempC: number | null;
  windMs: number | null;
  precipMm: number | null;
  aqiMax?: number;
  tempMinC?: number;
  tempMaxC?: number;
}): { status: RecommendationStatus; score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 100;

  const aqiMax = input.aqiMax ?? 75;
  const tempMin = input.tempMinC ?? 5;
  const tempMax = input.tempMaxC ?? 28;

  if (input.aqi == null) {
    reasons.push("AQI unavailable (showing weather-only guidance)");
    score -= 10;
  } else if (input.aqi > aqiMax) {
    reasons.push(`AQI ${input.aqi} > ${aqiMax}`);
    score -= Math.min(60, (input.aqi - aqiMax) * 0.8);
  } else {
    reasons.push(`AQI ${input.aqi} ≤ ${aqiMax}`);
  }

  if (input.tempC == null) {
    reasons.push("Temperature unavailable");
    score -= 10;
  } else if (input.tempC < tempMin) {
    reasons.push(`Temp ${input.tempC.toFixed(1)}°C < ${tempMin}°C`);
    score -= (tempMin - input.tempC) * 2.0;
  } else if (input.tempC > tempMax) {
    reasons.push(`Temp ${input.tempC.toFixed(1)}°C > ${tempMax}°C`);
    score -= (input.tempC - tempMax) * 2.0;
  } else {
    reasons.push("Temp within comfort band");
  }

  if (input.windMs != null && input.windMs > 8) {
    reasons.push(`Wind ${input.windMs.toFixed(1)} m/s is high`);
    score -= (input.windMs - 8) * 2.5;
  }

  if (input.precipMm != null && input.precipMm > 0.2) {
    reasons.push("Precipitation expected");
    score -= Math.min(25, input.precipMm * 10);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status: RecommendationStatus = "go";
  if (score < 40) status = "skip";
  else if (score < 70) status = "delay";

  return { status, score, reasons };
}
