import { useUser } from "../model/useUser";
import { UserPendingRequestListItem } from "./UserPendingRequestListItem";

export function UserPendingSentRequestsList({ userId }) {
  const { user, isLoading, isError, error } = useUser(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <ul>
        {user.data.sentRequests?.filter((request) => request.status === "PENDING").map((request) => (
        <UserPendingRequestListItem
            key={request.id}
            id={request.id}
            name={request.receiver.profile ? request.receiver.profile.name : request.receiver.email}
            // name={request.receiver.profile?.name}
            createdAt={request.sentAt}
            isSentByCurrentUser={true}
        />
        ))}
    </ul>
  );
}
