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
        <h2 className="filter-content__heading">Filters</h2>
        <button type="button" className="clear-filter-btn" onClick={onResetFilters}>
          Clear All
        </button>
      </div>

      <hr className="filter-divider" />

      <div className="filter-group">
        <h3 className="filter-group__heading">Category</h3>
        <ul className="category-links">
          <li
            className={`category-item ${!selectedCategory ? "is-active" : ""}`}
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
          >
            All Categories <span className="category-arrow">›</span>
          </li>
          {categories.map((cat) => (
            <li
              key={cat._id}
              className={`category-item ${
                selectedCategory === cat._id || selectedCategory === cat.name
                  ? "is-active"
                  : ""
              }`}
              onClick={() => {
                setSelectedCategory(cat.name);
                setPage(1);
              }}
            >
              {cat.name} <span className="category-arrow">›</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="filter-divider" />

      <div className="filter-group">
        <h3 className="filter-group__heading">Price Range</h3>
        <div className="price-inputs">
          <div className="input-prefix">
            <span className="price-currency">$</span>
            <input
              type="number"
              className="price-input"
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
            <span className="price-currency">$</span>
            <input
              type="number"
              className="price-input"
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

      <div className="filter-group">
        <h3 className="filter-group__heading">Colors</h3>
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

      <div className="filter-group">
        <h3 className="filter-group__heading">Size</h3>
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

      <div className="filter-group">
        <h3 className="filter-group__heading">Dress Style</h3>
        <ul className="category-links">
          {dressStyles.map((style) => (
            <li
              key={style}
              className={`category-item ${selectedStyle === style ? "is-active" : ""}`}
              onClick={() => {
                setSelectedStyle(selectedStyle === style ? "" : style);
                setPage(1);
              }}
            >
              {style} <span className="category-arrow">›</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="filter-divider" />

      <div className="filter-group">
        <h3 className="filter-group__heading">Availability</h3>
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

      <div className="filter-group mobile-filter-sort">
        <h3 className="filter-group__heading">Sort By</h3>
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