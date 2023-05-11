import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { appRouter } from "@/server/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Button from "@/components/Button";
import { useState } from "react";

const ItemPage: NextPage = ({
  itemId,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [showNumber, setShowNumber] = useState(false);
  const { data: item } = trpc.items.findById.useQuery({ itemId });
  if (!item) return <div>404</div>;

  const contactDetails = item.contactDetails;

  const togglePhoneNumber = () => {
    setShowNumber(!showNumber);
  };

  return (
    <div className="my-20">
      <div className="flex flex-col items-center max-w-2xl m-auto h-full bg-zinc-900 px-20 py-10 rounded-md">
        <div className="text-center mb-20 w-full px-4">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl inline-block">{item.title}</h1>
            <h2 className="text-right text-2xl inline-block">{item.price} €</h2>
          </div>
          <div className="w-96 relative h-96 m-auto">
            <Image
              alt={item.title}
              src={item.image.imageURL}
              fill
              className="object-contain"
            />
          </div>
          <p className="text-left break-words w-96 m-auto">
            {item.description}
          </p>
        </div>

        <div className="mt-auto">
          <h3 className="text-center mb-5">
            Listed by:{" "}
            <span className="capitalize">{contactDetails.username}</span>
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            <Button className="inline-block" color="secondary" disabled>
              Send Email
            </Button>
            {contactDetails.phoneNumber && (
              <Button
                className="inline-block w-[220px]"
                color="secondary"
                onClick={togglePhoneNumber}
              >
                {showNumber ? contactDetails.phoneNumber : "Show phone number"}
              </Button>
            )}
          </div>
        </div>
      </div>
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
