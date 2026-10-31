import { supabase } from "../../../config/supabase.js";

// Example of url that should be stored: https://peytonkdtxkjgvbphenq.supabase.co/storage/v1/object/public/testbuck1/e6f12a7b-ece7-4167-8fae-d81f57050632/JosefBig.png
export const uploadAttachmentsToSupabase = async (attachments, userPublicId) => {
  for (const attachment of attachments) {
    console.log("Under for each");
    console.log(userPublicId);
    console.log(attachment.name);
    console.log(attachment.mimeType);
    const folderPath = userPublicId;
    const fileName = attachment.name;
    const filePath = `${folderPath}/${fileName}`;
    console.log("File path:");
    console.log(filePath);
    const { data, error } = await supabase.storage
      .from("testbuck1")
      .upload(filePath, attachment.buffer, {
        cacheControl: "3600",
        upsert: false,
        // contentType: 'image/png',
        contentType: attachment.mimeType,
      });
    console.log("Data for uploaded file");
    console.log(data);
    console.log(error);
  }
};

export const createAttachmentsObjectWithUrl = (
  attachments,
  userPublicId,
) => {
  return attachments.map((attachment) => {
    const filePath = `${userPublicId}/${attachment.name}`;
    const { data: publicUrlData, error: getError } = supabase.storage
      .from("testbuck1")
      .getPublicUrl(filePath);

    return {
      name: attachment.name,
      mimeType: attachment.mimeType,
      size: attachment.size,
      url: publicUrlData.publicUrl,
    };
  });
};

// Creation of objects for the query layer

export const prepareAttachmentsWhereObj = (messageId, searchTerm, isSearchTermUUID, includeArr) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
      )
    : "";

  isSearchTermUUID & includeArr.includes("message")
    ? orConditions.push(
      { message: { is: { publicId: searchTerm }}}
    )
    : "";

  includeArr.includes("message")
    ? orConditions.push(
      { message: { is: { content: { contains: searchTerm, mode: 'insensitive' }}}},
    )
    : ""; 

  orConditions.push(
    { url: { contains: searchTerm, mode: 'insensitive'}},
    { name: { contains: searchTerm, mode: 'insensitive'}},
    { mimeType: { contains: searchTerm, mode: 'insensitive'}},

    // Todo find a way to search through numbers (lt,lte,equals,gt,gte) (might need to have two inputs for the range)
  )

  const whereClause = orConditions.length > 0 ? { messageId: messageId, OR: orConditions } : { messageId: messageId }
  return whereClause
}

export const prepareAttachmentSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    name: true,
    mimeType: true,
    size: true,
    url: true,
    uploadedAt: true,
    editedAt: true,
    message: targetArray.includes("message")
      ? {
          select: {
            publicId: true,
            content: true,
            sentAt: true,
            editedAt: true,
            // Can also include nested relation of this relation
          },
        }
      : undefined
  };
  console.log("Showing created select obj");
  console.log(selectObj);
  return selectObj;
}


// Formatting
export const formatReturnAttachmentObject = (attachment, messagePublicId, protocol, host) => {
  const hasMessage = attachment.message && attachment.message !== null;

  const { publicId: attachmentPublicIdAlias, message, ...restOfAttachment } = attachment;

  let formattedMessageParent = undefined;
  if(hasMessage){
    const { publicId: messagePublicIdAlias, ...restOfMessage} = message;
    formattedMessageParent = {
    id: messagePublicIdAlias,
    ...restOfMessage 
    }
  }

  return {
    id: attachmentPublicIdAlias,
    ...restOfAttachment,
    links: {
      self: new URL(`/api/v1/messages/${messagePublicId}/attachments/${attachmentPublicIdAlias}`, `${protocol}://${host}`),
      message: hasMessage ? new URL(`/api/v1/messages/${messagePublicId}`, `${protocol}://${host}`) : undefined,
    },
    message: formattedMessageParent
  }

}

export const formatReturnAttachmentsArray = (attachments, messagePublicId, protocol, host) => {
  return attachments.map(( { publicId: attachmentPublicIdAlias, message, ...restOfAttachment}) => {
    const hasMessage = message && message !== null;

    let formattedMessageParent = undefined;
    if(hasMessage){
      const { publicId: messagePublicIdAlias, ...restOfMessage } = message;
      formattedMessageParent = {
        id: messagePublicIdAlias,
        ...restOfMessage
      }
    }

    return {
      id: attachmentPublicIdAlias,
      ...restOfAttachment,
      links: {
        self: new URL(`/api/v1/messages/${messagePublicId}/attachments/${attachmentPublicIdAlias}`, `${protocol}://${host}`),
        message: hasMessage ? new URL(`/api/v1/messages/${formattedMessageParent.id}`, `${protocol}://${host}`) : undefined,
      },
      messageParent: formattedMessageParent
    }
  })
}