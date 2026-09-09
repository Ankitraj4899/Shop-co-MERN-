const ShippingForm = ({
  shippingForm,
  onInputChange,
  onSubmit,
  isSubmitting,
  estimatedTotal,
  error,
}) => {
  return (
    <form className="checkout-form-card" onSubmit={onSubmit}>
      <h2>1. Shipping Information</h2>

      <div className="form-group-grid">
        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={shippingForm.fullName}
            onChange={onInputChange}
            placeholder="Recipient's name"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={shippingForm.phone}
            onChange={onInputChange}
            placeholder="+1 555-0100"
            required
          />
        </label>
      </div>

      <label>
        Street Address
        <textarea
          name="address"
          rows="3"
          value={shippingForm.address}
          onChange={onInputChange}
          placeholder="Apartment, suite, unit, building, or street address"
          required
        />
      </label>

      <div className="form-group-grid">
        <label>
          City
          <input
            type="text"
            name="city"
            value={shippingForm.city}
            onChange={onInputChange}
            placeholder="New York"
            required
          />
        </label>

        <label>
          Postal Code
          <input
            type="text"
            name="postalCode"
            value={shippingForm.postalCode}
            onChange={onInputChange}
            placeholder="10001"
            required
          />
        </label>
      </div>

      <h2 className="payment-heading">2. Payment Method</h2>
      <div className="payment-method-box">
        <label className="radio-label">
          <input type="radio" name="payment" defaultChecked />
          <span>Cash on Delivery (Standard Secure Delivery)</span>
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button
        type="submit"
        className="button button--dark button--place-order"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Placing Order..."
          : `Pay $${estimatedTotal.toFixed(2)} & Place Order`}
      </button>
    </form>
  );
};

export default ShippingForm;
