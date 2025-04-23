import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// GET: http://localhost:3333/api/user
export const getUser = async (req, res) => {
  
  try {
    const user = await prisma.user.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar Usuários" });
    console.log(error)
  }
};

// PUT: http://localhost:3333/api/transactions/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { title, amount, type } = req.body;
  const userId = req.user.userId;

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, amount: parseFloat(amount), type, categoryId},
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar transação" });
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
}