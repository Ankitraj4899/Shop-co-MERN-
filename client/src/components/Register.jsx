import { useState } from "react";
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
    <main className="login__page">
      <form className="login__form" onSubmit={handleSubmit}>
        <h3>Create your account</h3>
        <div>
          <label htmlFor="username">Full Name:</label>
          <input type="text" placeholder="Enter your Full Name" id="username" required name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Enter your Email" id="email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p>{msg}</p>}
        <button type="submit" className="login__form--button">
          Register
        </button>
      </form>
    </main>
  );
}

export default Register