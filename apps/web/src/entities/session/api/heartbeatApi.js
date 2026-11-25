// This file holds the things needed for the custom hook `useHeartbeat` that uses Tanstack query
import { apiClient } from "../../../shared/api";

// Exports the query key (enables to invalidate the tanstack query to be used outside of its file)
export const HEARTBEAT_QUERY_KEY = ["session", "heartbeat"];

// The fetch function to post to `api/v1/heartbeat` and update the `lastSeen` field of a user
export async function sendHeartbeat() {
  const response = await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/heartbeat`, { method: 'POST'});

  // Treat 401 as unauthenticated (null) rather than a network error
  if (response.status === 401){
    return null;
  }

  if(!response.ok){
    throw new Error("Failed to update the heartbeat");
  }

  return response.json();
}