"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signOut = async () => {
    try {
      await axios.post("/api/auth/signout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Error signing out", err);
    }
  };

  return { user, loading, isAuthenticated: !!user, signOut };
}
