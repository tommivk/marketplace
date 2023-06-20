import React, { useMemo } from "react";
import CategoryCard from "@/components/CategoryCard";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Carousel from "@/components/Carousel";
import ImageCard from "@/components/ImageCard";
import TypeWriter from "@/components/TypeWriter";
import SearchIcon from "@/components/SearchIcon";
import Head from "next/head";
import { getServerSideHelpers } from "@/server/utils";

export default function Home() {
  const { data: newestItems } = trpc.items.getNewest.useQuery();
  const { data: categories } = trpc.categories.getAllWithItemCount.useQuery();

  const router = useRouter();

  const itemCards = useMemo(
    () =>
      newestItems?.map(
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
      ),
    [newestItems]
  );

  const categoryCards = useMemo(
    () =>
      categories?.map((category) => (
        <CategoryCard category={category} key={category.id} />
      )),
    [categories]
  );

  const words = useMemo(
    () =>
      categories?.map((c) =>
        c.name == "Other" ? "Anything..." : `${c.name}...`
      ) ?? [],
    [categories]
  );

  return (
    <div className="mb-20 flex flex-col items-center">
      <Head>
        <title>Marketplace</title>
      </Head>
      <div className="mb-48 mt-48 w-[500px] max-w-full px-2">
        <div className="relative flex select-none flex-col flex-wrap gap-3 sm:ml-14 sm:flex-row">
          <h1 className="text-center text-4xl font-extrabold">Search For </h1>
          <TypeWriter words={words} />
        </div>

        <div className="relative mt-20">
          <SearchIcon className="absolute left-2 top-2 h-6 w-6 text-slate-800" />
          <input
            type="text"
            className="w-full rounded-lg px-12 py-2 text-black"
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
        <h1 className="mb-3 ml-2 text-2xl font-bold">Categories</h1>
        <div className="mb-16">
          <Carousel id={1} slides={categoryCards} />
        </div>

        <h1 className="mb-3 ml-2 text-2xl font-bold">Newest listings</h1>
        <Carousel id={2} slides={itemCards} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const helpers = getServerSideHelpers();
  await helpers.categories.getAllWithItemCount.prefetch();
  await helpers.items.getNewest.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
