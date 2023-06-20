import { AppRouter } from "@/server/root";
import { inferRouterOutputs } from "@trpc/server";
import ImageCard from "./ImageCard";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Category = RouterOutput["categories"]["getAllWithItemCount"][number];

type Props = {
  category: Category;
};

const CategoryCard = ({ category }: Props) => {
  return (
    <ImageCard
      title={category.name}
      imageURL={category.imageURL}
      content={`${category.itemCount} Items`}
      link={`/search?c=${category.name}`}
    />
  );
};

export default CategoryCard;
