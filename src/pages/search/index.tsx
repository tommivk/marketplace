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
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: items } = trpc.items.search.useQuery({
    query,
  });

  const router = useRouter();
  console.log(items);
  return (
    <div>
      <input
        type="text"
        defaultValue={query}
        className="px-4 py-2 w-[500px] rounded-lg mt-20 mb-10 text-black m-auto block"
        placeholder="Search items..."
        autoComplete="off"
        onKeyDown={(e) => {
          console.log({ e });
          const value = (e.target as HTMLInputElement).value.trim();
          if (value == "") return;
          if (e.key === "Enter") {
            router.push({
              pathname: `/search`,
              query: { query: value },
            });
          }
        }}
      />
      <ItemList items={items} />
    </div>
  );
};

type RouterOutput = inferRouterOutputs<AppRouter>;
type Item = RouterOutput["items"]["search"][number];

const ItemList = ({ items }: { items?: Item[] }) => {
  return (
    <ul className="max-w-2xl p-2 m-auto">
      {items?.map(({ id, title, price, createdAt, image: { imageURL } }) => (
        <li key={id} className="mx-auto my-2 max-w-xl rounded-lg group">
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
  const { query } = ctx.query;
  return {
    props: { query },
  };
};

export default SearchPage;
