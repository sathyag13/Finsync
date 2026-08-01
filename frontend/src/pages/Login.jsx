import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    console.log("Sending Login Data:", loginData);

    try {
      const response = await api.post("/auth/login", loginData);

      console.log("Backend Response:", response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);

        if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Login Failed");
        }
      } else {
        setError("Unable to connect to server");
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>FinSync</h2>
        <h4>Login</h4>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;