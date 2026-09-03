import { Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';


function App() {
  return (
    <>
      <nav>
        <Link to="/">Login</Link> | <Link to="/register">Register</Link>
      </nav>

    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
