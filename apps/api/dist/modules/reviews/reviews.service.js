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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
let ReviewsService = class ReviewsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(data) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.review.create({ data });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.review.create({ data }).catch(() => {
            const review = {
                id: (0, memory_store_1.createId)(),
                ...data,
                createdAt: new Date()
            };
            memory_store_1.memoryStore.reviews.push(review);
            return review;
        });
    }
    list(revieweeId) {
        if (!(0, memory_store_1.useMemory)()) {
            return this.prisma.review.findMany({ where: { revieweeId } });
        }
        (0, memory_store_1.seedMemory)();
        return this.prisma.review.findMany({ where: { revieweeId } }).catch(() => {
            return memory_store_1.memoryStore.reviews.filter((r) => r.revieweeId === revieweeId);
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
