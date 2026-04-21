# Critical Fixes - Action Items

## IMMEDIATE FIXES (Priority 1)

### 1. Fix API Path Issues

**Files to Fix:**
- `frontend/src/pages/ProductDetail.js` (2 occurrences)
- `frontend/src/pages/SearchResults.js` (1 occurrence)
- `frontend/src/pages/OrderConfirmation.js` (1 occurrence)

**ProductDetail.js - Line 19-20:**
```javascript
// BEFORE:
const [pr, rv] = await Promise.all([
  api.get(`/api/products/${id}`),
  api.get(`/api/reviews/product/${id}`)
]);

// AFTER:
const [pr, rv] = await Promise.all([
  api.get(`/products/${id}`),
  api.get(`/reviews/product/${id}`)
]);
```

**ProductDetail.js - Line 46:**
```javascript
// BEFORE:
const rv = await api.get(`/reviews/product/${id}`);

// AFTER:
const rv = await api.get(`/reviews/product/${id}`);
```

**SearchResults.js - Line 14:**
```javascript
// BEFORE:
const { data } = await api.get(`/api/products?search=${encodeURIComponent(q)}`);

// AFTER:
const { data } = await api.get(`/products?search=${encodeURIComponent(q)}`);
```

**OrderConfirmation.js - Line 24:**
```javascript
// BEFORE:
const { data } = await api.get(`/api/orders/${id}`);

// AFTER:
const { data } = await api.get(`/orders/${id}`);
```

---

### 2. Fix Payment Page SessionStorage Issue

**File:** `frontend/src/pages/Payment.js`

**Issue:** Address is lost on page refresh because sessionStorage is cleared.

**Solution:** Create a PaymentContext to store address in app state instead.

**Step 1: Create PaymentContext.js**
```javascript
// frontend/src/context/PaymentContext.js
import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export function PaymentProvider({ children }) {
  const [checkoutAddress, setCheckoutAddress] = useState(null);
  
  const saveCheckoutAddress = (address) => {
    setCheckoutAddress(address);
    // Still save to sessionStorage as backup
    sessionStorage.setItem('checkoutAddress', JSON.stringify(address));
  };
  
  const getCheckoutAddress = () => {
    if (checkoutAddress) return checkoutAddress;
    // Try to restore from sessionStorage
    try {
      const stored = sessionStorage.getItem('checkoutAddress');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };
  
  const clearCheckoutAddress = () => {
    setCheckoutAddress(null);
    sessionStorage.removeItem('checkoutAddress');
  };

  return (
    <PaymentContext.Provider value={{
      checkoutAddress: getCheckoutAddress(),
      saveCheckoutAddress,
      clearCheckoutAddress
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
```

**Step 2: Add PaymentProvider to App.js**
```javascript
// Wrap existing providers:
<BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <PaymentProvider>
          <AppContent />
        </PaymentProvider>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
</BrowserRouter>
```

**Step 3: Update Checkout.js**
```javascript
// Add import:
import { usePayment } from '../context/PaymentContext';

// In component:
const { saveCheckoutAddress } = usePayment();

// Update persistCheckoutAddress:
const persistCheckoutAddress = (addr) => {
  saveCheckoutAddress(addr);
  navigate('/payment');
};
```

**Step 4: Update Payment.js**
```javascript
// Add import:
import { usePayment } from '../context/PaymentContext';

// In component:
const { checkoutAddress } = usePayment();
const address = checkoutAddress || {};
```

---

### 3. Add 401 Handler to API Interceptor

**File:** `frontend/src/utils/api.js`

```javascript
// Add to response interceptor:
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      // Clear auth data and redirect to login
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customer');
      localStorage.removeItem('sellerToken');
      localStorage.removeItem('seller');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      
      // Redirect to appropriate login page
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/seller')) {
        window.location.href = '/seller/login';
      } else if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    if (error.response) {
      return Promise.reject(error);
    } else if (error.request) {
      const networkError = new Error('Network error: Unable to connect to server. Please check if backend is running.');
      networkError.response = { data: { error: 'Network error' } };
      return Promise.reject(networkError);
    } else {
      return Promise.reject(error);
    }
  }
);
```

---

### 4. Fix CartContext Race Condition

**File:** `frontend/src/context/CartContext.js`

```javascript
// BEFORE:
const [cart, setCart] = useState({ items: [] });
const [loading, setLoading] = useState(false);

const fetchCart = useCallback(async () => {
  if (!isCustomer) { setCart(JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')); return; }
  try { setLoading(true); const { data } = await api.get('/cart'); setCart(data); }
  catch {} finally { setLoading(false); }
}, [isCustomer]);

useEffect(() => { fetchCart(); }, [fetchCart]);

// AFTER:
const [cart, setCart] = useState({ items: [] });
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchCart = useCallback(async () => {
  setError(null);
  if (!isCustomer) { 
    setCart(JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}')); 
    return; 
  }
  try { 
    setLoading(true); 
    const { data } = await api.get('/cart'); 
    setCart(data || { items: [] });
  } catch (err) {
    setError(err.message || 'Failed to load cart');
    setCart({ items: [] });
  } finally { 
    setLoading(false); 
  }
}, [isCustomer]);

useEffect(() => { 
  fetchCart(); 
}, [fetchCart]);
```

**Update return value:**
```javascript
return (
  <CartContext.Provider value={{ 
    cart, 
    cartCount, 
    loading, 
    error,  // NEW
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    fetchCart 
  }}>
    {children}
  </CartContext.Provider>
);
```

---

### 5. Same Fix for WishlistContext

**File:** `frontend/src/context/WishlistContext.js`

Apply same error handling pattern as CartContext above.

---

## MEDIUM PRIORITY FIXES

### 6. Create Error Boundary Component

**File:** `frontend/src/components/ErrorBoundary.js`

```javascript
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          padding: '20px'
        }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Use in App.js:**
```javascript
import { ErrorBoundary } from './components/ErrorBoundary';

// Wrap the entire app:
<ErrorBoundary>
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <PaymentProvider>
            <AppContent />
          </PaymentProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
</ErrorBoundary>
```

---

### 7. Fix Payment Page Razorpay Key Validation

**File:** `frontend/src/pages/Payment.js`

```javascript
// Add at component start:
if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
  return (
    <div className="empty-state">
      <h3>Configuration Error</h3>
      <p>Razorpay key is not configured. Contact support.</p>
    </div>
  );
}
```

---

### 8. Fix Profile Page Silent Failure

**File:** `frontend/src/pages/Profile.js`

```javascript
// BEFORE:
useEffect(() => {
  (async () => {
    try { 
      const { data } = await api.get('/users/profile'); 
      setProfile(data); 
      setForm({ name: data.name, email: data.email, phone: data.phone || '' }); 
    }
    catch {}
  })();
}, []);

if (!profile) return <div className="loading-spinner"><div className="spinner"></div></div>;

// AFTER:
const [profileError, setProfileError] = useState(null);

useEffect(() => {
  (async () => {
    try { 
      const { data } = await api.get('/users/profile'); 
      setProfile(data); 
      setForm({ name: data.name, email: data.email, phone: data.phone || '' }); 
      setProfileError(null);
    } catch (err) {
      setProfileError(err.message || 'Failed to load profile');
    }
  })();
}, []);

if (profileError) return (
  <div className="empty-state">
    <h3>Error Loading Profile</h3>
    <p>{profileError}</p>
    <button onClick={() => window.location.reload()}>Retry</button>
  </div>
);

if (!profile) return <div className="loading-spinner"><div className="spinner"></div></div>;
```

---

### 9. Fix OrderHistory Silent Failure

**File:** `frontend/src/pages/OrderHistory.js`

Apply same error handling pattern as Profile above.

---

### 10. Fix ProductDetail Buy Now

**File:** `frontend/src/pages/ProductDetail.js`

```javascript
// BEFORE:
const handleBuyNow = () => { 
  addToCart(product._id, qty);
  setTimeout(() => {
    window.location.href = '/checkout';
  }, 300);
};

// AFTER:
const handleBuyNow = () => { 
  addToCart(product._id, qty);
  setTimeout(() => {
    navigate('/checkout');
  }, 300);
};
```

---

## Testing Checklist

After applying fixes, test:

- [ ] Page refresh on each page works
- [ ] API calls succeed (check network tab)
- [ ] Payment flow works end-to-end
- [ ] Auth token expiry is detected
- [ ] Errors show proper messages
- [ ] Animations still work
- [ ] Cart persists across refreshes
- [ ] SessionStorage cleared properly after payment

---

