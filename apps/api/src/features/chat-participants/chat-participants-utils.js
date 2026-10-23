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