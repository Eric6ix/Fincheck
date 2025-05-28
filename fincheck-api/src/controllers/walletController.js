import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Retorna o saldo atual do usuário
export const getWallet = async (req, res) => {
  const token = req.header("Authorization");
  
  if (!token) return res.status(401).json({ error: "Acesso negado!" });
  const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

  req.user = decoded;
  
  try {
    const userEmail = req.user.userEmail;
    // Verifica se o usuário está autenticado
    if (!userEmail) {
      return res.status(401).json({ error: "not authenticated" });
    }
    // Busca o usuário e seleciona apenas o campo wallet
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { wallet: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ wallet: user.wallet });
  } catch (error) {

    res.status(500).json({ error: "Error getting wallet balance" });
  }
};

// Ajusta o wallet do usuário (add ou subtract)
export const adjustWallet = async (userId, amount, type) => {
  const value = parseFloat(amount);

  if (isNaN(value)) {
    throw new Error("Invalid amount");
  }
let operation;

if (type === "Entry") {
  operation = "add";
} else if (type === "Outlet") {
  operation = "subtract";
} else {
  throw new Error("Invalid transaction type");
}

  // Atualiza a carteira do usuário
  await prisma.user.update({
    where: { id: userId },
    data: {
      wallet: operation === "add"
        ? { increment: value }
        : { decrement: value },
    },
  });
};

// Verifica se o usuário tem saldo suficiente
export const hasSufficientBalance = async (userId, amount) => {
  const user = await prisma.user.findUnique({
    where: { id: userId},
    select: { wallet: true },
  });

  return user.wallet >= parseFloat(amount);
};