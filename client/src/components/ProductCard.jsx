import { memo } from "react";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";

const ProductCard = memo(({ product }) => {
  const ratingValue = product.rating || 4.5;
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  return (
    <Link className={`product-card ${isOutOfStock ? "product-card--out-of-stock" : ""}`} to={`/product/${product._id}`}>
      <div className="product-card__image-wrap">
        <img
          src={product.thumbnailImage}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80";
          }}
        />
        {isOutOfStock && <span className="card-badge card-badge--out">Out of Stock</span>}
        {isLowStock && <span className="card-badge card-badge--low">Only {product.quantity} left</span>}
      </div>
      <h3 title={product.name}>{product.name}</h3>
      <div className="product-card__rating">
        <StarRating rating={ratingValue} size={16} />
        <span className="rating-num">
          {ratingValue}
          <span className="rating-max">/5</span>
        </span>
      </div>
      <div className="product-card__price-row">
        <strong className="current-price">${product.price}</strong>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="original-price">${product.originalPrice}</span>
        )}
        {product.discount > 0 && (
          <span className="discount-pill">-{product.discount}%</span>
        )}
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;