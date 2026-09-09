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

          
            <aside className="order-details-card summary-card">
            <h2>Delivery Address</h2>
            <div className="shipping-address-box">
              <div className="shipping-address-box__header">
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