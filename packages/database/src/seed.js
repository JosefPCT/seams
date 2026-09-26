import { prisma } from "./client.js";

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

  await prisma.user.upsert({
    where: { id: 1},
    update: {
      username: "First Test User",
      hash: "Test hash password",
      addtl: "Test additional info"    
    },
    create: {
      username: "First Test User",
      hash: "Test hash password",
      addtl: "Test additional info"
    }
  })

}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })