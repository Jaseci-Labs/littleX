import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "./auth-service";

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.login({ email, password });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await AuthService.register({
        email,
        password,
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to register"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to logout"
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "user/checkStatus",
  async () => {
    const currentUser = AuthService.getCurrentUser();
    return currentUser;
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      await AuthService.changePassword(currentPassword, newPassword);
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await AuthService.forgotPassword(email);
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to send reset email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      await AuthService.resetPassword(token, password);
      return null;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  }
);
