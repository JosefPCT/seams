let onUnauthorizedCallback = null;

// Allows the app layer to inject a global 401 handler
export function setOnUnauthorized(callback){
  onUnauthorizedCallback = callback;
}

export async function apiClient(endpoint, options = {}){
  const response = await fetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Trigger global logout handler on 401, ignoring the initiail /me check
  if (response.status === 401 && endpoint !== `${import.meta.env.VITE_API_URL}/api/v1/users/me`){
    onUnauthorizedCallback?.();
  }

  return response;
}