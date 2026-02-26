import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Terminal, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Info, 
  Database as DbIcon,
  LayoutDashboard,
  Package,
  ChevronRight,
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// Import modular types and services
import { Product, LogEntry, Order, Stats } from './types';
import { logger } from './services/logger';

export default function App() {
  const [view, setView] = useState<'shop' | 'debug' | 'admin'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', address: '' });

  // Fetch Data
  const fetchData = useCallback(async () => {
    try {
      const [pRes, lRes, oRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/logs'),
        fetch('/api/orders'),
        fetch('/api/stats')
      ]);
      
      setProducts(await pRes.json());
      setLogs(await lRes.json());
      setOrders(await oRes.json());
      setStats(await sRes.json());
      
      logger.log('INFO', 'System data synchronized with Supabase');
    } catch (err) {
      logger.log('ERROR', 'Data sync failed. Check Supabase credentials.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (view === 'debug' || view === 'admin') fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData, view]);

  const seedData = async () => {
    logger.log('INFO', 'User requested initial data seeding');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      logger.log('ERROR', 'Seed request failed', err);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock < 1) {
      alert("Sản phẩm này đã hết hàng!");
      return;
    }
    setCart([...cart, product]);
    logger.log('INFO', `Added to cart: ${product.name}`);
  };

  const handleCheckout = async () => {
    logger.log('INFO', 'Processing order placement', customerInfo);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          total: cart.reduce((s, i) => s + i.price, 0),
          items: cart
        }),
      });
      if (res.ok) {
        setCheckoutStep(3);
        setCart([]);
        fetchData();
        logger.log('INFO', 'Order placed successfully');
      }
    } catch (err) {
      logger.log('ERROR', 'Checkout failed', err);
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    logger.log('INFO', `Updating order #${id} to ${status}`);
    await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-zinc-900">
            <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            OMNISHOP<span className="text-emerald-600">.</span>
          </h1>
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-400">
            <button onClick={() => setView('shop')} className={`hover:text-zinc-900 transition-colors ${view === 'shop' ? 'text-zinc-900 border-b-2 border-emerald-500' : ''}`}>Store</button>
            <button onClick={() => setView('admin')} className={`hover:text-zinc-900 transition-colors ${view === 'admin' ? 'text-zinc-900 border-b-2 border-emerald-500' : ''}`}>Admin</button>
            <button onClick={() => setView('debug')} className={`hover:text-zinc-900 transition-colors ${view === 'debug' ? 'text-zinc-900 border-b-2 border-emerald-500' : ''}`}>Debug</button>
          </div>
          
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">System Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
          <button className="p-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* View Switcher */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {view === 'shop' && (
          <div className="space-y-16">
            {/* Hero */}
            <section className="relative h-[500px] rounded-[40px] overflow-hidden bg-zinc-900 flex items-center px-16">
              <img src="https://picsum.photos/seed/shop-hero/1200/800" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Hero" />
              <div className="relative z-10 max-w-2xl space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> Limited Edition Drop
                </div>
                <h2 className="text-8xl font-black leading-[0.85] tracking-tighter text-white">
                  FUTURE<br/>COMMERCE<span className="text-emerald-500">.</span>
                </h2>
                <p className="text-zinc-300 text-xl font-medium max-w-lg">A precision-engineered shopping experience with real-time system monitoring and transparent order tracking.</p>
                <button className="bg-white text-zinc-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl">
                  EXPLORE CATALOG
                </button>
              </div>
            </section>

            {/* Products */}
            <section>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-4xl font-black tracking-tighter mb-2">CURATED SELECTION</h3>
                  <p className="text-zinc-500 font-medium">Handpicked premium hardware for the modern developer.</p>
                </div>
                <div className="flex bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm">
                  {['All', 'Mobile', 'Laptop', 'Watch'].map(cat => (
                    <button key={cat} className="px-6 py-2 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {products.map(product => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ y: -10 }}
                    className="group bg-white rounded-[32px] p-6 border border-zinc-200 hover:shadow-2xl transition-all"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 mb-6 relative">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1 block">{product.category}</span>
                          <h4 className="font-bold text-xl leading-tight">{product.name}</h4>
                        </div>
                        <p className="text-xl font-black text-zinc-900">
                          {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                        </p>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full py-4 bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" /> ADD TO CART
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}

        {view === 'admin' && (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter">ADMIN DASHBOARD</h2>
              <div className="flex gap-3">
                <button onClick={fetchData} className="p-3 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50"><RefreshCw className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `${new Intl.NumberFormat('vi-VN').format(stats?.totalSales || 0)}đ`, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Total Orders', value: stats?.orderCount || 0, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Products', value: stats?.productCount || 0, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'System Health', value: '99.9%', icon: CheckCircle2, color: 'text-zinc-600', bg: 'bg-zinc-50' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm">
                  <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm h-[400px]">
              <h3 className="text-xl font-black mb-8">REVENUE TREND (LAST 7 DAYS)</h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={stats?.dailySales || []}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[40px] border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="text-xl font-black">RECENT ORDERS</h3>
                <button className="text-emerald-600 font-bold text-sm hover:underline">View All Orders</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    <tr>
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-8 py-5">Customer</th>
                      <th className="px-8 py-5">Total</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-8 py-6 font-mono font-bold text-zinc-400">#{order.id.toString().padStart(4, '0')}</td>
                        <td className="px-8 py-6">
                          <div className="font-bold">{order.customer_name}</div>
                          <div className="text-xs text-zinc-400">{order.customer_email}</div>
                        </td>
                        <td className="px-8 py-6 font-black text-zinc-900">{new Intl.NumberFormat('vi-VN').format(order.total)}đ</td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'SHIPPING' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'CONFIRMED' ? 'bg-purple-100 text-purple-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {order.status === 'PENDING' && (
                              <button onClick={() => updateOrderStatus(order.id, 'CONFIRMED')} className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"><CheckCircle2 className="w-4 h-4" /></button>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <button onClick={() => updateOrderStatus(order.id, 'SHIPPING')} className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"><Truck className="w-4 h-4" /></button>
                            )}
                            {order.status === 'SHIPPING' && (
                              <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"><Package className="w-4 h-4" /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Journal Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-zinc-900 rounded-[40px] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black tracking-tighter mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-emerald-500" />
                    DEVELOPMENT JOURNAL
                  </h3>
                  <div className="space-y-6">
                    {[
                      { date: '25/02/2026', title: 'Project Initialization', desc: 'Setup Express + Vite + SQLite core engine.' },
                      { date: '25/02/2026', title: 'Pro Shop UI & Checkout', desc: 'Implemented 3-step checkout and modern store view.' },
                      { date: '25/02/2026', title: 'Modular Refactoring', desc: 'Restructured project into clean, maintainable modules.' },
                      { date: '25/02/2026', title: 'Supabase Cloud Migration', desc: 'Migrated to Supabase with deep-integrated telemetry.' }
                    ].map((entry, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          {idx < 3 && <div className="w-0.5 flex-1 bg-zinc-800 my-2" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{entry.date}</p>
                          <h4 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{entry.title}</h4>
                          <p className="text-zinc-500 text-sm">{entry.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 border border-zinc-200 shadow-sm flex flex-col justify-center space-y-6">
                <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Settings className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black tracking-tighter">SYSTEM ARCHITECTURE</h3>
                <p className="text-zinc-500 font-medium">Your project is now structured for high scalability. Each module is isolated and communicates via clean interfaces.</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Modular Backend', 'SQLite Persistence', 'Real-time Logs', 'Responsive UI'].map(tag => (
                    <div key={tag} className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {tag}
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-emerald-600 font-black text-sm hover:gap-4 transition-all mt-4">
                  READ DOCUMENTATION <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'debug' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-black tracking-tighter">DEBUG CONSOLE</h2>
                <p className="text-zinc-500 font-medium mt-2">Real-time telemetry from all system layers.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={seedData}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg"
                >
                  <Database className="w-4 h-4" /> SEED DATA
                </button>
                <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50 transition-all shadow-sm"><RefreshCw className="w-4 h-4" /> REFRESH</button>
                <button onClick={async () => { await fetch('/api/logs/clear', {method:'POST'}); fetchData(); }} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-100 transition-all shadow-sm"><Trash2 className="w-4 h-4" /> PURGE LOGS</button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[40px] p-8 shadow-2xl border border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Level</th>
                      <th className="px-6 py-4">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 font-mono text-xs text-zinc-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="px-6 py-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-black ${
                            log.source === 'FE' ? 'bg-blue-500/20 text-blue-400' :
                            log.source === 'BE' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {log.source}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`font-black text-xs ${log.level === 'ERROR' ? 'text-red-400' : 'text-zinc-400'}`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-zinc-300 font-medium text-sm">{log.message}</div>
                          {log.details && (
                            <pre className="mt-3 p-4 bg-black/50 rounded-2xl text-[10px] text-zinc-500 font-mono border border-white/5 overflow-x-auto max-w-2xl">
                              {log.details}
                            </pre>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">YOUR CART</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-300 space-y-6">
                    <ShoppingCart className="w-24 h-24 opacity-10" />
                    <p className="font-bold text-lg">Cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center p-4 bg-zinc-50 rounded-3xl border border-zinc-100">
                      <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-emerald-600 font-black">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 border-t border-zinc-100 bg-zinc-50 space-y-6">
                <div className="flex items-center justify-between text-2xl font-black">
                  <span>TOTAL</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full bg-zinc-900 text-white py-6 rounded-[24px] font-black text-lg hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-xl"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl">
              <div className="p-10">
                {/* Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                  {[1, 2, 3].map(step => (
                    <div key={step} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                        checkoutStep >= step ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-400'
                      }`}>
                        {checkoutStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                      </div>
                      {step < 3 && <div className={`w-12 h-1 bg-zinc-100 rounded-full ${checkoutStep > step ? 'bg-emerald-600' : ''}`} />}
                    </div>
                  ))}
                </div>

                {checkoutStep === 1 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-3xl font-black tracking-tighter mb-2">SHIPPING DETAILS</h3>
                      <p className="text-zinc-500 font-medium">Where should we send your premium hardware?</p>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="text" placeholder="Full Name" 
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold"
                        value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                      />
                      <input 
                        type="email" placeholder="Email Address" 
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold"
                        value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                      />
                      <textarea 
                        placeholder="Shipping Address" 
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold h-32"
                        value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all"
                    >
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-3xl font-black tracking-tighter mb-2">SECURE PAYMENT</h3>
                      <p className="text-zinc-500 font-medium">Total amount: {new Intl.NumberFormat('vi-VN').format(cartTotal)}đ</p>
                    </div>
                    <div className="p-8 bg-zinc-900 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] -mr-32 -mt-32" />
                      <div className="flex justify-between items-start relative z-10">
                        <CreditCard className="w-12 h-12" />
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Card Type</p>
                          <p className="font-bold">PREMIUM DEBIT</p>
                        </div>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Card Number</p>
                        <p className="text-2xl font-mono tracking-[0.2em]">**** **** **** 4242</p>
                      </div>
                      <div className="flex justify-between relative z-10">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Card Holder</p>
                          <p className="font-bold uppercase">{customerInfo.name || 'VALUED CUSTOMER'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Expires</p>
                          <p className="font-bold">12/28</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setCheckoutStep(1)} className="flex-1 py-6 bg-zinc-100 rounded-2xl font-black hover:bg-zinc-200 transition-all">BACK</button>
                      <button onClick={handleCheckout} className="flex-[2] bg-emerald-600 text-white py-6 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all">COMPLETE ORDER</button>
                    </div>
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="text-center space-y-8 py-10">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black tracking-tighter mb-4">ORDER CONFIRMED!</h3>
                      <p className="text-zinc-500 font-medium max-w-sm mx-auto">Thank you for your purchase. Your order has been received and is being processed by our team.</p>
                    </div>
                    <button 
                      onClick={() => { setIsCheckoutOpen(false); setCheckoutStep(1); setView('shop'); }}
                      className="bg-zinc-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl"
                    >
                      RETURN TO STORE
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Debug Toggle */}
      <button 
        onClick={() => setView(view === 'debug' ? 'shop' : 'debug')}
        className="fixed bottom-10 right-10 w-16 h-16 bg-zinc-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[90] flex items-center justify-center group"
      >
        <Terminal className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute right-full mr-4 px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
          Toggle Debug Console
        </div>
      </button>
    </div>
  );
}
