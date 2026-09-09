const CartSummary = ({
  subtotal,
  deliveryFee,
  appliedCoupon,
  discount,
  total,
  couponError,
  inputCoupon,
  setInputCoupon,
  onApplyCoupon,
  onCheckout,
}) => {
  return (
    <aside className="order-summary-card">
      <h2 className="order-summary-card__heading">Order Summary</h2>

      <div className="summary-row">
        <span className="summary-row__label">Subtotal</span>
        <strong className="summary-row__value">${subtotal.toFixed(2)}</strong>
      </div>

      {discount > 0 && (
        <div className="summary-row summary-row--discount">
          <span className="summary-row__label">
            Discount ({appliedCoupon === "save20" ? "20%" : "10%"})
          </span>
          <strong className="discount-val">-${discount.toFixed(2)}</strong>
        </div>
      )}

      <div className="summary-row">
        <span className="summary-row__label">Delivery Fee</span>
        <strong className="summary-row__value">${deliveryFee.toFixed(2)}</strong>
      </div>

      <hr className="summary-divider" />

      <div className="summary-row summary-row--total">
        <span className="summary-row__label">Total</span>
        <strong className="summary-row__value">${total.toFixed(2)}</strong>
      </div>

      <form className="promo-form" onSubmit={onApplyCoupon}>
        <div className="promo-input-wrap">
          <span className="promo-icon">🏷</span>
          <input
            type="text"
            className="promo-input"
            placeholder="Add promo code (SAVE10, SAVE20)"
            value={inputCoupon}
            onChange={(e) => setInputCoupon(e.target.value)}
          />
        </div>
        <button type="submit" className="button button--dark promo-apply-btn">
          Apply
        </button>
      </form>

      {couponError && <p className="error-message promo-msg">{couponError}</p>}
      {appliedCoupon && (
        <p className="applied-coupon-pill">
          ✓ Active code: <strong className="applied-coupon-code">{appliedCoupon.toUpperCase()}</strong>
        </p>
      )}

      <button
        type="button"
        className="button button--dark checkout-btn"
        onClick={onCheckout}
      >
        Go to Checkout <span className="arrow-icon">→</span>
      </button>
    </aside>
  );
};

export default CartSummary;
