import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if(isLoading){
    return <div>Loading session...</div>
  }

//   return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />
return isAuthenticated ? <div> Authenticated! </div> :<div>Not Authenticated</div>
}