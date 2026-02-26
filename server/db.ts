import Database from "better-sqlite3";

export const db = new Database("shop.db");

// Initialize Database with enhanced schema
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT,
    level TEXT,
    message TEXT,
    details TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL,
    description TEXT,
    image TEXT,
    category TEXT,
    stock INTEGER
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_email TEXT,
    total REAL,
    status TEXT DEFAULT 'PENDING',
    items TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insert = db.prepare("INSERT INTO products (name, price, description, image, category, stock) VALUES (?, ?, ?, ?, ?, ?)");
  insert.run("iPhone 15 Pro", 25000000, "Flagship Apple smartphone", "https://picsum.photos/seed/iphone/400/400", "Mobile", 10);
  insert.run("MacBook M3", 45000000, "Powerful laptop for pros", "https://picsum.photos/seed/macbook/400/400", "Laptop", 5);
  insert.run("AirPods Pro", 5500000, "Noise cancelling earbuds", "https://picsum.photos/seed/airpods/400/400", "Accessories", 20);
  insert.run("Apple Watch Ultra", 18000000, "Rugged smartwatch", "https://picsum.photos/seed/watch/400/400", "Watch", 8);
}

export function logToDb(source: string, level: string, message: string, details?: any) {
  try {
    const stmt = db.prepare("INSERT INTO logs (source, level, message, details) VALUES (?, ?, ?, ?)");
    stmt.run(source, level, message, details ? JSON.stringify(details) : null);
  } catch (err) {
    console.error("Critical: Failed to log to DB:", err);
  }
}

export const dbQuery = {
  all: (sql: string, params: any[] = []) => {
    const start = Date.now();
    try {
      const result = db.prepare(sql).all(...params);
      const duration = Date.now() - start;
      logToDb("DB", "INFO", `SQL ALL: ${sql.substring(0, 50)}...`, { duration: `${duration}ms`, params });
      return result;
    } catch (err: any) {
      logToDb("DB", "ERROR", `SQL ERROR: ${err.message}`, { sql, params });
      throw err;
    }
  },
  get: (sql: string, params: any[] = []) => {
    const start = Date.now();
    try {
      const result = db.prepare(sql).get(...params);
      const duration = Date.now() - start;
      logToDb("DB", "INFO", `SQL GET: ${sql.substring(0, 50)}...`, { duration: `${duration}ms`, params });
      return result;
    } catch (err: any) {
      logToDb("DB", "ERROR", `SQL ERROR: ${err.message}`, { sql, params });
      throw err;
    }
  },
  run: (sql: string, params: any[] = []) => {
    const start = Date.now();
    try {
      const result = db.prepare(sql).run(...params);
      const duration = Date.now() - start;
      logToDb("DB", "INFO", `SQL RUN: ${sql.substring(0, 50)}...`, { duration: `${duration}ms`, params });
      return result;
    } catch (err: any) {
      logToDb("DB", "ERROR", `SQL ERROR: ${err.message}`, { sql, params });
      throw err;
    }
  }
};
