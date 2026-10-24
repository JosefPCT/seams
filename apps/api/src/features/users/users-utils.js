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
    _count: ["messages", "groups"].some((relation) =>
      targetArray.includes(relation),
    )
      ? {
          select: {
            messages: targetArray.includes("messages") ? true : undefined,
            groups: targetArray.includes("groups") ? true : undefined,
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
        self: new URL(`/api/v1/users/${userPublicIdAlias}`, `${protocol}://${host}`),
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
  };
  return formattedUser;
};