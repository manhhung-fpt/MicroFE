# SD5818 – Micro Frontend với Webpack Module Federation

## Mục lục

- [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
- [Luồng chạy của ứng dụng](#luồng-chạy-của-ứng-dụng)
- [Cài đặt và chạy project](#cài-đặt-và-chạy-project)

---

## Tổng quan kiến trúc

Dự án sử dụng mô hình **Host/Remote** của Webpack Module Federation:

```
                        ┌─────────────────────────────────────────────────┐
                        │             SHELL (Host)  :3000                  │
                        │  ┌──────────┐  ┌──────────────────────────────┐  │
                        │  │ Header   │  │       React Router           │  │
                        │  │ Sidebar  │  │  /products  /orders          │  │
                        │  │ AuthCtx  │  │  /account   /checkout        │  │
                        │  │ CartCtx  │  └──────────────────────────────┘  │
                        └──────┬───────────────────┬────────────────────────┘
                               │  remoteEntry.js    │
           ┌───────────────────┼────────────────────┼───────────────────┐
           ▼                   ▼                    ▼                   ▼
  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────────┐ ┌──────────────────┐
  │ products :3001  │ │  orders  :3002  │ │ account  :3003   │ │ checkout :3004   │
  │ exposes ./App   │ │ exposes ./App   │ │ exposes ./App    │ │ exposes ./App    │
  └─────────────────┘ └─────────────────┘ └──────────────────┘ └──────────────────┘
```

| Ứng dụng | Vai trò | Port | URL |
|---|---|---|---|
| **shell** | Host – điều phối toàn bộ | 3000 | http://localhost:3000 |
| **products** | Remote – danh sách & chi tiết sản phẩm | 3001 | http://localhost:3001 |
| **orders** | Remote – lịch sử & chi tiết đơn hàng | 3002 | http://localhost:3002 |
| **account** | Remote – hồ sơ & cập nhật tài khoản | 3003 | http://localhost:3003 |
| **checkout** | Remote – giỏ hàng & thanh toán | 3004 | http://localhost:3004 |

---

## Luồng chạy của ứng dụng

```
Trình duyệt mở http://localhost:3000
        │
        ▼
shell/public/index.html
        │
        ▼
shell/src/index.ts  ──►  import('./bootstrap')  ← (dynamic import để tránh lỗi shared module)
        │
        ▼
shell/src/bootstrap.tsx  ──►  ReactDOM.createRoot().render(<App />)
        │
        ▼
shell/src/App.tsx
  └── BrowserRouter
       └── AuthProvider        (cung cấp thông tin user đăng nhập)
            └── CartProvider   (quản lý giỏ hàng toàn cục)
                 └── Layout    (Header + Sidebar + <Outlet>)
                      └── Routes
                           ├── /           → redirect → /products
                           ├── /products/* → lazy load products/App (từ :3001)
                           ├── /orders/*   → lazy load orders/App   (từ :3002)
                           ├── /account/*  → lazy load account/App  (từ :3003)
                           └── /checkout/* → lazy load checkout/App (từ :3004)


## Cấu trúc thư mục

```
SD5818_MicroFE/
├── package.json              ← root: chứa script chạy tất cả app song song
│
├── shell/                    ← HOST application (port 3000)
│   ├── webpack.config.js     ← ModuleFederation: remotes
│   ├── public/index.html
│   └── src/
│       ├── index.ts          ← entry point (dynamic import bootstrap)
│       ├── bootstrap.tsx     ← ReactDOM.render
│       ├── App.tsx           ← BrowserRouter + Routes + lazy remotes
│       ├── declarations.d.ts ← khai báo type cho module federation
│       ├── types.ts          ← CartItem, Product types
│       ├── components/
│       │   ├── Header.tsx    ← logo, user info, cart badge
│       │   ├── Sidebar.tsx   ← navigation links
│       │   └── Layout.tsx    ← khung bố cục chính
│       └── contexts/
│           ├── AuthContext.tsx  ← mock auth (user đăng nhập sẵn)
│           └── CartContext.tsx  ← quản lý giỏ hàng + lắng nghe mfe:add-to-cart
│
├── products/                 ← REMOTE application (port 3001)
│   ├── webpack.config.js     ← exposes: { './App': './src/App' }
│   └── src/
│       ├── App.tsx           ← Routes: / (list), /:id (detail)
│       ├── components/
│       │   ├── ProductList.tsx   ← grid sản phẩm
│       │   ├── ProductCard.tsx   ← card + nút thêm giỏ hàng → dispatch event
│       │   └── ProductDetail.tsx ← trang chi tiết sản phẩm
│       └── data/products.ts  ← dữ liệu mock (iPhone, Samsung, MacBook,...)
│
├── orders/                   ← REMOTE application (port 3002)
│   ├── webpack.config.js     ← exposes: { './App': './src/App' }
│   └── src/
│       ├── App.tsx           ← Routes: / (list), /:id (detail)
│       ├── components/
│       │   ├── OrderList.tsx     ← danh sách đơn hàng
│       │   └── OrderDetail.tsx   ← chi tiết đơn hàng
│       └── data/orders.ts    ← dữ liệu mock
│
├── account/                  ← REMOTE application (port 3003)
│   ├── webpack.config.js     ← exposes: { './App': './src/App' }
│   └── src/
│       ├── App.tsx           ← useState(editing) điều hướng giữa view/edit
│       └── components/
│           ├── UserProfile.tsx   ← hiển thị thông tin tài khoản
│           └── UpdateProfile.tsx ← form cập nhật hồ sơ
│
└── checkout/                 ← REMOTE application (port 3004)
    ├── webpack.config.js     ← exposes: { './App': './src/App' }
    └── src/
        ├── App.tsx           ← nhận cart props từ shell, Routes: / + /summary
        ├── types.ts
        └── components/
            ├── ShoppingCart.tsx     ← danh sách, số lượng, xoá sản phẩm
            └── CheckoutSummary.tsx  ← xác nhận đơn, gọi clearCart
```

## Cài đặt và chạy project

### Yêu cầu

- Node.js >= 16
- npm >= 8

### Cài đặt tất cả dependencies

```bash
# Từ thư mục gốc
npm run install:all
```

Hoặc cài từng app thủ công:

```bash
npm install --prefix shell
npm install --prefix products
npm install --prefix orders
npm install --prefix account
npm install --prefix checkout
```

### Chạy development (tất cả app song song)

```bash
# Từ thư mục gốc – khởi động tất cả 5 app cùng lúc
npm start
```

Sau khi khởi động, mở trình duyệt tại: **http://localhost:3000**

### Chạy từng app riêng lẻ

```bash
# Mở 5 terminal riêng, mỗi terminal chạy 1 lệnh:
npm start --prefix shell       # http://localhost:3000
npm start --prefix products    # http://localhost:3001
npm start --prefix orders      # http://localhost:3002
npm start --prefix account     # http://localhost:3003
npm start --prefix checkout    # http://localhost:3004
```

### Build production

```bash
npm run build:all
```

---

