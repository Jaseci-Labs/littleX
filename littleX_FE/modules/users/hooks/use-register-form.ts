"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/modules/users/hooks/use-auth";
import {
  registerFormSchema,
  RegisterFormValues,
} from "../schemas/register-schema";
import { APP_ROUTES } from "@/_core/keys";
import useAppNavigation from "@/_core/hooks/useAppNavigation";
import { useEffect } from "react";

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const {
    register: registerUser,
    isLoading,
    initialCheckComplete,
    isAuthenticated,
    error,
  } = useAuth();

  const router = useAppNavigation();

  useEffect(() => {
    if (initialCheckComplete && !isLoading && isAuthenticated) {
      router.navigate(APP_ROUTES.HOME);
    }
  }, [isLoading, isAuthenticated, router, initialCheckComplete]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await registerUser(values.email, values.password);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    isLoading,
    error,
    onSubmit,
  };
}
