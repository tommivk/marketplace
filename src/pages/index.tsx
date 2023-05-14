import React, { useMemo } from "react";
import CategoryCard from "@/components/CategoryCard";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/root";
import { prisma } from "@/server/db";
import superjson from "superjson";
import Carousel from "@/components/Carousel";
import ImageCard from "@/components/ImageCard";
import TypeWriter from "@/components/TypeWriter";
import SearchIcon from "@/components/SearchIcon";

export default function Home() {
  const { data: newestItems } = trpc.items.getNewest.useQuery();
  const { data: categories } = trpc.categories.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const router = useRouter();

  const itemCards = newestItems?.map(
    ({ id, title, description, price, image: { imageURL } }) => (
      <ImageCard
        key={id}
        link={`/items/${id}`}
        imageURL={imageURL}
        title={title}
        content={description}
        price={price}
      />
    )
  );
  const categoryCards = categories?.map((category) => (
    <CategoryCard category={category} key={category.id} />
  ));

  const words = useMemo(
    () =>
      categories?.map((c) =>
        c.name == "Other" ? "Anything..." : `${c.name}...`
      ) ?? [],
    [categories]
  );

  return (
    <div className="flex flex-col items-center mb-20">
      <div className="mt-48 mb-48 max-w-full w-[500px] px-2">
        <div className="relative flex flex-col sm:flex-row gap-3 flex-wrap sm:ml-14">
          <h1 className="text-4xl text-center font-extrabold">Search For </h1>
          <TypeWriter
            words={words}
            className="text-4xl text-center font-extrabold m-auto sm:ml-0 bg-gradient-to-r from-fuchsia-700 to-blue-400"
          />
        </div>

        <div className="relative mt-20">
          <SearchIcon className="w-6 h-6 absolute top-2 left-2 text-slate-800" />
          <input
            type="text"
            className="px-12 py-2 w-full rounded-lg text-black"
            placeholder="Search items..."
            autoComplete="off"
            onKeyDown={(e) => {
              const value = (e.target as HTMLInputElement).value?.trim();
              if (e.key === "Enter") {
                if (value === "") return;
                router.push({ pathname: `/search`, query: { query: value } });
              }
            }}
          />
        </div>
      </div>

      <div className="w-[220px] sm:w-[420px] md:w-[640px] lg:w-[860px] xl:w-[1080px]">
        <h1 className="font-bold text-2xl ml-2 mb-3">Categories</h1>
        <div className="mb-16">
          <Carousel id={1} slides={categoryCards} />
        </div>

        <h1 className="font-bold text-2xl ml-2 mb-3">Newest listings</h1>
        <Carousel id={2} slides={itemCards} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  await helpers.categories.getAll.prefetch();
  await helpers.items.getNewest.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
