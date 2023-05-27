import { createTRPCRouter } from "~/server/api/trpc";
import { wordsRouter } from "~/server/api/routers/words";
import { tagsRouter } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  words: wordsRouter,
  tags: tagsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
