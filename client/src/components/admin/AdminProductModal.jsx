import ProductImageSelector from "./ProductImageSelector";

const AdminProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingProductId,
  productForm,
  onInputChange,
  onThumbnailSelect,
  onThumbnailClear,
  onAddGalleryFiles,
  onAddGalleryUrl,
  onRemoveGalleryItem,
  categories,
  formErrors = {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{editingProductId ? "Edit Product" : "Create New Product"}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={onSubmit} noValidate>
          <div className="form-row-2col">
            <label>
              Product Name
              <input
                name="name"
                value={productForm.name}
                onChange={onInputChange}
                placeholder="e.g. Graphic T-shirt"
                className={formErrors.name ? "input--error" : ""}
              />
              {formErrors.name && (
                <span className="field-error-text">{formErrors.name}</span>
              )}
            </label>

            <label>
              Category
              <select
                name="category"
                value={productForm.category}
                onChange={onInputChange}
                className={formErrors.category ? "input--error" : ""}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option value={c._id} key={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <span className="field-error-text">{formErrors.category}</span>
              )}
            </label>
          </div>

          <label>
            Description
            <textarea
              name="description"
              rows="3"
              value={productForm.description}
              onChange={onInputChange}
              placeholder="Detailed product information (at least 10 characters)..."
              className={formErrors.description ? "input--error" : ""}
            />
            {formErrors.description && (
              <span className="field-error-text">{formErrors.description}</span>
            )}
          </label>

          <div className="form-row-3col">
            <label>
              Price ($)
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={productForm.price}
                onChange={onInputChange}
                placeholder="120.00"
                className={formErrors.price ? "input--error" : ""}
              />
              {formErrors.price && (
                <span className="field-error-text">{formErrors.price}</span>
              )}
            </label>

            <label>
              Original Price ($)
              <input
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={productForm.originalPrice}
                onChange={onInputChange}
                placeholder="150.00 (Optional)"
                className={formErrors.originalPrice ? "input--error" : ""}
              />
              {formErrors.originalPrice && (
                <span className="field-error-text">{formErrors.originalPrice}</span>
              )}
            </label>

            <label>
              Discount (%)
              <input
                name="discount"
                type="number"
                min="0"
                max="100"
                value={productForm.discount}
                onChange={onInputChange}
                placeholder="20 (Optional)"
                className={formErrors.discount ? "input--error" : ""}
              />
              {formErrors.discount && (
                <span className="field-error-text">{formErrors.discount}</span>
              )}
            </label>
          </div>

          <div className="form-row-3col">
            <label>
              Stock Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                step="1"
                value={productForm.quantity}
                onChange={onInputChange}
                placeholder="e.g. 25"
                className={formErrors.quantity ? "input--error" : ""}
              />
              {formErrors.quantity ? (
                <span className="field-error-text">{formErrors.quantity}</span>
              ) : (
                <small className="help-text">≤ 5 triggers low stock warning</small>
              )}
            </label>

            <label>
              Dress Style
              <select
                name="style"
                value={productForm.style}
                onChange={onInputChange}
              >
                <option value="Casual">Casual</option>
                <option value="Formal">Formal</option>
                <option value="Party">Party</option>
                <option value="Gym">Gym</option>
              </select>
            </label>

            <label>
              Product Status
              <select
                name="status"
                value={productForm.status}
                onChange={onInputChange}
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </label>
          </div>

          {/* Product Image Selection Component */}
          <ProductImageSelector
            thumbnailImage={productForm.thumbnailImage}
            thumbnailFile={productForm.thumbnailFile}
            thumbnailPreview={productForm.thumbnailPreview}
            onThumbnailSelect={onThumbnailSelect}
            onThumbnailClear={onThumbnailClear}
            galleryItems={productForm.galleryItems || []}
            onAddGalleryFiles={onAddGalleryFiles}
            onAddGalleryUrl={onAddGalleryUrl}
            onRemoveGalleryItem={onRemoveGalleryItem}
            error={formErrors.thumbnailImage}
          />

          <div className="modal-actions-row">
            <button
              type="button"
              className="button button--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button button--dark">
              {editingProductId ? "Update Product" : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;
