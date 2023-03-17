import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const wordsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({ search: z.string().nullable(), cursor: z.number().nullable() })
    )
    .query(({ ctx, input }) => {
      const { search, cursor } = input;

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
      });
    }),

  getTagsForWord: publicProcedure
    .input(z.object({ wordId: z.number().nullable() }))
    .query(({ ctx, input }) => {
      if (input.wordId) {
        return ctx.prisma.tag.findMany({
          where: {
            records: {
              some: {
                id: input.wordId,
              },
            },
          },
          orderBy: [
            {
              name: "asc",
            },
          ],
        });
      }

      return ctx.prisma.tag.findMany({
        orderBy: [
          {
            name: "asc",
          },
        ],
      });
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
