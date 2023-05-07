import { trpc } from "@/utils/trpc";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/root";

dayjs.extend(relativeTime);

const SearchPage: NextPage = ({
  query,
  orderBy,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: items } = trpc.items.search.useQuery({
    query,
    orderBy,
  });

  const router = useRouter();

  const handleSearch = ({
    queryStr,
    sortByStr,
  }: {
    queryStr?: string;
    sortByStr?: string;
  }) => {
    router.push({
      pathname: "/search",
      query: {
        query: queryStr ?? query,
        orderBy: sortByStr ?? orderBy,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <div>
        <input
          type="text"
          defaultValue={query}
          className="px-4 py-2 w-[500px] rounded-lg mt-20 mb-10 text-black m-auto block"
          placeholder="Search items..."
          autoComplete="off"
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value.trim();
            if (value == "") return;
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch({ queryStr: value });
            }
          }}
        />
        <select
          defaultValue={"1"}
          onChange={(e) => {
            handleSearch({ sortByStr: e.target.value });
          }}
          className="ml-auto block bg-zinc-800 text-slate-200 text-sm px-5 py-2 outline-none rounded-md"
        >
          <option value={"1"}>Newest first</option>
          <option value={"2"}>Oldest first</option>
          <option value={"3"}>Highest price</option>
          <option value={"4"}>Lowest price</option>
        </select>
      </div>
      <ItemList items={items} />
    </div>
  );
};

type RouterOutput = inferRouterOutputs<AppRouter>;
type Item = RouterOutput["items"]["search"][number];

const ItemList = ({ items }: { items?: Item[] }) => {
  if (items?.length === 0) {
    return <p className="text-center mt-20">No items found</p>;
  }
  return (
    <ul className="max-w-2xl p-2 m-auto">
      {items?.map(({ id, title, price, createdAt, image: { imageURL } }) => (
        <li key={id} className="my-2 rounded-lg group">
          <Divider />
          <Link href={`/items/${id} `}>
            <div className="flex">
              <ItemImage imageURL={imageURL} />
              <ItemContent title={title} price={price} createdAt={createdAt} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

const ItemImage = ({ imageURL }: { imageURL: string }) => {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <Image
        src={imageURL}
        height={165}
        width={165}
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
}: {
  title: string;
  price: number;
  createdAt: Date;
}) => {
  return (
    <div className="w-full px-2 ml-2 flex flex-col">
      <h1 className="text-lg">{title}</h1>
      <p className="text-2xl">{price} €</p>
      <p className="mt-auto mb-2 text-xs text-zinc-500">
        {dayjs().to(createdAt)}
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query = "", orderBy = "1" } = ctx.query;
  return {
    props: { query, orderBy },
  };
};

export default SearchPage;
