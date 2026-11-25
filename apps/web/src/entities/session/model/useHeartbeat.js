import { useQuery } from "@tanstack/react-query";
import { fetchHeartbeat, HEARTBEAT_QUERY_KEY } from "../api/heartbeatApi";

export function useHeartbeat({ enabled = true }){
  return useQuery({
    queryKey:HEARTBEAT_QUERY_KEY,
    queryFn: fetchHeartbeat,
    enabled,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    notifyOnChangeProps: [], // Prevents ProtectedRoute from re-rendering on every ping
  })
}