import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';

const App: React.FC = () => (
  <Routes>
    <Route index element={<OrderList />} />
    <Route path=":id" element={<OrderDetail />} />
  </Routes>
);

export default App;
