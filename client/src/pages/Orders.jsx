import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrders } from "../lib/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(({ orders: loadedOrders }) => setOrders(loadedOrders || []))
      .catch((err) => {
        if (err.message.toLowerCase().includes("login")) {
          navigate("/login", { state: { from: "/orders" } });
        } else {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="orders-page-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/profile">Profile</Link>
          <span className="breadcrumb-separator">›</span>
          <span>My Orders</span>
        </nav>

        <div className="commerce-heading">
          <h1>MY ORDERS</h1>
        </div>

        {isLoading && <p className="commerce-state">Loading your orders...</p>}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && !error && orders.length === 0 && (
          <div className="orders-empty-state">
            <div className="orders-empty-state__icon-box">
              <svg
                className="orders-empty-state__icon"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h2 className="orders-empty-state__title">NO ORDERS YET</h2>
            <p className="orders-empty-state__description">
              You have not placed any orders yet. When you make a purchase, your items and delivery tracking updates will be displayed here.
            </p>
            <div className="orders-empty-state__actions">
              <Link className="button button--dark orders-empty-state__cta" to="/categories">
                Start Shopping
              </Link>
            </div>
            <div className="orders-empty-state__categories">
              <span className="orders-empty-state__categories-label">Explore Collections:</span>
              <div className="orders-empty-state__chips">
                <Link to="/categories?style=Casual" className="orders-empty-state__chip">
                  Casual
                </Link>
                <Link to="/categories?style=Formal" className="orders-empty-state__chip">
                  Formal
                </Link>
                <Link to="/categories?style=Party" className="orders-empty-state__chip">
                  Party
                </Link>
                <Link to="/categories?style=Gym" className="orders-empty-state__chip">
                  Gym
                </Link>
              </div>
            </div>
            <div className="orders-empty-state__features">
              <div className="orders-empty-state__feature-card">
                <span className="orders-empty-state__feature-icon">🚚</span>
                <div className="orders-empty-state__feature-content">
                  <strong className="orders-empty-state__feature-title">Free Delivery</strong>
                  <p className="orders-empty-state__feature-text">On eligible orders over $50</p>
                </div>
              </div>
              <div className="orders-empty-state__feature-card">
                <span className="orders-empty-state__feature-icon">📦</span>
                <div className="orders-empty-state__feature-content">
                  <strong className="orders-empty-state__feature-title">Live Tracking</strong>
                  <p className="orders-empty-state__feature-text">Step-by-step shipment status</p>
                </div>
              </div>
              <div className="orders-empty-state__feature-card">
                <span className="orders-empty-state__feature-icon">✨</span>
                <div className="orders-empty-state__feature-content">
                  <strong className="orders-empty-state__feature-title">100% Authentic</strong>
                  <p className="orders-empty-state__feature-text">Directly from curated brands</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-history-card" key={order._id}>
                <div className="order-history-card__header">
                  <div className="order-meta-info">
                    <strong className="order-meta-info__id">Order #{order._id.slice(-8).toUpperCase()}</strong>
                    <time className="order-meta-info__time">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-pill status-pill--${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <Link to={`/orders/${order._id}`} className="view-details-btn">
                      View Order Details →
                    </Link>
                  </div>
                </div>

                <div className="order-history-card__items">
                  {order.items.map((item, idx) => (
                    <div className="order-item-snippet" key={`item-${idx}-${item.name}`}>
                      <img
                        className="order-item-snippet__thumb"
                        src={item.thumbnailImage || item.product?.thumbnailImage || "/images/products/arrival1.png"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="order-item-snippet__info">
                        <h4 className="order-item-snippet__title">{item.name}</h4>
                        <small className="order-item-snippet__specs">Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}</small>
                        <span className="order-item-snippet__unit-price">${item.price} each</span>
                      </div>
                      <strong className="item-snippet-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-history-card__footer">
                  <div className="order-shipping-summary">
                    <div className="shipping-summary-badge">
                      <small className="shipping-summary-badge__label">Delivering to:</small>
                    </div>
                    <p className="order-shipping-summary__address">{order.shippingAddress}</p>
                  </div>
                  <div className="order-total-block">
                    <span className="order-total-block__label">Order Total:</span>
                    <strong className="order-total-block__value">${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
