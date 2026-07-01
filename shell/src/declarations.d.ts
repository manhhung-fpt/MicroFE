declare module 'products/App' {
  const App: React.FC;
  export default App;
}

declare module 'orders/App' {
  const App: React.FC;
  export default App;
}

declare module 'account/App' {
  const App: React.FC;
  export default App;
}

declare module 'checkout/App' {
  import { CartItem } from './types';
  interface CheckoutAppProps {
    cart?: CartItem[];
    onCartUpdate?: (items: CartItem[]) => void;
    onClearCart?: () => void;
  }
  const App: React.FC<CheckoutAppProps>;
  export default App;
}
