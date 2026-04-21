/* ─── Wishlist Context ─────────────────────────────── */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isCustomer } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setError(null);
      if (!isCustomer) { 
        setWishlist([]); 
        return; 
      }
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setWishlist(data.products || []);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setError('Failed to load wishlist');
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isCustomer]);

  useEffect(() => { 
    fetchWishlist(); 
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!isCustomer) return;
    try {
      setError(null);
      const { data } = await api.post('/wishlist', { productId });
      setWishlist(data.products || []);
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      setError('Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isCustomer) return;
    try {
      setError(null);
      const { data } = await api.delete(`/wishlist/${productId}`);
      setWishlist(data.products || []);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      setError('Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId) => wishlist.some(p => (p._id || p) === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, error, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
