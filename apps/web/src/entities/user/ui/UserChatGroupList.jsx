import { useUser } from "../model/useUser";
import { UserChatGroupListItem } from "./UserChatGroupListItem";

export function UserChatGroupList({ userId }) {
  const { user, isLoading, isError, error } = useUser(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <ul>
      {user.data.groups?.map((group)=> (
        <UserChatGroupListItem key={group.group.id} id={group.group.id} name={group.group.name} createdAt={group.group.createdAt}/>
      ))}
    </ul>
  );
}
