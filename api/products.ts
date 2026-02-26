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
    const { data, error } = await supabase.from("products").select();
    if (error) return res.status(500).json(error);
    return res.json(data);
  }

  if (req.method === "POST") {
    const { name, price, description, image, category, stock } = req.body;
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price: Number(price),
        description,
        image,
        category,
        stock: Number(stock),
      })
      .select();
    if (error) return res.status(500).json(error);
    return res.status(201).json(data[0]);
  }

  res.status(405).json({ error: "Method not allowed" });
}
