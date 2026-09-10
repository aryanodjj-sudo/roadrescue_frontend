import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: if a token exists, verify it against the backend and
  // restore the session. If the token is invalid/expired, clear it.
  useEffect(() => {
    const token = localStorage.getItem("roadrescue_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("roadrescue_token");
        localStorage.removeItem("roadrescue_user");
      })
      .finally(() => setLoading(false));
  }, []);

  // Real backend login — POST /api/auth/login
  const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("roadrescue_token", data.token);
    localStorage.setItem("roadrescue_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Real backend register — POST /api/auth/register
  const register = async ({ name, email, password, role }) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    localStorage.setItem("roadrescue_token", data.token);
    localStorage.setItem("roadrescue_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("roadrescue_token");
    localStorage.removeItem("roadrescue_user");
    setUser(null);
  };

  // Real backend profile update — PUT /api/users/profile
  const updateUser = async (updates) => {
    const { data } = await api.put("/users/profile", updates);
    setUser((prev) => {
      const updated = { ...prev, ...data.user };
      localStorage.setItem("roadrescue_user", JSON.stringify(updated));
      return updated;
    });
    return data.user;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}