import Link from "next/link";

export default function AboutPage() {
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

      <div className="card">
        <h1 style={{ marginTop: 0 }}>About</h1>
        <p className="small">
          Planning outdoor activities often requires checking multiple apps (weather, AQI, pollen, etc.).
          This project simplifies decisions by aggregating public data and producing a transparent recommendation.
        </p>

        <h3>Stakeholders</h3>
        <ul className="small">
          <li>Outdoor exercisers (running, hiking, sports)</li>
          <li>Parents/caregivers planning activities</li>
          <li>Coaches and rec leaders</li>
          <li>Outdoor workers and campus/city wellness offices</li>
        </ul>

        <h3>Data Sources</h3>
        <ul className="small">
          <li>Open-Meteo (hourly weather forecast)</li>
          <li>OpenAQ (air quality measurements)</li>
          <li>OpenStreetMap via Leaflet (maps)</li>
        </ul>

        <p className="small">
          Recommendations use a simple score model (start at 100, subtract penalties for AQI/temperature/wind/precip).
        </p>
      </div>
    </div>
  );
}
