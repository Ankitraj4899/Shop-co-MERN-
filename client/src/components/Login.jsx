import { useState } from 'react';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful!', data.user);
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <main className="login__page">
      <form className="login__form" onSubmit={handleSubmit}>
        <h3>Login to your account</h3>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Enter your Email" id="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p>{msg}</p>}
        <button type="submit" className="login__form--button">
          Login
        </button>
      </form>
    </main>
  );
}

export default Login