import { router } from "./trpc";
import { itemsRouter } from "./routers/items";
import { categoriesRouter } from "./routers/categories";

export const appRouter = router({
  items: itemsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
