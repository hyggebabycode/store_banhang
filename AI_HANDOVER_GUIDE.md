# 🤖 AI Handover Guide - Backend Development

Tài liệu này dành cho AI Agent tiếp theo để tiếp quản và phát triển phần Backend cho dự án OmniShop Pro.

## 🏗 Kiến trúc Hiện tại
- **Framework**: Express.js (Node.js).
- **Database**: Supabase (PostgreSQL).
- **Logging**: Hệ thống Logging 3 lớp (FE, BE, DB) lưu trữ trực tiếp vào bảng `logs` trên Supabase.

## 📂 Các file quan trọng
- `/server.ts`: Entry point của server, chứa các API routes.
- `/server/supabase.ts`: Module kết nối Supabase và Wrapper ghi log.
- `/supabase_schema.sql`: Mã nguồn SQL để khởi tạo Database trên Supabase.

## 🗄 Database Schema
Hệ thống sử dụng 3 bảng chính:
1. `products`: Lưu trữ thông tin sản phẩm.
2. `orders`: Lưu trữ thông tin đơn hàng (items lưu dạng JSONB).
3. `logs`: Lưu trữ log hệ thống (source: FE/BE/DB).

## 🐞 Cách sử dụng Hệ thống Logging
Mọi thao tác Backend nên sử dụng hàm `logToSupabase` để ghi lại vết:
```ts
import { logToSupabase } from "./server/supabase.ts";
await logToSupabase("BE", "INFO", "Thông điệp log", { details: "Dữ liệu bổ sung" });
```
Đối với truy vấn Database, hãy sử dụng `supabaseQuery` để tự động ghi log thời gian thực thi.

## 🛠 Nhiệm vụ Backend tiếp theo
1. **Xác thực (Authentication)**: Tích hợp Supabase Auth để quản lý người dùng và phân quyền Admin.
2. **Quản lý Kho (Inventory)**: Viết API cập nhật số lượng tồn kho (`stock`) sau khi đơn hàng được xác nhận.
3. **Real-time**: Sử dụng Supabase Realtime để thông báo cho Admin khi có đơn hàng mới mà không cần refresh trang.
4. **Validation**: Bổ sung `zod` hoặc `joi` để kiểm tra dữ liệu đầu vào cho các API POST/PATCH.

## 🔑 Biến môi trường cần thiết
Đảm bảo AI Agent tiếp theo có quyền truy cập vào:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GEMINI_API_KEY` (cho các tính năng AI nếu có)

---
*Ghi chú: Luôn kiểm tra file `DEVELOPMENT_LOG.md` để biết tiến độ chi tiết.*
