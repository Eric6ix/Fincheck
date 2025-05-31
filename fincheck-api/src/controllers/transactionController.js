import { prisma } from "../lib/prisma.js";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import { hasSufficientBalance, adjustWallet } from "./userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const createTransaction = async (req, res) => {
  authMiddleware(req, res, () => {});
  const userId = req.user.userId
  const { title, amount, type, categoryType } = req.body;

  if (!title || !amount || !type || !categoryType) {
    return res.status(400).json({ error: "Fill in all mandatory fields." });
  }

  try {

    if (type === "Outlet"){ 
      const canSpend = await hasSufficientBalance(userId, amount);
      if (!canSpend){ 
        return res.status(400).json({ error: "Insufficient balance" });
      }
    }


    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        categoryType: categoryType,
        userId: req.user.userId,
      },
    });
    await adjustWallet(req.user.userId, amount, type);

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating transaction" });
  }
};

// GET: /api/transactions?month=05&year=2025&type=entry&categoryType=Salary
export const getTransactions = async (req, res) => {
  authMiddleware(req, res, () => {});
  const userId = req.user.userId;
  const { month, year, type, categoryType, startDate, endDate } = req.query;

  try {
    const filter = { userId };

    // Filtro por tipo (entry / outlet)
    if (type) {
      filter.type = type;
    }

    // Filtro por categoria (usando enum direto)
    if (categoryType) {
      filter.categoryType = categoryType;
    }

    // Filtro por mês e ano (exclusivo)
    if (month && year) {
      const start = new Date(`${year}-${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      filter.createdAt = {
        gte: start,
        lt: end,
      };
    }

    // Filtro por intervalo de datas (substitui o filtro anterior se ambos forem enviados)
    if (startDate && endDate) {
      filter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar transações com filtros" });
  }
};

// PUT: http://localhost:3333/api/transactions/:id
export const updateTransaction = async (req, res) => {
  authMiddleware(req, res, () => {});

  const { id } = req.params;
  const userId = req.user.userId;
  const { title, amount, type, categoryType } = req.body;

  try {
    const original = await prisma.transaction.findUnique({ where: { id } });
    if (!original || original.userId !== userId) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    // Reverte a transação antiga
    await adjustWallet(
      original.userId,
      original.amount,
      original.type,
    );

    // Verifica se pode aplicar a nova
    if (type === "Outlet") {
      const canSpend = await hasSufficientBalance(userId, amount);
      if (!canSpend) {
        // Reaplica a transação original para não deixar o wallet errado
        await adjustWallet(
          userId,
          original.amount,
          original.type === "Entry" ? "add" : "subtract"
        );
        return res.status(400).json({ error: "Insufficient balance" });
      }
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        title,
        amount: parseFloat(amount),
        type,
        categoryType,
      },
    });

    // Aplica a nova transação
    await adjustWallet(userId, amount, type);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating transaction" });
  }
};

// DELETE: http://localhost:3333/api/transactions/:id
export const deleteTransaction = async (req, res) => {
  authMiddleware(req, res, () => {});
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await prisma.transaction.delete({ where: { id } });

    // Reverte o impacto no wallet
    await adjustWallet(
      userId,
      transaction.amount,
      transaction.type,
    );

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting transaction" });
  }
};

export const getSummary = async (req, res) => {
  authMiddleware(req, res, () => {});
  const userId = req.user.userId;

  try {
    const [entrySum, outletSum] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "Entry" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "Outlet" },
      }),
    ]);

    const entryTotal = entrySum._sum.amount || 0;
    const outletTotal = outletSum._sum.amount || 0;
    const wallet = entryTotal - outletTotal;

    res.json({
      entry: entryTotal,
      outlet: outletTotal,
      wallet,
    });
  } catch (error) {
    console.error("[getSummary]", error);
    res.status(500).json({ error: "Error generating summary" });
  }
};


export const exportTransactionsPDF = async (req, res) => {
  const userId = req.user.userId;
  const name = req.user.name;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId, name },
      include: { categoryType: true },
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
        .text(`Tipo: ${tx.type === "entry" ? "Entrada" : "Saída"}`)
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
      include: { categoryType: true },
      orderBy: { createdAt: "desc" },
    });

    const csvData = transactions.map((tx) => ({
      Título: tx.title,
      Valor: tx.amount.toFixed(2),
      Tipo: tx.type === "Entry" ? "Entrada" : "Saída",
      Categoria: tx.categoryType?.name || "Sem categoria",
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
