import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { seedMemory, useMemory } from "../../common/memory.store";

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

@Injectable()
export class AutoMessagesService {
  constructor(private prisma: PrismaService) {}

  list() {
    seedMemory();
    if (!useMemory()) return this.prisma.autoMessageTemplate.findMany();
    return this.prisma.autoMessageTemplate.findMany().catch(() => templates);
  }

  async seed() {
    if (!useMemory()) {
      await this.prisma.autoMessageTemplate.deleteMany();
      return this.prisma.autoMessageTemplate.createMany({ data: templates });
    }
    return this.prisma.autoMessageTemplate
      .deleteMany()
      .then(() => this.prisma.autoMessageTemplate.createMany({ data: templates }))
      .catch(() => ({ count: templates.length }));
  }
}