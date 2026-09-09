import StarRating from "../StarRating";

const ProductInfo = ({
  product,
  colorsList,
  sizesList,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  setQuantity,
  onAddToCart,
  isAdding,
}) => {
  return (
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
            const hexColor =
              typeof colorObj === "string" ? colorObj : colorObj.hex || "#333";
            const colorName =
              typeof colorObj === "string" ? colorObj : colorObj.name || "Color";
            const isSelected =
              selectedColor?.name === colorName || selectedColor === hexColor;

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
          onClick={onAddToCart}
          disabled={isAdding || product.quantity === 0}
        >
          {isAdding
            ? "Adding..."
            : product.quantity === 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
