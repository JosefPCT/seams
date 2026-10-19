

export const isValidV4UUID = (str) => {
  const v4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return v4Regex.test(str);
}

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