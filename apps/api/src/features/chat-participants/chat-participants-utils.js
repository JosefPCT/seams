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

export const formatReturnCreatedBatchParticipantsArray = (participants, protocol, host) => {
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