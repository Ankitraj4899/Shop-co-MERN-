import { Link } from "react-router-dom";

const ShopMegaMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="shop-megamenu">
      <div className="megamenu-col">
        <strong>Categories</strong>
        <Link to="/categories?category=T-Shirts" onClick={onClose}>
          T-Shirts
        </Link>
        <Link to="/categories?category=Shirts" onClick={onClose}>
          Shirts
        </Link>
        <Link to="/categories?category=Jeans" onClick={onClose}>
          Jeans
        </Link>
        <Link to="/categories?category=Shorts" onClick={onClose}>
          Shorts
        </Link>
        <Link to="/categories?category=Outerwear" onClick={onClose}>
          Outerwear
        </Link>
      </div>
      <div className="megamenu-col">
        <strong>Dress Styles</strong>
        <Link to="/categories?style=Casual" onClick={onClose}>
          Casual
        </Link>
        <Link to="/categories?style=Formal" onClick={onClose}>
          Formal
        </Link>
        <Link to="/categories?style=Party" onClick={onClose}>
          Party
        </Link>
        <Link to="/categories?style=Gym" onClick={onClose}>
          Gym
        </Link>
      </div>
    </div>
  );
};

export default ShopMegaMenu;
