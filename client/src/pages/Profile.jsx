import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrders } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { isValidPhone } from "../lib/validation";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, updateUserProfile, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    getOrders()
      .then(({ orders: loadedOrders }) => setOrders(loadedOrders || []))
      .catch(() => setOrders([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    const nameTrimmed = form.username.trim();
    if (!nameTrimmed) {
      errors.username = "Full name is required.";
    } else if (nameTrimmed.length < 3) {
      errors.username = "Full name must be at least 3 characters.";
    }

    if (form.phone.trim() && !isValidPhone(form.phone.trim())) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (form.address.trim() && form.address.trim().length < 5) {
      errors.address = "Address must be at least 5 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError("");
    setMessage("");
    setIsUpdating(true);
    try {
      await updateUserProfile({
        username: form.username.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (authLoading) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">Loading your profile...</main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="profile-page-container">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span>My Profile</span>
        </nav>

        <div className="profile-hero-card">
          <div className="profile-hero-card__identity">
            <div className="profile-avatar">
              <span>{user.username ? user.username.charAt(0).toUpperCase() : "U"}</span>
            </div>
            <div className="profile-user-info">
              <div className="profile-user-info__header">
                <h1>{user.username || "Shopper"}</h1>
                <span className={`badge ${isAdmin ? "badge--admin" : "badge--user"}`}>
                  {isAdmin ? "Administrator" : "Verified Member"}
                </span>
              </div>
              <p className="profile-user-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-hero-card__stats">
            <div className="profile-stat-item">
              <span className="profile-stat-item__label">Total Orders</span>
              <span className="profile-stat-item__value">{orders.length}</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-item__label">Account Tier</span>
              <span className="profile-stat-item__value">{isAdmin ? "Admin" : "Standard"}</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-item__label">Shipping Address</span>
              <span className="profile-stat-item__value">{form.address ? "Saved" : "Pending"}</span>
            </div>
          </div>
        </div>

        <div className="profile-layout">
          <form className="profile-card profile-form" onSubmit={handleSubmit} noValidate>
            <div className="profile-card__header">
              <div>
                <h2>Personal Details</h2>
                <p className="profile-card__subtitle">Manage your account information and shipping destination</p>
              </div>
            </div>

            <div className="form-field-group">
              <label>
                <span className="field-label-text">
                  Full Name
                </span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={fieldErrors.username ? "input--error" : ""}
                />
                {fieldErrors.username && (
                  <span className="field-error-text">{fieldErrors.username}</span>
                )}
              </label>

              <label>
                <span className="field-label-text">
                  Email Address <span className="read-only-tag">(Read-only)</span>
                </span>
                <input value={user.email} disabled className="input--disabled" />
              </label>

              <label>
                <span className="field-label-text">
                  Phone Number
                </span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={fieldErrors.phone ? "input--error" : ""}
                />
                {fieldErrors.phone && (
                  <span className="field-error-text">{fieldErrors.phone}</span>
                )}
              </label>

              <label>
                <span className="field-label-text">
                  Default Shipping Address
                </span>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Street address, City, State, Postal code"
                  className={fieldErrors.address ? "input--error" : ""}
                />
                {fieldErrors.address && (
                  <span className="field-error-text">{fieldErrors.address}</span>
                )}
              </label>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="profile-actions">
              <button className="button button--dark" type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button className="button button--outline" type="button" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </form>

          <div className="profile-side-column">
            <section className="profile-card profile-orders-card">
              <div className="profile-card__header">
                <div>
                  <h2>Recent Orders</h2>
                  <p className="profile-card__subtitle">Track and view your latest purchases</p>
                </div>
                <Link to="/orders" className="view-all-link">
                  View All ({orders.length}) →
                </Link>
              </div>

              <div className="profile-orders-list">
                {orders.slice(0, 4).map((order) => (
                  <Link to={`/orders/${order._id}`} className="profile-order-row" key={order._id}>
                    <div className="profile-order-row__left">
                      <div>
                        <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                        <small>
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </small>
                      </div>
                    </div>
                    <div className="profile-order-row__right">
                      <span className={`status-pill status-pill--${order.status}`}>
                        {order.status}
                      </span>
                      <strong className="order-price">${order.totalPrice.toFixed(2)}</strong>
                    </div>
                  </Link>
                ))}

                {!orders.length && (
                  <div className="empty-orders-note">
                    <p>You haven't placed any orders yet.</p>
                    <Link className="button button--dark" to="/categories">
                      Explore Collection
                    </Link>
                  </div>
                )}
              </div>
            </section>

            <section className="profile-perks-card">
              <h3>Member Privileges</h3>
              <div className="perks-grid">
                <div className="perk-item">
                  <div>
                    <strong>Express Delivery</strong>
                    <small>Fast track priority shipping on all orders</small>
                  </div>
                </div>
                <div className="perk-item">
                  <div>
                    <strong>Buyer Protection</strong>
                    <small>100% money back guarantee & easy 30-day returns</small>
                  </div>
                </div>
                <div className="perk-item">
                  <div>
                    <strong>Exclusive Drops</strong>
                    <small>Early VIP access to new seasonal collections</small>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;