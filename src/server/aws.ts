import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { SESClient } from "@aws-sdk/client-ses";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
};

const REGION = "eu-north-1";

const s3 = new S3Client({
  region: REGION,
  credentials,
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

const sesClient = new SESClient({
  region: REGION,
  credentials,
});

export const sendEmail = async ({
  toAddress,
  title,
  message,
}: {
  toAddress: string;
  title: string;
  message: string;
}) => {
  const command = new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      // ToAddresses: [toAddress],
      ToAddresses: ["success@simulator.amazonses.com"],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        Text: {
          Charset: "UTF-8",
          Data: "TEXT_FORMAT_BODY",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: title,
      },
    },
    Source: process.env.EMAIL_ADDRESS,
    ReplyToAddresses: [],
  });

  try {
    await sesClient.send(command);
    console.log("Email successfully sent");
    return true;
  } catch (e) {
    console.log(e);
    console.error("Failed to send email.");
    return false;
  }
};
