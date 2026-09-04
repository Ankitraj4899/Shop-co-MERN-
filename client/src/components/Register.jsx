import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'register failed');
      }

      console.log('Registration successful!', data.user);
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 px-4">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-6 text-2xl flex items-center justify-center font-bold text-gray-800">
          Create your account
        </h3>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your full name"
            id="username"
            required
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            required
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {msg && (
          <p className="mb-4 text-sm text-red-500">
            {msg}
          </p>
        )}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-purple-600 py-2.5 font-medium text-white hover:bg-purple-700"
        >
          Register
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already registered?{" "}
          <Link to="/"  className="font-medium text-purple-600 hover:text-purple-700">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
};

export default Register;