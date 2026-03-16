import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/features/auth/api/LoginAPI";
import { checkStatusAPI } from "@/features/auth/api/CheckStatusAPI";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";
import type { LoginRequest, LoginResponse } from "@/features/auth/schemas/types";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

type AuthUser = LoginResponse["data"];

type AuthProviderProps = {
  children: ReactNode;
};
  // Inactivity Settings
const INACTIVITY_MINUTES = 30;
const INACTIVITY_TIMEOUT = INACTIVITY_MINUTES * 60 * 1000;

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginRequest) => {
    try {
      // Clear EVERYTHING before starting a new session
      queryClient.clear();
      localStorage.clear();
      
      const data: LoginResponse = await loginApi(credentials);
      
      // Store new token and user data
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.data);

      toast.success("Session started successfully");
      
      // Navigate and replace history to ensure a clean state
      navigate("/visits", { replace: true });
      
      // Optional: force page reload to guarantee a fully clean state
      // window.location.href = "/ctpats";
    } catch (error) {
      toast.error("Login failed");
      throw error;
    }
  };

  const logout = useCallback(() => {
    // 1. Clear ALL cached queries
    queryClient.clear();
    
    // 2. Clear local state
    setUser(null);
    setToken(null);
    
    // 3. Clear localStorage
    localStorage.removeItem("token");
    // Or clear everything: localStorage.clear();
    
    // 4. Navigate to login and replace history
    navigate("/login", { replace: true });
    
    // 5. CRITICAL: Force page reload to clear ALL in-memory state
    // This guarantees that no residual data remains
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  }, [navigate, queryClient]);

  // Check existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await checkStatusAPI();
        setUser(data.data);
      } catch (error) {
        // If the token is invalid, perform a full logout
        console.error("Invalid session:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [token, logout]);

  // Auto logout after inactivity
  useEffect(() => {
    if (!token) return;

    let timeoutId: number;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        toast.warning("Session closed due to inactivity", {
          autoClose: 3000,
        });
        logout();
      }, INACTIVITY_TIMEOUT); // Automatically logs out after 30 minutes of inactivity
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize inactivity timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [token, logout]);

  const value: AuthContextType = { 
    user, 
    token, 
    login, 
    logout, 
    loading 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
