import axios from "axios";
import { APP_KEYS } from "./keys";

// Get the API URL from environment variables
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create a basic axios instance for user API calls (no auth)
export const public_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create an axios instance for walker API calls (with auth)
export const private_api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach Bearer token from localStorage
private_api.interceptors.request.use(
  (config) => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const token_obj = localStorage.getItem(APP_KEYS.TOKEN);
      const token = token_obj ? JSON.parse(token_obj)?.value : null;
      if (token) {
        // TOOD:
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
const handleResponseError = (error: any) => {
  if (error.response) {
    // Handle specific error status codes
    if (error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Could redirect to login page here
      }
    }
  }
  return Promise.reject(error);
};

public_api.interceptors.response.use(
  (response) => response,
  handleResponseError
);
private_api.interceptors.response.use(
  (response) => response,
  handleResponseError
);


