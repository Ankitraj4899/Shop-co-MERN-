# SHOP.CO — Full-Stack MERN E-Commerce Platform

A production-ready, high-performance full-stack MERN e-commerce application equipped with responsive UI/UX styling, user authentication, customer shopping workflows, order management, inventory control, and an executive Admin Dashboard.

---

## 🚀 Technology Stack

### **Frontend**
* **Framework:** React 18 (Vite)
* **Styling:** Modular SCSS (CSS Variables, Flexbox/Grid, Mixins, Component Stylesheets)
* **Routing:** React Router v6 (Lazy loaded pages with `Suspense`)
* **Icons & Assets:** Custom SVGs, High-resolution responsive WebP/PNG mockups
* **Notifications & Email:** EmailJS integration for newsletter subscriptions

### **Backend**
* **Runtime:** Node.js & Express.js
* **Database:** MongoDB & Mongoose ORM
* **Authentication:** JWT (JSON Web Tokens) with HTTP-only cookies & `bcryptjs` password hashing
* **File Uploads:** Cloudinary API integration for product thumbnails and gallery images

---

## 📁 Repository Structure

```
d:/Mern-project/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── assets/             # Logos, brand badges, design screenshots
│   │   ├── components/         # Reusable UI components (Navbar, Footer, ProductCard, StarRating, ProtectedRoute)
│   │   ├── context/            # AuthContext & CartContext
│   │   ├── lib/                # API client & fetch helpers
│   │   ├── pages/              # Lazy-loaded route views (Home, Categories, Product, Cart, PlaceOrder, Orders, OrderDetails, Profile, Login, Register, Admin)
│   │   └── scss/               # Modular SCSS architecture (_variables.scss, _mixins.scss, _navbar.scss, main.scss)
│   ├── package.json
│   └── vite.config.js
├── src/                        # Backend Node.js / Express API
│   ├── config/                 # DB connection & Cloudinary setup
│   ├── controllers/            # Business logic (auth, product, category, cart, order, filter, admin)
│   ├── middlewares/            # Auth, Admin role verification, multer file uploads
│   ├── models/                 # Mongoose schemas (User, Product, Category, Cart, Order)
│   ├── routes/                 # Express API endpoint definitions
│   └── seed/                   # Database seed scripts
├── server.js                   # Main API Server Entrypoint
└── README.md
```

---

## 🔒 Authentication & Role-Based Security

1. **Password Hashing:** All user passwords are encrypted using `bcryptjs` before storage in MongoDB.
2. **JWT Session Control:** Tokens are passed securely via HTTP-only cookies to prevent XSS attacks.
3. **Role Authorization:**
   * **Customer (`role: 'customer'`):** Can browse, filter, add items to cart, checkout, view personal profile, and track order status.
   * **Admin (`role: 'admin'`):** Accesses `/admin/*` routes to manage products, categories, view metrics, and update order fulfillment statuses.
   * Customers are strictly blocked from promoting their own account roles.

---

## 📦 Database Schemas & Inventory System

* **User Schema:** `username`, `email`, `password`, `role` ('customer' | 'admin'), `phone`, `address`, `createdAt`.
* **Product Schema:** `name`, `description`, `price`, `originalPrice`, `discount`, `rating`, `style`, `colors`, `category` (ObjectId ref), `quantity` (Inventory count), `variants` (Sizes), `thumbnailImage`, `galleryImages`, `reviews` array.
* **Category Schema:** `name`, `description`, `slug`, `image`.
* **Order Schema:** `user` (ref), `items` array, `shippingAddress`, `subtotal`, `discount`, `deliveryFee`, `totalAmount`, `status` ('Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'), `paymentStatus`.
* **Inventory Control & Out of Stock Logic:**
  * Products track live stock levels (`quantity`).
  * Backend API enforces quantity limits during cart updates and checkout.
  * When `quantity === 0`, product exhibits an **OUT OF STOCK** status, disabling the "Add to Cart" button.
  * Upon checkout, backend automatically deducts purchased items from inventory.

---

## ⚡ React Performance Optimizations

1. **`useMemo`:**
   * Used in `CartContext.jsx` for calculating subtotal, discounts, delivery fees, and total price without unnecessary recalculations on unrelated state changes.
   * Used in product filtering, sorting, and testimonial slicing.
2. **`useCallback`:**
   * Used for memoizing cart actions (`addItemToCart`, `updateQuantity`, `removeItem`), API fetchers (`fetchProductData`), and search triggers to prevent unnecessary child component re-renders.
3. **`React.memo`:**
   * Applied to heavy list items such as `ProductCard` and `StarRating` to prevent re-rendering when sibling components change.
4. **Lazy Loading & Code Splitting:**
   * All pages are lazy-loaded via `React.lazy()` and `<Suspense>` in `App.jsx`, ensuring small initial bundle size (`< 240 kB`).

---

## 📈 Core Web Vitals Optimizations

* **Largest Contentful Paint (LCP):** Pre-loaded font files (`Integral CF`, `Satoshi`), lazy-loaded below-the-fold product images, optimized WebP format.
* **Cumulative Layout Shift (CLS):** Aspect-ratio boxes on image containers (`aspect-ratio: 1 / 1.05`) prevent content jumping during image loads.
* **Interaction to Next Paint (INP):** Debounced search inputs and optimized React re-renders keep input handlers responsive (< 50ms).

---

## 🛠️ Low Stock Policy

* **Threshold:** Any product with `quantity <= 5` and `quantity > 0` is flagged as **LOW STOCK** in the Admin Dashboard.
* Administrators receive visual badges indicating items requiring inventory re-stocking.

---

## 🚦 Getting Started

### 1. Backend Server Setup
```bash
# In the root directory
npm install
npm run dev
# Server will run on http://localhost:3000
```

### 2. Frontend React Client Setup
```bash
cd client
npm install
npm run dev
# Client dev server will run on http://localhost:5173
```
