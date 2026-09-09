import ProductCard from "../ProductCard";

const CategoryProductGrid = ({
  isLoading,
  error,
  products,
  onResetFilters,
}) => {
  if (isLoading) {
    return <p className="commerce-state">Loading products...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="empty-catalog-state">
        <div className="empty-catalog-state__icon-wrap">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 8L14 14"
              stroke="#ff3333"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="empty-catalog-state__title">No Matching Products Found</h2>
        <p className="empty-catalog-state__text">
          We couldn't find any products matching your selected search query or active
          filters. Try adjusting your price range, color, or clearing filters.
        </p>
        <button
          type="button"
          className="button button--dark empty-catalog-state__btn"
          onClick={onResetFilters}
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="listing-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default CategoryProductGrid;
