import { prisma } from "@repo/database"

export const createNewUser = async(email, hash, first_name, last_name) => {
  const newUser = await prisma.user.create({
    data: {
      email: email,
      hash: hash,
      addtl: first_name
    }
  })
  return newUser;
}