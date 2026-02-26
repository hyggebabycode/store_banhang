# OmniShop Pro - E-commerce with Integrated Debugging

Hệ thống thương mại điện tử Full-stack hiện đại với khả năng giám sát hệ thống thời gian thực.

## 🚀 Tính năng
- **Shopfront**: Giao diện mua hàng hiện đại, tối ưu trải nghiệm người dùng.
- **Admin Dashboard**: Quản lý đơn hàng, xem báo cáo doanh thu qua biểu đồ.
- **Debug Console**: Giám sát log từ Frontend, Backend và Database ngay trên giao diện.
- **Multi-step Checkout**: Quy trình thanh toán 3 bước chuyên nghiệp.

## 🛠 Công nghệ sử dụng
- **Frontend**: React 19, Tailwind CSS 4, Motion, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.
- **Database**: Supabase (PostgreSQL).
- **Tooling**: Vite, TypeScript, tsx.

## 📂 Cấu trúc dự án
- `/server.ts`: Entry point của Backend.
- `/server/`: Logic xử lý Database và API.
- `/src/App.tsx`: Khởi tạo ứng dụng Frontend.
- `/src/components/`: Các thành phần UI tái sử dụng.
- `/src/views/`: Các trang chính (Shop, Admin, Debug).
- `/src/services/`: Dịch vụ gọi API và Logging.
- `/src/types/`: Định nghĩa kiểu dữ liệu TypeScript.

## 📖 Hướng dẫn phát triển
1. Cài đặt dependencies: `npm install`
2. Chạy chế độ dev: `npm run dev`
3. Mở trình duyệt tại: `http://localhost:3000`

## 🐞 Hệ thống Debug
Hệ thống tự động ghi log cho:
- Mọi Request/Response của API.
- Mọi câu lệnh SQL thực thi (bao gồm cả thời gian chạy).
- Các tương tác quan trọng của người dùng trên Frontend.
