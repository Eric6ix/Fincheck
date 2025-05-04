import { prisma } from "../lib/prisma.js";

// POST: http://localhost:3333/api/transactions
export const createTransaction = async (req, res) => {
  const { title, amount, type, categoryId } = req.body;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.create({
      data: { title, amount: parseFloat(amount), type, userId, categoryId },
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar transação" });
  }
};

// GET: http://localhost:3333/api/transactions
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
    console.log(error);
  }
};

// PUT: http://localhost:3333/api/transactions/:id
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { title, amount, type, categoryId } = req.body;
  const userId = req.user.userId;

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!title || !amount || !type) {
      return res
        .status(400)
        .json({ error: "Preencha todos os campos obrigatórios." });
    }

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ error: "Tipo de transação inválido." });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, amount: parseFloat(amount), type, categoryId },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
};

// DELETE: http://localhost:3333/api/transactions/:id
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Transação não encontrada" });
    }

    await prisma.transaction.delete({ where: { id } });
    res.json("Deletado com sucesso!");
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
