import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const wordsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        search: z.string().nullable(),
        cursor: z.number().nullable(),
        tags: z.array(z.number()).nullable(),
      })
    )
    .query(({ ctx, input }) => {
      const { search, cursor, tags } = input;

      return ctx.prisma.record.findMany({
        orderBy: [
          {
            contentEn: "asc",
          },
        ],
        skip: cursor ? 1 : 0,
        take: 50,
        include: {
          tags: true,
        },

        ...(cursor
          ? {
              cursor: {
                id: cursor,
              },
            }
          : {}),
        ...(search
          ? {
              where: {
                OR: [
                  {
                    contentEn: {
                      contains: search,
                    },
                  },
                  {
                    contentMu: {
                      contains: search,
                    },
                  },
                ],
              },
            }
          : {}),
        ...(tags && tags.length > 0
          ? {
              where: {
                tags: {
                  some: {
                    id: {
                      in: tags,
                    },
                  },
                },
              },
            }
          : {}),
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
