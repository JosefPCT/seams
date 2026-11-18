import { Navigate, Outlet } from "react-router";
import { useSession } from "../../entities/session";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading){
    return <div>Loading session...</div>
  }

  //   return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />
  return isAuthenticated ? <div> Authenticated! </div> :<div>Not Authenticated</div>
}