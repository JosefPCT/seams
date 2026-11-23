import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "../../../../entities/session";

import { apiClient } from "../../../../shared/api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok){
        throw new Error("Invalid email or password");
      }

      return response.json();
    },
    onSuccess: async (userData) => {
      await queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY });

      // Write directly to cache if /login returns the user object
      if (userData?.id){
        console.log("Writing directly to cachee...");
        queryClient.setQueryData(SESSION_QUERY_KEY, userData);
      } else {
        console.log("Triggering invalidation for login");
        // Otherwise trigger /api/v1/me to refetch
        await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
      }
    }
  })
}