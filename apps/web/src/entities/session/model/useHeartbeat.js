import { useQuery } from "@tanstack/react-query";
import { sendHeartbeat, HEARTBEAT_QUERY_KEY } from "../api/heartbeatApi";

export function useHeartbeat({ enabled = true }){
  return useQuery({
    queryKey:HEARTBEAT_QUERY_KEY,
    queryFn: sendHeartbeat,
    enabled, // If enabled is true, will only run the heartbeat fettch function when the user is logged in, pass the isAuthenticated boolean value here
    refetchInterval: 30_000, // Pings every 30 seconds (30,000 ms)
    refetchIntervalInBackground: true, // Keeps pinging event if the user switches tabs or minimizes the window
    notifyOnChangeProps: [], // Prevents ProtectedRoute from re-rendering on every ping
  })
}