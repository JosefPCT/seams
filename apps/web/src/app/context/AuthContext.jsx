
// Using React Context + Tanstack Query
// import { createContext, useContext, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const AuthContext = createContext(null);

// // Reusable query key so profile mutations elsewhere can invalidate it
// export const AUTH_QUERY_KEY = ["auth", "me"];

// const apiUrl = import.meta.env.VITE_API_URL;

// async function fetchMe() {
//   const response = await fetch(`${apiUrl}/api/v1/users/me`, { credentials: "include" })

//   // Return null instead of throwing on 401 so Tanstack Query treats "logged out" as a valid state
//   if (response.status === 401) return null;
//   if (!response.ok) throw new Error ("Failed to fech user session")

//   return response.json();
// }

// export function AuthProvider({ children }) {
//   const queryClient = useQueryClient();

//   const { data: user = null, isLoading }  = useQuery({
//     queryKey: AUTH_QUERY_KEY,
//     queryFn: fetchMe,
//     staleTime: 1000 * 60 * 5, // Keep user data fresh for 5 minutes
//     retry: false, // Don't retry if the user is unauthenticated
//   });

//   const loginMutation = useMutation({
//     mutationFn: async (credentials) => {
//       const response = await fetch(`${apiUrl}/api/v1/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//         credentials: "include",
//       });
//       if (!response.ok) throw new Error("Login failed");
//       return response.json();
//     },
//     onSuccess: (userData) => {
//       // Option A: If /login returns the user object, write it straight to cache (0 extra requests)
//       if (userData?.id){
//         queryClient.setQueryData(AUTH_QUERY_KEY, userData);
//       } else {
//         // Option B: If /login only sets a cookie, tell TanStack Query to refetch /api/v1/me
//         queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
//       }
//     }
//   })

//   const logoutMutation = useMutation({
//     mutationFn: async() => {
//       await fetch(`${apiUrl}/api/v1/logout`, {
//         method: "POST",
//         credentials: "include"
//       })
//     },
//     onSuccess: () => {
//       // Immediately clear user from cache and cancel any in-flight /me requests
//       queryClient.setQueryData(AUTH_QUERY_KEY, null);
//       queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY, exact: true})
//     }
//   })

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated: Boolean(user),
//       isLoading,
//       login: loginMutation.mutateAsync,
//       isLoggingIn: loginMutation.isPending,
//       logout: logoutMutation.mutateAsync,
//     }),
//     [user, isLoading, loginMutation.mutateAsync, loginMutation.isPending, logoutMutation.mutateAsync]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth(){
//   const context = useContext(AuthContext);
//   if (!context){
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context;
// }

// _______________________________________


// Using React Context + Custom Hook
// import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
// import { isAuth } from "../../../../api/src/middleware/authMiddleware";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Restore session on initial load
//   useEffect(() => {
//     const checkSession = async () => {
//         try {
//           const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/me`, { credentials: "include"})
//           if(response.ok){
//             const userData = await response.json();
//             setUser(userData);
//           }
//         } catch (error) {
//           setUser(null);
//         } finally {
//           setIsLoading(false);
//         }
//     }

//     checkSession();
//   }, []);

//   const login = useCallback(async (credentials) => {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(credentials),
//       credentials: "include"
//     })

//     if(!response.ok) throw new Error ("Login failed")
//     const userData = await response.json();
//     setUser(userData)
//   }, [])

//   const logout = useCallback(async () => {
//     await fetch(`${import.meta.env.VITE_API_URL}/api/v1/logout`, { method: "POST", credentials: "include"})
//     setUser(null);
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       isAuthenticated: Boolean(user),
//       isLoading,
//       login,
//       logout
//     }),
//     [user, isLoading, login, logout]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// }