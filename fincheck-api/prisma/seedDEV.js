import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  const seed = await prisma.user.upsert({
    where: { email: "zenkai@gmail.com" },
    update: {},
    create: {
      name: "ZenkaiDEV",
      email: "zenkai@gmail.com",
      password: hashedPassword,
      wallet: 1000.0,
      role: "DEV",
    },
  });

  console.log("criado:", seed);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
