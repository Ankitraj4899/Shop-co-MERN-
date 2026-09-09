import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCategories, getProducts } from "../lib/api";

import CategoryFilters from "../components/categories/CategoryFilters";
import CategoryToolbar from "../components/categories/CategoryToolbar";
import CategoryProductGrid from "../components/categories/CategoryProductGrid";
import CategoryPagination from "../components/categories/CategoryPagination";
import MobileFilterDrawer from "../components/categories/MobileFilterDrawer";

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
  }, [
    page,
    search,
    selectedCategory,
    selectedStyle,
    selectedColor,
    selectedSize,
    minPrice,
    maxPrice,
    availability,
    sort,
  ]);

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
      const found = categories.find(
        (c) =>
          c._id === selectedCategory ||
          c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      return found ? found.name : selectedCategory;
    }
    if (selectedStyle) return `${selectedStyle} Style`;
    return "All Products";
  }, [search, selectedCategory, selectedStyle, categories]);

  const filterProps = {
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
    onResetFilters: handleResetFilters,
  };

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
            <CategoryFilters {...filterProps} />
          </aside>

          {/* Right Product Grid Section */}
          <section className="listing-results">
            <CategoryToolbar
              pageTitle={pageTitle}
              productsCount={products.length}
              page={page}
              totalProducts={pagination.total}
              sort={sort}
              setSort={setSort}
              setPage={setPage}
              onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
            />

            {/* Product Grid & State Handling */}
            <CategoryProductGrid
              isLoading={isLoading}
              error={error}
              products={products}
              onResetFilters={handleResetFilters}
            />

            {/* Pagination Component */}
            <CategoryPagination
              pagination={pagination}
              page={page}
              setPage={setPage}
            />
          </section>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      >
        <CategoryFilters
          {...filterProps}
          onApplyFilter={() => setIsMobileFilterOpen(false)}
        />
      </MobileFilterDrawer>

      <Footer />
    </div>
  );
};

export default Categories;