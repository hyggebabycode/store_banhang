import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ShoppingCart,
  User,
  Terminal,
  Trash2,
  RefreshCw,
  AlertCircle,
  Package,
  PackageX,
  Search,
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  BarChart3,
  Settings,
  ArrowRight,
  Clock,
  Database,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Pencil,
  Plus,
  Store,
  UserCheck,
  UserX,
  Star,
  Heart,
  Flame,
  History,
  MapPin,
  Sun,
  Moon,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Tag,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import { Product, LogEntry, Order, Stats } from "./types";
import { logger } from "./services/logger";
import { useLanguage } from "./contexts/LanguageContext";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

const STATIC_ACCOUNTS = [
  {
    email: "admin@omnishop.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    email: "user@omnishop.com",
    password: "user123",
    name: "Nguyễn Văn A",
    role: "customer" as const,
  },
  {
    email: "user2@omnishop.com",
    password: "user2pass",
    name: "Trần Thị B",
    role: "customer" as const,
  },
];

const MOCK_PARTNERS = [
  {
    id: 1,
    name: "TechStore VN",
    email: "tech@store.vn",
    category: "Electronics",
    status: "PENDING",
    joinDate: "2026-02-20",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Phụ kiện Apple Hub",
    email: "apple@hub.vn",
    category: "Accessories",
    status: "PENDING",
    joinDate: "2026-02-22",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Laptop World",
    email: "info@laptopworld.vn",
    category: "Computers",
    status: "APPROVED",
    joinDate: "2026-02-15",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Điện tử Minh Khoa",
    email: "minhkhoa@dn.vn",
    category: "Electronics",
    status: "REJECTED",
    joinDate: "2026-02-10",
    rating: 3.1,
  },
];

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  } catch {
    return [];
  }
};
const getStoredPartners = () => {
  try {
    return JSON.parse(localStorage.getItem("registeredPartners") || "[]");
  } catch {
    return [];
  }
};

const getEstimatedDelivery = (createdAt: string): string => {
  const d = new Date(createdAt || Date.now());
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString("vi-VN");
};

const PRICE_RANGES = [
  { labelVi: "100k – 500k", labelEn: "100k – 500k", min: 100000, max: 500000 },
  {
    labelVi: "500k – 1 triệu",
    labelEn: "500k – 1M",
    min: 500000,
    max: 1000000,
  },
  { labelVi: "1tr – 5 triệu", labelEn: "1M – 5M", min: 1000000, max: 5000000 },
  { labelVi: "Trên 5 triệu", labelEn: "Over 5M", min: 5000000, max: Infinity },
];

const PRODUCT_COLORS = [
  { labelVi: "Đen", labelEn: "Black", value: "black", hex: "#18181b" },
  { labelVi: "Trắng", labelEn: "White", value: "white", hex: "#e4e4e7" },
  { labelVi: "Đỏ", labelEn: "Red", value: "red", hex: "#ef4444" },
  { labelVi: "Xanh dương", labelEn: "Blue", value: "blue", hex: "#3b82f6" },
  { labelVi: "Xanh lá", labelEn: "Green", value: "green", hex: "#22c55e" },
  { labelVi: "Vàng", labelEn: "Yellow", value: "yellow", hex: "#eab308" },
  { labelVi: "Hồng", labelEn: "Pink", value: "pink", hex: "#ec4899" },
  { labelVi: "Tím", labelEn: "Purple", value: "purple", hex: "#e8a838" },
  { labelVi: "Cam", labelEn: "Orange", value: "orange", hex: "#f97316" },
];

function getProductImage(product: {
  name?: string;
  category?: string;
  image?: string;
}): string {
  if (product.image && !product.image.includes("picsum.photos"))
    return product.image;
  const name = (product.name || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  if (name.includes("iphone"))
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop";
  if (name.includes("samsung") || name.includes("galaxy"))
    return "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop";
  if (cat === "mobile" || name.includes("phone") || name.includes("điện thoại"))
    return "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400&h=400&fit=crop";
  if (name.includes("macbook"))
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop";
  if (cat === "laptop" || name.includes("laptop") || name.includes("notebook"))
    return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop";
  if (name.includes("airpods"))
    return "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop";
  if (
    name.includes("headphone") ||
    name.includes("earphone") ||
    name.includes("earbuds") ||
    name.includes("tai nghe")
  )
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop";
  if (name.includes("apple watch"))
    return "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop";
  if (cat === "watch" || name.includes("watch") || name.includes("đồng hồ"))
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
  if (name.includes("ipad") || cat === "tablet" || name.includes("tablet"))
    return "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop";
  if (cat === "camera" || name.includes("camera") || name.includes("máy ảnh"))
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop";
  if (
    cat === "gaming" ||
    name.includes("playstation") ||
    name.includes("xbox") ||
    name.includes("nintendo")
  )
    return "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop";
  if (name.includes("speaker") || name.includes("loa"))
    return "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=400&fit=crop";
  if (cat === "accessories")
    return "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop";
  return "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop";
}

export default function App() {
  const { t, language } = useLanguage();
  const [view, setView] = useState<
    "shop" | "products" | "debug" | "admin" | "profile" | "partner"
  >("shop");
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRangeIdx, setPriceRangeIdx] = useState(-1); // -1 = tất cả
  const [colorFilter, setColorFilter] = useState(""); // "" = tất cả
  const [productsCatFilter, setProductsCatFilter] = useState("All");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  // Partner state
  const [partnerTab, setPartnerTab] = useState<
    "products" | "orders" | "revenue"
  >("products");
  const [isPartnerAddOpen, setIsPartnerAddOpen] = useState(false);
  const [partnerAddForm, setPartnerAddForm] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    category: "Mobile",
    stock: 10,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<
    "overview" | "products" | "orders" | "partners"
  >("overview");
  const [partners, setPartners] = useState(() => [
    ...MOCK_PARTNERS,
    ...getStoredPartners(),
  ]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [heroIdx, setHeroIdx] = useState(0);

  // Feature: Coupon
  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  // Feature: Sort
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "name"
  >("default");

  // Feature: Search suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Wow effects
  const [heroMouse, setHeroMouse] = useState({ x: 0.5, y: 0.5 });
  const [flyParticles, setFlyParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [cartBounce, setCartBounce] = useState(false);

  // Product editing (admin)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<
    (Partial<Product> & { isNew?: boolean }) | null
  >(null);

  // Auth
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    role: "admin" | "customer" | "partner";
  } | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "customer" as "customer" | "partner",
    storeName: "",
  });
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Checkout form
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleLogin = () => {
    const allAccounts = [...STATIC_ACCOUNTS, ...getStoredUsers()];
    const found = allAccounts.find(
      (a) => a.email === loginForm.email && a.password === loginForm.password,
    );
    if (found) {
      setCurrentUser({
        email: found.email,
        name: found.name,
        role: found.role,
      });
      setLoginForm({ email: "", password: "" });
      setLoginError("");
      setIsLoginOpen(false);
      logger.log("INFO", `User logged in: ${found.email}`);
    } else {
      setLoginError(t("auth.wrongCredentials"));
    }
  };

  const handleRegister = () => {
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setRegisterError("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (registerForm.password !== registerForm.confirm) {
      setRegisterError(t("auth.passwordMismatch"));
      return;
    }
    const allAccounts = [...STATIC_ACCOUNTS, ...getStoredUsers()];
    if (allAccounts.find((a) => a.email === registerForm.email)) {
      setRegisterError(t("auth.emailExists"));
      return;
    }
    if (registerForm.role === "partner") {
      const newPartner = {
        id: Date.now(),
        name: registerForm.storeName || registerForm.name + "'s Store",
        email: registerForm.email,
        category: "General",
        status: "PENDING",
        joinDate: new Date().toISOString().slice(0, 10),
        rating: 0,
      };
      const storedP = getStoredPartners();
      storedP.push(newPartner);
      localStorage.setItem("registeredPartners", JSON.stringify(storedP));
      setPartners((prev) => [...prev, newPartner]);
    }
    const stored = getStoredUsers();
    stored.push({
      email: registerForm.email,
      password: registerForm.password,
      name: registerForm.name,
      role: (registerForm.role === "partner" ? "partner" : "customer") as
        | "admin"
        | "customer"
        | "partner",
    });
    localStorage.setItem("registeredUsers", JSON.stringify(stored));
    setRegisterSuccess(
      registerForm.role === "partner"
        ? "Đăng ký đối tác thành công! Chờ admin phê duyệt."
        : t("auth.registerSuccess"),
    );
    setRegisterForm({
      name: "",
      email: "",
      password: "",
      confirm: "",
      role: "customer",
      storeName: "",
    });
    setTimeout(() => {
      setAuthTab("login");
      setRegisterSuccess("");
    }, 2000);
    logger.log(
      "INFO",
      `New ${registerForm.role} registered: ${registerForm.email}`,
    );
  };

  const handleLogout = () => {
    logger.log("INFO", `User logged out: ${currentUser?.email}`);
    setCurrentUser(null);
    if (view === "admin" || view === "profile" || view === "partner")
      setView("shop");
  };

  const fetchData = useCallback(async () => {
    try {
      const [pRes, lRes, oRes, sRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/logs"),
        fetch("/api/orders"),
        fetch("/api/stats"),
      ]);
      setProducts(await pRes.json());
      setLogs(await lRes.json());
      setOrders(await oRes.json());
      setStats(await sRes.json());
      logger.log("INFO", "System data synchronized with Supabase");
    } catch (err) {
      logger.log("ERROR", "Data sync failed.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      if (view === "debug" || view === "admin") fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchData, view]);

  // Pre-fill checkout with logged-in user info
  useEffect(() => {
    if (currentUser) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: prev.name || currentUser.name,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  // Hero carousel auto-advance
  useEffect(() => {
    if (products.length < 2) return;
    const timer = setInterval(() => {
      setHeroIdx((i) => (i + 1) % Math.min(products.length, 6));
    }, 3000);
    return () => clearInterval(timer);
  }, [products]);

  const seedData = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      alert(res.ok ? data.message : data.error);
      if (res.ok) fetchData();
    } catch (err) {
      logger.log("ERROR", "Seed failed", err);
    }
  };

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (product.stock < 1) {
      alert(t("store.outOfStock"));
      return;
    }
    setCart([...cart, product]);
    // Cart fly animation
    if (e) {
      const id = Date.now() + Math.random();
      setFlyParticles((p) => [...p, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(
        () => setFlyParticles((p) => p.filter((q) => q.id !== id)),
        900,
      );
    }
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
    logger.log("INFO", `Added to cart: ${product.name}`);
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: currentUser?.name || customerInfo.name,
          customer_email: currentUser?.email || customerInfo.email,
          total: cart.reduce((s, i) => s + i.price, 0),
          items: cart,
        }),
      });
      if (res.ok) {
        setCheckoutStep(3);
        setCart([]);
        fetchData();
      }
    } catch (err) {
      logger.log("ERROR", "Checkout failed", err);
    }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const openEditProduct = (product?: Product) => {
    if (product) setEditingProduct({ ...product, isNew: false });
    else
      setEditingProduct({
        name: "",
        price: 0,
        description: "",
        image: "",
        category: "Mobile",
        stock: 0,
        isNew: true,
      });
    setIsEditProductOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    try {
      if (editingProduct.isNew) {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
      } else {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        });
      }
      fetchData();
      setIsEditProductOpen(false);
      setEditingProduct(null);
    } catch (err) {
      logger.log("ERROR", "Save product failed", err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handlePartnerAction = (id: number, action: "APPROVED" | "REJECTED") => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p)),
    );
    logger.log("INFO", `Partner ID ${id} → ${action}`);
  };

  // Aliases so JSX doesn't need renaming
  const custInfo = customerInfo;
  const setCustInfo = setCustomerInfo;
  const isEditOpen = isEditProductOpen;
  const setIsEditOpen = setIsEditProductOpen;
  const editProd = editingProduct;
  const setEditProd = setEditingProduct;
  const handleSaveProd = handleSaveProduct;
  const handleDelProd = handleDeleteProduct;
  const handlePartner = handlePartnerAction;
  const regForm = registerForm;
  const setRegForm = setRegisterForm;
  const regError = registerError;
  const setRegError = setRegisterError;
  const regSuccess = registerSuccess;
  const setRegSuccess = setRegisterSuccess;
  const showPwd = showPassword;
  const setShowPwd = setShowPassword;
  const showRegPwd = showConfirmPassword;
  const setShowRegPwd = setShowConfirmPassword;
  const openEdit = (p?: Partial<Product> & { isNew?: boolean }) => {
    setEditingProduct(
      p
        ? { ...p }
        : {
            isNew: true,
            name: "",
            price: 0,
            description: "",
            image: "",
            stock: 0,
            category: "Mobile",
          },
    );
    setIsEditProductOpen(true);
  };

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const filteredProducts =
    categoryFilter === "All"
      ? products
      : products.filter((p) => p.category === categoryFilter);
  const productsPageFiltered = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      productsCatFilter === "All" || p.category === productsCatFilter;
    const range = PRICE_RANGES[priceRangeIdx];
    const matchPrice =
      priceRangeIdx === -1 || (p.price >= range.min && p.price < range.max);
    const assignedColor = PRODUCT_COLORS[p.id % PRODUCT_COLORS.length].value;
    const matchColor = colorFilter === "" || assignedColor === colorFilter;
    return matchName && matchCat && matchPrice && matchColor;
  });
  const userOrders = currentUser
    ? orders.filter((o) => o.customer_email === currentUser.email)
    : [];
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Coupon logic
  const COUPONS: Record<string, number> = {
    GHIBLI20: 0.2,
    FIRST10: 0.1,
    SAVE15: 0.15,
  };
  const finalTotal = Math.round(cartTotal * (1 - discount));
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (COUPONS[code]) {
      setDiscount(COUPONS[code]);
      setCouponCode(code);
      setCouponMsg({
        text: `✓ Giảm ${COUPONS[code] * 100}% — Mã "${code}" đã áp dụng!`,
        ok: true,
      });
    } else {
      setCouponMsg({ text: "Mã không hợp lệ", ok: false });
    }
  };

  // Sort logic
  const sortedProducts = [...productsPageFiltered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // Search suggestions
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 6)
    : [];

  // Partner helpers
  const getPartnerListingIds = (email: string): number[] => {
    try {
      return JSON.parse(localStorage.getItem(`pL_${email}`) || "[]");
    } catch {
      return [];
    }
  };
  const partnerListingIds =
    currentUser?.role === "partner"
      ? getPartnerListingIds(currentUser.email)
      : [];
  const partnerOwnProducts = products.filter((p) =>
    partnerListingIds.includes(p.id),
  );
  const partnerRevenue = orders
    .filter((o) => {
      try {
        const items: Product[] = JSON.parse(o.items);
        return items.some((i) => partnerListingIds.includes(i.id));
      } catch {
        return false;
      }
    })
    .reduce((s, o) => s + o.total, 0);
  const partnerInfo = currentUser
    ? partners.find((p) => p.email === currentUser.email)
    : null;

  const handlePartnerAddProduct = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerAddForm),
      });
      if (res.ok) {
        const data = await res.json();
        const newId: number = data?.id ?? data?.[0]?.id ?? Date.now();
        const stored = getPartnerListingIds(currentUser.email);
        stored.push(newId);
        localStorage.setItem(`pL_${currentUser.email}`, JSON.stringify(stored));
        setIsPartnerAddOpen(false);
        setPartnerAddForm({
          name: "",
          price: 0,
          description: "",
          image: "",
          category: "Mobile",
          stock: 10,
        });
        fetchData();
        logger.log(
          "INFO",
          `Partner ${currentUser.email} added product: ${partnerAddForm.name}`,
        );
      }
    } catch (err) {
      logger.log("ERROR", "Partner add product failed", err);
    }
  };

  const fmtVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";
  const statusColor: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-purple-100 text-purple-700",
    SHIPPING: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  const getDeliveryDate = (createdAt?: string) => {
    const d = new Date(createdAt || Date.now());
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("vi-VN");
  };

  /* ═══════════════════════════════ JSX ═══════════════════════════════════ */
  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-zinc-950 text-white" : "bg-slate-100 text-zinc-900"} font-sans`}
      style={{
        backgroundImage: darkMode
          ? "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(106,191,105,0.07) 0%, transparent 60%)"
          : "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(106,191,105,0.04) 0%, transparent 60%)",
      }}
    >
      {/* ── NAVBAR ── */}
      <nav
        className={`sticky top-0 z-50 ${darkMode ? "bg-zinc-950/90 border-white/5" : "bg-white/90 border-zinc-200"} backdrop-blur-xl border-b px-8 py-5 flex items-center justify-between`}
        style={{ boxShadow: "0 0 40px rgba(139,92,246,0.08)" }}
      >
        <div className="flex items-center gap-10">
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-400 to-purple-600 p-2 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl blur-md opacity-50 -z-10" />
            </div>
            <span className={darkMode ? "text-white" : "text-zinc-900"}>
              OMNI
            </span>
            <span className="bg-gradient-to-r from-[#6abf69] to-[#e8a838] bg-clip-text text-transparent">
              SHOP
            </span>
          </h1>
          <div
            className={`hidden lg:flex items-center gap-1 ${darkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"} p-1 rounded-2xl border`}
          >
            {[
              { id: "shop" as const, label: t("nav.store") },
              {
                id: "products" as const,
                label: language === "vi" ? "Sản phẩm" : "Products",
              },
              ...(currentUser?.role === "admin"
                ? [{ id: "admin" as const, label: t("nav.admin") }]
                : []),
              ...(currentUser?.role === "partner"
                ? [
                    {
                      id: "partner" as const,
                      label: language === "vi" ? "Gian hàng" : "My Store",
                    },
                  ]
                : []),
              { id: "debug" as const, label: t("nav.debug") },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                  view === item.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#6abf69] border border-[#6abf69]/30"
                    : darkMode
                      ? "text-zinc-400 hover:text-white hover:bg-white/5"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-[#6abf69]/20">
            <div
              className="w-2 h-2 rounded-full bg-[#6abf69] animate-pulse"
              style={{ boxShadow: "0 0 6px #6abf69" }}
            />
            <span className="text-[10px] font-black text-[#6abf69] uppercase tracking-tighter">
              {t("nav.systemOnline")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`p-2.5 ${darkMode ? "bg-white/5 hover:bg-white/10 border-white/10" : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300"} border rounded-xl transition-all`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-violet-600" />
            )}
          </button>
          <motion.button
            onClick={() => setIsCartOpen(true)}
            animate={cartBounce ? { scale: [1, 1.35, 0.9, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`relative p-2.5 ${darkMode ? "bg-white/5 hover:bg-white/10 border-white/10" : "bg-zinc-100 hover:bg-zinc-200 border-zinc-300"} border rounded-xl transition-all`}
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-[#6abf69] text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                style={{ boxShadow: "0 0 8px #6abf69" }}
              >
                {cart.length}
              </span>
            )}
          </motion.button>
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("profile")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:border-[#6abf69]/40 hover:bg-cyan-500/5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-black text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-black text-white leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">
                    {currentUser.role === "admin"
                      ? "👑 Admin"
                      : currentUser.role === "partner"
                        ? "🏪 Partner"
                        : "👤 Customer"}
                  </p>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
                title={t("nav.logout")}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 font-black text-sm text-black rounded-xl transition-all"
              style={{
                background: "linear-gradient(135deg, #6abf69, #e8a838)",
                boxShadow: "0 0 20px rgba(106,191,105,0.3)",
              }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.login")}</span>
            </button>
          )}
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main
        className="max-w-7xl mx-auto px-6 py-10"
        style={{ position: "relative" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 50, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* ════ SHOP ════ */}
            {view === "shop" && (
              <div className="space-y-16">
                <section
                  className="relative h-[580px] rounded-[40px] overflow-hidden flex items-center px-16"
                  style={{
                    background:
                      "linear-gradient(160deg, #0a2a1a 0%, #132e20 40%, #0e2218 100%)",
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHeroMouse({
                      x: (e.clientX - rect.left) / rect.width,
                      y: (e.clientY - rect.top) / rect.height,
                    });
                  }}
                >
                  {/* Spotlight that follows mouse */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle 320px at ${heroMouse.x * 100}% ${heroMouse.y * 100}%, rgba(106,191,105,0.18) 0%, transparent 70%)`,
                    }}
                  />
                  {/* Grid bg */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(106,191,105,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(106,191,105,0.06) 1px, transparent 1px)",
                      backgroundSize: "60px 60px",
                    }}
                  />
                  {/* Ghibli soft light orbs */}
                  <div
                    className="absolute top-10 right-20 w-96 h-96 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(106,191,105,0.18) 0%, transparent 70%)",
                      filter: "blur(40px)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(232,168,56,0.13) 0%, transparent 70%)",
                      filter: "blur(40px)",
                    }}
                  />
                  {/* Floating Ghibli leaves / dandelion seeds */}
                  {[
                    { top: "15%", left: "10%", delay: 0, size: 8 },
                    { top: "40%", left: "5%", delay: 1.2, size: 6 },
                    { top: "70%", left: "15%", delay: 0.6, size: 10 },
                    { top: "25%", left: "40%", delay: 1.8, size: 7 },
                    { top: "80%", left: "50%", delay: 0.3, size: 5 },
                  ].map((leaf, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        top: leaf.top,
                        left: leaf.left,
                        width: leaf.size,
                        height: leaf.size,
                        background:
                          i % 2 === 0
                            ? "rgba(106,191,105,0.6)"
                            : "rgba(232,168,56,0.5)",
                        boxShadow: `0 0 ${leaf.size * 2}px ${i % 2 === 0 ? "rgba(106,191,105,0.5)" : "rgba(232,168,56,0.4)"}`,
                      }}
                      animate={{
                        y: [0, -18, 0],
                        x: [0, 8, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3 + i * 0.7,
                        repeat: Infinity,
                        delay: leaf.delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  {/* Geometric shapes */}
                  <div className="absolute top-16 right-16 w-48 h-48 border border-[#6abf69]/20 rounded-3xl rotate-12" />
                  <div className="absolute top-24 right-24 w-32 h-32 border border-[#e8a838]/20 rounded-2xl -rotate-6" />
                  <div className="absolute bottom-16 right-48 w-20 h-20 bg-[#6abf69]/5 border border-[#6abf69]/20 rounded-xl rotate-45" />
                  {/* Hero product carousel */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-3">
                    {/* Arrow Left */}
                    {products.length > 1 && (
                      <button
                        onClick={() =>
                          setHeroIdx(
                            (i) =>
                              (i - 1 + Math.min(products.length, 6)) %
                              Math.min(products.length, 6),
                          )
                        }
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
                        style={{
                          background: "rgba(106,191,105,0.15)",
                          border: "1px solid rgba(106,191,105,0.4)",
                          color: "#6abf69",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {/* Image */}
                    <div className="relative w-72 h-72">
                      <div
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(106,191,105,0.3), rgba(232,168,56,0.3))",
                          filter: "blur(30px)",
                        }}
                      />
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={heroIdx}
                          src={getProductImage(products[heroIdx] || {})}
                          initial={{ opacity: 0, x: 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="relative w-full h-full object-cover rounded-3xl opacity-90 cursor-pointer hover:scale-105 transition-transform"
                          alt=""
                          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                          onClick={() => setView("products")}
                          title={
                            language === "vi"
                              ? "Xem tất cả sản phẩm"
                              : "View all products"
                          }
                        />
                      </AnimatePresence>
                      {/* Dot indicators */}
                      {products.length > 1 && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {products.slice(0, 6).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setHeroIdx(i)}
                              className={`rounded-full transition-all duration-300 ${
                                i === heroIdx
                                  ? "w-5 h-1.5 bg-[#6abf69]"
                                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Arrow Right */}
                    {products.length > 1 && (
                      <button
                        onClick={() =>
                          setHeroIdx(
                            (i) => (i + 1) % Math.min(products.length, 6),
                          )
                        }
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110"
                        style={{
                          background: "rgba(106,191,105,0.15)",
                          border: "1px solid rgba(106,191,105,0.4)",
                          color: "#6abf69",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="relative z-10 max-w-xl space-y-8">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-black uppercase tracking-widest"
                      style={{
                        background: "rgba(106,191,105,0.1)",
                        border: "1px solid rgba(232,168,56,0.3)",
                        color: "#6abf69",
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-[#6abf69] animate-pulse"
                        style={{ boxShadow: "0 0 6px #6abf69" }}
                      />
                      <Clock className="w-3 h-3" /> {t("store.hero.badge")}
                    </div>
                    <h2 className="text-7xl font-black leading-[0.9] tracking-tighter">
                      <span className="text-white">
                        {t("store.hero.title")
                          .split(" ")
                          .slice(0, -1)
                          .join(" ")}
                      </span>{" "}
                      <span
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #6abf69, #e8a838)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {t("store.hero.title").split(" ").slice(-1)}
                      </span>
                      <span
                        style={{
                          color: "#6abf69",
                          textShadow: "0 0 20px #6abf69",
                        }}
                      >
                        _
                      </span>
                    </h2>
                    <p className="text-zinc-400 text-lg font-medium max-w-md">
                      {t("store.hero.desc")}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() =>
                          document
                            .getElementById("products-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-8 py-4 font-black text-lg text-black rounded-2xl transition-all hover:scale-105"
                        style={{
                          background:
                            "linear-gradient(135deg, #6abf69, #e8a838)",
                          boxShadow: "0 0 30px rgba(139,92,246,0.4)",
                        }}
                      >
                        {t("store.hero.cta")}
                      </button>
                      <button
                        onClick={() => setView("products")}
                        className="px-8 py-4 font-black text-lg text-white rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
                      >
                        {language === "vi" ? "Khám phá →" : "Explore →"}
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <div
                    id="products-section"
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                  >
                    <div>
                      <h3 className="text-4xl font-black tracking-tighter mb-2">
                        <span
                          style={{
                            backgroundImage:
                              "linear-gradient(135deg, #6abf69, #e8a838)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {t("store.section.title")}
                        </span>
                      </h3>
                      <p className="text-zinc-500 font-medium">
                        {t("store.section.desc")}
                      </p>
                    </div>
                    <div className="flex flex-wrap bg-zinc-900/50 border border-white/10 p-1.5 rounded-2xl gap-1 backdrop-blur-sm">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            categoryFilter === cat
                              ? "text-black font-black"
                              : "text-zinc-400 hover:text-white hover:bg-white/5"
                          }`}
                          style={
                            categoryFilter === cat
                              ? {
                                  background:
                                    "linear-gradient(135deg, #6abf69, #e8a838)",
                                }
                              : {}
                          }
                        >
                          {cat === "All" ? t("store.filter.all") : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  {loading ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {filteredProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ y: -10, scale: 1.02 }}
                          className="group relative rounded-[28px] p-5 transition-all cursor-pointer overflow-hidden"
                          style={
                            darkMode
                              ? {
                                  background:
                                    "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06))",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  backdropFilter: "blur(10px)",
                                }
                              : {
                                  background: "white",
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                                }
                          }
                          onMouseEnter={(e) => (
                            (e.currentTarget.style.border =
                              "1px solid rgba(139,92,246,0.4)"),
                            (e.currentTarget.style.boxShadow =
                              "0 0 30px rgba(139,92,246,0.15)")
                          )}
                          onMouseLeave={(e) => (
                            (e.currentTarget.style.border =
                              "1px solid rgba(255,255,255,0.08)"),
                            (e.currentTarget.style.boxShadow = "none")
                          )}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div
                            className={`aspect-square rounded-2xl overflow-hidden mb-5 ${darkMode ? "bg-zinc-900" : "bg-zinc-100"} relative`}
                          >
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            {product.stock < 1 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-red-400 font-black text-sm uppercase tracking-widest">
                                  OUT
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-3">
                            <span
                              className="text-[10px] font-black uppercase tracking-widest"
                              style={{ color: "#6abf69" }}
                            >
                              {product.category}
                            </span>
                            <div className="flex justify-between items-start gap-2">
                              <h4
                                className={`font-black text-base ${darkMode ? "text-white" : "text-zinc-900"} leading-snug`}
                              >
                                {product.name}
                              </h4>
                              <p
                                className="text-base font-black whitespace-nowrap"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(135deg, #6abf69, #e8a838)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                }}
                              >
                                {fmtVND(product.price)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              disabled={product.stock < 1}
                              className="w-full py-3.5 rounded-xl font-black flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-black"
                              style={
                                product.stock >= 1
                                  ? {
                                      background:
                                        "linear-gradient(135deg, #6abf69, #e8a838)",
                                    }
                                  : {
                                      background: "rgba(255,255,255,0.05)",
                                      color: "#71717a",
                                    }
                              }
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {product.stock < 1
                                ? t("store.outOfStock")
                                : t("store.addToCart")}
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ════ PRODUCTS PAGE ════ */}
            {view === "products" && (
              <div className="space-y-5">
                {/* Header row */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setView("shop")}
                      className={`text-sm font-bold transition-colors ${
                        darkMode
                          ? "text-zinc-400 hover:text-white"
                          : "text-zinc-500 hover:text-zinc-900"
                      }`}
                    >
                      ← {language === "vi" ? "Trang chủ" : "Home"}
                    </button>
                    <span
                      className={darkMode ? "text-zinc-700" : "text-zinc-300"}
                    >
                      /
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "#6abf69" }}
                    >
                      {language === "vi" ? "Sản phẩm" : "Products"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}
                    >
                      {productsPageFiltered.length}{" "}
                      {language === "vi" ? "sản phẩm" : "items"}
                    </span>
                    {(searchQuery ||
                      priceRangeIdx !== -1 ||
                      colorFilter !== "" ||
                      productsCatFilter !== "All") && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setPriceRangeIdx(-1);
                          setColorFilter("");
                          setProductsCatFilter("All");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
                      >
                        <X className="w-3 h-3" />{" "}
                        {language === "vi" ? "Xóa bộ lọc" : "Clear"}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Compact filter bar ── */}
                <div
                  className={`rounded-2xl border ${
                    darkMode
                      ? "bg-zinc-900/80 border-white/8"
                      : "bg-white border-zinc-200 shadow-sm"
                  }`}
                >
                  {/* Row 1: search + toggle button */}
                  <div className="flex items-center gap-3 p-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder={
                          language === "vi"
                            ? "Tìm sản phẩm..."
                            : "Search products..."
                        }
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() =>
                          setTimeout(() => setShowSuggestions(false), 150)
                        }
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${
                          darkMode
                            ? "bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-[#6abf69]/50"
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#6abf69]"
                        }`}
                      />
                      {/* Search suggestions dropdown */}
                      {showSuggestions && searchSuggestions.length > 0 && (
                        <div
                          className={`absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden shadow-2xl z-50 border ${
                            darkMode
                              ? "bg-zinc-800 border-white/10"
                              : "bg-white border-zinc-200"
                          }`}
                        >
                          {searchSuggestions.map((p) => (
                            <button
                              key={p.id}
                              onMouseDown={() => {
                                setSearchQuery(p.name);
                                setShowSuggestions(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all ${
                                darkMode
                                  ? "hover:bg-white/5 text-zinc-200"
                                  : "hover:bg-zinc-50 text-zinc-800"
                              }`}
                            >
                              <Search className="w-3.5 h-3.5 flex-shrink-0 text-zinc-400" />
                              <span className="font-medium">{p.name}</span>
                              <span className="ml-auto text-xs text-zinc-500 font-bold">
                                {p.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border flex-shrink-0 ${
                        showFilters
                          ? "text-black border-transparent"
                          : darkMode
                            ? "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                            : "border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
                      }`}
                      style={
                        showFilters
                          ? {
                              background:
                                "linear-gradient(135deg, #6abf69, #e8a838)",
                            }
                          : {}
                      }
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      {language === "vi" ? "Bộ lọc" : "Filters"}
                      {(priceRangeIdx !== -1 || colorFilter !== "") && (
                        <span className="w-2 h-2 rounded-full bg-[#6abf69]" />
                      )}
                    </button>
                  </div>

                  {/* Row 2: category pills */}
                  <div
                    className={`px-3 pb-3 flex flex-wrap gap-2 border-t ${darkMode ? "border-white/5" : "border-zinc-100"}`}
                  >
                    <div className="w-full" />
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProductsCatFilter(cat)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          productsCatFilter === cat
                            ? "text-black border-transparent"
                            : darkMode
                              ? "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                              : "border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-zinc-50"
                        }`}
                        style={
                          productsCatFilter === cat
                            ? {
                                background:
                                  "linear-gradient(135deg, #6abf69, #e8a838)",
                              }
                            : {}
                        }
                      >
                        {cat === "All"
                          ? language === "vi"
                            ? "Tất cả"
                            : "All"
                          : cat}
                      </button>
                    ))}
                  </div>

                  {/* Expandable: price + color */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className={`px-4 py-4 flex flex-col gap-4 border-t ${darkMode ? "border-white/5" : "border-zinc-100"}`}
                        >
                          {/* Price */}
                          <div className="flex items-center flex-wrap gap-2">
                            <span
                              className={`text-xs font-black uppercase tracking-widest w-16 flex-shrink-0 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}
                            >
                              {language === "vi" ? "💰 Giá" : "💰 Price"}
                            </span>
                            {[
                              {
                                label: language === "vi" ? "Tất cả" : "All",
                                idx: -1,
                              },
                              ...PRICE_RANGES.map((r, i) => ({
                                label:
                                  language === "vi" ? r.labelVi : r.labelEn,
                                idx: i,
                              })),
                            ].map(({ label, idx }) => (
                              <button
                                key={idx}
                                onClick={() => setPriceRangeIdx(idx)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                  priceRangeIdx === idx
                                    ? "text-black border-transparent"
                                    : darkMode
                                      ? "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                                      : "border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
                                }`}
                                style={
                                  priceRangeIdx === idx
                                    ? {
                                        background:
                                          "linear-gradient(135deg, #6abf69, #e8a838)",
                                      }
                                    : {}
                                }
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                          {/* Color */}
                          <div className="flex items-center flex-wrap gap-2">
                            <span
                              className={`text-xs font-black uppercase tracking-widest w-16 flex-shrink-0 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}
                            >
                              {language === "vi" ? "🎨 Màu" : "🎨 Color"}
                            </span>
                            <button
                              onClick={() => setColorFilter("")}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                colorFilter === ""
                                  ? "text-black border-transparent"
                                  : darkMode
                                    ? "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                                    : "border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
                              }`}
                              style={
                                colorFilter === ""
                                  ? {
                                      background:
                                        "linear-gradient(135deg, #6abf69, #e8a838)",
                                    }
                                  : {}
                              }
                            >
                              {language === "vi" ? "Tất cả" : "All"}
                            </button>
                            {PRODUCT_COLORS.map((c) => (
                              <button
                                key={c.value}
                                onClick={() =>
                                  setColorFilter(
                                    colorFilter === c.value ? "" : c.value,
                                  )
                                }
                                title={
                                  language === "vi" ? c.labelVi : c.labelEn
                                }
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                  colorFilter === c.value
                                    ? darkMode
                                      ? "border-[#6abf69]/60 bg-cyan-500/10 text-cyan-300"
                                      : "border-[#6abf69] bg-cyan-50 text-cyan-700"
                                    : darkMode
                                      ? "border-white/10 text-zinc-400 hover:text-white bg-white/5"
                                      : "border-zinc-200 text-zinc-500 hover:text-zinc-900 bg-white"
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                                  style={{ backgroundColor: c.hex }}
                                />
                                {language === "vi" ? c.labelVi : c.labelEn}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Product grid */}
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : productsPageFiltered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <PackageX className="w-16 h-16 text-zinc-600" />
                    <p
                      className={`font-black text-xl ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      {language === "vi"
                        ? "Không tìm thấy sản phẩm nào"
                        : "No products found"}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Sort bar */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-bold ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        {sortedProducts.length}{" "}
                        {language === "vi" ? "sản phẩm" : "products"}
                      </span>
                      <div className="relative">
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-zinc-400" />
                        <select
                          value={sortBy}
                          onChange={(e) =>
                            setSortBy(e.target.value as typeof sortBy)
                          }
                          className={`appearance-none pl-4 pr-9 py-2 rounded-xl text-sm font-bold outline-none border transition-all cursor-pointer ${
                            darkMode
                              ? "bg-zinc-800 border-white/10 text-white"
                              : "bg-white border-zinc-200 text-zinc-900"
                          }`}
                          style={darkMode ? { colorScheme: "dark" } : {}}
                        >
                          <option
                            value="default"
                            className={darkMode ? "bg-zinc-800 text-white" : ""}
                          >
                            {language === "vi" ? "Mặc định" : "Default"}
                          </option>
                          <option
                            value="price-asc"
                            className={darkMode ? "bg-zinc-800 text-white" : ""}
                          >
                            {language === "vi"
                              ? "Giá thấp → cao"
                              : "Price: Low → High"}
                          </option>
                          <option
                            value="price-desc"
                            className={darkMode ? "bg-zinc-800 text-white" : ""}
                          >
                            {language === "vi"
                              ? "Giá cao → thấp"
                              : "Price: High → Low"}
                          </option>
                          <option
                            value="name"
                            className={darkMode ? "bg-zinc-800 text-white" : ""}
                          >
                            {language === "vi" ? "Tên A-Z" : "Name A-Z"}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                      {sortedProducts.map((product) => {
                        const isHot = product.id % 5 < 2;
                        const assignedColor =
                          PRODUCT_COLORS[product.id % PRODUCT_COLORS.length];
                        const isWishlisted = wishlist.has(product.id);
                        return (
                          <motion.div
                            key={product.id}
                            whileHover={{ y: -8, scale: 1.02 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col"
                            style={
                              darkMode
                                ? {
                                    background:
                                      "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    backdropFilter: "blur(12px)",
                                  }
                                : {
                                    background: "white",
                                    border: "1px solid rgba(0,0,0,0.07)",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                                  }
                            }
                            onMouseEnter={(e) => {
                              e.currentTarget.style.border =
                                "1px solid rgba(139,92,246,0.5)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 40px rgba(106,191,105,0.2), 0 0 0 1px rgba(139,92,246,0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.border = darkMode
                                ? "1px solid rgba(255,255,255,0.07)"
                                : "1px solid rgba(0,0,0,0.07)";
                              e.currentTarget.style.boxShadow = darkMode
                                ? "none"
                                : "0 4px 20px rgba(0,0,0,0.06)";
                            }}
                          >
                            {/* Image area */}
                            <div
                              className={`relative overflow-hidden ${darkMode ? "bg-zinc-900" : "bg-zinc-100"}`}
                              style={{ aspectRatio: "3/4" }}
                            >
                              <img
                                src={getProductImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              {/* gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                              {/* HOT badge */}
                              {isHot && product.stock > 0 && (
                                <div
                                  className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black text-white"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #f97316, #ef4444)",
                                    boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
                                  }}
                                >
                                  <Flame className="w-3 h-3" /> HOT
                                </div>
                              )}

                              {/* Color dot */}
                              <div
                                className="absolute top-2.5 right-9 w-3.5 h-3.5 rounded-full border border-white/60 shadow"
                                style={{ backgroundColor: assignedColor.hex }}
                                title={
                                  language === "vi"
                                    ? assignedColor.labelVi
                                    : assignedColor.labelEn
                                }
                              />

                              {/* Wishlist button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setWishlist((prev) => {
                                    const next = new Set(prev);
                                    next.has(product.id)
                                      ? next.delete(product.id)
                                      : next.add(product.id);
                                    return next;
                                  });
                                }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all"
                                style={
                                  isWishlisted
                                    ? {
                                        background: "rgba(239,68,68,0.9)",
                                        boxShadow:
                                          "0 2px 8px rgba(239,68,68,0.5)",
                                      }
                                    : {
                                        background: "rgba(0,0,0,0.35)",
                                        backdropFilter: "blur(4px)",
                                      }
                                }
                              >
                                <Heart
                                  className="w-3 h-3"
                                  fill={isWishlisted ? "white" : "none"}
                                  stroke="white"
                                  strokeWidth={2.5}
                                />
                              </button>

                              {/* Out of stock overlay */}
                              {product.stock < 1 && (
                                <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                                  <span className="text-red-400 font-black text-xs uppercase tracking-widest border border-red-400/40 px-2 py-0.5 rounded-lg">
                                    {language === "vi"
                                      ? "Hết hàng"
                                      : "Out of stock"}
                                  </span>
                                </div>
                              )}

                              {/* Add to cart — slides up on hover */}
                              <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, e);
                                  }}
                                  disabled={product.stock < 1}
                                  className="w-full py-2 rounded-xl font-black flex items-center justify-center gap-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed text-black"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #6abf69, #e8a838)",
                                  }}
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  {language === "vi"
                                    ? "Thêm vào giỏ"
                                    : "Add to cart"}
                                </button>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-3 flex flex-col gap-1.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[9px] font-black uppercase tracking-widest"
                                  style={{ color: "#6abf69" }}
                                >
                                  {product.category}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className="w-2.5 h-2.5"
                                      fill={s <= 4 ? "#eab308" : "none"}
                                      stroke="#eab308"
                                      strokeWidth={2}
                                    />
                                  ))}
                                </div>
                              </div>
                              <h4
                                className={`font-bold text-sm leading-tight line-clamp-2 ${darkMode ? "text-white" : "text-zinc-900"}`}
                              >
                                {product.name}
                              </h4>
                              <div className="flex items-center justify-between mt-0.5">
                                <p
                                  className="text-sm font-black"
                                  style={{
                                    backgroundImage:
                                      "linear-gradient(135deg, #6abf69, #e8a838)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                  }}
                                >
                                  {fmtVND(product.price)}
                                </p>
                                <span
                                  className={`text-[10px] font-medium ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                                >
                                  {product.stock > 0
                                    ? `${product.stock} còn`
                                    : "Hết"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════ PARTNER DASHBOARD ════ */}
            {view === "partner" && currentUser?.role === "partner" && (
              <div className="space-y-8">
                {/* Banner */}
                <div
                  className="rounded-[40px] p-10 flex items-center gap-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(139,92,246,0.12))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(251,146,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.05) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #e8a838)",
                      boxShadow: "0 0 30px rgba(251,146,60,0.4)",
                    }}
                  >
                    🏪
                  </div>
                  <div className="relative flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                        {language === "vi"
                          ? "Gian hàng đối tác"
                          : "Partner Store"}
                      </p>
                      {partnerInfo && (
                        <span
                          className={`text-xs font-black px-3 py-1 rounded-full ${
                            partnerInfo.status === "APPROVED"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : partnerInfo.status === "REJECTED"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {partnerInfo.status === "APPROVED"
                            ? "✓ Đã duyệt"
                            : partnerInfo.status === "REJECTED"
                              ? "✗ Từ chối"
                              : "⏳ Chờ duyệt"}
                        </span>
                      )}
                    </div>
                    <h2 className="text-4xl font-black text-white">
                      {partnerInfo?.name || currentUser.name}
                    </h2>
                    <p className="text-zinc-400 mt-1">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => setIsPartnerAddOpen(true)}
                    className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white text-sm flex-shrink-0 hover:opacity-90 transition-all"
                    style={{
                      background: "linear-gradient(135deg, #fb923c, #e8a838)",
                      boxShadow: "0 0 20px rgba(251,146,60,0.3)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    {language === "vi" ? "Đăng sản phẩm" : "List Product"}
                  </button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {[
                    {
                      label:
                        language === "vi"
                          ? "Sản phẩm đã đăng"
                          : "Products Listed",
                      value: partnerOwnProducts.length,
                      icon: Package,
                      color: "text-orange-400",
                      bg: darkMode ? "bg-orange-500/10" : "bg-orange-50",
                    },
                    {
                      label:
                        language === "vi"
                          ? "Doanh thu ước tính"
                          : "Est. Revenue",
                      value: fmtVND(partnerRevenue),
                      icon: BarChart3,
                      color: "text-emerald-400",
                      bg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
                    },
                    {
                      label:
                        language === "vi"
                          ? "Đơn hàng liên quan"
                          : "Related Orders",
                      value: orders.filter((o) => {
                        try {
                          const items = JSON.parse(o.items);
                          return items.some((i) =>
                            partnerListingIds.includes(i.id),
                          );
                        } catch {
                          return false;
                        }
                      }).length,
                      icon: ShoppingCart,
                      color: "text-[#e8a838]",
                      bg: darkMode ? "bg-purple-500/10" : "bg-purple-50",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? "bg-zinc-800/40 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                    >
                      <div className={`p-3 rounded-2xl ${s.bg}`}>
                        <s.icon className={`w-6 h-6 ${s.color}`} />
                      </div>
                      <div>
                        <p
                          className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}
                        >
                          {s.label}
                        </p>
                        <p
                          className={`text-2xl font-black mt-0.5 ${darkMode ? "text-white" : "text-zinc-900"}`}
                        >
                          {s.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div
                  className={`flex gap-1 p-1 rounded-2xl w-fit border ${darkMode ? "bg-white/5 border-white/10" : "bg-zinc-100 border-zinc-200"}`}
                >
                  {(["products", "orders"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setPartnerTab(tab as "products" | "orders" | "revenue")
                      }
                      className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${
                        partnerTab === tab
                          ? "bg-gradient-to-r from-orange-500/20 to-purple-500/20 text-orange-400 border border-orange-500/30"
                          : darkMode
                            ? "text-zinc-400 hover:text-white hover:bg-white/5"
                            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200"
                      }`}
                    >
                      {tab === "products"
                        ? language === "vi"
                          ? "Sản phẩm"
                          : "Products"
                        : language === "vi"
                          ? "Đơn hàng"
                          : "Orders"}
                    </button>
                  ))}
                </div>

                {/* Products tab */}
                {partnerTab === "products" && (
                  <div>
                    {partnerOwnProducts.length === 0 ? (
                      <div
                        className={`rounded-3xl p-16 text-center border ${darkMode ? "bg-white/3 border-white/8" : "bg-white border-zinc-200"}`}
                      >
                        <Package
                          className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-zinc-700" : "text-zinc-300"}`}
                        />
                        <p
                          className={`font-black text-xl mb-2 ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}
                        >
                          {language === "vi"
                            ? "Chưa có sản phẩm nào"
                            : "No products yet"}
                        </p>
                        <p
                          className={`text-sm mb-6 ${darkMode ? "text-zinc-700" : "text-zinc-400"}`}
                        >
                          {language === "vi"
                            ? "Hãy đăng sản phẩm đầu tiên của bạn!"
                            : "List your first product!"}
                        </p>
                        <button
                          onClick={() => setIsPartnerAddOpen(true)}
                          className="px-6 py-3 rounded-2xl font-black text-white text-sm hover:opacity-90 transition-all"
                          style={{
                            background:
                              "linear-gradient(135deg, #fb923c, #e8a838)",
                          }}
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          {language === "vi" ? "Đăng sản phẩm" : "List Product"}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {partnerOwnProducts.map((p) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`rounded-2xl overflow-hidden border ${darkMode ? "bg-zinc-800/40 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                          >
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={getProductImage(p)}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              <span
                                className={`absolute bottom-2 left-2 text-xs font-black px-2 py-1 rounded-lg ${p.stock > 0 ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"}`}
                              >
                                {p.stock > 0 ? `${p.stock} còn` : "Hết"}
                              </span>
                            </div>
                            <div className="p-4">
                              <p
                                className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? "text-zinc-500" : "text-zinc-400"}`}
                              >
                                {p.category}
                              </p>
                              <h4
                                className={`font-black text-sm leading-tight mb-2 ${darkMode ? "text-white" : "text-zinc-900"}`}
                              >
                                {p.name}
                              </h4>
                              <p className="text-orange-400 font-black">
                                {fmtVND(p.price)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Orders tab */}
                {partnerTab === "orders" && (
                  <div
                    className={`rounded-3xl border overflow-hidden ${darkMode ? "bg-zinc-800/40 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                  >
                    {orders.filter((o) => {
                      try {
                        const items = JSON.parse(o.items);
                        return items.some((i) =>
                          partnerListingIds.includes(i.id),
                        );
                      } catch {
                        return false;
                      }
                    }).length === 0 ? (
                      <div className="p-16 text-center">
                        <ShoppingCart
                          className={`w-12 h-12 mx-auto mb-3 ${darkMode ? "text-zinc-700" : "text-zinc-300"}`}
                        />
                        <p
                          className={`font-bold ${darkMode ? "text-zinc-600" : "text-zinc-400"}`}
                        >
                          {language === "vi"
                            ? "Chưa có đơn hàng"
                            : "No orders yet"}
                        </p>
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr
                            className={`text-xs font-black uppercase tracking-widest ${darkMode ? "text-zinc-500 border-b border-white/8" : "text-zinc-400 border-b border-zinc-100"}`}
                          >
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">
                              {language === "vi" ? "Khách hàng" : "Customer"}
                            </th>
                            <th className="px-6 py-4">
                              {language === "vi" ? "Tổng" : "Total"}
                            </th>
                            <th className="px-6 py-4">
                              {language === "vi" ? "Trạng thái" : "Status"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders
                            .filter((o) => {
                              try {
                                const items = JSON.parse(o.items);
                                return items.some((i) =>
                                  partnerListingIds.includes(i.id),
                                );
                              } catch {
                                return false;
                              }
                            })
                            .map((o) => (
                              <tr
                                key={o.id}
                                className={`border-t text-sm ${darkMode ? "border-white/5 hover:bg-white/3" : "border-zinc-100 hover:bg-zinc-50"}`}
                              >
                                <td
                                  className={`px-6 py-4 font-black ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}
                                >
                                  #{o.id}
                                </td>
                                <td
                                  className={`px-6 py-4 font-medium ${darkMode ? "text-white" : "text-zinc-900"}`}
                                >
                                  {o.customer_name}
                                </td>
                                <td className="px-6 py-4 text-emerald-400 font-black">
                                  {fmtVND(o.total)}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`text-xs font-black px-3 py-1 rounded-full ${statusColor[o.status] || "bg-zinc-100 text-zinc-600"}`}
                                  >
                                    {o.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Partner blocked (not approved) ── */}
            {view === "partner" && currentUser?.role !== "partner" && (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <Lock className="w-16 h-16 text-zinc-300" />
                <h3 className="text-2xl font-black text-zinc-400">
                  Chỉ đối tác mới có thể truy cập
                </h3>
              </div>
            )}

            {/* ════ PROFILE (customer) ════ */}
            {view === "profile" && currentUser && (
              <div className="space-y-10">
                <div
                  className="rounded-[40px] p-10 flex items-center gap-8 relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(106,191,105,0.1))",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black"
                    style={{
                      background: "linear-gradient(135deg, #6abf69, #e8a838)",
                      boxShadow: "0 0 30px rgba(139,92,246,0.4)",
                    }}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="relative">
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-1">
                      {t("profile.welcome")}
                    </p>
                    <h2 className="text-4xl font-black text-white">
                      {currentUser.name}
                    </h2>
                    <p className="text-zinc-400 mt-1">
                      {currentUser.email} ·{" "}
                      <span
                        className="font-bold uppercase"
                        style={{ color: "#6abf69" }}
                      >
                        {currentUser.role}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <History className="w-6 h-6" style={{ color: "#6abf69" }} />
                    <span
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #6abf69, #e8a838)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {t("profile.orderHistory")}
                    </span>
                  </h3>
                  {userOrders.length === 0 ? (
                    <div
                      className="rounded-3xl p-16 text-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <ShoppingCart
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "rgba(255,255,255,0.08)" }}
                      />
                      <p className="text-zinc-500 font-medium">
                        {t("profile.noOrders")}
                      </p>
                      <button
                        onClick={() => setView("shop")}
                        className="mt-6 px-8 py-3 rounded-xl font-black text-black"
                        style={{
                          background:
                            "linear-gradient(135deg, #6abf69, #e8a838)",
                        }}
                      >
                        {t("profile.goShop")}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => {
                        const items =
                          typeof order.items === "string"
                            ? (() => {
                                try {
                                  return JSON.parse(order.items as string);
                                } catch {
                                  return [];
                                }
                              })()
                            : order.items || [];
                        const statusSteps = [
                          "PENDING",
                          "CONFIRMED",
                          "SHIPPING",
                          "COMPLETED",
                        ];
                        const curStep = statusSteps.indexOf(order.status);
                        const stepLabels: Record<string, string> = {
                          PENDING: t("admin.statusPending"),
                          CONFIRMED: t("admin.statusConfirmed"),
                          SHIPPING: t("admin.statusShipping"),
                          COMPLETED: t("admin.statusCompleted"),
                        };
                        return (
                          <div
                            key={order.id}
                            className="rounded-3xl p-6 transition-all"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                  {t("profile.orderId")}
                                </span>
                                <p className="font-black text-xl">
                                  #{order.id.toString().padStart(4, "0")}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                  {t("profile.orderDate")}
                                </span>
                                <p className="font-bold">
                                  {new Date(
                                    order.created_at || Date.now(),
                                  ).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                  {t("profile.deliveryBy")}
                                </span>
                                <p
                                  className="font-bold"
                                  style={{ color: "#6abf69" }}
                                >
                                  {getDeliveryDate(order.created_at)}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                  {t("profile.total")}
                                </span>
                                <p className="font-black text-xl">
                                  {fmtVND(order.total)}
                                </p>
                              </div>
                              <span
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${statusColor[order.status] || "bg-zinc-100 text-zinc-600"}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            {items.length > 0 && (
                              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                                {(items as any[]).map(
                                  (item: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                                    >
                                      <img
                                        src={getProductImage(item)}
                                        className="w-8 h-8 rounded-lg object-cover"
                                        alt={item.name}
                                      />
                                      <span className="text-sm font-bold text-white">
                                        {item.name}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                            {/* Delivery progress */}
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-1">
                              {statusSteps.map((s, i) => (
                                <React.Fragment key={s}>
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i <= curStep ? "text-black" : "bg-white/10 text-zinc-600"}`}
                                      style={
                                        i <= curStep
                                          ? {
                                              background:
                                                "linear-gradient(135deg, #6abf69, #e8a838)",
                                            }
                                          : {}
                                      }
                                    >
                                      {i + 1}
                                    </div>
                                    <span
                                      className={`text-[9px] font-bold mt-1 ${i <= curStep ? "text-[#6abf69]" : "text-zinc-600"}`}
                                    >
                                      {stepLabels[s]}
                                    </span>
                                  </div>
                                  {i < 3 && (
                                    <div
                                      className={`h-1 w-10 rounded mb-4 ${i < curStep ? "bg-gradient-to-r from-[#6abf69] to-[#e8a838]" : "bg-white/10"}`}
                                    />
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ════ ADMIN ════ */}
            {view === "admin" && currentUser?.role === "admin" && (
              <div className="space-y-10">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-4xl font-black tracking-tighter">
                    {t("admin.dashboard")}
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {(
                      ["overview", "products", "orders", "partners"] as const
                    ).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setAdminTab(tab)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${adminTab === tab ? (darkMode ? "bg-white/15 text-white border border-white/20" : "bg-zinc-900 text-white") : darkMode ? "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white" : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"}`}
                      >
                        {t(
                          `admin.tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
                        )}
                      </button>
                    ))}
                    <button
                      onClick={fetchData}
                      className={`p-2.5 ${darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-zinc-300" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"} border rounded-xl`}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {adminTab === "overview" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        {
                          label: t("admin.totalRevenue"),
                          value: fmtVND(stats?.totalSales || 0),
                          icon: BarChart3,
                          color: darkMode
                            ? "text-emerald-400"
                            : "text-emerald-600",
                          bg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
                        },
                        {
                          label: t("admin.totalOrders"),
                          value: stats?.orderCount || 0,
                          icon: ShoppingCart,
                          color: darkMode ? "text-blue-400" : "text-blue-600",
                          bg: darkMode ? "bg-blue-500/10" : "bg-blue-50",
                        },
                        {
                          label: t("admin.activeProducts"),
                          value: stats?.productCount || 0,
                          icon: Package,
                          color: darkMode
                            ? "text-[#e8a838]"
                            : "text-purple-600",
                          bg: darkMode ? "bg-purple-500/10" : "bg-purple-50",
                        },
                        {
                          label: t("admin.systemHealth"),
                          value: "99.9%",
                          icon: CheckCircle2,
                          color: darkMode ? "text-zinc-300" : "text-zinc-600",
                          bg: darkMode ? "bg-zinc-700/50" : "bg-zinc-50",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className={`p-8 rounded-[32px] border ${darkMode ? "bg-zinc-800/50 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                        >
                          <div
                            className={`${s.bg} ${s.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}
                          >
                            <s.icon className="w-6 h-6" />
                          </div>
                          <p
                            className={`${darkMode ? "text-zinc-400" : "text-zinc-500"} font-bold text-sm uppercase tracking-widest mb-1`}
                          >
                            {s.label}
                          </p>
                          <p className="text-3xl font-black">
                            {String(s.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`p-8 rounded-[40px] border h-[360px] ${darkMode ? "bg-zinc-800/40 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                    >
                      <h3 className="text-xl font-black mb-8">
                        {t("admin.revenueTrend")}
                      </h3>
                      <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={stats?.dailySales || []}>
                          <defs>
                            <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={
                              darkMode ? "rgba(255,255,255,0.06)" : "#f1f5f9"
                            }
                          />
                          <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "16px",
                              border: "none",
                              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#10b981"
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#ga)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {adminTab === "products" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black">
                        {t("admin.productMgmt")}
                      </h3>
                      <button
                        onClick={() => openEdit()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        {t("admin.addProduct")}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          className={`rounded-3xl border overflow-hidden transition-all ${darkMode ? "bg-zinc-800/50 border-white/8 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]" : "bg-white border-zinc-200 shadow-sm hover:shadow-lg"}`}
                        >
                          <img
                            src={getProductImage(p)}
                            className="w-full h-40 object-cover"
                            alt={p.name}
                          />
                          <div className="p-5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                              {p.category}
                            </span>
                            <h4 className="font-black text-lg mt-1 mb-1">
                              {p.name}
                            </h4>
                            <p
                              className={`text-xl font-black ${darkMode ? "" : "text-zinc-900"} mb-1`}
                            >
                              {fmtVND(p.price)}
                            </p>
                            <p className="text-xs text-zinc-400 mb-4">
                              {t("admin.productStock")}: {p.stock}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEdit(p)}
                                className={`flex-1 flex items-center justify-center gap-1 py-2 ${darkMode ? "bg-white/10 hover:bg-white/15 text-zinc-200" : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"} rounded-xl font-bold text-sm`}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                {t("common.edit")}
                              </button>
                              <button
                                onClick={() => handleDelProd(p.id)}
                                className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {t("common.delete")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "orders" && (
                  <div
                    className={`rounded-[40px] border overflow-hidden ${darkMode ? "bg-zinc-800/40 border-white/8" : "bg-white border-zinc-200 shadow-sm"}`}
                  >
                    <div
                      className={`p-8 border-b ${darkMode ? "border-white/8" : "border-zinc-100"}`}
                    >
                      <h3 className="text-xl font-black">
                        {t("admin.recentOrders")}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead
                          className={`text-[10px] font-black uppercase tracking-[0.2em] ${darkMode ? "bg-white/5 text-zinc-500" : "bg-zinc-50 text-zinc-400"}`}
                        >
                          <tr>
                            {[
                              t("admin.orderId"),
                              t("admin.customer"),
                              t("admin.total"),
                              t("admin.status"),
                              t("admin.actions"),
                            ].map((h) => (
                              <th key={h} className="px-8 py-5">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody
                          className={`divide-y ${darkMode ? "divide-white/5" : "divide-zinc-100"}`}
                        >
                          {orders.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-8 py-16 text-center text-zinc-400 font-medium"
                              >
                                {t("admin.noOrders")}
                              </td>
                            </tr>
                          ) : (
                            orders.map((order) => (
                              <tr
                                key={order.id}
                                className={`transition-colors ${darkMode ? "hover:bg-white/3" : "hover:bg-zinc-50/50"}`}
                              >
                                <td className="px-8 py-6 font-mono font-bold text-zinc-400">
                                  #{order.id.toString().padStart(4, "0")}
                                </td>
                                <td className="px-8 py-6">
                                  <div className="font-bold">
                                    {order.customer_name}
                                  </div>
                                  <div className="text-xs text-zinc-400">
                                    {order.customer_email}
                                  </div>
                                </td>
                                <td className="px-8 py-6 font-black">
                                  {fmtVND(order.total)}
                                </td>
                                <td className="px-8 py-6">
                                  <span
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${statusColor[order.status] || ""}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex gap-2">
                                    {order.status === "PENDING" && (
                                      <button
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            "CONFIRMED",
                                          )
                                        }
                                        title="Confirm"
                                        className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-emerald-600 transition-all"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                      </button>
                                    )}
                                    {order.status === "CONFIRMED" && (
                                      <button
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            "SHIPPING",
                                          )
                                        }
                                        title="Ship"
                                        className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-blue-600 transition-all"
                                      >
                                        <Truck className="w-4 h-4" />
                                      </button>
                                    )}
                                    {order.status === "SHIPPING" && (
                                      <button
                                        onClick={() =>
                                          updateOrderStatus(
                                            order.id,
                                            "COMPLETED",
                                          )
                                        }
                                        title="Done"
                                        className="p-2 bg-zinc-900 text-white rounded-lg hover:bg-emerald-600 transition-all"
                                      >
                                        <Package className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {adminTab === "partners" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black">
                        {t("admin.partnerMgmt")}
                      </h3>
                      <p className="text-zinc-500 mt-1">
                        {t("admin.partnerDesc")}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {partners.map((p) => (
                        <div
                          key={p.id}
                          className={`rounded-3xl border p-6 transition-all ${darkMode ? "bg-zinc-800/50 border-white/8 hover:border-[#6abf69]/30" : "bg-white border-zinc-200 shadow-sm hover:shadow-md"}`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-black text-xl">{p.name}</h4>
                              <p className="text-zinc-400 text-sm">{p.email}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${statusColor[p.status] || "bg-zinc-100 text-zinc-600"}`}
                            >
                              {t(`admin.${p.status.toLowerCase()}`)}
                            </span>
                          </div>
                          <div className="flex gap-3 text-sm text-zinc-500 mb-5">
                            <span className="font-bold text-zinc-700 bg-zinc-100 px-2 py-1 rounded-lg">
                              {p.category}
                            </span>
                            <span>📅 {p.joinDate}</span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              {p.rating}
                            </span>
                          </div>
                          {p.status === "PENDING" && (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handlePartner(p.id, "APPROVED")}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm"
                              >
                                <UserCheck className="w-4 h-4" />
                                {t("admin.approve")}
                              </button>
                              <button
                                onClick={() => handlePartner(p.id, "REJECTED")}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all text-sm"
                              >
                                <UserX className="w-4 h-4" />
                                {t("admin.reject")}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin blocked */}
            {view === "admin" && currentUser?.role !== "admin" && (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                <Lock className="w-16 h-16 text-zinc-300" />
                <h3 className="text-2xl font-black text-zinc-400">
                  Chỉ Admin mới có thể truy cập
                </h3>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
                >
                  {t("nav.login")}
                </button>
              </div>
            )}

            {/* ════ DEBUG ════ */}
            {view === "debug" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter">
                      {t("debug.title")}
                    </h2>
                    <p className="text-zinc-500 font-medium mt-2">
                      {t("debug.subtitle")}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={async () => {
                        const r = await fetch("/api/seed", { method: "POST" });
                        const d = await r.json();
                        alert(r.ok ? d.message : d.error);
                        fetchData();
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700"
                    >
                      <Database className="w-4 h-4" />
                      {t("debug.seedData")}
                    </button>
                    <button
                      onClick={fetchData}
                      className="flex items-center gap-2 px-5 py-3 bg-white border border-zinc-200 rounded-2xl font-bold hover:bg-zinc-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t("debug.refresh")}
                    </button>
                    <button
                      onClick={async () => {
                        await fetch("/api/logs/clear", { method: "POST" });
                        fetchData();
                      }}
                      className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("debug.purgeLogs")}
                    </button>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-[40px] p-8 shadow-2xl border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-white/10">
                        <tr>
                          {[
                            t("debug.timestamp"),
                            t("debug.source"),
                            t("debug.level"),
                            t("debug.message"),
                          ].map((h) => (
                            <th key={h} className="px-6 py-4">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-5 font-mono text-xs text-zinc-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`px-2 py-1 rounded text-[10px] font-black ${log.source === "FE" ? "bg-blue-500/20 text-blue-400" : log.source === "BE" ? "bg-[#e8a838]/20 text-[#e8a838]" : "bg-amber-500/20 text-amber-400"}`}
                              >
                                {log.source}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span
                                className={`font-black text-xs ${log.level === "ERROR" ? "text-red-400" : "text-zinc-400"}`}
                              >
                                {log.level}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-zinc-300 font-medium text-sm">
                                {log.message}
                              </div>
                              {log.details && (
                                <pre className="mt-2 p-3 bg-black/50 rounded-xl text-[10px] text-zinc-500 font-mono overflow-x-auto max-w-2xl">
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
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60]"
            />
            <div className="fixed inset-0 z-[61] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl rounded-[32px] overflow-y-auto max-h-[92vh]"
                style={{
                  background: darkMode
                    ? "linear-gradient(135deg, #18181b, #1c1c22)"
                    : "white",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-2/5 relative">
                    <img
                      src={getProductImage(selectedProduct)}
                      alt={selectedProduct.name}
                      className="w-full h-64 sm:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {selectedProduct.stock < 1 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-red-400 font-black text-sm uppercase tracking-widest border border-red-400/40 px-3 py-1 rounded-xl">
                          {language === "vi" ? "Hết hàng" : "Out of stock"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="sm:w-3/5 p-8 flex flex-col gap-5">
                    <div>
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: "#6abf69" }}
                      >
                        {selectedProduct.category}
                      </span>
                      <h2
                        className={`text-2xl font-black mt-1 leading-tight ${
                          darkMode ? "text-white" : "text-zinc-900"
                        }`}
                      >
                        {selectedProduct.name}
                      </h2>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-4 h-4"
                          fill={s <= 4 ? "#eab308" : "none"}
                          stroke="#eab308"
                          strokeWidth={2}
                        />
                      ))}
                      <span
                        className={`text-sm font-bold ml-1 ${darkMode ? "text-zinc-400" : "text-zinc-500"}`}
                      >
                        4.0 / 5
                      </span>
                    </div>

                    {/* Price */}
                    <p
                      className="text-3xl font-black"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #6abf69, #e8a838)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {fmtVND(selectedProduct.price)}
                    </p>

                    {/* Description */}
                    {selectedProduct.description && (
                      <p
                        className={`text-sm leading-relaxed ${darkMode ? "text-zinc-400" : "text-zinc-600"}`}
                      >
                        {selectedProduct.description}
                      </p>
                    )}

                    {/* Stock info */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedProduct.stock > 0
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-bold ${selectedProduct.stock > 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {selectedProduct.stock > 0
                          ? `${language === "vi" ? "Còn" : "In stock"}: ${selectedProduct.stock} ${language === "vi" ? "sản phẩm" : "items"}`
                          : language === "vi"
                            ? "Hết hàng"
                            : "Out of stock"}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <button
                        onClick={(e) => {
                          addToCart(selectedProduct, e);
                          setSelectedProduct(null);
                        }}
                        disabled={selectedProduct.stock < 1}
                        className="flex-1 py-3.5 rounded-2xl font-black flex items-center justify-center gap-2 text-sm text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:opacity-90"
                        style={{
                          background:
                            "linear-gradient(135deg, #6abf69, #e8a838)",
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {selectedProduct.stock < 1
                          ? language === "vi"
                            ? "Hết hàng"
                            : "Out of stock"
                          : language === "vi"
                            ? "Thêm vào giỏ"
                            : "Add to cart"}
                      </button>
                      <button
                        onClick={() => {
                          setWishlist((prev) => {
                            const next = new Set(prev);
                            next.has(selectedProduct.id)
                              ? next.delete(selectedProduct.id)
                              : next.add(selectedProduct.id);
                            return next;
                          });
                        }}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
                        style={{
                          background: wishlist.has(selectedProduct.id)
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(255,255,255,0.07)",
                          border: wishlist.has(selectedProduct.id)
                            ? "1px solid rgba(239,68,68,0.4)"
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <Heart
                          className="w-5 h-5"
                          fill={
                            wishlist.has(selectedProduct.id)
                              ? "#ef4444"
                              : "none"
                          }
                          stroke={
                            wishlist.has(selectedProduct.id)
                              ? "#ef4444"
                              : "#a1a1aa"
                          }
                          strokeWidth={2}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Related Products */}
                {(() => {
                  const related = products
                    .filter(
                      (p) =>
                        p.category === selectedProduct.category &&
                        p.id !== selectedProduct.id,
                    )
                    .slice(0, 4);
                  if (related.length === 0) return null;
                  return (
                    <div
                      className={`border-t px-8 py-6 ${darkMode ? "border-white/10" : "border-zinc-100"}`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: "#6abf69" }}
                        />
                        <p
                          className="text-sm font-black uppercase tracking-widest"
                          style={{ color: "#6abf69" }}
                        >
                          {language === "vi"
                            ? "Sản phẩm liên quan"
                            : "Related Products"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {related.map((rp) => (
                          <button
                            key={rp.id}
                            onClick={() => setSelectedProduct(rp)}
                            className={`rounded-2xl overflow-hidden text-left transition-all hover:scale-105 border ${
                              darkMode
                                ? "border-white/5 hover:border-white/15"
                                : "border-zinc-100 hover:border-zinc-200"
                            }`}
                          >
                            <img
                              src={getProductImage(rp)}
                              alt={rp.name}
                              className="w-full h-20 object-cover"
                            />
                            <div
                              className={`p-2 ${darkMode ? "bg-white/3" : "bg-zinc-50"}`}
                            >
                              <p
                                className={`text-xs font-black leading-snug truncate ${darkMode ? "text-white" : "text-zinc-900"}`}
                              >
                                {rp.name}
                              </p>
                              <p
                                className="text-xs font-bold"
                                style={{ color: "#6abf69" }}
                              >
                                {fmtVND(rp.price)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 h-full w-full max-w-md z-[70] shadow-2xl flex flex-col ${darkMode ? "bg-zinc-900 text-white" : "bg-white text-zinc-900"}`}
            >
              <div
                className={`p-8 border-b flex items-center justify-between ${darkMode ? "border-white/10" : "border-zinc-100"}`}
              >
                <h3 className="text-2xl font-black tracking-tighter">
                  {t("cart.title")}
                </h3>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className={`p-2 rounded-full transition-all ${darkMode ? "hover:bg-white/10" : "hover:bg-zinc-100"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {cart.length === 0 ? (
                  <div
                    className={`h-full flex flex-col items-center justify-center space-y-4 ${darkMode ? "text-zinc-600" : "text-zinc-300"}`}
                  >
                    <ShoppingCart className="w-24 h-24 opacity-30" />
                    <p className="font-bold text-lg">{t("cart.empty")}</p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-4 items-center p-4 rounded-3xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-zinc-50 border-zinc-100"}`}
                    >
                      <img
                        src={getProductImage(item)}
                        className="w-16 h-16 rounded-2xl object-cover"
                        alt={item.name}
                      />
                      <div className="flex-1">
                        <h4
                          className={`font-bold ${darkMode ? "text-white" : "text-zinc-900"}`}
                        >
                          {item.name}
                        </h4>
                        <p className="text-emerald-500 font-black">
                          {fmtVND(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setCart(cart.filter((_, i) => i !== idx))
                        }
                        className={`p-2 rounded-xl transition-all ${darkMode ? "text-zinc-500 hover:text-red-400 hover:bg-red-400/10" : "text-zinc-400 hover:text-red-500 hover:bg-red-50"}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div
                className={`p-8 border-t space-y-4 ${darkMode ? "border-white/10 bg-zinc-800/50" : "border-zinc-100 bg-zinc-50"}`}
              >
                {/* Coupon input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder={
                        language === "vi"
                          ? "Nhập mã giảm giá..."
                          : "Coupon code..."
                      }
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponMsg(null);
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium outline-none border transition-all ${
                        darkMode
                          ? "bg-white/5 border-white/10 text-white placeholder-zinc-500"
                          : "bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400"
                      }`}
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90 flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #6abf69, #e8a838)",
                    }}
                  >
                    {language === "vi" ? "Áp dụng" : "Apply"}
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-xs font-bold ${couponMsg.ok ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {couponMsg.text}
                  </p>
                )}
                <div
                  className={`flex items-center justify-between text-2xl font-black ${darkMode ? "text-white" : "text-zinc-900"}`}
                >
                  <span>{t("cart.total")}</span>
                  <div className="text-right">
                    {discount > 0 && (
                      <p className="text-sm font-bold text-zinc-400 line-through mb-0.5">
                        {fmtVND(cartTotal)}
                      </p>
                    )}
                    <span
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #6abf69, #e8a838)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {fmtVND(finalTotal)}
                    </span>
                  </div>
                </div>
                <button
                  disabled={cart.length === 0}
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full text-white py-6 rounded-[24px] font-black text-lg hover:opacity-90 transition-all disabled:opacity-40 shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #6abf69, #e8a838)",
                  }}
                >
                  {t("cart.proceed")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-center gap-4 mb-10">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${checkoutStep >= step ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-400"}`}
                      >
                        {checkoutStep > step ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          step
                        )}
                      </div>
                      {step < 3 && (
                        <div
                          className={`w-12 h-1 rounded-full ${checkoutStep > step ? "bg-emerald-600" : "bg-zinc-100"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {checkoutStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-3xl font-black mb-2">
                        {t("checkout.shipping")}
                      </h3>
                      <p className="text-zinc-500">
                        {t("checkout.shippingDesc")}
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder={t("checkout.fullName")}
                      value={custInfo.name}
                      onChange={(e) =>
                        setCustInfo({ ...custInfo, name: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                    />
                    <input
                      type="email"
                      placeholder={t("checkout.emailAddr")}
                      value={custInfo.email}
                      onChange={(e) =>
                        setCustInfo({ ...custInfo, email: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                    />
                    <textarea
                      placeholder={t("checkout.shippingAddr")}
                      value={custInfo.address}
                      onChange={(e) =>
                        setCustInfo({ ...custInfo, address: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold h-28"
                    />
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all"
                    >
                      {t("checkout.continue")}
                    </button>
                  </div>
                )}
                {checkoutStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-3xl font-black mb-2">
                        {t("checkout.payment")}
                      </h3>
                      <p className="text-zinc-500">
                        {t("checkout.totalAmount")}: {fmtVND(cartTotal)}
                      </p>
                    </div>
                    <div className="p-8 bg-zinc-900 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[100px] -mr-32 -mt-32" />
                      <div className="flex justify-between items-start relative z-10">
                        <CreditCard className="w-12 h-12" />
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            {t("checkout.cardType")}
                          </p>
                          <p className="font-bold">PREMIUM DEBIT</p>
                        </div>
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          {t("checkout.cardNumber")}
                        </p>
                        <p className="text-2xl font-mono tracking-[0.2em]">
                          **** **** **** 4242
                        </p>
                      </div>
                      <div className="flex justify-between relative z-10">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            {t("checkout.cardHolder")}
                          </p>
                          <p className="font-bold uppercase">
                            {custInfo.name || "VALUED CUSTOMER"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            {t("checkout.expires")}
                          </p>
                          <p className="font-bold">12/28</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="flex-1 py-6 bg-zinc-100 rounded-2xl font-black hover:bg-zinc-200"
                      >
                        {t("checkout.back")}
                      </button>
                      <button
                        onClick={handleCheckout}
                        className="flex-[2] bg-emerald-600 text-white py-6 rounded-2xl font-black text-lg hover:bg-emerald-700"
                      >
                        {t("checkout.complete")}
                      </button>
                    </div>
                  </div>
                )}
                {checkoutStep === 3 && (
                  <div className="text-center space-y-8 py-10">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black tracking-tighter mb-4">
                        {t("checkout.confirmed")}
                      </h3>
                      <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                        {t("checkout.confirmedDesc")}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setCheckoutStep(1);
                        setView("shop");
                      }}
                      className="bg-zinc-900 text-white px-12 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl"
                    >
                      {t("checkout.return")}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PRODUCT EDIT MODAL (admin) ── */}
      <AnimatePresence>
        {isEditOpen && editProd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-950 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="bg-zinc-900 px-8 py-6 text-white flex items-center justify-between">
                <h2 className="text-xl font-black">
                  {editProd.isNew
                    ? t("admin.addProduct")
                    : t("admin.editProduct")}
                </h2>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                {[
                  {
                    key: "name" as keyof Product,
                    label: t("admin.productName"),
                    type: "text",
                  },
                  {
                    key: "price" as keyof Product,
                    label: t("admin.productPrice"),
                    type: "number",
                  },
                  {
                    key: "description" as keyof Product,
                    label: t("admin.productDesc"),
                    type: "text",
                  },
                  {
                    key: "image" as keyof Product,
                    label: t("admin.productImage"),
                    type: "text",
                  },
                  {
                    key: "stock" as keyof Product,
                    label: t("admin.productStock"),
                    type: "number",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1 block">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={(editProd as any)[f.key] || ""}
                      onChange={(e) =>
                        setEditProd({
                          ...editProd,
                          [f.key]:
                            f.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1 block">
                    {t("admin.productCategory")}
                  </label>
                  <select
                    value={editProd.category || "Mobile"}
                    onChange={(e) =>
                      setEditProd({ ...editProd, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[
                      "Mobile",
                      "Laptop",
                      "Accessories",
                      "Watch",
                      "Computers",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSaveProd}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black hover:bg-emerald-600 transition-all"
                >
                  {t("admin.saveChanges")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── LOGIN / REGISTER MODAL ── */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsLoginOpen(false);
                setLoginError("");
                setRegError("");
                setRegSuccess("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-zinc-950 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="bg-zinc-900 px-8 py-8 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black">
                      {authTab === "login"
                        ? t("auth.loginTitle")
                        : t("auth.registerTitle")}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoginOpen(false);
                      setLoginError("");
                      setRegError("");
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      setAuthTab("login");
                      setLoginError("");
                      setRegError("");
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authTab === "login" ? "bg-white text-zinc-900" : "text-white/70 hover:text-white"}`}
                  >
                    {t("auth.tab.login")}
                  </button>
                  <button
                    onClick={() => {
                      setAuthTab("register");
                      setLoginError("");
                      setRegError("");
                    }}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${authTab === "register" ? "bg-white text-zinc-900" : "text-white/70 hover:text-white"}`}
                  >
                    {t("auth.tab.register")}
                  </button>
                </div>
              </div>

              {authTab === "login" && (
                <div className="px-8 py-6 space-y-4">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      {t("auth.testAccounts")}
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          label: "👑 Admin",
                          email: "admin@omnishop.com",
                          pw: "admin123",
                        },
                        {
                          label: "👤 Customer",
                          email: "user@omnishop.com",
                          pw: "user123",
                        },
                      ].map((a) => (
                        <button
                          key={a.email}
                          onClick={() =>
                            setLoginForm({ email: a.email, password: a.pw })
                          }
                          className="w-full text-left p-2.5 bg-zinc-800 rounded-xl border border-emerald-500/30 hover:border-emerald-400 transition-colors"
                        >
                          <p className="text-xs font-black text-zinc-100">
                            {a.label}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-mono">
                            {a.email} / {a.pw}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  {loginError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-sm text-red-400 font-medium">
                        {loginError}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.email")}
                    </label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPwd ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPwd ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black hover:bg-emerald-600 transition-all"
                  >
                    {t("auth.loginBtn")}
                  </button>
                </div>
              )}

              {authTab === "register" && (
                <div className="px-8 py-6 space-y-4">
                  {regError && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-sm text-red-400 font-medium">
                        {regError}
                      </p>
                    </div>
                  )}
                  {regSuccess && (
                    <div className="flex items-center gap-2 p-3 bg-cyan-500/10 rounded-xl border border-[#6abf69]/20">
                      <CheckCircle2 className="w-4 h-4 text-[#6abf69] shrink-0" />
                      <p className="text-sm text-[#6abf69] font-medium">
                        {regSuccess}
                      </p>
                    </div>
                  )}
                  {/* Role selector */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {language === "vi" ? "Loại tài khoản" : "Account type"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          val: "customer" as const,
                          icon: "👤",
                          label: language === "vi" ? "Khách hàng" : "Customer",
                        },
                        {
                          val: "partner" as const,
                          icon: "🏪",
                          label:
                            language === "vi"
                              ? "Đối tác cửa hàng"
                              : "Store Partner",
                        },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() =>
                            setRegForm({ ...regForm, role: opt.val })
                          }
                          className={`flex items-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${
                            regForm.role === opt.val
                              ? "border-[#6abf69]/60 bg-cyan-500/10 text-[#6abf69]"
                              : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className="text-lg">{opt.icon}</span>
                          {opt.label}
                          {regForm.role === opt.val && (
                            <span className="ml-auto text-[#6abf69]">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {regForm.role === "partner" && (
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                        {language === "vi" ? "Tên cửa hàng" : "Store Name"}
                      </label>
                      <input
                        type="text"
                        value={regForm.storeName}
                        onChange={(e) =>
                          setRegForm({ ...regForm, storeName: e.target.value })
                        }
                        placeholder={
                          language === "vi"
                            ? "Cửa hàng của tôi"
                            : "My Awesome Store"
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-cyan-500 focus:border-[#6abf69]/50 transition-all"
                      />
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.fullName")}
                    </label>
                    <input
                      type="text"
                      value={regForm.name}
                      onChange={(e) =>
                        setRegForm({ ...regForm, name: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.email")}
                    </label>
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={(e) =>
                        setRegForm({ ...regForm, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showRegPwd ? "text" : "password"}
                        value={regForm.password}
                        onChange={(e) =>
                          setRegForm({ ...regForm, password: e.target.value })
                        }
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPwd(!showRegPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showRegPwd ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                      {t("auth.confirmPassword")}
                    </label>
                    <input
                      type="password"
                      value={regForm.confirm}
                      onChange={(e) =>
                        setRegForm({ ...regForm, confirm: e.target.value })
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleRegister}
                    className="w-full py-4 rounded-xl font-black text-black transition-all hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #6abf69, #e8a838)",
                      boxShadow: "0 0 20px rgba(106,191,105,0.3)",
                    }}
                  >
                    {t("auth.registerBtn")}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── PARTNER ADD PRODUCT MODAL ── */}
      <AnimatePresence>
        {isPartnerAddOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsPartnerAddOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-zinc-950 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/10"
            >
              <div
                className="px-8 py-6 text-white flex items-center justify-between"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,146,60,0.2), rgba(106,191,105,0.2))",
                }}
              >
                <h2 className="text-xl font-black">
                  {language === "vi"
                    ? "🏪 Đăng sản phẩm mới"
                    : "🏪 List New Product"}
                </h2>
                <button
                  onClick={() => setIsPartnerAddOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                {[
                  {
                    key: "name",
                    label: language === "vi" ? "Tên sản phẩm" : "Product name",
                    type: "text",
                  },
                  {
                    key: "price",
                    label: language === "vi" ? "Giá (VNĐ)" : "Price (VND)",
                    type: "number",
                  },
                  {
                    key: "description",
                    label: language === "vi" ? "Mô tả" : "Description",
                    type: "text",
                  },
                  {
                    key: "image",
                    label: language === "vi" ? "URL ảnh" : "Image URL",
                    type: "text",
                  },
                  {
                    key: "stock",
                    label:
                      language === "vi" ? "Số lượng tồn kho" : "Stock quantity",
                    type: "number",
                  },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-bold text-zinc-400 mb-1 block">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      value={
                        (partnerAddForm as Record<string, string | number>)[
                          f.key
                        ]
                      }
                      onChange={(e) =>
                        setPartnerAddForm((prev) => ({
                          ...prev,
                          [f.key]:
                            f.type === "number"
                              ? Number(e.target.value)
                              : e.target.value,
                        }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-orange-400/50 transition-all"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-bold text-zinc-400 mb-1 block">
                    {language === "vi" ? "Danh mục" : "Category"}
                  </label>
                  <select
                    value={partnerAddForm.category}
                    onChange={(e) =>
                      setPartnerAddForm((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none focus:border-orange-400/50 transition-all"
                  >
                    {[
                      "Mobile",
                      "Laptop",
                      "Audio",
                      "Accessories",
                      "Wearables",
                      "Gaming",
                    ].map((c) => (
                      <option key={c} value={c} className="bg-zinc-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handlePartnerAddProduct}
                  disabled={!partnerAddForm.name || !partnerAddForm.price}
                  className="w-full text-white py-4 rounded-xl font-black hover:opacity-90 transition-all disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #fb923c, #e8a838)",
                  }}
                >
                  {language === "vi" ? "Đăng sản phẩm" : "List Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── FALLING LEAVES ── */}
      <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
        {[
          {
            id: 0,
            left: "7%",
            size: 10,
            dur: 12,
            delay: 0,
            color: "#6abf69",
            sway: 35,
          },
          {
            id: 1,
            left: "17%",
            size: 7,
            dur: 9,
            delay: -3.5,
            color: "#a8d5a2",
            sway: 25,
          },
          {
            id: 2,
            left: "28%",
            size: 13,
            dur: 14,
            delay: -7,
            color: "#e8a838",
            sway: 45,
          },
          {
            id: 3,
            left: "38%",
            size: 8,
            dur: 10,
            delay: -1.5,
            color: "#c5e8a0",
            sway: 30,
          },
          {
            id: 4,
            left: "50%",
            size: 11,
            dur: 11,
            delay: -9,
            color: "#6abf69",
            sway: 40,
          },
          {
            id: 5,
            left: "61%",
            size: 6,
            dur: 8,
            delay: -5,
            color: "#a8d5a2",
            sway: 20,
          },
          {
            id: 6,
            left: "72%",
            size: 9,
            dur: 13,
            delay: -2,
            color: "#e8a838",
            sway: 50,
          },
          {
            id: 7,
            left: "82%",
            size: 12,
            dur: 10,
            delay: -8,
            color: "#6abf69",
            sway: 35,
          },
          {
            id: 8,
            left: "91%",
            size: 7,
            dur: 11,
            delay: -4,
            color: "#c5e8a0",
            sway: 30,
          },
          {
            id: 9,
            left: "13%",
            size: 9,
            dur: 9,
            delay: -6,
            color: "#e8a838",
            sway: 40,
          },
          {
            id: 10,
            left: "45%",
            size: 6,
            dur: 15,
            delay: -11,
            color: "#a8d5a2",
            sway: 25,
          },
          {
            id: 11,
            left: "67%",
            size: 10,
            dur: 12,
            delay: -0.5,
            color: "#6abf69",
            sway: 45,
          },
        ].map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute opacity-60"
            style={{
              left: leaf.left,
              top: "-20px",
              width: leaf.size,
              height: leaf.size * 1.5,
              background: leaf.color,
              borderRadius: "50% 0 50% 0",
              filter: "blur(0.5px)",
            }}
            animate={{
              y: ["0vh", "108vh"],
              x: [0, leaf.sway, 0, -leaf.sway, 0],
              rotate: [0, 120, 240, 360],
              opacity: [0, 0.6, 0.6, 0.6, 0],
            }}
            transition={{
              duration: leaf.dur,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.1, 0.5, 0.9, 1],
            }}
          />
        ))}
      </div>

      {/* ── CART FLY PARTICLES ── */}
      <AnimatePresence>
        {flyParticles.map((p) => (
          <motion.div
            key={p.id}
            className="fixed z-[999] w-6 h-6 rounded-full pointer-events-none flex items-center justify-center text-xs"
            style={{
              left: p.x - 12,
              top: p.y - 12,
              background: "linear-gradient(135deg, #6abf69, #e8a838)",
              boxShadow: "0 0 12px rgba(106,191,105,0.8)",
            }}
            initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
            animate={{
              scale: [1, 1.4, 0.4],
              opacity: [1, 1, 0],
              x:
                typeof window !== "undefined"
                  ? window.innerWidth - p.x - 60
                  : 300,
              y: typeof window !== "undefined" ? 30 - p.y : -200,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            <ShoppingCart className="w-3 h-3 text-black" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── FLOATING DEBUG BUTTON ── */}
      <button
        onClick={() => setView(view === "debug" ? "shop" : "debug")}
        className="fixed bottom-10 right-10 w-16 h-16 bg-zinc-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[90] flex items-center justify-center group"
      >
        <Terminal className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute right-full mr-4 px-4 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
          {t("debug.toggle")}
        </div>
      </button>
    </div>
  );
}
