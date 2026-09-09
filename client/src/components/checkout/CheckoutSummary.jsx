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
      <h2 className="order-summary-card__heading">Order Summary</h2>

      <div className="checkout-items-list">
        {cartItems.map((item) => (
          <div
            className="checkout-item-row"
            key={`${item.product?._id}-${item.size}`}
          >
            <img
              src={item.product?.thumbnailImage}
              alt={item.product?.name}
              className="checkout-item-row__image"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
              }}
            />
            <div className="checkout-item-row__info">
              <h4 className="checkout-item-row__title">{item.product?.name}</h4>
              <small className="checkout-item-row__details">
                Qty: {item.quantity}{" "}
                {item.size ? `· Size: ${item.size}` : ""}
              </small>
            </div>
            <strong className="checkout-item-row__price">
              ${((item.product?.price || 0) * item.quantity).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <hr className="summary-divider" />

      <div className="summary-row">
        <span className="summary-row__label">Subtotal</span>
        <strong className="summary-row__value">${subtotal.toFixed(2)}</strong>
      </div>

      {discount > 0 && (
        <div className="summary-row summary-row--discount">
          <span className="summary-row__label">Discount ({couponCode.toUpperCase()})</span>
          <strong className="discount-val">-${discount.toFixed(2)}</strong>
        </div>
      )}

      <div className="summary-row">
        <span className="summary-row__label">Delivery Fee</span>
        <strong className="summary-row__value">${deliveryFee.toFixed(2)}</strong>
      </div>

      <hr className="summary-divider" />

      <div className="summary-row summary-row--total">
        <span className="summary-row__label">Total Amount</span>
        <strong className="summary-row__value">${estimatedTotal.toFixed(2)}</strong>
      </div>

      <p className="secure-badge">
        🔒 Encrypted Server-side Price & Stock Validation
      </p>
    </aside>
  );
};

export default CheckoutSummary;
