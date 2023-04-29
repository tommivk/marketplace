import { router } from "./trpc";
import { usersRouter } from "./routers/users";
import { itemsRouter } from "./routers/items";

export const appRouter = router({
  users: usersRouter,
  items: itemsRouter,
});

export type AppRouter = typeof appRouter;
