import { useOnlineUsers } from "../../../entities/online-users";
import { useUserFriends } from "../../../entities/user";
import { OnlineFriendListItem } from "./OnlineFriendListItem";

export function OnlineFriendsList({ userId }) {
  const { onlineUsers, isLoading, isError } = useOnlineUsers();
  const { userFriends, isLoading: isUserFriendsLoading, isError : isUserFriendsError} = useUserFriends(userId);

  if (isLoading || isUserFriendsLoading) {
    return <div>Loading...</div>;
  }

  if (isError || isUserFriendsError) {
    return <div>Error...</div>;
  }

  // Makes sure to filter out the current user from the online users list
  return(
    <ul>
      {onlineUsers.result.filter((onlineUser) => onlineUser.publicId !== userId && userFriends.data.some((friend) => friend.id === onlineUser.publicId)).map((onlineUser)=> (
        <OnlineFriendListItem key={onlineUser.id} id={onlineUser.publicId} name={onlineUser.email} />
      ))}
    </ul>
  )
}
