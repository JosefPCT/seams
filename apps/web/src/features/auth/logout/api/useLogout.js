import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "../../../../entities/session";

import { apiClient } from "../../../../shared/api";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async() => {
      await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/logout`, {
        method: "POST",
        credentials: "include",
      })
    },
    onSuccess: async() => {
      await queryClient.cancelQueries({ queryKey: SESSION_QUERY_KEY });
      queryClient.setQueryData(SESSION_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY, exact: true })
    }
  })
}