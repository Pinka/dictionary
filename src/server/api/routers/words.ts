import { z } from "zod";
import S3 from "aws-sdk/clients/s3";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const s3 = new S3({
  accessKeyId: process.env.DICTIONARY_ACCESS_KEY_ID,
  secretAccessKey: process.env.DICTIONARY_SECRET_ACCESS_KEY,
  region: process.env.DICTIONARY_REGION,
});

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
          recordAudio: true,
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
  getS3UploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { fileName, fileType } = input;

      const s3Params = {
        Bucket: process.env.DICTIONARY_BUCKET_NAME,
        Key: fileName,
        Expires: 5 * 60,
        ContentType: fileType,
      };

      const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

      return uploadURL;
    }),

  saveAudio: protectedProcedure
    .input(
      z.object({
        wordId: z.number(),
        url: z.string(),
        fileName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { wordId, fileName } = input;

      const record = await ctx.prisma.record.findUnique({
        where: {
          id: wordId,
        },
      });

      if (!record) {
        throw new Error("Record not found");
      }

      return ctx.prisma.record.update({
        where: {
          id: wordId,
        },
        data: {
          recordAudio: {
            create: {
              url: "/api/files?id=" + fileName,
              fileName,
            },
          },
        },
      });
    }),
});
