import { prisma } from "./client.js";
import * as passwordUtils from "./utils/passwordUtils.js";

async function main(){
//   const startTime = new Date('2026-09-02T07:04:00Z');
//   const endTime = new Date('2026-09-02T07:04:30Z');

//   const startMs = startTime.getTime();
//   const endMs = endTime.getTime();

//   const diffms = Math.abs(endMs - startMs);


//   await prisma.image.upsert({
//     where: { id: 1},
//     update: {},
//     create: {
//       name: "Birthday Boy",
//       url: "https://cdn.pixabay.com/photo/2024/06/25/09/41/birthday-8852344_1280.png",
//       OriginalWidth: 1280,
//       OriginalHeight: 1280,
//       additionalInfo: "A picture that shows a 2d image of a man surrounded by different thing such as stars, candles, and a birthday cake",
//       tags: {
//         create: [
//           { name: "Star 1", x: 442 , y: 366 },
//           { name: "Star 2", x: 280 , y: 859 },
//           { name: "Star 3", x: 849 , y: 828 },
//           { name: "Cake", x: 290, y: 437}
//         ]
//       },
//       scores: {
//         create: [
//           { startTime: startTime, endTime: endTime, finalTime: parseFloat(diffms / 1000)}
//         ]
//       }
//     }
//   })

  const password = "admin";
  const resultHash = await passwordUtils.genPassword(password);
  const hashedPassword = resultHash.hash;

  await prisma.user.upsert({
    where: { 
      email: "firstuser@gmail.com"
    },
    update: {
      email: "firstuser@gmail.com",
      hash: hashedPassword,
      addtl: "Test additional info, a seeded first user created",
      isAdmin: true,
      profile: {
        upsert: {
          where: { userId: 1 },
          update: {
            name: "First User",
            pronouns: "him/his",
            bio: "Test bio about this user",
          },
          create: {
            name: "First User",
            pronouns: "him/his",
            bio: "Test bio about this user",
          }
        }
      }    
    },
    create: {
      email: "firstuser@gmail.com",
      hash: hashedPassword,
      addtl: "Test additional info, a seeded first user created",
      isAdmin: true,
      profile: {
        create: {
          name: "First User",
          pronouns: "him/his",
          bio: "Test bio about this user",
        }
      }
    }
  })

  // await prisma.profile.upsert({
  //   where: { id: 1 },
  //   update: {
  //     name: "First User",
  //     pronouns: "him/his",
  //     bio: "Test bio about this user",
  //     userId: 1
  //   },
  //   create: {
  //     id: 1,
  //     name: "First User",
  //     pronouns: "him/his",
  //     bio: "Test bio about this user",
  //     userId: 1
  //   }
  // })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })