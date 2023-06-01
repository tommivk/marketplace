import { GetStaticProps, NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { locationDataSchema } from "@/schema";
import { z } from "zod";
import { useRouter } from "next/router";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { getServerSideHelpers } from "@/server/utils";
import Image from "next/image";
import Button from "@/components/Button";
import EmailModal from "@/components/EmailModal";
import Link from "next/link";
import toast from "react-hot-toast";
import Head from "next/head";
import React from "react";
import Map from "@/components/Map";

type Props = {
  itemId: string;
};

const ItemPage: NextPage<Props> = ({ itemId }) => {
  const [locationString, setLocationString] = useState("");
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

  type LocationData = z.infer<typeof locationDataSchema>;

  const handleLocationChange = ({ locationString }: LocationData) => {
    setLocationString(locationString);
  };

  return (
    <div className="my-10 flex flex-wrap justify-center gap-5 px-4 pb-20 sm:my-20">
      <EmailModal
        itemId={itemId}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />

      <Head>
        <title>{item.title}</title>
      </Head>

      <div className="mx-20 flex h-full w-[700px] max-w-full flex-col items-center rounded-md bg-zinc-900">
        <div className="mb-10 w-[800px] max-w-full px-3 py-10 text-center sm:px-10">
          <div className="mb-10 flex items-center justify-between px-4">
            <h1 className="break-words text-left text-lg sm:text-3xl">
              {item.title}
            </h1>
            <h2 className="ml-4 mt-1 min-w-fit self-start text-lg text-zinc-400 sm:text-2xl">
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
            className="h-auto w-full object-contain"
          />
          <p className="mx-auto mt-10 break-words px-4 text-left text-sm sm:text-base">
            {item.description}
          </p>
        </div>

        <div className="mt-auto">
          <h3 className="mb-5 text-center">
            Listed by:{" "}
            <Link
              href={`/users/${contactDetails.username}`}
              className="capitalize text-blue-600 underline"
            >
              {contactDetails.username}
            </Link>
          </h3>
          <div className="mb-10 flex flex-wrap justify-center gap-4">
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
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 bg-opacity-50">
          <Button
            onClick={handleDelete}
            color="danger"
            loading={deleteLoading}
            className="mx-auto my-4 block"
          >
            Delete Listing
          </Button>
        </div>
      )}
      {item.location && (
        <div className="h-fit max-w-full rounded-lg bg-zinc-900 p-5">
          <h1 className="mb-5 text-center text-xl">Item Location</h1>
          <Map
            height={450}
            width={370}
            lat={item.location.lat}
            lng={item.location.lng}
            onLocationChange={handleLocationChange}
          />
          <p className="mt-5 text-center">{locationString}</p>
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const itemId = context.params?.id as string;

  if (typeof itemId !== "string") {
    return {
      notFound: true,
    };
  }

  const helpers = getServerSideHelpers();
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
