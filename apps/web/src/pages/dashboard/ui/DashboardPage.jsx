import { useSession } from "../../../entities/session"
import { useUser } from "../../../entities/user/index.js";

export function DashboardPage() {

  const { user: userMin } = useSession();
  const { user, isLoading, isError, error } = useUser(userMin.data.publicId)
  console.log(user);

  if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>Error: {error.message}</div>
  }

  return (
    <main>
      Dashboard
      <h1>Hello, {user.data.addtl}</h1>
      <p>{user && user.data.id}</p>
      <p>{user.data.profile.name}</p>
    </main>
  )
}