const ShippingForm = ({
  shippingForm,
  onInputChange,
  onSubmit,
  isSubmitting,
  estimatedTotal,
  error,
  formErrors = {},
}) => {
  return (
    <form className="checkout-form-card" onSubmit={onSubmit} noValidate>
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
            className={formErrors.fullName ? "input--error" : ""}
          />
          {formErrors.fullName && (
            <span className="field-error-text">{formErrors.fullName}</span>
          )}
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={shippingForm.phone}
            onChange={onInputChange}
            placeholder="+1 555-0100"
            className={formErrors.phone ? "input--error" : ""}
          />
          {formErrors.phone && (
            <span className="field-error-text">{formErrors.phone}</span>
          )}
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
          className={formErrors.address ? "input--error" : ""}
        />
        {formErrors.address && (
          <span className="field-error-text">{formErrors.address}</span>
        )}
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
            className={formErrors.city ? "input--error" : ""}
          />
          {formErrors.city && (
            <span className="field-error-text">{formErrors.city}</span>
          )}
        </label>

        <label>
          Postal Code
          <input
            type="text"
            name="postalCode"
            value={shippingForm.postalCode}
            onChange={onInputChange}
            placeholder="10001"
            className={formErrors.postalCode ? "input--error" : ""}
          />
          {formErrors.postalCode && (
            <span className="field-error-text">{formErrors.postalCode}</span>
          )}
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
