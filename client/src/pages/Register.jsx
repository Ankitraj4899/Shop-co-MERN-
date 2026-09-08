import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await register(username, email, password);
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
          <h1 className="auth-title">CREATE ACCOUNT</h1>
          <p className="auth-subtitle">Join SHOP.CO to unlock 20% off your first purchase and order tracking.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

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
                placeholder="Create a strong password"
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
              {isSubmitting ? "Creating account..." : "Sign Up"}
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
    </div>
  );
};

export default Register;