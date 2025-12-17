import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/UserLogin.css";

export default function UserLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* REGISTER */
  const handleRegister = async () => {
    if (!register.name || !register.email || !register.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful ✅ Please login");
        setRegister({ name: "", email: "", password: "" });
        setLogin({ email: register.email, password: "" });
        setIsLogin(true);
      } else {
        alert(data.message || "Registration failed ");
      }
    } catch (err) {
      alert("Server error ");
    }
  };

  /* LOGIN */
const handleLogin = async () => {
  if (!login.email || !login.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });

    const data = await res.json();

    if (res.ok) {
      //  SAVE SESSION
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userEmail", data.user.email);

      alert("Login successful ✅");
      navigate("/user/dashboard");
    } else {
      alert(data.message || "Login failed ❌");
    }
  } catch (err) {
    alert("Server error ");
  }
};


  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">EventMS</div>
        <nav className="nav">
          <Link to="/">Home</Link>
        </nav>
      </header>

      {/* AUTH SECTION */}
      <div className="admin-auth-container">
        <div className="single-card">

          {/* LOGIN */}
          {isLogin && (
            <div className="card-content slide-in-left">
              <h2>User Login</h2>

              <input
                type="email"
                placeholder="Email"
                value={login.email}
                onChange={(e) =>
                  setLogin({ ...login, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
              />

              <button className="btn login-btn" onClick={handleLogin}>
                Login
              </button>

              <div className="arrow" onClick={() => setIsLogin(false)}>
                ➜ Register
              </div>
            </div>
          )}

          {/* REGISTER */}
          {!isLogin && (
            <div className="card-content slide-in-right">
              <h2>User Registration</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={register.name}
                onChange={(e) =>
                  setRegister({ ...register, name: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={register.email}
                onChange={(e) =>
                  setRegister({ ...register, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={register.password}
                onChange={(e) =>
                  setRegister({ ...register, password: e.target.value })
                }
              />

              <button className="btn register-btn" onClick={handleRegister}>
                Register
              </button>

              <div className="arrow" onClick={() => setIsLogin(true)}>
                ← Back to Login
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
