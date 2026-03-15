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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
let StorageService = class StorageService {
    constructor() {
        this.enabled = false;
        const endpoint = process.env.S3_ENDPOINT;
        const region = process.env.S3_REGION || "us-east-1";
        const bucket = process.env.S3_BUCKET;
        const accessKeyId = process.env.S3_ACCESS_KEY;
        const secretAccessKey = process.env.S3_SECRET_KEY;
        const publicUrl = process.env.S3_PUBLIC_URL || endpoint;
        if (endpoint && bucket && accessKeyId && secretAccessKey) {
            this.s3 = new client_s3_1.S3Client({
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
    async save(file, prefix) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `${prefix}/${(0, crypto_1.randomUUID)()}-${safeName}`;
        if (this.enabled && this.s3 && this.bucket && this.publicUrl) {
            await this.s3.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            }));
            const base = this.publicUrl.replace(/\/$/, "");
            const url = `${base}/${this.bucket}/${key}`;
            return { url, key };
        }
        const uploadsDir = path_1.default.join(process.cwd(), "apps/api/uploads", prefix);
        await fs_1.promises.mkdir(uploadsDir, { recursive: true });
        const filePath = path_1.default.join(uploadsDir, safeName);
        await fs_1.promises.writeFile(filePath, file.buffer);
        return { url: `/uploads/${prefix}/${safeName}`, key };
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
