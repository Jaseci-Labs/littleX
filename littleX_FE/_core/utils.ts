import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppKey } from "./keys";

interface StorageItem<T> {
  value: T;
  timestamp: number;
  expires?: number; // Optional expiration in milliseconds
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const localStorageUtil = {
  // Set item with optional expiration
  setItem: <T>(key: AppKey, value: T, expires?: number): void => {
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expires,
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
    }
  },

  // Get item with type safety
  getItem: <T>(key: AppKey): T | null => {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);

      // Check if item has expired
      if (item.expires && Date.now() > item.timestamp + item.expires) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return null;
    }
  },

  // Remove item
  removeItem: (key: AppKey): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  },

  // Clear all storage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },

  // Check if key exists
  hasItem: (key: AppKey): boolean => {
    return localStorage.getItem(key) !== null;
  },
};
