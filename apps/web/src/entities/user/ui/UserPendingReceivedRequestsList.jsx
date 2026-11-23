import { useUser } from "../model/useUser";
import { UserPendingRequestListItem } from "./UserPendingRequestListItem";

export function UserPendingReceivedRequestsList({ userId }) {
  const { user, isLoading, isError, error } = useUser(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <ul>
      {user.data.receivedRequests?.filter((request) => request.status === "PENDING").map((request) => (
        <UserPendingRequestListItem
         key={request.id}
         id={request.id}
         name={request.sender.profile ? request.sender.profile.name : request.receiver.email}
          // name={request.sender.profile?.name}
         sentAt={request.sentAt}
         isSentByCurrentUser={false}
       />
       ))}
    </ul>
  );
}
