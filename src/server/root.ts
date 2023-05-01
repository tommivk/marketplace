import { router } from "./trpc";
import { usersRouter } from "./routers/users";
import { itemsRouter } from "./routers/items";
import { categoriesRouter } from "./routers/categories";

export const appRouter = router({
  users: usersRouter,
  items: itemsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
