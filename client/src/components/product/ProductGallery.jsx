const ProductGallery = ({
  product,
  galleryList,
  selectedImage,
  onSelectImage,
}) => {
  return (
    <div className="product-detail__gallery">
      <div className="product-detail__thumbs">
        {galleryList.map((imgUrl, index) => (
          <button
            key={index}
            type="button"
            className={`thumb-btn ${selectedImage === imgUrl ? "is-selected" : ""}`}
            onClick={() => onSelectImage(imgUrl)}
          >
            <img
              src={imgUrl}
              alt={`${product.name} thumbnail ${index + 1}`}
            />
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
  );
};

export default ProductGallery;
