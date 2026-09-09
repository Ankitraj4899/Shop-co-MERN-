import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createOrder, getCart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import ShippingForm from "../components/checkout/ShippingForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

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
    return cartItems.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );
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
    ]
      .filter(Boolean)
      .join(", ");

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
            <ShippingForm
              shippingForm={shippingForm}
              onInputChange={handleInputChange}
              onSubmit={handleSubmitOrder}
              isSubmitting={isSubmitting}
              estimatedTotal={estimatedTotal}
              error={error}
            />

            <CheckoutSummary
              cartItems={cartItems}
              subtotal={subtotal}
              discount={discount}
              discountRate={discountRate}
              couponCode={couponCode}
              deliveryFee={deliveryFee}
              estimatedTotal={estimatedTotal}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PlaceOrder;
