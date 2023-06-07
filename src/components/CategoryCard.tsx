import { AppRouter } from "@/server/root";
import { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/utils/trpc";
import ImageCard from "./ImageCard";
import Loading from "./Loading";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Category = RouterOutput["categories"]["getAll"][number];

type Props = {
  category: Category;
};

const CategoryCard = ({ category }: Props) => {
  const { data: itemCount, isLoading } = trpc.categories.getItemCount.useQuery({
    categoryId: category.id,
  });

  return (
    <ImageCard
      title={category.name}
      imageURL={category.imageURL}
      content={
        isLoading ? (
          <Loading size="sm" className="mt-2"></Loading>
        ) : (
          `${itemCount} Items`
        )
      }
      link={`/search?c=${category.name}`}
    />
  );
};

export default CategoryCard;
