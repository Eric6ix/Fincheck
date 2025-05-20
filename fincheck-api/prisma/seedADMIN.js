import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  const seed = await prisma.user.upsert({
    where: { email: "larasy@gmail.com" },
    update: {},
    create: {
      name: "Lara",
      email: "larasy@gmail.com",
      password: hashedPassword,
      wallet: 1000.0,
      role: "ADMIN",
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
