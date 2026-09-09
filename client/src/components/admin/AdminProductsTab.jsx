const AdminProductsTab = ({
  products,
  onOpenAddProduct,
  onOpenEditProduct,
  onDeleteProduct,
}) => {
  return (
    <section className="admin-section">
      <div className="admin-section-toolbar">
        <h2>Inventory & Product Catalog</h2>
        <button
          type="button"
          className="button button--dark button--add"
          onClick={onOpenAddProduct}
        >
          + Add New Product
        </button>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Dress Style</th>
              <th>Price</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isOut = p.quantity === 0;
              const isLow = p.quantity > 0 && p.quantity <= 5;
              return (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.thumbnailImage}
                      alt={p.name}
                      className="admin-thumb"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
                      }}
                    />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.originalPrice && (
                      <small className="discount-tag"> (-{p.discount}%)</small>
                    )}
                  </td>
                  <td>{p.category?.name || "Uncategorized"}</td>
                  <td>{p.style || "Casual"}</td>
                  <td>${p.price}</td>
                  <td>
                    <div className="stock-control-cell">
                      <span
                        className={`stock-indicator-dot ${
                          isOut
                            ? "dot--out"
                            : isLow
                            ? "dot--low"
                            : "dot--in"
                        }`}
                      />
                      <strong>{p.quantity} units</strong>
                      {isOut && <span className="tag-out">OUT</span>}
                      {isLow && <span className="tag-low">LOW</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="action-btn action-btn--edit"
                        onClick={() => onOpenEditProduct(p)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--delete"
                        onClick={() => onDeleteProduct(p._id, p.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminProductsTab;
