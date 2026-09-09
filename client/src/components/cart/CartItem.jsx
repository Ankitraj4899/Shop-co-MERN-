import { Link } from "react-router-dom";

const CartItem = ({ item, onQuantityStep, onRemove }) => {
  const prod = item.product || {};
  const maxStock = prod.quantity;

  return (
    <article className="cart-item-card">
      <Link to={`/product/${prod._id}`} className="cart-item__image-wrap">
        <img
          src={prod.thumbnailImage}
          alt={prod.name || "Product"}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80";
          }}
        />
      </Link>

      <div className="cart-item__content">
        <div className="cart-item__top-row">
          <Link to={`/product/${prod._id}`}>
            <h2 className="cart-item__name">{prod.name}</h2>
          </Link>
          <button
            type="button"
            className="cart-delete-btn"
            aria-label="Remove item"
            onClick={() => onRemove(prod._id)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7"
                stroke="#FF3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 11V17"
                stroke="#FF3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V17"
                stroke="#FF3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7"
                stroke="#FF3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 7H20"
                stroke="#FF3333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="cart-item__specs">
          {item.size && (
            <p>
              Size: <span>{item.size}</span>
            </p>
          )}
          {prod.style && (
            <p>
              Style: <span>{prod.style}</span>
            </p>
          )}
        </div>

        <div className="cart-item__bottom-row">
          <strong className="cart-item__price">${prod.price}</strong>

          <div className="quantity-stepper quantity-stepper--small">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() =>
                onQuantityStep(prod._id, item.quantity - 1, maxStock)
              }
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="qty-number">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                onQuantityStep(prod._id, item.quantity + 1, maxStock)
              }
              disabled={maxStock !== undefined && item.quantity >= maxStock}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
