import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, ...user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white items-center justify-center relative overflow-hidden">
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-white/10 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 pointer-events-none"></div>

        <div className="relative z-10 px-14 max-w-xl">
          <h1 className="text-6xl font-black">FinSync</h1>

          <h2 className="text-4xl font-bold mt-6 leading-tight">
            Digital Banking <br /> Made Simple.
          </h2>

          <p className="mt-8 text-lg text-white/80 leading-8">
            Securely manage your accounts, transfer money, monitor transactions,
            and stay in control of your finances anytime, anywhere.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-sm mt-2">Banking Access</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-sm mt-2">Secure Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              F
            </div>

            <h2 className="text-3xl font-bold mt-6 text-slate-800">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-2 text-sm">
              Login to continue banking
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-12 pr-12 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition duration-150 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account?
            <Link
              to="/register"
              className="ml-2 text-green-600 font-semibold hover:underline focus:outline-none focus:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;