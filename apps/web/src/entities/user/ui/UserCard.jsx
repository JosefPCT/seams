import { useUser } from "../model/useUser";

export function UserCard({userId}){
  const { user, isLoading, isError, error } = useUser(userId)

  if(isLoading){
    return <div>Loading...</div>
  }

  if(isError){
    return <div>Error...</div>
  }

  return(
    <div>
      <p>Hello, {user.data.profile.name}</p>
      <p>{user.data.profile.pronouns}</p>
    </div>
  )
}