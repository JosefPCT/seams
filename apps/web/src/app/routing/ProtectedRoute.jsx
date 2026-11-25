import { Navigate, Outlet, useLocation } from "react-router";
import { useSession, useHeartbeat } from "../../entities/session";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSession();
  const location = useLocation();

  // Only polls while the user is authenticated and inside a protected route
  useHeartbeat({ enabled: isAuthenticated });

  if (isLoading){
    return <div>Loading session...</div>
  }


  if(!isAuthenticated){
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return <Outlet />

    // return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />
  // return isAuthenticated ? <div> Authenticated! </div> :<div>Not Authenticated</div>
}