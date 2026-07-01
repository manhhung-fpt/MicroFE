import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <div className="p-6 bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/checkout/*" element={<App />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </div>
  </BrowserRouter>
);
