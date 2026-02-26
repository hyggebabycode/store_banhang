export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  source: 'FE' | 'BE' | 'DB';
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  details: string | null;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED';
  items: string;
  created_at: string;
}

export interface Stats {
  totalSales: number;
  orderCount: number;
  productCount: number;
  dailySales: { date: string, amount: number }[];
}
