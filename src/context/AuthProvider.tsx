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
  const [permissions, setPermissions] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("permissions") ?? "[]")
    } catch {
      return []
    }
  });
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
      const userPermissions = data.data.permissions ?? []
      setPermissions(userPermissions);
      localStorage.setItem("permissions", JSON.stringify(userPermissions));

      // Redirigir al primer módulo accesible según permisos
      const NAV_ORDER = [
        { permission: "visits:view",      path: "/visits" },
        { permission: "reports:view",     path: "/report" },
        { permission: "visitors:view",    path: "/visitor" },
        { permission: "users:view",       path: "/user" },
        { permission: "roles:view",       path: "/role" },
        { permission: "agents:view",      path: "/agent" },
        { permission: "companies:view",   path: "/company" },
        { permission: "departments:view", path: "/department" },
      ];
      const firstRoute = NAV_ORDER.find(r => userPermissions.includes(r.permission));
      navigate(firstRoute?.path ?? "/403", { replace: true });
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
    setPermissions([]);

    // 3. Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");

    // 4. Navigate to login and replace history
    navigate("/login", { replace: true });

    // 5. CRITICAL: Force page reload to clear ALL in-memory state
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
        const freshPermissions = data.data.permissions ?? []
        setPermissions(freshPermissions);
        localStorage.setItem("permissions", JSON.stringify(freshPermissions));
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
    permissions,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
