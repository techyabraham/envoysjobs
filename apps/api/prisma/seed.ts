import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const envoyPassword = await bcrypt.hash("envoy1234", 10);
  const hirerPassword = await bcrypt.hash("hirer1234", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@envoysjobs.com" },
    update: {
      stewardStatus: null,
      stewardDepartment: null,
      stewardMatricNumber: null
    },
    create: {
      email: "admin@envoysjobs.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      stewardStatus: null
    }
  });

  const envoy = await prisma.user.upsert({
    where: { email: "envoy@envoysjobs.com" },
    update: {
      stewardStatus: "PENDING",
      stewardDepartment: "MEDIA",
      stewardMatricNumber: "RCCG-001"
    },
    create: {
      email: "envoy@envoysjobs.com",
      passwordHash: envoyPassword,
      firstName: "Grace",
      lastName: "Nwosu",
      role: "ENVOY",
      stewardStatus: "PENDING",
      stewardDepartment: "MEDIA",
      stewardMatricNumber: "RCCG-001"
    }
  });

  const hirer = await prisma.user.upsert({
    where: { email: "hirer@envoysjobs.com" },
    update: {
      stewardStatus: null,
      stewardDepartment: null,
      stewardMatricNumber: null
    },
    create: {
      email: "hirer@envoysjobs.com",
      passwordHash: hirerPassword,
      firstName: "Daniel",
      lastName: "Okoro",
      role: "HIRER",
      stewardStatus: null
    }
  });

  await prisma.envoyProfile.upsert({
    where: { userId: envoy.id },
    update: {},
    create: {
      userId: envoy.id,
      bio: "Content writer focused on community impact.",
      location: "Lagos",
      availability: "Full-time"
    }
  });

  await prisma.hirerProfile.upsert({
    where: { userId: hirer.id },
    update: {},
    create: {
      userId: hirer.id,
      type: "BUSINESS",
      businessName: "Tech Solutions Ltd"
    }
  });

  const job = await prisma.job.create({
    data: {
      title: "Senior Software Engineer",
      description: "Build trusted community platforms.",
      locationType: "ONSITE",
      location: "Lagos",
      salaryMin: 500000,
      salaryMax: 800000,
      urgency: "High",
      status: "PUBLISHED",
      hirerId: hirer.id
    }
  });

  await prisma.application.create({
    data: {
      jobId: job.id,
      envoyId: envoy.id,
      status: "APPLIED"
    }
  });

  const convo = await prisma.conversation.create({
    data: {
      jobId: job.id,
      participants: {
        create: [{ userId: envoy.id }, { userId: hirer.id }]
      }
    }
  });

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderId: hirer.id,
      text: "I honour you"
    }
  });

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
      text: "Hello, I'm interested in this opportunity",
      audience: "BOTH",
      quickReplies: ["May we discuss the details?"],
      triggerRules: {}
    },
    {
      key: "thanks",
      text: "Thank you for reaching out",
      audience: "BOTH",
      quickReplies: ["I'm available to proceed"],
      triggerRules: {}
    },
    {
      key: "available",
      text: "I'm available to proceed",
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

  for (const template of templates) {
    await prisma.autoMessageTemplate.upsert({
      where: { key: template.key },
      update: {
        text: template.text,
        audience: template.audience,
        quickReplies: template.quickReplies,
        triggerRules: template.triggerRules
      },
      create: template
    });
  }

  await prisma.notification.create({
    data: {
      userId: envoy.id,
      title: "Welcome",
      body: "You are amazing. Welcome to EnvoysJobs."
    }
  });

  await prisma.service.upsert({
    where: { id: "seed-service" },
    update: {},
    create: {
      id: "seed-service",
      envoyId: envoy.id,
      title: "Content Strategy & Copywriting",
      description: "End-to-end content planning and copywriting for ministries and community initiatives.",
      rate: "₦30,000 - ₦120,000/project",
      status: "ACTIVE"
    }
  });

  await prisma.gig.upsert({
    where: { id: "seed-gig" },
    update: {},
    create: {
      id: "seed-gig",
      postedById: hirer.id,
      title: "Event Logistics Support",
      amount: "₦20,000",
      location: "Lagos",
      duration: "1 day",
      urgent: true,
      status: "AVAILABLE"
    }
  });
  await prisma.adminAuditLog.create({
    data: {
      adminId: admin.id,
      action: "Seeded database"
    }
  });

  await prisma.user.updateMany({
    where: {
      stewardDepartment: null,
      stewardMatricNumber: null
    },
    data: {
      stewardStatus: null
    }
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
