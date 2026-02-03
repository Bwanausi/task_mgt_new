import { createContext, useContext, useState } from "react";

// Create context
const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(
      JSON.parse(localStorage.getItem("user"))
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
      <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
      </AuthContext.Provider>
  );
}

// Named export for consuming context
export const useAuth = () => useContext(AuthContext);
