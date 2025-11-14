import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import swiftPayLogo from "../assets/images/swiftPay.jpg";

const API_BASE = "http://localhost:3001";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("[Login] input change:", name, value);
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const payload = isLogin ? { username: formData.username, password: formData.password } : formData;

      console.log("[Login] submitting to", `${API_BASE}${endpoint}`, "payload:", payload);
      const response = await axios.post(`${API_BASE}${endpoint}`, payload);
      console.log("[Login] response:", response?.data);

      if (response.data.token) {
        console.log("[Login] auth success, calling onLogin and navigating");
        onLogin(response.data.user, response.data.token);
        // navigate to dashboard after successful login/register
        navigate("/dashboard");
      } else {
        console.warn("[Login] no token in response");
        setError("Login failed");
      }
    } catch (err) {
      console.error("[Login] error:", err);
      console.error("[Login] error.response:", err.response);
      setError(err.response?.data?.error || err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <img src={swiftPayLogo} alt="SwiftPay" className="swiftpay-logo-img" />
        </div>
        <h1>SwiftPay</h1>
        <h2>Digital Payment Service</h2>

        <div className="toggle-buttons">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required={!isLogin} />
            </>
          )}
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
