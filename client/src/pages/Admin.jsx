import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getAdminDashboard,
  getAdminProducts,
  getCategories,
  getAllOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  updateOrderStatus,
} from "../lib/api";

const initialProductForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: "",
  category: "",
  quantity: "",
  style: "Casual",
  thumbnailImage: "",
  galleryImages: "",
  status: "active",
};

const Admin = () => {
  const [currentTab, setCurrentTab] = useState("overview"); // "overview", "products", "categories", "orders"

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadAllAdminData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [dashRes, prodRes, catRes, ordRes] = await Promise.all([
        getAdminDashboard(),
        getAdminProducts(),
        getCategories(),
        getAllOrders(),
      ]);
      setStats(dashRes.stats || null);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setOrders(ordRes.results?.results || ordRes.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  // Product Form Field Handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddProduct = () => {
    setProductForm(initialProductForm);
    setEditingProductId(null);
    setIsProductModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id);
    setProductForm({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price !== undefined ? String(prod.price) : "",
      originalPrice: prod.originalPrice !== undefined ? String(prod.originalPrice) : "",
      discount: prod.discount !== undefined ? String(prod.discount) : "",
      category: prod.category?._id || prod.category || "",
      quantity: prod.quantity !== undefined ? String(prod.quantity) : "",
      style: prod.style || "Casual",
      thumbnailImage: prod.thumbnailImage || "",
      galleryImages: (prod.galleryImages || []).join(", "),
      status: prod.status || "active",
    });
    setIsProductModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        discount: productForm.discount ? Number(productForm.discount) : 0,
        category: productForm.category,
        quantity: Number(productForm.quantity),
        style: productForm.style,
        status: productForm.status,
        thumbnailImage: productForm.thumbnailImage.trim(),
        galleryImages: productForm.galleryImages
          ? productForm.galleryImages.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setMessage("Product updated successfully!");
      } else {
        await createProduct(payload);
        setMessage("New product created successfully!");
      }

      setIsProductModalOpen(false);
      setEditingProductId(null);
      setProductForm(initialProductForm);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        setMessage(`Deleted product: ${name}`);
        await loadAllAdminData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleQuickStockUpdate = async (prod, newQty) => {
    const qty = parseInt(newQty);
    if (isNaN(qty) || qty < 0) return;
    try {
      await updateProduct(prod._id, { quantity: qty });
      setMessage(`Stock for "${prod.name}" updated to ${qty}`);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Category Form Field Handlers
  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddCategory = () => {
    setCategoryForm({ name: "", description: "" });
    setEditingCategoryId(null);
    setIsCategoryModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryForm({ name: cat.name || "", description: cat.description || "" });
    setIsCategoryModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, categoryForm);
        setMessage("Category updated successfully!");
      } else {
        await createCategory(categoryForm);
        setMessage("New category created successfully!");
      }

      setIsCategoryModalOpen(false);
      setEditingCategoryId(null);
      setCategoryForm({ name: "", description: "" });
      await loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCategory(id);
        setMessage(`Deleted category: ${name}`);
        await loadAllAdminData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setMessage(`Order status updated to "${newStatus}"`);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="admin-page-container">
        <div className="admin-header-row">
          <div>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumb-separator">›</span>
              <span>Admin Management</span>
            </nav>
            <h1 className="admin-title">ADMIN PANEL</h1>
          </div>

          <Link to="/" className="button button--outline">
            Return to Storefront
          </Link>
        </div>

        {/* Admin Navigation Tabs */}
        <nav className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "overview" ? "is-active" : ""}`}
            onClick={() => setCurrentTab("overview")}
          >
            📊 Dashboard Overview
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "products" ? "is-active" : ""}`}
            onClick={() => setCurrentTab("products")}
          >
            👕 Products ({products.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "categories" ? "is-active" : ""}`}
            onClick={() => setCurrentTab("categories")}
          >
            📁 Categories ({categories.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${currentTab === "orders" ? "is-active" : ""}`}
            onClick={() => setCurrentTab("orders")}
          >
            📦 Customer Orders ({orders.length})
          </button>
        </nav>

        {/* Global Feedback Messages */}
        {message && <p className="success-message admin-alert">{message}</p>}
        {error && <p className="error-message admin-alert">{error}</p>}
        {isLoading && <p className="commerce-state">Loading administration records...</p>}

        {/* 1. OVERVIEW / DASHBOARD TAB */}
        {!isLoading && currentTab === "overview" && stats && (
          <section className="admin-dashboard-section">
            <div className="dashboard-metric-cards-grid">
              <div className="metric-card">
                <span className="metric-card__icon">👕</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Total Products</span>
                  <strong className="metric-card__value">{stats.products}</strong>
                </div>
              </div>

              <div className="metric-card">
                <span className="metric-card__icon">📁</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Categories</span>
                  <strong className="metric-card__value">{stats.categories}</strong>
                </div>
              </div>

              <div className="metric-card">
                <span className="metric-card__icon">👥</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Registered Users</span>
                  <strong className="metric-card__value">{stats.users}</strong>
                </div>
              </div>

              <div className="metric-card">
                <span className="metric-card__icon">📦</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Total Orders</span>
                  <strong className="metric-card__value">{stats.orders}</strong>
                </div>
              </div>

              <div className="metric-card metric-card--warning">
                <span className="metric-card__icon">⚠</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Low Stock (≤ 5 units)</span>
                  <strong className="metric-card__value">{stats.lowStock}</strong>
                </div>
              </div>

              <div className="metric-card metric-card--danger">
                <span className="metric-card__icon">✕</span>
                <div className="metric-card__info">
                  <span className="metric-card__label">Out of Stock (0 units)</span>
                  <strong className="metric-card__value">{stats.outOfStock}</strong>
                </div>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="dashboard-split-grid">
              <div className="dashboard-subcard">
                <h3>Low Stock & Out-of-Stock Alert</h3>
                <div className="admin-table-scroll">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Stock Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter((p) => p.quantity <= 5)
                        .slice(0, 6)
                        .map((p) => (
                          <tr key={`alert-${p._id}`}>
                            <td>
                              <strong>{p.name}</strong>
                            </td>
                            <td>${p.price}</td>
                            <td>
                              <span
                                className={`stock-status-pill ${
                                  p.quantity === 0
                                    ? "stock-status-pill--out"
                                    : "stock-status-pill--low"
                                }`}
                              >
                                {p.quantity === 0 ? "Out of Stock" : `Low: ${p.quantity} left`}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="action-btn action-btn--edit"
                                onClick={() => handleOpenEditProduct(p)}
                              >
                                Update Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      {!products.some((p) => p.quantity <= 5) && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            All products have sufficient inventory level (&gt; 5).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="dashboard-subcard">
                <h3>Latest Customer Orders</h3>
                <div className="admin-table-scroll">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={`dash-ord-${ord._id}`}>
                          <td>#{ord._id.slice(-6).toUpperCase()}</td>
                          <td>{ord.user?.email || ord.user?.username || "Guest"}</td>
                          <td>${ord.totalPrice.toFixed(2)}</td>
                          <td>
                            <span className={`status-pill status-pill--${ord.status}`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {!orders.length && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No orders placed yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. PRODUCTS MANAGEMENT TAB */}
        {!isLoading && currentTab === "products" && (
          <section className="admin-section">
            <div className="admin-section-toolbar">
              <h2>Inventory & Product Catalog</h2>
              <button
                type="button"
                className="button button--dark button--add"
                onClick={handleOpenAddProduct}
              >
                + Add New Product
              </button>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Dress Style</th>
                    <th>Price</th>
                    <th>Stock Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isOut = p.quantity === 0;
                    const isLow = p.quantity > 0 && p.quantity <= 5;
                    return (
                      <tr key={p._id}>
                        <td>
                          <img
                            src={p.thumbnailImage}
                            alt={p.name}
                            className="admin-thumb"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80";
                            }}
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                          {p.originalPrice && (
                            <small className="discount-tag"> (-{p.discount}%)</small>
                          )}
                        </td>
                        <td>{p.category?.name || "Uncategorized"}</td>
                        <td>{p.style || "Casual"}</td>
                        <td>${p.price}</td>
                        <td>
                          <div className="stock-control-cell">
                            <span
                              className={`stock-indicator-dot ${
                                isOut
                                  ? "dot--out"
                                  : isLow
                                  ? "dot--low"
                                  : "dot--in"
                              }`}
                            />
                            <strong>{p.quantity} units</strong>
                            {isOut && <span className="tag-out">OUT</span>}
                            {isLow && <span className="tag-low">LOW</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-badge--${p.status}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            <button
                              type="button"
                              className="action-btn action-btn--edit"
                              onClick={() => handleOpenEditProduct(p)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn action-btn--delete"
                              onClick={() => handleDeleteProduct(p._id, p.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 3. CATEGORIES MANAGEMENT TAB */}
        {!isLoading && currentTab === "categories" && (
          <section className="admin-section">
            <div className="admin-section-toolbar">
              <h2>Product Categories</h2>
              <button
                type="button"
                className="button button--dark button--add"
                onClick={handleOpenAddCategory}
              >
                + Add New Category
              </button>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Assigned Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => {
                    const assignedCount = products.filter(
                      (p) => (p.category?._id || p.category) === cat._id
                    ).length;
                    return (
                      <tr key={cat._id}>
                        <td>
                          <strong>{cat.name}</strong>
                        </td>
                        <td>{cat.description || "No description provided."}</td>
                        <td>
                          <span className="badge badge--neutral">{assignedCount} items</span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            <button
                              type="button"
                              className="action-btn action-btn--edit"
                              onClick={() => handleOpenEditCategory(cat)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="action-btn action-btn--delete"
                              onClick={() => handleDeleteCategory(cat._id, cat.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 4. ORDERS MANAGEMENT TAB */}
        {!isLoading && currentTab === "orders" && (
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
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
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
                          onClick={() => setSelectedOrderDetails(ord)}
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
        )}
      </main>

      {/* PRODUCT CREATE/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="modal-overlay" onClick={() => setIsProductModalOpen(false)}>
          <div className="modal-dialog modal-dialog--wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProductId ? "Edit Product" : "Create New Product"}</h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSaveProduct}>
              <div className="form-row-2col">
                <label>
                  Product Name
                  <input
                    name="name"
                    value={productForm.name}
                    onChange={handleProductInputChange}
                    placeholder="e.g. Graphic T-shirt"
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option value={c._id} key={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Description
                <textarea
                  name="description"
                  rows="3"
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  placeholder="Detailed product information..."
                  required
                />
              </label>

              <div className="form-row-3col">
                <label>
                  Price ($)
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    placeholder="120.00"
                    required
                  />
                </label>

                <label>
                  Original Price ($)
                  <input
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={handleProductInputChange}
                    placeholder="150.00 (Optional)"
                  />
                </label>

                <label>
                  Discount (%)
                  <input
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discount}
                    onChange={handleProductInputChange}
                    placeholder="20 (Optional)"
                  />
                </label>
              </div>

              <div className="form-row-3col">
                <label>
                  Stock Quantity
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={productForm.quantity}
                    onChange={handleProductInputChange}
                    placeholder="e.g. 25"
                    required
                  />
                  <small className="help-text">≤ 5 triggers low stock warning</small>
                </label>

                <label>
                  Dress Style
                  <select
                    name="style"
                    value={productForm.style}
                    onChange={handleProductInputChange}
                  >
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Party">Party</option>
                    <option value="Gym">Gym</option>
                  </select>
                </label>

                <label>
                  Product Status
                  <select
                    name="status"
                    value={productForm.status}
                    onChange={handleProductInputChange}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </label>
              </div>

              <label>
                Thumbnail Image URL / Path
                <input
                  name="thumbnailImage"
                  value={productForm.thumbnailImage}
                  onChange={handleProductInputChange}
                  placeholder="e.g. /images/products/arrival1.png or https://..."
                  required
                />
              </label>

              <label>
                Gallery Images (Comma separated URLs)
                <input
                  name="galleryImages"
                  value={productForm.galleryImages}
                  onChange={handleProductInputChange}
                  placeholder="/images/products/arrival1.png, /images/products/arrival4.png"
                />
              </label>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="button button--outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button--dark">
                  {editingProductId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATE/EDIT MODAL */}
      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategoryId ? "Edit Category" : "Add New Category"}</h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form className="admin-modal-form" onSubmit={handleSaveCategory}>
              <label>
                Category Name
                <input
                  name="name"
                  value={categoryForm.name}
                  onChange={handleCategoryInputChange}
                  placeholder="e.g. Jackets & Outerwear"
                  required
                />
              </label>

              <label>
                Category Description
                <textarea
                  name="description"
                  rows="3"
                  value={categoryForm.description}
                  onChange={handleCategoryInputChange}
                  placeholder="Describe items in this category..."
                />
              </label>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="button button--outline"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button--dark">
                  {editingCategoryId ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER ITEMS DETAIL POPUP MODAL */}
      {selectedOrderDetails && (
        <div className="modal-overlay" onClick={() => setSelectedOrderDetails(null)}>
          <div className="modal-dialog modal-dialog--wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details #{selectedOrderDetails._id.slice(-8).toUpperCase()}</h2>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="admin-order-modal-body">
              <div className="order-customer-info-box">
                <p><strong>Customer:</strong> {selectedOrderDetails.user?.username} ({selectedOrderDetails.user?.email})</p>
                <p><strong>Shipping Address:</strong> {selectedOrderDetails.shippingAddress}</p>
                <p><strong>Status:</strong> <span className={`status-pill status-pill--${selectedOrderDetails.status}`}>{selectedOrderDetails.status}</span></p>
              </div>

              <h3>Purchased Line Items</h3>
              <div className="admin-order-items-list">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div className="admin-order-item-row" key={`ord-item-${idx}`}>
                    <img
                      src={item.thumbnailImage || item.product?.thumbnailImage || "/images/products/arrival1.png"}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=80&q=80";
                      }}
                    />
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.size ? `Size: ${item.size} · ` : ""}Quantity: {item.quantity}</small>
                    </div>
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <hr />
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>${selectedOrderDetails.subtotal?.toFixed(2)}</strong>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Discount</span>
                  <strong className="discount-val">-${selectedOrderDetails.discount?.toFixed(2)}</strong>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping Fee</span>
                <strong>${(selectedOrderDetails.shippingFee || 15).toFixed(2)}</strong>
              </div>
              <div className="summary-row summary-row--total">
                <span>Total Amount Paid</span>
                <strong>${selectedOrderDetails.totalPrice?.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;