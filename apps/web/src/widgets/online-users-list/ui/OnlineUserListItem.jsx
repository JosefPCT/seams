export function OnlineUserListItem({ id, name }){
  return(
    <li>
        <h3>{name}</h3>
        <p>Group id: {id}</p>
    </li>
  )
}