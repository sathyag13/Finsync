import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import api from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (user.password !== user.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (user.password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (!/^[6-9]\d{9}$/.test(user.mobileNumber)) {
      return setError("Enter a valid 10-digit mobile number");
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        password: user.password,
      });

      navigate("/login?registered=true");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-5xl my-6 mx-4 bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row min-h-[600px]">
        
        {/* LEFT BRANDING PANEL */}
        <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10 pointer-events-none"></div>

          <div className="relative z-10">
            <span className="text-3xl font-black tracking-tight">FinSync</span>
            <h2 className="text-3xl font-bold mt-8 leading-snug">
              Join Digital Banking Today.
            </h2>
            <p className="mt-4 text-sm text-white/80 leading-relaxed">
              Create your account to manage finances, send transfers, and monitor activity effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">100%</h3>
              <p className="text-xs text-white/80 mt-1">Secure Banking</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-xs text-white/80 mt-1">Support</p>
            </div>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="text-center lg:text-left mb-6">
              <div className="lg:hidden mx-auto h-12 w-12 rounded-xl bg-green-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-sm">
                F
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Enter your details to register for FinSync
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Full Name */}
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  value={user.fullName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                />
              </div>

              {/* Mobile */}
              <div className="relative">
                <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  required
                  value={user.mobileNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={user.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  value={user.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={user.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-2.5 text-xs">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition duration-150 flex items-center justify-center shadow-sm mt-1"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 text-green-600 font-semibold hover:underline focus:outline-none"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;