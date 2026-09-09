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

      // Fetch related products (fetch up to 10 to ensure 4 distinct items after filtering out current product)
      const relData = await getProducts(`limit=10`);
      const allRel = relData.results?.results || relData.products || relData.results || [];
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
    if (!isAuthenticated) {
      setToastMessage("Please log in to add items to your cart.");
      setTimeout(() => setToastMessage(""), 4000);
      return;
    }
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
        <div className="product-tabs-wrapper">
          <div className="product-tabs__nav">
            <button
              type="button"
              className={`product-tab-btn ${activeTab === "details" ? "is-active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Product Details
            </button>
            <button
              type="button"
              className={`product-tab-btn ${activeTab === "reviews" ? "is-active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Rating & Reviews ({reviewsList.length})
            </button>
            <button
              type="button"
              className={`product-tab-btn ${activeTab === "faqs" ? "is-active" : ""}`}
              onClick={() => setActiveTab("faqs")}
            >
              FAQs
            </button>
          </div>

          {/* Tab Content: Rating & Reviews */}
          {activeTab === "reviews" && (
            <div className="product-tab-pane">
              <div className="reviews-header">
                <h3 className="reviews-title">
                  All Reviews <span className="reviews-count">({reviewsList.length})</span>
                </h3>

                <div className="reviews-actions">
                  <button
                    type="button"
                    className="button button--dark button--write-review"
                    onClick={() => setShowReviewModal(true)}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {reviewsList.length === 0 ? (
                <p className="no-reviews-msg">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="reviews-grid">
                  {reviewsList.map((rev, i) => (
                    <div key={i} className="review-card">
                      <StarRating rating={rev.rating} size={16} />
                      <div className="review-author-row">
                        <strong>{rev.name || "Customer"}</strong>
                        {rev.verified !== false && (
                          <span className="verified-badge" title="Verified Purchase">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="review-comment-text">
                        "{rev.comment}"
                      </p>
                      {rev.createdAt && (
                        <div className="review-date">
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
            <div className="product-spec-card">
              <h3>Product Specifications</h3>
              <ul>
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
            <div className="product-faq-card">
              <div className="faq-item">
                <h4>What is the estimated delivery time?</h4>
                <p>
                  Orders are processed within 1-2 business days and shipped via express delivery (3-5 business days).
                </p>
              </div>
              <div className="faq-item">
                <h4>What is your return policy?</h4>
                <p>
                  We offer a 30-day hassle-free return and exchange policy for unworn items with original tags.
                </p>
              </div>
              <div className="faq-item">
                <h4>How do I choose the correct size?</h4>
                <p>
                  Refer to our size pills above. For an oversized fit, select your standard size; for a fitted look, choose one size smaller.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <section className="product-section">
            <div className="section-heading text-center">
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
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal__header">
              <h3>Write a Review</h3>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowReviewModal(false)}
                aria-label="Close review modal"
              >
                ✕
              </button>
            </div>

            {reviewError && (
              <div className="review-modal-error">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="review-modal-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex M."
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating</label>
                <div className="interactive-star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-pick-btn ${reviewRating >= star ? "is-filled" : ""}`}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-pick-label">
                    {reviewRating === 5 && "5 Stars - Excellent"}
                    {reviewRating === 4 && "4 Stars - Very Good"}
                    {reviewRating === 3 && "3 Stars - Average"}
                    {reviewRating === 2 && "2 Stars - Poor"}
                    {reviewRating === 1 && "1 Star - Terrible"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Review Comment</label>
                <textarea
                  rows={4}
                  placeholder="Share details about the quality, fit, and design..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="modal-textarea"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="button button--outline modal-cancel-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button--dark modal-submit-btn"
                  disabled={isSubmittingReview}
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