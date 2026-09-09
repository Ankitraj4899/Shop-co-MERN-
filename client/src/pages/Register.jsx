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
      errors.username = "Full name is required.";
    } else if (nameTrimmed.length < 3) {
      errors.username = "Full name must be at least 3 characters.";
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
            <h1 className="auth-title">CREATE ACCOUNT</h1>
            <p className="auth-subtitle">
              Fill in your details to create a new account.
            </p>
          </div>

          {errorMsg && (
            <div className="auth-error-alert">
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-input-group">
              <label htmlFor="username" className="auth-label">Full Name</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your full name"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: "" }));
                }}
                className={`auth-input ${fieldErrors.username ? "input--error" : ""}`}
              />
              {fieldErrors.username && (
                <span className="field-error-text">{fieldErrors.username}</span>
              )}
            </div>

            <div className="auth-input-group">
              <label htmlFor="register-email" className="auth-label">Email Address</label>
              <input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`auth-input ${fieldErrors.email ? "input--error" : ""}`}
              />
              {fieldErrors.email && (
                <span className="field-error-text">{fieldErrors.email}</span>
              )}
            </div>

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label htmlFor="register-password" className="auth-label">Password</label>
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password (min. 6 characters)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`auth-input ${fieldErrors.password ? "input--error" : ""}`}
              />
              {fieldErrors.password && (
                <span className="field-error-text">{fieldErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="button button--dark button--auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;