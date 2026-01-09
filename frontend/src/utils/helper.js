const validateEmail = (email) => {
  if (!email) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Enter a valid email address";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password must be at least 6 characters";
  return "";
};

const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return "";
};

const validateConfirmPassword = (confirmPassword, password) => {
if (!confirmPassword) return "Please confirm your password";
if (confirmPassword !== password) return "Passwords do not match";
return "";
}

export { validateName, validateEmail, validatePassword,validateConfirmPassword };
