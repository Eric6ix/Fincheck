import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middlewares/authMiddleware.js";
// ######  USER CONTROLLER FUNCTIONS   #####
// GET: http://localhost:3333/api/user
export const getUser = async (req, res) => {

  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" }, 
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
    console.log(error);
  }
};

// PUT: http://localhost:3333/api/user/:id
export const updateUser = async (req, res) => {
  const decoded = authMiddleware(req, res);
  req.user = decoded;
  const { id } = req.params;
  const { name, password, role, wallet } = req.body;

  if(!id ){
    return res.status(400).json({ error: "ID do usuário é obrigatório" });
  }
  if (!name && !password && !role && !wallet) {
    return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Prepara os dados a serem atualizados
    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (role && ["ADMIN", "user", "DEV"].includes(role))dataToUpdate.role = role;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const updateRoleUser = async (req, res) => {

  const { id } = req.params;
  const role = req.body;

  if (!id) {
    return res.status(400).json({ error: "ID do usuário é obrigatório" });
  }
  // if (!role || !["ADMIN", "DEV"].includes(role)) {
  //   console.log(role);
  //   return res.status(400).json({ error: "Papel inválido" });
  // }

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar papel do usuário" });
  }
}

// DELETE: http://localhost:3333/api/transactions/:id
export const deleteUser = async (req, res) => {
 const decoded = authMiddleware(req, res);
  req.user = decoded;
  const { id } = req.params;
  const userId = req.user.userId;

  if (!id) {
    return res.status(400).json({ error: "ID da transação é obrigatório" });
  }

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await prisma.transaction.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar transação" });
  }
};


// ######  WALLET USERS FUNCTIOS   #####


// Retorna o saldo atual do usuário
export const getWallet = async (req, res) => {
  const token = req.header("Authorization");
  
  if (!token) return res.status(401).json({ error: "Acesso negado!" });
  const decoded = authMiddleware(req, res, token);
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
