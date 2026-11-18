import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { isAuth } from "../../../../api/src/middleware/authMiddleware";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on initial load
  useEffect(() => {
    const checkSession = async () => {
        try {
          const response = await fetch("/api/v1/users/me", { credentials: "include"})
          if(response.ok){
            const userData = await response.json();
            setUser(userData);
          }
        } catch (error) {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
    }

    checkSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      credentials: "include"
    })

    if(!response.ok) throw new Error ("Login failed")
    const userData = await response.json();
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await fetch("api/v1/logout", { method: "POST", credentials: "include"})
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}