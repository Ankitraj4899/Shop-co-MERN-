import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { isValidEmail } from "../lib/validation";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const validate = () => {
    const errors = {};
    const nameTrimmed = username.trim();
    if (!nameTrimmed) {
      errors.username = "Full Name is required.";
    } else if (nameTrimmed.length < 3) {
      errors.username = "Full Name must be at least 3 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await register(username.trim(), email.trim(), password);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="auth-page-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-logo">SHOP.CO</div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Join SHOP.CO to unlock 20% off your first order & express checkout
            </p>
          </div>

          <div className="auth-perk-banner">
            <span className="perk-badge">🎁 WELCOME BENEFIT</span>
            <span>Get 20% off auto-applied on your initial purchase!</span>
          </div>

          {errorMsg && (
            <div className="auth-error-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-input-group">
              <label htmlFor="username">Full Name</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  className={fieldErrors.username ? "input--error" : ""}
                />
              </div>
              {fieldErrors.username && (
                <span className="field-error-text">{fieldErrors.username}</span>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="register-email">Email Address</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={fieldErrors.email ? "input--error" : ""}
                />
              </div>
              {fieldErrors.email && (
                <span className="field-error-text">{fieldErrors.email}</span>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="register-password">Password</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password (min. 6 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={fieldErrors.password ? "input--error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="field-error-text">{fieldErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="button button--dark button--auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-btn-spinner-wrap">
                  <span className="auth-btn-spinner"></span>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;