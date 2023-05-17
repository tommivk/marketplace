import { GetServerSideProps, NextPage } from "next";
import { appRouter } from "@/server/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { trpc } from "@/utils/trpc";
import { getUserByUserName } from "@/server/utils";
import { useClerk } from "@clerk/nextjs";
import superjson from "superjson";
import ImageCard from "@/components/ImageCard";

type Props = {
  username: string;
  userId: string;
};

const UserPage: NextPage<Props> = ({ username, userId }) => {
  const { user } = useClerk();
  const { data } = trpc.items.getItemsByUser.useQuery({ userId });

  return (
    <div className="max-w-7xl m-auto">
      <h1 className="text-2xl text-center m-10 font-bold">
        {username === user?.username ? (
          "Your items"
        ) : (
          <>
            Items listed by <span className="capitalize">{username}</span>
          </>
        )}
      </h1>
      {data && data?.length === 0 && (
        <p className="text-center">You have not listed any items yet</p>
      )}
      <div className="flex flex-wrap gap-2 justify-center">
        {data?.map(({ id, title, description, price, image: { imageURL } }) => (
          <ImageCard
            key={id}
            link={`/items/${id}`}
            imageURL={imageURL}
            title={title}
            content={description}
            price={price}
          />
        ))}
        <div className="w-[200px] h-0 m-2" />
        <div className="w-[200px] h-0 m-2" />
        <div className="w-[200px] h-0 m-2" />
        <div className="w-[200px] h-0 m-2" />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const username = context.params?.slug;
  if (typeof username !== "string") {
    return {
      notFound: true,
    };
  }

  const user = await getUserByUserName(username);

  if (!user) {
    return {
      notFound: true,
    };
  }

  const userId = user.id;

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  await helpers.items.getItemsByUser.prefetch({ userId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username: user.username,
      userId,
    },
  };
};

export default UserPage;
