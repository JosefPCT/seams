export function UserChatGroupListItem({ id, name, createdAt }){
  return(
    <li>
        <h3>{name}</h3>
        <p>Group id: {id}</p>
        <p>Group created: {createdAt}</p>
    </li>
  )
}