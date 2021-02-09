import { createContext, useState, useContext } from 'react';

const CartStateContext = createContext();
const LocalStateProvider = CartStateContext.Provider;

function CartStateProvider({ children }) {
  const [cartOpen, setOpen] = useState(true);

  const toggleCart = () => setOpen(!cartOpen);
  const closeCart = () => setOpen(false);
  const openCart = () => setOpen(true);

  return (
    <LocalStateProvider value={{ cartOpen, toggleCart, closeCart, openCart }}>
      {children}
    </LocalStateProvider>
  );
}

function useCart() {
  return useContext(CartStateContext);
}

export { CartStateProvider, useCart };
