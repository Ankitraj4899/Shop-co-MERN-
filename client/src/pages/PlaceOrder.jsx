import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createOrder, getCart } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { isValidPhone, isValidPostalCode } from "../lib/validation";

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
  const [formErrors, setFormErrors] = useState({});

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
        if (err.message?.toLowerCase().includes("login")) {
          navigate("/login", { state: { from: "/placeorder" } });
        } else {
          setError(err.message || "Failed to load cart");
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const normalizedCoupon = couponCode.trim().toLowerCase();
  const discountRate =
    normalizedCoupon === "save20" ? 0.2 : normalizedCoupon === "save10" ? 0.1 : 0;
  const discount = subtotal * discountRate;
  const deliveryFee = cartItems.length ? 15 : 0;
  const estimatedTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateShippingForm = () => {
    const errors = {};

    const nameTrimmed = shippingForm.fullName.trim();
    if (!nameTrimmed) {
      errors.fullName = "Full name is required.";
    } else if (nameTrimmed.length < 3) {
      errors.fullName = "Full name must be at least 3 characters.";
    }

    const phoneTrimmed = shippingForm.phone.trim();
    if (!phoneTrimmed) {
      errors.phone = "Phone number is required.";
    } else if (!isValidPhone(phoneTrimmed)) {
      errors.phone = "Please enter a valid phone number (e.g. +1 555-0100).";
    }

    const addressTrimmed = shippingForm.address.trim();
    if (!addressTrimmed) {
      errors.address = "Shipping street address is required.";
    } else if (addressTrimmed.length < 5) {
      errors.address = "Please enter a complete street address (at least 5 characters).";
    }

    const cityTrimmed = shippingForm.city.trim();
    if (!cityTrimmed) {
      errors.city = "City is required.";
    } else if (cityTrimmed.length < 2) {
      errors.city = "Please enter a valid city name.";
    }

    const postalTrimmed = shippingForm.postalCode.trim();
    if (!postalTrimmed) {
      errors.postalCode = "Postal code is required.";
    } else if (!isValidPostalCode(postalTrimmed)) {
      errors.postalCode = "Please enter a valid postal/ZIP code.";
    }

    setFormErrors(errors);
    //object.keys gives all the property or attribute name
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!validateShippingForm()) return;

    setError("");

    const fullShippingAddress = [
      shippingForm.fullName.trim(),
      shippingForm.phone.trim() ? `Phone: ${shippingForm.phone.trim()}` : "",
      shippingForm.address.trim(),
      shippingForm.city.trim(),
      shippingForm.postalCode.trim(),
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

      const res = await createOrder(orderPayload, fullShippingAddress, couponCode);
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
              formErrors={formErrors}
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
