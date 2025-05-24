import RegisterPage from "@/modules/users/pages/register-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Little X",
  description: "Create a new Little X account",
};

export default function Register() {
  return <RegisterPage />;
}
