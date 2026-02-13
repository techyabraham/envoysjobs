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
      passwordHash: adminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: "ADMIN",
      stewardStatus: null,
      stewardDepartment: null,
      stewardMatricNumber: null
    },
    create: {
      email: "admin@envoysjobs.com",
      passwordHash: adminPassword,
      firstName: "Super",
      lastName: "Admin",
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
    update: {
      envoyId: admin.id,
      title: "Community Business Support Services",
      description: "Business setup support, customer service optimization, and delivery systems for growing brands.",
      rate: "₦30,000 - ₦150,000/project",
      status: "ACTIVE",
      contactMethods: ["PLATFORM", "WHATSAPP"],
      contactWhatsapp: "08030000000"
    },
    create: {
      id: "seed-service",
      envoyId: admin.id,
      title: "Community Business Support Services",
      description: "Business setup support, customer service optimization, and delivery systems for growing brands.",
      rate: "₦30,000 - ₦150,000/project",
      status: "ACTIVE",
      contactMethods: ["PLATFORM", "WHATSAPP"],
      contactWhatsapp: "08030000000"
    }
  });

  await prisma.service.upsert({
    where: { id: "seed-service-2" },
    update: {
      envoyId: admin.id,
      title: "Event Planning & Coordination",
      description: "Planning, vendor coordination, and on-site execution for private and community events.",
      rate: "₦40,000 - ₦200,000/event",
      status: "ACTIVE",
      contactMethods: ["PLATFORM"]
    },
    create: {
      id: "seed-service-2",
      envoyId: admin.id,
      title: "Event Planning & Coordination",
      description: "Planning, vendor coordination, and on-site execution for private and community events.",
      rate: "₦40,000 - ₦200,000/event",
      status: "ACTIVE",
      contactMethods: ["PLATFORM"]
    }
  });

  await prisma.service.upsert({
    where: { id: "seed-service-3" },
    update: {
      envoyId: admin.id,
      title: "Digital Marketing Support",
      description: "Campaign planning, social media management, and lead generation support for SMEs.",
      rate: "₦35,000 - ₦120,000/month",
      status: "ACTIVE",
      contactMethods: ["PLATFORM", "EMAIL"],
      contactEmail: "admin@envoysjobs.com"
    },
    create: {
      id: "seed-service-3",
      envoyId: admin.id,
      title: "Digital Marketing Support",
      description: "Campaign planning, social media management, and lead generation support for SMEs.",
      rate: "₦35,000 - ₦120,000/month",
      status: "ACTIVE",
      contactMethods: ["PLATFORM", "EMAIL"],
      contactEmail: "admin@envoysjobs.com"
    }
  });

  await prisma.gig.upsert({
    where: { id: "seed-gig" },
    update: {
      title: "Event Logistics Support",
      description: "Assist with venue setup, guest coordination, and movement of event materials.",
      amount: "₦20,000",
      location: "Lagos",
      duration: "1 day",
      urgent: true,
      status: "AVAILABLE"
    },
    create: {
      id: "seed-gig",
      postedById: hirer.id,
      title: "Event Logistics Support",
      description: "Assist with venue setup, guest coordination, and movement of event materials.",
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
