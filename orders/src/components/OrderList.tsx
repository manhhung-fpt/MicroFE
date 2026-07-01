import React from 'react';
import { Link } from 'react-router-dom';
import { orders, OrderStatus } from '../data/orders';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  Pending: { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  Processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-700' },
  Shipped: { label: 'Đang giao', className: 'bg-purple-100 text-purple-700' },
  Delivered: { label: 'Đã giao', className: 'bg-green-100 text-green-700' },
  Cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-700' },
};

const OrderList: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Đơn hàng của tôi</h1>
        <p className="text-gray-500 text-sm">Quản lý và theo dõi {orders.length} đơn hàng</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const { label, className } = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">{order.id}</span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
                    {label}
                  </span>
                </div>
                <span className="text-sm text-gray-400">{order.date}</span>
              </div>

              <div className="flex gap-2 mb-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  >
                    {item.name.charAt(0)}
                  </div>
                ))}
                <div className="ml-2">
                  <p className="text-sm text-gray-600">
                    {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-blue-600">{formatPrice(order.total)}</span>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
