import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="text-gray-500 text-sm">
        Chào mừng đến với <span className="font-semibold text-gray-800">MFE Store</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/checkout" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <span className="text-2xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </Link>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              {user.avatar}
            </div>
            <span className="text-sm text-gray-700 font-medium">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
