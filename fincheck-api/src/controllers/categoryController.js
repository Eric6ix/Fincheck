import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCategory = async (req, res) => {
  const { name, transactions, user, userId} = req.body;
  // const userId = req.user.userId;

  try {
    const category = await prisma.category.create({
      data: { name, transactions, user, userId },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar Categoria" });
  }
};

export const getTransactions = async (req, res) => {
  const userId = req.user.userId;
  const { month, year, type } = req.query;

  try {
    // Base do filtro
    const filter = {
      userId,
    };

    // Filtro por tipo (income ou expense)
    if (type) {
      filter.type = type;
    }

    // Filtro por mês e ano
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar transações com filtros" });
  }
};

export const updateTransaction = async (req, res) => {
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
      data: { title, amount: parseFloat(amount), type },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
};

export const deleteTransaction = async (req, res) => {
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

export const getSummary = async (req, res) => {
  const userId = req.user.userId;
  const { month, year } = req.query;

  try {
    let dateFilter = { userId };

    // Se mês e ano forem fornecidos, aplica filtro de data
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      dateFilter.createdAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { ...dateFilter, type: "income" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { ...dateFilter, type: "expense" },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular resumo financeiro" });
  }
};
