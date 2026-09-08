import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { getCategories, getProducts } from "../lib/api";

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

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter States
  const [searchInput, setSearchInput] = useState(() => searchParams.get("search") || "");
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get("category") || "");
  const [selectedStyle, setSelectedStyle] = useState(() => searchParams.get("style") || "");
  const [minPrice, setMinPrice] = useState(() => searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(() => searchParams.get("maxPrice") || "");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState(() => searchParams.get("sort") || "newest");
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load categories from MongoDB
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  // Sync URL query params with state
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null && urlSearch !== searchInput) {
      setSearchInput(urlSearch);
      setSearch(urlSearch);
      setPage(1);
    }
    const urlCat = searchParams.get("category");
    if (urlCat !== null && urlCat !== selectedCategory) {
      setSelectedCategory(urlCat);
      setPage(1);
    }
    const urlStyle = searchParams.get("style");
    if (urlStyle !== null && urlStyle !== selectedStyle) {
      setSelectedStyle(urlStyle);
      setPage(1);
    }
  }, [searchParams]);

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  // Build query parameters
  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "9", sort });
    if (search.trim()) params.set("search", search.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedStyle) params.set("style", selectedStyle);
    if (selectedColor) params.set("color", selectedColor);
    if (selectedSize) params.set("size", selectedSize);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (availability) params.set("availability", availability);
    return params.toString();
  }, [page, search, selectedCategory, selectedStyle, selectedColor, selectedSize, minPrice, maxPrice, availability, sort]);

  // Fetch products from backend
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    getProducts(query)
      .then((data) => {
        if (!isCurrent) return;
        setProducts(data.results?.results || []);
        setPagination(
          data.results || {
            page: 1,
            totalPages: 1,
            total: 0,
            hasNext: false,
            hasPrevious: false,
          }
        );
        setError("");
      })
      .catch((err) => {
        if (isCurrent) setError(err.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [query]);

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
    setSelectedStyle("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedColor("");
    setSelectedSize("");
    setAvailability("");
    setSort("newest");
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  // Dynamic header title
  const pageTitle = useMemo(() => {
    if (search.trim()) return `Search results for "${search.trim()}"`;
    if (selectedCategory) {
      const found = categories.find((c) => c._id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase());
      return found ? found.name : selectedCategory;
    }
    if (selectedStyle) return `${selectedStyle} Style`;
    return "All Products";
  }, [search, selectedCategory, selectedStyle, categories]);

  // Pagination buttons array
  const pageButtons = useMemo(() => {
    const total = pagination.totalPages || 1;
    const current = pagination.page || 1;
    const buttons = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        buttons.push(i);
      } else if (buttons[buttons.length - 1] !== "...") {
        buttons.push("...");
      }
    }
    return buttons;
  }, [pagination.totalPages, pagination.page]);

  const filterSidebarContent = (
    <div className="filter-content">
      <div className="filter-content__header">
        <h2>Filters</h2>
        <button type="button" className="clear-filter-btn" onClick={handleResetFilters}>
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
              className={selectedCategory === cat._id || selectedCategory === cat.name ? "is-active" : ""}
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
                className={`color-swatch ${isSelected ? "is-selected" : ""} ${color.name === "White" ? "color-swatch--white" : ""}`}
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

      <button
        type="button"
        className="button button--dark button--apply-filter"
        onClick={() => setIsMobileFilterOpen(false)}
      >
        Apply Filter
      </button>
    </div>
  );

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="listing-page">
        {/* Breadcrumb */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span>{pageTitle}</span>
        </nav>

        <div className="listing-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="filters-panel desktop-only">
            {filterSidebarContent}
          </aside>

          {/* Right Product Grid Section */}
          <section className="listing-results">
            <div className="listing-toolbar">
              <div className="listing-toolbar__left">
                <h1>{pageTitle}</h1>
                <span className="showing-count">
                  Showing {products.length > 0 ? (page - 1) * 9 + 1 : 0}-
                  {Math.min(page * 9, pagination.total)} of {pagination.total} Products
                </span>
              </div>

              <div className="listing-toolbar__right">
                <label className="sort-label desktop-only" htmlFor="sort-dropdown">
                  Sort by:
                  <select
                    id="sort-dropdown"
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
                </label>

                {/* Mobile Filter Trigger Button (Circular sliders icon matching Figma) */}
                <button
                  type="button"
                  className="mobile-filter-btn"
                  onClick={() => setIsMobileFilterOpen(true)}
                  aria-label="Open filter panel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" />
                    <line x1="9" y1="8" x2="15" y2="8" />
                    <line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Error & Loading States */}
            {isLoading && <p className="commerce-state">Loading products...</p>}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && products.length === 0 && (
              <div className="empty-state">
                <h2>No products found</h2>
                <p>Try adjusting your search query, price range, or clearing filters.</p>
                <button type="button" className="button button--dark" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && products.length > 0 && (
              <div className="listing-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Component */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="pagination__nav-btn"
                  disabled={!pagination.hasPrevious}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  ← Previous
                </button>

                <div className="pagination__numbers">
                  {pageButtons.map((btn, index) =>
                    btn === "..." ? (
                      <span key={`ellipsis-${index}`} className="pagination__dots">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${btn}`}
                        type="button"
                        className={`pagination__num-btn ${pagination.page === btn ? "is-active" : ""}`}
                        onClick={() => setPage(btn)}
                      >
                        {btn}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="pagination__nav-btn"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Mobile Filter Drawer / Modal */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-overlay" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer__header">
              <h2>Filters</h2>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            {filterSidebarContent}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Categories;