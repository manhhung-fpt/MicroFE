import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ShoppingCart from './components/ShoppingCart';
import CheckoutSummary from './components/CheckoutSummary';
import { CartItem } from './types';

interface CheckoutAppProps {
  cart?: CartItem[];
  onCartUpdate?: (items: CartItem[]) => void;
  onClearCart?: () => void;
}

const App: React.FC<CheckoutAppProps> = ({ cart: externalCart, onCartUpdate, onClearCart }) => {
  const [localCart, setLocalCart] = useState<CartItem[]>(externalCart || []);

  useEffect(() => {
    if (externalCart !== undefined) {
      setLocalCart(externalCart);
    }
  }, [externalCart]);

  const handleCartUpdate = (items: CartItem[]) => {
    setLocalCart(items);
    onCartUpdate?.(items);
  };

  const handlePlaceOrder = () => {
    setLocalCart([]);
    onClearCart?.();
  };

  return (
    <Routes>
      <Route
        index
        element={<ShoppingCart cart={localCart} onUpdateCart={handleCartUpdate} />}
      />
      <Route
        path="summary"
        element={<CheckoutSummary cart={localCart} onPlaceOrder={handlePlaceOrder} />}
      />
    </Routes>
  );
};

export default App;
