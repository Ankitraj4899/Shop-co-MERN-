import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import diamondVector from "../../assets/icons/diamond-vector.svg";
import heroDesktopImg from "../../assets/images/Rectangle-2.png";
import heroMobileImg from "../../assets/images/mobile-bg-photo.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero__text">
        <h1 className="hero__heading">FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
        <p className="hero__para">
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of
          style.
        </p>
        <Button
          className="hero__button"
          text="Shop Now"
          onClick={() => navigate("/categories")}
        />
        <div className="hero__stats-grid">
          <div className="hero__stat-box first-stat-box">
            <h4 className="text-stat">200+</h4>
            <p className="para-stat">International Brands</p>
          </div>

          <div className="hero__stat-box second-stat-box">
            <h4 className="text-stat">2,000+</h4>
            <p className="para-stat">High-Quality Products</p>
          </div>

          <div className="hero__stat-box last-stat-box">
            <h4 className="text-stat">30,000+</h4>
            <p className="para-stat">Happy Customers</p>
          </div>
        </div>
      </div>

      <div className="hero__image-wrapper" aria-hidden="true">
        <img
          src={heroDesktopImg}
          alt=""
          className="hero__image-desktop"
        />
        <img
          src={heroMobileImg}
          alt=""
          className="hero__image-mobile"
        />
        <img
          src={diamondVector}
          alt=""
          className="hero__diamond-star hero__diamond-star--big"
        />
        <img
          src={diamondVector}
          alt=""
          className="hero__diamond-star hero__diamond-star--small"
        />
      </div>
    </section>
  );
};

export default Hero;
