import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createOrder, getCart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const couponFromUrl = searchParams.get("coupon") || "";

  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [cartItems, setCartItems] = useState([]);
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
  });

  const [couponCode, setCouponCode] = useState(couponFromUrl);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCart()
      .then(({ result }) => {
        setCartItems(result?.items || []);
      })
      .catch((err) => {
        if (err.message.toLowerCase().includes("login")) {
          navigate("/login", { state: { from: "/placeorder" } });
        } else {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  }, [cartItems]);

  const discountRate = useMemo(() => {
    const norm = couponCode.trim().toLowerCase();
    if (norm === "save20") return 0.2;
    if (norm === "save10") return 0.1;
    return 0;
  }, [couponCode]);

  const discount = subtotal * discountRate;
  const deliveryFee = cartItems.length ? 15 : 0;
  const estimatedTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleInputChange = (e) => {
    setShippingForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!shippingForm.address.trim()) {
      setError("Please provide a valid shipping address.");
      return;
    }

    const fullShippingString = [
      shippingForm.fullName,
      shippingForm.phone ? `Phone: ${shippingForm.phone}` : "",
      shippingForm.address,
      shippingForm.city,
      shippingForm.postalCode,
    ].filter(Boolean).join(", ");

    setIsSubmitting(true);
    try {
      const orderPayload = cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size || "Medium",
      }));

      const res = await createOrder(orderPayload, fullShippingString, couponCode);
      await refreshCart();
      navigate(`/orders/${res.order?._id || ""}`);
    } catch (err) {
      setError(err.message || "Failed to place order. Please verify item stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="checkout-page-container">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/cart">Cart</Link>
          <span className="breadcrumb-separator">›</span>
          <span>Checkout</span>
        </nav>

        <div className="commerce-heading">
          <h1>CHECKOUT</h1>
        </div>

        {isLoading && <p className="commerce-state">Loading checkout details...</p>}

        {!isLoading && cartItems.length === 0 && (
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add items to your cart before proceeding to checkout.</p>
            <Link className="button button--dark" to="/categories">
              Go to Storefront
            </Link>
          </div>
        )}

        {!isLoading && cartItems.length > 0 && (
          <div className="checkout-layout">
            {/* Left: Shipping Form */}
            <form className="checkout-form-card" onSubmit={handleSubmitOrder}>
              <h2>1. Shipping Information</h2>

              <div className="form-group-grid">
                <label>
                  Full Name
                  <input
                    type="text"
                    name="fullName"
                    value={shippingForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's name"
                    required
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    placeholder="+1 555-0100"
                    required
                  />
                </label>
              </div>

              <label>
                Street Address
                <textarea
                  name="address"
                  rows="3"
                  value={shippingForm.address}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, unit, building, or street address"
                  required
                />
              </label>

              <div className="form-group-grid">
                <label>
                  City
                  <input
                    type="text"
                    name="city"
                    value={shippingForm.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </label>

                <label>
                  Postal Code
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingForm.postalCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </label>
              </div>

              <h2 className="payment-heading">2. Payment Method</h2>
              <div className="payment-method-box">
                <label className="radio-label">
                  <input type="radio" name="payment" defaultChecked />
                  <span>Cash on Delivery (Standard Secure Delivery)</span>
                </label>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                className="button button--dark button--place-order"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : `Pay $${estimatedTotal.toFixed(2)} & Place Order`}
              </button>
            </form>

            {/* Right: Order Breakdown Summary */}
            <aside className="order-summary-card">
              <h2>Order Summary</h2>

              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div className="checkout-item-row" key={`${item.product?._id}-${item.size}`}>
                    <img
                      src={item.product?.thumbnailImage}
                      alt={item.product?.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
                      }}
                    />
                    <div className="checkout-item-row__info">
                      <h4>{item.product?.name}</h4>
                      <small>Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}</small>
                    </div>
                    <strong>${((item.product?.price || 0) * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <hr className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              {discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount ({couponCode.toUpperCase()})</span>
                  <strong className="discount-val">-${discount.toFixed(2)}</strong>
                </div>
              )}

              <div className="summary-row">
                <span>Delivery Fee</span>
                <strong>${deliveryFee.toFixed(2)}</strong>
              </div>

              <hr className="summary-divider" />

              <div className="summary-row summary-row--total">
                <span>Total Amount</span>
                <strong>${estimatedTotal.toFixed(2)}</strong>
              </div>

              <p className="secure-badge">🔒 Encrypted Server-side Price & Stock Validation</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
