// Create Prisma Objects (data, select, where)
export const prepareFriendRequestDataObj = (receiverId, senderId, status) => {
  console.log(`Receiver Id: ${receiverId}`);
  console.log(`Sender id: ${senderId}`);
  console.log(`Status: ${status}`)
  return {
    receiverId: receiverId,
    senderId: senderId,
    status: status ? status : 'PENDING'
  }
}

export const prepareFriendRequestSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    status: true,
    sentAt: true,
    updatedAt: true,
    sender: targetArray.includes("sender")
      ? {
          select: {
            publicId: true,
            email: true,
            addtl: true
            // Can also include nested relation of this relation
          },
        }
      : undefined,
    receiver: targetArray.includes("receiver")
      ? {
        select: {
          publicId: true,
          email: true,
          addtl: true
        }
      }
    : undefined
  };
  console.log("Showing created select obj");
  console.log(selectObj);
  return selectObj;
}

// Formatting Utils

export const formatFriendRequestObject = (friendRequest, protocol, host) => {
  const hasSender = friendRequest.sender && friendRequest.sender !== null;
  const hasReceiver = friendRequest.receiver && friendRequest.receiver !== null;

  const { publicId: friendRequestPublicIdAlias, sender, receiver, ...restofFriendRequest } = friendRequest;

  let formattedSender = undefined;
  if(hasSender){
    const { publicId: senderPublicIdAlias, ...restOfSender} = sender;
    formattedSender = {
    id: senderPublicIdAlias,
    ...restOfSender 
    }
  }

  let formattedReceiver = undefined;
  if(hasReceiver){
    const { publicId: receiverPublicIdAlias, ...restofReceiver} = receiver;
    formattedReceiver = {
    id: receiverPublicIdAlias,
    ...restofReceiver 
    }
  }

  return {
    id: friendRequestPublicIdAlias,
    ...restofFriendRequest,
    links: {
      self: new URL(`/api/v1/friend-requests/${friendRequestPublicIdAlias}`, `${protocol}://${host}`),
      sender: hasSender ? new URL(`/api/v1/users/${formattedSender.id}`, `${protocol}://${host}`) : undefined,
      receiver: hasReceiver ? new URL(`/api/v1/users/${formattedReceiver.id}`, `${protocol}://${host}`) : undefined,
    },
    sender: formattedSender,
    receiver: formattedReceiver
  }

}