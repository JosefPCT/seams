import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setOnUnauthorized } from "../../shared/api";
import { SESSION_QUERY_KEY } from "../../entities/session";

const queryClient = new QueryClient();

export function QueryProvider({ children }) {
  useEffect(() => {
    setOnUnauthorized(() => {
      // Immediately clear the cached user, which triggers ProtectedRoute to redirect
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
  )
}