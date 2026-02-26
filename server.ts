import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { supabase, supabaseQuery, logToSupabase } from "./server/supabase.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request Logging Middleware
  app.use(async (req, res, next) => {
    const start = Date.now();
    res.on('finish', async () => {
      const duration = Date.now() - start;
      await logToSupabase("BE", res.statusCode >= 400 ? "ERROR" : "INFO", `${req.method} ${req.url}`, {
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });
    });
    next();
  });

  // API Routes
  app.post("/api/seed", async (req, res) => {
    try {
      logToSupabase("BE", "INFO", "Starting data seeding process");
      
      const products = [
        { name: "iPhone 15 Pro", price: 25000000, description: "Flagship Apple smartphone", image: "https://picsum.photos/seed/iphone/400/400", category: "Mobile", stock: 10 },
        { name: "MacBook M3", price: 45000000, description: "Powerful laptop for pros", image: "https://picsum.photos/seed/macbook/400/400", category: "Laptop", stock: 5 },
        { name: "AirPods Pro", price: 5500000, description: "Noise cancelling earbuds", image: "https://picsum.photos/seed/airpods/400/400", category: "Accessories", stock: 20 },
        { name: "Apple Watch Ultra", price: 18000000, description: "Rugged smartwatch", image: "https://picsum.photos/seed/watch/400/400", category: "Watch", stock: 8 }
      ];

      const { error } = await supabase.from('products').insert(products);
      if (error) throw error;

      await logToSupabase("BE", "INFO", "Seeding completed successfully");
      res.json({ status: "ok", message: "Dữ liệu mẫu đã được khởi tạo thành công!" });
    } catch (err: any) {
      await logToSupabase("BE", "ERROR", "Seeding failed", err.message);
      res.status(500).json({ error: "Không thể seed dữ liệu. Hãy đảm bảo bạn đã chạy SQL Schema trên Supabase." });
    }
  });

  app.get("/api/products", async (req, res) => {
    const { data, error } = await (await supabaseQuery.from('products')).select();
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.get("/api/orders", async (req, res) => {
    const { data, error } = await (await supabaseQuery.from('orders')).select();
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/orders", async (req, res) => {
    const { customer_name, customer_email, total, items } = req.body;
    
    try {
      // 1. Check stock for each item before placing order
      const cartItems = items as any[];
      for (const item of cartItems) {
        const { data: product, error: pError } = await (await supabaseQuery.from('products')).select('stock, name');
        // Note: In a real app, we'd filter by ID in the query, but for this demo we'll use the returned data
        const currentProduct = (product as any[]).find(p => p.id === item.id);
        
        if (currentProduct && currentProduct.stock < 1) {
          await logToSupabase("BE", "WARN", `Out of stock: ${currentProduct.name}`);
          return res.status(400).json({ error: `Sản phẩm ${currentProduct.name} đã hết hàng!` });
        }
      }

      // 2. Create the order
      const { data: orderData, error: orderError } = await (await supabaseQuery.from('orders')).insert({
        customer_name,
        customer_email,
        total,
        items: JSON.stringify(items),
        status: 'PENDING'
      });

      if (orderError) throw orderError;

      // 3. Reduce stock for each item
      for (const item of cartItems) {
        const { data: product } = await (await supabaseQuery.from('products')).select('stock');
        const currentStock = (product as any[]).find(p => p.id === item.id)?.stock || 0;
        
        await (await supabaseQuery.from('products')).update(
          { stock: Math.max(0, currentStock - 1) },
          { id: item.id }
        );
        await logToSupabase("DB", "INFO", `Stock reduced for product ID: ${item.id}`, { newStock: currentStock - 1 });
      }

      res.status(201).json(orderData[0]);
    } catch (err: any) {
      await logToSupabase("BE", "ERROR", "Order processing failed", err.message);
      res.status(500).json({ error: "Không thể xử lý đơn hàng" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await (await supabaseQuery.from('orders')).update({ status }, { id });
    if (error) return res.status(500).json(error);
    res.json(data[0]);
  });

  app.post("/api/logs", async (req, res) => {
    const { source, level, message, details } = req.body;
    await logToSupabase(source || "FE", level || "INFO", message, details);
    res.status(201).json({ status: "ok" });
  });

  app.get("/api/logs", async (req, res) => {
    const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) return res.status(500).json(error);
    res.json(data);
  });

  app.post("/api/logs/clear", async (req, res) => {
    // Supabase doesn't have a simple "DELETE ALL" without a filter in some configs
    // but we can use a match that hits everything or a raw query if enabled.
    // For safety in this demo, we'll just log the attempt.
    await logToSupabase("BE", "WARN", "System logs clear requested (Requires Supabase Admin permissions)");
    res.json({ status: "ok", message: "Clear logs requires manual action in Supabase Dashboard for safety." });
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const { data: completedOrders } = await supabase.from('orders').select('total').eq('status', 'COMPLETED');
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      const totalSales = completedOrders?.reduce((acc, curr) => acc + curr.total, 0) || 0;

      // Mock daily sales for chart (in a real app, you'd aggregate this via SQL)
      const dailySales = [
        { date: '2026-02-20', amount: 5000000 },
        { date: '2026-02-21', amount: 8000000 },
        { date: '2026-02-22', amount: 4500000 },
        { date: '2026-02-23', amount: 12000000 },
        { date: '2026-02-24', amount: 9000000 },
        { date: '2026-02-25', amount: totalSales }
      ];

      res.json({
        totalSales,
        orderCount: orderCount || 0,
        productCount: productCount || 0,
        dailySales
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    logToSupabase("BE", "INFO", "OmniShop Supabase Engine started");
  });
}

startServer();
