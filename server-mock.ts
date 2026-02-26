import express from "express";
import cors from "cors";

// Mock in-memory database
let products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 25000000,
    description: "Flagship Apple smartphone",
    image: "https://picsum.photos/seed/iphone/400/400",
    category: "Mobile",
    stock: 10,
  },
  {
    id: 2,
    name: "MacBook M3",
    price: 45000000,
    description: "Powerful laptop for pros",
    image: "https://picsum.photos/seed/macbook/400/400",
    category: "Laptop",
    stock: 5,
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 5500000,
    description: "Noise cancelling earbuds",
    image: "https://picsum.photos/seed/airpods/400/400",
    category: "Accessories",
    stock: 20,
  },
  {
    id: 4,
    name: "Apple Watch Ultra",
    price: 18000000,
    description: "Rugged smartwatch",
    image: "https://picsum.photos/seed/watch/400/400",
    category: "Watch",
    stock: 8,
  },
];

let orders: any[] = [
  {
    id: 1,
    customer_name: "Nguyễn Văn A",
    customer_email: "nguyenvana@example.com",
    total: 25000000,
    status: "COMPLETED",
    items: JSON.stringify([{ id: 1, name: "iPhone 15 Pro", price: 25000000 }]),
    created_at: new Date("2026-02-20").toISOString(),
  },
  {
    id: 2,
    customer_name: "Trần Thị B",
    customer_email: "tranthib@example.com",
    total: 45000000,
    status: "SHIPPING",
    items: JSON.stringify([{ id: 2, name: "MacBook M3", price: 45000000 }]),
    created_at: new Date("2026-02-22").toISOString(),
  },
];

let logs: any[] = [];
let nextProductId = 5;
let nextOrderId = 3;
let nextLogId = 1;

function log(source: string, level: string, message: string, details?: any) {
  const entry = {
    id: nextLogId++,
    timestamp: new Date().toISOString(),
    source,
    level,
    message,
    details: details ? JSON.stringify(details) : null,
  };
  logs.unshift(entry);
  if (logs.length > 200) logs = logs.slice(0, 200);
  console.log(`[${source}-${level}] ${message}`);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      log(
        "BE",
        res.statusCode >= 400 ? "ERROR" : "INFO",
        `${req.method} ${req.url}`,
        {
          status: res.statusCode,
          duration: `${duration}ms`,
        },
      );
    });
    next();
  });

  // SEED DATA
  app.post("/api/seed", (req, res) => {
    log("BE", "INFO", "Seeding data (mock already seeded)");
    res.json({ status: "ok", message: "Mock data already initialized!" });
  });

  // GET PRODUCTS
  app.get("/api/products", (req, res) => {
    log("DB", "INFO", "SELECT * FROM products");
    res.json(products);
  });

  // ADD PRODUCT
  app.post("/api/products", (req, res) => {
    const { name, price, description, image, category, stock } = req.body;
    const newProduct = {
      id: nextProductId++,
      name,
      price,
      description,
      image,
      category,
      stock: stock || 0,
    };
    products.push(newProduct);
    log("DB", "INFO", `INSERT product: ${name}`);
    res.status(201).json(newProduct);
  });

  // UPDATE PRODUCT
  app.patch("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Product not found" });

    products[index] = { ...products[index], ...req.body };
    log("DB", "INFO", `UPDATE product ID: ${id}`);
    res.json(products[index]);
  });

  // DELETE PRODUCT
  app.delete("/api/products/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Product not found" });

    const deleted = products.splice(index, 1);
    log("DB", "INFO", `DELETE product ID: ${id}`);
    res.json(deleted[0]);
  });

  // GET ORDERS
  app.get("/api/orders", (req, res) => {
    log("DB", "INFO", "SELECT * FROM orders");
    res.json(orders);
  });

  // CREATE ORDER
  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_email, total, items } = req.body;

    // Check stock
    const cartItems = items as any[];
    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.id);
      if (product && product.stock < 1) {
        log("BE", "WARN", `Out of stock: ${product.name}`);
        return res
          .status(400)
          .json({ error: `Sản phẩm ${product.name} đã hết hàng!` });
      }
    }

    // Create order
    const newOrder = {
      id: nextOrderId++,
      customer_name,
      customer_email,
      total,
      status: "PENDING",
      items: JSON.stringify(items),
      created_at: new Date().toISOString(),
    };
    orders.push(newOrder);

    // Reduce stock
    cartItems.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - 1);
        log("DB", "INFO", `Stock reduced for ${product.name}`, {
          newStock: product.stock,
        });
      }
    });

    log("BE", "INFO", `Order created for: ${customer_name}`);
    res.status(201).json(newOrder);
  });

  // UPDATE ORDER STATUS
  app.patch("/api/orders/:id/status", (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const order = orders.find((o) => o.id === id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    log("DB", "INFO", `UPDATE order ${id} status to ${status}`);
    res.json(order);
  });

  // GET LOGS
  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  // ADD LOG
  app.post("/api/logs", (req, res) => {
    const { source, level, message, details } = req.body;
    log(source || "FE", level || "INFO", message, details);
    res.status(201).json({ status: "ok" });
  });

  // CLEAR LOGS
  app.post("/api/logs/clear", (req, res) => {
    logs = [];
    log("BE", "WARN", "Logs cleared");
    res.json({ status: "ok", message: "Logs cleared" });
  });

  // GET STATS
  app.get("/api/stats", (req, res) => {
    const completedOrders = orders.filter((o) => o.status === "COMPLETED");
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);

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
      orderCount: orders.length,
      productCount: products.length,
      dailySales,
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Mock Backend API running on http://localhost:${PORT}`);
    console.log(`📊 In-memory database initialized with sample data`);
    console.log(`\n👥 Current users (customers):`);
    orders.forEach((o) =>
      console.log(`   - ${o.customer_name} (${o.customer_email})`),
    );
    log("BE", "INFO", "Mock Backend started successfully");
  });
}

startServer();
