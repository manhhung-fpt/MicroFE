# SD5818 – Micro Frontend với Webpack Module Federation

## Mục lục

- [Tổng quan kiến trúc](#tổng-quan-kiến-trúc)
- [Luồng chạy của ứng dụng](#luồng-chạy-của-ứng-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Chi tiết từng Micro App](#chi-tiết-từng-micro-app)
- [Giao tiếp giữa các MFE](#giao-tiếp-giữa-các-mfe)
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

### 1. Khởi động

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
```

### 2. Lazy Loading Remote Module

Khi người dùng điều hướng tới `/products`, shell thực hiện:

```
React.lazy(() => import('products/App'))
        │
        ▼
Webpack tải http://localhost:3001/remoteEntry.js  ← file manifest của remote
        │
        ▼
Đàm phán shared module (react, react-dom, react-router-dom đã dùng singleton)
        │
        ▼
Tải chunk products/App.tsx và render trong <Suspense fallback="Đang tải...">
```

> Mỗi remote chỉ được tải **một lần** (khi người dùng lần đầu vào route đó),  
> sau đó Webpack cache lại trong bộ nhớ.

### 3. Luồng thêm sản phẩm vào giỏ hàng (Cross-MFE Event)

```
products MFE (chạy trong :3001, được nhúng vào shell)
        │
        │  Người dùng bấm "Thêm vào giỏ"
        ▼
window.dispatchEvent(new CustomEvent('mfe:add-to-cart', {
  detail: { product, quantity }
}))
        │
        │  (DOM event lan truyền lên window – dùng chung 1 window trong shell)
        ▼
shell/src/contexts/CartContext.tsx
  └── useEffect → window.addEventListener('mfe:add-to-cart', handler)
        │
        ▼
setCart(prev => [...]) → cập nhật state giỏ hàng
        │
        ▼
Header re-render → badge số lượng sản phẩm cập nhật
```

### 4. Luồng Checkout (Props Drilling)

```
shell/src/App.tsx
  └── CartContext.useCart() → { cart, updateQuantity, clearCart }
        │
        │  Truyền trực tiếp qua props
        ▼
<CheckoutApp cart={cart} onCartUpdate={updateQuantity} onClearCart={clearCart} />
  ├── /checkout     → <ShoppingCart>    (hiển thị, chỉnh sửa giỏ hàng)
  └── /checkout/summary → <CheckoutSummary>  (xác nhận & đặt hàng → clearCart)
```

### 5. Shared Dependencies (Singleton)

```
shell, products, orders, account, checkout
  └── đều khai báo shared:
        react            → singleton → dùng chung 1 instance
        react-dom        → singleton → dùng chung 1 instance
        react-router-dom → singleton → dùng chung 1 BrowserRouter (của shell)
```

> Nhờ `singleton: true`, các remote không tự tạo BrowserRouter riêng – chúng  
> dùng Router context của shell, nên `useNavigate`, `useParams`, ... hoạt động đúng.

---

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

---

## Chi tiết từng Micro App

### Shell – Host

- Là **duy nhất** app có `BrowserRouter` và `Routes` cấp cao nhất.
- Cung cấp 2 context cho toàn bộ ứng dụng:
  - `AuthContext`: thông tin user (mock), `login()`, `logout()`
  - `CartContext`: state giỏ hàng, lắng nghe custom event từ products MFE
- Load các remote bằng `React.lazy` + `Suspense`.

### Products – Remote

- Hiển thị danh sách sản phẩm dạng grid và trang chi tiết.
- **Không** tự quản lý giỏ hàng – chỉ `dispatchEvent('mfe:add-to-cart')` lên window.
- Dữ liệu mock: iPhone 15 Pro, Samsung Galaxy S24 Ultra, MacBook Pro, v.v.

### Orders – Remote

- Hiển thị lịch sử đơn hàng và chi tiết từng đơn.
- Dữ liệu mock, hoàn toàn độc lập.

### Account – Remote

- Xem và chỉnh sửa hồ sơ tài khoản.
- Dùng `useState(editing)` thay vì router để chuyển giữa 2 view.

### Checkout – Remote

- Nhận `cart`, `onCartUpdate`, `onClearCart` qua props từ shell.
- Sync props vào local state bằng `useEffect`.
- Flow: **Giỏ hàng** → Sửa số lượng / Xoá → **Xác nhận** → `clearCart()`.

---

## Giao tiếp giữa các MFE

| Cơ chế | Từ | Đến | Dữ liệu |
|---|---|---|---|
| **Custom DOM Event** `mfe:add-to-cart` | products | shell (CartContext) | `{ product, quantity }` |
| **Props drilling** | shell | checkout | `cart`, `onCartUpdate`, `onClearCart` |
| **React Context** | shell | (nội bộ shell components) | `AuthContext`, `CartContext` |
| **Shared Router** | shell | tất cả remotes | `BrowserRouter` singleton |

---

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

> **Lưu ý:** Các remote app (products, orders, account, checkout) phải được khởi động  
> **trước hoặc cùng lúc** với shell. Nếu một remote chưa chạy, route tương ứng  
> trong shell sẽ hiển thị lỗi khi người dùng truy cập.

### Build production

```bash
npm run build:all
```

---

## Câu hỏi thường gặp

**Q: Tại sao mỗi app có file `index.ts` và `bootstrap.tsx` riêng?**  
A: `index.ts` chỉ làm một việc: `import('./bootstrap')` – dynamic import này bắt buộc để  
Webpack có thời gian đàm phán (negotiate) các shared module (react, react-dom) trước khi  
render. Nếu render trực tiếp trong `index.ts`, shared module chưa được resolve sẽ gây lỗi runtime.

**Q: Tại sao dùng `singleton: true` cho shared dependencies?**  
A: React và React Router không hỗ trợ nhiều instance trên cùng một trang. Nếu shell và remote  
dùng 2 bản React khác nhau, hooks sẽ không hoạt động. `singleton: true` đảm bảo chỉ có  
1 bản được dùng (thường là của shell – host).

**Q: Tại sao `checkout` nhận cart qua props thay vì custom event?**  
A: Checkout cần **đọc** toàn bộ state giỏ hàng (không chỉ lắng nghe sự kiện thêm),  
và cần gọi `updateQuantity` / `clearCart` – props drilling phù hợp hơn cho  
luồng dữ liệu hai chiều này.
