import React from "react";
import CategoryCard from "@/components/CategoryCard";
import ImageCard from "@/components/ImageCard";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function Home() {
  const { data: allItems } = trpc.items.getNewest.useQuery();
  const { data: categories } = trpc.categories.getAll.useQuery();

  const router = useRouter();

  return (
    <div className="flex flex-col items-center">
      <div className="mt-48 mb-48">
        <h1 className="text-4xl text-center font-extrabold">
          Search For{" "}
          <span className="text-transparent text-4xl bg-clip-text bg-gradient-to-r from-fuchsia-700 to-blue-400">
            ANYTHING
          </span>
        </h1>
        <input
          type="text"
          className="px-4 py-2 w-[500px] rounded-lg mt-20 text-black"
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

      <div>
        <h1 className="font-bold text-2xl ml-2 mb-3">Categories</h1>
        <div className="flex flex-wrap mb-16">
          {categories?.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>

        <h1 className="font-bold text-2xl ml-2 mb-3">Newest listings</h1>
        <div className="flex flex-wrap">
          {allItems?.map(({ id, title, description, image, price }) => (
            <ImageCard
              key={id}
              link={`/items/${id}`}
              imageURL={image.imageURL}
              title={title}
              content={description}
              price={price}
            />
          ))}
        </div>
        <Link href={"/create"}>Create new listing</Link>
      </div>
    </div>
  );
}
