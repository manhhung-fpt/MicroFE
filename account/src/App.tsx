import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import UpdateProfile from './components/UpdateProfile';

const AccountPage: React.FC = () => {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <UpdateProfile onBack={() => setEditing(false)} />
  ) : (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Tài khoản</h1>
        <p className="text-gray-500 text-sm">Quản lý thông tin cá nhân của bạn</p>
      </div>
      <UserProfile onEdit={() => setEditing(true)} />
    </div>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route index element={<AccountPage />} />
  </Routes>
);

export default App;
