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
      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Subtotal</span>
        <strong>${subtotal.toFixed(2)}</strong>
      </div>

      {discount > 0 && (
        <div className="summary-row summary-row--discount">
          <span>
            Discount ({appliedCoupon === "save20" ? "20%" : "10%"})
          </span>
          <strong className="discount-val">-${discount.toFixed(2)}</strong>
        </div>
      )}

      <div className="summary-row">
        <span>Delivery Fee</span>
        <strong>${deliveryFee.toFixed(2)}</strong>
      </div>

      <hr className="summary-divider" />

      <div className="summary-row summary-row--total">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      {/* Promo Code Input */}
      <form className="promo-form" onSubmit={onApplyCoupon}>
        <div className="promo-input-wrap">
          <span className="promo-icon">🏷</span>
          <input
            type="text"
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
          ✓ Active code: <strong>{appliedCoupon.toUpperCase()}</strong>
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
