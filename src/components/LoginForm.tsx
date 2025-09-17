import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User type returned from backend (optional)
// interface User {
//   id: string;
//   email: string;
//   username?: string;
// }

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  // Toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Remember Me checkbox
  const [rememberMe, setRememberMe] = useState(false);

  // Loading state for login button
  const [loading, setLoading] = useState(false);

  // Toggle password show/hide
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate password strength (1 uppercase, 1 lowercase, 1 number, min 6)
  const isPasswordStrong = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  // Handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isPasswordStrong(formData.password)) {
      toast.error("⚠️ Password must be 6+ chars with uppercase, lowercase & number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "❌ Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Successful login
      toast.success("✅ Login Successful!");

      // Save token in localStorage
      localStorage.setItem("authToken", data.token);

      // Optional: store user info if backend sends it
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Remember Me functionality
      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          JSON.stringify({ email: formData.email, password: formData.password })
        );
      }

      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("⚠️ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-white to-purple-800 p-6 relative">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <form
        onSubmit={handleLogin}
        className="relative bg-purple-50/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-5"
        id="login-form"
        name="login-form"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Log In</h1>

        {/* Email Field */}
        <div className="flex flex-col">
          <div className="flex items-center bg-gray-50 rounded-full p-3 shadow">
            <FaEnvelope className="text-purple-600 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="ml-3 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-md"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <div className="flex items-center bg-gray-50 rounded-full p-3 shadow">
            <FaLock className="text-purple-600 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="ml-3 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-md"
              autoComplete="off"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 text-purple-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-purple-600"
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className="text-purple-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* Redirect to Signup */}
        <p className="text-center text-md text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
};

export default LoginForm;
