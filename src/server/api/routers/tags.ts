import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tagsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany({
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
  }),
  getForWord: publicProcedure
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
});
