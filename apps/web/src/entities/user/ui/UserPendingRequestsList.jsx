// Separated request lists to their own components (PendingReceivedRequestsList.jsx and PendingSentRequestsList.jsx)

// import { useUser } from "../model/useUser";
// import { UserPendingRequestListItem } from "./UserPendingRequestListItem";

// export function UserPendingRequestsList({ userId }) {
//   const { user, isLoading, isError, error } = useUser(userId);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (isError) {
//     return <div>Error...</div>;
//   }

//   return (
//     <>
//       <h2>Pending Requests</h2>
//       <h4>Received</h4>
//         <ul>
//             {user.data.receivedRequests?.filter((request) => request.status === "PENDING").map((request) => (
//             <UserPendingRequestListItem
//                 key={request.id}
//                 id={request.id}
//                 name={request.sender.profile ? request.sender.profile.name : request.receiver.email}
//                 // name={request.sender.profile?.name}
//                 sentAt={request.sentAt}
//                 isSentByCurrentUser={false}
//             />
//             ))}
//         </ul>
//       <h4>Sent</h4>
//         <ul>
//             {user.data.sentRequests?.filter((request) => request.status === "PENDING").map((request) => (
//             <UserPendingRequestListItem
//                 key={request.id}
//                 id={request.id}
//                 name={request.receiver.profile ? request.receiver.profile.name : request.receiver.email}
//                 // name={request.receiver.profile?.name}
//                 createdAt={request.sentAt}
//                 isSentByCurrentUser={true}
//             />
//             ))}
//         </ul>
//     </>
//   );
// }
