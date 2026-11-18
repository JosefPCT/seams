// This file holds the things needed for the custom hook `useSession` that uses Tanstack query

// Exports the query key (enables to invalidate the tanstack query to be used outside of its file)
export const SESSION_QUERY_KEY = ["session", "me"];

// The fetch function to get the user data from `/api/v1/me`, which will be used on the the `useQuery` of Tanstack in `useSession` custom hook
export async function fetchSession() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, {
    credentials: "include"
  });

  // Treat 401 as unauthenticated (null) rather than a network error
  if (response.status === 401){
    return null;
  }

  if(!response.ok){
    throw new Error("Failed to fetch user session");
  }

  return response.json();
}