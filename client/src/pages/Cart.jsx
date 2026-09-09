import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

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

        {!isLoading && items.length === 0 && (
          <div className="cart-empty-state">
            <div className="cart-empty-state__icon-wrap">
              <svg className="cart-empty-state__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>
              Looks like you haven't added anything to your cart yet. Discover our latest collections and find clothes that match your style!
            </p>
            <div className="cart-empty-state__actions">
              <Link className="button button--dark button--empty-cart" to="/categories">
                Start Shopping
              </Link>
            </div>
            <div className="cart-empty-state__categories">
              <span className="categories-label">Popular Categories:</span>
              <div className="categories-chips">
                <Link to="/categories?style=Casual" className="category-chip">Casual</Link>
                <Link to="/categories?style=Formal" className="category-chip">Formal</Link>
                <Link to="/categories?style=Party" className="category-chip">Party</Link>
                <Link to="/categories?style=Gym" className="category-chip">Gym</Link>
              </div>
            </div>
            <div className="cart-empty-state__features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>On all orders above $50</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <div>
                  <strong>100% Authentic</strong>
                  <p>Direct from top brands</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔒</span>
                <div>
                  <strong>Secure Checkout</strong>
                  <p>Protected & encrypted</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="cart-layout">
            {/* Left Items Section */}
            <section className="cart-items-container">
              {items.map((item) => {
                const prod = item.product || {};
                const maxStock = prod.quantity;
                return (
                  <article className="cart-item-card" key={`${prod._id}-${item.size}`}>
                    <Link to={`/product/${prod._id}`} className="cart-item__image-wrap">
                      <img
                        src={prod.thumbnailImage}
                        alt={prod.name || "Product"}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80";
                        }}
                      />
                    </Link>

                    <div className="cart-item__content">
                      <div className="cart-item__top-row">
                        <Link to={`/product/${prod._id}`}>
                          <h2 className="cart-item__name">{prod.name}</h2>
                        </Link>
                        <button
                          type="button"
                          className="cart-delete-btn"
                          aria-label="Remove item"
                          onClick={() => handleRemove(prod._id)}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7" stroke="#FF3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 11V17" stroke="#FF3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 11V17" stroke="#FF3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7" stroke="#FF3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4 7H20" stroke="#FF3333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>

                      <div className="cart-item__specs">
                        {item.size && <p>Size: <span>{item.size}</span></p>}
                        {prod.style && <p>Style: <span>{prod.style}</span></p>}
                      </div>

                      <div className="cart-item__bottom-row">
                        <strong className="cart-item__price">${prod.price}</strong>

                        <div className="quantity-stepper quantity-stepper--small">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => handleQuantityStep(prod._id, item.quantity - 1, maxStock)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => handleQuantityStep(prod._id, item.quantity + 1, maxStock)}
                            disabled={maxStock !== undefined && item.quantity >= maxStock}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="cart-footer-actions">
                <button type="button" className="clear-cart-btn" onClick={handleClear}>
                  Clear All Items
                </button>
              </div>
            </section>

            {/* Right Order Summary Section */}
            <aside className="order-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              {discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount ({appliedCoupon === "save20" ? "20%" : "10%"})</span>
                  <strong className="discount-val">-${discount.toFixed(2)}</strong>
                </div>
              )}

              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>${deliveryFee.toFixed(2)}</strong>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row summary-row--total">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              {/* Promo Code Input */}
              <form className="promo-form" onSubmit={handleApplyCoupon}>
                <div className="promo-input-wrap">
                  <span className="promo-icon">🏷</span>
                  <input
                    type="text"
                    placeholder="Add promo code (SAVE10, SAVE20)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                  />
                </div>
                <button type="submit" className="button button--dark promo-apply-btn">
                  Apply
                </button>
              </form>

              {couponError && <p className="error-message promo-msg">{couponError}</p>}
              {appliedCoupon && (
                <p className="applied-coupon-pill">
                  ✓ Active code: <strong>{appliedCoupon.toUpperCase()}</strong>
                </p>
              )}

              <button
                type="button"
                className="button button--dark checkout-btn"
                onClick={() => navigate(`/placeorder${appliedCoupon ? `?coupon=${appliedCoupon}` : ""}`)}
              >
                Go to Checkout <span className="arrow-icon">→</span>
              </button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
