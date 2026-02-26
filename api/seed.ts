import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

const SEED_PRODUCTS = [
  {
    name: "iPhone 15 Pro",
    price: 25000000,
    description: "Flagship Apple smartphone",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    category: "Mobile",
    stock: 10,
  },
  {
    name: "MacBook M3",
    price: 45000000,
    description: "Powerful laptop for pros",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    category: "Laptop",
    stock: 5,
  },
  {
    name: "AirPods Pro",
    price: 5500000,
    description: "Noise cancelling earbuds",
    image:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop",
    category: "Accessories",
    stock: 20,
  },
  {
    name: "Apple Watch Ultra",
    price: 18000000,
    description: "Rugged smartwatch",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    category: "Watch",
    stock: 8,
  },
];

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { error } = await supabase.from("products").insert(SEED_PRODUCTS);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({
      status: "ok",
      message: "Dữ liệu mẫu đã được khởi tạo thành công!",
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
