import { useState, useRef } from "react";

export const PRESET_CATALOG_IMAGES = [
  { id: "arrival1", name: "T-Shirt With Tape Details", path: "/images/products/arrival1.png" },
  { id: "arrival2", name: "Skinny Fit Jeans", path: "/images/products/arrival2.png" },
  { id: "arrival3", name: "Checkered Shirt", path: "/images/products/Arrival3.png" },
  { id: "arrival4", name: "Sleeve Striped T-shirt", path: "/images/products/arrival4.png" },
  { id: "product1", name: "Vertical Striped Shirt", path: "/images/products/product1.png" },
  { id: "product2", name: "Courage Graphic T-shirt", path: "/images/products/product2.png" },
  { id: "product3", name: "Loose Fit Bermuda Shorts", path: "/images/products/product3.png" },
  { id: "product4", name: "Faded Skinny Jeans", path: "/images/products/product4.png" },
  { id: "image7", name: "Polo With Contrast Trim", path: "/images/products/image 7.png" },
  { id: "image8", name: "Gradient Graphic T-shirt", path: "/images/products/image 8.png" },
  { id: "image9", name: "Polo With Tipping Details", path: "/images/products/image 9.png" },
  { id: "image10", name: "Black Striped T-shirt", path: "/images/products/image 10.png" },
  { id: "frame32", name: "Casual Denim Collection", path: "/images/products/Frame 32.png" },
  { id: "frame61", name: "Formal Blazer Classic", path: "/images/products/Frame 61.png" },
  { id: "frame62", name: "Party Wear Dress Set", path: "/images/products/Frame 62.png" },
  { id: "frame64", name: "Gym Active Performance", path: "/images/products/Frame 64.png" },
];

const ProductImageSelector = ({
  thumbnailImage,
  thumbnailFile,
  thumbnailPreview,
  onThumbnailSelect,
  onThumbnailClear,
  galleryItems = [],
  onAddGalleryFiles,
  onAddGalleryUrl,
  onRemoveGalleryItem,
  error,
}) => {
  const [thumbTab, setThumbTab] = useState(
    thumbnailFile ? "upload" : thumbnailImage && !thumbnailImage.startsWith("/images/products") && thumbnailImage.startsWith("http") ? "url" : "catalog"
  );
  const [urlInput, setUrlInput] = useState(thumbnailImage || "");
  const [isDragOver, setIsDragOver] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Handle local file drop/selection for Thumbnail
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      onThumbnailSelect({ file, preview, url: "" });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      onThumbnailSelect({ file, preview, url: "" });
    }
  };

  // Handle Catalog Selection for Thumbnail
  const handleCatalogSelect = (item) => {
    onThumbnailSelect({ file: null, preview: item.path, url: item.path });
  };

  // Handle URL Input for Thumbnail
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onThumbnailSelect({ file: null, preview: urlInput.trim(), url: urlInput.trim() });
    }
  };

  // Handle Gallery Files
  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onAddGalleryFiles(files);
    }
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = "";
    }
  };

  // Handle adding gallery URL
  const handleAddGalleryUrl = (e) => {
    e.preventDefault();
    if (galleryUrlInput.trim()) {
      onAddGalleryUrl(galleryUrlInput.trim());
      setGalleryUrlInput("");
    }
  };

  const currentThumbnailPreview = thumbnailPreview || thumbnailImage;

  return (
    <div className="product-image-selector-section">
      <div className="image-selector-header">
        <label className="image-selector-title">
          Product Images & Thumbnail <span className="required-star">*</span>
        </label>
        <span className="image-selector-badge">Visual Image Picker</span>
      </div>

      {/* Main Thumbnail Selector Box */}
      <div className={`thumbnail-selector-container ${error ? "has-error" : ""}`}>
        <div className="thumbnail-tabs-nav">
          <button
            type="button"
            className={`thumb-tab-btn ${thumbTab === "catalog" ? "is-active" : ""}`}
            onClick={() => setThumbTab("catalog")}
          >
            🖼️ Store Catalog
          </button>
          <button
            type="button"
            className={`thumb-tab-btn ${thumbTab === "upload" ? "is-active" : ""}`}
            onClick={() => setThumbTab("upload")}
          >
            📁 Upload From Device
          </button>
          <button
            type="button"
            className={`thumb-tab-btn ${thumbTab === "url" ? "is-active" : ""}`}
            onClick={() => setThumbTab("url")}
          >
            🔗 Image URL
          </button>
        </div>

        {/* Tab 1: Store Catalog Grid */}
        {thumbTab === "catalog" && (
          <div className="catalog-picker-panel">
            <p className="picker-hint">
              Select one of the standard high-resolution store product images:
            </p>
            <div className="catalog-images-grid">
              {PRESET_CATALOG_IMAGES.map((img) => {
                const isSelected =
                  currentThumbnailPreview === img.path ||
                  currentThumbnailPreview?.endsWith(img.path.split("/").pop());
                return (
                  <button
                    key={img.id}
                    type="button"
                    className={`catalog-image-card ${isSelected ? "is-selected" : ""}`}
                    onClick={() => handleCatalogSelect(img)}
                    title={img.name}
                  >
                    <img src={img.path} alt={img.name} loading="lazy" />
                    <span className="catalog-image-name">{img.name}</span>
                    {isSelected && <span className="selection-badge">✓ Selected</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Upload from Device */}
        {thumbTab === "upload" && (
          <div className="device-upload-panel">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <div
              className={`image-dropzone ${isDragOver ? "is-dragover" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="dropzone-icon">📷</div>
              <p className="dropzone-title">
                <strong>Click to browse</strong> or drag & drop image here
              </p>
              <span className="dropzone-subtitle">
                Supports PNG, JPG, JPEG, WEBP (Max 5MB)
              </span>
              <button
                type="button"
                className="button button--outline button--sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose File from Computer
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: URL / Path */}
        {thumbTab === "url" && (
          <div className="url-input-panel">
            <div className="url-input-group">
              <input
                type="text"
                placeholder="Paste direct image URL (https://...) or local path (/images/...)"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUrlSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                className="button button--dark button--sm"
                onClick={handleUrlSubmit}
              >
                Set Image
              </button>
            </div>
          </div>
        )}

        {/* Active Thumbnail Preview Bar */}
        {currentThumbnailPreview ? (
          <div className="current-thumbnail-preview">
            <div className="preview-img-wrapper">
              <img
                src={currentThumbnailPreview}
                alt="Selected Product Thumbnail"
                onError={(e) => {
                  e.target.src = "/images/products/arrival1.png";
                }}
              />
            </div>
            <div className="preview-meta">
              <div className="preview-meta-header">
                <strong>Selected Primary Thumbnail</strong>
                <span className="badge badge--success">Ready</span>
              </div>
              <p className="preview-path" title={thumbnailFile?.name || currentThumbnailPreview}>
                {thumbnailFile ? `📁 File: ${thumbnailFile.name} (${(thumbnailFile.size / 1024).toFixed(1)} KB)` : currentThumbnailPreview}
              </p>
            </div>
            <button
              type="button"
              className="preview-remove-btn"
              onClick={onThumbnailClear}
              title="Remove or change thumbnail"
              aria-label="Remove thumbnail"
            >
              ✕ Change
            </button>
          </div>
        ) : (
          <div className="no-thumbnail-selected">
            <span>⚠️ No thumbnail selected yet. Please pick an image above.</span>
          </div>
        )}

        {error && <span className="field-error-text mt-1">{error}</span>}
      </div>

      {/* Gallery Images (Optional Extra Product Views) */}
      <div className="gallery-selector-container">
        <div className="gallery-header-row">
          <div>
            <label className="image-selector-title">
              Additional Gallery Images <span className="optional-tag">(Optional)</span>
            </label>
            <p className="picker-hint">
              Add multiple angles or color variations for the product detail gallery.
            </p>
          </div>
          <div className="gallery-actions">
            <input
              type="file"
              ref={galleryFileInputRef}
              onChange={handleGalleryFileChange}
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="button button--outline button--sm"
              onClick={() => galleryFileInputRef.current?.click()}
            >
              + Upload Files
            </button>
            <button
              type="button"
              className="button button--outline button--sm"
              onClick={() => setIsCatalogModalOpen(true)}
            >
              + Add From Catalog
            </button>
          </div>
        </div>

        {/* Add Gallery URL Quick Row */}
        <div className="gallery-url-quickrow">
          <input
            type="text"
            placeholder="Or enter gallery image URL / path..."
            value={galleryUrlInput}
            onChange={(e) => setGalleryUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddGalleryUrl(e);
              }
            }}
          />
          <button
            type="button"
            className="button button--outline button--sm"
            onClick={handleAddGalleryUrl}
          >
            Add URL
          </button>
        </div>

        {/* Gallery Preview Grid */}
        {galleryItems.length > 0 ? (
          <div className="gallery-items-grid">
            {galleryItems.map((item, index) => {
              const previewSrc = item.preview || item.url || (typeof item === "string" ? item : "");
              const label = item.file?.name || (typeof item === "string" ? item : item.url || `Image #${index + 1}`);
              return (
                <div className="gallery-item-card" key={index}>
                  <img
                    src={previewSrc}
                    alt={`Gallery ${index + 1}`}
                    onError={(e) => {
                      e.target.src = "/images/products/arrival1.png";
                    }}
                  />
                  <div className="gallery-item-info" title={label}>
                    <span className="gallery-item-label">{label.split("/").pop()}</span>
                  </div>
                  <button
                    type="button"
                    className="gallery-remove-btn"
                    onClick={() => onRemoveGalleryItem(index)}
                    aria-label={`Remove gallery item ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-gallery-hint">
            <span>No extra gallery images added. (Optional)</span>
          </div>
        )}
      </div>

      {/* Catalog Modal for Quick Gallery Selection */}
      {isCatalogModalOpen && (
        <div className="gallery-catalog-modal-overlay" onClick={() => setIsCatalogModalOpen(false)}>
          <div className="gallery-catalog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Catalog Image to Add to Gallery</h3>
              <button type="button" onClick={() => setIsCatalogModalOpen(false)}>
                ✕
              </button>
            </div>
            <div className="catalog-images-grid catalog-images-grid--compact">
              {PRESET_CATALOG_IMAGES.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  className="catalog-image-card"
                  onClick={() => {
                    onAddGalleryUrl(img.path);
                    setIsCatalogModalOpen(false);
                  }}
                >
                  <img src={img.path} alt={img.name} loading="lazy" />
                  <span className="catalog-image-name">{img.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageSelector;
