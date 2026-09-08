import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrder } from "../lib/api";

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId)
      .then(({ order: loadedOrder }) => {
        setOrder(loadedOrder);
      })
      .catch((err) => {
        if (err.message.toLowerCase().includes("login")) {
          navigate("/login", { state: { from: `/orders/${orderId}` } });
        } else {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">Loading order details...</main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state commerce-state--error">
          <h2>Order Not Found</h2>
          <p>{error || "Unable to locate the specified order."}</p>
          <Link className="button button--dark" to="/orders">
            Back to Orders
          </Link>
        </main>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status.toLowerCase());

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="order-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/orders">Orders</Link>
          <span className="breadcrumb-separator">›</span>
          <span>Order #{order._id.slice(-8).toUpperCase()}</span>
        </nav>

        <div className="commerce-heading order-details-heading">
          <div>
            <h1>ORDER #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="order-placed-date">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span className={`status-pill status-pill--${order.status}`}>
            {order.status}
          </span>
        </div>

        {/* Order Status Progress Tracker */}
        {order.status !== "cancelled" && (
          <div className="order-status-tracker">
            {statusSteps.map((step, idx) => {
              const isDone = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;
              return (
                <div className={`tracker-step ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""}`} key={step}>
                  <div className="step-circle">{isDone ? "✓" : idx + 1}</div>
                  <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="order-details-layout">
          {/* Purchased Products */}
          <section className="order-details-card items-card">
            <h2>Items in this Order ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</h2>
            <div className="order-items-table">
              {order.items.map((item, idx) => (
                <div className="order-item-detail-row" key={`detail-${idx}-${item.name}`}>
                  <img
                    src={item.thumbnailImage || item.product?.thumbnailImage || "/images/products/arrival1.png"}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80";
                    }}
                  />
                  <div className="order-item-detail-row__info">
                    <h3>{item.name}</h3>
                    {item.size && <p>Size: <span>{item.size}</span></p>}
                    <p>Unit Price: <strong>${item.price}</strong></p>
                  </div>
                  <div className="order-item-detail-row__qty">
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="order-item-detail-row__subtotal">
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery & Summary Column */}
          <aside className="order-details-card summary-card">
            <h2>Delivery Address</h2>
            <div className="shipping-address-box">
              <div className="shipping-address-box__header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#000"/>
                </svg>
                <strong>Shipping Destination</strong>
              </div>
              <p className="shipping-address-box__text">{order.shippingAddress}</p>
            </div>

            <hr className="detail-divider" />

            <h2>Payment & Cost Summary</h2>
            <div className="summary-row">
              <span>Items Subtotal</span>
              <strong>${order.subtotal.toFixed(2)}</strong>
            </div>

            {order.discount > 0 && (
              <div className="summary-row summary-row--discount">
                <span>Discount {order.couponCode ? `(${order.couponCode.toUpperCase()})` : ""}</span>
                <strong className="discount-val">-${order.discount.toFixed(2)}</strong>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping & Handling</span>
              <strong>${(order.shippingFee || 15).toFixed(2)}</strong>
            </div>

            <hr className="detail-divider" />

            <div className="summary-row summary-row--total">
              <span>Grand Total</span>
              <strong>${order.totalPrice.toFixed(2)}</strong>
            </div>

            <Link to="/categories" className="button button--dark button--continue-shop">
              Continue Shopping
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetails;