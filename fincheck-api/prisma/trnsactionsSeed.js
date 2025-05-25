import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Bills",
  "Investment",
  "Others",
];

const titles = {
  entry: ["Freelance Job", "Bonus", "Salary", "Investment Return", "Gift"],
  outlet: ["Groceries", "Bus Ticket", "Netflix", "Pharmacy", "Online Shopping"],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomAmount = () => Number((Math.random() * 1000 + 50).toFixed(2));

const generateDateInPast30Days = () => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  today.setDate(today.getDate() - daysAgo);
  return today;
};

async function main() {
  console.log("🌱 Seeding FinCheck...");

  // Cria usuário fake (ou usa existente)
  const password = await bcrypt.hash("123456", 10);
  const user = await prisma.user.upsert({
    where: { email: "zenkai@gmail.com" },
    update: {},
    create: {
      name: "ZenkaiDEV",
      email: "zenkai@gmail.com",
      password: hashedPassword,
      role: "DEV",
    },
  });

  // Cria 30 transações aleatórias
  for (let i = 0; i < 30; i++) {
    const type = Math.random() > 0.4 ? "entry" : "outlet"; // mais entradas
    const categoryType = getRandom(categories);
    const amount = randomAmount();
    const title = getRandom(titles[type]);
    const createdAt = generateDateInPast30Days();

    await prisma.transaction.create({
      data: {
        title,
        amount,
        type,
        categoryType,
        userId: user.id,
        createdAt,
      },
    });
  }

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
