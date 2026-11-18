// The custom hook which uses Tanstack to get user data from `/api/v1/users/me`, can be retriggered if the SESSION_QUERY_KEY is invalidated
// Returns several useful things to use for the whole app

import { useQuery } from "@tanstack/react-query";
import { fetchSession, SESSION_QUERY_KEY } from "../api/sessionApi.js";

export function useSession() {
  const { data: user = null, isLoading, isError } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 5, // Keep user data fresh for 5 minutes
    retry: false, // Do not retry on 401/unauthenticated states
  });

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    isError,
  }
}