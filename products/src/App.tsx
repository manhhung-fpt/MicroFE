import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

const App: React.FC = () => (
  <Routes>
    <Route index element={<ProductList />} />
    <Route path=":id" element={<ProductDetail />} />
  </Routes>
);

export default App;
