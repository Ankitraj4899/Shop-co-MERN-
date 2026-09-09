import { Link } from "react-router-dom";

const MobileDrawer = ({
  isOpen,
  onClose,
  isAuthenticated,
  isAdmin,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-overlay" onClick={onClose}>
      <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-drawer__header">
          <span className="logo">SHOP.CO</span>
          <button type="button" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>
        <ul className="mobile-drawer__nav">
          <li>
            <Link to="/categories" onClick={onClose}>
              All Categories
            </Link>
          </li>
          <li>
            <Link to="/categories?style=Casual" onClick={onClose}>
              Casual Style
            </Link>
          </li>
          <li>
            <Link to="/categories?style=Formal" onClick={onClose}>
              Formal Style
            </Link>
          </li>
          <li>
            <Link to="/categories?style=Party" onClick={onClose}>
              Party Style
            </Link>
          </li>
          <li>
            <Link to="/categories?style=Gym" onClick={onClose}>
              Gym Style
            </Link>
          </li>
          <li>
            <a href="/#new-arrivals" onClick={onClose}>
              New Arrivals
            </a>
          </li>
          <li>
            <a href="/#on-sale" onClick={onClose}>
              Top Selling
            </a>
          </li>
          <hr />
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile" onClick={onClose}>
                  Profile ({user?.username})
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={onClose}>
                  Orders
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link to="/admin" onClick={onClose}>
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button type="button" className="text-button" onClick={onLogout}>
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={onClose}>
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={onClose}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileDrawer;
