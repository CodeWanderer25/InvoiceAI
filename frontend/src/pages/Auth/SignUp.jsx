import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../utils/axios";
import { API_ROUTES } from "../../utils/ApiRoute";
import { validateEmail, validatePassword } from "../../utils/helper";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",      // ✅ corrected field
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    username: "",   // ✅ corrected
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,   // ✅ corrected
    email: false,
    password: false,
    confirmPassword: false,
  });

  // ---------------- VALIDATION ----------------
  const validateName = (username) => {
    if (!username.trim()) return "Name is required";
    if (username.length < 2) return "Name must be at least 2 characters";
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Confirm password is required";
    if (value !== formData.password) return "Passwords do not match";
    return "";
  };

  const getValidationError = (name, value) => {
    switch (name) {
      case "username":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return validateConfirmPassword(value);
      default:
        return "";
    }
  };

  const isFormValid = () =>
    !validateName(formData.username) &&
    !validateEmail(formData.email) &&
    !validatePassword(formData.password) &&
    !validateConfirmPassword(formData.confirmPassword);

  // ---------------- INPUT CHANGE ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: getValidationError(name, value),
      }));
    }

    if (error) setError("");
  };

  // ---------------- BLUR HANDLER ----------------
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: getValidationError(name, value),
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const errors = {
      username: validateName(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      setError("Please fix the errors before continuing.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const data = res.data;

      // Save user session manually
      const userData = {
        _id: data._id,
        username: data.username,
        email: data.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 shadow-xl">
          <div className="bg-cyan-50 rounded-2xl p-8">

            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                AI
              </div>

              <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
              <p className="mt-1 text-sm text-slate-600">Start managing invoices smarter.</p>
            </div>

            {success && <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-md">{success}</div>}
            {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">

              <InputField
                label="Full Name"
                icon={<User size={18} />}
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={fieldErrors.username}
                touched={touched.username}
                placeholder="John Doe"
              />

              <InputField
                label="Email"
                icon={<Mail size={18} />}
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={fieldErrors.email}
                touched={touched.email}
                placeholder="you@example.com"
              />

              <PasswordField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                error={fieldErrors.password}
                touched={touched.password}
              />

              <PasswordField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                error={fieldErrors.confirmPassword}
                touched={touched.confirmPassword}
              />

              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-medium shadow-md"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Create account <ArrowRight size={18} /> </>}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <button onClick={() => navigate("/login")} className="text-purple-600 font-medium hover:underline">
                Login
              </button>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

/* ---------------- INPUT COMPONENTS ---------------- */

const InputField = ({
  label,
  icon,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
      />
    </div>
    {error && touched && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  show,
  toggle,
  error,
  touched,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-full pl-10 pr-10 py-2.5 rounded-md border border-slate-300 focus:ring-2 focus:ring-purple-500 bg-white"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    {error && touched && <p className="text-sm text-red-600 mt-1">{error}</p>}
  </div>
);
