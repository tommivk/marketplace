import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// run with: npx prisma db seed

async function main() {
  const baseURL = "https://tommivk-marketplace.imgix.net";

  const categories = [
    { name: "Cars", imageURL: `${baseURL}/car.jpg` },
    { name: "Guitars", imageURL: `${baseURL}/guitar.jpg` },
    { name: "Potatoes", imageURL: `${baseURL}/potato.jpg` },
    { name: "Bikes", imageURL: `${baseURL}/bike.jpg` },
    { name: "Other", imageURL: `${baseURL}/other.jpg` },
  ];

  for (let category of categories) {
    const d = await prisma.category.create({
      data: { ...category },
    });
    console.log(d);
  }
  // const images = [
  //   "1104cd36-2ae4-457f-928b-d832fd7ebc8c",
  //   "12109de0-c480-40b1-9b22-2af0cef5e8be",
  //   "37128cf4-5504-4c74-aa5b-2ccf42437f6f",
  //   "9b07380a-afd8-4f3e-9150-1144858e7b7a",
  //   "d7f03b61-fec3-4ab4-8303-82298fd55c09",
  //   "e2275bb2-69a4-47c9-84f6-9b03723b26dc",
  //   "eda662dd-3d18-459d-9bfb-120dcf12225f",
  // ];
  // const userId = "user_2P6kzCpBDk75VhanewD6kXe2eKf";

  // const text = `Nunc rutrum molestie accumsan. Duis ac risus sit amet elit pulvinar sagittis sed ac purus.
  //   Nulla tempus ligula vitae sem ultrices, non ultricies neque lacinia. Curabitur feugiat, ante at feugiat gravida,
  //   elit sapien posuere justo, eu euismod orci mi ut ex. Donec dignissim turpis sit amet tincidunt vulputate.
  //   Cras eget nisl mattis, mollis lectus quis, tincidunt odio. Integer posuere eu augue nec tristique. Vestibulum pretium,
  //   sapien eu elementum pulvinar, velit mauris vehicula nunc, et malesuada enim ipsum non metus. Cras venenatis est quis diam mattis,
  //   vitae auctor augue ultricies. Nulla vitae ultricies tortor. Vivamus consectetur sollicitudin odio, at vestibulum diam molestie sed.
  //   Integer consequat ex a lorem vehicula, quis semper quam rhoncus. Curabitur imperdiet, ligula ut semper aliquet, ipsum nisi dapibus metus,
  //   id blandit nulla ligula quis mi. Aliquam venenatis eget sapien nec scelerisque. Aliquam nec leo tincidunt, sodales augue sed, dignissim turpis.
  //   Donec pulvinar, urna ut consectetur tempor, nibh dolor euismod mi, vitae viverra velit mauris quis quam.`;
  // const lorem = text.split(" ").filter((a) => a !== "" && a !== " ");

  // for (let i = 0; i < 120; i++) {
  //   const image = `${userId}/${images[Math.floor(Math.random() * 7)]}`;
  //   const category = categories[Math.floor(Math.random() * 5)].name;
  //   const categoryId = (
  //     await prisma.category.findFirst({ where: { name: category } })
  //   )?.id;

  //   const { id: imageId } = await prisma.image.create({
  //     data: {
  //       authorId: userId,
  //       imageURL: `https://tommivk-marketplace.imgix.net/${image}`,
  //     },
  //   });
  //   await prisma.item.create({
  //     data: {
  //       authorId: userId,
  //       description: text,
  //       categoryId: categoryId ?? "",
  //       title: lorem[Math.floor(Math.random() * lorem.length)].replace(".", ""),
  //       imageId,
  //       price: Math.floor(Math.random() * 20000),
  //     },
  //   });
  // }
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
