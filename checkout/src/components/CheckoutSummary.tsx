import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface CheckoutSummaryProps {
  cart: CartItem[];
  onPlaceOrder: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ cart, onPlaceOrder }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    paymentMethod: 'cod',
  });
  const [submitted, setSubmitted] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setSubmitted(true);
    setTimeout(() => {
      onPlaceOrder();
      navigate('/orders');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 text-sm">Đang chuyển về trang đơn hàng...</p>
        <div className="mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Giỏ hàng trống</h2>
        <Link to="/checkout" className="text-blue-600 hover:underline text-sm">← Quay lại giỏ hàng</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/checkout" className="text-blue-600 hover:text-blue-700 text-sm">← Giỏ hàng</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-800 font-medium text-sm">Xác nhận đặt hàng</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Xác nhận đặt hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Họ tên', name: 'name' as const },
                { label: 'Số điện thoại', name: 'phone' as const },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                  <input
                    value={form[f.name]}
                    onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">Địa chỉ</label>
                <input
                  value={form.address}
                  onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {[
                { value: 'cod', label: '💵 Thanh toán khi nhận hàng (COD)' },
                { value: 'bank', label: '🏦 Chuyển khoản ngân hàng' },
                { value: 'card', label: '💳 Thẻ tín dụng / Ghi nợ' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={() => setForm(p => ({ ...p, paymentMethod: opt.value }))}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Sản phẩm ({cart.length})</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: item.product.color }}
                  >
                    {item.product.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4">Tóm tắt thanh toán</h2>
          <div className="space-y-2 text-sm mb-5">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Thuế (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-100 text-base">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Đặt hàng ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
