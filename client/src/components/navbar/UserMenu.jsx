import { Link } from "react-router-dom";
import profile from "../../assets/icons/profile.svg";

const UserMenu = ({
  userMenuRef,
  isUserMenuOpen,
  setIsUserMenuOpen,
  isAuthenticated,
  isAdmin,
  user,
  onProfileClick,
  onLogout,
}) => {
  return (
    <div
      className="user-menu-wrapper"
      ref={userMenuRef}
      onMouseEnter={() => setIsUserMenuOpen(true)}
      onMouseLeave={() => setIsUserMenuOpen(false)}
    >
      <button
        className="navbar__icon user-button"
        type="button"
        aria-label="Account menu"
        onClick={onProfileClick}
      >
        <img src={profile} className="img" alt="profile" />
      </button>

      {isUserMenuOpen && (
        <div className="user-dropdown">
          {isAuthenticated ? (
            <>
              <div className="user-dropdown__header">
                <strong>{user?.username}</strong>
                <small>{user?.email}</small>
                <span className="user-dropdown__role">
                  {isAdmin ? "Admin" : "Customer"}
                </span>
              </div>
              <hr className="dropdown-divider" />
              <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                My Profile
              </Link>
              <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                My Orders
              </Link>
              {isAdmin && (
                <Link to="/admin" className="admin-link" onClick={() => setIsUserMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <hr className="dropdown-divider" />
              <button type="button" className="logout-btn" onClick={onLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <div className="user-dropdown__header">
                <strong>Welcome to SHOP.CO</strong>
                <small>Sign in to access your account</small>
              </div>
              <hr className="dropdown-divider" />
              <Link to="/login" onClick={() => setIsUserMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/register" onClick={() => setIsUserMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
