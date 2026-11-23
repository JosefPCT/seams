export function UserFriendListItem({ id, name }){
  return(
    <li>
        <h3>{name}</h3>
        <p>Friend User id: {id}</p>
    </li>
  )
}