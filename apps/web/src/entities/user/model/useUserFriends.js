import { useQuery } from "@tanstack/react-query";
import { fetchUserFriends, USER_FRIENDS_QUERY_KEY } from "../api/userApi";

export function useUserFriends(userPublicId){
  const { data: userFriends = null, isLoading, isError, error } = useQuery({
    queryKey: [...USER_FRIENDS_QUERY_KEY, userPublicId],
    queryFn: () => fetchUserFriends(userPublicId),
    enabled: Boolean(userPublicId),
  })

  return{
    userFriends,
    isLoading,
    isError,
    error,
  }
}