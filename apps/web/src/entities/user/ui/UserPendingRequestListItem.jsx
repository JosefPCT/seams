export function UserPendingRequestListItem({ id, name, sentAt, isSentByCurrentUser }){
  return(
    <li>
        <h3>{name}</h3>
        <p>Request id: {id}</p>
        <p>Request created: {sentAt}</p>
        {isSentByCurrentUser ? 
          <div>
            <button>Cancel Request</button>
          </div> : 
          <div>
            <button>Accept</button> 
            <button>Ignore</button>
          </div>
          }
        {}
    </li>
  )
}