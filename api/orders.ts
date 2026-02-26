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
    const { data, error } = await supabase.from("orders").select();
    if (error) return res.status(500).json(error);
    return res.json(data);
  }

  if (req.method === "POST") {
    const { customer_name, customer_email, total, items } = req.body;
    try {
      const cartItems = items as any[];
      for (const item of cartItems) {
        const { data: product } = await supabase
          .from("products")
          .select("stock, name")
          .eq("id", item.id)
          .single();
        if (product && product.stock < 1) {
          return res
            .status(400)
            .json({ error: `Sản phẩm ${product.name} đã hết hàng!` });
        }
      }
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name,
          customer_email,
          total,
          items: JSON.stringify(items),
          status: "PENDING",
        })
        .select();
      if (orderError) throw orderError;
      for (const item of cartItems) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();
        await supabase
          .from("products")
          .update({ stock: Math.max(0, (product?.stock || 1) - 1) })
          .eq("id", item.id);
      }
      return res.status(201).json(orderData?.[0] || {});
    } catch (err: any) {
      return res.status(500).json({ error: "Không thể xử lý đơn hàng" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
