"use client";

import useAppNavigation from "@/_core/hooks/useAppNavigation";
import { useEffect, useCallback } from "react";
import { AuthService } from "../auth-service";
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import {
  setUser,
  resetSuccess,
  setLoading,
  setInitialCheckComplete,
} from "@/store/userSlice";
import {
  changePassword,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../userActions";

export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    user,
    success,
    successMessage,
    error,
    initialCheckComplete,
    isLoading,
  } = useAppSelector((state) => state.users);
  const router = useAppNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true));
      const currentUser = AuthService.getCurrentUser();
      dispatch(setUser(currentUser));
      dispatch(setLoading(false));
      dispatch(setInitialCheckComplete());
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      if (successMessage === "Login successful") {
        router.navigate("/");
      } else if (successMessage === "Registration successful") {
        router.navigate("/auth/login");
      } else if (successMessage === "Logout successful") {
        router.navigate("/auth/login");
      }
      dispatch(resetSuccess());
    }
  }, [success, successMessage, router, dispatch]);

  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(loginUser({ email, password }));
    },
    [dispatch]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      dispatch(registerUser({ email, password }));
    },
    [dispatch]
  );

  const change_password = useCallback(
    async (currentPassword: string, newPassword: string) => {
      dispatch(changePassword({ currentPassword, newPassword }));
    },
    [dispatch]
  );

  const forgot_password = useCallback(
    async (email: string) => {
      dispatch(forgotPassword(email));
    },
    [dispatch]
  );

  const reset_password = useCallback(
    async (token: string, password: string) => {
      dispatch(resetPassword({ token, password }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(logoutUser());
  }, [dispatch]);

  return {
    login,
    register,
    logout,
    isLoading: isLoading,
    error: error,
    data: user,
    success: success,
    successMessage: successMessage,
    change_password,
    forgot_password,
    reset_password,
    isAuthenticated: !!user,
    initialCheckComplete: initialCheckComplete,
  };
}
