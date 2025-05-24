import { AuthLeftCol } from "@/ds/molecules/auth-left-col";
import { LoginForm } from "@/ds/organisms/login-form";
import { TwoColumnTemplate } from "@/ds/templates/two-column-template";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Little X",
  description: "Login to your Little X account",
};

export default function LoginPage() {
  return (
    <TwoColumnTemplate
      rightColumn={<LoginForm />}
      leftColumn={<AuthLeftCol />}
    />
  );
}
