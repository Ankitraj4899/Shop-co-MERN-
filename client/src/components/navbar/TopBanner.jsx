import { Link } from "react-router-dom";
import cross from "../../assets/icons/cross.svg";

const TopBanner = ({ onClose }) => {
  return (
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
        onClick={onClose}
      >
        <img src={cross} alt="close" className="cross" />
      </button>
    </div>
  );
};

export default TopBanner;
