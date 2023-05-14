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

dayjs.extend(relativeTime);

const LIMIT = 20;

type Props = {
  query: string;
  orderBy: string;
  c: string;
  page: number;
};

const SearchPage: NextPage<Props> = ({ query, orderBy, c, page }) => {
  const { data: categories } = trpc.categories.getAll.useQuery();
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

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-2">
      <div>
        <form>
          <div className="flex flex-wrap items-center justify-center mt-20 mb-20 gap-2">
            <input
              type="text"
              ref={inputRef}
              defaultValue={query}
              className="px-4 py-3 w-[300px] rounded-lg bg-zinc-800 text-slate-200 block text-sm"
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
            <div className="flex gap-2">
              <select
                ref={categoryRef}
                className="block bg-zinc-800 text-slate-200 text-sm px-3 py-3 outline-none rounded-md"
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
              defaultValue={"1"}
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
              className="ml-auto mr-2 block bg-zinc-800 text-slate-200 text-sm px-5 py-2 outline-none rounded-md"
            >
              <option value={"1"}>Newest first</option>
              <option value={"2"}>Oldest first</option>
              <option value={"3"}>Highest price</option>
              <option value={"4"}>Lowest price</option>
            </select>
          </div>
        )}
      </div>
      <ItemList items={items} />
      <Pagination
        query={query}
        orderBy={orderBy}
        c={c}
        page={page}
        searchCount={searchCount}
      />
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
    <div className="flex justify-between items-center mt-4 mb-10">
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
    return <p className="text-center mt-20">No items found</p>;
  }
  return (
    <ul className="max-w-2xl p-2 m-auto">
      {items?.map(
        ({
          id,
          title,
          price,
          createdAt,
          category: { name: category },
          image: { imageURL },
        }) => (
          <li key={id} className="my-2 rounded-lg group">
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
    <div className="min-w-max relative overflow-hidden rounded-lg">
      <Image
        src={imageURL}
        height={150}
        width={150}
        alt={"item"}
        className="object-cover rounded-lg group-hover:scale-[103%] duration-300 aspect-square"
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
    <div className="px-2 ml-2 flex flex-col">
      <h1 className="text-lg break-all">{title}</h1>
      <p className="text-2xl">{price} €</p>
      <p className="text-zinc-300">{category}</p>
      <p className="mt-auto mb-2 text-xs text-zinc-500">
        {dayjs().to(createdAt)}
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query = "", orderBy = "1", c = "", page = 1 } = ctx.query;
  return {
    props: { query, orderBy, c, page: Number(page) },
  };
};

export default SearchPage;
