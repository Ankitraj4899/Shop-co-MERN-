import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import StarRating from "../components/StarRating";
import { getProduct, getProducts, addProductReview } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Product = () => {
  const { productId } = useParams();
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProduct(productId);
      const prod = data.product || data.results || data;
      setProduct(prod);
      if (prod) {
        const primaryImg = prod.thumbnailImage || (prod.galleryImages && prod.galleryImages[0]) || "";
        setSelectedImage(primaryImg);
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0]);
        }
        if (prod.variants && prod.variants.length > 0) {
          setSelectedSize(prod.variants[0].size || "Medium");
        }
      }

      // Fetch related products
      const relData = await getProducts(`limit=4`);
      const allRel = relData.products || relData.results || [];
      setRelatedProducts(allRel.filter((p) => p._id !== productId).slice(0, 4));
    } catch (err) {
      setError(err.message || "Failed to load product details.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [fetchProductData]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItemToCart(product._id, quantity, selectedSize);
      setToastMessage(`Added ${quantity} x ${product.name} (${selectedSize}) to your cart!`);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err) {
      setToastMessage(err.message || "Could not add item to cart.");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewError("");
    try {
      await addProductReview(productId, {
        rating: reviewRating,
        comment: reviewComment,
        name: reviewerName,
      });
      setShowReviewModal(false);
      setReviewComment("");
      setReviewerName("");
      setToastMessage("Thank you! Your review has been published.");
      setTimeout(() => setToastMessage(""), 4000);
      fetchProductData(); // Refresh reviews
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">Loading product details...</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">
          <h2>Product Not Found</h2>
          <p>{error || "The product you requested could not be located."}</p>
          <Link to="/" className="button button--dark" style={{ marginTop: "16px" }}>
            Return to Store
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const galleryList = [
    product.thumbnailImage,
    ...(product.galleryImages || []),
  ].filter(Boolean);

  const colorsList = product.colors && product.colors.length > 0 ? product.colors : [
    { name: "Olive", hex: "#4F533E" },
    { name: "Forest", hex: "#314F4A" },
    { name: "Navy", hex: "#31344F" },
  ];

  const sizesList = product.variants && product.variants.length > 0
    ? product.variants.map((v) => v.size)
    : ["Small", "Medium", "Large", "X-Large"];

  const reviewsList = product.reviews || [];

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="product-page-container">
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              backgroundColor: "#000",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "62px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              zIndex: 9999,
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/categories">Shop</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span>{product.category?.name || "Apparel"}</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="product-detail">
          {/* Gallery Showcase */}
          <div className="product-detail__gallery">
            <div className="product-detail__thumbs">
              {galleryList.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`thumb-btn ${selectedImage === imgUrl ? "is-selected" : ""}`}
                  onClick={() => setSelectedImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>

            <div className="product-detail__main-image-wrap">
              <img
                src={selectedImage || product.thumbnailImage}
                alt={product.name}
                className="product-detail__image"
              />
              {product.quantity === 0 && (
                <span className="detail-badge detail-badge--out">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Product Info & Controls */}
          <div className="product-detail__info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-detail__rating-row">
              <StarRating rating={product.rating || 4.5} size={20} />
              <span className="rating-num">
                {product.rating || 4.5} <span className="rating-max">/ 5</span>
              </span>
            </div>

            <div className="product-detail__price-row">
              <strong className="current-price">${product.price}</strong>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">${product.originalPrice}</span>
              )}
              {product.discount > 0 && (
                <span className="discount-pill">-{product.discount}%</span>
              )}
            </div>

            <p className="product-detail__description">{product.description}</p>

            <hr className="detail-divider" />

            {/* Select Colors */}
            <div className="product-option">
              <h3>Select Colors</h3>
              <div className="color-swatches-grid">
                {colorsList.map((colorObj, idx) => {
                  const hexColor = typeof colorObj === "string" ? colorObj : colorObj.hex || "#333";
                  const colorName = typeof colorObj === "string" ? colorObj : colorObj.name || "Color";
                  const isSelected = selectedColor?.name === colorName || selectedColor === hexColor;

                  return (
                    <button
                      key={idx}
                      type="button"
                      title={colorName}
                      className={`color-swatch ${isSelected ? "is-selected" : ""}`}
                      style={{ backgroundColor: hexColor }}
                      onClick={() => setSelectedColor(colorObj)}
                    >
                      {isSelected && <span className="swatch-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="detail-divider" />

            {/* Choose Size */}
            <div className="product-option">
              <h3>Choose Size</h3>
              <div className="size-pills-grid">
                {sizesList.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-pill ${selectedSize === size ? "is-selected" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <hr className="detail-divider" />

            {/* Actions: Quantity & Add to Cart */}
            <div className="product-detail__actions">
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="button button--dark button--add-cart"
                onClick={handleAddToCart}
                disabled={isAdding || product.quantity === 0}
              >
                {isAdding ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs: Rating & Reviews, Product Details, FAQs */}
        <div style={{ marginTop: "64px" }}>
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e5e5e5",
              justifyContent: "space-around",
              marginBottom: "32px",
            }}
          >
            <button
              type="button"
              style={{
                padding: "16px 24px",
                border: "none",
                background: "none",
                fontSize: "18px",
                fontWeight: activeTab === "details" ? "700" : "400",
                color: activeTab === "details" ? "#000" : "#666",
                borderBottom: activeTab === "details" ? "2px solid #000" : "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("details")}
            >
              Product Details
            </button>
            <button
              type="button"
              style={{
                padding: "16px 24px",
                border: "none",
                background: "none",
                fontSize: "18px",
                fontWeight: activeTab === "reviews" ? "700" : "400",
                color: activeTab === "reviews" ? "#000" : "#666",
                borderBottom: activeTab === "reviews" ? "2px solid #000" : "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("reviews")}
            >
              Rating & Reviews ({reviewsList.length})
            </button>
            <button
              type="button"
              style={{
                padding: "16px 24px",
                border: "none",
                background: "none",
                fontSize: "18px",
                fontWeight: activeTab === "faqs" ? "700" : "400",
                color: activeTab === "faqs" ? "#000" : "#666",
                borderBottom: activeTab === "faqs" ? "2px solid #000" : "none",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("faqs")}
            >
              FAQs
            </button>
          </div>

          {/* Tab Content: Rating & Reviews */}
          {activeTab === "reviews" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <h3 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                  All Reviews <span style={{ fontSize: "14px", color: "#888", fontWeight: "400" }}>({reviewsList.length})</span>
                </h3>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button
                    type="button"
                    className="button button--dark"
                    style={{ padding: "10px 20px", fontSize: "14px" }}
                    onClick={() => setShowReviewModal(true)}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {reviewsList.length === 0 ? (
                <p style={{ color: "#666", textAlign: "center", padding: "40px 0" }}>
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {reviewsList.map((rev, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e5e5",
                        borderRadius: "20px",
                        padding: "24px",
                      }}
                    >
                      <StarRating rating={rev.rating} size={16} />
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "12px 0 8px" }}>
                        <strong style={{ fontSize: "16px" }}>{rev.name || "Customer"}</strong>
                        {rev.verified !== false && (
                          <span style={{ color: "#01B763", fontSize: "14px" }} title="Verified Purchase">
                            ✓
                          </span>
                        )}
                      </div>
                      <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>
                        "{rev.comment}"
                      </p>
                      {rev.createdAt && (
                        <div style={{ marginTop: "16px", fontSize: "12px", color: "#999" }}>
                          Posted on {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content: Product Details */}
          {activeTab === "details" && (
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "20px", padding: "32px" }}>
              <h3 style={{ marginTop: 0 }}>Product Specifications</h3>
              <ul style={{ lineHeight: "1.8", color: "#444" }}>
                <li><strong>Material:</strong> 100% Premium Combed Cotton</li>
                <li><strong>Weight:</strong> 220 GSM Heavyweight Fabric</li>
                <li><strong>Fit Type:</strong> Relaxed Oversized Fit</li>
                <li><strong>Care Instructions:</strong> Machine wash cold with like colors, tumble dry low</li>
                <li><strong>Style:</strong> {product.style || "Casual"}</li>
                <li><strong>Stock Available:</strong> {product.quantity} units</li>
              </ul>
            </div>
          )}

          {/* Tab Content: FAQs */}
          {activeTab === "faqs" && (
            <div style={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: "20px", padding: "32px" }}>
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "16px" }}>What is the estimated delivery time?</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  Orders are processed within 1-2 business days and shipped via express delivery (3-5 business days).
                </p>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 8px", fontSize: "16px" }}>What is your return policy?</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  We offer a 30-day hassle-free return and exchange policy for unworn items with original tags.
                </p>
              </div>
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: "16px" }}>How do I choose the correct size?</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  Refer to our size pills above. For an oversized fit, select your standard size; for a fitted look, choose one size smaller.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <section className="product-section" style={{ marginTop: "80px" }}>
            <div className="section-heading">
              <h2>YOU MIGHT ALSO LIKE</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Review Modal */}
      {showReviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 16px", fontSize: "22px", fontWeight: "700" }}>Write a Review</h3>

            {reviewError && (
              <div style={{ color: "#d9534f", marginBottom: "12px", fontSize: "14px" }}>
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex M."
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Rating (1 - 5 Stars)
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Review Comment
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about the quality, fit, and design..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="button button--outline"
                  onClick={() => setShowReviewModal(false)}
                  style={{ padding: "10px 20px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button--dark"
                  disabled={isSubmittingReview}
                  style={{ padding: "10px 20px" }}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Product;