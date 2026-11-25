import { useOnlineUsers } from "../../../entities/online-users";
import { OnlineUserListItem } from "./OnlineUserListItem";

export function OnlineUserList({ userId }) {
  const { onlineUsers, isLoading, isError } = useOnlineUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  // Makes sure to filter out the current user from the online users list
  return(
    <ul>
      {onlineUsers.result.filter((onlineUser) => onlineUser.publicId !== userId).map((onlineUser)=> (
        <OnlineUserListItem key={onlineUser.id} id={onlineUser.publicId} name={onlineUser.email} />
      ))}
    </ul>
  )
}
