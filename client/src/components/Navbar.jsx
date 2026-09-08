import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import cross from "../assets/icons/cross.svg";
import cart from "../assets/icons/cart.svg";
import profile from "../assets/icons/profile.svg";
import search1 from "../assets/icons/search1.svg";
import search from "../assets/icons/search.svg";
import hamburger from "../assets/icons/hamburger.svg";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [showBanner, setShowBanner] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

    const userMenuRef = useRef(null);
    const shopDropdownRef = useRef(null);

    useEffect(() => {
        setSearchTerm(searchParams.get("search") || "");
    }, [searchParams]);

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
            navigate(query ? `/categories?search=${encodeURIComponent(query)}` : "/categories");
        }
    };

    const triggerSearch = () => {
        const query = searchTerm.trim();
        navigate(query ? `/categories?search=${encodeURIComponent(query)}` : "/categories");
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
            {showBanner && (
                <div className="navbar__top">
                    <p className="navbar__content">
                        Sign up and get 20% off your first order.{" "}
                        <Link to="/register" className="sign__link">
                            Sign Up Now
                        </Link>
                    </p>
                    <button
                        className="navbar--cross"
                        type="button"
                        aria-label="Close announcement"
                        onClick={() => setShowBanner(false)}
                    >
                        <img src={cross} alt="close" className="cross" />
                    </button>
                </div>
            )}

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

                    <Link className="logo" to="/">SHOP.CO</Link>

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
                                {isShopDropdownOpen && (
                                    <div className="shop-megamenu">
                                        <div className="megamenu-col">
                                            <strong>Categories</strong>
                                            <Link to="/categories?category=T-Shirts" onClick={() => setIsShopDropdownOpen(false)}>T-Shirts</Link>
                                            <Link to="/categories?category=Shirts" onClick={() => setIsShopDropdownOpen(false)}>Shirts</Link>
                                            <Link to="/categories?category=Jeans" onClick={() => setIsShopDropdownOpen(false)}>Jeans</Link>
                                            <Link to="/categories?category=Shorts" onClick={() => setIsShopDropdownOpen(false)}>Shorts</Link>
                                            <Link to="/categories?category=Outerwear" onClick={() => setIsShopDropdownOpen(false)}>Outerwear</Link>
                                        </div>
                                        <div className="megamenu-col">
                                            <strong>Dress Styles</strong>
                                            <Link to="/categories?style=Casual" onClick={() => setIsShopDropdownOpen(false)}>Casual</Link>
                                            <Link to="/categories?style=Formal" onClick={() => setIsShopDropdownOpen(false)}>Formal</Link>
                                            <Link to="/categories?style=Party" onClick={() => setIsShopDropdownOpen(false)}>Party</Link>
                                            <Link to="/categories?style=Gym" onClick={() => setIsShopDropdownOpen(false)}>Gym</Link>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li className="link__item"><a href="/#on-sale">On Sale</a></li>
                            <li className="link__item"><a href="/#new-arrivals">New Arrivals</a></li>
                            <li className="link__item"><a href="/#brands">Brands</a></li>
                        </ul>
                    </div>

                    <div className="search__wrapper">
                        <img src={search1} className="search" alt="" onClick={triggerSearch} style={{ cursor: "pointer" }} />
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Search for products..."
                            className="navbar__search"
                        />
                    </div>

                    <div className="navbar__icons">
                        <button
                            className="navbar__icon search-img"
                            type="button"
                            aria-label="Search"
                            onClick={triggerSearch}
                        >
                            <img src={search} className="img" alt="search" />
                        </button>

                        <Link className="navbar__icon cart-icon-wrapper" to="/cart" aria-label={`Cart with ${cartCount} items`}>
                            <img src={cart} className="img" alt="cart" />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

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
                                onClick={handleProfileClick}
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
                                                <span className={`badge ${isAdmin ? "badge--admin" : "badge--user"}`}>
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
                                            <button type="button" className="logout-btn" onClick={handleLogout}>
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
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setIsMenuOpen(false)}>
                    <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-drawer__header">
                            <span className="logo">SHOP.CO</span>
                            <button type="button" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                                ✕
                            </button>
                        </div>
                        <ul className="mobile-drawer__nav">
                            <li><Link to="/categories" onClick={() => setIsMenuOpen(false)}>All Categories</Link></li>
                            <li><Link to="/categories?style=Casual" onClick={() => setIsMenuOpen(false)}>Casual Style</Link></li>
                            <li><Link to="/categories?style=Formal" onClick={() => setIsMenuOpen(false)}>Formal Style</Link></li>
                            <li><Link to="/categories?style=Party" onClick={() => setIsMenuOpen(false)}>Party Style</Link></li>
                            <li><Link to="/categories?style=Gym" onClick={() => setIsMenuOpen(false)}>Gym Style</Link></li>
                            <li><a href="/#new-arrivals" onClick={() => setIsMenuOpen(false)}>New Arrivals</a></li>
                            <li><a href="/#on-sale" onClick={() => setIsMenuOpen(false)}>Top Selling</a></li>
                            <hr />
                            {isAuthenticated ? (
                                <>
                                    <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile ({user?.username})</Link></li>
                                    <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link></li>
                                    {isAdmin && <li><Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link></li>}
                                    <li><button type="button" className="text-button" onClick={handleLogout}>Log Out</button></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link></li>
                                    <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;