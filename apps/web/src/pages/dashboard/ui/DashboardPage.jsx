import { useSession } from "../../../entities/session"
// import { useUser } from "../../../entities/user/index.js";
import { UserCard, UserChatGroupList, UserPendingReceivedRequestsList, UserPendingSentRequestsList, UserFriendList } from "../../../entities/user";
import { OnlineUserList } from "../../../widgets/online-users-list";
import { OnlineFriendsList } from "../../../widgets/online-friends-list";
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
      <h5>Chat Groups</h5>
        <UserChatGroupList userId={user.data.publicId} />
      <h5>Friend Requests</h5>
      <h5>Received</h5>
        <UserPendingReceivedRequestsList userId={user.data.publicId} />
      <h5>Sent</h5>
        <UserPendingSentRequestsList userId={user.data.publicId} />
      <h5>Friends</h5>
        <UserFriendList  userId={user.data.publicId} />
      <h5>Online-Users</h5>
        <OnlineUserList userId={user.data.publicId} />
      {/* <h1>Hello, {user.data.addtl}</h1> */}
      {/* <p>{user && user.data.id}</p> */}
      {/* <p>{user.data.profile.name}</p> */}
      <h5>Online-Friends</h5>
        <OnlineFriendsList userId={user.data.publicId} />
    </main>
  )
}