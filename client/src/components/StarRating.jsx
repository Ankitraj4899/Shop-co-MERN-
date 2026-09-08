import { useId } from "react";

export const StarRating = ({ rating = 5, size = 18, className = "" }) => {
  const baseId = useId();
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div
      className={`stars-rating-container ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}
      aria-label={`${numericRating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const full = numericRating >= starIndex;
        const half = !full && numericRating >= starIndex - 0.5;
        const gradientId = `${baseId}-half-${starIndex}`.replace(/:/g, "_");

        if (full) {
          return (
            <svg
              key={starIndex}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill="#FFC633"
              style={{ display: "block", flexShrink: 0 }}
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        }

        if (half) {
          return (
            <svg
              key={starIndex}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              style={{ display: "block", flexShrink: 0 }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#FFC633" />
                  <stop offset="50%" stopColor="#E0E0E0" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#${gradientId})`}
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          );
        }

        return (
          <svg
            key={starIndex}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="#E0E0E0"
            style={{ display: "block", flexShrink: 0 }}
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
