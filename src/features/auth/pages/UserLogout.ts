import { useAuth } from "@/hooks/useAuth";

export function useUserLogout() {
  const { logout } = useAuth();
  return { logout };
}
