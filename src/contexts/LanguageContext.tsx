import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "vi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  en: {
    // Navigation
    "nav.store": "Store",
    "nav.admin": "Admin",
    "nav.debug": "Debug",
    "nav.cart": "Cart",
    "nav.login": "Login",
    "nav.profile": "My Account",
    "nav.logout": "Logout",
    "nav.systemOnline": "SYSTEM ONLINE",

    // Store Hero
    "store.hero.badge": "Limited Edition Drop",
    "store.hero.title": "FUTURE\nCOMMERCE",
    "store.hero.desc":
      "A precision-engineered shopping experience with real-time system monitoring and transparent order tracking.",
    "store.hero.cta": "EXPLORE CATALOG",
    "store.section.title": "CURATED SELECTION",
    "store.section.desc":
      "Handpicked premium hardware for the modern developer.",
    "store.filter.all": "All",
    "store.addToCart": "ADD TO CART",
    "store.outOfStock": "OUT OF STOCK",

    // Cart
    "cart.title": "YOUR CART",
    "cart.empty": "Cart is empty",
    "cart.total": "TOTAL",
    "cart.proceed": "PROCEED TO CHECKOUT",

    // Checkout
    "checkout.shipping": "SHIPPING DETAILS",
    "checkout.shippingDesc": "Where should we send your premium hardware?",
    "checkout.fullName": "Full Name",
    "checkout.emailAddr": "Email Address",
    "checkout.shippingAddr": "Shipping Address",
    "checkout.continue": "CONTINUE TO PAYMENT",
    "checkout.payment": "SECURE PAYMENT",
    "checkout.totalAmount": "Total amount",
    "checkout.cardType": "Card Type",
    "checkout.cardNumber": "Card Number",
    "checkout.cardHolder": "Card Holder",
    "checkout.expires": "Expires",
    "checkout.back": "BACK",
    "checkout.complete": "COMPLETE ORDER",
    "checkout.confirmed": "ORDER CONFIRMED!",
    "checkout.confirmedDesc":
      "Thank you for your purchase. Your order has been received and is being processed by our team.",
    "checkout.return": "RETURN TO STORE",

    // Admin
    "admin.dashboard": "ADMIN DASHBOARD",
    "admin.tabOverview": "Overview",
    "admin.tabProducts": "Products",
    "admin.tabOrders": "Orders",
    "admin.tabPartners": "Partners",
    "admin.totalRevenue": "Total Revenue",
    "admin.totalOrders": "Total Orders",
    "admin.activeProducts": "Active Products",
    "admin.systemHealth": "System Health",
    "admin.revenueTrend": "REVENUE TREND (LAST 7 DAYS)",
    "admin.recentOrders": "RECENT ORDERS",
    "admin.viewAll": "View All Orders",
    "admin.orderId": "Order ID",
    "admin.customer": "Customer",
    "admin.total": "Total",
    "admin.status": "Status",
    "admin.actions": "Actions",
    "admin.noOrders": "No orders found",
    "admin.statusPending": "PENDING",
    "admin.statusConfirmed": "CONFIRMED",
    "admin.statusShipping": "SHIPPING",
    "admin.statusCompleted": "COMPLETED",
    "admin.productMgmt": "PRODUCT MANAGEMENT",
    "admin.addProduct": "Add Product",
    "admin.editProduct": "Edit Product",
    "admin.productName": "Product Name",
    "admin.productPrice": "Price (VNĐ)",
    "admin.productDesc": "Description",
    "admin.productStock": "Stock",
    "admin.productImage": "Image URL",
    "admin.productCategory": "Category",
    "admin.saveChanges": "Save Changes",
    "admin.deleteConfirm": "Delete this product?",
    "admin.partnerMgmt": "PARTNER STORES",
    "admin.partnerDesc": "Review and approve partner store applications",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.approved": "Approved",
    "admin.rejected": "Rejected",
    "admin.partnerPending": "Pending Review",

    // Debug
    "debug.title": "DEBUG CONSOLE",
    "debug.subtitle": "Real-time telemetry from all system layers.",
    "debug.seedData": "SEED DATA",
    "debug.refresh": "REFRESH",
    "debug.purgeLogs": "PURGE LOGS",
    "debug.toggle": "Toggle Debug Console",
    "debug.timestamp": "Timestamp",
    "debug.source": "Source",
    "debug.level": "Level",
    "debug.message": "Message",

    // Profile / User Account
    "profile.title": "MY ACCOUNT",
    "profile.welcome": "Welcome back",
    "profile.role": "Role",
    "profile.email": "Email",
    "profile.orderHistory": "ORDER HISTORY",
    "profile.noOrders": "No orders yet. Start shopping!",
    "profile.orderId": "Order",
    "profile.orderDate": "Date",
    "profile.deliveryBy": "Est. Delivery",
    "profile.items": "Items",
    "profile.total": "Total",
    "profile.status": "Status",
    "profile.goShop": "GO SHOPPING",

    // Auth
    "auth.loginTitle": "SIGN IN",
    "auth.registerTitle": "CREATE ACCOUNT",
    "auth.loginSubtitle": "Sign in to your OmniShop account",
    "auth.registerSubtitle": "Create a new account to start shopping",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.loginBtn": "SIGN IN",
    "auth.registerBtn": "CREATE ACCOUNT",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.testAccounts": "Test Accounts",
    "auth.tab.login": "Login",
    "auth.tab.register": "Register",
    "auth.wrongCredentials": "Incorrect email or password!",
    "auth.passwordMismatch": "Passwords do not match!",
    "auth.emailExists": "Email already registered!",
    "auth.registerSuccess": "Account created! Please login.",

    // Common
    "common.loading": "Loading...",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
  },
  vi: {
    // Navigation
    "nav.store": "Cửa hàng",
    "nav.admin": "Quản trị",
    "nav.debug": "Debug",
    "nav.cart": "Giỏ hàng",
    "nav.login": "Đăng nhập",
    "nav.profile": "Tài khoản",
    "nav.logout": "Đăng xuất",
    "nav.systemOnline": "HỆ THỐNG HOẠT ĐỘNG",

    // Store Hero
    "store.hero.badge": "Phiên bản giới hạn",
    "store.hero.title": "THƯƠNG MẠI\nTƯƠNG LAI",
    "store.hero.desc":
      "Trải nghiệm mua sắm được thiết kế chính xác với giám sát hệ thống thời gian thực và theo dõi đơn hàng minh bạch.",
    "store.hero.cta": "KHÁM PHÁ SẢN PHẨM",
    "store.section.title": "SẢN PHẨM CHỌN LỌC",
    "store.section.desc":
      "Công nghệ cao cấp được tuyển chọn kỹ lưỡng cho người dùng hiện đại.",
    "store.filter.all": "Tất cả",
    "store.addToCart": "THÊM VÀO GIỎ",
    "store.outOfStock": "HẾT HÀNG",

    // Cart
    "cart.title": "GIỎ HÀNG CỦA BẠN",
    "cart.empty": "Giỏ hàng trống",
    "cart.total": "TỔNG CỘNG",
    "cart.proceed": "TIẾN HÀNH THANH TOÁN",

    // Checkout
    "checkout.shipping": "THÔNG TIN GIAO HÀNG",
    "checkout.shippingDesc": "Giao đến địa chỉ nào?",
    "checkout.fullName": "Họ và tên",
    "checkout.emailAddr": "Địa chỉ Email",
    "checkout.shippingAddr": "Địa chỉ giao hàng",
    "checkout.continue": "TIẾP TỤC THANH TOÁN",
    "checkout.payment": "THANH TOÁN AN TOÀN",
    "checkout.totalAmount": "Tổng tiền",
    "checkout.cardType": "Loại thẻ",
    "checkout.cardNumber": "Số thẻ",
    "checkout.cardHolder": "Chủ thẻ",
    "checkout.expires": "Hết hạn",
    "checkout.back": "QUAY LẠI",
    "checkout.complete": "HOÀN TẤT ĐẶT HÀNG",
    "checkout.confirmed": "ĐẶT HÀNG THÀNH CÔNG!",
    "checkout.confirmedDesc":
      "Cảm ơn bạn đã mua hàng. Đơn hàng đã được tiếp nhận và đang được xử lý.",
    "checkout.return": "QUAY LẠI CỬA HÀNG",

    // Admin
    "admin.dashboard": "BẢNG QUẢN TRỊ",
    "admin.tabOverview": "Tổng quan",
    "admin.tabProducts": "Sản phẩm",
    "admin.tabOrders": "Đơn hàng",
    "admin.tabPartners": "Đối tác",
    "admin.totalRevenue": "Tổng doanh thu",
    "admin.totalOrders": "Tổng đơn hàng",
    "admin.activeProducts": "Sản phẩm đang bán",
    "admin.systemHealth": "Trạng thái hệ thống",
    "admin.revenueTrend": "XU HƯỚNG DOANH THU (7 NGÀY QUA)",
    "admin.recentOrders": "ĐƠN HÀNG GẦN ĐÂY",
    "admin.viewAll": "Xem tất cả đơn hàng",
    "admin.orderId": "Mã đơn",
    "admin.customer": "Khách hàng",
    "admin.total": "Tổng tiền",
    "admin.status": "Trạng thái",
    "admin.actions": "Thao tác",
    "admin.noOrders": "Chưa có đơn hàng",
    "admin.statusPending": "CHỜ XỬ LÝ",
    "admin.statusConfirmed": "ĐÃ XÁC NHẬN",
    "admin.statusShipping": "ĐANG GIAO",
    "admin.statusCompleted": "HOÀN THÀNH",
    "admin.productMgmt": "QUẢN LÝ SẢN PHẨM",
    "admin.addProduct": "Thêm sản phẩm",
    "admin.editProduct": "Sửa sản phẩm",
    "admin.productName": "Tên sản phẩm",
    "admin.productPrice": "Giá (VNĐ)",
    "admin.productDesc": "Mô tả",
    "admin.productStock": "Số lượng kho",
    "admin.productImage": "URL ảnh",
    "admin.productCategory": "Danh mục",
    "admin.saveChanges": "Lưu thay đổi",
    "admin.deleteConfirm": "Xóa sản phẩm này?",
    "admin.partnerMgmt": "CỬA HÀNG ĐỐI TÁC",
    "admin.partnerDesc": "Xem xét và phê duyệt đơn đăng ký đối tác",
    "admin.approve": "Phê duyệt",
    "admin.reject": "Từ chối",
    "admin.approved": "Đã duyệt",
    "admin.rejected": "Đã từ chối",
    "admin.partnerPending": "Chờ xét duyệt",

    // Debug
    "debug.title": "BẢNG DEBUG",
    "debug.subtitle": "Giám sát hệ thống thời gian thực.",
    "debug.seedData": "TẠO DỮ LIỆU MẪU",
    "debug.refresh": "LÀM MỚI",
    "debug.purgeLogs": "XÓA LOGS",
    "debug.toggle": "Bảng Debug",
    "debug.timestamp": "Thời gian",
    "debug.source": "Nguồn",
    "debug.level": "Cấp độ",
    "debug.message": "Thông điệp",

    // Profile / User Account
    "profile.title": "TÀI KHOẢN CỦA TÔI",
    "profile.welcome": "Chào mừng trở lại",
    "profile.role": "Vai trò",
    "profile.email": "Email",
    "profile.orderHistory": "LỊCH SỬ ĐƠN HÀNG",
    "profile.noOrders": "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!",
    "profile.orderId": "Đơn hàng",
    "profile.orderDate": "Ngày đặt",
    "profile.deliveryBy": "Dự kiến giao",
    "profile.items": "Sản phẩm",
    "profile.total": "Tổng tiền",
    "profile.status": "Trạng thái",
    "profile.goShop": "MUA SẮM NGAY",

    // Auth
    "auth.loginTitle": "ĐĂNG NHẬP",
    "auth.registerTitle": "TẠO TÀI KHOẢN",
    "auth.loginSubtitle": "Đăng nhập vào tài khoản OmniShop của bạn",
    "auth.registerSubtitle": "Tạo tài khoản mới để bắt đầu mua sắm",
    "auth.email": "Email",
    "auth.password": "Mật khẩu",
    "auth.confirmPassword": "Xác nhận mật khẩu",
    "auth.fullName": "Họ và tên",
    "auth.loginBtn": "ĐĂNG NHẬP",
    "auth.registerBtn": "TẠO TÀI KHOẢN",
    "auth.noAccount": "Chưa có tài khoản?",
    "auth.hasAccount": "Đã có tài khoản?",
    "auth.testAccounts": "Tài khoản test",
    "auth.tab.login": "Đăng nhập",
    "auth.tab.register": "Đăng ký",
    "auth.wrongCredentials": "Email hoặc mật khẩu không đúng!",
    "auth.passwordMismatch": "Mật khẩu xác nhận không khớp!",
    "auth.emailExists": "Email này đã được đăng ký!",
    "auth.registerSuccess": "Tạo tài khoản thành công! Vui lòng đăng nhập.",

    // Common
    "common.loading": "Đang tải...",
    "common.close": "Đóng",
    "common.save": "Lưu",
    "common.cancel": "Hủy",
    "common.delete": "Xóa",
    "common.edit": "Sửa",
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return saved === "en" || saved === "vi" ? saved : "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
