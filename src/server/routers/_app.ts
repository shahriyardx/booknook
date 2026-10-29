import { router } from "../trpc";
import { booksRouter } from "./books";
import { borrowsRouter } from "./borrows";

export const appRouter = router({ books: booksRouter, borrows: borrowsRouter });

export type AppRouter = typeof appRouter;
