import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("locations")
      .select("id,name,lat,lon,created_at")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST") {
    const { name, lat, lon } = req.body ?? {};
    if (!name || typeof name !== "string") return res.status(400).json({ error: "Missing name" });
    if (typeof lat !== "number" || typeof lon !== "number") return res.status(400).json({ error: "Missing lat/lon" });

    const { data, error } = await supabase
      .from("locations")
      .insert([{ name, lat, lon }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
