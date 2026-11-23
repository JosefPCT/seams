import { useSession } from "../../../entities/session"
// import { useUser } from "../../../entities/user/index.js";
import { UserCard, UserChatGroupList, UserPendingRequestsList, UserFriendList } from "../../../entities/user";

export function DashboardPage() {

  const { user, isLoading, isError } = useSession();
  // const { user, isLoading, isError, error } = useUser(userMin.data.publicId)
  // console.log(user);

  if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>Error</div>
  }

  return (
    <main>
      Dashboard
      <UserCard userId={user.data.publicId}/>
      <UserChatGroupList userId={user.data.publicId} />
      <UserPendingRequestsList userId={user.data.publicId} />
      <h5>Friends</h5>
      <UserFriendList  userId={user.data.publicId} />
      {/* <h1>Hello, {user.data.addtl}</h1> */}
      {/* <p>{user && user.data.id}</p> */}
      {/* <p>{user.data.profile.name}</p> */}
    </main>
  )
}