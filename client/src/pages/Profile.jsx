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

        <div className="commerce-heading">
          <h1>MY PROFILE</h1>
        </div>

        <div className="profile-layout">
          <form className="profile-card profile-form" onSubmit={handleSubmit} noValidate>
            <div className="profile-card__header">
              <h2>Personal Information</h2>
              <span className={`badge ${isAdmin ? "badge--admin" : "badge--user"}`}>
                {isAdmin ? "Administrator" : "Customer Account"}
              </span>
            </div>

            <label>
              Full Name
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className={fieldErrors.username ? "input--error" : ""}
              />
              {fieldErrors.username && (
                <span className="field-error-text">{fieldErrors.username}</span>
              )}
            </label>

            <label>
              Email Address (Read-only)
              <input value={user.email} disabled className="input--disabled" />
              <small className="help-text">Email cannot be changed.</small>
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555-0144"
                className={fieldErrors.phone ? "input--error" : ""}
              />
              {fieldErrors.phone && (
                <span className="field-error-text">{fieldErrors.phone}</span>
              )}
            </label>

            <label>
              Default Shipping Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter street, city, state, and postal code"
                className={fieldErrors.address ? "input--error" : ""}
              />
              {fieldErrors.address && (
                <span className="field-error-text">{fieldErrors.address}</span>
              )}
            </label>

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

          <section className="profile-card profile-orders-card">
            <div className="profile-card__header">
              <h2>Recent Orders</h2>
              <Link to="/orders" className="view-all-link">
                View All ({orders.length}) →
              </Link>
            </div>

            <div className="profile-orders-list">
              {orders.slice(0, 4).map((order) => (
                <Link to={`/orders/${order._id}`} className="profile-order-row" key={order._id}>
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
                  <div className="profile-order-row__right">
                    <span className={`status-pill status-pill--${order.status}`}>
                      {order.status}
                    </span>
                    <strong>${order.totalPrice.toFixed(2)}</strong>
                  </div>
                </Link>
              ))}

              {!orders.length && (
                <div className="empty-orders-note">
                  <p>You haven't placed any orders yet.</p>
                  <Link className="button button--dark" to="/categories">
                    Browse Storefront
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;