import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export const createPresignedPOSTLink = async (contentLength: number) => {
  const fileName = uuidv4();

  const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME ?? "",
    ContentType: "image/jpeg",
    Key: `${userId}/${fileName}`,
    ContentLength: contentLength,
  };

  const command = new PutObjectCommand(params);
  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 30 });

  return { uploadURL, fileName };
};
