/* ─── Cart Context ─────────────────────────────────── */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isCustomer } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setError(null);
      // Only fetch from server if customer is authenticated
      if (isCustomer) {
        setLoading(true);
        const { data } = await api.get('/cart');
        setCart(data || { items: [] });
      } else {
        // Load from localStorage for guests
        const guestCart = localStorage.getItem('guestCart');
        setCart(guestCart ? JSON.parse(guestCart) : { items: [] });
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
      // Fallback to localStorage
      const guestCart = localStorage.getItem('guestCart');
      setCart(guestCart ? JSON.parse(guestCart) : { items: [] });
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  // Fetch cart when authentication state changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      console.log(`[Cart] Adding product ${productId} with quantity ${quantity}`);
      
      if (!isCustomer) {
        // Guest cart
        const guest = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}');
        const idx = guest.items.findIndex(i => (i.product?._id || i.product) === productId);
        if (idx > -1) {
          guest.items[idx].quantity += quantity;
        } else {
          guest.items.push({ product: productId, quantity });
        }
        localStorage.setItem('guestCart', JSON.stringify(guest));
        setCart(guest);
        console.log('[Cart] Guest cart updated:', guest);
        return { success: true, message: 'Item added to cart!' };
      }
      
      // Server cart
      console.log('[Cart] Adding to server cart for authenticated user');
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data || { items: [] });
      console.log('[Cart] Server cart updated:', data);
      return { success: true, message: 'Item added to cart!' };
    } catch (err) {
      console.error('[Cart] Failed to add to cart:', err);
      const errorMsg = err.response?.data?.message || 'Failed to add item to cart';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!isCustomer) return;
    try {
      setError(null);
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      setCart(data || { items: [] });
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update item quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      setError(null);
      if (!isCustomer) {
        const g = { ...cart, items: cart.items.filter((_, i) => i.toString() !== itemId) };
        localStorage.setItem('guestCart', JSON.stringify(g));
        setCart(g);
        return;
      }
      const { data } = await api.delete(`/cart/${itemId}`);
      setCart(data || { items: [] });
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      if (!isCustomer) {
        localStorage.removeItem('guestCart');
        setCart({ items: [] });
        return;
      }
      await api.delete('/cart');
      setCart({ items: [] });
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart');
    }
  };

  const cartCount = cart.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, error, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
