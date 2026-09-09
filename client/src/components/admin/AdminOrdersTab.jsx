const AdminOrdersTab = ({
  orders,
  onUpdateOrderStatus,
  onSelectOrderDetails,
}) => {
  return (
    <section className="admin-section">
      <div className="admin-section-toolbar">
        <h2>Customer Orders & Fulfillment</h2>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status Update</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord._id}>
                <td>
                  <strong>#{ord._id.slice(-8).toUpperCase()}</strong>
                </td>
                <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                <td>
                  <div>
                    <strong>{ord.user?.username || "Customer"}</strong>
                    <small className="block-muted">{ord.user?.email}</small>
                  </div>
                </td>
                <td>{ord.items?.length || 0} product(s)</td>
                <td>
                  <strong>${ord.totalPrice.toFixed(2)}</strong>
                </td>
                <td>
                  <select
                    className="order-status-select"
                    value={ord.status}
                    onChange={(e) =>
                      onUpdateOrderStatus(ord._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    className="action-btn action-btn--view"
                    onClick={() => onSelectOrderDetails(ord)}
                  >
                    View Items
                  </button>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan="7" className="text-center">
                  No orders currently placed in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminOrdersTab;
