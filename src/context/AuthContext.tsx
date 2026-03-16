import { createContext } from "react";
import type { LoginRequest, LoginResponse } from "@/features/auth/schemas/types";

type AuthUser = LoginResponse["data"];

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
