import { Navigate, Outlet } from "react-router";
import { useSession } from "../../entities/session";

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useSession();

  if (isLoading){
    return <div>Loading session...</div>
  }


  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet/>
  // return isAuthenticated ? <div> Authenticated! </div> :<div>Not Authenticated</div>
}