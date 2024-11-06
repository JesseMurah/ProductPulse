/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { type Session } from "next-auth";

import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/server/auth/config";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * 1. CONTEXT
 */
export const createTRPCContext = async ({
                                          req,
                                          res,
                                        }: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const session = await getServerSession(req, res, authConfig);

  return {
    db,
    session: session
      ? {
        user: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          id: session.user?.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          role: session.user?.role || "USER",
        },
      }
      : null,
    headers: req.headers,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// export const createTRPCContext = async (opts: { headers: Headers }) => {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
//   const session = await auth();
//
//   return {
//     db,
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     session,
//     ...opts,
//   };
// };
//
// type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

/**
 * Public (unauthenticated) procedure
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * Middleware to check if user has ADMIN role
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have access to this resource."
    });
  }

  return next({
    ctx: {
      session: ctx.session as Session & { user: { role: "ADMIN" } },
    },
  });
});

/**
 * Admin procedure
 */

export const adminProcedure = protectedProcedure.use(isAdmin);