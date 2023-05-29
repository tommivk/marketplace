import { trpc } from "@/utils/trpc";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/root";
import { FormEvent, useRef } from "react";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import SearchIcon from "@/components/SearchIcon";
import Head from "next/head";
import { getServerSideHelpers } from "@/server/utils";

dayjs.extend(relativeTime);

const LIMIT = 8;

type Props = {
  query: string;
  orderBy: string;
  c: string;
  page: number;
};

const SearchPage: NextPage<Props> = ({ query, orderBy, c, page }) => {
  const { data: categories } = trpc.categories.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const { data, isLoading } = trpc.items.search.useQuery({
    query,
    orderBy,
    c,
    page,
    limit: LIMIT,
  });

  const items = data?.items;
  const searchCount = data?.searchCount;

  const categoryRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const inputValue = inputRef.current?.value;
    const selectValue = categoryRef.current?.value;
    router.push({
      pathname: "/search",
      query: {
        query: inputValue ?? query,
        orderBy,
        c: selectValue ?? c,
      },
    });
  };

  return (
    <div className="mx-auto max-w-2xl p-2">
      <Head>
        <title>Search</title>
      </Head>
      <div>
        <form>
          <div className="mb-20 mt-20 flex flex-wrap items-center justify-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-2.5 h-6 w-6 text-slate-200" />
              <input
                type="text"
                ref={inputRef}
                defaultValue={query}
                className="w-[300px] rounded-lg bg-zinc-800 px-11 py-3 text-sm text-slate-200"
                placeholder="Search items..."
                autoComplete="off"
                onKeyDown={(e) => {
                  const value = (e.target as HTMLInputElement).value.trim();
                  if (value == "") return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <select
                ref={categoryRef}
                className="block rounded-md bg-zinc-800 px-3 py-3 text-sm text-slate-200 outline-none"
                defaultValue={c}
              >
                <option value={""}>All categories</option>
                {categories?.map(({ id, name }) => (
                  <option key={id} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(e);
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </form>

        {items && items.length > 0 && (
          <div className="flex items-center">
            <p className="ml-2 text-zinc-400">
              {searchCount} {searchCount === 1 ? "item" : "items"} found
            </p>
            <select
              defaultValue={orderBy ?? "1"}
              onChange={(e) => {
                e.preventDefault();
                router.push({
                  pathname: "/search",
                  query: {
                    query,
                    orderBy: e.target.value,
                    c,
                  },
                });
              }}
              className="ml-auto mr-2 block rounded-md bg-zinc-800 px-5 py-2 text-sm text-slate-200 outline-none"
            >
              <option value={"1"}>Newest first</option>
              <option value={"2"}>Oldest first</option>
              <option value={"3"}>Highest price</option>
              <option value={"4"}>Lowest price</option>
            </select>
          </div>
        )}
      </div>
      {isLoading ? (
        <Loading className="mt-40" />
      ) : (
        <>
          <ItemList items={items} />
          <Pagination
            query={query}
            orderBy={orderBy}
            c={c}
            page={page}
            searchCount={searchCount}
          />
        </>
      )}
    </div>
  );
};

const Pagination = ({
  searchCount,
  page,
  orderBy,
  c,
  query,
}: {
  searchCount?: number;
  page: number;
  orderBy: string;
  c: string;
  query: string;
}) => {
  const router = useRouter();

  if (!searchCount) return <></>;

  const pages = Math.ceil(searchCount / LIMIT);

  return (
    <div className="mb-10 mt-4 flex items-center justify-between">
      <Button
        color="secondary"
        className="disabled:opacity-0"
        disabled={page === 1}
        onClick={() => {
          router.push({
            pathname: "/search",
            query: {
              query,
              orderBy,
              c,
              page: page - 1,
            },
          });
        }}
      >
        Previous Page
      </Button>

      <p className="text-zinc-400">
        Page {page}/{pages}
      </p>

      <Button
        color="secondary"
        className="disabled:opacity-0"
        disabled={page == pages}
        onClick={() => {
          router.push({
            pathname: "/search",
            query: {
              query,
              orderBy,
              c,
              page: page + 1,
            },
          });
        }}
      >
        Next Page
      </Button>
    </div>
  );
};

type RouterOutput = inferRouterOutputs<AppRouter>;
type Item = RouterOutput["items"]["search"]["items"][number];

const ItemList = ({ items }: { items?: Item[] }) => {
  if (items?.length === 0) {
    return <p className="mt-40 text-center">No items found</p>;
  }
  return (
    <ul className="m-auto max-w-2xl p-2">
      {items?.map(
        ({
          id,
          title,
          price,
          createdAt,
          category: { name: category },
          image: { imageURL },
        }) => (
          <li key={id} className="group my-2 rounded-lg">
            <Divider />
            <Link href={`/items/${id} `}>
              <div className="flex w-full">
                <ItemImage imageURL={imageURL} />
                <ItemContent
                  title={title}
                  price={price}
                  createdAt={createdAt}
                  category={category}
                />
              </div>
            </Link>
          </li>
        )
      )}
    </ul>
  );
};

const ItemImage = ({ imageURL }: { imageURL: string }) => {
  return (
    <div className="relative min-w-max overflow-hidden rounded-lg">
      <Image
        src={imageURL}
        height={150}
        width={150}
        alt={"item"}
        className="aspect-square rounded-lg object-cover duration-300 group-hover:scale-[103%]"
      />
    </div>
  );
};

const Divider = () => {
  return <hr className="my-3 border-zinc-600" />;
};

const ItemContent = ({
  title,
  price,
  createdAt,
  category,
}: {
  title: string;
  price: number;
  createdAt: Date;
  category: string;
}) => {
  return (
    <div className="ml-2 flex flex-col px-2">
      <h1 className="break-all text-lg">{title}</h1>
      <p className="text-2xl">{price} €</p>
      <p className="text-zinc-300">{category}</p>
      <p className="mb-2 mt-auto text-xs text-zinc-500">
        {dayjs().to(createdAt)}
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query = "", orderBy = "1", c = "", page = 1 } = ctx.query;

  const helpers = getServerSideHelpers();
  await helpers.categories.getAll.prefetch();

  return {
    props: {
      query,
      orderBy,
      c,
      page: Number(page),
      trpcState: helpers.dehydrate(),
    },
  };
};

export default SearchPage;
