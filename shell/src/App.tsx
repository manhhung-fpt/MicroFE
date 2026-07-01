import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import Layout from './components/Layout';

const ProductsApp = lazy(() => import('products/App'));
const OrdersApp = lazy(() => import('orders/App'));
const AccountApp = lazy(() => import('account/App'));
const CheckoutApp = lazy(() => import('checkout/App'));

const Loading = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-gray-500 text-sm">Đang tải...</span>
    </div>
  </div>
);

const AppRoutes: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products/*" element={<ProductsApp />} />
        <Route path="/orders/*" element={<OrdersApp />} />
        <Route path="/account/*" element={<AccountApp />} />
        <Route
          path="/checkout/*"
          element={
            <CheckoutApp
              cart={cart}
              onCartUpdate={(items) => {
                const toRemove = cart.filter(ci => !items.find(ni => ni.product.id === ci.product.id));
                toRemove.forEach(i => removeFromCart(i.product.id));
                items.forEach(ni => updateQuantity(ni.product.id, ni.quantity));
              }}
              onClearCart={clearCart}
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
