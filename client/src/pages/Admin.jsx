import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import AdminProductsTab from "../components/admin/AdminProductsTab";
import AdminCategoriesTab from "../components/admin/AdminCategoriesTab";
import AdminOrdersTab from "../components/admin/AdminOrdersTab";
import AdminProductModal from "../components/admin/AdminProductModal";
import AdminCategoryModal from "../components/admin/AdminCategoryModal";
import AdminOrderDetailsModal from "../components/admin/AdminOrderDetailsModal";

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
      originalPrice:
        prod.originalPrice !== undefined ? String(prod.originalPrice) : "",
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
        originalPrice: productForm.originalPrice
          ? Number(productForm.originalPrice)
          : null,
        discount: productForm.discount ? Number(productForm.discount) : 0,
        category: productForm.category,
        quantity: Number(productForm.quantity),
        style: productForm.style,
        status: productForm.status,
        thumbnailImage: productForm.thumbnailImage.trim(),
        galleryImages: productForm.galleryImages
          ? productForm.galleryImages
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
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
        {isLoading && (
          <p className="commerce-state">Loading administration records...</p>
        )}

        {/* 1. OVERVIEW / DASHBOARD TAB */}
        {!isLoading && currentTab === "overview" && (
          <AdminOverviewTab
            stats={stats}
            products={products}
            orders={orders}
            onOpenEditProduct={handleOpenEditProduct}
          />
        )}

        {/* 2. PRODUCTS MANAGEMENT TAB */}
        {!isLoading && currentTab === "products" && (
          <AdminProductsTab
            products={products}
            onOpenAddProduct={handleOpenAddProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* 3. CATEGORIES MANAGEMENT TAB */}
        {!isLoading && currentTab === "categories" && (
          <AdminCategoriesTab
            categories={categories}
            products={products}
            onOpenAddCategory={handleOpenAddCategory}
            onOpenEditCategory={handleOpenEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* 4. ORDERS MANAGEMENT TAB */}
        {!isLoading && currentTab === "orders" && (
          <AdminOrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSelectOrderDetails={setSelectedOrderDetails}
          />
        )}
      </main>

      {/* PRODUCT CREATE/EDIT MODAL */}
      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        editingProductId={editingProductId}
        productForm={productForm}
        onInputChange={handleProductInputChange}
        categories={categories}
      />

      {/* CATEGORY CREATE/EDIT MODAL */}
      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleSaveCategory}
        editingCategoryId={editingCategoryId}
        categoryForm={categoryForm}
        onInputChange={handleCategoryInputChange}
      />

      {/* ORDER ITEMS DETAIL POPUP MODAL */}
      <AdminOrderDetailsModal
        order={selectedOrderDetails}
        onClose={() => setSelectedOrderDetails(null)}
      />

      <Footer />
    </div>
  );
};

export default Admin;