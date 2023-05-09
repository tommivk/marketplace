import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const bucket = process.env.AWS_BUCKET_NAME ?? "";

export const createPresignedPOSTLink = async ({
  contentLength,
  userId,
}: {
  contentLength: number;
  userId: string;
}) => {
  const fileName = uuidv4();

  const params = {
    Bucket: bucket,
    ContentType: "image/jpeg",
    Key: `${userId}/${fileName}`,
    ContentLength: contentLength,
  };

  const command = new PutObjectCommand(params);
  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 30 });

  return { uploadURL, fileName };
};

export const fileExists = async (key: string): Promise<boolean> => {
  const params = {
    Key: key,
    Bucket: bucket,
  };
  const command = new HeadObjectCommand(params);
  try {
    await s3.send(command);
    return true;
  } catch (e) {
    return false;
  }
};
