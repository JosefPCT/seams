export function OnlineFriendListItem({ id, name }){
  return(
    <li>
        <h3>{name}</h3>
        <p>Friend id: {id}</p>
    </li>
  )
}