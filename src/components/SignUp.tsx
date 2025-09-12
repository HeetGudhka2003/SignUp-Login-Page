import { useState } from "react";

import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// Define form input structure

interface FormData {

    username: string;

    email: string;

    password: string;

    confirmPassword: string;
}

// Define validation error structure

interface FormErrors {

    username: string;

    email: string;

    password: string;

    confirmPassword: string;
}

// User type to store in localStorage

interface User {

    username: string;

    email: string;

    password: string;
}

const SignUp: React.FC = () => {

    const navigate = useNavigate();

    // Toggle visibility of password fields

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form state

    const [formData, setFormData] = useState<FormData>(

        {
            username: "",

            email: "",

            password: "",

            confirmPassword: ""
        }
    );

    // Validation errors state

    const [errors, setErrors] = useState<FormErrors>(

        {
            username: "",

            email: "",

            password: "",

            confirmPassword: ""
        }
    );


    // Toggle password visibility

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    // Toggle confirm password visibility

    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    // Regex to enforce password rules: 1 uppercase, 1 lowercase, 1 number and minimum 6 chars

    const isPasswordStrong = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

    // Handle form input changes and validation

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        let errorMessage = "";

        if (name === "username" && /[^A-Za-z ]/.test(value)) {

            errorMessage = "Name can only contain letters and spaces.";
        }

        if (name === "email" && value && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(value)) {

            errorMessage = "Please enter a valid email address.";
        }

        if (name === "password" && value && !isPasswordStrong(value)) {

            errorMessage = "Password must be 6+ chars, with uppercase, lowercase & number.";
        }

        if (name === "confirmPassword" && value !== formData.password) {

            errorMessage = "Passwords do not match.";
        }

        setErrors({ ...errors, [name]: errorMessage });

        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        // Stop if there are validation errors

        if (errors.username || errors.email || errors.password || errors.confirmPassword) {

            toast.error("Please fix validation errors.", { position: "top-center" });

            return;
        }

        const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

        // Prevent duplicate email

        if (existingUsers.some((user) => user.email === formData.email)) {

            toast.error("❌ User with this email already exists", { position: "top-center" });

            return;
        }

        // Create new user and store in localStorage array

        const newUser: User = {

            username: formData.username,

            email: formData.email,

            password: formData.password
        };

        const updatedUsers = [...existingUsers, newUser];

        localStorage.setItem("users", JSON.stringify(updatedUsers));

        toast.success("✅ Sign Up Successful!", { position: "top-center" });

        // Clear form

        setFormData({ username: "", email: "", password: "", confirmPassword: "" });

        // Redirect to login

        setTimeout(() => navigate("/login"), 1500);
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-white to-purple-800 p-6 relative">

            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

            <form

                className="relative bg-purple-50/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-5"

                onSubmit={handleFormSubmit}
            >

                <h1 className="text-3xl font-bold text-center text-gray-800">Sign Up</h1>

                {/* Username */}

                <div className="flex flex-col">

                    <div className="flex items-center bg-gray-50 rounded-full p-3 shadow">

                        <FaUser className="text-purple-600 w-5 h-5" />

                        <input

                            type="text"

                            name="username"

                            value={formData.username}

                            onChange={handleInputChange}

                            placeholder="Enter your username"

                            className="ml-3 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-md"

                            autoComplete="off"

                            required
                        />

                    </div>

                    {
                        errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    }

                </div>

                {/* Email */}

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

                    {
                        errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    }

                </div>

                {/* Password */}

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

                    {
                        errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    }

                </div>

                {/* Confirm Password */}

                <div className="flex flex-col">

                    <div className="flex items-center bg-gray-50 rounded-full p-3 shadow">

                        <FaLock className="text-purple-600 w-5 h-5" />

                        <input

                            type={showConfirmPassword ? "text" : "password"}

                            name="confirmPassword"

                            value={formData.confirmPassword}

                            onChange={handleInputChange}

                            placeholder="Confirm your password"

                            className="ml-3 flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-md"

                            autoComplete="off"

                            required
                        />

                        <button type="button" onClick={toggleConfirmPasswordVisibility} className="ml-2 text-purple-600">

                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                        </button>

                    </div>

                    {
                        errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    }

                </div>

                {/* Submit */}

                <button

                    type="submit"

                    className="w-full py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg hover:opacity-90 transition"
                >
                    Sign Up

                </button>

                {/* Redirect to Login */}

                <p className="text-center text-md text-gray-600">

                    Already have an account?{" "}

                    <Link to="/login" className="text-purple-600 font-medium hover:underline">

                        Log In

                    </Link>

                </p>

            </form>

            <ToastContainer />

        </div>
    );
};

export default SignUp;