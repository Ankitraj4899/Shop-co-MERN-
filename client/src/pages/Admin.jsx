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
import { isValidUrlOrPath } from "../lib/validation";

import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import AdminProductsTab from "../components/admin/AdminProductsTab";
import AdminCategoriesTab from "../components/admin/AdminCategoriesTab";
import AdminOrdersTab from "../components/admin/AdminOrdersTab";
import AdminProductModal from "../components/admin/AdminProductModal";
import AdminCategoryModal from "../components/admin/AdminCategoryModal";
import AdminOrderDetailsModal from "../components/admin/AdminOrderDetailsModal";
import ConfirmModal from "../components/ConfirmModal";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  discount: "",
  category: "",
  quantity: "",
  style: "Casual",
  thumbnailImage: "",
  thumbnailFile: null,
  thumbnailPreview: "",
  galleryItems: [],
  status: "active",
};

const emptyCategoryForm = {
  name: "",
  description: "",
};

const Admin = () => {
  const [currentTab, setCurrentTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState(emptyProductForm);
  const [productErrors, setProductErrors] = useState({});
  const [editingProductId, setEditingProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryErrors, setCategoryErrors] = useState({});
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    type: null, // "product" | "category"
    id: null,
    name: "",
    isLoading: false,
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
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
      setError(err.message || "Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
    if (productErrors[name]) {
      setProductErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailSelect = ({ file, preview, url }) => {
    setProductForm((prev) => ({
      ...prev,
      thumbnailFile: file || null,
      thumbnailPreview: preview || "",
      thumbnailImage: url || "",
    }));
    if (productErrors.thumbnailImage) {
      setProductErrors((prev) => ({ ...prev, thumbnailImage: "" }));
    }
  };

  const handleThumbnailClear = () => {
    setProductForm((prev) => ({
      ...prev,
      thumbnailFile: null,
      thumbnailPreview: "",
      thumbnailImage: "",
    }));
  };

  const handleAddGalleryFiles = (files) => {
    const newItems = files.map((file) => ({
      type: "file",
      file,
      preview: URL.createObjectURL(file),
      url: "",
    }));
    setProductForm((prev) => ({
      ...prev,
      galleryItems: [...(prev.galleryItems || []), ...newItems],
    }));
  };

  const handleAddGalleryUrl = (url) => {
    if (!url?.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      galleryItems: [
        ...(prev.galleryItems || []),
        { type: "url", preview: url.trim(), url: url.trim(), file: null },
      ],
    }));
  };

  const handleRemoveGalleryItem = (index) => {
    setProductForm((prev) => ({
      ...prev,
      galleryItems: (prev.galleryItems || []).filter((_, i) => i !== index),
    }));
  };

  const handleOpenAddProduct = () => {
    setProductForm(emptyProductForm);
    setProductErrors({});
    setEditingProductId(null);
    setIsProductModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProductId(prod._id);
    setProductErrors({});

    const initialGallery = (prod.galleryImages || []).map((imgUrl) => ({
      type: "url",
      preview: imgUrl,
      url: imgUrl,
      file: null,
    }));

    setProductForm({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price ?? "",
      originalPrice: prod.originalPrice ?? "",
      discount: prod.discount ?? "",
      category: prod.category?._id || prod.category || "",
      quantity: prod.quantity ?? "",
      style: prod.style || "Casual",
      thumbnailImage: prod.thumbnailImage || "",
      thumbnailFile: null,
      thumbnailPreview: prod.thumbnailImage || "",
      galleryItems: initialGallery,
      status: prod.status || "active",
    });
    setIsProductModalOpen(true);
    setMessage("");
    setError("");
  };

  const validateProductForm = () => {
    const errors = {};
    const trimmedName = productForm.name.trim();
    if (!trimmedName) {
      errors.name = "Product name is required.";
    } else if (trimmedName.length < 3) {
      errors.name = "Product name must be at least 3 characters.";
    }

    if (!productForm.category) {
      errors.category = "Please select a category.";
    }

    const trimmedDesc = productForm.description.trim();
    if (!trimmedDesc) {
      errors.description = "Description is required.";
    } else if (trimmedDesc.length < 10) {
      errors.description = "Description must be at least 10 characters.";
    }

    const priceNum = Number(productForm.price);
    if (productForm.price === "" || isNaN(priceNum) || priceNum <= 0) {
      errors.price = "Enter a valid positive price.";
    }

    if (productForm.originalPrice !== "") {
      const origPriceNum = Number(productForm.originalPrice);
      if (isNaN(origPriceNum) || origPriceNum < priceNum) {
        errors.originalPrice = "Original price must be equal to or greater than price.";
      }
    }

    if (productForm.discount !== "") {
      const discNum = Number(productForm.discount);
      if (isNaN(discNum) || discNum < 0 || discNum > 100) {
        errors.discount = "Discount must be between 0% and 100%.";
      }
    }

    const qtyNum = Number(productForm.quantity);
    if (productForm.quantity === "" || isNaN(qtyNum) || !Number.isInteger(qtyNum) || qtyNum < 0) {
      errors.quantity = "Enter a valid non-negative integer for stock quantity.";
    }

    const hasThumbnail =
      Boolean(productForm.thumbnailFile) ||
      Boolean(productForm.thumbnailImage && isValidUrlOrPath(productForm.thumbnailImage)) ||
      Boolean(productForm.thumbnailPreview);

    if (!hasThumbnail) {
      errors.thumbnailImage = "Please select or upload a thumbnail image for the product.";
    }

    setProductErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    setError("");
    setMessage("");

    const hasFiles =
      Boolean(productForm.thumbnailFile) ||
      (productForm.galleryItems || []).some((item) => item.type === "file" && item.file);

    let payload;

    if (hasFiles) {
      const formData = new FormData();
      formData.append("name", productForm.name.trim());
      formData.append("description", productForm.description.trim());
      formData.append("price", Number(productForm.price));
      if (productForm.originalPrice !== "") {
        formData.append("originalPrice", Number(productForm.originalPrice));
      }
      if (productForm.discount !== "") {
        formData.append("discount", Number(productForm.discount));
      }
      formData.append("category", productForm.category);
      formData.append("quantity", Number(productForm.quantity));
      formData.append("style", productForm.style);
      formData.append("status", productForm.status);

      if (productForm.thumbnailFile) {
        formData.append("thumbnailImage", productForm.thumbnailFile);
      } else if (productForm.thumbnailImage) {
        formData.append("thumbnailImage", productForm.thumbnailImage.trim());
      } else if (productForm.thumbnailPreview) {
        formData.append("thumbnailImage", productForm.thumbnailPreview.trim());
      }

      const existingGalleryUrls = [];
      (productForm.galleryItems || []).forEach((item) => {
        if (item.type === "file" && item.file) {
          formData.append("galleryImages", item.file);
        } else if (item.url) {
          existingGalleryUrls.push(item.url.trim());
        }
      });

      if (existingGalleryUrls.length > 0) {
        formData.append("galleryImages", JSON.stringify(existingGalleryUrls));
      }

      payload = formData;
    } else {
      const galleryUrls = (productForm.galleryItems || [])
        .map((item) => item.url || (typeof item === "string" ? item : ""))
        .filter(Boolean);

      payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice !== "" ? Number(productForm.originalPrice) : null,
        discount: productForm.discount !== "" ? Number(productForm.discount) : 0,
        category: productForm.category,
        quantity: Number(productForm.quantity),
        style: productForm.style,
        status: productForm.status,
        thumbnailImage: (productForm.thumbnailImage || productForm.thumbnailPreview || "").trim(),
        galleryImages: galleryUrls,
      };
    }

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setMessage("Product updated successfully!");
      } else {
        await createProduct(payload);
        setMessage("New product created successfully!");
      }

      setIsProductModalOpen(false);
      setEditingProductId(null);
      setProductForm(emptyProductForm);
      setProductErrors({});
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = (id, name) => {
    setDeleteDialog({
      isOpen: true,
      type: "product",
      id,
      name,
      isLoading: false,
    });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
    if (categoryErrors[name]) {
      setCategoryErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOpenAddCategory = () => {
    setCategoryForm(emptyCategoryForm);
    setCategoryErrors({});
    setEditingCategoryId(null);
    setIsCategoryModalOpen(true);
    setMessage("");
    setError("");
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategoryId(cat._id);
    setCategoryErrors({});
    setCategoryForm({
      name: cat.name || "",
      description: cat.description || "",
    });
    setIsCategoryModalOpen(true);
    setMessage("");
    setError("");
  };

  const validateCategoryForm = () => {
    const errors = {};
    const trimmedName = categoryForm.name.trim();
    if (!trimmedName) {
      errors.name = "Category name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Category name must be at least 2 characters.";
    }

    setCategoryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!validateCategoryForm()) return;

    setError("");
    setMessage("");

    try {
      if (editingCategoryId) {
        await updateCategory(editingCategoryId, {
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        });
        setMessage("Category updated successfully!");
      } else {
        await createCategory({
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim(),
        });
        setMessage("New category created successfully!");
      }

      setIsCategoryModalOpen(false);
      setEditingCategoryId(null);
      setCategoryForm(emptyCategoryForm);
      setCategoryErrors({});
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = (id, name) => {
    setDeleteDialog({
      isOpen: true,
      type: "category",
      id,
      name,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    setError("");
    setMessage("");

    try {
      if (deleteDialog.type === "product") {
        await deleteProduct(deleteDialog.id);
        setMessage(`Product "${deleteDialog.name}" was deleted successfully.`);
      } else if (deleteDialog.type === "category") {
        await deleteCategory(deleteDialog.id);
        setMessage(`Category "${deleteDialog.name}" was deleted successfully.`);
      }

      setDeleteDialog({
        isOpen: false,
        type: null,
        id: null,
        name: "",
        isLoading: false,
      });
      await loadData();
    } catch (err) {
      setError(err.message || `Failed to delete ${deleteDialog.type}`);
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setMessage(`Order status updated to "${newStatus}"`);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update order status");
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

        {message && <p className="success-message admin-alert">{message}</p>}
        {error && <p className="error-message admin-alert">{error}</p>}
        {isLoading && (
          <p className="commerce-state">Loading administration records...</p>
        )}

        {!isLoading && currentTab === "overview" && (
          <AdminOverviewTab
            stats={stats}
            products={products}
            orders={orders}
            onOpenEditProduct={handleOpenEditProduct}
          />
        )}

        {!isLoading && currentTab === "products" && (
          <AdminProductsTab
            products={products}
            onOpenAddProduct={handleOpenAddProduct}
            onOpenEditProduct={handleOpenEditProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {!isLoading && currentTab === "categories" && (
          <AdminCategoriesTab
            categories={categories}
            products={products}
            onOpenAddCategory={handleOpenAddCategory}
            onOpenEditCategory={handleOpenEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {!isLoading && currentTab === "orders" && (
          <AdminOrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSelectOrderDetails={setSelectedOrder}
          />
        )}
      </main>

      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        editingProductId={editingProductId}
        productForm={productForm}
        onInputChange={handleProductChange}
        onThumbnailSelect={handleThumbnailSelect}
        onThumbnailClear={handleThumbnailClear}
        onAddGalleryFiles={handleAddGalleryFiles}
        onAddGalleryUrl={handleAddGalleryUrl}
        onRemoveGalleryItem={handleRemoveGalleryItem}
        categories={categories}
        formErrors={productErrors}
      />

      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleSaveCategory}
        editingCategoryId={editingCategoryId}
        categoryForm={categoryForm}
        onInputChange={handleCategoryChange}
        formErrors={categoryErrors}
      />

      <AdminOrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <ConfirmModal
        isOpen={deleteDialog.isOpen}
        title={deleteDialog.type === "product" ? "Delete Product" : "Delete Category"}
        message={`Are you sure you want to permanently delete this ${deleteDialog.type}? This action cannot be undone.`}
        itemName={deleteDialog.name}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteDialog.isLoading}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ isOpen: false, type: null, id: null, name: "", isLoading: false })}
      />

      <Footer />
    </div>
  );
};

export default Admin;