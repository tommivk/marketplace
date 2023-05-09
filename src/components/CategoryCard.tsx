import { AppRouter } from "@/server/root";
import { inferRouterOutputs } from "@trpc/server";
import ImageCard from "./ImageCard";
import { trpc } from "@/utils/trpc";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Category = RouterOutput["categories"]["getAll"][number];

type Props = {
  category: Category;
};

const CategoryCard = ({ category }: Props) => {
  const { data: itemCount, isLoading: itemCountLoading } =
    trpc.categories.getItemCount.useQuery({
      categoryId: category.id,
    });

  return (
    <ImageCard
      title={category.name}
      imageURL={category.imageURL}
      content={itemCountLoading ? "" : `${itemCount} Items`}
      link={`/search?c=${category.name}`}
    />
  );
};

export default CategoryCard;
