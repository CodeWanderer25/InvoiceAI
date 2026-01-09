import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ---------- CUSTOM HOOK ----------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

// ---------- PROVIDER ----------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // { _id, username, email }
  const [token, setToken] = useState(null);    // JWT token
  const [loading, setLoading] = useState(true);

  // -------- Restore session on refresh --------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let parsedUser = null;

    // Safe JSON parse
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.warn("Invalid stored user JSON → clearing storage...");
      localStorage.removeItem("user");
    }

    if (storedToken && parsedUser) {
      setToken(storedToken);
      setUser(parsedUser);
    }

    setLoading(false);
  }, []);

  // -------- LOGIN --------
  const login = (userData, tokenValue) => {
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(tokenValue);
    setUser(userData);
  };

  // -------- LOGOUT --------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  // -------- UPDATE PROFILE --------
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
