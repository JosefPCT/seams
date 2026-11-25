import { apiClient } from "../../../shared/api";

export const ONLINE_USERS_QUERY_KEY = ["online-users"];

export async function fetchOnlineUsers(){
  console.log("Fetching online users...");
  const response = await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/users/online`)

  if(!response.ok){
    throw new Error("Failed to fetch user information");
  }

  return response.json();
}