import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { orders, OrderStatus } from '../data/orders';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const statusConfig: Record<OrderStatus, { label: string; className: string; step: number }> = {
  Pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700', step: 1 },
  Processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-700', step: 2 },
  Shipped: { label: 'Đang giao hàng', className: 'bg-purple-100 text-purple-700', step: 3 },
  Delivered: { label: 'Đã giao thành công', className: 'bg-green-100 text-green-700', step: 4 },
  Cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700', step: 0 },
};

const steps = ['Đặt hàng', 'Xử lý', 'Đang giao', 'Đã nhận'];

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Không tìm thấy đơn hàng</h2>
        <Link to="/orders" className="text-blue-600 hover:underline text-sm">← Quay lại</Link>
      </div>
    );
  }

  const { label, className, step } = statusConfig[order.status];

  return (
    <div>
      <Link to="/orders" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mb-6">
        ← Quay lại danh sách đơn hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-800">{order.id}</h1>
                <p className="text-gray-500 text-sm mt-0.5">Ngày đặt: {order.date}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
                {label}
              </span>
            </div>

            {order.status !== 'Cancelled' && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          i < step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs mt-1 ${i < step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex mx-4 -mt-6 mb-6">
                  {steps.slice(0, -1).map((_, i) => (
                    <div key={i} className="flex-1 h-0.5 mx-1 mt-4">
                      <div className={`h-full ${i < step - 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Sản phẩm đã đặt</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-gray-400 text-sm">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatPrice(item.price * item.quantity)}</p>
                    <p className="text-gray-400 text-xs">{formatPrice(item.price)} / cái</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Địa chỉ</p>
                <p className="text-gray-700">{order.address}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Số điện thoại</p>
                <p className="text-gray-700">{order.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Tóm tắt thanh toán</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.total * 0.9)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thuế (10%)</span>
                <span>{formatPrice(order.total * 0.1)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-3 border-t border-gray-100 text-base">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
