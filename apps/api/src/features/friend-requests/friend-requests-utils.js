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
            addtl: true,
            // Can also include nested relation of this relation
            profile: {
              select: {
                name: true,
              }
            }
          },
        }
      : undefined,
    receiver: targetArray.includes("receiver")
      ? {
        select: {
          publicId: true,
          email: true,
          addtl: true,
          profile: {
            select: {
              name: true,
            }
          }
        }
      }
    : undefined
  };
  console.log("Showing created select obj");
  console.log(selectObj);
  return selectObj;
}

export const prepareFriendRequestWhereObj = (searchTerm, isSearchTermUUID, includeArr) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
      )
    : "";

  isSearchTermUUID & includeArr.includes("sender")
    ? orConditions.push(
      { sender: { is: { publicId: searchTerm }}},
      { sender: { is: { profile: { is: { publicId: searchTerm }}}}}
    )
    : "";

  isSearchTermUUID & includeArr.includes("receiver")
    ? orConditions.push(
      { receiver: { is: { publicId: searchTerm }}},
      { receiver: { is: { profile: { is: { publicId: searchTerm }}}}}
    )
    : "";  

  includeArr.includes("sender")
    ? orConditions.push(
      { sender: { is: { email: { contains: searchTerm, mode: 'insensitive' }}}},
      { sender: { is: { addtl: { contains: searchTerm, mode: 'insensitive' }}}},
      { sender: { is: { profile: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { sender: { is: { profile: { is: { bio: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { sender: { is: { profile: { is: { pronouns: { contains: searchTerm, mode: 'insensitive'}}}}}},
    )
    : "";

  includeArr.includes("receiver")
    ? orConditions.push(
      { receiver: { is: { email: { contains: searchTerm, mode: 'insensitive' }}}},
      { receiver: { is: { addtl: { contains: searchTerm, mode: 'insensitive' }}}},
      { receiver: { is: { profile: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { receiver: { is: { profile: { is: { bio: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { receiver: { is: { profile: { is: { pronouns: { contains: searchTerm, mode: 'insensitive'}}}}}},
    )
    : ""; 

  ["PENDING", "ACCEPTED", "DECLINED"].includes(searchTerm)
    ? orConditions.push({ status: searchTerm })
    : "";  
  // orConditions.push(
  //   { url: { contains: searchTerm, mode: 'insensitive'}},
  //   { name: { contains: searchTerm, mode: 'insensitive'}},
  //   { mimeType: { contains: searchTerm, mode: 'insensitive'}},

  //   // Todo find a way to search through numbers (lt,lte,equals,gt,gte) (might need to have two inputs for the range)
  // )

  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
}

// Non-standard route utils

export const prepareMyRequestsWhereObj = (userId, type, statusArr) => {
  const orConditions = [];

  if(type === 'all'){

    if(statusArr.includes('PENDING')){
      orConditions.push(
        { senderId: userId, status: 'PENDING' },
        { receiverId: userId, status: 'PENDING' }
      )
    }
    
    if(statusArr.includes('ACCEPTED')){
      orConditions.push(
        { senderId: userId, status: 'ACCEPTED' },
        { receiverId: userId, status: 'ACCEPTED' }
      )
    }

    if(statusArr.includes('DECLINED')){
      orConditions.push(
        { senderId: userId, status: 'DECLINED' },
        { receiverId: userId, status: 'DECLINED' }
      )
    }
  }

  if(type === 'incoming'){
    if(statusArr.includes('PENDING')){
      orConditions.push(
        { receiverId: userId, status: 'PENDING' }
      )
    }
    
    if(statusArr.includes('ACCEPTED')){
      orConditions.push(
        { receiverId: userId, status: 'ACCEPTED' }
      )
    }

    if(statusArr.includes('DECLINED')){
      orConditions.push(
        { receiverId: userId, status: 'DECLINED' }
      )
    }    
  }

  if(type === 'outgoing'){
    if(statusArr.includes('PENDING')){
      orConditions.push(
        { senderId: userId, status: 'PENDING' }
      )
    }
    
    if(statusArr.includes('ACCEPTED')){
      orConditions.push(
        { senderId: userId, status: 'ACCEPTED' }
      )
    }

    if(statusArr.includes('DECLINED')){
      orConditions.push(
        { senderId: userId, status: 'DECLINED' }
      )
    }    
  }


  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
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

export const formatFriendRequestsArray = (friendRequests, protocol, host) => {
  return friendRequests.map(( { publicId: friendRequestPublicIdAlias, sender, receiver, ...restOfFriendRequest}) => {
    const hasSender = sender && sender !== null;
    const hasReceiver = receiver && receiver !== null;

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
      ...restOfFriendRequest,
      links: {
        self: new URL(`/api/v1/friend-requests/${friendRequestPublicIdAlias}`, `${protocol}://${host}`),
        sender: hasSender ? new URL(`/api/v1/users/${formattedSender.id}`, `${protocol}://${host}`) : undefined,
        receiver: hasReceiver ? new URL(`/api/v1/users/${formattedReceiver.id}`, `${protocol}://${host}`) : undefined,
      },
      sender: formattedSender,
      receiver: formattedReceiver
    }
  })
}