import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "../../../../entities/session";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
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
    onSuccess: (userData) => {
      // Write directly to cache if /login returns the user object
      if (userData?.id){
        queryClient.setQueryData(SESSION_QUERY_KEY, userData);
      } else {
        // Otherwise trigger /api/v1/me to refetch
        queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
      }
    }
  })
}