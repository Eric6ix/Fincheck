-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Salary', 'Food', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Education', 'Bills', 'Investment', 'Others');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Entry', 'Outlet');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'ADMIN', 'DEV');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "wallet" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "role" "UserRole" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'Entry',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "categoryType" "Category" NOT NULL DEFAULT 'Others',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
