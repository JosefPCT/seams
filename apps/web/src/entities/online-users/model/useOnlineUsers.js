import { useQuery } from "@tanstack/react-query";
import { fetchOnlineUsers, ONLINE_USERS_QUERY_KEY } from "../api/onlineUsersApi";

export function useOnlineUsers(){
  const { data: onlineUsers = null, isLoading, isError, error } = useQuery({
    queryKey: ONLINE_USERS_QUERY_KEY,
    queryFn: fetchOnlineUsers,
  })
  

  return{
    onlineUsers,
    isLoading,
    isError,
    error,
  }
}