import { Link } from "react-router-dom";

const CartEmptyState = () => {
  return (
    <div className="cart-empty-state">
      <div className="cart-empty-state__icon-wrap">
        <svg
          className="cart-empty-state__icon"
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
      <h2 className="cart-empty-state__title">Your cart is empty</h2>
      <p className="cart-empty-state__description">
        Looks like you haven't added anything to your cart yet. Discover our latest collections and find clothes that match your style!
      </p>
      <div className="cart-empty-state__actions">
        <Link className="button button--dark button--empty-cart" to="/categories">
          Start Shopping
        </Link>
      </div>
      <div className="cart-empty-state__categories">
        <span className="categories-label">Popular Categories:</span>
        <div className="categories-chips">
          <Link to="/categories?style=Casual" className="category-chip">
            Casual
          </Link>
          <Link to="/categories?style=Formal" className="category-chip">
            Formal
          </Link>
          <Link to="/categories?style=Party" className="category-chip">
            Party
          </Link>
          <Link to="/categories?style=Gym" className="category-chip">
            Gym
          </Link>
        </div>
      </div>
      <div className="cart-empty-state__features">
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <div>
            <strong className="feature-item__title">Free Delivery</strong>
            <p className="feature-item__text">On all orders above $50</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">✨</span>
          <div>
            <strong className="feature-item__title">100% Authentic</strong>
            <p className="feature-item__text">Direct from top brands</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <div>
            <strong className="feature-item__title">Secure Checkout</strong>
            <p className="feature-item__text">Protected & encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEmptyState;
