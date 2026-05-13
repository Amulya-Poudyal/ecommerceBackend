"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { authApi } from "@/lib/api/auth";


export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout: storeLogout } = useAuthStore();
  const resetCart = useCartStore((s) => s.reset);
  const fetchCart = useCartStore((s) => s.fetchCart);

  // Hydrate user on mount if cookie exists but store is empty
  useEffect(() => {
    if (!user) {
      setLoading(true);
      authApi
        .meClient()
        .then((u) => {
          setUser(u);
          fetchCart();
        })
        .catch(() => {
          // Not authenticated — ignore
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    storeLogout();
    resetCart();
  }, [storeLogout, resetCart]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin ?? false,
    logout,
    setUser,
  };
}
