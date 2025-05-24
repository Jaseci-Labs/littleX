"use client";

import type React from "react";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/modules/users/hooks/use-auth";
import { APP_ROUTES } from "@/_core/keys";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, initialCheckComplete } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialCheckComplete && !isLoading && !isAuthenticated) {
      router.push(APP_ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router, initialCheckComplete]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
