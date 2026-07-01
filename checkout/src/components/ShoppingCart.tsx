import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface ShoppingCartProps {
  cart: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, onUpdateCart }) => {
  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      onUpdateCart(cart.filter(i => i.product.id !== productId));
      return;
    }
    onUpdateCart(cart.map(i => (i.product.id === productId ? { ...i, quantity: qty } : i)));
  };

  const remove = (productId: number) =>
    onUpdateCart(cart.filter(i => i.product.id !== productId));

  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-400 text-sm mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
        <Link
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors inline-block"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Giỏ hàng</h1>
        <p className="text-gray-500 text-sm">{totalItems} sản phẩm trong giỏ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {cart.map((item, idx) => (
              <div
                key={item.product.id}
                className={`flex items-center gap-4 p-5 ${idx < cart.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ backgroundColor: item.product.color }}
                >
                  {item.product.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-blue-600 font-semibold text-sm mt-0.5">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity - 1)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors"
                  >
                    −
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.product.id, item.quantity + 1)}
                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-gray-800 text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
                <button
                  onClick={() => remove(item.product.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-2 flex-shrink-0"
                  title="Xóa"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm mb-5">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính ({totalItems} sp)</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-100 text-base">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            to="/checkout/summary"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
          >
            Tiến hành thanh toán →
          </Link>
          <Link
            to="/products"
            className="block w-full text-center mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
