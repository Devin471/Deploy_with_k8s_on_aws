import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaEdit, FaTrash, FaStar, FaBolt, FaCheck } from 'react-icons/fa';
import './ProductCard.css';

function ProductCard({ product, onAddToCart, isAdmin, onDelete, onEdit }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isCustomer } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);
  const justAddedTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
    };
  }, []);

  const handleAddToCart = async () => {
    try {
      console.log('[ProductCard] Add to Cart clicked for product:', product._id);
      console.log('[ProductCard] Is customer:', isCustomer);

      if (!product?._id) return;
      if (addingToCart) return;

      setAddingToCart(true);
      
      if (!isCustomer) {
        // Allow guests to add to local storage cart
        console.log('[ProductCard] Guest user - adding to localStorage');
        const guest = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}');
        const idx = guest.items.findIndex(i => (i.product?._id || i.product) === product._id);
        if (idx > -1) {
          guest.items[idx].quantity += 1;
        } else {
          guest.items.push({ product: product._id, quantity: 1 });
        }
        localStorage.setItem('guestCart', JSON.stringify(guest));
        console.log('[ProductCard] Guest cart updated:', guest);
        setJustAddedToCart(true);
        if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
        justAddedTimerRef.current = setTimeout(() => setJustAddedToCart(false), 1500);
        return;
      }
      
      console.log('[ProductCard] Authenticated user - calling addToCart');
      const result = await addToCart(product._id, 1);
      console.log('[ProductCard] addToCart result:', result);
      
      if (result?.success) {
        setJustAddedToCart(true);
        if (justAddedTimerRef.current) clearTimeout(justAddedTimerRef.current);
        justAddedTimerRef.current = setTimeout(() => setJustAddedToCart(false), 1500);
      } else {
        alert(result?.message || 'Failed to add item');
      }
    } catch (err) {
      console.error('[ProductCard] Error adding to cart:', err);
      alert('Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isCustomer) {
      navigate('/login');
      return;
    }
    navigate(`/product/${product._id}`);
  };

  const handleClick = onAddToCart ? () => onAddToCart(product) : handleAddToCart;

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="product-image-container"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'} 
          alt={product.name} 
          className="product-image"
        />
      </motion.div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.designer_name && (
          <p className="product-designer">Designer: {product.designer_name}</p>
        )}
        <p className="product-category">{product.category?.name || product.category}</p>
        <p className="product-description">{product.description}</p>
        {product.designer_bio && (
          <p className="product-designer-bio">{product.designer_bio}</p>
        )}
        <p className="product-price">₹{product.price}</p>
        <p className="product-stock">Stock: {product.stock}</p>
        {!isAdmin ? (
          <div className="product-buttons">
            <motion.button
              className="product-button btn-add-cart"
              onClick={handleClick}
              disabled={product.stock === 0 || addingToCart}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              title="Add quantity 1 to cart"
            >
              {product.stock === 0 ? (
                <>
                  <FaShoppingCart /> Out of Stock
                </>
              ) : justAddedToCart ? (
                <>
                  <FaCheck />
                </>
              ) : (
                <>
                  <FaShoppingCart /> {addingToCart ? 'Adding…' : 'Add to Cart'}
                </>
              )}
            </motion.button>
            <motion.button
              className="product-button btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.96, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              title="Choose quantity and buy"
            >
              <FaBolt /> Buy Now
            </motion.button>
          </div>
        ) : (
          <motion.div
            className="admin-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              className="edit-btn"
              onClick={() => onEdit(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit
            </motion.button>
            <motion.button
              className="delete-btn"
              onClick={() => onDelete(product.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash /> Delete
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ProductCard;
