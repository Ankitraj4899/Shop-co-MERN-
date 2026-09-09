import { Link } from "react-router-dom";
import heroImage from "../../assets/images/Rectangle.png";

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1>FIND CLOTHES THAT MATCH YOUR STYLE</h1>
          <p className="hero__description">
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </p>
          <Link className="button button--dark button--hero" to="/categories">
            Shop Now
          </Link>
          <div className="hero__stats">
            <div className="stat-item">
              <strong>200+</strong>
              <span>International Brands</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <strong>2,000+</strong>
              <span>High-Quality Products</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item stat-item--last">
              <strong>30,000+</strong>
              <span>Happy Customers</span>
            </div>
          </div>
        </div>

        <div className="hero__image-wrap">
          <img
            className="hero__image"
            src={heroImage}
            alt="Models wearing SHOP.CO apparel"
          />
          <svg
            className="hero__star hero__star--big"
            viewBox="0 0 56 56"
            fill="currentColor"
          >
            <path d="M28 0C28 15.464 15.464 28 0 28C15.464 28 28 40.536 28 56C28 40.536 40.536 28 56 28C40.536 28 28 15.464 28 0Z" />
          </svg>
          <svg
            className="hero__star hero__star--small"
            viewBox="0 0 56 56"
            fill="currentColor"
          >
            <path d="M28 0C28 15.464 15.464 28 0 28C15.464 28 28 40.536 28 56C28 40.536 40.536 28 56 28C40.536 28 28 15.464 28 0Z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
