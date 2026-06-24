import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
export interface UploadedObject {
    key: string;
    hash: string;
    size: number;
    mimeType: string;
}
export declare class StorageService implements OnModuleInit {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly bucket;
    private readonly region;
    constructor(config: ConfigService);
    onModuleInit(): Promise<void>;
    buildKey(prefix: string, filename: string): string;
    static sha256(buffer: Buffer): string;
    put(key: string, body: Buffer, mimeType: string): Promise<UploadedObject>;
    get(key: string): Promise<Buffer>;
    delete(key: string): Promise<void>;
    getDownloadUrl(key: string, expiresIn?: number): Promise<string>;
}
