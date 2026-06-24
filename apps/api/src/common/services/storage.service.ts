import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Readable } from "stream";
import { randomUUID, createHash } from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface UploadedObject {
  key: string;
  hash: string;
  size: number;
  mimeType: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>("MINIO_ENDPOINT");
    const accessKey = this.config.get<string>("MINIO_ACCESS_KEY");
    const secretKey = this.config.get<string>("MINIO_SECRET_KEY");
    this.bucket = this.config.get<string>("MINIO_BUCKET") ?? "legal-recovery";
    const useSsl = this.config.get<string>("MINIO_USE_SSL") === "true";
    this.region = this.config.get<string>("MINIO_REGION") ?? "us-east-1";

    this.client = new S3Client({
      endpoint: endpoint
        ? `${useSsl ? "https" : "http"}://${endpoint}`
        : undefined,
      region: this.region,
      credentials:
        accessKey && secretKey
          ? { accessKeyId: accessKey, secretAccessKey: secretKey }
          : undefined,
      forcePathStyle: true,
    });
  }

  async onModuleInit(): Promise<void> {
    // Best-effort bucket provisioning. We must NOT block application startup
    // if MinIO/S3 is unavailable (e.g. local dev without the container running);
    // the first upload will surface a clear error instead.
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Storage bucket '${this.bucket}' is available`);
    } catch (err: unknown) {
      const code = (err as { name?: string })?.name;
      // Bucket does not exist -> try to create it.
      if (code === "NotFound" || code === "NoSuchBucket") {
        try {
          await this.client.send(
            new CreateBucketCommand({ Bucket: this.bucket }),
          );
          this.logger.warn(
            `Storage bucket '${this.bucket}' was missing and has been created`,
          );
        } catch (createErr: unknown) {
          this.logger.warn(
            `Could not create storage bucket '${this.bucket}': ${(createErr as Error)?.message ?? createErr}`,
          );
        }
      } else {
        this.logger.warn(
          `Storage backend unreachable at init: ${(err as Error)?.message ?? err}. Uploads will fail until it is available.`,
        );
      }
    }
  }

  /**
   * Build a content-addressed, tenant-scoped object key.
   * Layout: `{prefix}/{uuid}/{safe-filename}` keeps objects isolated per case
   * and avoids collisions / path traversal via the original filename.
   */
  buildKey(prefix: string, filename: string): string {
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 128);
    return `${prefix}/${randomUUID()}/${safe || "file"}`;
  }

  /** SHA-256 of a buffer, hex-encoded — used for integrity / dedupe checks. */
  static sha256(buffer: Buffer): string {
    return createHash("sha256").update(buffer).digest("hex");
  }

  async put(
    key: string,
    body: Buffer,
    mimeType: string,
  ): Promise<UploadedObject> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: mimeType,
      }),
    );
    return {
      key,
      hash: StorageService.sha256(body),
      size: body.byteLength,
      mimeType,
    };
  }

  async get(key: string): Promise<Buffer> {
    const res = await this.client.send(
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    const stream = res.Body as Readable;
    if (!stream) {
      throw new Error(`Storage object '${key}' has no body`);
    }
    return streamToBuffer(stream);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  /** Short-lived presigned GET URL for client-side download. */
  async getDownloadUrl(key: string, expiresIn = 300): Promise<string> {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn },
    );
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
