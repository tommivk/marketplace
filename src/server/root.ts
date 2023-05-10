import { router } from "./trpc";
import { itemsRouter } from "./routers/items";
import { categoriesRouter } from "./routers/categories";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  users: usersRouter,
  items: itemsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
