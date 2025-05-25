import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  const seedADMIN = await prisma.user.upsert({
    where: { email: "larasy@gmail.com" },
    update: {},
    create: {
      name: "Lara",
      email: "larasy@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

   const seedUser = await prisma.user.upsert({
    where: { email: "erica@gmail.com" },
    update: {},
    create: {
      name: "Erica",
      email: "erica@gmail.com",
      password: hashedPassword,
      role: "user",
    },
  });

   const seedDEV = await prisma.user.upsert({
    where: { email: "zenkai@gmail.com" },
    update: {},
    create: {
      name: "ZenkaiDEV",
      email: "zenkai@gmail.com",
      password: hashedPassword,
      role: "DEV",
    },
  });
  console.log("criado:", seedDEV, seedADMIN, seedUser);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
