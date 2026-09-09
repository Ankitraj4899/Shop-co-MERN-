const AdminOverviewTab = ({ stats, products, orders, onOpenEditProduct }) => {
  if (!stats) return null;

  return (
    <section className="admin-dashboard-section">
      <div className="dashboard-metric-cards-grid">
        <div className="metric-card">
          <span className="metric-card__icon">👕</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Total Products</span>
            <strong className="metric-card__value">{stats.products}</strong>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-card__icon">📁</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Categories</span>
            <strong className="metric-card__value">{stats.categories}</strong>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-card__icon">👥</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Registered Users</span>
            <strong className="metric-card__value">{stats.users}</strong>
          </div>
        </div>

        <div className="metric-card">
          <span className="metric-card__icon">📦</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Total Orders</span>
            <strong className="metric-card__value">{stats.orders}</strong>
          </div>
        </div>

        <div className="metric-card metric-card--warning">
          <span className="metric-card__icon">⚠</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Low Stock (≤ 5 units)</span>
            <strong className="metric-card__value">{stats.lowStock}</strong>
          </div>
        </div>

        <div className="metric-card metric-card--danger">
          <span className="metric-card__icon">✕</span>
          <div className="metric-card__info">
            <span className="metric-card__label">Out of Stock (0 units)</span>
            <strong className="metric-card__value">{stats.outOfStock}</strong>
          </div>
        </div>
      </div>

      
      <div className="dashboard-split-grid">
        <div className="dashboard-subcard">
          <h3>Low Stock & Out-of-Stock Alert</h3>
          <div className="admin-table-scroll">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.quantity <= 5)
                  .slice(0, 6)
                  .map((p) => (
                    <tr key={`alert-${p._id}`}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>${p.price}</td>
                      <td>
                        <span
                          className={`stock-status-pill ${
                            p.quantity === 0
                              ? "stock-status-pill--out"
                              : "stock-status-pill--low"
                          }`}
                        >
                          {p.quantity === 0
                            ? "Out of Stock"
                            : `Low: ${p.quantity} left`}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn action-btn--edit"
                          onClick={() => onOpenEditProduct(p)}
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                {!products.some((p) => p.quantity <= 5) && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      All products have sufficient inventory level (&gt; 5).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-subcard">
          <h3>Latest Customer Orders</h3>
          <div className="admin-table-scroll">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((ord) => (
                  <tr key={`dash-ord-${ord._id}`}>
                    <td>#{ord._id.slice(-6).toUpperCase()}</td>
                    <td>{ord.user?.email || ord.user?.username || "Guest"}</td>
                    <td>${ord.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`status-pill status-pill--${ord.status}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminOverviewTab;
