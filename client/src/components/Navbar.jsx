import { Link } from "react-router-dom";
import cross from "../assets/icons/cross.svg";
import cart from "../assets/icons/cart.svg";
import profile from "../assets/icons/profile.svg";
import search1 from "../assets/icons/search1.svg";
import search from "../assets/icons/search.svg";
import hamburger from "../assets/icons/hamburger.svg";
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__top">
                <p className="navbar__content">
                    Sign up and get 20% off to your first order.
                    <Link to="/register" className="sign__link">
                        Sign Up Now
                    </Link>
                </p>

                <button className="navbar--cross">
                    <img src={cross} alt="cross icon" className="cross" />
                </button>
            </div>

            <div className="navbar__bottom">
                <div className="bottom__content">
                    <button><img src={hamburger} className="hamburger" alt="hamburger icon" /></button>
                    <div className="logo">
                        SHOP.CO
                    </div>

                    <div className="navbar__links">
                        <ul className="links">
                            <li className="link__item">Shop</li>
                            <li className="link__item">On Sale</li>
                            <li className="link__item">New Arrivals</li>
                            <li className="link__item">Brands</li>
                        </ul>
                    </div>

                    <div className="search__wrapper">
                        <img src={search1} className="search" alt="" />
                        <input type="text" placeholder="Search for Products" className="navbar__search" />
                    </div>

                    <div className="navbar__icons">
                        <button className="navbar__icon search-img">
                            <img src={search} className="img" alt="search icon image" />
                        </button>
                        <button className="navbar__icon">
                            <img src={cart} className="img" alt="cart image" />
                        </button>

                        <button className="navbar__icon">
                            <img src={profile} className="img" alt="profile image" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;