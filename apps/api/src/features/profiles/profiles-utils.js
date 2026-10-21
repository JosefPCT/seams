// Receives an array object that will be checked if certain strings (relations) are present
// relations: user( nested relation of user: profiles, messages, groups)
export const prepareProfileSelectObj = (targetArray) => {
  const selectObj = {
    publicId: true,
    name: true,
    pronouns: true,
    bio: true,
    createdAt: true,
    updatedAt: true,
    user: targetArray.includes("user")
      ? {
          select: {
            publicId: true,
            email: true,
            addtl: true,
            isAdmin: true,
            // Can also include nested relation of the relation (user)
            groups: targetArray.includes("groups") 
            ? { select: {
                publicId: true
            }}
            : undefined
          },
        }
      : undefined,
  };
  return selectObj;
};

export const formatReturnProfilesList = (profiles, protocol, host) => {

  const formattedProfiles = profiles.map(({publicId: profilePublicIdAlias, user, ...profile}) => {
    const hasUser = user && user !== null;

    let formattedUser = undefined;
    if (hasUser) {
      const { publicId: userPublicIdAlias, ...restOfUser} = user;
      formattedUser = {
        id: userPublicIdAlias,
        ...restOfUser
      }
    }

    return {
      id: profilePublicIdAlias,
      ...profile,
      links: {
        self: new URL(`/api/v1/profile/${profilePublicIdAlias}`, `${protocol}://${host}`),
        usersUrl: hasUser ? new URL(`/api/v1/users/${formattedUser.id}`, `${protocol}://${host}`) : undefined
      },
      user: formattedUser,
    }
  })

  return formattedProfiles;
};

export const formatReturnProfile = (profile, protocol, host) => {
  const hasUser = profile.user && profile.user !== null;

  const { publicId: profilePublicIdAlias, user, ...restOfProfile} = profile;

  let formattedUser = null;
  if(hasUser){
    const { publicId: userPublicIdAlias, ...restOfUser} = user;
    formattedUser = {
      id: userPublicIdAlias,
      ...restOfUser
    }
  }

  return {
    id: profilePublicIdAlias,
    ...restOfProfile,
    links: {
      self: new URL(`/api/v1/profile/${profilePublicIdAlias}`, `${protocol}://${host}`),
      usersUrl: hasUser ? new URL(`/api/v1/users/${formattedUser.id}`, `${protocol}://${host}`) : undefined
    },
    user: formattedUser
  }
}