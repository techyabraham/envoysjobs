import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 16) {
    throw new Error("Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters.");
  }
  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (existingAdmin) throw new Error("An admin account already exists; bootstrap can only run once.");

  await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      firstName: process.env.ADMIN_FIRST_NAME || "Platform",
      lastName: process.env.ADMIN_LAST_NAME || "Admin",
      role: "ADMIN",
      stewardStatus: null
    }
  });
  console.log(`Created the initial admin account for ${email}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
