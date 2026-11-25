import { apiClient } from "../../../shared/api";

export const USER_QUERY_KEY = ["user", "me"];
export const USER_FRIENDS_QUERY_KEY = ["user", "friends"];


export async function fetchUser(userPublicId){
  const response = await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/users/${userPublicId}?include=profile&include=messages&include=groups&include=receivedRequests&include=sentRequests`)

  if(!response.ok){
    throw new Error("Failed to fetch user information");
  }

  return response.json();
}

export async function fetchUserFriends(userPublicId){
  const response = await apiClient(`${import.meta.env.VITE_API_URL}/api/v1/users/${userPublicId}/friends`)

  if(!response.ok){
    throw new Error("Failed to fetch user information");
  }

  return response.json();
}