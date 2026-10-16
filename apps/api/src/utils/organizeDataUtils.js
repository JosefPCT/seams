const preparePatchData = (payload) => {
  return Object.entries(payload).reduce((acc, [key, value]) => {
    if(value !== undefined){
      acc[key] = value;
    }
    return acc;
  }, {});
}

// Alternative

const preparePatchDataAlternative = (payload) => {
  Object.fromEntries(Object.entries(payload).filter(([_, val]) => val !== undefined));
}

// Receives an array object that will be checked if certain strings (relations) are present
// relations: profile, messages, groups
const prepareUsersSelectObj = (targetArray) => {
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
            updatedAt: true
          },
        }
      : undefined,
    messages: targetArray.includes("messages")
      ? {
          select: {
            publicId: true,
            content: true,
            sentAt: true,
            editedAt: true
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
                updatedAt: true
              }
            }
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
}

export { preparePatchData, preparePatchDataAlternative, prepareUsersSelectObj}