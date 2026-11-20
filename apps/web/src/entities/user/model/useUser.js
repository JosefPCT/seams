import { useQuery } from "@tanstack/react-query";
import { fetchUser, USER_QUERY_KEY } from "../api/userApi";

export function useUser(userPublicId){
  const { data: user = null, isLoading, isError, error } = useQuery({
    queryKey: [...USER_QUERY_KEY, userPublicId],
    queryFn: () => fetchUser(userPublicId),
    enabled: Boolean(userPublicId),
  })

  return{
    user,
    isLoading,
    isError,
    error,
  }
}