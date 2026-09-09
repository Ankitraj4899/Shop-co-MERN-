const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  reviewError,
  reviewerName,
  setReviewerName,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  isSubmittingReview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal__header">
          <h3>Write a Review</h3>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close review modal"
          >
            ✕
          </button>
        </div>

        {reviewError && <div className="review-modal-error">{reviewError}</div>}

        <form onSubmit={onSubmit} className="review-modal-form">
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
              onClick={onClose}
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
  );
};

export default ReviewModal;
