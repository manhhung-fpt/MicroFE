import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/products', label: 'Sản phẩm', icon: '🛍️' },
  { path: '/orders', label: 'Đơn hàng', icon: '📦' },
  { path: '/account', label: 'Tài khoản', icon: '👤' },
  { path: '/checkout', label: 'Giỏ hàng', icon: '🛒' },
];

const Sidebar: React.FC = () => (
  <aside className="w-60 bg-slate-800 min-h-screen flex flex-col">
    <div className="px-6 py-5 border-b border-slate-700">
      <span className="text-white font-bold text-xl tracking-wide">MFE Store</span>
      <div className="text-slate-400 text-xs mt-1">Module Federation</div>
    </div>
    <nav className="flex-1 py-4">
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="px-6 py-4 border-t border-slate-700">
      <div className="text-slate-400 text-xs">SD5818 - MicroFrontend</div>
    </div>
  </aside>
);

export default Sidebar;
