import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

// Define comprehensive return type
type UseAppNavigationReturn = {
  navigate: (route: string, params?: object) => void;
  goBack: () => void;
  goForward: () => void;
  replace: (route: string, params?: object) => void;
  prefetch: (route: string) => void;
  refresh: () => void;
  getCurrentPath: () => string;
  getQueryParams: () => Record<string, string | string[] | undefined>;
  isActive: (route: string, exact?: boolean) => boolean;
  pushWithScroll: (route: string, params?: object, scroll?: boolean) => void;
};

const useAppNavigation = (): UseAppNavigationReturn => {
  const router = useRouter();

  // Navigate to a route (push to history)
  const navigate = useCallback(
    (route: string, params?: object) => {
      if (params) {
        const queryString = new URLSearchParams(params as any).toString();
        router.push(`${route}?${queryString}`);
      } else {
        router.push(route);
      }
    },
    [router]
  );

  // Replace current route (no history entry)
  const replace = useCallback(
    (route: string, params?: object) => {
      if (params) {
        const queryString = new URLSearchParams(params as any).toString();
        router.replace(`${route}?${queryString}`);
      } else {
        router.replace(route);
      }
    },
    [router]
  );

  // Navigate back in history
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  // Navigate forward in history
  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  // Prefetch a route for faster navigation
  const prefetch = useCallback(
    (route: string) => {
      router.prefetch(route);
    },
    [router]
  );

  // Refresh current page (revalidate data)
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  // Get current pathname
  const getCurrentPath = useCallback(() => {
    return typeof window !== "undefined" ? window.location.pathname : "/";
  }, []);

  // Get current query parameters
  const getQueryParams = useCallback(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const query: Record<string, string | string[] | undefined> = {};

    for (const [key, value] of params.entries()) {
      if (params.getAll(key).length > 1) {
        query[key] = params.getAll(key);
      } else {
        query[key] = value;
      }
    }
    return query;
  }, []);

  // Check if a route is active
  const isActive = useCallback(
    (route: string, exact: boolean = false) => {
      const currentPath = getCurrentPath();
      if (exact) {
        return currentPath === route;
      }
      return currentPath.startsWith(route);
    },
    [getCurrentPath]
  );

  // Navigate with scroll control
  const pushWithScroll = useCallback(
    (route: string, params?: object, scroll: boolean = true) => {
      if (params) {
        const queryString = new URLSearchParams(params as any).toString();
        router.push(`${route}?${queryString}`, { scroll });
      } else {
        router.push(route, { scroll });
      }
    },
    [router]
  );

  return {
    navigate,
    goBack,
    goForward,
    replace,
    prefetch,
    refresh,
    getCurrentPath,
    getQueryParams,
    isActive,
    pushWithScroll,
  };
};

export default useAppNavigation;
