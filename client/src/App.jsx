import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import Product from './pages/Product.jsx';
import PlaceOrder from './pages/PlaceOrder.jsx';
import Home from './pages/Home.jsx';
import "./App.css";

function App() {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
      </Routes>
    </div>
  )
}

export default App
