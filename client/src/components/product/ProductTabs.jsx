import StarRating from "../StarRating";

const ProductTabs = ({
  activeTab,
  setActiveTab,
  reviewsList,
  product,
  onOpenReviewModal,
}) => {
  return (
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
                onClick={onOpenReviewModal}
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
                  <p className="review-comment-text">"{rev.comment}"</p>
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
            <li>
              <strong>Material:</strong> 100% Premium Combed Cotton
            </li>
            <li>
              <strong>Weight:</strong> 220 GSM Heavyweight Fabric
            </li>
            <li>
              <strong>Fit Type:</strong> Relaxed Oversized Fit
            </li>
            <li>
              <strong>Care Instructions:</strong> Machine wash cold with like colors, tumble dry low
            </li>
            <li>
              <strong>Style:</strong> {product.style || "Casual"}
            </li>
            <li>
              <strong>Stock Available:</strong> {product.quantity} units
            </li>
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
  );
};

export default ProductTabs;
