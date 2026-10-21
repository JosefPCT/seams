// Receives an array object that will be checked if certain strings (relations) are present
// relations: sentBy(user), group
export const prepareMessageSelectObject = (targetArray) => {
  const selectObj = {
    publicId: true,
    content: true,
    sentAt: true,
    editedAt: true,
    sentBy: targetArray.includes("sentBy")
      ? {
          select: {
            publicId: true,
            email: true,
            addtl: true,
            isAdmin: true,
            // Can also include nested relation of the relation (user)
          },
        }
      : undefined,
    group: targetArray.includes("group")
      ? {
        select: {
          publicId: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        }
      } : undefined
  };
  return selectObj;
};

export const formatReturnMessagesList = (messages, protocol, host) => {

  const formattedMessages = messages.map(({publicId: messagePublicIdAlias, sentBy, group, ...restOfMessages}) => {
    const hasSentBy = sentBy && sentBy !== null;
    const hasGroup = group && group !== null;

    let formattedSentBy = undefined;
    if(hasSentBy){
      const { publicId: sentByPublicIdAlias, ...restofSentBy} = sentBy;
      formattedSentBy = {
        id: sentByPublicIdAlias,
        ...restofSentBy 
      }
    }

    let formattedGroup = undefined;
    if(hasGroup){
      const { publicId: groupPublicIdAlias, ...restOfGroup} = group;
      formattedGroup = {
        id: groupPublicIdAlias,
        ...restOfGroup
      }
    }

    return{
      id: messagePublicIdAlias,
      ...restOfMessages,
      links: {
        self: new URL(`/api/v1/messages/${messagePublicIdAlias}`, `${protocol}://${host}`),
        sentBy: hasSentBy ? new URL(`/api/v1/users/${formattedSentBy.id}`, `${protocol}://${host}`) : undefined,
        group: hasGroup ? new URL(`/api/v1/chat-groups/${formattedGroup.id}`, `${protocol}://${host}`) : undefined,
      },
      sentBy: formattedSentBy,
      group: formattedGroup
    }
  })
  return formattedMessages;
}
