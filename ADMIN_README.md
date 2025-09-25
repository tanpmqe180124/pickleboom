# Admin Dashboard - Hướng dẫn sử dụng

## Tổng quan
Admin Dashboard là trang quản lý dành cho quản trị viên hệ thống PickleBall Booking. Chỉ những tài khoản có role "Admin" mới có thể truy cập.

## Truy cập Admin Dashboard
1. Đăng nhập vào hệ thống với tài khoản có quyền Admin
2. Vào Dashboard chính (`/dashboard`)
3. Click vào nút "Admin Panel" (chỉ hiển thị với tài khoản Admin)
4. Hoặc truy cập trực tiếp: `/admin`

## Các chức năng quản lý

### 1. Quản lý người dùng (User Management)
- **Xem danh sách người dùng**: Hiển thị tất cả người dùng với phân trang
- **Tìm kiếm**: Tìm theo tên, email, số điện thoại
- **Lọc theo trạng thái**: Hoạt động / Vô hiệu hóa
- **Cập nhật trạng thái**: Kích hoạt/vô hiệu hóa tài khoản người dùng

### 2. Quản lý sân bóng (Court Management)
- **Tạo sân mới**: Thêm sân bóng với thông tin chi tiết
- **Chỉnh sửa sân**: Cập nhật thông tin sân bóng
- **Xóa sân**: Xóa sân bóng khỏi hệ thống
- **Quản lý trạng thái**: Hoạt động, Bảo trì, Vô hiệu hóa, Đã kín lịch
- **Gán khung giờ**: Chọn các khung giờ hoạt động cho sân
- **Upload hình ảnh**: Thêm hình ảnh sân bóng

### 3. Quản lý khung giờ (TimeSlot Management)
- **Tạo khung giờ**: Thêm khung giờ mới (30 phút hoặc 1 giờ)
- **Chỉnh sửa khung giờ**: Cập nhật thời gian bắt đầu/kết thúc
- **Xóa khung giờ**: Xóa khung giờ khỏi hệ thống
- **Xem danh sách**: Hiển thị tất cả khung giờ có sẵn

### 4. Quản lý blog (Blog Management)
- **Tạo bài viết**: Thêm bài viết blog mới
- **Chỉnh sửa bài viết**: Cập nhật nội dung, tiêu đề, trạng thái
- **Xóa bài viết**: Xóa bài viết khỏi hệ thống
- **Quản lý trạng thái**: Bản nháp, Đã xuất bản, Đã ẩn
- **Upload thumbnail**: Thêm hình ảnh đại diện cho bài viết

### 5. Quản lý đặt sân (Booking Management)
- **Xem danh sách đặt sân**: Hiển thị tất cả đặt sân với phân trang
- **Tìm kiếm**: Tìm theo tên khách hàng
- **Lọc theo trạng thái**: Chờ xử lý, Đã thanh toán, Đã hủy
- **Xem chi tiết**: Thông tin khách hàng, sân, khung giờ, thanh toán

## Bảo mật và quyền truy cập

### Kiểm tra quyền Admin
- Hệ thống tự động kiểm tra role "Admin" từ JWT token
- Nếu không có quyền Admin, sẽ chuyển hướng về Dashboard thông thường
- Hiển thị thông báo lỗi nếu không có quyền truy cập

### Bảo vệ Route
- Sử dụng `AdminRoute` component để bảo vệ các route admin
- Kiểm tra authentication và authorization trước khi cho phép truy cập
- Tự động chuyển hướng nếu không đủ quyền

## Cấu trúc file

```
src/
├── components/
│   ├── admin/
│   │   ├── UserManagement.tsx      # Quản lý người dùng
│   │   ├── CourtManagement.tsx     # Quản lý sân bóng
│   │   ├── TimeSlotManagement.tsx  # Quản lý khung giờ
│   │   ├── BlogManagement.tsx      # Quản lý blog
│   │   └── BookingManagement.tsx   # Quản lý đặt sân
│   └── AdminLink.tsx               # Link admin trong Dashboard
├── pages/
│   └── AdminDashboard.tsx          # Trang admin chính
├── routes/
│   └── AdminRoute.tsx              # Route bảo vệ admin
├── services/
│   └── adminService.ts             # API service cho admin
└── types/                          # TypeScript types
```

## API Endpoints

### User Management
- `GET /api/User` - Lấy danh sách người dùng
- `PATCH /api/User/{userId}` - Cập nhật trạng thái người dùng

### Court Management
- `POST /api/Court` - Tạo sân mới
- `PUT /api/Court/{id}` - Cập nhật sân
- `DELETE /api/Court/{id}` - Xóa sân

### TimeSlot Management
- `POST /api/TimeSlot` - Tạo khung giờ mới
- `PUT /api/TimeSlot/{id}` - Cập nhật khung giờ
- `DELETE /api/TimeSlot?id={id}` - Xóa khung giờ

### Blog Management
- `POST /api/Blog` - Tạo bài viết mới
- `PUT /api/Blog/{id}` - Cập nhật bài viết
- `PATCH /api/Blog/{id}` - Xóa bài viết

### Booking Management
- `GET /api/Booking` - Lấy danh sách đặt sân

## Lưu ý quan trọng

1. **Chỉ Admin mới truy cập được**: Hệ thống kiểm tra role từ JWT token
2. **Dữ liệu mock**: Hiện tại một số component sử dụng dữ liệu mock, cần thay thế bằng API thực
3. **Upload file**: Hỗ trợ upload hình ảnh cho sân bóng và blog
4. **Phân trang**: Tất cả danh sách đều hỗ trợ phân trang
5. **Tìm kiếm và lọc**: Có thể tìm kiếm và lọc dữ liệu theo nhiều tiêu chí
6. **Responsive**: Giao diện tương thích với mobile và desktop

## Troubleshooting

### Không thể truy cập Admin Dashboard
- Kiểm tra tài khoản có role "Admin" không
- Kiểm tra JWT token có hợp lệ không
- Xem console log để kiểm tra lỗi

### Lỗi API
- Kiểm tra kết nối backend
- Xem network tab trong DevTools
- Kiểm tra response status code

### Giao diện không hiển thị đúng
- Kiểm tra CSS classes
- Xem console log để kiểm tra lỗi JavaScript
- Kiểm tra responsive breakpoints

