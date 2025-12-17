import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful ✅");
        navigate("/admin/dashboard"); // 🔥 REDIRECT
      } else {
        alert("Login failed ❌\n" + data.message);
      }
    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">EventMS</div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/admin/login">Login</Link>
        </nav>
      </header>

      {/* LOGIN */}
      <div className="login-container">
        <div className="login-card">
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
