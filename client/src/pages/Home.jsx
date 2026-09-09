import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import { getProducts } from "../lib/api";

import heroImage from "../assets/images/Rectangle.png";
import versaceLogo from "../assets/images/Group.png";
import zaraLogo from "../assets/images/zara-logo-1 1.png";
import gucciLogo from "../assets/images/gucci-logo-1 1.png";
import pradaLogo from "../assets/images/prada-logo-1 1.png";
import calvinKleinLogo from "../assets/images/Group (1).png";

import casualImage from "../assets/images/Frame 61.png";
import formalImage from "../assets/images/Frame 62.png";
import partyImage from "../assets/images/Frame 64.png";
import gymImage from "../assets/images/Frame 63.png";

import visa from "../assets/icons/Visa.png";
import mastercard from "../assets/icons/Mastercard.png";
import paypal from "../assets/icons/Paypal.png";
import gpay from "../assets/icons/G Pay.png";
import apple from "../assets/icons/apple.png";

import x from "../assets/icons/x.png";
import f from "../assets/icons/f.png";
import g from "../assets/icons/g.png";
import i from "../assets/icons/i.png";

const brands = [
  { img: versaceLogo, name: "Versace" },
  { img: zaraLogo, name: "Zara" },
  { img: gucciLogo, name: "Gucci" },
  { img: pradaLogo, name: "Prada" },
  { img: calvinKleinLogo, name: "Calvin Klein" },
];

const testimonialsList = [
  {
    name: "Sarah M.",
    quote: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    verified: true,
  },
  {
    name: "Alex K.",
    quote: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    verified: true,
  },
  {
    name: "James L.",
    quote: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is diverse and on-point.",
    verified: true,
  },
  {
    name: "Emily R.",
    quote: "The fit and finish of their denim collection is top-tier. Fast delivery, easy checkout, and the fabric feels amazingly premium.",
    verified: true,
  },
  {
    name: "Michael B.",
    quote: "Shop.co is my go-to for wardrobe essentials. Great customer support, consistent sizing, and modern cuts that look sharp anywhere.",
    verified: true,
  }
];

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      getProducts("page=1&limit=4&sort=newest"),
      getProducts("page=1&limit=4&sort=popular"),
    ])
      .then(([newRes, topRes]) => {
        if (!isCurrent) return;
        setNewArrivals(newRes.results?.results || []);
        setTopSelling(topRes.results?.results || []);
        setError("");
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const handlePrevTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev === 0 ? testimonialsList.length - 3 : prev - 1));
  }, []);

  const handleNextTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev >= testimonialsList.length - 3 ? 0 : prev + 1));
  }, []);

  const visibleTestimonials = useMemo(() => {
    return testimonialsList.slice(testimonialIndex, testimonialIndex + 3);
  }, [testimonialIndex]);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__container">
            <div className="hero__content">
              <h1>FIND CLOTHES THAT MATCH YOUR STYLE</h1>
              <p className="hero__description">
                Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
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
              <img className="hero__image" src={heroImage} alt="Models wearing SHOP.CO apparel" />
              <svg className="hero__star hero__star--big" viewBox="0 0 56 56" fill="currentColor">
                <path d="M28 0C28 15.464 15.464 28 0 28C15.464 28 28 40.536 28 56C28 40.536 40.536 28 56 28C40.536 28 28 15.464 28 0Z" />
              </svg>
              <svg className="hero__star hero__star--small" viewBox="0 0 56 56" fill="currentColor">
                <path d="M28 0C28 15.464 15.464 28 0 28C15.464 28 28 40.536 28 56C28 40.536 40.536 28 56 28C40.536 28 28 15.464 28 0Z" />
              </svg>
            </div>
          </div>
        </section>

        {/* Brands Ribbon */}
        <section className="brands-strip" id="brands" aria-label="Featured brands">
          <div className="brands-container">
            {brands.map((b) => (
              <img key={b.name} src={b.img} alt={b.name} className="brand-logo" />
            ))}
          </div>
        </section>

        {/* Error / Loading States */}
        {error && <p className="catalog-message catalog-message--error">{error}</p>}
        {isLoading && <p className="catalog-message">Loading fresh arrivals & bestsellers...</p>}

        {/* NEW ARRIVALS Section */}
        <section className="product-section" id="new-arrivals">
          <div className="section-heading text-center">
            <h2>NEW ARRIVALS</h2>
          </div>
          <div className="product-grid">
            {newArrivals.map((product) => (
              <ProductCard key={`new-${product._id}`} product={product} />
            ))}
          </div>
          <div className="view-all-wrap">
            <Link className="button button--outline" to="/categories?sort=newest">
              View All
            </Link>
          </div>
        </section>

        <div className="section-divider" />

        {/* TOP SELLING Section */}
        <section className="product-section" id="on-sale">
          <div className="section-heading text-center">
            <h2>TOP SELLING</h2>
          </div>
          <div className="product-grid">
            {topSelling.map((product) => (
              <ProductCard key={`top-${product._id}`} product={product} />
            ))}
          </div>
          <div className="view-all-wrap">
            <Link className="button button--outline" to="/categories?sort=popular">
              View All
            </Link>
          </div>
        </section>

        {/* BROWSE BY DRESS STYLE Section */}
        <section className="style-section" id="dress-styles">
          <h2>BROWSE BY DRESS STYLE</h2>
          <div className="style-grid">
            <div className="style-row">
              <Link to="/categories?style=Casual" className="style-card style-card--casual" aria-label="Casual dress style">
                <img src={casualImage} alt="Casual style" />
              </Link>
              <Link to="/categories?style=Formal" className="style-card style-card--formal" aria-label="Formal dress style">
                <img src={formalImage} alt="Formal style" />
              </Link>
            </div>
            <div className="style-row">
              <Link to="/categories?style=Party" className="style-card style-card--party" aria-label="Party dress style">
                <img src={partyImage} alt="Party style" />
              </Link>
              <Link to="/categories?style=Gym" className="style-card style-card--gym" aria-label="Gym dress style">
                <img src={gymImage} alt="Gym style" />
              </Link>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS Section */}
        <section className="testimonials">
          <div className="testimonials__header">
            <h2>OUR HAPPY CUSTOMERS</h2>
            <div className="carousel-nav">
              <button type="button" onClick={handlePrevTestimonial} aria-label="Previous review">
                ←
              </button>
              <button type="button" onClick={handleNextTestimonial} aria-label="Next review">
                →
              </button>
            </div>
          </div>
          <div className="testimonial-grid">
            {visibleTestimonials.map((t) => (
              <article className="testimonial-card" key={t.name}>
                <div className="stars">
                  <StarRating rating={5} size={20} />
                </div>
                <h3>
                  {t.name}{" "}
                  {t.verified && (
                    <span className="verified-badge" aria-label="Verified Customer" title="Verified Customer">
                      ✓
                    </span>
                  )}
                </h3>
                <p>"{t.quote}"</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;