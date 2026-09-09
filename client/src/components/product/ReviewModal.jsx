import { useState } from "react";

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
  const [localErrors, setLocalErrors] = useState({});

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!reviewerName.trim()) {
      errors.name = "Please enter your name.";
    } else if (reviewerName.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      errors.rating = "Please choose a rating from 1 to 5.";
    }

    if (!reviewComment.trim()) {
      errors.comment = "Please write a review comment.";
    } else if (reviewComment.trim().length < 5) {
      errors.comment = "Review comment must be at least 5 characters.";
    }

    setLocalErrors(errors);
    if (Object.keys(errors).length === 0) {
      onSubmit(e);
    }
  };

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

        <form onSubmit={handleFormSubmit} className="review-modal-form" noValidate>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="e.g. Alex M."
              value={reviewerName}
              onChange={(e) => {
                setReviewerName(e.target.value);
                if (localErrors.name) setLocalErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`modal-input ${localErrors.name ? "input--error" : ""}`}
            />
            {localErrors.name && (
              <span className="field-error-text">{localErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Rating</label>
            <div className="interactive-star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-pick-btn ${reviewRating >= star ? "is-filled" : ""}`}
                  onClick={() => {
                    setReviewRating(star);
                    if (localErrors.rating) setLocalErrors((prev) => ({ ...prev, rating: "" }));
                  }}
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
            {localErrors.rating && (
              <span className="field-error-text">{localErrors.rating}</span>
            )}
          </div>

          <div className="form-group">
            <label>Review Comment</label>
            <textarea
              rows={4}
              placeholder="Share details about the quality, fit, and design (min. 5 characters)..."
              value={reviewComment}
              onChange={(e) => {
                setReviewComment(e.target.value);
                if (localErrors.comment) setLocalErrors((prev) => ({ ...prev, comment: "" }));
              }}
              className={`modal-textarea ${localErrors.comment ? "input--error" : ""}`}
            />
            {localErrors.comment && (
              <span className="field-error-text">{localErrors.comment}</span>
            )}
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
