const CheckoutSummary = ({
  cartItems,
  subtotal,
  discount,
  discountRate,
  couponCode,
  deliveryFee,
  estimatedTotal,
}) => {
  return (
    <aside className="order-summary-card">
      <h2>Order Summary</h2>

      <div className="checkout-items-list">
        {cartItems.map((item) => (
          <div
            className="checkout-item-row"
            key={`${item.product?._id}-${item.size}`}
          >
            <img
              src={item.product?.thumbnailImage}
              alt={item.product?.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
              }}
            />
            <div className="checkout-item-row__info">
              <h4>{item.product?.name}</h4>
              <small>
                Qty: {item.quantity}{" "}
                {item.size ? `· Size: ${item.size}` : ""}
              </small>
            </div>
            <strong>
              ${((item.product?.price || 0) * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <hr className="summary-divider" />

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      {discount > 0 && (
        <div className="summary-row summary-row--discount">
          <span>Discount ({couponCode.toUpperCase()})</span>
          <strong className="discount-val">-${discount.toFixed(2)}</strong>
        </div>
      )}

      <div className="summary-row">
        <span>Delivery Fee</span>
        <strong>${deliveryFee.toFixed(2)}</strong>
      </div>

      <hr className="summary-divider" />

      <div className="summary-row summary-row--total">
        <span>Total Amount</span>
        <strong>${estimatedTotal.toFixed(2)}</strong>
      </div>

      <p className="secure-badge">
        🔒 Encrypted Server-side Price & Stock Validation
      </p>
    </aside>
  );
};

export default CheckoutSummary;
