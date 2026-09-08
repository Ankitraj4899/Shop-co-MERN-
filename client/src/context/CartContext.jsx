import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    setIsLoading(true);
    try {
      const data = await getCart();
      setCart(data.result || { items: [] });
    } catch {
      setCart({ items: [] });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = useMemo(() => cart.items || [], [cart.items]);

  const cartCount = useMemo(() => {
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  }, [items]);

  const deliveryFee = useMemo(() => {
    return items.length > 0 ? 15 : 0;
  }, [items.length]);

  const discountRate = useMemo(() => {
    if (appliedCoupon === "save20") return 0.2;
    if (appliedCoupon === "save10") return 0.1;
    return 0;
  }, [appliedCoupon]);

  const discount = useMemo(() => {
    return subtotal * discountRate;
  }, [subtotal, discountRate]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [subtotal, discount, deliveryFee]);

  const addItemToCart = useCallback(async (productId, quantity = 1, size = "Medium") => {
    const res = await apiAddToCart([{ product: productId, quantity, size }]);
    setCart(res.cart || { items: [] });
    return res;
  }, []);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 1) return;
    const res = await updateCartItem(productId, quantity);
    setCart(res.cart || { items: [] });
    return res;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const res = await removeCartItem(productId);
    setCart(res.cart || { items: [] });
    return res;
  }, []);

  const clear = useCallback(async () => {
    const res = await apiClearCart();
    setCart(res.cart || { items: [] });
    return res;
  }, []);

  const applyCoupon = useCallback((code) => {
    const normalized = (code || "").trim().toLowerCase();
    if (normalized === "save20" || normalized === "save10") {
      setAppliedCoupon(normalized);
      setCouponError("");
      return { success: true, message: `Coupon applied: ${normalized.toUpperCase()} (${normalized === "save20" ? "20%" : "10%"} off)` };
    } else {
      setAppliedCoupon("");
      setCouponError("Invalid coupon code. Use SAVE10 or SAVE20.");
      return { success: false, message: "Invalid coupon code. Use SAVE10 or SAVE20." };
    }
  }, []);

  const value = {
    cart,
    items,
    cartCount,
    isLoading,
    subtotal,
    deliveryFee,
    appliedCoupon,
    discountRate,
    discount,
    total,
    couponError,
    addItemToCart,
    updateQuantity,
    removeItem,
    clearCart: clear,
    applyCoupon,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
