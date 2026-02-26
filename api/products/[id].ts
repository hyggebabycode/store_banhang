import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  if (req.method === "PATCH") {
    const { name, price, description, image, category, stock } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = Number(price);
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;
    if (category !== undefined) updates.category = category;
    if (stock !== undefined) updates.stock = Number(stock);
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) return res.status(500).json(error);
    return res.json(data[0]);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json(error);
    return res.json({ status: "ok" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
