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
