import { useState } from "react";

import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// User type to store in localStorage

interface User {

    email: string;

    password: string;
}

const LoginForm: React.FC = () => {

    const navigate = useNavigate();

    // Toggle password visibility

    const [showPassword, setShowPassword] = useState(false);

    // Form state

    const [formData, setFormData] = useState({

        email: "",

        password: ""

    });

    // Remember Me checkbox

    const [rememberMe, setRememberMe] = useState(false);

    // Loading state for login button

    const [loading, setLoading] = useState(false);

    // Toggle password show/hide

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    // Handle input changes

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setFormData(

            {
                ...formData, [e.target.name]: e.target.value
            }
        );
    };

    // Validate password strength (1 uppercase, 1 lowercase, 1 number, min 6)

    const isPasswordStrong = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

    // Handle login

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        // Stop if there are validation errors

        if (!isPasswordStrong(formData.password)) {

            toast.error("⚠️ Password must be 6+ chars with uppercase, lowercase & number");

            return;
        }

        setLoading(true);

        setTimeout(() => {

            // Check if user exists

            const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

            // find user

            const user = existingUsers.find(u => u.email === formData.email && u.password === formData.password);

            if (user) {

                toast.success("✅ Login Successful!");

                // Save multiple logged in users

                const loggedInUsers: User[] = JSON.parse(localStorage.getItem("loggedInUsers") || "[]");

                const alreadyLoggedIn = loggedInUsers.some(u => u.email === user.email);

                if (!alreadyLoggedIn) loggedInUsers.push(user);

                localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));

               // Remember Me functionality

                if (rememberMe) {

                    const rememberedUsers: User[] = JSON.parse(localStorage.getItem("rememberedUsers") || "[]");

                    const alreadyRemembered = rememberedUsers.some(u => u.email === user.email);

                    if (!alreadyRemembered) rememberedUsers.push(user);

                    localStorage.setItem("rememberedUsers", JSON.stringify(rememberedUsers));
                }

                setTimeout(() => navigate("/"), 1500);
            }
            
            else {

                toast.error("❌ Invalid email or password");
            }

            setLoading(false);

        }, 1200);
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

                            list="email-suggestions"

                            className="ml-3 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-md"

                            autoComplete="off"

                            required

                        />

                        <datalist id="email-suggestions">

                            <option value="@gmail.com" />

                            <option value="@yahoo.com" />

                        </datalist>

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

                        <button type="button" onClick={togglePasswordVisibility} className="ml-2 text-purple-600">

                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }

                        </button>

                    </div>

                </div>

                {/* Remember Me & Forgot Password */}

                <div className="flex justify-between items-center text-sm text-gray-600">

                    <label className="flex items-center gap-2 cursor-pointer">

                        <input

                            type="checkbox"

                            checked={rememberMe}

                            onChange={e => setRememberMe(e.target.checked)}

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

                    {
                        loading ? "Logging in..." : "Log In"
                    }

                </button>

                {/* Google Login */}

                <button

                    type="button"

                    className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 transition cursor-pointer"

                >

                    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">

                        <path fill="#4285F4" d="M533.5 278.4c0-18.6-1.5-37.2-4.7-55.4H272v104.9h147c-6.4 34.4-25.6 63.5-54.6 83.1l88.4 68.8c51.7-47.7 80.7-118.1 80.7-201.4z" />

                        <path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.4 180.8-66.5l-88.4-68.8c-24.6 16.6-56.2 26.2-92.4 26.2-70.8 0-130.8-47.7-152.3-111.4l-91.2 70.4C66.8 482.1 163.4 544.3 272 544.3z" />

                        <path fill="#FBBC05" d="M119.7 323.8c-10.8-32-10.8-66.9 0-98.9l-91.2-70.4c-39.7 77.8-39.7 162 0 239.8l91.2-70.5z" />

                        <path fill="#EA4335" d="M272 107.7c38.9-.6 76.4 13.8 104.9 39.9l78.4-78.4C407.6 24.5 346.4-.1 272 0 163.4 0 66.8 62.2 28.5 154.5l91.2 70.4C141.2 155.4 201.2 107.7 272 107.7z" />

                    </svg>

                    Log in with Google

                </button>

                {/* Yahoo Login */}

                <button

                    type="button"

                    className="w-full flex items-center justify-center gap-2 py-3 rounded-md font-medium text-white bg-[#6001d2] shadow-sm hover:opacity-90 transition cursor-pointer"

                >

                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">

                        <path d="M12 0C5.37 0 0 5.37 0 12c0 6.62 5.37 12 12 12 6.62 0 12-5.38 12-12 0-6.63-5.38-12-12-12zm0 21.6c-5.31 0-9.6-4.29-9.6-9.6S6.69 2.4 12 2.4s9.6 4.29 9.6 9.6-4.29 9.6-9.6 9.6z" />

                        <path d="M16.2 7.8l-1.2 7.2h-1.8L12 12.6 10.8 15h-1.8l-1.2-7.2h1.8l.6 3.6.6-3.6h1.8l.6 3.6.6-3.6h1.8z" />

                    </svg>

                    Log in with Yahoo

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