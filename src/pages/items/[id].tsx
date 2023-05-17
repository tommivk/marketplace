import { GetStaticProps, NextPage } from "next";
import { appRouter } from "@/server/root";
import { prisma } from "@/server/db";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Button from "@/components/Button";
import { useState } from "react";
import EmailModal from "@/components/EmailModal";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";

type Props = {
  itemId: string;
};

const ItemPage: NextPage<Props> = ({ itemId }) => {
  const [showNumber, setShowNumber] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const { user } = useClerk();

  const { data: item } = trpc.items.findById.useQuery({ itemId });
  const { mutate: deleteItem, isLoading: deleteLoading } =
    trpc.items.delete.useMutation({
      onSuccess: () => {
        toast.success("Listing successfully deleted");
        router.push("/");
      },
      onError: (e) => toast.error(e.message),
    });

  if (!item) return <div>404</div>;

  const contactDetails = item.contactDetails;
  const isUsersListing = user?.username === contactDetails.username;

  const togglePhoneNumber = () => {
    setShowNumber(!showNumber);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (confirmed) {
      deleteItem({ itemId });
    }
  };

  return (
    <div className="my-10 sm:my-20 px-4 pb-20">
      <EmailModal
        itemId={itemId}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />

      <div className="flex flex-col items-center max-w-2xl m-auto h-full bg-zinc-900 rounded-md">
        <div className="w-[800px] text-center mb-10 px-3 sm:px-10 max-w-full py-10">
          <div className="flex justify-between items-center mb-10 px-4">
            <h1 className="text-left text-lg sm:text-3xl break-words">
              {item.title}
            </h1>
            <h2 className="ml-4 text-lg sm:text-2xl min-w-fit mt-1 self-start text-zinc-400">
              {item.price} €
            </h2>
          </div>
          <Image
            alt={item.title}
            src={item.image.imageURL}
            width={500}
            height={0}
            priority={true}
            placeholder="empty"
            className="w-full h-auto object-contain"
          />
          <p className="text-left text-sm sm:text-base break-words mt-10 mx-auto px-4">
            {item.description}
          </p>
        </div>

        <div className="mt-auto">
          <h3 className="text-center mb-5">
            Listed by:{" "}
            <Link
              href={`/users/${contactDetails.username}`}
              className="capitalize text-blue-600 underline"
            >
              {contactDetails.username}
            </Link>
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {contactDetails.email && (
              <Button
                className="inline-block min-w-[220px]"
                color="secondary"
                disabled={isUsersListing}
                onClick={() => setModalOpen(true)}
              >
                Send Email
              </Button>
            )}
            {contactDetails.phoneNumber && (
              <Button
                className="inline-block min-w-[220px]"
                color="secondary"
                onClick={togglePhoneNumber}
              >
                {showNumber ? contactDetails.phoneNumber : "Show phone number"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {isUsersListing && (
        <div className="fixed w-full bottom-0 left-0 bg-zinc-900 bg-opacity-50">
          <Button
            onClick={handleDelete}
            color="danger"
            loading={deleteLoading}
            className="block mx-auto my-4"
          >
            Delete Listing
          </Button>
        </div>
      )}
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
