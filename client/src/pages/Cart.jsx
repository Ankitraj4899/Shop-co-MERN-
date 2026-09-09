import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import CartEmptyState from "../components/cart/CartEmptyState";

const Cart = () => {
  const navigate = useNavigate();
  const {
    items,
    isLoading,
    subtotal,
    deliveryFee,
    appliedCoupon,
    discount,
    total,
    couponError,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFeedback("");
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      setFeedback(res.message);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuantityStep = async (productId, newQty, availableStock) => {
    setErrorMessage("");
    if (newQty < 1) return;
    if (availableStock && newQty > availableStock) {
      setErrorMessage(`Only ${availableStock} units of this item are available.`);
      return;
    }
    try {
      await updateQuantity(productId, newQty);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleRemove = async (productId) => {
    setErrorMessage("");
    try {
      await removeItem(productId);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      setErrorMessage("");
      try {
        await clearCart();
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="cart-page-container">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span>Cart</span>
        </nav>

        <div className="commerce-heading">
          <h1 className="cart-title">YOUR CART</h1>
        </div>

        {isLoading && <p className="commerce-state">Loading your shopping cart...</p>}

        {errorMessage && <p className="error-message cart-alert">{errorMessage}</p>}
        {feedback && <p className="success-message cart-alert">{feedback}</p>}

        {!isLoading && items.length === 0 && <CartEmptyState />}

        {!isLoading && items.length > 0 && (
          <div className="cart-layout">
            {/* Left Items Section */}
            <section className="cart-items-container">
              {items.map((item) => (
                <CartItem
                  key={`${item.product?._id}-${item.size}`}
                  item={item}
                  onQuantityStep={handleQuantityStep}
                  onRemove={handleRemove}
                />
              ))}

              <div className="cart-footer-actions">
                <button type="button" className="clear-cart-btn" onClick={handleClear}>
                  Clear All Items
                </button>
              </div>
            </section>

            {/* Right Order Summary Section */}
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              appliedCoupon={appliedCoupon}
              discount={discount}
              total={total}
              couponError={couponError}
              inputCoupon={inputCoupon}
              setInputCoupon={setInputCoupon}
              onApplyCoupon={handleApplyCoupon}
              onCheckout={() =>
                navigate(`/placeorder${appliedCoupon ? `?coupon=${appliedCoupon}` : ""}`)
              }
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
