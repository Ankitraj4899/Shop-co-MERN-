const CategoryToolbar = ({
  pageTitle,
  productsCount,
  page,
  totalProducts,
  sort,
  setSort,
  setPage,
  onOpenMobileFilter,
}) => {
  return (
    <div className="listing-toolbar">
      <div className="listing-toolbar__left">
        <h1>{pageTitle}</h1>
        <span className="showing-count">
          Showing {productsCount > 0 ? (page - 1) * 9 + 1 : 0}-
          {Math.min(page * 9, totalProducts)} of {totalProducts} Products
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

        
        <button
          type="button"
          className="mobile-filter-btn"
          onClick={onOpenMobileFilter}
          aria-label="Open filter panel"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
  );
};

export default CategoryToolbar;
