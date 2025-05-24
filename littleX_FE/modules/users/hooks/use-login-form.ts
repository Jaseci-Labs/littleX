"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/modules/users/hooks/use-auth";
import { loginFormSchema, LoginFormValues } from "../schemas/login-schema";
import { useRouter } from "next/navigation";
import useAppNavigation from "@/_core/hooks/useAppNavigation";
import { APP_ROUTES } from "@/_core/keys";
import { useEffect } from "react";

interface UseLoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: UseLoginFormProps = {}) {
  const { login, isAuthenticated, isLoading, initialCheckComplete, error } =
    useAuth();
  const router = useAppNavigation();

  useEffect(() => {
    if (initialCheckComplete && !isLoading && isAuthenticated) {
      router.navigate(APP_ROUTES.HOME);
    }
  }, [isLoading, isAuthenticated, router, initialCheckComplete]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await login(values.email, values.password);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
  };
}
