import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123123", 10);

  const seed = await prisma.user.upsert({
    where: { email: "erica@gmail.com" },
    update: {},
    create: {
      name: "Erica",
      email: "erica@gmail.com",
      password: hashedPassword,
      role: "user",
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
