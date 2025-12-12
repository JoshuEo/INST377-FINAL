import Link from "next/link";

export default function HomePage() {
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
          <h1 style={{ marginTop: 0 }}>Plan outdoor time with confidence</h1>
          <p className="small">
            We combine <strong>weather</strong> and <strong>air quality</strong> into a transparent
            Go/Delay/Skip recommendation and show the next best activity windows.
          </p>

          <div className="row">
            <Link href="/planner"><button>Open Planner</button></Link>
            <span className="pill">Next.js + Vercel</span>
            <span className="pill">Supabase</span>
            <span className="pill">Open-Meteo + OpenAQ</span>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0 }}>What you can do</h2>
          <ul className="small">
            <li>Search a location by lat/lon (starter)</li>
            <li>View a 72-hour timeline chart</li>
            <li>See a map marker for your chosen point</li>
            <li>Save favorite locations to Supabase</li>
          </ul>
          <p className="small">
            Tip: For UMD College Park try <code>lat=38.9869</code>, <code>lon=-76.9426</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
