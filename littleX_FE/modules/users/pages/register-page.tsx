import { AuthLeftCol } from "@/ds/molecules/auth-left-col";
import { RegisterForm } from "@/ds/organisms/register-form";
import { TwoColumnTemplate } from "@/ds/templates/two-column-template";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Little X",
  description: "Create a new Little X account",
};

export default function RegisterPage() {
  return (
    <TwoColumnTemplate
      rightColumn={<RegisterForm />}
      leftColumn={<AuthLeftCol />}
    />
  );
}
