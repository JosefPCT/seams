import { useUser } from "../model/useUser";
import { UserFriendListItem } from "./UserFriendListItem";

export function UserFriendList({ userId }) {
  const { user, isLoading, isError, error } = useUser(userId);

//   const friendList = [].concat(user.data.receivedRequests?.filter((request) => request.status === "ACCEPTED"), user.data.sentRequests?.filter((request) => request.status === 'ACCEPTED'))

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return(
    <ul>
      {[].concat(user.data.receivedRequests?.filter((request) => request.status === "ACCEPTED"), user.data.sentRequests?.filter((request) => request.status === 'ACCEPTED')).map((friend) => (
        <UserFriendListItem 
          key={friend.receiver ? friend.receiver.id : friend.sender.id }
          id={friend.receiver ? friend.receiver.id : friend.sender.id}
          name={friend.receiver ? friend.receiver.profile?.name || friend.receiver.email : friend.sender.profile?.name || friend.sender.email}
        />
      ))}
    </ul>
  )
}
