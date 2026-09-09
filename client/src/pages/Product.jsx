import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProduct, getProducts, addProductReview } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductTabs from "../components/product/ProductTabs";
import ReviewModal from "../components/product/ReviewModal";

const Product = () => {
  const { productId } = useParams();
  const { addItemToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [isAdding, setIsAdding] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchProductData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProduct(productId);
      const prod = data.product || data.results || data;
      setProduct(prod);
      if (prod) {
        const primaryImg =
          prod.thumbnailImage || (prod.galleryImages && prod.galleryImages[0]) || "";
        setSelectedImage(primaryImg);
        if (prod.colors && prod.colors.length > 0) {
          setSelectedColor(prod.colors[0]);
        }
        if (prod.variants && prod.variants.length > 0) {
          setSelectedSize(prod.variants[0].size || "Medium");
        }
      }

      // Fetch related products (fetch up to 10 to ensure 4 distinct items after filtering out current product)
      const relData = await getProducts(`limit=10`);
      const allRel =
        relData.results?.results || relData.products || relData.results || [];
      setRelatedProducts(allRel.filter((p) => p._id !== productId).slice(0, 4));
    } catch (err) {
      setError(err.message || "Failed to load product details.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductData();
    window.scrollTo(0, 0);
  }, [fetchProductData]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      setToastMessage("Please log in to add items to your cart.");
      setTimeout(() => setToastMessage(""), 4000);
      return;
    }
    setIsAdding(true);
    try {
      await addItemToCart(product._id, quantity, selectedSize);
      setToastMessage(
        `Added ${quantity} x ${product.name} (${selectedSize}) to your cart!`
      );
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err) {
      setToastMessage(err.message || "Could not add item to cart.");
      setTimeout(() => setToastMessage(""), 4000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment.");
      return;
    }
    setIsSubmittingReview(true);
    setReviewError("");
    try {
      await addProductReview(productId, {
        rating: reviewRating,
        comment: reviewComment,
        name: reviewerName,
      });
      setShowReviewModal(false);
      setReviewComment("");
      setReviewerName("");
      setToastMessage("Thank you! Your review has been published.");
      setTimeout(() => setToastMessage(""), 4000);
      fetchProductData(); // Refresh reviews
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">Loading product details...</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="commerce-page">
        <Navbar />
        <main className="commerce-state">
          <h2>Product Not Found</h2>
          <p>{error || "The product you requested could not be located."}</p>
          <Link to="/" className="button button--dark" style={{ marginTop: "16px" }}>
            Return to Store
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const galleryList = [
    product.thumbnailImage,
    ...(product.galleryImages || []),
  ].filter(Boolean);

  const colorsList =
    product.colors && product.colors.length > 0
      ? product.colors
      : [
          { name: "Olive", hex: "#4F533E" },
          { name: "Forest", hex: "#314F4A" },
          { name: "Navy", hex: "#31344F" },
        ];

  const sizesList =
    product.variants && product.variants.length > 0
      ? product.variants.map((v) => v.size)
      : ["Small", "Medium", "Large", "X-Large"];

  const reviewsList = product.reviews || [];

  return (
    <div className="commerce-page">
      <Navbar />

      <main className="product-page-container">
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              backgroundColor: "#000",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "62px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              zIndex: 9999,
              fontWeight: 500,
              fontSize: "14px",
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/categories">Shop</Link>
          <span className="breadcrumb-separator">&gt;</span>
          <span>{product.category?.name || "Apparel"}</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span>{product.name}</span>
        </nav>

        {/* Product Details Section */}
        <div className="product-detail">
          <ProductGallery
            product={product}
            galleryList={galleryList}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />

          <ProductInfo
            product={product}
            colorsList={colorsList}
            sizesList={sizesList}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            isAdding={isAdding}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviewsList={reviewsList}
          product={product}
          onOpenReviewModal={() => setShowReviewModal(true)}
        />

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <section className="product-section">
            <div className="section-heading text-center">
              <h2>YOU MIGHT ALSO LIKE</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd._id} product={relProd} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleReviewSubmit}
        reviewError={reviewError}
        reviewerName={reviewerName}
        setReviewerName={setReviewerName}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        isSubmittingReview={isSubmittingReview}
      />

      <Footer />
    </div>
  );
};

export default Product;