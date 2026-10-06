import { Injectable } from "@nestjs/common";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

@Injectable()
export class StorageService {
  private s3?: S3Client;
  private bucket?: string;
  private publicUrl?: string;
  private enabled = false;

  constructor() {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION || "us-east-1";
    const bucket = process.env.S3_BUCKET;
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;
    const publicUrl = process.env.S3_PUBLIC_URL || endpoint;

    if (endpoint && bucket && accessKeyId && secretAccessKey) {
      this.s3 = new S3Client({
        endpoint,
        region,
        forcePathStyle: true,
        credentials: { accessKeyId, secretAccessKey }
      });
      this.bucket = bucket;
      this.publicUrl = publicUrl;
      this.enabled = true;
    }
  }

  async save(file: Express.Multer.File, prefix: string) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${prefix}/${randomUUID()}-${safeName}`;

    if (this.enabled && this.s3 && this.bucket && this.publicUrl) {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        })
      );
      const base = this.publicUrl.replace(/\/$/, "");
      const url = `${base}/${key}`;
      return { url, key };
    }

    if (process.env.NODE_ENV === "production") {
      throw new Error("Persistent S3-compatible storage is required for uploads in production");
    }

    const filePath = path.join(process.cwd(), "apps/api/uploads", key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    return { url: `/uploads/${key}`, key };
  }
}
