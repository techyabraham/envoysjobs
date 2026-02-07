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
exports.AutoMessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const memory_store_1 = require("../../common/memory.store");
const templates = [
    {
        key: "honour",
        text: "I honour you",
        audience: "BOTH",
        quickReplies: ["you are amazing", "Thank you, I appreciate it", "Grateful for the opportunity"],
        triggerRules: { exactMatch: "I honour you" }
    },
    {
        key: "interest",
        text: "Hello, I’m interested in this opportunity",
        audience: "BOTH",
        quickReplies: ["May we discuss the details?"],
        triggerRules: {}
    },
    {
        key: "thanks",
        text: "Thank you for reaching out",
        audience: "BOTH",
        quickReplies: ["I’m available to proceed"],
        triggerRules: {}
    },
    {
        key: "available",
        text: "I’m available to proceed",
        audience: "BOTH",
        quickReplies: ["Looking forward to working together"],
        triggerRules: {}
    },
    {
        key: "details",
        text: "May we discuss the details?",
        audience: "BOTH",
        quickReplies: ["Thank you, I appreciate it"],
        triggerRules: {}
    },
    {
        key: "looking-forward",
        text: "Looking forward to working together",
        audience: "BOTH",
        quickReplies: [],
        triggerRules: {}
    }
];
let AutoMessagesService = class AutoMessagesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    list() {
        (0, memory_store_1.seedMemory)();
        if (!(0, memory_store_1.useMemory)())
            return this.prisma.autoMessageTemplate.findMany();
        return this.prisma.autoMessageTemplate.findMany().catch(() => templates);
    }
    async seed() {
        if (!(0, memory_store_1.useMemory)()) {
            await this.prisma.autoMessageTemplate.deleteMany();
            return this.prisma.autoMessageTemplate.createMany({ data: templates });
        }
        return this.prisma.autoMessageTemplate
            .deleteMany()
            .then(() => this.prisma.autoMessageTemplate.createMany({ data: templates }))
            .catch(() => ({ count: templates.length }));
    }
};
exports.AutoMessagesService = AutoMessagesService;
exports.AutoMessagesService = AutoMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AutoMessagesService);
