// src/server/api/routers/productAvailability.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const productAvailabilityRouter = createTRPCRouter({
  // Set product availability (ADMIN only)
  setAvailability: adminProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        productId: z.string().uuid(),
        status: z.enum(["AVAILABLE", "NOT_AVAILABLE", "UNKNOWN"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the ProductAvailability record exists
      const existing = await ctx.db.productAvailability.findUnique({
        where: {
          companyId_productId: {
            companyId: input.companyId,
            productId: input.productId,
          },
        },
      });

      if (existing) {
        // Update existing record
        return ctx.db.productAvailability.update({
          where: { companyId_productId: { companyId: input.companyId, productId: input.productId } },
          data: { status: input.status },
        });
      } else {
        // Create new record
        return ctx.db.productAvailability.create({
          data: {
            company: { connect: { id: input.companyId } },
            product: { connect: { id: input.productId } },
            status: input.status,
          },
        });
      }
    }),

  // Get availability for a specific product within a company (Authenticated users)
  getAvailability: protectedProcedure
    .input(
      z.object({
        companyId: z.string().uuid(),
        productId: z.string().uuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.productAvailability.findUnique({
        where: {
          companyId_productId: {
            companyId: input.companyId,
            productId: input.productId,
          },
        },
      });
    }),
});
