import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.OWNER_EMAIL ?? "owner@example.com";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "password123";
  const ownerName = process.env.OWNER_NAME ?? "Business Owner";

  const passwordHash = await bcrypt.hash(ownerPassword, 10);

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      name: ownerName,
      passwordHash,
      role: UserRole.OWNER,
    },
    create: {
      email: ownerEmail,
      name: ownerName,
      passwordHash,
      role: UserRole.OWNER,
    },
  });

  const branch = await prisma.branch.findFirst({ where: { isActive: true } });
  if (!branch) {
    await prisma.branch.create({
      data: {
        name: "Main Branch",
        address: "",
        timezone: "UTC",
        isActive: true,
      },
    });
  }

  const existingSettings = await prisma.setting.findFirst({
    where: { ownerUserId: owner.id },
  });

  if (!existingSettings) {
    await prisma.setting.create({
      data: {
        ownerUserId: owner.id,
        businessName: "My Business",
        businessAddress: "",
        phone: "",
        email: ownerEmail,
        currency: "USD",
        defaultTaxRate: 0,
        receiptFooter: "Thank you for your business",
      },
    });
  }

  console.log("Seed completed.");
  console.log(`Owner login: ${ownerEmail}`);
  console.log(`Owner password: ${ownerPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
