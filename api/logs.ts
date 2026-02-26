import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return res.status(500).json(error);
    return res.json(data);
  }

  if (req.method === "POST") {
    const { source, level, message, details } = req.body;
    await supabase.from("logs").insert({
      source: source || "FE",
      level: level || "INFO",
      message,
      details: details ? JSON.stringify(details) : null,
    });
    return res.status(201).json({ status: "ok" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
