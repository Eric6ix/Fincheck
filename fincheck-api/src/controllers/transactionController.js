import { prisma } from "../lib/prisma.js";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";

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

// // GET: http://localhost:3333/api/transactions
// export const getTransactions = async (req, res) => {
//   const userId = req.user.userId;
//   const { month, year, type, categoryId, startDate, endDate } = req.query;

//   try {
//     const filter = { userId };

//     if (type) {
//       filter.type = type;
//     }

//     // Filtro por mês e ano (caso você continue usando)
//     if (month && year) {
//       const start = new Date(`${year}-${month}-01`);
//       const end = new Date(start);
//       end.setMonth(end.getMonth() + 1);

//       filter.createdAt = {
//         gte: start,
//         lt: end,
//       };
//     }

//     // Filtro por intervalo de datas (caso venha do frontend)
//     if (startDate && endDate) {
//       filter.createdAt = {
//         gte: new Date(startDate),
//         lte: new Date(endDate),
//       };
//     }

//     // 🆕 Filtro por categoria
//     if (categoryId) {
//       filter.categoryId = categoryId;
//     }

//     const transactions = await prisma.transaction.findMany({
//       where: filter,
//       orderBy: { createdAt: "desc" },
//       include: { category: true }, // caso queira exibir a categoria
//     });

//     res.json(transactions);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erro ao buscar transações com filtros" });
//   }
// };

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

// GET: /api/transactions?startDate=2024-01-01&endDate=2024-01-31&categoryId=abc123
export const getAllTransactions = async (req, res) => {
  const userId = req.user.userId;
  const { startDate, endDate, categoryId } = req.query;

  try {
    const where = {
      userId,
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      ...(categoryId && { categoryId }),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar transações" });
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

export const exportTransactionsPDF = async (req, res) => {
  const userId = req.user.userId;
  const name = req.user.name;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId, name },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=transacoes.pdf");
    doc.pipe(res);

    doc.fontSize(16).text("Relatório de Transações", { align: "center" });
    doc.moveDown();

    transactions.forEach((tx) => {
      doc
        .fontSize(12)
        .text(`Título: ${tx.title}`)
        .text(`Nome: ${tx.name}`)
        .text(`Valor: R$ ${tx.amount.toFixed(2)}`)
        .text(`Tipo: ${tx.type === "income" ? "Entrada" : "Saída"}`)
        .text(`Categoria: ${tx.category?.name || "Sem categoria"}`)
        .text(`Data: ${new Date(tx.createdAt).toLocaleDateString()}`)
        .moveDown();
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar PDF" });
  }
};

export const exportTransactionsCSV = async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // Mapeia os dados no formato que será exportado
    const csvData = transactions.map((tx) => ({
      Título: tx.title,
      Valor: tx.amount.toFixed(2),
      Tipo: tx.type === "income" ? "Entrada" : "Saída",
      Categoria: tx.category?.name || "Sem categoria",
      Data: new Date(tx.createdAt).toLocaleDateString("pt-BR"),
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transacoes.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar CSV" });
  }
};
