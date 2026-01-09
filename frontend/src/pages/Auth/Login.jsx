import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]:
          name === "email"
            ? validateEmail(value)
            : validatePassword(value),
      }));
    }

    if (error) setError("");
  };

  // Handle blur
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]:
        name === "email"
          ? validateEmail(value)
          : validatePassword(value),
    }));
  };

  const isFormValid = () =>
    !validateEmail(formData.email) &&
    !validatePassword(formData.password);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setFieldErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      setError("Please fix the errors before continuing.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post(
        API_ROUTES.AUTH.LOGIN,
        formData
      );

      const { token, username , email , _id } = response.data;
      const userData = {
  _id,
  username,
  email,
}; 
      if (token) {
        login(userData, token);
        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center 
      bg-linear-to-br from-slate-50 via-indigo-50 to-purple-50 px-4">

      <div className="w-full max-w-md">
        <div className="relative rounded-2xl p-0.5 
          bg-linear-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-xl">

          <div className="bg-cyan-50 rounded-2xl p-8">

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-12 h-12 rounded-xl 
                bg-linear-to-br from-indigo-600 to-purple-500 
                flex items-center justify-center text-white font-bold shadow-lg">
                AI
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Login to your account
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Success */}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-md">
                {success}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-md 
                      border border-slate-300 bg-white 
                      focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {fieldErrors.email && touched.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-md 
                      border border-slate-300 bg-white 
                      focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && touched.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full flex items-center justify-center gap-2 
                  px-4 py-2.5 rounded-md 
                  bg-linear-to-r from-indigo-600 to-purple-600 
                  hover:from-indigo-700 hover:to-purple-700 
                  disabled:opacity-60 text-white font-medium shadow-md"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Sign in <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-purple-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
