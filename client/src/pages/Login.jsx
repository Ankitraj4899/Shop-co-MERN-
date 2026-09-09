import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { isValidEmail } from "../lib/validation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const validate = () => {
    const errors = {};
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
      const user = await login(email.trim(), password);
      const destination = location.state?.from || (user.role === "admin" ? "/admin" : "/");
      navigate(destination);
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMsg("");
    setFieldErrors({});
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="auth-page-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-brand-logo">SHOP.CO</div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your account to manage orders and checkout seamlessly
            </p>
          </div>

          <div className="auth-demo-chips">
            <span className="demo-chip-label">Quick Fill Demo:</span>
            <div className="demo-chips-group">
              <button
                type="button"
                className="demo-chip demo-chip--admin"
                onClick={() => handleDemoFill("admin@example.com", "admin123")}
              >
                ⚡ Admin Demo
              </button>
              <button
                type="button"
                className="demo-chip demo-chip--customer"
                onClick={() => handleDemoFill("ankit@example.com", "password123")}
              >
                👤 Customer Demo
              </button>
            </div>
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
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  id="email"
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
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;