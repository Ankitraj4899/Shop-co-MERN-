import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import ScrollToTop from "./components/ScrollToTop"
import "./App.css"

const Home = lazy(() => import("./pages/Home.jsx"))
const Login = lazy(() => import("./pages/Login.jsx"))
const Register = lazy(() => import("./pages/Register.jsx"))
const Categories = lazy(() => import("./pages/Categories.jsx"))
const Product = lazy(() => import("./pages/Product.jsx"))
const Cart = lazy(() => import("./pages/Cart.jsx"))
const PlaceOrder = lazy(() => import("./pages/PlaceOrder.jsx"))
const Orders = lazy(() => import("./pages/Orders.jsx"))
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"))
const Profile = lazy(() => import("./pages/Profile.jsx"))
const Admin = lazy(() => import("./pages/Admin.jsx"))

const App = () => (
  <Suspense fallback={<main className="commerce-state">Loading page...</main>}>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/product/:productId" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/placeorder" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
    </Routes>
  </Suspense>
)

export default App
