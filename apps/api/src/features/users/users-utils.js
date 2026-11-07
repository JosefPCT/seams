const USERS_URL = `/api/v1/users`;
const PROFILE_URL = `/api/v1/profiles`;
const GROUP_URL = `/api/v1/chat-groups`;
const MESSAGE_URL = `/api/v1/messages`;

export const prepareUsersWhereObj = (searchTerm, isSearchTermUUID, includeArr ) => {
  const orConditions = [];

  isSearchTermUUID
    ? orConditions.push(
        { publicId: searchTerm },
      )
    : "";

  isSearchTermUUID & includeArr.includes("profile")
    ? orConditions.push(
      { profile: { is: { publicId: searchTerm }}}
    )
    : "";

  isSearchTermUUID & includeArr.includes("messages")
    ? orConditions.push(
      { messages: { some: { publicId: searchTerm }}}
    ) 
    : "";

  isSearchTermUUID & includeArr.includes("groups")
    ? orConditions.push(
      { groups: { some: { publicId: searchTerm }}},
      { groups: { some: { group: { is: { publicId: searchTerm }}}}}
    )
    : "";

  includeArr.includes("profile")
    ? orConditions.push(
      { profile: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}},
      { profile: { is: { pronouns: { contains: searchTerm, mode: 'insensitive'}}}},
      { profile: { is: { bio: { contains: searchTerm, mode: 'insensitive'}}}},
    )
    : "";
  
  includeArr.includes("messages")
    ? orConditions.push(
      { messages: { some: { content: { contains: searchTerm, mode: 'insensitive'}}}},
    )
    : "";

  includeArr.includes("groups")
    ? orConditions.push(
      { groups: { some: { group: { is: { name: { contains: searchTerm, mode: 'insensitive'}}}}}}
    )
    : "";

  ["ADMIN", "MEMBER"].includes(searchTerm) && includeArr.includes("groups")
    ? orConditions.push({ groups: { some: { role: searchTerm }}})
    : "";  

  orConditions.push(
     { email: { contains: searchTerm, mode: 'insensitive'}},
     { addtl: { contains: searchTerm, mode: 'insensitive'}},

  )

  const whereClause = orConditions.length > 0 ? { OR: orConditions } : {}
  return whereClause
}

// Receives an array object that will be checked if certain strings (relations) are present
// relations: profile, messages, groups
export const prepareUsersSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    email: true,
    addtl: true,
    isAdmin: true,
    profile: targetArray.includes("profile")
      ? {
          select: {
            publicId: true,
            name: true,
            pronouns: true,
            bio: true,
            createdAt: true,
            updatedAt: true,
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
          },
        }
      : undefined,
    groups: targetArray.includes("groups")
      ? {
          select: {
            publicId: true,
            role: true,
            joinedAt: true,
            group: {
              select: {
                publicId: true,
                name: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        }
      : undefined,
    // Instead of getting both relations (receiver/sender), get only the 'receiver' relation
    sentRequests: targetArray.includes('sentRequests')
      ? {
        select: {
          publicId: true,
          status: true,
          sentAt: true,
          updatedAt: true,
          receiver: {
            select: {
              publicId: true,
              email: true,
              addtl: true,
              profile: {
                select: {
                  publicId: true,
                  name: true
                }
              }
            }
          }
        }
      } : undefined,
    // Instead of getting both relations (receiver/sender), get only the 'sender' relation
    receivedRequests: targetArray.includes('receivedRequests')
      ? {
        select: {
          publicId: true,
          status: true,
          sentAt: true,
          updatedAt: true,
          sender: {
            select: {
              publicId: true,
              email: true,
              addtl: true,
              profile: {
                select: {
                  publicId: true,
                  name: true
                }
              }
            }
          },
        }
      } : undefined,
    _count: ["messages", "groups", "sentRequests", "receivedRequests"].some((relation) =>
      targetArray.includes(relation),
    )
      ? {
          select: {
            messages: targetArray.includes("messages") ? true : undefined,
            groups: targetArray.includes("groups") ? true : undefined,
            sentRequests: targetArray.includes("sentRequests") ? true : undefined,
            receivedRequests: targetArray.includes("receivedRequests") ? true : undefined,
          },
        }
      : undefined,
  };
  return selectObj;
};

// Block of code responsible for formatting the returned object (i.e converting public ids to ids)
// Using map to remove fields from the object (i.e the public id to convert to id in response object) using destructuring
// Using map to add fields such as the URLs
export const formatReturnUsersArray = (users, protocol, host) => {
  const formattedUsers = users.map(({ publicId, profile, ...user }) => {
    const hasProfile = profile && profile !== null;
    const hasMessages = user.messages && user.messages.length > 0;
    const hasGroups = user.groups && user.groups.length > 0;
    const hasReceivedRequests = user.receivedRequests && user.receivedRequests.length > 0;
    const hasSentRequests = user.sentRequests && user.sentRequests.length > 0;

    let formattedProfile = null;
    if (hasProfile) {
      const { publicId, ...restOfProfile } = profile;
      formattedProfile = {
        id: publicId,
        ...restOfProfile,
      };
    }

    return {
      id: publicId,
      ...user,
      links: {
        self: new URL(`/api/v1/users/${publicId}`, `${protocol}://${host}`),
        createProfileUrl: hasProfile
        ? "Already created a profile"
        : new URL(`${PROFILE_URL}`, `${protocol}://${host}`),
        profileUrl: hasProfile
          ? new URL(
              `${PROFILE_URL}/${formattedProfile.id}`,
              `${protocol}://${host}`,
            )
          : "No profile or profile not included in query",
        messagesUrl: new URL(
          `${MESSAGE_URL}?userPublicId=${publicId}`,
          `${protocol}://${host}`,
        ),
        groupUrl: new URL(
          `${GROUP_URL}?userPublicId=${publicId}`,
          `${protocol}://${host}`,
        ),
      },
      profile: formattedProfile,
      groups: hasGroups
        ? user.groups.map(
            ({ publicId: groupPublicId, group, ...restOfGroup }) => {
              let formattedActualGroup = null;
              if (group) {
                const { publicId: actualGroupPublicId, ...restOfActualGroup } =
                  group;
                formattedActualGroup = {
                  id: actualGroupPublicId,
                  ...restOfActualGroup,
                };
              }

              return {
                id: groupPublicId,
                ...restOfGroup,
                group: formattedActualGroup,
              };
            },
          )
        : [],
      messages: hasMessages
        ? user.messages.map(({ publicId, ...messages }) => ({
            id: publicId,
            ...messages,
          }))
        : [],
      sentRequests: hasSentRequests
        ? user.sentRequests.map(({ publicId: sentRequestPublicIdAlias, receiver, ...restofSentRequest}) => {
          let formattedReceiver = null;
          if(receiver){
            const{ publicId: receiverPublicIdAlias, profile: receiverProfile, ...restOfReceiver}  = receiver;
            const hasReceiverProfile =  receiverProfile && receiverProfile !== null;

            let formattedReceiverProfile = null;
            if(hasReceiverProfile){
              const { publicId: receiverProfilePublicIdAlias, ...restOfReceiverProfile} = receiverProfile
              formattedReceiverProfile = {
                id: receiverProfilePublicIdAlias,
                ...restOfReceiverProfile
              }
            }

            formattedReceiver = {
              id: receiverPublicIdAlias,
              profile: formattedReceiverProfile,
              ...restOfReceiver
            }
          }

          return {
            id: sentRequestPublicIdAlias,
            receiver: formattedReceiver,
            ...restofSentRequest
          }
        })
        : [],
    };
  });
  return formattedUsers;
};

// Util used by 'GET /users/:publicId' route, specifically getUserByPublicId function
// Returns a formatted user object (no internal ids, rename public ids to id (root and nested), add helpful urls)
export const formatUserObject = (user, protocol, host) => {
  const hasProfile = user.profile && user.profile !== null;
  const hasMessages = user.messages && user.messages.length > 0;
  const hasGroups = user.groups && user.groups.length > 0;
  const hasReceivedRequests = user.receivedRequests && user.receivedRequests.length > 0;
  const hasSentRequests = user.sentRequests && user.sentRequests.length > 0;

  const { publicId: userPublicIdAlias, profile, ...rest } = user;

  let formattedProfile = undefined;
  if (hasProfile) {
    const { publicId: profilePublicIdAlias, ...restProfile } = profile;
    formattedProfile = {
      id: profilePublicIdAlias,
      ...restProfile,
    };
  }

  const formattedUser = {
    id: userPublicIdAlias,
    ...rest,
    links: {
      self: new URL(`/api/v1/users/${userPublicIdAlias}`, `${protocol}://${host}`),
      createProfileUrl: hasProfile
        ? "Already created a profile"
        : new URL(`${PROFILE_URL}`, `${protocol}://${host}`),
      profileUrl: hasProfile
        ? new URL(
            `${PROFILE_URL}/${formattedProfile.id}`,
            `${protocol}://${host}`,
          )
        : undefined,
      messagesUrl: hasMessages ? new URL(
        `${MESSAGE_URL}?userPublicId=${userPublicIdAlias}`,
        `${protocol}://${host}`,
      ) : undefined,
      groupUrl: hasGroups? new URL(
        `${GROUP_URL}?userPublicId=${userPublicIdAlias}`,
        `${protocol}://${host}`,
      ) : undefined,
    },
    profile: formattedProfile,
    messages: hasMessages
      ? user.messages.map(({ publicId, ...messages }) => ({
          id: publicId,
          ...messages,
        }))
      : undefined,
    groups: hasGroups
      ? user.groups.map(
          ({ publicId: groupPublicId, group, ...restOfGroup }) => {
            let formattedActualGroup = null;
            if (group) {
              const { publicId: actualGroupPublicId, ...restOfActualGroup } =
                group;
              formattedActualGroup = {
                id: actualGroupPublicId,
                ...restOfActualGroup,
              };
            }

            return {
              id: groupPublicId,
              ...restOfGroup,
              group: formattedActualGroup,
            };
          },
        )
      : undefined,
    sentRequests: hasSentRequests
        ? user.sentRequests.map(({ publicId: sentRequestPublicIdAlias, receiver, ...restofSentRequest}) => {
          let formattedReceiver = null;
          if(receiver){
            const{ publicId: receiverPublicIdAlias, profile: receiverProfile, ...restOfReceiver}  = receiver;
            const hasReceiverProfile =  receiverProfile && receiverProfile !== null;

            let formattedReceiverProfile = null;
            if(hasReceiverProfile){
              const { publicId: receiverProfilePublicIdAlias, ...restOfReceiverProfile} = receiverProfile
              formattedReceiverProfile = {
                id: receiverProfilePublicIdAlias,
                ...restOfReceiverProfile,
                link: new URL(`/api/v1/profiles/${receiverProfilePublicIdAlias}`, `${protocol}://${host}`)
              }
            }

            formattedReceiver = {
              id: receiverPublicIdAlias,
              profile: formattedReceiverProfile,
              ...restOfReceiver,
              link: new URL(`/api/v1/users/${receiverPublicIdAlias}`, `${protocol}://${host}`),
            }
          }

          return {
            id: sentRequestPublicIdAlias,
            ...restofSentRequest,
            receiver: formattedReceiver
          }
        })
        : [],
    receivedRequests: hasReceivedRequests
        ? user.receivedRequests.map(({ publicId: receivedRequestPublicIdAlias, sender, ...restOfReceivedRequest}) => {
          let formattedSender = null;
          if(sender){
            const{ publicId: senderPublicIdAlias, profile: senderProfile, ...restOfSender}  = sender;
            const hasSenderProfile =  senderProfile && senderProfile !== null;

            let formattedSenderProfile = null;
            if(hasSenderProfile){
              const { publicId: senderProfilePublicIdAlias, ...restOfSenderProfile} = senderProfile
              formattedSenderProfile = {
                id: senderProfilePublicIdAlias,
                ...restOfSenderProfile,
                link: new URL(`/api/v1/profiles/${senderProfilePublicIdAlias}`, `${protocol}://${host}`)
              }
            }

            formattedSender = {
              id: senderPublicIdAlias,
              profile: formattedSenderProfile,
              ...restOfSender,
              link: new URL(`/api/v1/users/${senderPublicIdAlias}`, `${protocol}://${host}`),
            }
          }

          return {
            id: receivedRequestPublicIdAlias,
            ...restOfReceivedRequest,
            sender: formattedSender
          }
        })
        : [],
  };
  return formattedUser;
};