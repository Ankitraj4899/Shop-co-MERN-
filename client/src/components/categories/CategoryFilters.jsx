const availableColors = [
  { name: "Green", hex: "#00C12B" },
  { name: "Red", hex: "#F50606" },
  { name: "Yellow", hex: "#F5DD06" },
  { name: "Orange", hex: "#F57906" },
  { name: "Cyan", hex: "#06CAF5" },
  { name: "Blue", hex: "#063AF5" },
  { name: "Purple", hex: "#7D06F5" },
  { name: "Pink", hex: "#F506A4" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
];

const availableSizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "2X-Large",
  "3X-Large",
  "4X-Large",
];

const dressStyles = ["Casual", "Formal", "Party", "Gym"];

const CategoryFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedStyle,
  setSelectedStyle,
  availability,
  setAvailability,
  sort,
  setSort,
  setPage,
  onResetFilters,
  onApplyFilter,
}) => {
  return (
    <div className="filter-content">
      <div className="filter-content__header">
        <h2>Filters</h2>
        <button type="button" className="clear-filter-btn" onClick={onResetFilters}>
          Clear All
        </button>
      </div>

      <hr className="filter-divider" />

      {/* Category List */}
      <div className="filter-group">
        <h3>Category</h3>
        <ul className="category-links">
          <li
            className={!selectedCategory ? "is-active" : ""}
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
          >
            All Categories <span>›</span>
          </li>
          {categories.map((cat) => (
            <li
              key={cat._id}
              className={
                selectedCategory === cat._id || selectedCategory === cat.name
                  ? "is-active"
                  : ""
              }
              onClick={() => {
                setSelectedCategory(cat.name);
                setPage(1);
              }}
            >
              {cat.name} <span>›</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="filter-divider" />

      {/* Price Range */}
      <div className="filter-group">
        <h3>Price Range</h3>
        <div className="price-inputs">
          <div className="input-prefix">
            <span>$</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <span className="price-to">-</span>
          <div className="input-prefix">
            <span>$</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <hr className="filter-divider" />

      {/* Colors Palette */}
      <div className="filter-group">
        <h3>Colors</h3>
        <div className="color-swatches-grid">
          {availableColors.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                type="button"
                key={color.name}
                className={`color-swatch ${isSelected ? "is-selected" : ""} ${
                  color.name === "White" ? "color-swatch--white" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={() => {
                  setSelectedColor(isSelected ? "" : color.name);
                  setPage(1);
                }}
              >
                {isSelected && <span className="swatch-check">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="filter-divider" />

      {/* Size Pills */}
      <div className="filter-group">
        <h3>Size</h3>
        <div className="size-pills-grid">
          {availableSizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                type="button"
                key={size}
                className={`size-pill ${isSelected ? "is-selected" : ""}`}
                onClick={() => {
                  setSelectedSize(isSelected ? "" : size);
                  setPage(1);
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="filter-divider" />

      {/* Dress Style */}
      <div className="filter-group">
        <h3>Dress Style</h3>
        <ul className="category-links">
          {dressStyles.map((style) => (
            <li
              key={style}
              className={selectedStyle === style ? "is-active" : ""}
              onClick={() => {
                setSelectedStyle(selectedStyle === style ? "" : style);
                setPage(1);
              }}
            >
              {style} <span>›</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="filter-divider" />

      {/* Availability */}
      <div className="filter-group">
        <h3>Availability</h3>
        <select
          className="select-input"
          value={availability}
          onChange={(e) => {
            setAvailability(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Stock</option>
          <option value="in-stock">In Stock Only</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Sort By (Accessible in Mobile Drawer) */}
      <div className="filter-group mobile-filter-sort">
        <h3>Sort By</h3>
        <select
          className="select-input"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="popular">Most Popular</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
          <option value="name">Name</option>
        </select>
      </div>

      {onApplyFilter && (
        <button
          type="button"
          className="button button--dark button--apply-filter"
          onClick={onApplyFilter}
        >
          Apply Filter
        </button>
      )}
    </div>
  );
};

export { availableColors, availableSizes, dressStyles };
export default CategoryFilters;
