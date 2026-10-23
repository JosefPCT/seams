// Object creation

export const prepareChatParticipantsWhereObj = (searchTerm, isSearchTermUUID) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
        { user: { is: { publicId: searchTerm } } },
        { user: { is: { profile: { is: { publicId: searchTerm } } } } },
        { group: { is: { publicId: searchTerm } } },
      )
    : "";

  ["ADMIN", "MEMBER"].includes(searchTerm)
    ? orConditions.push({ role: searchTerm })
    : "";

  orConditions.push(
    { user: { is: { email: { contains: searchTerm, mode: 'insensitive'}}}},
    { user: { is: { addtl: { contains: searchTerm, mode: 'insensitive'}}}},
    { user: { is: { profile: { is: { name: { contains: searchTerm, mode: 'insensitive' }}}}}},
    { group: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}
  )

  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
}

export const prepareChatParticipantsSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    role: true,
    joinedAt: true,
    user: targetArray.includes("user")
      ? {
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
        }
      : undefined,
    group: targetArray.includes("group")
      ? {
          select: {
            publicId: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        }
      : undefined,
  };
  return selectObj;
}

//  Formatting
export const formatReturnCreatedParticipantObject = (participant, protocol, host) => {
  const { publicId: participantPublicIdAlias, user, group, ...restOfParticipant} = participant;
  const { publicId: userPublicIdAlias, profile, ...restOfUser } = user;
  const { publicId: profilePublicIdAlias, ...restOfProfile } = profile;
  const { publicId: groupPublicIdAlias, ...restOfGroup } = group;

  return {
    id: participantPublicIdAlias,
    ...restOfParticipant,
    user: {
        id: userPublicIdAlias,
        ...restOfUser,
        profile: {
            id: profilePublicIdAlias,
            ...restOfProfile,
        }
    },
    group: {
       id: groupPublicIdAlias,
       ...restOfGroup
    },
    links: {
      self: new URL(`/api/v1/chat-participants/${participantPublicIdAlias}`, `${protocol}://${host}`),
      user: new URL(`/api/v1/users/${userPublicIdAlias}`, `${protocol}://${host}`),
      chatGroup: new URL(`/api/v1/chat-groups/${groupPublicIdAlias}`, `${protocol}://${host}`),
    }
  }
}

export const formatReturnParticipantsArray = (participants, protocol, host) => {
  const formattedBatchParticipants = participants.map(({ publicId: participantPublicIdAlias, user, group, ...restOfParticipants }) => {
    const hasUser = user && user !== null;
    const hasGroup = group && group !== null;

    let formattedUser = null;
    if (hasUser) {
      const { publicId: userPublicIdAlias, profile, ...restOfUser } = user;

      const hasProfile = profile && profile !== null;
      let formattedProfile = null;
      if(hasProfile){
        const { publicId: profilePublicIdAlias, ...restOfProfile } = profile;
        formattedProfile = {
          id: profilePublicIdAlias,
          ...restOfProfile
        }
      }

      formattedUser = {
        id: userPublicIdAlias,
        ...restOfUser,
        profile: formattedProfile
      };
    }

    let formattedGroup = null;
    if (hasGroup){
      const { publicId: groupPublicIdAlias, ...restOfGroup } = group;
      formattedGroup = {
        id: groupPublicIdAlias,
        ...restOfGroup
      }
    }

    return {
      id: participantPublicIdAlias,
      ...restOfParticipants,
      links: {
        self: new URL(`/api/v1/chat-participants/${participantPublicIdAlias}`, `${protocol}://${host}`),
        user: hasUser ? new URL(`/api/v1/users/${formattedUser.id}`, `${protocol}://${host}`) : undefined,
        chatGroup: hasGroup ? new URL(`/api/v1/chat-groups/${formattedGroup.id}`, `${protocol}://${host}`): undefined,
      },
      user: formattedUser,
      group: formattedGroup
    }
  });
  return formattedBatchParticipants;
}