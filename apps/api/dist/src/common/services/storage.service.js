"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = StorageService_1 = class StorageService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(StorageService_1.name);
        const endpoint = this.config.get("MINIO_ENDPOINT");
        const accessKey = this.config.get("MINIO_ACCESS_KEY");
        const secretKey = this.config.get("MINIO_SECRET_KEY");
        this.bucket = this.config.get("MINIO_BUCKET") ?? "legal-recovery";
        const useSsl = this.config.get("MINIO_USE_SSL") === "true";
        this.region = this.config.get("MINIO_REGION") ?? "us-east-1";
        this.client = new client_s3_1.S3Client({
            endpoint: endpoint
                ? `${useSsl ? "https" : "http"}://${endpoint}`
                : undefined,
            region: this.region,
            credentials: accessKey && secretKey
                ? { accessKeyId: accessKey, secretAccessKey: secretKey }
                : undefined,
            forcePathStyle: true,
        });
    }
    async onModuleInit() {
        try {
            await this.client.send(new client_s3_1.HeadBucketCommand({ Bucket: this.bucket }));
            this.logger.log(`Storage bucket '${this.bucket}' is available`);
        }
        catch (err) {
            const code = err?.name;
            if (code === "NotFound" || code === "NoSuchBucket") {
                try {
                    await this.client.send(new client_s3_1.CreateBucketCommand({ Bucket: this.bucket }));
                    this.logger.warn(`Storage bucket '${this.bucket}' was missing and has been created`);
                }
                catch (createErr) {
                    this.logger.warn(`Could not create storage bucket '${this.bucket}': ${createErr?.message ?? createErr}`);
                }
            }
            else {
                this.logger.warn(`Storage backend unreachable at init: ${err?.message ?? err}. Uploads will fail until it is available.`);
            }
        }
    }
    buildKey(prefix, filename) {
        const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 128);
        return `${prefix}/${(0, crypto_1.randomUUID)()}/${safe || "file"}`;
    }
    static sha256(buffer) {
        return (0, crypto_1.createHash)("sha256").update(buffer).digest("hex");
    }
    async put(key, body, mimeType) {
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: body,
            ContentType: mimeType,
        }));
        return {
            key,
            hash: StorageService_1.sha256(body),
            size: body.byteLength,
            mimeType,
        };
    }
    async get(key) {
        const res = await this.client.send(new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key }));
        const stream = res.Body;
        if (!stream) {
            throw new Error(`Storage object '${key}' has no body`);
        }
        return streamToBuffer(stream);
    }
    async delete(key) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
    async getDownloadUrl(key, expiresIn = 300) {
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key }), { expiresIn });
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
}
//# sourceMappingURL=storage.service.js.map