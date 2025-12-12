import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";

const MapView = dynamic(() => import("../shared/MapView"), { ssr: false });

type ConditionsResponse = {
  location: { lat: number; lon: number };
  now: { tempC: number | null; aqi: number | null; windMs: number | null; precipMm: number | null };
  hourly: Array<{ ts: string; tempC: number | null; aqi: number | null; windMs: number | null; precipMm: number | null }>;
  recommendation: { status: "go" | "delay" | "skip"; score: number; reasons: string[] };
};

type SavedLocation = { id: string; name: string; lat: number; lon: number; created_at: string };

export default function PlannerPage() {
  const [lat, setLat] = useState("38.9869");
  const [lon, setLon] = useState("-76.9426");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConditionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch call #1: get conditions
  async function loadConditions() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/conditions?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = (await res.json()) as ConditionsResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Fetch call #2: list saved locations
  const [saved, setSaved] = useState<SavedLocation[]>([]);
  async function loadSaved() {
    const res = await fetch("/api/locations");
    if (res.ok) setSaved(await res.json());
  }

  // Fetch call #3: save a location
  async function saveCurrent() {
    const name = prompt("Name this location (e.g., My Campus):");
    if (!name) return;
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, lat: Number(lat), lon: Number(lon) })
    });
    if (!res.ok) alert("Save failed");
    await loadSaved();
  }

  useEffect(() => {
    loadSaved();
  }, []);

  const pillClass = useMemo(() => {
    const status = data?.recommendation.status;
    if (status === "go") return "pill good";
    if (status === "delay") return "pill warn";
    if (status === "skip") return "pill bad";
    return "pill";
  }, [data]);

  return (
    <div className="container">
      <div className="nav">
        <div><strong>ClearSkies Planner</strong></div>
        <div className="navlinks">
          <Link href="/">Home</Link>
          <Link href="/planner">Planner</Link>
          <Link href="/about">About</Link>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="grid grid2">
        <div className="card">
          <h1 style={{ marginTop: 0 }}>Planner</h1>

          <div className="row">
            <div>
              <label>Latitude</label>
              <input value={lat} onChange={(e) => setLat(e.target.value)} />
            </div>
            <div>
              <label>Longitude</label>
              <input value={lon} onChange={(e) => setLon(e.target.value)} />
            </div>
            <div style={{ alignSelf: "end" }}>
              <button onClick={loadConditions} disabled={loading}>
                {loading ? "Loading..." : "Get Conditions"}
              </button>
            </div>
            <div style={{ alignSelf: "end" }}>
              <button onClick={saveCurrent}>Save Location</button>
            </div>
          </div>

          <div style={{ height: 12 }} />

          {error && <p className="small" style={{ color: "salmon" }}>{error}</p>}

          {data && (
            <>
              <div className="row">
                <span className={pillClass}>
                  {data.recommendation.status.toUpperCase()} • Score {data.recommendation.score}/100
                </span>
                <span className="pill">AQI: {data.now.aqi ?? "—"}</span>
                <span className="pill">Temp: {data.now.tempC == null ? "—" : `${data.now.tempC.toFixed(1)}°C`}</span>
                <span className="pill">Wind: {data.now.windMs == null ? "—" : `${data.now.windMs.toFixed(1)} m/s`}</span>
              </div>

              <p className="small">
                <strong>Why:</strong> {data.recommendation.reasons.join(" • ")}
              </p>
            </>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Saved Locations (Supabase)</h2>
          <div className="small">
            {saved.length === 0 ? (
              <p>No saved locations yet.</p>
            ) : (
              <ul>
                {saved.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => { setLat(String(s.lat)); setLon(String(s.lon)); }}
                      style={{ marginRight: 8 }}
                    >
                      Load
                    </button>
                    {s.name} ({s.lat.toFixed(4)}, {s.lon.toFixed(4)})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="grid grid2">
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hourly AQI (approx) — next 72h</h2>
          <div style={{ height: 320 }}>
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourly.map(h => ({ ...h, hour: h.ts.slice(11, 16) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="aqi" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="small">Load conditions to display chart.</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>Hourly Temperature (°C)</h2>
          <div style={{ height: 320 }}>
            {data ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.hourly.map(h => ({ ...h, hour: h.ts.slice(11, 16) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="tempC" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="small">Load conditions to display chart.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ height: 16 }} />

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Map</h2>
        <p className="small">This uses Leaflet + OpenStreetMap tiles. Marker shows the chosen lat/lon.</p>
        <MapView lat={Number(lat)} lon={Number(lon)} />
      </div>
    </div>
  );
}
