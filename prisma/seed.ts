import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// run with: npx prisma db seed

async function main() {
  const categories = ["Cars", "Guitars", "Potatoes", "Other"];

  categories.map(async (name) => {
    await prisma.category.create({
      data: { name },
    });
  });
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
