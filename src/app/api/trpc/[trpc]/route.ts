import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { type NextRequest } from "next/server";
import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { NextApiRequest, NextApiResponse } from "next";


/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  return createTRPCContext({
    req,
    res,
  });
};

// const handler = async (req: NextApiRequest, res: NextApiResponse) =>
//   fetchRequestHandler({
//     endpoint: "/api/trpc",
//     req,
//     res,
//     router: appRouter,
//     createContext: () => createContext({ req, res }),
//     onError:
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       env.NODE_ENV === "development"
//         ? ({ path, error }) => {
//           console.error(
//             `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
//           );
//         }
//         : undefined,
//   });

export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
        console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
      }
      : undefined,
});

// export { handler as GET, handler as POST };
