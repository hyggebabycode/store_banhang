import express from "express";
import cors from "cors";
import { supabase, logToSupabase } from "./server/supabase.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Request Logging Middleware
  app.use(async (req, res, next) => {
    const start = Date.now();
    res.on("finish", async () => {
      const duration = Date.now() - start;
      await logToSupabase(
        "BE",
        res.statusCode >= 400 ? "ERROR" : "INFO",
        `${req.method} ${req.url}`,
        {
          status: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip,
        },
      );
    });
    next();
  });

  // API Routes
  app.post("/api/seed", async (req, res) => {
    try {
      logToSupabase("BE", "INFO", "Starting data seeding process");

      const products = [
        {
          name: "iPhone 15 Pro",
          price: 25000000,
          description: "Flagship Apple smartphone",
          image: "https://picsum.photos/seed/iphone/400/400",
          category: "Mobile",
          stock: 10,
        },
        {
          name: "MacBook M3",
          price: 45000000,
          description: "Powerful laptop for pros",
          image: "https://picsum.photos/seed/macbook/400/400",
          category: "Laptop",
          stock: 5,
        },
        {
          name: "AirPods Pro",
          price: 5500000,
          description: "Noise cancelling earbuds",
          image: "https://picsum.photos/seed/airpods/400/400",
          category: "Accessories",
          stock: 20,
        },
        {
          name: "Apple Watch Ultra",
          price: 18000000,
          description: "Rugged smartwatch",
          image: "https://picsum.photos/seed/watch/400/400",
          category: "Watch",
          stock: 8,
        },
      ];

      const { error } = await supabase.from("products").insert(products);
      if (error) throw error;

      await logToSupabase("BE", "INFO", "Seeding completed successfully");
      res.json({
        status: "ok",
        message: "Dữ liệu mẫu đã được khởi tạo thành công!",
      });
    } catch (err: any) {
      await logToSupabase("BE", "ERROR", "Seeding failed", err.message);
      res.status(500).json({
        error:
          "Không thể seed dữ liệu. Hãy đảm bảo bạn đã chạy SQL Schema trên Supabase.",
      });
    }
  });

  app.get("/api/products", async (req, res) => {
    const { data, error } = await supabase.from("products").select();
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/products", async (req, res) => {
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
    await logToSupabase("BE", "INFO", `Product created: ${name}`);
    res.status(201).json(data[0]);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const { id } = req.params;
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
    await logToSupabase("BE", "INFO", `Product updated: ID ${id}`);
    res.json(data[0]);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(500).json(error);
    await logToSupabase("BE", "INFO", `Product deleted: ID ${id}`);
    res.json({ status: "ok" });
  });

  app.get("/api/orders", async (req, res) => {
    const { data, error } = await supabase.from("orders").select();
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/orders", async (req, res) => {
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
          await logToSupabase("BE", "WARN", `Out of stock: ${product.name}`);
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

        const currentStock = product ? product.stock : 0;

        await supabase
          .from("products")
          .update({ stock: Math.max(0, currentStock - 1) })
          .eq("id", item.id);

        await logToSupabase(
          "DB",
          "INFO",
          `Stock reduced for product ID: ${item.id}`,
          { newStock: currentStock - 1 },
        );
      }

      res.status(201).json(orderData ? orderData[0] : {});
    } catch (err: any) {
      await logToSupabase(
        "BE",
        "ERROR",
        "Order processing failed",
        err.message,
      );
      res.status(500).json({ error: "Không thể xử lý đơn hàng" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select();
    if (error) return res.status(500).json(error);
    res.json(data[0]);
  });

  app.post("/api/logs", async (req, res) => {
    const { source, level, message, details } = req.body;
    await logToSupabase(source || "FE", level || "INFO", message, details);
    res.status(201).json({ status: "ok" });
  });

  app.get("/api/logs", async (req, res) => {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/logs/clear", async (req, res) => {
    await logToSupabase("BE", "WARN", "System logs clear requested");
    res.json({
      status: "ok",
      message:
        "Clear logs requires manual action in Supabase Dashboard for safety.",
    });
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("total")
        .eq("status", "COMPLETED");
      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });
      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const totalSales =
        completedOrders?.reduce((acc, curr) => acc + curr.total, 0) || 0;

      const dailySales = [
        { date: "2026-02-20", amount: 5000000 },
        { date: "2026-02-21", amount: 8000000 },
        { date: "2026-02-22", amount: 4500000 },
        { date: "2026-02-23", amount: 12000000 },
        { date: "2026-02-24", amount: 9000000 },
        { date: "2026-02-25", amount: totalSales },
      ];

      res.json({
        totalSales,
        orderCount: orderCount || 0,
        productCount: productCount || 0,
        dailySales,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
    logToSupabase("BE", "INFO", "OmniShop Backend started");
  });
}

startServer();
