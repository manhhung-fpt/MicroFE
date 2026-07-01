import React, { useState } from 'react';

const mockUser = {
  id: 1,
  name: 'Nguyễn Văn An',
  email: 'nguyenvanan@example.com',
  phone: '0901234567',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  avatar: 'NVA',
  joinDate: '2023-01-15',
  totalOrders: 6,
  totalSpent: 121240000,
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface UserProfileProps {
  onEdit: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onEdit }) => {
  const [user] = useState(mockUser);

  const infoItems = [
    { label: 'Email', value: user.email, icon: '📧' },
    { label: 'Số điện thoại', value: user.phone, icon: '📱' },
    { label: 'Địa chỉ', value: user.address, icon: '📍' },
    { label: 'Ngày tham gia', value: user.joinDate, icon: '📅' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{user.email}</p>
            <div className="flex gap-4 mt-3 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{user.totalOrders}</p>
                <p className="text-xs text-gray-400">Đơn hàng</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-blue-600">{formatPrice(user.totalSpent)}</p>
                <p className="text-xs text-gray-400">Đã chi tiêu</p>
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
        <div className="space-y-4">
          {infoItems.map(item => (
            <div key={item.label} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
              <span className="text-lg mt-0.5">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
