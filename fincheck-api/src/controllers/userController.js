import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

// GET: http://localhost:3333/api/user
export const getUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" }, // ordenando por nome só pra deixar mais organizado
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
    console.log(error);
  }
};


// PUT: http://localhost:3333/api/user/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, role } = req.body;
  const requesterId = req.user.userId;
  const requesterRole = req.user.role;

  try {
    const existing = await prisma.user.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Prepara os dados a serem atualizados
    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (role && ["ADMIN", "user", "DEV"].includes(role))
      dataToUpdate.role = role;
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

// DELETE: http://localhost:3333/api/transactions/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

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
