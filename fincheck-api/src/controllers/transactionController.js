import { prisma } from "../lib/prisma.js";
import PDFDocument from "pdfkit";
import { Parser } from "json2csv";

// POST: http://localhost:3333/api/transactions
export const createTransaction = async (req, res) => {
  const { title, amount, type, categoryType } = req.body;
  const userId = req.user.userId;

  if (!title || !amount || !type || !categoryType) {
    return res.status(400).json({ error: "Fill in all mandatory fields." });
  }

  try {

    if (type === "Outlet") {
      const currentBalance = await getSummary(userId);
      if (currentBalance < parseFloat(amount)) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
    }
    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        categoryType: categoryType,
        userId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating transaction" });
  }
};

// GET: /api/transactions?month=05&year=2025&type=entry&categoryType=Salary
export const getTransactions = async (req, res) => {
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
  const { id } = req.params;
  const userId = req.user.userId;
  const walletUser = req.user;
  const { title, amount, type, categoryType } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is mandatory" });
  }

  if (!title || !amount || !type || !categoryType) {
    return res.status(400).json({ error: "Fill in all mandatory fields." });
  }

  try {
    const existing = await prisma.transaction.findUnique({ where: { id } });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Transaction unintegrated" });
    }

    if (type === "outlet" && parseFloat(walletUser) < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { title, amount: parseFloat(amount), type, categoryType },
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

  try {
    const [entry, outlet] = await Promise.all([
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "Entry" },
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { userId, type: "Outlet" },
      }),
    ]);

    const entryTotal = entry._sum.amount || 0;
    const outletTotal = outlet._sum.amount || 0;
    const wallet = entryTotal - outletTotal;

    res.json({
      entry: entryTotal,
      outlet: outletTotal,
      wallet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating summary" });
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
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // Mapeia os dados no formato que será exportado
    const csvData = transactions.map((tx) => ({
      Título: tx.title,
      Valor: tx.amount.toFixed(2),
      Tipo: tx.type === "entry" ? "Entrada" : "Saída",
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
