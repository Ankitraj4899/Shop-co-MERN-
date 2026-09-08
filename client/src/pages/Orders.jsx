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
        {/* Breadcrumbs */}
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
          <div className="empty-state">
            <h2>No orders yet</h2>
            <p>Your completed purchases will appear here with full delivery tracking.</p>
            <Link className="button button--dark" to="/categories">
              Start Shopping
            </Link>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-history-card" key={order._id}>
                <div className="order-history-card__header">
                  <div className="order-meta-info">
                    <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    <time>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
                  </div>

                  <div className="order-header-right">
                    <span className={`status-pill status-pill--${order.status}`}>
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
                        src={item.thumbnailImage || item.product?.thumbnailImage || "/images/products/arrival1.png"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
                        }}
                      />
                      <div className="order-item-snippet__info">
                        <h4>{item.name}</h4>
                        <small>Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ""}</small>
                        <span>${item.price} each</span>
                      </div>
                      <strong className="item-snippet-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-history-card__footer">
                  <div className="order-shipping-summary">
                    <small>Delivering to:</small>
                    <p>{order.shippingAddress}</p>
                  </div>
                  <div className="order-total-block">
                    <span>Order Total:</span>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
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
