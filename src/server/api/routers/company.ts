import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const companyRouter = createTRPCRouter({
  // Create a new company (ADMIN only)
  createCompany: adminProcedure
    .input(
      z.object({
        name: z.string().min(1, "Company name is required"),
        ethicsRating: z.number().int().min(1).max(5).optional(),
        priceRating: z.number().int().min(1).max(5).optional(),
        qualityServiceRating: z.number().int().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.create({
        data: {
          name: input.name,
          ethicsRating: input.ethicsRating,
          priceRating: input.priceRating,
          qualityServiceRating: input.qualityServiceRating,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  // Get all companies (Authenticated users)
  getAllCompanies: protectedProcedure.query(({ ctx }) => {
    return ctx.db.company.findMany({
      include: {
        products: {
          include: {
            product: true,
            // You can include more related data if needed
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }),

  // Get a company by ID (Authenticated users)
  getCompanyById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.company.findUnique({
        where: { id: input.id },
        include: {
          products: {
            include: {
              product: true,
              // Include more related data if necessary
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),

  // Update a company (ADMIN only)
  updateCompany: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        ethicsRating: z.number().int().min(1).max(5).optional(),
        priceRating: z.number().int().min(1).max(5).optional(),
        qualityServiceRating: z.number().int().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.update({
        where: { id: input.id },
        data: {
          name: input.name,
          ethicsRating: input.ethicsRating,
          priceRating: input.priceRating,
          qualityServiceRating: input.qualityServiceRating,
        },
      });
    }),

  // Delete a company (ADMIN only)
  deleteCompany: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.company.delete({
        where: { id: input.id },
      });
    }),
});