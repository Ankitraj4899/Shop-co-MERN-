import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getProducts } from "../lib/api";

import HeroSection from "../components/home/HeroSection";
import BrandsStrip from "../components/home/BrandsStrip";
import DressStyleSection from "../components/home/DressStyleSection";
import TestimonialsSection, { testimonialsList } from "../components/home/TestimonialsSection";

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([
      getProducts("page=1&limit=4&sort=newest"),
      getProducts("page=1&limit=4&sort=popular"),
    ])
      .then(([newRes, topRes]) => {
        if (!active) return;
        setNewArrivals(newRes.results?.results || []);
        setTopSelling(topRes.results?.results || []);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) =>
      prev === 0 ? testimonialsList.length - 3 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) =>
      prev >= testimonialsList.length - 3 ? 0 : prev + 1
    );
  };

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <HeroSection />
        <BrandsStrip />

        {error && <p className="catalog-message catalog-message--error">{error}</p>}
        {isLoading && (
          <p className="catalog-message">Loading fresh arrivals & bestsellers...</p>
        )}

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

        <DressStyleSection />

        <TestimonialsSection
          testimonialIndex={testimonialIndex}
          onPrev={handlePrevTestimonial}
          onNext={handleNextTestimonial}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Home;