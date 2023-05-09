import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { appRouter } from "@/server/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import Image from "next/image";

const ItemPage: NextPage = ({
  itemId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: item } = trpc.items.findById.useQuery({ itemId });
  if (!item) return <div>404</div>;

  return (
    <div className="flex flex-col items-center max-w-2xl m-auto">
      <h1 className="text-4xl mb-10">{item.title}</h1>
      <Image
        alt={item.title}
        src={item.image.imageURL}
        height={200}
        width={600}
        className="w-auto"
      />
      <p className="m-4">{item.description}</p>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const itemId = context.params?.id as string;

  if (typeof itemId !== "string") {
    return {
      notFound: true,
    };
  }

  await helpers.items.findById.prefetch({ itemId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      itemId,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default ItemPage;
