import { router } from "./trpc";
import { itemsRouter } from "./routers/items";
import { categoriesRouter } from "./routers/categories";
import { usersRouter } from "./routers/users";
import { emailRouter } from "./routers/email";

export const appRouter = router({
  users: usersRouter,
  items: itemsRouter,
  categories: categoriesRouter,
  emails: emailRouter,
});

export type AppRouter = typeof appRouter;
