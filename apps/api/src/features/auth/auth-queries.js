import { prisma } from "@repo/database"

export const createNewUser = async(email, hash, first_name, last_name) => {
  const newUser = await prisma.user.create({
    data: {
      email: email,
      hash: hash,
      firstName: first_name,
      lastName: last_name,
    }
  })
  return newUser;
}