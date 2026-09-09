import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import cart from "../assets/icons/cart.svg";
import search from "../assets/icons/search.svg";
import hamburger from "../assets/icons/hamburger.svg";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDebounce } from "../hooks/useDebounce";

import TopBanner from "./navbar/TopBanner";
import SearchBar from "./navbar/SearchBar";
import ShopMegaMenu from "./navbar/ShopMegaMenu";
import UserMenu from "./navbar/UserMenu";
import MobileDrawer from "./navbar/MobileDrawer";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const isFirstRender = useRef(true);

  const [showBanner, setShowBanner] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const userMenuRef = useRef(null);
  const shopDropdownRef = useRef(null);

  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    if (urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const trimmed = debouncedSearchTerm.trim();
    const currentParam = searchParams.get("search") || "";

    if (trimmed !== currentParam) {
      if (location.pathname === "/categories") {
        if (trimmed) {
          navigate(`/categories?search=${encodeURIComponent(trimmed)}`, { replace: true });
        } else {
          navigate("/categories", { replace: true });
        }
      } else if (trimmed.length >= 2) {
        navigate(`/categories?search=${encodeURIComponent(trimmed)}`);
      }
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target)) {
        setIsShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const query = searchTerm.trim();
      if (query) {
        navigate(`/categories?search=${encodeURIComponent(query)}`);
        setIsMobileSearchOpen(false);
      } else if (location.pathname === "/categories") {
        navigate("/categories");
        setIsMobileSearchOpen(false);
      }
    }
  };

  const triggerSearch = () => {
    const query = searchTerm.trim();
    if (query) {
      navigate(`/categories?search=${encodeURIComponent(query)}`);
      setIsMobileSearchOpen(false);
    } else if (location.pathname === "/categories") {
      navigate("/categories");
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    setIsUserMenuOpen(false);
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      {showBanner && <TopBanner onClose={() => setShowBanner(false)} />}

      <div className="navbar__bottom">
        <div className="bottom__content">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <img src={hamburger} className="hamburger" alt="menu" />
          </button>

          <Link className="logo" to="/">
            SHOP.CO
          </Link>

          <div className="navbar__links">
            <ul className="links">
              <li
                className="link__item shop-dropdown-parent"
                ref={shopDropdownRef}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                onMouseLeave={() => setIsShopDropdownOpen(false)}
              >
                <Link to="/categories" className="dropdown-trigger">
                  Shop <span className="chevron-down">▾</span>
                </Link>
                <ShopMegaMenu
                  isOpen={isShopDropdownOpen}
                  onClose={() => setIsShopDropdownOpen(false)}
                />
              </li>
              <li className="link__item">
                <a href="/#on-sale">On Sale</a>
              </li>
              <li className="link__item">
                <a href="/#new-arrivals">New Arrivals</a>
              </li>
              <li className="link__item">
                <a href="/#brands">Brands</a>
              </li>
            </ul>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            onTriggerSearch={triggerSearch}
          />

          <div className="navbar__icons">
            <button
              className="navbar__icon search-img"
              type="button"
              aria-label="Toggle search"
              onClick={toggleMobileSearch}
            >
              <img src={search} className="img" alt="search" />
            </button>

            <Link
              className="navbar__icon cart-icon-wrapper"
              to="/cart"
              aria-label={`Cart with ${cartCount} items`}
            >
              <img src={cart} className="img" alt="cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <UserMenu
              userMenuRef={userMenuRef}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              user={user}
              onProfileClick={handleProfileClick}
              onLogout={handleLogout}
            />
          </div>
        </div>

        
        {isMobileSearchOpen && (
          <div className="mobile-search-bar">
            <div className="mobile-search-bar__inner">
              <img
                src={search}
                alt=""
                className="mobile-search-icon"
                onClick={triggerSearch}
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for products..."
                className="mobile-search-input"
                autoFocus
              />
              <button
                type="button"
                className="mobile-search-close"
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Close search"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        user={user}
        onLogout={handleLogout}
      />
    </nav>
  );
};

export default Navbar;