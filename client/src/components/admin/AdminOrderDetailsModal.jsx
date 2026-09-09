const AdminOrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog--wide"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Order Details #{order._id.slice(-8).toUpperCase()}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="admin-order-modal-body">
          <div className="order-customer-info-box">
            <p>
              <strong>Customer:</strong> {order.user?.username} ({order.user?.email})
            </p>
            <p>
              <strong>Shipping Address:</strong> {order.shippingAddress}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-pill status-pill--${order.status}`}>
                {order.status}
              </span>
            </p>
          </div>

          <h3>Purchased Line Items</h3>
          <div className="admin-order-items-list">
            {order.items?.map((item, idx) => (
              <div className="admin-order-item-row" key={`ord-item-${idx}`}>
                <img
                  src={
                    item.thumbnailImage ||
                    item.product?.thumbnailImage ||
                    "/images/products/arrival1.png"
                  }
                  alt={item.name}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=80&q=80";
                  }}
                />
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.size ? `Size: ${item.size} · ` : ""}Quantity: {item.quantity}
                  </small>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${order.subtotal?.toFixed(2)}</strong>
          </div>
          {order.discount > 0 && (
            <div className="summary-row summary-row--discount">
              <span>Discount</span>
              <strong className="discount-val">
                -${order.discount?.toFixed(2)}
              </strong>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping Fee</span>
            <strong>${(order.shippingFee || 15).toFixed(2)}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total Amount Paid</span>
            <strong>${order.totalPrice?.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsModal;
