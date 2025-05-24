import LoginPage from "@/modules/users/pages/login-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Little X",
  description: "Login to your Little X account",
};

export default function Login() {
  return <LoginPage />;
}
