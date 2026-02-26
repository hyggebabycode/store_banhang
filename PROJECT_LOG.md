# 📓 PROJECT LOG - OMNISHOP PRO (FULL-STACK CLOUD)

Dự án: **OmniShop Pro** - Nền tảng E-commerce hiện đại tích hợp Giám sát hệ thống (Debug Telemetry).
Ngày khởi tạo: 25/02/2026.
Trạng thái: **Full-stack Cloud Ready**.

---

## 📅 1. TIẾN TRÌNH CÔNG VIỆC (PROGRESS)

### ✅ Giai đoạn 1: Khởi tạo & Đặt nền móng

- Thiết lập môi trường React 19 + Tailwind CSS 4 + Express.js.
- Xây dựng cấu trúc thư mục module hóa: `/src/types`, `/src/services`, `/server/`.
- Triển khai hệ thống Logging cơ bản (SQLite ban đầu).

### ✅ Giai đoạn 2: Hoàn thiện UI/UX & Tính năng Shop

- Thiết kế giao diện Shopfront hiện đại, Mobile-first.
- Xây dựng quy trình **Checkout 3 bước** (Shipping -> Payment -> Success).
- Triển khai **Admin Dashboard** với biểu đồ doanh thu (Recharts) và quản lý đơn hàng.
- Xây dựng **Debug Console** thời gian thực để giám sát hệ thống.

### ✅ Giai đoạn 3: Di chuyển sang Cloud (Supabase)

- Chuyển đổi toàn bộ Database từ SQLite sang **Supabase (PostgreSQL)**.
- Thiết lập Schema Database: `products`, `orders`, `logs`.
- Xây dựng **Supabase Wrapper** (`supabaseQuery`) tích hợp sẵn cơ chế ghi log thời gian thực thi (ms).

### ✅ Giai đoạn 4: Móc nối Toàn diện & Mock Data

- **Móc nối FE-BE-DB**: Kết nối thành công UI Frontend với API Backend và Database Cloud.
- **Inventory Logic**: Backend tự động kiểm tra kho và trừ số lượng hàng khi có đơn hàng mới.
- **Seed Data API**: Xây dựng API `/api/seed` để tự động đổ dữ liệu mẫu vào Database.
- **System Indicator**: Thêm đèn tín hiệu "SYSTEM ONLINE" trên UI để xác nhận kết nối.

### ✅ Giai đoạn 5: Khắc phục sự cố môi trường (26/02/2026)

- **Root cause phát hiện**: Go Live không dùng được với React/TSX - bắt buộc phải qua Vite.
- **Phân biệt backend**: `server-mock.ts` (dữ liệu giả, 4 sản phẩm) vs `server-backend.ts` (Supabase thật, 20+ sản phẩm).
- **Fix `concurrently`**: Lệnh `npm run dev:mock` lỗi trên Windows Git Bash → chạy 2 terminal riêng biệt.
- **Xác nhận Supabase**: Dữ liệu thật vẫn còn nguyên trên Cloud (20 sản phẩm), không bị mất.
- **Tồn đọng**: Bảng `products` có nhiều bản ghi trùng lặp tên do seed nhiều lần.

---

## 🚀 2. TRẠNG THÁI HỆ THỐNG HIỆN TẠI

- **Frontend**: Hoạt động ổn định, chạy qua `npx vite` (port 5173+).
- **Backend**: Chạy qua `npx tsx server-backend.ts` (port 3000), kết nối Supabase.
- **Database**: Supabase Cloud — 20 sản phẩm, có trùng lặp tên cần dọn dẹp.
- **Mock Data**: `server-mock.ts` chỉ dùng để test offline (4 sản phẩm giả, mất khi restart).
- **Lưu ý quan trọng**: KHÔNG dùng Go Live để chạy dự án này.

---

## 🚧 3. NHỮNG VIỆC CẦN LÀM TIẾP THEO (TO-DO)

1. **Supabase Auth**: Tích hợp đăng nhập/đăng ký để bảo vệ trang Admin.
2. **Inventory Management UI**: Xây dựng trang quản lý kho hàng (thêm/sửa/xóa sản phẩm).
3. **Real-time Updates**: Sử dụng Supabase Realtime để cập nhật đơn hàng mới mà không cần refresh.
4. **Search & Filter**: Thêm tính năng tìm kiếm và lọc sản phẩm theo danh mục.
5. **SEO & Performance**: Tối ưu hóa tốc độ tải trang và chỉ số Core Web Vitals.

---

## 🤖 4. CHỈ DẪN CHO AI AGENT TIẾP THEO (AI HANDOVER)

_Yêu cầu AI Agent đọc kỹ và tuân thủ các quy tắc sau:_

1. **Kiến trúc**: Luôn giữ cấu trúc module hóa. Không viết code logic nặng vào `App.tsx`, hãy tách vào `/src/services/` hoặc `/server/`.
2. **Logging**: Mọi API mới hoặc thao tác DB mới PHẢI sử dụng `logToSupabase` hoặc `supabaseQuery` để duy trì hệ thống Debug.
3. **Database**: Không thay đổi Schema mà không cập nhật file `supabase_schema.sql`.
4. **Environment**: Kiểm tra `SUPABASE_URL` và `SUPABASE_ANON_KEY` trước khi thực hiện các tác vụ liên quan đến DB.
5. **UI Style**: Tuân thủ phong cách thiết kế "Clean Utility" với Tailwind CSS 4 và Lucide Icons.

---

_Cập nhật lần cuối: 26/02/2026_
