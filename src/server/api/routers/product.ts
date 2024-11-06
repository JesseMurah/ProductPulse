import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";

// Define input types for better reuse and type safety
const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
});

const productIdSchema = z.object({
  id: z.string().uuid("Invalid product ID")
});

const productUpdateSchema = productIdSchema.extend({
  name: z.string().min(1, "Product name is required").optional(),
});

// Define the include object for reuse
const productInclude = {
  companies: {
    include: {
      company: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ProductInclude;

export const productRouter = createTRPCRouter({
  // Create a new product (ADMIN only)
  createProduct: adminProcedure
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.product.create({
          data: {
            name: input.name,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
          include: productInclude,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
          cause: error,
        });
      }
    }),

  // Get all products (Authenticated users)
  getAllProducts: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await ctx.db.product.findMany({
          include: productInclude,
          orderBy: { createdAt: 'desc' }, // Assuming you have a createdAt field
        });
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
          cause: error,
        });
      }
    }),

  // Get a product by ID (Authenticated users)
  getProductById: protectedProcedure
    .input(productIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: { id: input.id },
          include: productInclude,
        });

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch product',
          cause: error,
        });
      }
    }),

  // Update a product (ADMIN only)
  updateProduct: adminProcedure
    .input(productUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: { id: input.id },
        });

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }

        return await ctx.db.product.update({
          where: { id: input.id },
          data: {
            name: input.name,
          },
          include: productInclude,
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update product',
          cause: error,
        });
      }
    }),

  // Delete a product (ADMIN only)
  deleteProduct: adminProcedure
    .input(productIdSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: { id: input.id },
        });

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          });
        }

        return await ctx.db.product.delete({
          where: { id: input.id },
          include: productInclude,
        });
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete product',
          cause: error,
        });
      }
    }),
});