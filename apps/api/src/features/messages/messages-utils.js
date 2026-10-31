import { supabase } from '../../config/supabase.js';

// Function that uploads a
export const prepareMessageCreateDataObject = async(userPublicId, content, userId, groupId, attachments) => {
  console.log("Checking of attachments object");
  console.log(attachments)
  
  let attachmentsWithUrl = undefined;
  if(attachments){ 
    for (const attachment of attachments) {
      console.log("Under for each");
      console.log(userPublicId);
      console.log(attachment.name);
      console.log(attachment.type);
      const folderPath = userPublicId;
      const fileName = attachment.name;
      const filePath = `${folderPath}/${fileName}`;
      console.log("File path:");
      console.log(filePath);
      const { data, error } = await supabase.storage.from('testbuck1').upload(filePath, attachment.buffer, {
            cacheControl: '3600',
            upsert: false,
            // contentType: 'image/png',
            contentType: attachment.type
      });
      console.log("Data for uploaded file");
      console.log(data);
      console.log(error);
    }

    // Creating the attachments object with the actual url from supabase's public url
    attachmentsWithUrl = attachments.map(attachment => {
      const folderPath = userPublicId;
      const fileName = attachment.name;
      const filePath = `${folderPath}/${fileName}`;
      const { data: publicUrlData , error: getError } = supabase.storage.from('testbuck1').getPublicUrl(filePath);

      return {
        name: attachment.name,
        mimeType: attachment.type,
        size: attachment.size,
        url: publicUrlData.publicUrl,
      }
    })
    console.log("Attachments with URL");
    console.log(attachmentsWithUrl);

    console.log("Content");
    console.log(content);
  }

  // Uses conditional spreading to build the attachments nested relation if present, empty if not present
  return {
    senderId: userId,
    groupId: groupId,
    content: content,
    ...(attachments ? { attachments: {
      create: attachmentsWithUrl
    }} : {})
  }
}

export const prepareMessageWhereObject = (searchTerm, isSearchTermUUID, includeArr) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
      )
    : "";

  isSearchTermUUID & includeArr.includes("sentBy")
    ? orConditions.push(
      { sentBy: { is: { publicId: searchTerm }}}
    )
    : "";
  
  isSearchTermUUID & includeArr.includes("group")
    ? orConditions.push(
      { group: { is: { publicId: searchTerm }}}
    )
    : "";  

  includeArr.includes("sentBy")
    ? orConditions.push(
      { sentBy: { is: { email: { contains: searchTerm, mode: 'insensitive' }}}},
      { sentBy: { is: { addtl: { contains: searchTerm, mode: 'insensitive' }}}},
    )
    : ""; 

  includeArr.includes("group")
    ? orConditions.push(
      { group: { is: { name: { contains: searchTerm, mode: 'insensitive' }}}},
    )
    : "";   

  orConditions.push(
    { content: { contains: searchTerm, mode: 'insensitive'}},
  )

  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
}

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
      } : undefined,
    attachments: targetArray.includes("attachments")
     ? {
      select: {
        publicId: true,
        name: true,
        size: true,
        mimeType: true,
        url: true
      }
     } : undefined,
  };
  return selectObj;
};

export const formatReturnMessagesArray = (messages, protocol, host) => {

  const formattedMessages = messages.map(({publicId: messagePublicIdAlias, sentBy, group, attachments, ...restOfMessages}) => {
    const hasSentBy = sentBy && sentBy !== null;
    const hasGroup = group && group !== null;
    const hasAttachments = attachments && attachments.length > 0;

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
        attachments: hasAttachments ? new URL(`/api/v1/messages/${messagePublicIdAlias}/attachments`, `${protocol}://${host}`) : undefined
      },
      sentBy: formattedSentBy,
      group: formattedGroup,
      attachments: hasAttachments 
      ? attachments.map(
        ({ publicId: attachmentPublicId, ...restOfAttachment}) => {
          return {
            id: attachmentPublicId,
            ...restOfAttachment
          }
        }
      )
      : null
    }
  })
  return formattedMessages;
}

export const formatReturnMessageObject = (message, protocol, host) => {
  const hasSentBy = message.sentBy && message.sentBy !== null;
  const hasGroup = message.group && message.group !== null;
  const hasAttachments = message.attachments && message.attachments.length > 0;

  const { publicId: messagePublicIdAlias, sentBy, group, ...restOfMessage } = message;

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

  return {
    id: messagePublicIdAlias,
    ...restOfMessage,
    links: {
      self: new URL(`/api/v1/messages/${messagePublicIdAlias}`, `${protocol}://${host}`),
      sentBy: hasSentBy ? new URL(`/api/v1/users/${formattedSentBy.id}`, `${protocol}://${host}`) : undefined,
      group: hasGroup ? new URL(`/api/v1/chat-groups/${formattedGroup.id}`, `${protocol}://${host}`) : undefined,
      attachments: hasAttachments ? new URL(`/api/v1/messages/${messagePublicIdAlias}/attachments`, `${protocol}://${host}`) : undefined
    },
    sentBy: formattedSentBy,
    group: formattedGroup,
    attachments: hasAttachments 
      ? message.attachments.map(
        ({ publicId: attachmentPublicId, ...restOfAttachment}) => {
          return {
            id: attachmentPublicId,
            ...restOfAttachment
          }
        }
      )
      : null
  }

}