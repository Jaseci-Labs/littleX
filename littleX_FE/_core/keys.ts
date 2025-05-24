export const APP_KEYS = {
  TOKEN: "TOKEN",
  USER: "USER",
  NOTIFICATIONS: "NOTIFICATIONS",
};

export const APP_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  HOME: "/",
  TASKS: "/tasks",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

export type AppKey = (typeof APP_KEYS)[keyof typeof APP_KEYS];
