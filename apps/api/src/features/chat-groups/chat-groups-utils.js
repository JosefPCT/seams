export const prepareChatGroupsWhereObj = (searchTerm, isSearchTermUUID, includeArr) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
      )
    : "";

  isSearchTermUUID & includeArr.includes("messages")
    ? orConditions.push(
      { messages: { some: { publicId: searchTerm }}},
      { messages: { some: { sentBy: { is: { publicId: searchTerm }}}}},
      { messages: { some: { sentBy: { is: { profile: { is: { publicId: searchTerm }}}}}}}
    )
    : "";

  isSearchTermUUID & includeArr.includes("participants")
    ? orConditions.push(
      { participants: { some: { publicId: searchTerm }}},
      { participants: { some: { user: { is: { publicId: searchTerm }}}}},
      { participants: { some: { user: { is: { profile: { is: { publicId: searchTerm }}}}}}}
    ) 
    : "";
  
  includeArr.includes("messages")
    ? orConditions.push(
      { messages: { some : { content: { contains: searchTerm, mode: 'insensitive'}}}},
      { messages: { some: { sentBy: { is: { email: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { messages: { some: { sentBy: { is: { profile: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}}}}},
    )
    : "";

  includeArr.includes("participants")
    ? orConditions.push(
      { participants: { some: { user: { is: { email: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { participants: { some: { user: { is: { addtl: { contains: searchTerm, mode: 'insensitive'}}}}}},
      { participants: { some: { user: { is: { profile: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}}}}}
    )
    : "";

  ["ADMIN", "MEMBER"].includes(searchTerm) && includeArr.includes("participants")
    ? orConditions.push(
      { participants: { some: { role: searchTerm }}}
    )
    : "";  

  orConditions.push(
     { name : { contains: searchTerm, mode: 'insensitive'}},
  )

  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
}


export const prepareChatGroupSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    participants: targetArray.includes("participants")
      ? {
          select: {
            publicId: true,
            role: true,
            joinedAt: true,
            user: {
              select: {
                publicId: true,
                email: true,
                addtl: true,
                profile: {
                  select: {
                    publicId: true,
                    name: true,
                  },
                },
              },
            },
          },
        }
      : undefined,
    messages: targetArray.includes("messages")
      ? {
          select: {
            publicId: true,
            content: true,
            sentAt: true,
            editedAt: true,
            sentBy: {
              select: {
                publicId: true,
                email: true,
                profile: {
                  select: {
                    publicId: true,
                    name: true,
                  },
                },
              },
            },
          },
        }
      : undefined,
    _count: ["messages", "partcipants"].some((relation) =>
      targetArray.includes(relation),
    )
      ? {
          select: {
            messages: targetArray.includes("messages") ? true : undefined,
            participants: targetArray.includes("participants")
              ? true
              : undefined,
          },
        }
      : undefined,
  };
  return selectObj;
};

export const formatReturnChatGroupsArray = (chatGroups, protocol, host) => {
  const formattedGroups = chatGroups.map(
    ({ publicId: chatGroupPublicIdAlias, ...chatGroup }) => {
      const hasParticipants =
        chatGroup.participants && chatGroup.participants.length > 0;
      const hasMessages = chatGroup.messages && chatGroup.messages.length > 0;

      return {
        id: chatGroupPublicIdAlias,
        ...chatGroup,
        links: {
          self: new URL(
            `/api/v1/chat-groups/${chatGroupPublicIdAlias}`,
            `${protocol}://${host}`,
          ),
          messages: new URL(
            `/api/v1/messages?searchTerm=${chatGroupPublicIdAlias}`,
            `${protocol}://${host}`,
          ),
          participants: new URL(
            `/api/v1/chat-participants?searchTerm=${chatGroupPublicIdAlias}`,
            `${protocol}://${host}`,
          ),
        },
        participants: hasParticipants
          ? chatGroup.participants.map(
              ({
                publicId: chatParticipantPublicIdAlias,
                user,
                ...restofParticipants
              }) => {
                let formattedUser = null;
                if (user) {
                  const {
                    publicId: userPublicIdAlias,
                    profile,
                    ...restOfUser
                  } = user;

                  let formattedProfile = null;
                  if (profile) {
                    const { publicId: profilePublicIdAlias, ...restOfProfile } =
                      profile;
                    formattedProfile = {
                      id: profilePublicIdAlias,
                      ...restOfProfile,
                    };
                  }

                  formattedUser = {
                    id: userPublicIdAlias,
                    profile: formattedProfile,
                    ...restOfUser,
                  };
                }

                return {
                  id: chatParticipantPublicIdAlias,
                  ...restofParticipants,
                  user: formattedUser,
                };
              },
            )
          : [],
        messages: hasMessages
          ? chatGroup.messages.map(
              ({
                publicId: messagePublicIdAlias,
                sentBy,
                ...restOfMessages
              }) => {
                let formattedUser = null;
                if (sentBy) {
                  const {
                    publicId: userPublicIdAlias,
                    profile,
                    ...restOfUser
                  } = sentBy;

                  let formattedProfile = null;
                  if (profile) {
                    const { publicId: profilePublicIdAlias, ...restOfProfile } =
                      profile;
                    formattedProfile = {
                      id: profilePublicIdAlias,
                      ...restOfProfile,
                    };
                  }

                  formattedUser = {
                    id: userPublicIdAlias,
                    profile: formattedProfile,
                    ...restOfUser,
                  };
                }

                return {
                  id: messagePublicIdAlias,
                  ...restOfMessages,
                  sentBy: formattedUser,
                };
              },
            )
          : [],
      };
    },
  );
  return formattedGroups;
};

export const formatReturnChatGroupObject = (chatGroup, protocol, host) => {
  const hasParticipants =
    chatGroup.participants && chatGroup.participants.length > 0;
  const hasMessages = chatGroup.messages && chatGroup.messages.length > 0;

  const { publicId: chatGroupPublicIdAlias, ...restOfChatGroup } = chatGroup;

  return {
    id: chatGroupPublicIdAlias,
    ...restOfChatGroup,
    links: {
      self: new URL(
        `/api/v1/chat-groups/${chatGroupPublicIdAlias}`,
        `${protocol}://${host}`,
      ),
      messages: hasMessages ? new URL(
        `/api/v1/messages?searchTerm=${chatGroupPublicIdAlias}`,
        `${protocol}://${host}`,
      ): undefined,
      participants: hasParticipants ? new URL(
        `/api/v1/chat-participants?searchTerm=${chatGroupPublicIdAlias}`,
        `${protocol}://${host}`,
      ): undefined,
    },
    participants: hasParticipants
      ? chatGroup.participants.map(
          ({
            publicId: chatParticipantPublicIdAlias,
            user,
            ...restofParticipants
          }) => {
            let formattedUser = null;
            if (user) {
              const {
                publicId: userPublicIdAlias,
                profile,
                ...restOfUser
              } = user;

              let formattedProfile = null;
              if (profile) {
                const { publicId: profilePublicIdAlias, ...restOfProfile } =
                  profile;
                formattedProfile = {
                  id: profilePublicIdAlias,
                  ...restOfProfile,
                };
              }

              formattedUser = {
                id: userPublicIdAlias,
                profile: formattedProfile,
                ...restOfUser,
              };
            }

            return {
              id: chatParticipantPublicIdAlias,
              ...restofParticipants,
              user: formattedUser,
            };
          },
        )
      : undefined,
    messages: hasMessages
      ? chatGroup.messages.map(
          ({ publicId: messagePublicIdAlias, sentBy, ...restOfMessages }) => {
            let formattedUser = null;
            if (sentBy) {
              const {
                publicId: userPublicIdAlias,
                profile,
                ...restOfUser
              } = sentBy;

              let formattedProfile = null;
              if (profile) {
                const { publicId: profilePublicIdAlias, ...restOfProfile } =
                  profile;
                formattedProfile = {
                  id: profilePublicIdAlias,
                  ...restOfProfile,
                };
              }

              formattedUser = {
                id: userPublicIdAlias,
                profile: formattedProfile,
                ...restOfUser,
              };
            }

            return {
              id: messagePublicIdAlias,
              ...restOfMessages,
              sentBy: formattedUser,
            };
          },
        )
      : undefined,
  };
};