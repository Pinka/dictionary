import type { NextApiRequest, NextApiResponse } from "next";
import S3, { type GetObjectRequest } from "aws-sdk/clients/s3";

const s3 = new S3({
  accessKeyId: process.env.DICTIONARY_ACCESS_KEY_ID,
  secretAccessKey: process.env.DICTIONARY_SECRET_ACCESS_KEY,
  region: process.env.DICTIONARY_REGION,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: "Missing id" });
        }

        if (!process.env.DICTIONARY_BUCKET_NAME) {
          return res.status(500).json({ error: "Missing bucket name" });
        }

        const key = id.toString();

        // get file from s3 bucket
        const params: GetObjectRequest = {
          Bucket: process.env.DICTIONARY_BUCKET_NAME,
          Key: key,
          ResponseCacheControl: "public, max-age=31536000, immutable",
        };

        const file = await s3.getObject(params).promise();

        console.log("File", file);

        return (
          res
            .status(200)
            .setHeader(
              "Content-Type",
              file.ContentType ?? "audio/webm;codecs=opus"
            )
            //   .setHeader("Cache-Control", "public, s-maxage=10000000")
            .send(file.Body)
        );
      } catch (e) {
        console.error("Request error", e);
        return res.status(500).json({ error: "Error fetching file" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method ?? "undefined"} Not Allowed`);
      break;
  }
}
