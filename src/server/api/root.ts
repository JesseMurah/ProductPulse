// import { postRouter } from "@/server/api/routers/post";
import { companyRouter } from "@/server/api/routers/company";
import { productRouter } from "@/server/api/routers/product";
import { productAvailabilityRouter } from "@/server/api/routers/productAvailability";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  company: companyRouter,
  product: productRouter,
  productAvailability: productAvailabilityRouter,
  // post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
