import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// run with: npx prisma db seed

async function main() {
  const categories = [
    { name: "Cars", imageURL: "/category/car.jpg" },
    { name: "Guitars", imageURL: "/category/guitar.jpg" },
    { name: "Potatoes", imageURL: "/category/potato.jpg" },
    { name: "Bikes", imageURL: "/category/bike.jpg" },
    { name: "Other", imageURL: "/category/other.jpg" },
  ];

  for (let category of categories) {
    await prisma.category.create({
      data: { ...category },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
