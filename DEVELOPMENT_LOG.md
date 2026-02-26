# 📓 Nhật ký Phát triển - OmniShop Pro

Dự án khởi tạo vào ngày 25/02/2026 với mục tiêu xây dựng một nền tảng E-commerce chuẩn mực, tích hợp hệ thống giám sát lỗi (Debug) toàn diện.

---

## 📅 Giai đoạn 1: Khởi tạo & Đặt nền móng (25/02/2026 - 20:20)
- **Khởi tạo dự án**: Thiết lập môi trường Full-stack với Express và Vite.
- **Cấu trúc Database**: Thiết kế Schema cho Sản phẩm, Đơn hàng và đặc biệt là bảng `logs` để phục vụ việc dò lỗi.
- **Hệ thống Logging v1**: Triển khai cơ chế ghi log cơ bản từ Backend vào SQLite.
- **UI Wireframe**: Phác thảo giao diện Shop và Debug Console dạng Text.

## 📅 Giai đoạn 2: Hoàn thiện Tính năng & UI (25/02/2026 - 20:25)
- **Giao diện Shop Pro**: Triển khai giao diện mua hàng hiện đại, hỗ trợ Mobile-first.
- **Luồng Thanh toán**: Xây dựng quy trình Checkout 3 bước (Shipping -> Payment -> Success).
- **Admin Dashboard**: Thêm biểu đồ doanh thu (Recharts) và quản lý trạng thái đơn hàng 4 bước (Pending -> Confirmed -> Shipping -> Completed).
- **Debug Console v2**: Nâng cấp bảng điều khiển log với khả năng lọc nguồn (FE, BE, DB) và xem chi tiết dữ liệu JSON.

## 📅 Giai đoạn 3: Tái cấu trúc Module hóa (25/02/2026 - 21:35)
- **Refactoring**: Tách biệt logic thành các module nhỏ để dễ bảo trì.
    - `/server/db.ts`: Quản lý Database & SQL Logging.
    - `/src/types/`: Định nghĩa Type hệ thống.
    - `/src/services/`: Dịch vụ Logging & API.
- **Tối ưu hiệu năng**: Tích hợp Wrapper cho Database để đo lường thời gian thực thi của từng câu lệnh SQL.
- **Tài liệu hóa**: Viết `README.md` và `DEVELOPMENT_LOG.md`.

## 📅 Giai đoạn 4: Di chuyển sang Cloud (Supabase) (25/02/2026 - 22:00)
- **Supabase Migration**: Chuyển đổi toàn bộ hệ thống từ SQLite sang Supabase (PostgreSQL).
- **Cloud Database Schema**: Thiết lập bảng `products`, `orders`, `logs` trên Supabase với các ràng buộc dữ liệu chặt chẽ.
- **Supabase Wrapper**: Xây dựng module `/server/supabase.ts` tích hợp sẵn cơ chế tự động ghi log cho mọi thao tác DB.
- **Environment Config**: Cấu hình biến môi trường `SUPABASE_URL` và `SUPABASE_ANON_KEY`.

---

## 📋 Trạng thái Hiện tại & Kế hoạch Tiếp theo

### ✅ Đã hoàn thành (Done)
- [x] Khởi tạo dự án Full-stack.
- [x] Xây dựng UI Shop, Admin, Debug Console.
- [x] Quy trình Thanh toán 3 bước.
- [x] Quản lý đơn hàng 4 bước.
- [x] Tái cấu trúc Module hóa.
- [x] Di chuyển Database sang Supabase.
- [x] Hệ thống Logging tích hợp sâu (FE, BE, DB).

### 🚧 Đang thực hiện (Doing)
- [ ] Hoàn thiện tài liệu bàn giao cho AI (Handover Guide).
- [ ] Kiểm thử luồng dữ liệu trên môi trường Supabase thực tế.

### 📅 Sắp làm (To-do)
- [ ] Tích hợp Supabase Auth (Đăng nhập/Đăng ký).
- [ ] Xây dựng trang Quản lý Kho hàng (Inventory Management) chi tiết.
- [ ] Tích hợp thông báo thời gian thực (Real-time Notifications) qua Supabase Realtime.
- [ ] Tối ưu hóa SEO và Performance cho Frontend.

---

## 💡 Tư duy Thiết kế (Design Philosophy)
1. **Transparency (Minh bạch)**: Mọi hoạt động của hệ thống đều phải được ghi lại (Logged).
2. **Clean Utility**: Giao diện tập trung vào sự tinh tế, sạch sẽ nhưng vẫn đầy đủ công năng.
3. **Cloud Native**: Ưu tiên sử dụng các dịch vụ Cloud mạnh mẽ (Supabase) để đảm bảo tính sẵn sàng và mở rộng.
