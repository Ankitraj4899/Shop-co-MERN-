import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      // Redirect admin to /admin or requested route, otherwise from or home
      const destination = location.state?.from || (user.role === "admin" ? "/admin" : "/");
      navigate(destination);
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="auth-page-container">
        <div className="auth-card">
          <h1 className="auth-title">LOG IN</h1>
          <p className="auth-subtitle">Welcome back! Sign in to access your orders and cart.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email Address
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {errorMsg && <p className="error-message auth-error">{errorMsg}</p>}

            <button
              type="submit"
              className="button button--dark button--auth-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-demo-helper">
            <strong>Demo Accounts:</strong>
            <p>Admin: <code>admin@example.com</code> / <code>admin123</code></p>
            <p>Customer: <code>ankit@example.com</code> / <code>password123</code></p>
          </div>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch-link">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;